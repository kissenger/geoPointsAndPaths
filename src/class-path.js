"use strict"
const geoFun = require('./functions.js');
const Point = require('./class-point.js').Point;

/**
 * Instantiated with an array of two or more Point instances - will throw error otherwise
 */
class Path{

  constructor(pointsArray) {
    this._checkForValidInput(pointsArray);
    this._points = pointsArray;
  }

  /**
   * Getters and Setters
   */
  
  get lngLats() {
    return this._points.map(p => [p.lng, p.lat]);
  }

  
  get length() {
    return this._points.length;
  }


  get boundingBox() {
    return geoFun.boundingBox(this._points);
  }


  get distance() {
    return this._points.reduce( (d, _, i) => i === 0 ? 0 : d + geoFun.p2p(this._points[i] , this._points[i-1]), 0);
  }
  

  get cumulativeDistance() {
    const deltaDistance = this._points.map( (_, i, pts) => i === 0 ? 0 : geoFun.p2p(pts[i], pts[i-1]) );
    return this._points.map( (_, i) => deltaDistance.slice(0, i + 1).reduce( (sum, d) => sum + d, 0) );
  }

  /**
   * Public class methods
   */

  addParamToPoints(paramName, valueArray) {
    this._checkParamArrayLength(valueArray);
    this._points.forEach( (point, i) => point.addParams({[paramName]: valueArray[i]}) );
  }


  getParamFromPoints(paramName) {
    return this._points.map( point => {
      if (point.paramExists(paramName)) {
        return point.getParams(paramName)[paramName];
      } else {
        return null
      }
    })
  }


  simplify(tol) {
    this._points = geoFun.simplifyPath(this._points, tol);
  }


  getPoint(index) {
    this._checkPointExists(index);
    return this._points[index];
  }


  /**
   * Private class methods
   */

  _checkForValidInput(pointsArray) {
    this._checkIsAnArray(pointsArray);
    this._checkAllElementsArePoints(pointsArray);
    this._checkTwoOrMorePoints(pointsArray);
  }


  _checkIsAnArray(thing) {
    if (! (thing instanceof Array)) {
      throw new PathError('Input not an array');
    }
  }


  _checkAllElementsArePoints(arr) {
    if (!arr.every( point => point instanceof Point)) {
      throw new PathError('Array of Point instances expected to initialise');
    }
  }


  _checkTwoOrMorePoints(arr) {
    if (!(arr.length > 1)) {
      throw new PathError('Need two or more points to instantiate a Path');
    }
  }


  _checkParamArrayLength(array) {
    if ( array.length !== this._points.length) {
      throw new PathError(`Parameter array of length ${array.length} cannot be added to instance of ${this._points.length} points`);
    };
  }


  _checkPointExists(index) {
    if ( !this._points[index] ) {
      throw new PathError(`Requested point at index ${index} does not exist`);
    }
  }

} 


class PathError extends Error{};


module.exports = {
  Path, PathError
}