"use strict"

/**
 * Geo functions
 * See https://www.movable-type.co.uk/scripts/latlong.html as a useful reference
 * All functions accept Point instance or Point-like object, eg {"lat":51.2194,"lng":-3.8467}
 */

const Point = require ('./class-point.js').Point; // only needed for instance checking

/**
 * Uses Haversine to return distance in metres btwn 2 coordinates https://en.wikipedia.org/wiki/Haversine_formula
 * Vincenty's formula is more accurate but more expensive https://en.wikipedia.org/wiki/Vincenty's_formulae
 * @param {Point} p1 as instance of point class
 * @param {Point} p2 as instance of point class
 * @returns {number} distance between provided points in metres
 */
function p2p(p1, p2) {

  checkPoints(p1, p2);

  const lat1 = degs2rads(p1.lat);
  const lat2 = degs2rads(p2.lat);
  const lng1 = degs2rads(p1.lng);
  const lng2 = degs2rads(p2.lng);

  const dlat = lat1 - lat2;
  const dlng = lng1 - lng2;

  const a = (Math.sin(dlat/2.0) ** 2.0 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlng/2.0) ** 2.0) ** 0.5;
  const c = 2.0 * Math.asin(a);

  return c * 6378.137 * 1000.0;  

}


/**
* Distance in meters between a line (defined by p1 and p2) and a point (p3)
* @param {Point} p1 lng/lat of line start in decimal degrees as Point or Point-like
* @param {Point} p2 lng/lat of line end in decimal degrees as Point or Point-like
* @param {Point} p3 lng/lat of mid-point in decimal degrees as Point or Point-like
* @returns {number} distance in meters 
*/
function p2l(p1, p2, p3) {

  checkPoints(p1, p2, p3);

  const d13 = p2p(p1, p3) / 1000.0;
  const brg12 = bearing(p1, p2);
  const brg13 = bearing(p1, p3);

  return Math.asin( Math.sin( d13/6378.137 ) * Math.sin( brg13-brg12 ) ) * 6378.137 * 1000.0;

}


/**
 * Returns bearing in radians between two points
 * TODO: returns 0 (ie North) is two identical points are entered - does this case need to be handled?* 
 * @param {Point} p1 start point as Point or Point-like
 * @param {Point} p2 end point as Point or Point-like
 * @returns {number} bearing in RADIANS between two points 

 */
function bearing(p1, p2) {

  checkPoints(p1, p2);

  const lat1 = degs2rads(p1.lat);
  const lat2 = degs2rads(p2.lat);
  const lng1 = degs2rads(p1.lng);
  const lng2 = degs2rads(p2.lng);

	const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2)* Math.cos(lng2 - lng1)
	const y = Math.sin(lng2 - lng1) * Math.cos(lat2)

	return Math.atan2(y, x)

}


/**
 * 
 * @param {number} bearingInDegrees 
 * @returns 
 */
function bearingAsCardinal(rads) {
  if ((rads > 5.890 && rads <= 6.284) || (rads >= 0 && rads <= 0.393)) { return {from: 'South', to: 'North'}; }
  if (rads > 0.393 && rads <= 1.178) { return {from: 'SW', to: 'NE'}; }
  if (rads > 1.178 && rads <= 1.963) { return {from: 'West', to: 'East'}; }
  if (rads > 1.963 && rads <= 2.749) { return {from: 'NW', to: 'SE'}; }
  if (rads > 2.749 && rads <= 3.534) { return {from: 'North', to: 'South'}; }
  if (rads > 3.534 && rads <= 4.320) { return {from: 'NE', to: 'SW'}; } 
  if (rads > 4.320 && rads <= 5.105) { return {from: 'East', to: 'West'}; }
  if (rads > 5.105 && rads <= 5.890) { return {from: 'SE', to: 'NW'}; }
  throw new GeoFunctionsError('bearingAsCardinal will only accept input beween 0 and 2*PI');
}


/**
 * Simplify an array of Points using perpendicular distance method
 * http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.95.5882&rep=rep1&type=pdf
 * @param {Array<Point>} points array of Point instances
 * @param {number} TOLERANCE in metres, the higher the more simplified the result
 * @returns object {points, ratio} where points is the simplified path and ratio is the compression ratio
 */
function simplifyPath(points, tolerance) {

  checkIsNumber(tolerance);

  const pointsToKeep = Array.from(points, (_, i) => i);
  let pointsWereDeleted = true;

  while (pointsWereDeleted) {
    pointsWereDeleted = false;  
    for (let index = 0; index < pointsToKeep.length - 2; index++ ) {
      const distFromLine = p2l( points[pointsToKeep[index]], points[pointsToKeep[index+2]], points[pointsToKeep[index+1]] );
      if ( Math.abs(distFromLine) < tolerance ) {
        pointsToKeep.splice(index + 1, 1); 
        pointsWereDeleted = true;
      }
    }
  }

  const ratio = (pointsToKeep.length / points.length).toFixed(3) * 1;

  return {points: pointsToKeep.map( index => points[index]), ratio };

}


/**
 * Return an object containing the max/min lat/lng of the supplied points
  * @param {Point} points array of Points or Point-like objects
  * @returns object of the form { minLng: xx, minLat: xx, maxLng: xx, maxLat: xx }
  */
function boundingBox(points) {

  checkPoints();

  return points.reduce( (bbox, point) => ({ 
    minLng: Math.min(point.lng, bbox.minLng),
    maxLng: Math.max(point.lng, bbox.maxLng),
    minLat: Math.min(point.lat, bbox.minLat),
    maxLat: Math.max(point.lat, bbox.maxLat)
  }), { minLng: 180, minLat: 90, maxLng: -180, maxLat: -90 });

}


/**
 * Reduce multiple bounding boxes to a single bounding box
 * @param {Array<Object>} array of bounding box object of the form { minLng: xx, minLat: xx, maxLng: xx, maxLat: xx }
 * @returns {Object} bounding box object of the form { minLng: xx, minLat: xx, maxLng: xx, maxLat: xx }
 */
function outerBoundingBox(arrayOfBboxes) {

  checkBoundingBoxes(arrayOfBboxes);

  const points = arrayOfBboxes.reduce( (arr, box) => 
    [...arr, {lat: box.minLat, lng: box.minLng}, {lat: box.maxLat, lng: box.maxLng}]
  , [] );

  return boundingBox(points);
}


/**
 * 
 * @param {Point} point Point or Point-like object to test
 * @param {Object} box bounding box object of the form { minLng: xx, minLat: xx, maxLng: xx, maxLat: xx }
 * @returns {boolean}
 */
function isPointInBox(point, bbox) {

  checkPoints(point);
  checkBoundingBoxes(bbox);

  return  point.lng <= bbox.maxLng &&
          point.lng >= bbox.minLng &&
          point.lat <= bbox.maxLat &&
          point.lat >= bbox.minLat;
}


/**
  * @param {number} degs number in degrees
  * @returns {number} in radians
  */
 function degs2rads(degs) {
  return degs * 0.01745329251994329576; //0.0174... = Pi/180
};


/**
  * @param {number} rads number in radians
  * @returns {number} in degrees
  */
 function rads2degs(rads) {
  return rads / 0.01745329251994329576; //0.0174... = Pi/180
};



/**
 * 'Private' methods not provided for use in public scope
 */


function checkIsNumber(value) {
  if ( isNaN(value) ) {
    throw new GeoFunctionsError(`${value} is Not a Number`);
  }
}

function checkPoints() {
  const args = arguments[0] instanceof Array ? arguments[0] : [...arguments];
  if (!args.every(arg => isPointOrPointLike(arg))) {
    throw new GeoFunctionsError('Argument not a Point or Point-like object');
  }
}

function isPointOrPointLike(variable) {

  if (variable instanceof Point) {
    return true;
  }

  if (variable instanceof Object) {
    if (variable.hasOwnProperty('lat') && variable.hasOwnProperty('lng')){
      return true;
    }
  }

  return false;
}

function checkBoundingBoxes(input) {
  if (!(input instanceof Array)) { 
    input = [input]
  }
  if ( input.every( bbox => 
    bbox.hasOwnProperty('minLat') &&
    bbox.hasOwnProperty('maxLat') &&
    bbox.hasOwnProperty('minLng') &&
    bbox.hasOwnProperty('maxLng'))) {
    return
  }
  throw new Error(`Bounding boxes must be provided as object with properties minLat, maxLat, minLng, maxLng`);
}

class GeoFunctionsError extends Error{};

module.exports = {
  p2p, 
  p2l, 
  bearing, 
  simplifyPath, 
  boundingBox, 
  rads2degs, 
  degs2rads, 
  outerBoundingBox, 
  isPointInBox,
  bearingAsCardinal
}