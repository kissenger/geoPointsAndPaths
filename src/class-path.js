"use strict"
const geoFunctions = require('./functions.js');
const Point = require('./class-point.js').Point;
const BoundingBox = require('./class-bbox.js').BoundingBox;

/**
 * Instantiated with an array of two or more Point instances - will throw error otherwise
 * 
 */
class Path{

  constructor(pointsArray) {

    this._checkForValidInput(pointsArray);
    this._points = pointsArray;

  }

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
    if (!arr.length > 1) {
      throw new PathError('Need two or more points to instantiate a Path');
    }
  }


  _checkParamArrayLength(array) {
    if ( array.length !== this._points.length) {
      throw new PathError(`Parameter array of length ${array.length} cannot be added to instance of ${this._points.length} points`);
    };
  }

  
  get lngLats() {
    return this._points.map(p => [p.lng, p.lat]);
  }

  
  get length() {
    return this._points.length;
  }


  get boundingBox() {
    return new BoundingBox(this._points);
  }

  get distance() {
    return this._points.reduce( (d, _, i) => i === 0 ? 0 : d + geoFunctions.p2p(this._points[i] , this._points[i-1]), 0);
  }


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

  // simplify(tol) {
  //   this.points = geoFunctions.simplify(this.points, tol);
  // }


  // get cumDistance() {
  //   if (!this.dDistance) { this.dDistance = this.deltaDistance(); }
  //   return this.points.map( (_, i) => this.dDistance.slice(0, i + 1).reduce( (sum, d) => sum + d, 0) );
  // }


  // get deltaDistance() {
  //   return this.points.map( (_, i, pts) => i === 0 ? 0 : geoFunctions.p2p(pts[i], pts[i-1]) );
  // }




} 


class PathError extends Error{};


module.exports = {
  Path, PathError
}