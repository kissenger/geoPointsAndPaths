
/**
 * To run: 'mocha point-tests'
 */

const expect = require('chai').expect;
const Point = require('../src/class-point').Point;
const Path = require('../src/class-path').Path;
const PathError = require('../src/class-path').PathError;
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

//note that lngLats are the wrong way round, but doesnt affect the test
const lngLats =   [
  [51.2194,-3.94915],
  [51.21932,-3.94935],
  [51.21919,-3.94989],
  [51.21905,-3.95032],
  [51.219,-3.95043],
  [51.21893,-3.95052],
  [51.21856,-3.95088],
  [51.21835,-3.95112],
  [51.21825,-3.95132],
  [51.21819,-3.95147],
  [51.21804,-3.95236],
  [51.21804,-3.95255],
  [51.21808,-3.953],
  [51.2181,-3.95338],
  [51.21808,-3.95372],
  [51.21795,-3.95445],
  [51.21794,-3.95477],
  [51.2179,-3.95511],
  [51.21774,-3.95564],
  [51.21769,-3.95615]
]

// const points = coords.map( c => new Point(c));
const elevs = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ];

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

    it('should return an instance of Path when initialised with more than point-likes', function() {
      expect(new Path(coords)).to.satisfy(function(r) { return r instanceof Path});
    });

    it('should return an instance of Path when initialised with more than lngLats', function() {
      expect(new Path(lngLats)).to.satisfy(function(r) { return r instanceof Path});
    });



  })


  describe(`Check error returns for incorrectly instantiating a Path`, function() {

    it('should throw \'Input not an array\' if array is not passed', function() {
      const func = () => new Path({"lat":51.21769,"lng":-3.95615});
      expect(func.bind(func)).to.throw('Input not an array');
    });

    it('should throw \'Cannot determine type of input\' if passed array that is not Points, Lnglats or point-like', function() {
      const func = () => new Path([1,2,3,4]);
      expect(func.bind(func)).to.throw('Cannot determine type of input');
    });

    it('should throw \'Cannot determine type of input\' if passed array that is not Points, Lnglats or point-like', function() {
      const func = () => new Path([[1,2],[3,4, 5]]);
      expect(func.bind(func)).to.throw('Cannot determine type of input');
    });    

    it('should throw \'Cannot determine type of input\' if passed array that is not Points, Lnglats or point-like', function() {
      const func = () => new Path([{lat:23, lng:34}, {lip:23, lng:34}, {lat:23, lng:34}]);
      expect(func.bind(func)).to.throw('Cannot determine type of input');
    });       

    it('should throw \'Need two or more points to instantiate a Path\' if passed only a single point', function() {
      const points = coords.map( c => new Point(c));
      const func = () => new Path(points.slice(0,1));
      expect(func.bind(func)).to.throw('Need two or more points to instantiate a Path');
    })

    

    it('should throw \'Input not an array\' if no argument is passed', function() {
      const func = () => new Path();
      expect(func.bind(func)).to.throw('Input not an array');
    })
  });

});


/**
 * Path Methods
 */

describe(`Test Path methods`, function() {

  describe(`Add param to points`, function() {


    it('should have elev on each point in path', function() {
      const points = coords.map( c => new Point(c));
      const path = new Path(points);
      path.addParamToPoints('elev', elevs);
      expect(path).to.satisfy(function(result) { return result._points.every(p => p.hasOwnProperty('_elev'))  } ); 
    });

    
    it('param name can have spaces', function() {
      const points = coords.map( c => new Point(c));
      const path = new Path(points);
      path.addParamToPoints('elev', elevs);      
      path.addParamToPoints('elev gain', elevs);
      expect(path).to.satisfy(function(result) { return result._points.every(p => p.hasOwnProperty('_elev gain'))  } ); 
    });

    
    it('should ignore attempt to add duplicate parameter', function() {
      const points = coords.map( c => new Point(c));
      const path = new Path(points);
      path.addParamToPoints('elev', elevs);
      path.addParamToPoints('elev', elevs.map(e => e*2));
      expect(path.getParamFromPoints('elev')).to.deep.equal(elevs);
    });
    
    
    it('should return an instance of PathError if array is not the correct length', function() {
      const points = coords.map( c => new Point(c));
      const path = new Path(points);
      const newElevs = [...elevs, 1,2,3];
      try {
        path.addParamToPoints('elev', newElevs);
      } catch (err) {
        expect(err).to.satisfy(function(r) { return r instanceof PathError});
      }
    })

  })


  describe(`Delete a param from points`, function() {


    it('should have elev on each point in path', function() {
      const points = coords.map( c => new Point(c));
      const newpath = new Path(points);
      newpath.addParamToPoints('elev', elevs);
      newpath.deleteParamFromPoints('elev');
      expect(newpath).to.satisfy(function(result) { return result._points.every(p => !p.hasOwnProperty('_elev'))  } ); 
    });

  })


  describe(`Get param from points`, function() {

    it('should have elev on each point in path', function() {
      const points = coords.map( c => new Point(c));
      const path = new Path(points);
      path.addParamToPoints('elev', elevs);
      expect(path.getParamFromPoints('elev')).to.deep.equal(elevs);
    });

    it('should return undefined if param does not exist', function() {
      const points = coords.map( c => new Point(c));
      const path = new Path(points);
      path.addParamToPoints('elev', elevs);
      expect(path.getParamFromPoints('beer')).to.equal(undefined);
    });


    it('should return null for any point without the desired paramater', function() {
      const points = coords.map( c => new Point(c));
      const newPath = new Path([
        new Point({"lat":51.2194,"lng":-3.94915,"beer": 'peroni'}),
        new Point({"lat":51.21932,"lng":-3.94935}),
        new Point({"lat":51.21919,"lng":-3.94989,"beer": 'peroni'}),
        new Point({"lat":51.21905,"lng":-3.95032,"beer": 'peroni'})
      ]);
      expect(newPath.getParamFromPoints('beer')).to.deep.equal(['peroni', null, 'peroni', 'peroni']);
    });

  })


  describe(`Get point`, function() {

    const points = coords.map( c => new Point(c));

    it('get a point from path should return requested point', function() {
      const path = new Path(points);
      path.addParamToPoints('elev', elevs);
      expect(path.getPoint(5)).to.deep.equal(points[5]);
    });

    it(`should throw \'Requested point at index 50 does not exist\' if attempt to access noexistant point`, function() {
      const path = new Path(points);
      path.addParamToPoints('elev', elevs);
      const func = () => path.getPoint(50);
      expect(func.bind(func)).to.throw(`Requested point at index 50 does not exist`);
    })

  })


  describe(`Using simplify as a method on Path instance`, function() {

    const points = coords.map( c => new Point(c));

    it('expected output for tol=0 (no simplify)', function() {
      const path = new Path(points);
      path.simplify(0);
      const pathPoints = [];
      for (let i = 0; i < path.length; i++) {
        pathPoints.push(path.getPoint(i));
      }
      expect(pathPoints).to.deep.equal(points);
      expect(path.simplificationRatio).to.equal(1);
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

    it(`should throw \'...is Not a Number\' if invalid tolerance is supplied`, function() {
      const path = new Path(points);
      const func = () => path.simplify('house');;
      expect(func.bind(func)).to.throw(`house is Not a Number`);
    })

  })

})


describe(`Test getters`, function() {

  const points = coords.map( c => new Point(c));

  it('get lngLats should produce the expected result', function() {
    const path = new Path(points);
    path.addParamToPoints('elev', elevs);
    expect(path.lngLats).to.deep.equal(points.map(p=>[p.lng, p.lat]));
  });

  it('get pointLikes should produce the expected result', function() {
    const path = new Path(points);
    path.addParamToPoints('elev', elevs);
    expect(path.pointLikes).to.deep.equal(coords);
  });

  it('get length should produce the expected result', function() {
    const path = new Path(points);
    path.addParamToPoints('elev', elevs);
    expect(path.length).to.deep.equal(points.length);
  });

  it('get bbox should produce the expected result', function() {
    const path = new Path(points);
    path.addParamToPoints('elev', elevs);
    expect(path.boundingBox).to.deep.equal({ minLng: -3.95615, maxLng: -3.94915, minLat: 51.21769, maxLat: 51.2194})
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

  it('get deltaDistance should produce the expected result', function() {
    const path = new Path(points);
    const expectedResult = [0];
    points.forEach( (_, i) => {
      if (i>0) {
        expectedResult.push(compareFuncs.p2p(points[i], points[i-1]));
      }
    })
    expect(path.deltaDistance.map(d=>d.toFixed(6))).to.deep.equal(expectedResult.map(d=>d.toFixed(6)));
  });

  
  it('get firstPoint should return the first point', function() {
    const path = new Path(points);
    expect(path.firstPoint).to.deep.equal(points[0]);
  });

  
  it('get lastPoint should return the last point', function() {
    const path = new Path(points);
    expect(path.lastPoint).to.deep.equal(points[points.length - 1]);
  });

})

