"use strict"

/**
 * Can be instantiated with:
 * - Parameter list which *must* include lng and lat, in the form {"lat":51.2194,"lng":-3.94915, "elev": 50, "HR": 136, "Cadence": 95}
 * - An array of LngLat in the form [lng, lat];
 * - Empty, allowing for lat and long to be set through getters
 * Public methods:
 * - getters and setters for lat and lng
 * - getParams - returns key/value pairs for provided parameters that exist on the instance
 * - deleteParams - deletes provdided parameters that exist in the instance, except lat and lng which cannot be deleted
 * - addParams - adds provided key/value pairs to the instance if they exist - DOES NOT OVERWRITE so need to delete first if update is reqd
 */

class Point {

  /**
   * @class Point class to store coordinates and other name parameters associated with the point
   * @param {*} params 
   */
  constructor(params) {
    if (params) {
      if (params instanceof Array) {
        this._checkValidLngLatArray(params);
        this._lat = params[1];        
        this._lng = params[0];
      } else {
        this._checkValidKeyValueObject(params);
        this.addParams(params);
      }

    }
  }

  /**
   * Getters and Setters
   */

  get lng() { 
    this._checkParamExists('lng');
    return this._lng;
  }
  

  get lat() { 
    this._checkParamExists('lat');
    return this._lat;
  }


  set lng(value) { 
    this._checkLngValue(value);
    this._lng = value; 
  }
  

  set lat(value) { 
    this._checkLatValue(value);
    this._lat = value; 
  }


  set lngLat(value) {
    this._checkValidLngLatArray(value)
    this._lng = value[0];
    this._lat = value[1];
  }


  /**
   * Public class methods
   */

  /**
   * Add a named parameter to the Point instance.  Will not overwrite if key already exists.
   * @param {Object} params list of key/value pairs to add to point eg {elev: 53}
   */
  addParams(params) {
    this._checkParams(params);
    Object.keys(params).forEach( key => {
      if (!this.paramExists(key)) {
        this['_' + key] = params[key];
      }
    });
  }

  /**
   * Delete a named parameter from Point instance.  Ignore without error if key does not exist.
   * Accepts an array or lit of keys to delete eg 'elev', 'HR' or ['elev', 'HR'] are acceptable
   */
  deleteParams() {
    const args = arguments[0] instanceof Array ? arguments[0] : [...arguments];
    args.forEach( key => {
      if (!this._keyIsLatOrLng(key)) {
        delete this['_' + key];
      }
    })
  }

  /**
   * Get a specified parameter from the instance.
   * Accepts an array or lit of keys to delete eg 'elev', 'HR' or ['elev', 'HR'] are acceptable
   * @returns key value pairs for each key that exists eg {'HR': 75, 'elev': 0}
   */
  getParams() {
    const args = arguments[0] instanceof Array ? arguments[0] : [...arguments];
    const result = {};
    args.forEach( key => {
      if (this.paramExists(key)) {
        result[key] = this['_' + key];
      }
    })
    return result;
  }

  /**
   * test for the presence of a spcified parameter on the instance
   * @param {string} key name of the parameter to be found
   * @returns true or false
   */
  paramExists(key) {
    return this.hasOwnProperty('_' + key)
  }


  /**
   * Private class methods
   */

  _checkParamExists(param) {
     if (!this.paramExists(param)) {
       throw new PointError(`param ${param} does not exist`);
     }
  }

  _checkValidLngLatArray(thing) {
    if ( !(thing instanceof Array)) {
      throw new PointError('lnglat needs to be an array');
    }
    if ( thing.length !== 2) {
      throw new PointError('lnglat needs to be an array of length 2');
    }    
  }


  _checkParams(params) {
    if (params instanceof Array) {
      throw new PointError('params should not be an array');
    }
    if (!(params instanceof Object)) {
      throw new PointError('params should be an object');
    }
  }

   
  _checkValidKeyValueObject(params) {
    const keys = Object.keys(params);
    this._checkForLngKey(keys);
    this._checkForLatKey(keys);
    this._checkLatValue(params.lat);
    this._checkLngValue(params.lng); 
  }


  _checkForLatKey(keys) {
    if ( keys.indexOf('lat') < 0 ) {
      throw new PointError('Lat parameter missing');
    }
  }


  _checkForLngKey(keys) {
    if ( keys.indexOf('lng') < 0 ) {
      throw new PointError('Lng parameter missing');
    }
  }


  _checkLatValue(value) {
    if (isNaN(value)) {
      throw new PointError('Lat is NaN');
    }
    if (value < -90 || value > 90) {
      throw new PointError('Lat value out of bounds');
    };
  }


  _checkLngValue(value) {
    if (isNaN(value)) {
      throw new PointError('Lng is NaN');
    }    
    if (value < -180 || value > 180) {
      throw new PointError('Lng value out of bounds');
    }
  }


  _keyIsLatOrLng(key) {
    return key === 'lat' || key === 'lng';
  }


};


class PointError extends Error{};


module.exports = {
  Point, PointError
}