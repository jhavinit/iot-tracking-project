/* eslint-disable no-console */
/** *************************************** IMPORTS ****************************************** */

const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('../../../config');

/** *************************************** GLOBALS ****************************************** */

/* eslint-disable no-useless-return */
/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable no-multiple-empty-lines */


















/** *************************************** SOURCE HEADER ************************************* */

/**
 * `sourceHeaderCheck`
 * check source header to be web or app
 * @param req
 * @param res
 * @param next
 */
module.exports.sourceHeaderCheck = ((req, res, next) => {
  if (!req.header('x-source')) {
    return res.status(401).json({ success: false, msg: 'Invalid request' });
  } else {
    if (req.header('x-source') === 'web' || req.header('x-source') === 'app') {
      next();
    } else {
      return res.status(401).json({ success: false, msg: 'Invalid request' });
    }
  }
});

/**
 * `appSourceHeaderCheck`
 * check source header to be app
 * @param req
 * @param res
 * @param next
 */
module.exports.appSourceHeaderCheck = ((req, res, next) => {
  if (!req.header('x-source')) {
    return res.status(401).json({ success: false, msg: 'Invalid request' });
  } else {
    if (req.header('x-source') === 'app') {
      next();
    } else {
      return res.status(401).json({ success: false, msg: 'Invalid request' });
    }
  }
});

/**
 * `webSourceHeaderCheck`
 * check source header to be web
 * @param req
 * @param res
 * @param next
 */
module.exports.webSourceHeaderCheck = ((req, res, next) => {
  if (!req.header('x-source')) {
    return res.status(401).json({ success: false, msg: 'Invalid request' });
  } else {
    if (req.header('x-source') === 'web') {
      next();
    } else {
      return res.status(401).json({ success: false, msg: 'Invalid request' });
    }
  }
});




















/** *************************************** AUTHENTICATION ************************************* */

/**
 * `authenticate`
 * authenticate user based on jwt token
 * @param req
 * @param res
 * @param next
 */
module.exports.authenticate = ((req, res, next) => {
  try {
    if (!req.header('x-auth-token')) {
      return res.status(400).json({ success: false, msg: 'Invalid request' });
    } else {
      const token = req.header('x-auth-token').substr(config.AUTH_JWT_SKIP_CHARS);
      const tokenBody = jwt.verify(token, config.AUTH_JWT);
      res.locals.tokenBody = tokenBody;
      next();
    }
  } catch (error) {
    console.log(error);
  }
});






















/** *************************************** SCHEMA CHECK ************************************* */

/**
 * `checkReqBodySchema`
 * check input req body schema
 * @param req
 * @param res
 * @param next
 */
module.exports.checkReqBodySchema = ((req, res, next) => {
  const schema = Joi.object(res.locals.schema);
  // eslint-disable-next-line no-unused-vars
  const { error, value } = schema.validate(res.locals.reqBody);
  if (error === undefined) {
    next();
  } else {
    return res.status(400).json(
      { success: false, msg: error.details[0].message },
    );
  }
});
