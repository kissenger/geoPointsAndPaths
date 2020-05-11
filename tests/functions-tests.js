const expect = require('chai').expect;
const Point = require('../src/class-point').Point;
const geoFun = require('../src/functions');
const compareFuncs = require('./compare-funcs');

// some param strings for reference
// {"lat":51.2194,"lng":-3.94915}
// {"lat":51.2194,"lng":-3.94915, "elev": 50, "HR": 136, "Cadence": 95};

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

/**
 * Path Instantiation
 */
describe(`Test functions`, function() {

  describe(`p2p`, function() {

    it('should return same result as baseline method with points', function() {
      const p1 = new Point({"lat":51.2194,"lng":-3.94915});
      const p2 = new Point({"lat":51.2192,"lng":-3.94935});
      expect(geoFun.p2p(p1, p2).toFixed(8)).to.equal(compareFuncs.p2p(p1, p2).toFixed(8));
    });

    it('should return same result as baseline method with point-likes', function() {
      const p1 = {"lat":51.2194,"lng":-3.94915};
      const p2 = {"lat":51.2192,"lng":-3.94935};
      expect(geoFun.p2p(p1, p2).toFixed(8)).to.equal(compareFuncs.p2p(p1, p2).toFixed(8));
    });

    it('should return same result as baseline method with points and point-likes', function() {
      const p1 = new Point({"lat":51.2194,"lng":-3.94915});
      const p2 = {"lat":51.2192,"lng":-3.94935};
      expect(geoFun.p2p(p1, p2).toFixed(8)).to.equal(compareFuncs.p2p(p1, p2).toFixed(8));
    });

    it('should return error if input is not a point-like object', function() {
      expect(geoFun.p2p.bind(geoFun.p2p, {"lat":51.2194,"cheese":-3.94915}, {"lat":51.2194,"lng":-3.94915}))
        .to.throw('Argument not a Point or Point-like object');
    });

  })

  describe(`p2l`, function() {

    it('should return same result as baseline method with points', function() {
      const p1 = new Point({"lat":51.2194,"lng":-3.94915});
      const p2 = new Point({"lat":51.21919,"lng":-3.94989});
      const p3 = new Point({"lat":51.2192,"lng":-3.94935});
      expect(geoFun.p2l(p1, p3, p2).toFixed(8)).to.equal(compareFuncs.p2l(p1, p3, p2).toFixed(8));
    });

    it('should return same result as baseline method with point-likes', function() {
      const p1 = {"lat":51.2194,"lng":-3.94915};
      const p2 = {"lat":51.21919,"lng":-3.94989};
      const p3 = {"lat":51.2192,"lng":-3.94935};
      expect(geoFun.p2l(p1, p3, p2).toFixed(8)).to.equal(compareFuncs.p2l(p1, p3, p2).toFixed(8));
    });

    it('should return same result as baseline method with points and point-like', function() {
      const p1 = new Point({"lat":51.2194,"lng":-3.94915});
      const p2 = {"lat":51.21919,"lng":-3.94989};;
      const p3 = new Point({"lat":51.2192,"lng":-3.94935});
      expect(geoFun.p2l(p1, p3, p2).toFixed(8)).to.equal(compareFuncs.p2l(p1, p3, p2).toFixed(8));
    });

    it('should return error if input is not a point-like object', function() {
      expect(geoFun.p2l.bind(geoFun.p2l, {"lat":51.2194,"cheese":-3.94915}, {"lat":51.2194,"lng":-3.94915}, {"lat":51.2194,"lng":-3.94345}))
        .to.throw('Argument not a Point or Point-like object');
    });

  })

  describe(`bearing`, function() {

    it('should return same result as baseline method with points', function() {
      const p1 = new Point({"lat":51.2194,"lng":-3.8});
      const p2 = new Point({"lat":52.2194,"lng":-3.8});
      expect(geoFun.bearing(p1, p2).toFixed(8)).to.equal(compareFuncs.bearing(p1, p2).toFixed(8));
    });

    it('should return same result as baseline method with point-like', function() {
      const p1 = {"lat":51.2194,"lng":-3.8};
      const p2 = {"lat":52.2194,"lng":-3.8};
      expect(geoFun.bearing(p1, p2).toFixed(8)).to.equal(compareFuncs.bearing(p1, p2).toFixed(8));
    });

    it('should return same result as baseline method with points and point-like objects', function() {
      const p1 = {"lat":51.2194,"lng":-3.8};
      const p2 = new Point({"lat":52.2194,"lng":-3.8});
      expect(geoFun.bearing(p1, p2).toFixed(8)).to.equal(compareFuncs.bearing(p1, p2).toFixed(8));
    });

    it('should return error if input is not a point-like object', function() {
      expect(geoFun.bearing.bind(geoFun.bearing, {"lat":51.2194,"cheese":-3.94915}, {"lat":51.2194,"lng":-3.94345}))
        .to.throw('Argument not a Point or Point-like object');
    });

  })


  describe(`Simplify`, function() {

    it('expected output for tol=0 (no simplify)', function() {
      expect(geoFun.simplifyPath(points, 0).points).to.deep.equal(compareFuncs.simplify(points, 0));
    });

    it('expected output for tol=5', function() {
      expect(geoFun.simplifyPath(points, 5).points).to.deep.equal(compareFuncs.simplify(points, 5));
    });

    it('should accept point-like objects', function() {
      expect(geoFun.simplifyPath(coords, 10).points.map(p=>[p.lng, p.lat]))
        .to.deep.equal(compareFuncs.simplify(points, 10).map(p=>[p.lng, p.lat]));
    });

    it('throw \'... is Not a Number\' is invalid tolerance is passed', function() {
      expect(geoFun.simplifyPath.bind(geoFun.simplifyPath, points,'chair')).to.throw('chair is Not a Number');
    });

    it('return error if array contains a non point-like input', function() {
      const newPoints = [...points, {"chair":51.2194,"house":-3.8}];
      expect(geoFun.simplifyPath.bind(geoFun.simplifyPath, newPoints, '5')).to.throw('Argument not a Point or Point-like object');
    });

  })


  describe(`Bounding box`, function() {

    it('expected output for simple bounding box with Points input', function() {
      expect(geoFun.boundingBox(points)).to.deep.equal({ minLng: -3.95615, maxLng: -3.94915, minLat: 51.21769, maxLat: 51.2194})
    });

    it('expected output for simple bounding box with Points-like input', function() {
      expect(geoFun.boundingBox(coords)).to.deep.equal({ minLng: -3.95615, maxLng: -3.94915, minLat: 51.21769, maxLat: 51.2194})
    });

    it('expected output for bounding box of bounding boxes with Points input', function() {
      const bbox1 = geoFun.boundingBox(points.slice(0,5));
      const bbox2 = geoFun.boundingBox(points.slice(5, 10));
      const bbox3 = geoFun.boundingBox(points.slice(10, 15));
      const bbox4 = geoFun.boundingBox(points.slice(15));

      expect(geoFun.outerBoundingBox([bbox1, bbox2, bbox3, bbox4])).to.deep.equal({ minLng: -3.95615, maxLng: -3.94915, minLat: 51.21769, maxLat: 51.2194})
    });

    it('isPointInBox should return true if point is in box', function() {
      const box = {minLat: 51, maxLat: 52, minLng: -1, maxLng: 0};
      const point = {lat: 51.5, lng: -0.5};
      expect(geoFun.isPointInBox(point, box)).to.equal(true)
    });

    it('isPointInBox should return true if point is on the boundary of box', function() {
      const box = {minLat: 51, maxLat: 52, minLng: -1, maxLng: 0};
      const point = {lat: 51, lng: -0.5};
      expect(geoFun.isPointInBox(point, box)).to.equal(true)
    });

    it('isPointInBox should return false if point is outside the box', function() {
      const box = {minLat: 51, maxLat: 52, minLng: -1, maxLng: 0};
      const point = {lat: 50.9999, lng: -0.5};
      expect(geoFun.isPointInBox(point, box)).to.equal(false)
    });
    
  })  

  describe(`Degs2rads and Rads2degs`, function() {

    it('Degs2rads 180 degs = pi to 10 dp', function() {
      expect(geoFun.degs2rads(180).toFixed(10)).to.equal(Math.PI.toFixed(10))
    });

    it('Degs2rads 37.5 degs = 37.5/180*pi to 10 dp', function() {
      expect(geoFun.degs2rads(37.5).toFixed(10)).to.equal((37.5/180*Math.PI).toFixed(10))
    });

    it('Rads2degs pi  = 180degs to 10 dp', function() {
      expect(geoFun.rads2degs(Math.PI).toFixed(10)).to.equal((180).toFixed(10))
    });

    it('Rads2degs 0.126374 rads = 0.126374 *180 / pi degs to 10 dp', function() {
      expect(geoFun.rads2degs(0.126374).toFixed(10)).to.equal((0.126374*180/Math.PI).toFixed(10))
    });

  })    

  describe(`Bearing as cardinal`, function() {

    it('provides South to North output for 0rads', function() {
      expect(geoFun.bearingAsCardinal(0)).to.deep.equal({from: 'South', to: 'North'})
    });

    it('provides NW to SE output for 2.32157rads', function() {
      expect(geoFun.bearingAsCardinal(2.32157)).to.deep.equal({from: 'NW', to: 'SE'})
    });

    it('should throw error \'bearingAsCardinal will only accept input beween 0 and 2*PI\' if bearing is out of range', function() {
      expect(geoFun.bearingAsCardinal.bind(geoFun.bearingAsCardinal, 390)).to.throw('bearingAsCardinal will only accept input beween 0 and 2*PI');
    });

  })    


});


