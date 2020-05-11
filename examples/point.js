
// Import the library.
const Point = require('../index').Point;


/**
 * Instantiate a Point
 */

// You can instantiate a Point in two ways.  First option is to provide a list of paramaters, which must include 'lat' and 'lng' or will throw an error:
let point = new Point({"lat":53.21919,"lng":-4.94989});
console.log(point);
// Point { _lat: 53.21919, _lng: -4.94989 } 

point = new Point({"lat":53.21919,"lng":-4.94989,"elevation":56,"HR":135,"colour":"red"});
console.log(point);
// Point {_lat: 53.21919, _lng: -4.94989, _elevation: 56, _HR: 135, _colour: 'red'}

// The other option is to instantiate an empty instance and use the lng/lat setters:
point = new Point();
point.lng = -4.94989;
point.lat = 53.21919;
console.log(point); // Point { _lng: -4.94989, _lat: 53.21919 }



/**
 * Add paramaters
 */

// To add additional parameters after instantiation (no matter which way instance was created) use addParams method.  
point.addParams({"elevation":56,"HR":135,"colour":"red"});
console.log(point); // Point {_lat: 53.21919, _lng: -4.94989, _elevation: 56, _HR: 135, _colour: 'red'}

// Note that if a parameter is supplied that already exists on the point, it is silently ignored and not overwritten:
point.addParams({"lat":54.34565,"elevation":57,"HR":97,"temperature":30,"cadance": 99, "power": 289});
console.log(point); // Point {_lng: -4.94989,_lat: 53.21919,_elevation: 56,_HR: 135,_colour: 'red',_temperature: 30,_cadance: 99,_power: 289}



/**
 * Delete paramaters
 */

point.deleteParams("elevation", "HR");
point.deleteParams(["colour", "temperature"]);
console.log(point);  // Point { _lng: -4.94989, _lat: 53.21919, _cadance: 99 }

// Note that lat and lng cannot be deleted
point.deleteParams("lat","lng","cadance");
console.log(point); // Point { _lng: -4.94989, _lat: 53.21919 }

// But they can be adjusted using the setters
point.lng = -2.34567;
point.lat = 52.12345;
console.log(point);   // Point { _lng: -2.34567, _lat: 52.12345 }


/**
 * Get paramaters
 */

// Simple getters for lat and lng
console.log(point.lat); // 52.12345
console.log(point.lng); // -2.34567

// For other params use getParams can provide list or array
console.log(point.getParams('power', 'lat', 'HR'));  // { power: 289, lat: 52.12345 }
console.log(point.getParams(['lat', 'lng']));  // { lat: 52.12345, lng: -2.34567 }



