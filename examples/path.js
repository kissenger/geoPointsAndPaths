const Path = require('../index').Path;
const Point = require('../index').Point;

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


//Instantiate a Path
let path = new Path(points);

//add a parameter to the path
path.addParamToPoints('elev', elevs);   // adds each elevation onto the point instances
path.addParamToPoints('HR', HR);        // adds each HR onto the point instances
path.addParamToPoints('HR', elevs);     // does nothing because HR is already set and not overwritten
try {
  path.addParamToPoints('power', powerWrongLength);     // returns error as incorrect param array length
} catch(err) {
  console.log(err.message)
}
console.log(path);

//delete a parameter from the path
path.deleteParamFromPoints('HR');   // adds each elevation onto the point instances
// path.addParamToPoints('HR', HR);        // adds each HR onto the point instances
// path.addParamToPoints('HR', elevs);     // does nothing because HR is already set and not overwritten
console.log(path);
