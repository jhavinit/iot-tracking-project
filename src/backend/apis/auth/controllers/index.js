/* eslint-disable no-console */
/** ************************************ IMPORTS ******************************************* */

const jwt = require('jsonwebtoken');
const config = require('../../../config');
const AuthTask = require('../models/auth-schema');

/** ************************************ GLOBALS ******************************************* */

/* eslint-disable no-useless-return */
/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable no-multiple-empty-lines */

/**
 * `authenticate`
 * returns auth token and user basic info
 * @param options
 * @param callback (err, info, next)
 */
module.exports.authenticate = (async (options, callback) => {
  const { reqBody } = options;
  const { username } = reqBody;
  const { password } = reqBody;
  const { loginType } = reqBody;
  try {
    /**
     * check 1: check user exists or not
     */
    const user = await AuthTask.getUserByUsername({ username });
    if (user) {
      /**
       * check 2: compare password
       */
      const result = await AuthTask.comparePassword(
        { reqPassword: password, actualPassword: user.password },
      );
      if (result) {
        /**
         * set user to logged in state
         */
        if (loginType === 'web') {
          /**
           * if already logged in then check for session expiry
           */
          if (user.isWebLogin === true) {
            if ((((new Date().getTime()) - (user.loginTimeWebEpoc)) / 1000)
              >= config.SESSION_EXPIRY_PERIOD) {
              const loggedInResponse = await AuthTask.setUserLoggedIn({ username, loginType });
              if (loggedInResponse) {
                /**
                 * create token
                 */
                const token = jwt.sign(
                  {
                    payload: {
                      // eslint-disable-next-line dot-notation
                      userId: user['_id'],
                      name: user.name,
                    },
                  }, config.AUTH_JWT, { expiresIn: config.SESSION_EXPIRY_PERIOD },
                );
                const responseBody = {
                  token: `JWT ${token}`,
                  data: {
                    name: user.name,
                    dashboardVersionWeb: '1.0.0',
                  },
                };
                callback(null, 'Successfully authenticated user', responseBody);
                return;
              } else {
                callback('User not found', null, null);
                return;
              }
            } else {
              callback('You are logged in somewhere else, Please logout there and then try logging in here', null, null);
              return;
            }
          } else {
            const loggedInResponse = await AuthTask.setUserLoggedIn({ username, loginType });
            if (loggedInResponse) {
              /**
               * create token
               */
              const token = jwt.sign(
                {
                  payload: {
                    // eslint-disable-next-line dot-notation
                    userId: user['_id'],
                    name: user.name,
                  },
                }, config.AUTH_JWT, { expiresIn: config.SESSION_EXPIRY_PERIOD },
              );
              const responseBody = {
                token: `JWT ${token}`,
                data: {
                  name: user.name,
                  dashboardVersionWeb: '1.0.0',
                },
              };
              callback(null, 'Successfully authenticated user', responseBody);
              return;
            } else {
              callback('No such user', null, null);
              return;
            }
          }
        }
      } else {
        callback('Incorrect password', null, null);
        return;
      }
    } else {
      callback('Incorrect username', null, null);
      return;
    }
  } catch (error) {
    callback('Invalid request', null, null);
    return;
  }
});

/**
 * `register`
 * register user
 * @param options
 * @param callback (err, info, next)
 */
module.exports.register = (async (options, callback) => {
  const { reqBody } = options;
  const { username } = reqBody;
  const { password } = reqBody;
  const { name } = reqBody;

  const user = await AuthTask.getUserByUsername({ username });
  if (user) {
    callback('Please enter unique username', null);
    return;
  } else {
    await AuthTask.registerUser({
      name,
      username,
      password,
    });
    console.log('Successfully registered user');
    callback(null, 'Successfully registered user');
    return;
  }
});


/**
 * `unsetIsLoggedInFlag`
 * Unset login flag
 * @param options
 * @param callback (err, info, next)
 */
module.exports.unsetIsLoggedInFlag = (async (options, callback) => {
  const { tokenBody } = options;
  const { reqBody } = options;
  const { userId } = tokenBody.payload;
  const { loginType } = reqBody;
  /**
   * check 1: is user logged in
   */
  const user = await AuthTask.unsetLoginFlag({ userId, loginType });
  if (user) {
    callback(null, 'User can successfully logout');
    return;
  } else {
    callback('Invalid request', null);
    return;
  }
});
