//* *************************** IMPORTS **********************************/

const jwt = require('jsonwebtoken');
const config = require('../../../config');

//* *************************** GLOBALS **********************************/

/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable no-multiple-empty-lines */











//* *************************** AUTHENTICATION **********************************/

/**
 * `authenticate`
 * auth token is valid or not
 * @param options
 */
module.exports.authenticate = ((options) => new Promise((resolve, reject) => {
  const { reqBody } = options;
  let { authToken } = reqBody;
  authToken = authToken.substr(config.AUTH_JWT_SKIP_CHARS);
  try {
    const tokenBody = jwt.verify(authToken, config.AUTH_JWT);
    resolve(tokenBody);
  } catch (error) {
    const errMsg = {
      code: 401,
      clientMsg: 'Invalid request',
      msg: 'Invalid auth token',
      body: error,
      errCode: 3,
    };
    reject(errMsg);
  }
}));

