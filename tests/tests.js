
/**
 * To run: 'mocha tests'
 */

const expect = require('chai').expect;
const Point = require('../src/classes').Point;

const singlePointCoordsOnly = {"lat":51.2194,"lng":-3.94915}
const singlePointInclParams = {"lat":51.2194,"lng":-3.94915, "elev": 50, "HR": 136, "Cadence": 95};

describe(`Single Point Instance`, function() {

  pointA = new Point(singlePointCoordsOnly);
  outputParamsA = Object.keys(pointA).map(key => key.substring(1));

  it('expect instance of Point with coordinates only', function() {
    expect(pointA).to.satisfy(function(r) { return r instanceof Point});
  });

  it('Expect Point keys be be lat and lng', function() {
    expect(outputParamsA).deep.equal(['lat', 'lng']);
  });
  
});

describe(`Single Point Instance with numbers in strings`, function() {

  pointF = new Point({"lat":"51.2194","lng":'-3.94915'});
  outputParamsF = Object.keys(pointF).map(key => key.substring(1));

  it('expect instance of Point with coordinates only', function() {
    expect(pointF).to.satisfy(function(r) { return r instanceof Point});
  });

  it('Expect Point keys be be lat and lng', function() {
    expect(outputParamsF).deep.equal(['lat', 'lng']);
  });
  
});

describe(`Single Point Instance with multiple parameters`, function() {

  pointB = new Point(singlePointInclParams);
  inputParams = Object.keys(singlePointInclParams);
  outputParamsB = Object.keys(pointB).map(key => key.substring(1));
  // outputParams = Object.keys(point);
  
  it('Expect instance of Point', function() {
    expect(pointB).to.satisfy(function(r) { return r instanceof Point});
  });

  it('Expect Point keys to equal input keys', function() {
    expect(outputParamsB).deep.equal(inputParams);
  });

});


describe(`Add params to point instantiated only with coords`, function() {

  pointC = new Point(singlePointCoordsOnly);
  pointC.addParams({'elev': 56, "elev": 50, "HR": 136, "Cadence": 95})
  outputParamsC = Object.keys(pointC).map(key => key.substring(1));
  outputValuesC = Object.keys(pointC).map(key => pointC[key]);

  it('expect instance of Point', function() {
    expect(pointA).to.satisfy(function(r) { return r instanceof Point});
  });

  it('Expect Point keys be be lat, lng, elev, HR and Cadence', function() {
    expect(outputParamsC).deep.equal(['lat', 'lng', 'elev', 'HR', 'Cadence']);
  });
  
  it('Expect point to contain values provided', function() {
    expect(outputValuesC).deep.equal([51.2194, -3.94915, 50, 136, 95]);
  });

});


describe(`Delete params works as expected`, function() {

  pointD = new Point(singlePointInclParams);

  it('Expect correct params after delete with array', function() {
    pointD.deleteParams(['elev', 'Cadence']);
    outputParamsD = Object.keys(pointD).map(key => key.substring(1));
    expect(outputParamsD).deep.equal(['lat', 'lng', 'HR']);
    console.log(pointD)
  });

  it('Expect correct params after delete with listed params and nonexistant param ignored', function() {
    pointD.deleteParams('HR', 'power');
    outputParamsD = Object.keys(pointD).map(key => key.substring(1));
    expect(outputParamsD).deep.equal(['lat', 'lng']);
    console.log(pointD)
  });
  

  it('Expect to ignore attempt to delete lat or lng', function() {
    pointD.deleteParams('lng', 'lat');
    outputParamsD = Object.keys(pointD).map(key => key.substring(1));
    expect(outputParamsD).deep.equal(['lat', 'lng']);
    console.log(pointD)
  });
  

});

describe(`Getters for lat and long work ok`, function() {

  pointE = new Point(singlePointInclParams);

  it('Get lat', function() {
    expect(pointD.lat).equal(51.2194);
  });

  it('Get lng', function() {
    expect(pointD.lng).equal(-3.94915);
  });

});

describe(`Setters for lat and long work ok`, function() {

  pointG = new Point();

  it('Set lat', function() {
    pointG.lat = 35.2103;
    expect(pointG.lat).equal(35.2103);
  });

  it('Set lng', function() {
    pointG.lng = 135.2103;
    expect(pointG.lng).equal(135.2103);
    console.log(pointG);
  });

});

describe(`Get params works as expected`, function() {

  pointH = new Point(singlePointInclParams);

  it('Expect get to retun params from array', function() {
    expect(pointH.getParams(['elev', 'Cadence'])).deep.equal({"elev": 50, "Cadence": 95});
    console.log(pointH.getParams(['elev', 'Cadence']));
  });

  it('Expect get to return with listed params and nonexistant param ignored', function() {
    expect(pointH.getParams('power', 'lng', 'stride-length', 'HR')).deep.equal({"lng": -3.94915, "HR": 136});
    console.log(pointH.getParams('power', 'lng', 'stride-length', 'HR'));
    console.log(pointH.getParams('power', 'lng', 'stride-length', 'HR').HR)
  });
  
});
