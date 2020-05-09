"use strict"
const geoFunctions = require('./functions.js');

/**
 * Can be instantiated with:
 * - Parameter list which *must* include lng and lat, in the form {"lat":51.2194,"lng":-3.94915, "elev": 50, "HR": 136, "Cadence": 95}
 * - Empty, allowing for lat and long to be set through getters
 * Public methods:
 * - getters and setters for lat and lng
 * - getParams - returns key/value pairs for provided parameters that exist on the instance
 * - deleteParams - deletes provdided parameters that exist in the instance, except lat and lng which cannot be deleted
 * - addParams - adds provided key/value pairs to the instance if they exist - DOES NOT OVERWRITE so need to delete first if update is reqd
 */
class Point {

  constructor(params) {
    if (params) {
      this._checkForValidLatAndLng(params);
      this.addParams(params);
    }
  }


  get lng() { 
    if (this._keyExists('lng')) {
      return this._lng;
    } else {
      return new PointError('lng has not been set on the instance')
    }
  }
  

  get lat() { 
    if (this._keyExists('lat')) {
      return this._lat;
    } else {
      return new PointError('lat has not been set on the instance')
    }
  }


  set lng(value) { 
    this._checkLngValue(value);
    this._lng = value; 
  }
  

  set lat(value) { 
    this._checkLatValue(value);
    this._lat = value; 
  }


  addParams(params) {
    Object.keys(params).forEach( key => {
      if (!this._keyExists(key)) {
        this['_' + key] = params[key];
      }
    });
  }


  deleteParams() {
    const args = arguments[0] instanceof Array ? arguments[0] : [...arguments];
    args.forEach( key => {
      if (!this._keyIsLatOrLng(key)) {
        delete this['_' + key];
      }
    })
  }


  getParams() {
    const args = arguments[0] instanceof Array ? arguments[0] : [...arguments];
    const result = {};
    args.forEach( key => {
      if (this._keyExists(key)) {
        result[key] = this['_' + key];
      }
    })
    return result;
  }


  _checkForValidLatAndLng(params) {
    const keys = Object.keys(params);
    this._checkForLngKey(keys);
    this._checkForLatKey(keys);
    this._checkLatValue(params.lat);
    this._checkLngValue(params.lng); 
  }

  _checkForLatKey(keys) {
    if ( keys.indexOf('lat') < 0 ) {
      throw new PointError('Lat parameter missing but required to instantiate Point with parameters');
    }
  }

  _checkForLngKey(keys) {
    if ( keys.indexOf('lng') < 0 ) {
      throw new PointError('Lng parameter missing but required to instantiate Point with parameters');
    }
  }

  _checkLatValue(value) {
    if (value < -90 || value > 90) {
      throw new PointError('Lat value out of bounds');
    };
  }

  _checkLngValue(value) {
    if (value < -180 || value > 180) {
      throw new PointError('Lng value out of bounds');
    }
  }

  _keyExists(key) {
    return this.hasOwnProperty('_' + key)
  }

  _keyIsLatOrLng(key) {
    return key === 'lat' || key === 'lng';
  }


};

class PointError extends Error{};
class PathError extends Error{};

/**************************************************************************************
 *
 *
 * @export
 * @class Path
 **************************************************************************************/
class Path{

  constructor(pointsArray) {
    this.points = pointsArray;
    this.dDistance = null;  // will be set on the class when called by user
  }

  addParamToPoints(parameter, valueArray) {
    this._checkParamArrayLength(valueArray);
    this.pointsArray.forEach( (p, i) => p.addParam(parameter, valueArray[i]) );
  }

  _checkParamArrayLength(array) {
    if ( array !== this.pointsArray.length) {
      throw new Error(`Parameter array of length ${array.length} cannot be added to pointsArray of length ${this.array.length}`);
    };
  }


  simplify(tol) {
    this.points = geoFunctions.simplify(this.points, tol);
  }


  get simpleLngLatsArray() {
    return this.points.map(p => [p.lng, p.lat]);
  }


  getParamArray(parameter) {
    return this.points.map( p => p.getParam(parameter) )
  }


  get cumDistance() {
    if (!this.dDistance) { this.dDistance = this.deltaDistance(); }
    return this.points.map( (_, i) => this.dDistance.slice(0, i + 1).reduce( (sum, d) => sum + d, 0) );
  }


  get deltaDistance() {
    return this.points.map( (_, i, pts) => i === 0 ? 0 : geoFunctions.p2p(pts[i], pts[i-1]) );
  }


  get length() {
    return this.points.length;
  }


  get boundingBox() {
    return new BoundingBox(this.pointsArray);
  }


  get distanceCovered() {
    return this.points.reduce( (d, _, i) => i === 0 ? 0 : d + geoFunctions.p2p(this.points[i] , this.points[i-1]), 0);
  }

} // Path class



/**************************************************************************************
 * Class BoundingBox to ensure formatting and provide methods for bounding boxes
 * @export
 * @class BoundingBox
 ***************************************************************************************/
class BoundingBox {

  /**
   * @param {Array[Point]} pointsArray
   * @memberof BoundingBox
   */
  constructor(arrayOfPoints) {

    this.bbox = arrayOfPoints.reduce( (b, p) => {
      minLng = p.lng < b.minLng ? p.lng : b.minLng;
      maxLng = p.lng > b.maxLng ? p.lng : b.maxLng;
      minLat = p.lat < b.minLat ? p.lat : b.minLat;
      maxLat = p.lat > b.maxLat ? p.lat : b.maxLat;
    }, { minLng: 180, minLat: 90, maxLng: -180, maxLat: -90 });

  }

/**
 * Determines if point lies within bounding box
 * @param {Point} point point as instance of Point class
 * @returns {boolean} true if point is in box, false otherwise
 */
  isPointInside(point) {

    if ( !point instanceof Point) {
      throw new Error(`isPointInside() argument not an instance of Point class`);
    }

    return  point.lng < this.bbox[2] &&  /* lng is less than maxLng */
            point.lng > this.bbox[0] &&  /* lng is greater than minLng */
            point.lat < this.bbox[3] &&  /* lat is less than maxLat */
            point.lat > this.bbox[1];    /* lat is greater than minLat */
  }

}  // Bounding Box class


/**
 * Returns an outer bounding box for a given array of inner bounding boxes
 * @param {Array<BoundingBox>} arrayOfBboxes
 */
function outerBoundingBox(arrayOfBboxes) {

  if ( !arrayOfBboxes.every( bbox => bbox instanceof BoundingBox )) {
    throw new Error(`outerBoundingBox argument not an instance of BoundingBox class`);
  }

  // reduce the bounding boxes into an array of point pairs
  const pointsArr = arrayOfBboxes.reduce( (arr, box) => {
    arr.push(new Point({lat: box.minLat, lng: box.minLng}));
    arr.push(new Point({lat: box.maxLat, lng: box.maxLng}));
  }, [] );

  // and instantiate an new Bounding box with the result
  return new BoundingBox(pointsArr);

}

module.exports = {
  Path, Point, BoundingBox, outerBoundingBox, PointError, PathError
}