const Path = require('../index').Path;
const Point = require('../index').Point;
const data = require('./data');
const coords = data.coords;
const points = coords.map( c => new Point(c));
const elevs = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ];
const HR = [ 11, 22, 33, 44, 55, 66, 77, 88, 99, 109, 119, 129, 139, 149, 159, 196, 179, 189, 199, 209 ];
const powerWrongLength = [ 20, 30, 40, 50, 60, 70, 80];

// Instantiate a Path - must be an array of points- point-like objects are not accepted because the Path
// class needs access to the methods on the Point class to fulfil its functions
let path = new Path(points);

// Add a parameter to the path
path.addParamToPoints('elev', elevs);   // adds each elevation onto the point instances
path.addParamToPoints('HR', HR);        // adds each HR onto the point instances
path.addParamToPoints('HR', elevs);     // does nothing because HR is already set and not overwritten
try {
  path.addParamToPoints('power', powerWrongLength);     // returns error as incorrect param array length
} catch(err) {
  console.log(err.message)
}
console.log(path);

// Delete a parameter from the path
path.deleteParamFromPoints('HR');   // adds each elevation onto the point instances
path.deleteParamFromPoints('lat');   // ignored without error - cannot delete lat or lng
console.log(path);

// Get an array of values for a provided parameter
console.log(path.getParamFromPoints('elev'));
console.log(path.getParamFromPoints('HR'));    // returns undefined if the param does not exist

// Get a point at a given index
console.log(path.getPoint(3));
try {
  path.getPoint(30);                            // returns error because index is out of range
} catch(err) {  
  console.log(err.message)
}

// Other getters
console.log(path.lngLats);              // simple array of [lng,lat] coordinates
console.log(path.length);               // number of points in the path
console.log(path.boundingBox);          // bounding box as {minLat, minLng, maxLat, maxLng}
console.log(path.deltaDistance);        // array with distance between each succcessive point
console.log(path.cumulativeDistance);   // array with cumulative distance between each point
console.log(path.distance);             // total distance of the path
console.log(path.simplificationRatio);  // simplification ratio (simplified length / original length)

// Simplify path
path.simplify(3);
console.log(path.lngLats);              // simple array of [lng,lat] coordinates
console.log(path.length);               // number of points in the path
console.log(path.boundingBox);          // bounding box as {minLat, minLng, maxLat, maxLng}
console.log(path.deltaDistance);        // array with distance between each succcessive point
console.log(path.cumulativeDistance);   // array with cumulative distance between each point
console.log(path.distance);             // total distance of the path
console.log(path.simplificationRatio);  // simplification ratio (simplified length / original length)

