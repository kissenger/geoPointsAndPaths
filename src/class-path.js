"use strict"
const geoFun = require('./functions.js');
const Point = require('./class-point.js').Point;

/**
 * Instantiated with an array of two or more Point instances - will throw error otherwise
 */
class Path{

  constructor(input) {
    
    this._checkForValidInput(input);
    this._points = this._getPointsFromInput(input);
    this._originalLength = this.length;
  }

  /**
   * Getters and Setters
   */
  
  get lngLats() {
    return this._points.map(p => [p.lng, p.lat]);
  }

  get pointLikes() {
    return this._points.map(p => ({lng: p.lng, lat: p.lat}) )
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
    const deltaDistance = this.deltaDistance;
    return this._points.map( (_, i) => deltaDistance.slice(0, i + 1).reduce( (sum, d) => sum + d, 0) );
  }


  get deltaDistance() {
    return this._points.map( (_, i, pts) => i === 0 ? 0 : geoFun.p2p(pts[i], pts[i-1]) );
  } 

  get simplificationRatio() {
    return  this.length / this._originalLength;
  }

  get firstPoint() {
    return this.getPoint(0);
  }

  get lastPoint() {
    return this.getPoint(this.length - 1);
  }

  /**
   * Public class methods
   */

  addParam(paramName, valueArray) {
    this._checkParamArrayLength(valueArray);
    this._points.forEach( (point, i) => point.addParams({[paramName]: valueArray[i]}) );
  }


  deleteParam(paramName) {
    this._points.forEach( (point, i) => point.deleteParams(paramName) );
  }


  getParam(paramName) {
    if (this.isParamExistsOnAnyPoint(paramName)) {
      return this._points.map( point => {
        if (point.paramExists(paramName)) {
          return point.getParams(paramName)[paramName];
        } else {
          return null
        }
      })
    } else {
      return
    }
  }


  simplify(tol) {
    const simplifyResult = geoFun.simplifyPath(this._points, tol);
    this._points = simplifyResult.points;
    this._simplificationRatio = simplifyResult.ratio;
  }


  getPoint(index) {
    this._checkPointExists(index);
    return this._points[index];
  }

  
  isParamExistsOnAnyPoint(param) {
    return this._points.some( point => point.hasOwnProperty('_' + param));
  }

  


  /**
   * Private class methods
   */

   _getPointsFromInput(input) {
    if (this._isArrayOfLngLats(input)) {
      return input.map( lngLat => new Point(lngLat));

    } else if (this._isArrayOfPoints(input)) {
      return input;
      
    } else if (this._isArrayOfPointLikes(input)) {
      return input.map( pointLike => new Point(pointLike));

    } else {
      throw new PathError('Cannot determine type of input');
    }
   }


  _isArrayOfLngLats(input) {
    return input.every( item => item instanceof Array && item.length === 2)
  }
  
  _isArrayOfPoints(input) {
    return input.every( item => item instanceof Point)
  }
  
  _isArrayOfPointLikes(input) {
    return input.every( item => item.hasOwnProperty('lat') && item.hasOwnProperty('lng'))
  }


  _checkForValidInput(input) {
    this._checkIsAnArray(input);
    this._checkTwoOrMorePoints(input);
  }

  _checkIsAnArray(thing) {
    if (! (thing instanceof Array)) {
      throw new PathError('Input not an array');
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