
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
