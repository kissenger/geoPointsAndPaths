
const Point = require ('./class-point.js').Point;

/**
 * Uses Haversine to return distance in metres btwn 2 coordinates https://en.wikipedia.org/wiki/Haversine_formula
 * Vincenty's formula is more accurate but more expensive https://en.wikipedia.org/wiki/Vincenty's_formulae
 * See also https://www.movable-type.co.uk/scripts/latlong.html
 * @param {Point} p1 as instance of point class
 * @param {Point} p2 as instance of point class
 * @returns {number} distance between provided points in metres
 */
function p2p(p1, p2) {

  checkIsAllPoints(p1, p2);

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
* Returns distance in meters between a line (defined by p1 and p2) and a point (p3)
* See https://www.movable-type.co.uk/scripts/latlong.html
* @param {Point} p1 lng/lat of line start in decimal degrees as instance of Point class
* @param {Point} p2 lng/lat of line end in decimal degrees as instance of Point class
* @param {Point} p3 lng/lat of mid-point in decimal degrees as instance of Point class
*/
function p2l(p1, p2, p3) {

  checkIsAllPoints(p1, p2, p3);

  const d13 = p2p(p1, p3) / 1000.0;
  const brg12 = bearing(p1, p2);
  const brg13 = bearing(p1, p3);

  return Math.asin( Math.sin( d13/6378.137 ) * Math.sin( brg13-brg12 ) ) * 6378.137 * 1000.0;

}


/**
 * Returns bearing in radians between two points
 * See https://www.movable-type.co.uk/scripts/latlong.html
 * @param {Point} p1 start point
 * @param {Point} p2 end point
 * @returns bearing in between two points in RADIANS
 */
function bearing(p1, p2) {

  checkIsAllPoints(p1, p2);

  const lat1 = degs2rads(p1.lat);
  const lat2 = degs2rads(p2.lat);
  const lng1 = degs2rads(p1.lng);
  const lng2 = degs2rads(p2.lng);

	const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2)* Math.cos(lng2 - lng1)
	const y = Math.sin(lng2 - lng1) * Math.cos(lat2)

	return Math.atan2(y, x)

}


/**
 * Simplify an array of Points using perpendicular distance method
 * http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.95.5882&rep=rep1&type=pdf
 * @param {Array<Point>} points array of Point instances
 * @param {number} TOLERANCE in metres, the higher the more simplified the result
 * @returns a new array containing the simplified set of points
 */
function simplifyPath(points, tolerance) {

  checkInputs(points, tolerance);

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

  return pointsToKeep.map( index => points[index] );

}

// export function simplify(points, TOLERANCE) {

//   // j is an array of indexes - the index of removed points are removed from this array
//   const j = Array.from(points, (_, i) => i)
//   let flag = true;
//   let i;

//   while (flag) {
//     i = 0;
//     flag = false;   // if remains false then simplification is complete; loop will break
//     while ( i < ( j.length - 2 ) ) {
//       const pd = p2l( points[j[i]], points[j[i+2]], points[j[i+1]] );
//       if ( Math.abs(pd) < TOLERANCE ) {
//         j.splice(i + 1, 1); // delete a point
//         flag = true;
//       }
//       i++;
//     }
//   }

//   return j.map( x => points[x] );

// }

function checkInputs(points, tol) {
  checkIsNumber(tol);
}

function checkIsNumber(value) {
  if ( isNaN(value) ) {
    throw new GeoFunctionsError('Supplied tolerance is not a number');
  }
}

function degs2rads(degs) {
  return degs * 0.0174532925199; //0.0174... = Pi/180
};


function checkIsAllPoints() {
  const args = arguments[0] instanceof Array ? arguments[0] : [...arguments];
  args.forEach(arg => {
    if (!arg instanceof Point) {
      throw new GeoFunctionsError('argument not an instance of Point class');
    }
  })
}


class GeoFunctionsError extends Error{};

module.exports = {
  p2p, p2l, bearing, simplifyPath, GeoFunctionsError
}