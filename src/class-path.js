"use strict"
const geoFunctions = require('./functions.js');
const Point = require('./class-point.js').Point;

/**
 * Instantiated with an array of two or more Point instances - will throw error otherwise
 * 
 */
class Path{

  constructor(pointsArray) {

    this._checkForValidPointsArray(pointsArray);
    this.points = pointsArray;

  }

  _checkForValidPointsArray(pointsArray) {
    this._checkIsAnArray(pointsArray);
    this._checkAllElementsArePoints(pointsArray);
    this._checkTwoOrMore(pointsArray);
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

  _checkTwoOrMore(arr) {
    if (!arr.length > 1) {
      throw new PathError('Need two or more points to instantiate a Path');
    }
  }


  // addParamToPoints(parameter, valueArray) {
  //   this._checkParamArrayLength(valueArray);
  //   this.pointsArray.forEach( (p, i) => p.addParam(parameter, valueArray[i]) );
  // }

  // _checkParamArrayLength(array) {
  //   if ( array !== this.pointsArray.length) {
  //     throw new Error(`Parameter array of length ${array.length} cannot be added to pointsArray of length ${this.array.length}`);
  //   };
  // }

  // simplify(tol) {
  //   this.points = geoFunctions.simplify(this.points, tol);
  // }


  // get simpleLngLatsArray() {
  //   return this.points.map(p => [p.lng, p.lat]);
  // }


  // getParamArray(parameter) {
  //   return this.points.map( p => p.getParam(parameter) )
  // }


  // get cumDistance() {
  //   if (!this.dDistance) { this.dDistance = this.deltaDistance(); }
  //   return this.points.map( (_, i) => this.dDistance.slice(0, i + 1).reduce( (sum, d) => sum + d, 0) );
  // }


  // get deltaDistance() {
  //   return this.points.map( (_, i, pts) => i === 0 ? 0 : geoFunctions.p2p(pts[i], pts[i-1]) );
  // }


  // get length() {
  //   return this.points.length;
  // }


  // get boundingBox() {
  //   return new BoundingBox(this.pointsArray);
  // }


  // get distanceCovered() {
  //   return this.points.reduce( (d, _, i) => i === 0 ? 0 : d + geoFunctions.p2p(this.points[i] , this.points[i-1]), 0);
  // }

} 


class PathError extends Error{};


module.exports = {
  Path, PathError
}