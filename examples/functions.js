
const geoFunctions = require('../index').geoFunctions;
const Point = require('../index').Point;
const data = require('./data');

// all geoFunctions will take Points or Point-like objects
const p1 = new Point({"lat":51.2194,"lng":-3.94915});
const p2 = {"lat":51.2192,"lng":-3.94935};
const p3 = new Point({"lat":51.2392,"lng":-3.95935});

//basic geo functions
console.log(geoFunctions.p2p(p1, p2));      // 26.270488219732563
console.log(geoFunctions.p2l(p1, p3, p2));  // -20.105464375742027

const bearingInDEGS = geoFunctions.bearing(p1, p3)
console.log(bearingInDEGS);                          // 342.1247653798634

console.log(geoFunctions.rads2degs(3.14159));        // 179.9998479605043
console.log(geoFunctions.degs2rads(180));            // 3.141592653589793


// bounding boxes
console.log(geoFunctions.boundingBox([p1, p2, p3])); //{ minLng: -3.95935,maxLng: -3.94915,minLat: 51.2192,maxLat: 51.2392}

const box = {minLat: 51, maxLat: 52, minLng: -1, maxLng: 0};
console.log(geoFunctions.isPointInBox({lat: 50.9999, lng: -0.5}, box));   //false
console.log(geoFunctions.isPointInBox({lat: 51.5001, lng: -0.5}, box));   //true

const coords = data.coords;
// console.log(coords);
console.log(geoFunctions.simplifyPath(coords, 5));
// [
//   { lat: 51.2194, lng: -3.94915 },
//   { lat: 51.219, lng: -3.95043 },
//   { lat: 51.21825, lng: -3.95132 },
//   { lat: 51.21804, lng: -3.95236 },
//   { lat: 51.21808, lng: -3.95372 },
//   { lat: 51.21769, lng: -3.95615 }
// ]