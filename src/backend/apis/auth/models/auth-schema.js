/** ************************************ IMPORTS ******************************************* */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/** ************************************ GLOBALS ******************************************* */

/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable no-multiple-empty-lines */

/**
 * mongoose configuration
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

/**
 * `collection`
 * collection details
 */
const collection = {
  name: 'users',
  schema: mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  }),
};

/**
 * schema object
 */
const AuthTask = mongoose.model(collection.name, collection.schema);
module.exports = mongoose.model(collection.name, collection.schema);











/** ************************************ UPDATE EMAIL ******************************************* */

/**
 * `updateEmail`
 * update email
 * @param options
 */
module.exports.updateEmail = ((options) => new Promise((resolve, reject) => {
  const { userId } = options;
  const { email } = options;
  const find = { _id: userId };
  const update = { $set: { 'emails.$[].active': false } };
  AuthTask.findOneAndUpdate(find, update)
    .then(() => {
      const addUpdate = { $addToSet: { emails: { email, active: true } } };
      AuthTask.findOneAndUpdate(find, addUpdate)
        .then((doc) => { resolve(doc); })
        .catch((err) => { reject(err); });
    })
    .catch((err) => {
      reject(err);
    });
}));










/** ************************************ CHANGE USERNAME ************************************* */

/**
 * `changeUsername`
 * update username
 * @param options
 */
module.exports.changeUsername = ((options) => new Promise((resolve, reject) => {
  const { userId } = options;
  const { username } = options;
  const find = { _id: userId };
  const update = { $set: { username } };
  AuthTask.findOneAndUpdate(find, update)
    .then((doc) => { resolve(doc); })
    .catch((err) => { reject(err); });
}));











/** ************************************ GET USER ******************************************* */

/**
 * `getUserByEmail`
 * get user by email
 * @param options
 */
module.exports.getUserByEmail = ((options) => new Promise((resolve, reject) => {
  const { email } = options;
  const find = {};
  const update = { emails: { $elemMatch: { email } } };
  AuthTask.find(find, update)
    .then((doc) => { resolve(doc); })
    .catch((err) => { reject(err); });
}));

/**
 * `getUserById`
 * get user by id
 * @param options
 */
module.exports.getUserById = ((options) => new Promise((resolve, reject) => {
  const { userId } = options;
  const find = { _id: userId };
  AuthTask.findOne(find)
    .then((doc) => { resolve(doc); })
    .catch((err) => { reject(err); });
}));

/**
 * `getUserByUsername`
 * get user by username
 * @param options
 */
module.exports.getUserByUsername = ((options) => new Promise((resolve, reject) => {
  const { username } = options;
  const find = { username };
  AuthTask.findOne(find)
    .then((doc) => { resolve(doc); })
    .catch((err) => { reject(err); });
}));










/** ************************************ ACCOUNTS ******************************************* */


/**
 * `isAccountPresent`
 * check if account present or not
 * @param options
 */
module.exports.isAccountPresent = ((options) => new Promise((resolve, reject) => {
  const { userId } = options;
  const { adminUserId } = options;
  const { role } = options;
  const { dashboardUserId } = options;
  const { dashboardId } = options;
  const find = { _id: userId };
  const projection = {
    accounts:
    {
      $elemMatch:
      {
        userId: dashboardUserId,
        dashboardId,
        role,
        adminUserId,
      },
    },
  };
  AuthTask.findOne(find, projection)
    .then((doc) => { resolve(doc); })
    .catch((err) => { reject(err); });
}));


















/** ************************************ CHECKS ******************************************* */

/**
 * `isEmailAlreadyAdded`
 * get user by email for particular user
 * @param options
 */
module.exports.isEmailAlreadyAdded = ((options) => new Promise((resolve, reject) => {
  const { email } = options;
  const { userId } = options;
  const find = { _id: userId };
  const update = { emails: { $elemMatch: { email, active: true } } };
  AuthTask.findOne(find, update)
    .then((doc) => { resolve(doc); })
    .catch((err) => { reject(err); });
}));

/**
 * `isEmailActive`
 * check if this email is active
 * @param options
 */
module.exports.isEmailActive = ((options) => new Promise((resolve, reject) => {
  const { email } = options;
  const find = {};
  const projection = {
    _id: 1,
    passwordChangeTimeEpoc: 1,
    accounts: 1,
    emails:
    {
      $elemMatch:
      {
        email,
        active: true,
      },
    },
  };
  AuthTask.find(find, projection)
    .then((doc) => { resolve(doc); })
    .catch((err) => { reject(err); });
}));





















/** ************************************ COMPARE PASSWORDS ************************************** */

/**
 * `comparePassword`
 * compare password for user
 * @param options
 */
module.exports.comparePassword = ((options) => new Promise((resolve, reject) => {
  const candidatePassword = options.reqPassword;
  const hash = options.actualPassword;
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) {
      reject(err);
    } else {
      resolve(isMatch);
    }
  });
}));
















/** ************************************ RESET ******************************************* */

/**
 * `resetPassword`
 * reset password
 * @param options
 */
module.exports.resetPassword = ((options) => new Promise((resolve, reject) => {
  const { userId } = options;
  const { password } = options;
  bcrypt.genSalt(12, (err, salt) => {
    if (err) {
      reject(err);
    } else {
      bcrypt.hash(password, salt, (bcryptErr, hash) => {
        if (bcryptErr) {
          reject(bcryptErr);
          return;
        } else {
          const newPassword = hash;
          const find = { _id: userId };
          const update = {
            password: newPassword,
            passwordChangeTime: String(new Date(new Date().toUTCString().slice(0, -3))),
            passwordChangeTimeEpoc: Number(new Date().getTime()),
          };
          const queryOptions = { new: true };
          AuthTask.findOneAndUpdate(find, update, queryOptions)
            .then((doc) => { resolve(doc); })
            .catch((docErr) => { reject(docErr); });
        }
      });
    }
  });
}));






















/** ************************************ SET/UNSET LOGIN *************************************** */

/**
 * `setUserLoggedIn`
 * set flag if users logs in
 * @param options
 */
module.exports.setUserLoggedIn = ((options) => new Promise((resolve, reject) => {
  const { loginType } = options;
  const { username } = options;
  if (loginType === 'web') {
    const update = {
      isWebLogin: true,
      loginTimeWebEpoc: Number(new Date().getTime()),
      loginTimeWeb: String(new Date(new Date().toUTCString().slice(0, -3))),
    };
    const find = { username };
    AuthTask.findOneAndUpdate(find, update)
      .then((doc) => { resolve(doc); })
      .catch((err) => { reject(err); });
  } else if (loginType === 'app') {
    const update = {
      isAppLogin: true,
      loginTimeAppEpoc: Number(new Date().getTime()),
      loginTimeApp: String(new Date(new Date().toUTCString().slice(0, -3))),
    };
    const find = { username };
    AuthTask.findOneAndUpdate(find, update)
      .then((doc) => { resolve(doc); })
      .catch((err) => { reject(err); });
  } else {
    reject(new Error('Invalid login type'));
  }
}));

/**
 * `unsetLoginFlag`
 * unset login flag if user logs out
 * @param options
 */
module.exports.unsetLoginFlag = ((options) => new Promise((resolve, reject) => {
  const { loginType } = options;
  const { userId } = options;
  if (loginType === 'web') {
    const find = { _id: userId };
    const update = { isWebLogin: false };
    AuthTask.findOneAndUpdate(find, update)
      .then((doc) => { resolve(doc); })
      .catch((err) => { reject(err); });
  } else if (loginType === 'app') {
    const find = { _id: userId };
    const update = { isAppLogin: false };
    AuthTask.findOneAndUpdate(find, update)
      .then((doc) => { resolve(doc); })
      .catch((err) => { reject(err); });
  } else {
    reject(new Error('Invalid login type'));
  }
}));


















/** ************************************ REGISTER ******************************************* */

/**
 * `registerUser`
 * register new user
 * @param options
 */
module.exports.registerUser = ((options) => new Promise((resolve, reject) => {
  const newUser = new AuthTask(options);
  bcrypt.genSalt(12, (err, salt) => {
    if (err) reject(err);
    bcrypt.hash(newUser.password, salt, (bcryptErr, hash) => {
      if (bcryptErr) reject(bcryptErr);
      newUser.password = hash;
      newUser.save()
        .then((doc) => { resolve(doc); })
        .catch((docErr) => { reject(docErr); });
      return;
    });
  });
}));
