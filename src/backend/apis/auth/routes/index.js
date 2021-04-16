/** ************************************ IMPORTS ******************************************* */

const express = require('express');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const controller = require('../controllers');
const middleware = require('../middlewares');
const utility = require('../utility');

/** ************************************ GLOBALS ******************************************* */

/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable no-multiple-empty-lines */

/**
 * `router`
 * app router
 */
const router = express.Router();















/** ************************************ AUTHENTICATION ************************************* */

/**
 * /v1/authenticate
 * authenticate user
 */
router.post('/v1/authenticate',
  middleware.sourceHeaderCheck,
  (req, res, next) => {
    const reqBody = {
      username: req.body.username,
      password: req.body.password,
      loginType: req.header('x-source'),
    };
    const schema = {
      username: Joi
        .string()
        .min(4)
        .max(100)
        .required()
        .empty()
        .messages({
          'string.base': 'Invalid Username or Passsword',
          'string.empty': 'Invalid Username or Passsword',
          'string.min': 'Invalid Username or Passsword',
          'string.max': 'Invalid Username or Passsword',
          'any.required': 'Invalid Username or Passsword',
        }),
      password: Joi
        .string()
        .min(8)
        .max(100)
        .required()
        .empty()
        .messages({
          'string.base': 'Invalid Username or Password',
          'string.empty': 'Invalid Username or Password',
          'string.min': 'Invalid Username or Password',
          'string.max': 'Invalid Username or Password',
          'any.required': 'Invalid Username or Password',
        }),
      loginType: Joi
        .string()
        .required()
        .empty()
        .valid('web', 'app')
        .messages({
          'string.base': 'Invalid login type',
          'string.empty': 'Invalid login type',
          'any.required': 'Invalid login type',
        }),
    };
    utility.trimStringInputs(reqBody);
    res.locals.reqBody = reqBody;
    res.locals.schema = schema;
    next();
  },
  middleware.checkReqBodySchema,
  (req, res) => {
    const { reqBody } = res.locals;
    const options = { reqBody };
    controller.authenticate(options, (err, info, next) => {
      if (err) {
        return res.status(401).json({ success: false, msg: err });
      } else {
        return res.status(200).json({ success: true, msg: info, content: next });
      }
    });
  });


/**
 * /v1/register
 * register user
 */
router.post('/v1/register',
  middleware.sourceHeaderCheck,
  (req, res, next) => {
    const reqBody = {
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      loginType: req.header('x-source'),
    };
    const schema = {
      name: Joi
        .string()
        .min(4)
        .max(100)
        .required()
        .empty()
        .messages({
          'string.base': 'Invalid name',
          'string.empty': 'Invalid name',
          'string.min': 'Invalid name',
          'string.max': 'Invalid name',
          'any.required': 'Invalid name',
        }),
      username: Joi
        .string()
        .min(4)
        .max(100)
        .required()
        .empty()
        .messages({
          'string.base': 'Invalid Username',
          'string.empty': 'Invalid Username',
          'string.min': 'Invalid Username',
          'string.max': 'Invalid Username',
          'any.required': 'Invalid Username',
        }),
      password: Joi
        .string()
        .min(8)
        .max(100)
        .required()
        .empty()
        .messages({
          'string.base': 'Invalid Password',
          'string.empty': 'Invalid Password',
          'string.min': 'Invalid Password',
          'string.max': 'Invalid Password',
          'any.required': 'Invalid Password',
        }),
      loginType: Joi
        .string()
        .required()
        .empty()
        .valid('web', 'app')
        .messages({
          'string.base': 'Invalid login type',
          'string.empty': 'Invalid login type',
          'any.required': 'Invalid login type',
        }),
    };
    utility.trimStringInputs(reqBody);
    res.locals.reqBody = reqBody;
    res.locals.schema = schema;
    next();
  },
  middleware.checkReqBodySchema,
  (req, res) => {
    const { reqBody } = res.locals;
    const options = { reqBody };
    controller.register(options, (err, info) => {
      if (err) {
        return res.status(401).json({ success: false, msg: err });
      } else {
        return res.status(200).json({ success: true, msg: info });
      }
    });
  });


/**
 * /v1/logout
 * unset login flag
 */
router.post('/v1/logout',
  middleware.sourceHeaderCheck,
  middleware.authenticate,
  (req, res, next) => {
    const reqBody = {
      loginType: req.header('x-source'),
    };
    const schema = {
      loginType: Joi
        .string()
        .valid('web', 'app')
        .required()
        .empty()
        .messages({
          'string.base': 'Invalid login type',
          'string.empty': 'Invalid login type',
          'string.min': 'Invalid login type',
          'string.max': 'Invalid login type',
          'any.required': 'Invalid login type',
        }),
    };
    res.locals.schema = schema;
    res.locals.reqBody = reqBody;
    next();
  },
  middleware.checkReqBodySchema,
  (req, res) => {
    const { reqBody } = res.locals;
    const { tokenBody } = res.locals;
    const options = { reqBody, tokenBody };
    controller.unsetIsLoggedInFlag(options, (err, info) => {
      if (err) {
        return res.status(401).json({ success: false, msg: err });
      } else {
        return res.status(200).json({ success: true, msg: info });
      }
    });
  });

module.exports = router;
