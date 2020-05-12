
const expect = require('chai').expect;
const Point = require('../src/class-point').Point;
const PointError = require('../src/class-point').PointError;



describe(`Error checking Point Methods `, function() {

  it('should return error if attempt to use get on empty inastance', function() {
    const point = new Point();
    const func = () => point.lat;
    // console.log(func());
    expect(func.bind(func)).to.throw(`lat has not been set on the instance`);


  });

})
