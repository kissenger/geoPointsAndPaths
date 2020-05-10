
const Point = require('../src/class-point').Point; // for instance checking

/**
 * Returns distance in meters between two GPS points
 *
 * Implements the Haversine formula
 * https://en.wikipedia.org/wiki/Haversine_formula
 * Vincenty's formula is more accurate but more expensive
 * https://en.wikipedia.org/wiki/Vincenty's_formulae
 *
 * lngLat1 is lng/lat of point 1 in decimal degrees
 * lngLat2 is lng/lat of point 1 in decimal degrees
 *
 * https://www.movable-type.co.uk/scripts/latlong.html
 * can be sped up: https://stackoverflow.com/questions/27928
 *
 * @param {Point} p1 as instance of point class
 * @param {Point} p2 as instance of point class
 * @returns {number} distance between provided points in metres
 */
function p2p(p1, p2) {

  // type checking removed for testing
  // if ( ! (p1 instanceof Point && p2 instanceof Point) ) {
  //   throw new Error(`p2p argument not an instance of Point class`);
  // };

  const lat1 = degs2rads(p1.lat);
  const lat2 = degs2rads(p2.lat);
  const lng1 = degs2rads(p1.lng);
  const lng2 = degs2rads(p2.lng);

  const dlat = lat1 - lat2;
  const dlng = lng1 - lng2;

  const a = (Math.sin(dlat/2.0) ** 2.0 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlng/2.0) ** 2.0) ** 0.5;
  const c = 2.0 * Math.asin(a);

  return d = c * 6378.137 * 1000.0;  // distance in metres

}



/**
* Returns distance in meters between a line (defined by p1 and p2) and a point (p3)
* @param {Point} p1 lng/lat of line start in decimal degrees as instance of Point class
* @param {Point} p2 lng/lat of line end in decimal degrees as instance of Point class
* @param {Point} p3 lng/lat of mid-point in decimal degrees as instance of Point class
*/
function p2l(p1, p2, p3) {

  // type checking removed for testing
  // if ( !(p1 instanceof Point && p2 instanceof Point && p3 instanceof Point)) {
  //   throw new Error(`p2l argument not an instance of Point class`);
  // }

  const d13 = p2p(p1, p3) / 1000.0;
  const brg12 = bearing(p1, p2);
  const brg13 = bearing(p1, p3);

  return Math.asin( Math.sin( d13/6378.137 ) * Math.sin( brg13-brg12 ) ) * 6378.137 * 1000.0;

}


/**
 * Returns bearing in radians between two points
 * @export
 * @param {Point} p1 start point
 * @param {Point} p2 end point
 * @returns bearing in between two points in RADIANS
 */
function bearing(p1, p2) {

  // type checking removed for testing
  // if ( !(p1 instanceof Point && p2 instanceof Point) ) {
  //   throw new Error(`bearing argument not an instance of Point class`);
  // }

  const lat1 = degs2rads(p1.lat);
  const lat2 = degs2rads(p2.lat);
  const lng1 = degs2rads(p1.lng);
  const lng2 = degs2rads(p2.lng);
	const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2)* Math.cos(lng2 - lng1)
	const y = Math.sin(lng2 - lng1) * Math.cos(lat2)

	return Math.atan2(y, x)

}


function simplify(points, TOLERANCE) {

  // j is an array of indexes - the index of removed points are removed from this array
  const j = Array.from(points, (_, i) => i)
  let flag = true;
  let i;

  while (flag) {
    i = 0;
    flag = false;   // if remains false then simplification is complete; loop will break
    while ( i < ( j.length - 2 ) ) {
      const pd = p2l( points[j[i]], points[j[i+2]], points[j[i+1]] );
      if ( Math.abs(pd) < TOLERANCE ) {
        j.splice(i + 1, 1); // delete a point
        flag = true;
      }
      i++;
    }
  }

  return j.map( x => points[x] );

}

function degs2rads(degs) {
  return degs * Math.PI / 180.0;
};

module.exports = {
  simplify, p2p, p2l, bearing
}