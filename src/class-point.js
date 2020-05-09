"use strict"

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

module.exports = {
  Point, PointError
}