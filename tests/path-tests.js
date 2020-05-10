
/**
 * To run: 'mocha point-tests'
 */

const expect = require('chai').expect;
const Point = require('../src/class-point').Point;
const Path = require('../src/class-path').Path;
const BoundingBox = require('../src/class-bbox').BoundingBox;
const PathError = require('../src/class-path').PathError;
const GeoFunctionsError = require('../src/functions').GeoFunctionsError;
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
const elevs = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ];

/**
 * Path Instantiation
 */
describe(`Correctly instantiating Path`, function() {

  describe(`Instantiating a path`, function() {

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
        const newPoints = [...points];
        newPoints.push({"lat":51.21769,"lng":-3.95615});
        new Path(points);
      } catch (err) {
        expect(err).to.satisfy(function(r) { return r instanceof PathError});
      }
    })

    it('should return an instance of PathError if passed only a single point', function() {
      try {
        new Path(points.slice(0,1));
      } catch (err) {
        expect(err).to.satisfy(function(r) { return r instanceof PathError});
      }
    })

    it('should return an instance of PathError if no argument is passed', function() {
      try {
        new Path();
      } catch (err) {
        expect(err).to.satisfy(function(r) { return r instanceof PathError});
      }
    })
  });

});


/**
 * Path Methods
 */

describe(`Test Path methods`, function() {

  describe(`Add param to points`, function() {


    it('should have elev on each point in path', function() {
      const path = new Path(points);
      path.addParamToPoints('elev', elevs);
      expect(path).to.satisfy(function(result) { return result._points.every(p => p.hasOwnProperty('_elev'))  } ); 
    });

    
    it('param name can have spaces', function() {
      const path = new Path(points);
      path.addParamToPoints('elev', elevs);      
      path.addParamToPoints('elev gain', elevs);
      expect(path).to.satisfy(function(result) { return result._points.every(p => p.hasOwnProperty('_elev gain'))  } ); 
    });

    
    it('should ignore attempt to add duplicate parameter', function() {
      const path = new Path(points);
      path.addParamToPoints('elev gain', elevs.map(e => e*2));
      expect(path.getParamFromPoints('elev')).to.deep.equal(elevs);
    });
    
    
    it('should return an instance of PathError if array is not the correct length', function() {
      const path = new Path(points);
      const newElevs = [...elevs, 1,2,3];
      try {
        path.addParamToPoints('elev', newElevs);
      } catch (err) {
        expect(err).to.satisfy(function(r) { return r instanceof PathError});
      }
    })

  })


  describe(`Get param from points`, function() {

    const path = new Path(points);
    path.addParamToPoints('elev', elevs);
    it('should have elev on each point in path', function() {
      expect(path.getParamFromPoints('elev')).to.deep.equal(elevs);
    });


    const newPath = new Path([
      new Point({"lat":51.2194,"lng":-3.94915,"beer": 'peroni'}),
      new Point({"lat":51.21932,"lng":-3.94935}),
      new Point({"lat":51.21919,"lng":-3.94989,"beer": 'peroni'}),
      new Point({"lat":51.21905,"lng":-3.95032,"beer": 'peroni'})
    ]);
    it('should return null for any point without the desired paramater', function() {
      expect(newPath.getParamFromPoints('beer')).to.deep.equal(['peroni', null, 'peroni', 'peroni']);
    });

  })

  describe(`Get point`, function() {

    const path = new Path(points);
    path.addParamToPoints('elev', elevs);
    it('get a point from path should return requested point', function() {
      expect(path.getPoint(5)).to.deep.equal(points[5]);
    });

    it('should return an instance of PathError if index is out of range', function() {
      try {
        path.getPoint(50);
      } catch (err) {
        expect(err).to.satisfy(function(r) { return r instanceof PathError});
      }
    })

  })


  describe(`Using simplify as a method on Path instance`, function() {

    // simplify using Path instance


    // simplify using comparason function
    // const expectedOutput = compareFuncs.simplify(points, 5);

    it('expected output for tol=0 (no simplify)', function() {
      const path = new Path(points);
      path.simplify(0);
      const pathPoints = [];
      for (let i = 0; i < path.length; i++) {
        pathPoints.push(path.getPoint(i));
      }

      expect(pathPoints).to.deep.equal(points);
    });

    it('expected output for tol=5', function() {
      // simplify using Path instance
      const path = new Path(points);
      path.simplify(5);
      const pathPoints = [];
      for (let i = 0; i < path.length; i++) {
        pathPoints.push(path.getPoint(i));
      }

      // simplify using comparason function
      const expectedOutput = compareFuncs.simplify(points, 5);

      expect(pathPoints).to.deep.equal(expectedOutput);
    });    

    it('return error if tolerance is not a number', function() {
      try {
        const path = new Path(points);
        path.simplify('house');
      } catch (err) {
        expect(err).to.satisfy(function(r) { return r instanceof GeoFunctionsError});
      }

    });

  })

})


describe(`Test getters`, function() {

  it('get lngLats should produce the expected result', function() {
    const path = new Path(points);
    path.addParamToPoints('elev', elevs);
    expect(path.lngLats).to.deep.equal(points.map(p=>[p.lng, p.lat]));
  });

  it('get length should produce the expected result', function() {
    const path = new Path(points);
    path.addParamToPoints('elev', elevs);
    expect(path.length).to.deep.equal(points.length);
  });

  it('get bbox should produce the expected result', function() {
    const path = new Path(points);
    path.addParamToPoints('elev', elevs);
    expect(path.boundingBox).to.satisfy(function(r) { return r instanceof BoundingBox});
  });

  it('get total Distance should produce the expected result', function() {
    const path = new Path(points);
    path.addParamToPoints('elev', elevs);
    const expectedDistance = points.reduce( (d, _, i) => i === 0 ? 0 : d + compareFuncs.p2p(points[i] , points[i-1]), 0);
    expect(path.distance.toFixed(4)).to.equal(expectedDistance.toFixed(4));
  });

  it('get cumDistance should produce the expected result', function() {
    const path = new Path(points);
    const expectedResult = [0];
    points.forEach( (_, i) => {
      if (i>0) {
        expectedResult.push(expectedResult[expectedResult.length-1] + compareFuncs.p2p(points[i], points[i-1]));
      }
    })
    expect(path.cumulativeDistance.map(d=>d.toFixed(6))).to.deep.equal(expectedResult.map(d=>d.toFixed(6)));
  });


})

