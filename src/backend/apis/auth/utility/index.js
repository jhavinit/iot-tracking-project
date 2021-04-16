module.exports.trimStringInputs = ((obj) => {
  Object.keys(obj).forEach((key) => {
    if (typeof (obj[key]) === 'string') {
      // eslint-disable-next-line no-param-reassign
      obj[key] = obj[key].trim();
    }
  });
});
