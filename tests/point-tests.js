
/**
 * To run: 'mocha point-tests'
 */

const expect = require('chai').expect;
const Point = require('../src/class-point').Point;

// some param strings for reference
// {"lat":51.2194,"lng":-3.94915}
// {"lat":51.2194,"lng":-3.94915, "elev": 50, "HR": 136, "Cadence": 95};

/**
 * Point Instantiation
 */
describe(`Correctly instantiating Point`, function() {

  describe(`Using param array with only lng/lat keys`, function() {

    const point = new Point({"lat":51.2194,"lng":-3.94915});

    it('should return an instance of Point', function() {
      expect(point).to.satisfy(function(r) { return r instanceof Point});
    });

    it('should have keys \'lat\' and \'lng\' only', function() {
      expect(Object.keys(point).map(key => key.substring(1))).deep.equal(['lat', 'lng']);
    });

    it('should have lat = 51.2194', function() {
      expect(point.lat).equal(51.2194);
    });

    it('should have lng = -3.94915', function() {
      expect(point.lng).equal(-3.94915);
    });
  
    it('should not throw error if instantiated with number-like string', function() {
      expect(new Point({"lat":"51.2194","lng":'-3.94915'})).to.satisfy(function(r) { return r instanceof Point});
    });

  })

  describe(`Using lngLat array`, function() {

    const point = new Point([-3.94915, 51.2194]);

    it('should return an instance of Point', function() {
      expect(point).to.satisfy(function(r) { return r instanceof Point});
    });

    it('should have keys \'lat\' and \'lng\' only', function() {
      expect(Object.keys(point).map(key => key.substring(1))).deep.equal(['lat', 'lng']);
    });

    it('should have lat = 51.2194', function() {
      expect(point.lat).equal(51.2194);
    });

    it('should have lng = -3.94915', function() {
      expect(point.lng).equal(-3.94915);
    });
  
    it('should not throw error if instantiated with number-like string', function() {
      expect(new Point(['-3.94915', '51.2194'])).to.satisfy(function(r) { return r instanceof Point});
    });

    it('should throw an error if array is not valid', function() {
      const func = () => new Point([-3.94915]);
      expect(func.bind(func)).to.throw('lnglat needs to be an array of length 2');
    });


  })


  describe(`Using param array including other parameters`, function() {

    const params = {"lat":51.2194,"lng":-3.94915, "elev": 50, "HR": 136, "Cadence": 95};
    const point = new Point(params);
    const paramsKeys = Object.keys(params);
    const expectedPointKeys = Object.keys(point).map(key => key.substring(1));
    
    it('should return instance of Point', function() {
      expect(point).to.satisfy(function(r) { return r instanceof Point});
    });

    it('should have all the expected keys', function() {
      expect(expectedPointKeys).deep.equal(paramsKeys);
    });
  
  })


  describe(`Instantiating an empty instance `, function() {

    const point = new Point();
    
    it('should return instance of Point', function() {
      expect(point).to.satisfy(function(r) { return r instanceof Point});
    });
  
  })


  describe(`Check error returns for incorrectly instantiating a Point`, function() {

    it('should return an instance of PointError if keys do not contain lng is not passed', function() {
      const func = () => new Point({lat:51.2194,"lon":-3.94915});
      expect(func.bind(func)).to.throw('Lng parameter missing');
    });

    it('should return an instance of PointError if keys do not contain lat is not passed', function() {
      const func = () => new Point({"lng":-3.94915});
      expect(func.bind(func)).to.throw('Lat parameter missing');
    });

    it('should return an instance of PointError if lng is not a valid value', function() {
      const func = () => new Point({"lat":51.2194,"lng":-320.94915});
      expect(func.bind(func)).to.throw('Lng value out of bounds');
    });

    it('should return an instance of PointError if lng is not a valid type', function() {
      const func = () => new Point({"lat":51.2194,"lng":'cheese'});
      expect(func.bind(func)).to.throw('Lng is NaN');
    });

    it('should return an instance of PointError if let is not a valid value', function() {
      const func = () => new Point({"lat":541.2194,"lng":-33.94915});
      expect(func.bind(func)).to.throw('Lat value out of bounds');
    });

    it('should return an instance of PointError if lng is not a valid type', function() {
      const func = () => new Point({"lat":'house',"lng":-33.94915});
      expect(func.bind(func)).to.throw('Lat is NaN');
    });

    it('should throw error if empty array is passed', function() {
      const func = () => new Point([]);
      expect(func.bind(func)).to.throw('lnglat needs to be an array of length 2');
    });

    it('should throw error if empty object is passed', function() {
      const func = () => new Point({});
      expect(func.bind(func)).to.throw('Lng parameter missing');
    });



    
  });
});


/**
 * Point Methods
 */
describe(`Checking Point methods`, function() {

  describe(`Adding params to point instantiated with params`, function() {

    const point = new Point({"lat":51.2194,"lng":-3.94915});
    point.addParams({'elev': 56, "elev": 50, "HR": 136, "Cadence": 95})
    const expectedPointKeys = Object.keys(point).map(key => key);
    const expectedPointValues = Object.keys(point).map(key => point[key]);

    it('expect instance of Point', function() {
      expect(point).to.satisfy(function(r) { return r instanceof Point});
    });

    it('Expect Point keys be be lat, lng, elev, HR and Cadence', function() {
      expect(expectedPointKeys).deep.equal(['_lat', '_lng', '_elev', '_HR', '_Cadence']);
    });
    
    it('Expect point to contain values provided', function() {
      expect(expectedPointValues).deep.equal([51.2194, -3.94915, 50, 136, 95]);
    });

  });


  describe(`Delete params works as expected`, function() {

    const point = new Point({"lat":51.2194,"lng":-3.94915, "elev": 50, "HR": 136, "Cadence": 95});

    it('Expect correct params after delete with array', function() {
      point.deleteParams(['elev', 'Cadence']);
      const expectedPointKeys = Object.keys(point).map(key => key);
      expect(expectedPointKeys).deep.equal(['_lat', '_lng', '_HR']);
    });

    it('Expect correct params after delete with listed params and nonexistant param ignored with no error', function() {
      point.deleteParams('HR', 'power');
      const expectedPointKeys = Object.keys(point).map(key => key);
      expect(expectedPointKeys).deep.equal(['_lat', '_lng']);
    });
  
    it('Expect to ignore attempt to delete lat or lng', function() {
      point.deleteParams('lng', 'lat');
      const expectedPointKeys = Object.keys(point).map(key => key);
      expect(expectedPointKeys).deep.equal(['_lat', '_lng']);
    });

  })

  describe(`Get params works as expected`, function() {

    const point = new Point({"lat":51.2194,"lng":-3.94915, "elev": 50, "HR": 136, "Cadence": 95});

    it('should return correct params when request is in array', function() {
      expect(point.getParams(['elev', 'Cadence'])).deep.equal({"elev": 50, "Cadence": 95});
    });

    it('should return correct params when request in in param list', function() {
      expect(point.getParams('lng', 'HR')).deep.equal({"lng": -3.94915, "HR": 136});
    });

    it('should ignore any params not on the instance without throwing error', function() {
      expect(point.getParams('lng', 'calories-burned', 'HR')).deep.equal({"lng": -3.94915, "HR": 136});
    });
    
  });


  describe(`Getters for lat and long work ok`, function() {

    const point = new Point({"lat":51.2194,"lng":-3.94915, "elev": 50, "HR": 136, "Cadence": 95});

    it('Get lat returns correct value after lat is set', function() {
      expect(point.lat).equal(51.2194);
    });

    it('Get lng returns correct value after lng is set', function() {
      expect(point.lng).equal(-3.94915);
    });

  });

  describe(`Setters for lat and long work ok`, function() {

    const point = new Point();

    it('Set lat', function() {
      point.lat = 35.2103;
      expect(point.lat).equal(35.2103);
    });

    it('Set lng', function() {
      point.lng = 135.2103;
      expect(point.lat).equal(35.2103);
      expect(point.lng).equal(135.2103);
    });

    it('Set lngLat', function() {
      point.lngLat = [-4.5678, 56.3543];
      expect(point.lat).equal(56.3543);
      expect(point.lng).equal(-4.5678);
    });

  });

  describe(`Error checking Point Methods `, function() {

    it('should throw error if getting before setting lat', function() {
      const point = new Point();
      const func = () => point.lat;
      expect(func.bind(func)).to.throw(`param lat does not exist`);
    });

    it('should throw error if getting before setting lng', function() {
      const point = new Point();
      const func = () => point.lng;
      expect(func.bind(func)).to.throw(`param lng does not exist`);
    });

  })

})


/**
 * Point use cases
 */  

describe(`Checking Point use cases`, function() {

  describe(`Add and get param with space in key name`, function() {

    const point = new Point({"lat":51.2194,"lng":-3.94915});
    point.addParams({'elev climbed': 56});
    const expectedPointKeys = Object.keys(point).map(key => key);

    it('Expect Point keys to be lat, lng and \'elev climbed\'', function() {
      expect(expectedPointKeys).deep.equal(['_lat', '_lng', '_elev climbed']);
    });
    
    it('should be ok to get param with space in name', function() {
      expect(point.getParams('elev climbed')).deep.equal({"elev climbed": 56});
    });

  });

})