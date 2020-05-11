# geolib
Library for storing and manipulating coordinate data as Points and Paths, with common methods including path simplification, point to point distance etc.  Any number of named parameters (such as 'elevation') can be associated with each point, w

<ul>
  <li> Point: Store any number of named paramaters on each point </li>
  <li> Point: Simple get methods to access lat/lng and any named parameter </li>
  <li> Path: Associate any number of points as a path </li>
  <li> Path: Has access to methods such as 'simplify'; as params are associated with each point it makes handling simplified paths very easy </li>
  <li> p2p: point to point distance between two provdied points </li>
  <li> p2l: shortest distance from great circle line connecting two points, to a third point</li>
  <li> bearing: compass bearing between two provided points </li>
</ul>


# Point Class

Import the library.
<pre>
const Point = require('geolib').Point;
</pre>

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


