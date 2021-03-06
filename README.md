# geoPointsAndPaths
Library for storing and manipulating coordinate data as Points and Paths, with common methods including path simplification, point to point distance etc.  Any number of named parameters (such as 'elevation') can be associated with each point.  Distance calculations between points are based on Haversine - there are more accurate, slower, methods available and any number of nom libraries to calculate them.

Features of Point class:
<ul>
  <li> Store any number of named paramaters on each point </li>
  <li> Simple get methods to access lat/lng and any named parameter </li>
</ul>

Features of Path class:
<ul>
  <li> Associate any number of points as a path </li>
  <li> Any number of parameters can be associated to the path; params are stored on each Point instance
  <li> Has access to methods such as 'simplify'; as params are associated with each point it makes handling simplified paths very easy </li>
  <li> Access derived properties such as cumulative distance and delta distance, as well as total distance </li>
  <li> Tracks whether it has been simplified and stores the compression ratio </li>
</ul>

GeoFunctions:
<ul>
  <li> p2p: point to point distance between two provdied points </li>
  <li> p2l: shortest distance from great circle line connecting two points, to a third point</li>
  <li> bearing: compass bearing between two provided points (in degrees - new at v2.0.0, breaking change)</li>
  <li> boundingBox: return lat and lng bounds for a supplied array of points </li>
  <li> bearingAsCardinal: compass bearing between two provided points as compass cardinal, eg North to South</li>
  <li> simplify: simplifies an array of points given a tolerance using the perpendicular distance method</li>
</ul>


# Importing the classes and functions#

Import the classes and functions
<pre>
// CommonJS
const Point = require('geo-points-and-paths').Point;
const Path = require('geo-points-and-paths').Path;
const geoFunctions = require('geo-points-and-paths').geoFunctions;

// ES Modules
import geolib from 'geo-points-and-paths';
const {Point, Path, geoFunctions} = geolib;
</pre>


# Point Class

You can instantiate a Point in two ways.  First option is to provide a list of paramaters, which must include 'lat' and 'lng' or will throw an error:

<pre>
const pointOne = new Point({"lat":53.21919,"lng":-4.94989});
const pointTwo = new Point({"lat":53.21919,"lng":-4.94989,"elevation":56,"HR":135,"colour":"red"});
</pre>

The other option is to instantiate an empty instance and use the lng/lat setters:

<pre>
let point = new Point();
point.lng = -4.94989;
point.lat = 53.21919;
console.log(point);     // Point { _lng: -4.94989, _lat: 53.21919 }
</pre>

To add additional parameters after instantiation (no matter which way instance was created) use addParams method.  Note that if a parameter is supplied that already exists on the point, it is silently ignored and not overwritten:

<pre>
point.addParams({"elevation":56,"HR":135,"colour":"red"});
point.addParams({"lat":54.34565,"elevation":57,"HR":97,"temperature":30,"cadance": 99, "power": 289});
console.log(point);   // Point {_lng: -4.94989,_lat: 53.21919,_elevation: 56,_HR: 135,_colour: 'red',_temperature: 30,_cadance: 99,_power: 289}
</pre>

To delete parameters from a point use the deleteParams method.  Note that lng and lat cannot be deleted, attempt to do so will be silently ignored:

<pre>

point.deleteParams("elevation", "HR");
point.deleteParams(["colour", "temperature"]);
console.log(point);         // Point { _lng: -4.94989, _lat: 53.21919, _cadance: 99 }

// lat and lng cannot be deleted
point.deleteParams("lat","lng","cadance");
console.log(point);         // Point { _lng: -4.94989, _lat: 53.21919 }

// But they can be adjusted using the setters
point.lng = -2.34567;
point.lat = 52.12345;
console.log(point);         // Point { _lng: -2.34567, _lat: 52.12345 }

</pre>

To read parameters from a point, use getters for lat/lng or getParams for other parameters:

<pre>
console.log(point.lat);         // 52.12345
console.log(point.lng);         // -2.34567

console.log(point.getParams('power', 'lat', 'HR));     // { power: 289, lat: 52.12345 }
console.log(point.getParams(['lat', 'lng']));          // { lat: 52.12345, lng: -2.34567 }
</pre>

## Path Class

Define an array of Point instances along with some parameter arrays for future use:
<pre>
const coords = [
  {"lat":51.2194,"lng":-3.94915},
  {"lat":51.21932,"lng":-3.94935},
  {"lat":51.21919,"lng":-3.94989},
  {"lat":51.21905,"lng":-3.95032},
  {"lat":51.219,"lng":-3.95043},
  {"lat":51.21893,"lng":-3.95052},
  {"lat":51.21856,"lng":-3.95088},
  {"lat":51.21835,"lng":-3.95112},
  {"lat":51.21825,"lng":-3.95132},
  {"lat":51.21819,"lng":-3.95147},
  {"lat":51.21804,"lng":-3.95236},
  {"lat":51.21804,"lng":-3.95255},
  {"lat":51.21808,"lng":-3.953},
  {"lat":51.2181,"lng":-3.95338},
  {"lat":51.21808,"lng":-3.95372},
  {"lat":51.21795,"lng":-3.95445},
  {"lat":51.21794,"lng":-3.95477},
  {"lat":51.2179,"lng":-3.95511},
  {"lat":51.21774,"lng":-3.95564},
  {"lat":51.21769,"lng":-3.95615}
];

const points = coords.map( c => new Point(c));
const elevs = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ];
const HR = [ 11, 22, 33, 44, 55, 66, 77, 88, 99, 109, 119, 129, 139, 149, 159, 196, 179, 189, 199, 209 ];
const powerWrongLength = [ 20, 30, 40, 50, 60, 70, 80];
</pre>

Instantiate a Path - must be an array of points; point-like objects are not accepted because the Path lass needs access to the methods on the Point class to fulfil its functions

<pre>
let path = new Path(points);
</pre>

Parameters can now be added to the path via the addParamToPoints method.  This takes an array, which must have the same lengths as the number of points in the path, and adds each point to a Point instance.  In this way if points are added or deleted, the correct parameters are always on the correct points.

<pre>
path.addParamToPoints('elev', elevs);   // adds each elevation onto the point instances
path.addParamToPoints('HR', HR);        // adds each HR onto the point instances
path.addParamToPoints('HR', elevs);     // does nothing because HR is already set and not overwritten
try {
  path.addParamToPoints('power', powerWrongLength);     // returns error as incorrect param array length
} catch(err) {
}
console.log(path);
</pre>

Parameters can be deleted in a similar manner

<pre>
// Delete a parameter from the path
path.deleteParamFromPoints('HR');   // adds each elevation onto the point instances
path.deleteParamFromPoints('lat');   // ignored without error - cannot delete lat or lng
</pre>

Values of parameters can be accessed as follows:
<pre>
// Get an array of values for a provided parameter
console.log(path.getParamFromPoints('elev'));
console.log(path.getParamFromPoints('HR'));    // returns undefined if the param does not exist

// Get a point at a given index
console.log(path.getPoint(3));
try {
  path.getPoint(30);                            // returns error because index is out of range
} catch(err) {  
}

</pre>

The following getters also exist on the class:

<pre>
console.log(path.lngLats);              // simple array of [lng,lat] coordinates
console.log(path.length);               // number of points in the path
console.log(path.boundingBox);          // bounding box as {minLat, minLng, maxLat, maxLng}
console.log(path.deltaDistance);        // array with distance between each succcessive point
console.log(path.cumulativeDistance);   // array with cumulative distance between each point
console.log(path.distance);             // total distance of the path
console.log(path.simplificationRatio);  // simplification ratio (simplified length / original length)

// Simplify path
path.simplify(3);                       // parameter is the distance in m from line below which point will be deleted
</pre>

## Access geoFunctions directly

All geoFunctions will take Points or Point-like objects of the form {"lat":xxx, "lng":xxx}:
<pre>
const p1 = new Point({"lat":51.2194,"lng":-3.94915});
const p2 = {"lat":51.2192,"lng":-3.94935};
const p3 = new Point({"lat":51.2392,"lng":-3.95935});
</pre>
 
Distance between two points:
<pre>
console.log(geoFunctions.p2p(p1, p2));      // 26.270488219732563
</pre>

Distance between a great circle line joining two points (defined by the first two points) and a third point:
<pre>
console.log(geoFunctions.p2l(p1, p3, p2));  // -20.105464375742027
</pre>

Bearing between two points: 
<pre>
const bearingInDEGS = geoFunctions.bearing(p1, p3)
console.log(bearingInDEGS);                          // 342.1247653798634
</pre>

Bearing between two points and compass cardinal (input in RADIANS):
<pre>
console.log(geoFunctions.bearingAsCardinal(3.14));  // {from: 'North', to: 'South}
</pre>

Convert degrees to radians and radians to degrees:
<pre>
console.log(geoFunctions.rads2degs(3.14159));        // 179.9998479605043
console.log(geoFunctions.degs2rads(180));            // 3.141592653589793
</pre>

Get the bounding box for a list of points:
<pre>
console.log(geoFunctions.boundingBox([p1, p2, p3])); //{ minLng: -3.95935,maxLng: -3.94915,minLat: 51.2192,maxLat: 51.2392}
</pre>

Test if a point is within a given bounding box:
<pre>
const box = {minLat: 51, maxLat: 52, minLng: -1, maxLng: 0};
console.log(geoFunctions.isPointInBox({lat: 50.9999, lng: -0.5}, box));   //false
console.log(geoFunctions.isPointInBox({lat: 51.5001, lng: -0.5}, box));   //true
</pre>

Simplify a list of points returns an object with parameters points and ratio, which is the ratio simplified length / original length:
<pre>
const coords = [
  {"lat":51.2194,"lng":-3.94915},
  {"lat":51.21932,"lng":-3.94935},
  {"lat":51.21919,"lng":-3.94989},
  {"lat":51.21905,"lng":-3.95032},
  {"lat":51.219,"lng":-3.95043},
  {"lat":51.21893,"lng":-3.95052},
  {"lat":51.21856,"lng":-3.95088},
  {"lat":51.21835,"lng":-3.95112},
  {"lat":51.21825,"lng":-3.95132},
  {"lat":51.21819,"lng":-3.95147},
  {"lat":51.21804,"lng":-3.95236},
  {"lat":51.21804,"lng":-3.95255},
  {"lat":51.21808,"lng":-3.953},
  {"lat":51.2181,"lng":-3.95338},
  {"lat":51.21808,"lng":-3.95372},
  {"lat":51.21795,"lng":-3.95445},
  {"lat":51.21794,"lng":-3.95477},
  {"lat":51.2179,"lng":-3.95511},
  {"lat":51.21774,"lng":-3.95564},
  {"lat":51.21769,"lng":-3.95615}
];
console.log(geoFunctions.simplifyPath(coords, 5));
// {
//   points: [
//      { lat: 51.2194, lng: -3.94915 },
//      { lat: 51.219, lng: -3.95043 },
//      { lat: 51.21825, lng: -3.95132 },
//      { lat: 51.21804, lng: -3.95236 },
//      { lat: 51.21808, lng: -3.95372 },
//      { lat: 51.21769, lng: -3.95615 }
//    ],
//    ratio: 0.3
//  }

</pre>
