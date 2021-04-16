/**
 * `trimStringInputs`
 * trim string inputs from request body
 * @param obj object
 */
module.exports.trimStringInputs = ((obj) => {
  Object.keys(obj).forEach((key) => {
    if (typeof (obj[key]) === 'string') {
      // eslint-disable-next-line no-param-reassign
      obj[key] = obj[key].trim();
    }
  });
});

/**
 * `ObjectLength`
 * object length
 * @param obj object
 * @returns length of object
 */
module.exports.ObjectLength = ((obj) => {
  try {
    let size = 0;
    // eslint-disable-next-line no-unused-vars
    Object.keys(obj).forEach((key) => {
      size += 1;
    });
    return size;
  } catch (error) {
    return 0;
  }
});
