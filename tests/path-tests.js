
/**
 * To run: 'mocha point-tests'
 */

const expect = require('chai').expect;
const Point = require('../src/class-point').Point;
const Path = require('../src/class-path').Path;
const PathError = require('../src/class-path').PathError;

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

/**
 * Path Instantiation
 */
describe(`Correctly instantiating Path`, function() {

  describe(`Instantiating a path`, function() {

    const points = coords.map( c => new Point(c));

    it('should return an instance of Path when initialised with two points', function() {
      expect(new Path(points.slice(0,2))).to.satisfy(function(r) { return r instanceof Path});
    });

    it('should return an instance of Path when initialised with more than two points', function() {
      expect(new Path(points)).to.satisfy(function(r) { return r instanceof Path});
    });

  })


  describe(`Check error returns for incorrectly instantiating a Path`, function() {

    it('should return an instance of PathError if an array is not passed', function() {
      try {
        new Path({"lat":51.21769,"lng":-3.95615});
      } catch (err) {
        expect(err).to.satisfy(function(r) { return r instanceof PathError});
      }
    });

    it('should return an instance of PathError if passed array does not contain points', function() {
      try {
        new Path([1,2,3,4]);
      } catch (err) {
        expect(err).to.satisfy(function(r) { return r instanceof PathError});
      }
    });

    it('should return an instance of PathError if any element in array is not a point', function() {
      try {
        const points = coords.map( c => new Point(c));
        points.push({"lat":51.21769,"lng":-3.95615});
        new Path(points);
      } catch (err) {
        expect(err).to.satisfy(function(r) { return r instanceof PathError});
      }
    })

    it('should return an instance of PathError if passed only a single point', function() {
      try {
        const points = coords.map( c => new Point(c));
        new Path(points.slice(0,1));
      } catch (err) {
        expect(err).to.satisfy(function(r) { return r instanceof PathError});
      }
    })

  });

});

  // describe(`Using param array including other parameters`, function() {
  //   const params = {"lat":51.2194,"lng":-3.94915, "elev": 50, "HR": 136, "Cadence": 95};
  //   const point = new Point(params);
  //   const paramsKeys = Object.keys(params);
  //   const expectedPointKeys = Object.keys(point).map(key => key.substring(1));
    
  //   it('should return instance of Point', function() {
  //     expect(point).to.satisfy(function(r) { return r instanceof Point});
  //   });

  //   it('should have all the expected keys', function() {
  //     expect(expectedPointKeys).deep.equal(paramsKeys);
  //   });
  
  // })


  // describe(`Instantiating an empty instance `, function() {

  //   const point = new Point();
    
  //   it('should return instance of Point', function() {
  //     expect(point).to.satisfy(function(r) { return r instanceof Point});
  //   });
  
  // })


  // describe(`Check error returns for incorrectly instantiating a Point`, function() {

  //   it('should return an instance of PointError if keys do not contain lng is not passed', function() {
  //     try {
  //       point = new Point({lat:51.2194,"lon":-3.94915});
  //     } catch (err) {
  //       expect(err).to.satisfy(function(r) { return r instanceof PointError});
  //     }
  //   });

  //   it('should return an instance of PointError if keys do not contain lat is not passed', function() {
  //     try {
  //       point = new Point({"lng":-3.94915});
  //     } catch (err) {
  //       expect(err).to.satisfy(function(r) { return r instanceof PointError});
  //     }
  //   });

  //   it('should return an instance of PointError if lng is not a valid value', function() {
  //     try {
  //       point = new Point({"lat":51.2194,"lng":-320.94915});
  //     } catch (err) {
  //       expect(err).to.satisfy(function(r) { return r instanceof PointError});
  //     }
  //   });

  //   it('should return an instance of PointError if lng is not a valid type', function() {
  //     try {
  //       point = new Point({"lat":51.2194,"lng":'cheese'});
  //     } catch (err) {
  //       expect(err).to.satisfy(function(r) { return r instanceof PointError});
  //     }
  //   });

  //   it('should return an instance of PointError if lat is not a valid value', function() {
  //     try {
  //       point = new Point({"lat":91.2194,"lng":-3.94915});
  //     } catch (err) {
  //       expect(err).to.satisfy(function(r) { return r instanceof PointError});
  //     }
  //   });

  //   it('should return an instance of PointError if lat is not a valid type', function() {
  //     try {
  //       point = new Point({"lat":true,"lng":-3.94915});
  //     } catch (err) {
  //       expect(err).to.satisfy(function(r) { return r instanceof PointError});
  //     }
  //   });
    
  // });
