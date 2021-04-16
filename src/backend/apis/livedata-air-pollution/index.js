//* *************************** IMPORTS **********************************/

const app = require('express')();
const httpClient = require('http');
const httpsClient = require('https');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const fs = require('fs');
const mqtt = require('mqtt');
const controller = require('./controllers');
const config = require('../../config');

//* *************************** GLOBALS **********************************/

/* eslint-disable func-names */
/* eslint-disable no-lonely-if */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-console */










//* *************************** MONGODB CONNECTION **********************************/

/**
 * `connectToDB`
 * connect to database
 */
const connectToDB = () => {
  /**
   * if ssl is required for connecting to mongodb
   */
  if (config.DB_SSL_ENABLED === 'true') {
    mongoose.connect(
      `${config.DB_HEAD}${config.LIVEDATA_API_USERNAME}:${encodeURIComponent(config.LIVEDATA_API_PASSWORD)}${config.DB_TAIL}`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        ssl: true,
        sslValidate: false,
      },
    );
  } else {
    /**
     * connect without ssl
     */
    mongoose.connect(config.DB_HEAD + config.DB_TAIL,
      { useUnifiedTopology: true, useNewUrlParser: true });
  }
};

let connectTimeout;

/**
 * on connected to mongodb
 */
mongoose.connection.on('connected', () => {
  console.log('Connected to db');
  clearTimeout(connectTimeout);
});

/**
 * on error connecting to mongodb
 */
mongoose.connection.on('error', (err) => {
  console.log(err);
});

/**
 * on disonnected with mongodb
 */
mongoose.connection.on('disconnected', () => {
  connectTimeout = setTimeout(connectToDB, Number(5000));
});











//* *************************** CREATE SERVER **********************************/

/**
 * `createServer`
 * create socket io server
 */
function createServer() {
  return new Promise((resolve) => {
    let io;
    /**
     * if api ssl is required
     */
    if (config.API_SSL === 'true') {
      /**
       * create ssl credentials
       */
      const privateKey = fs.readFileSync(config.PRIVATE_KEY_PATH, 'utf8');
      const certificate = fs.readFileSync(config.CERTIFICATE_PATH, 'utf8');
      const ca = fs.readFileSync(config.CA_PATH, 'utf8');
      const credentials = {
        key: privateKey,
        cert: certificate,
        // eslint-disable-next-line object-shorthand
        ca: ca,
      };
      const https = httpsClient.createServer(credentials, app);
      https.listen(config.LIVEDATA_API_PORT, () => {
        console.log('server started');
        io = socketio(https);
        resolve(io);
      });
    } else {
      /**
       * create server without ssl
       */
      const http = httpClient.createServer(app);
      http.listen(config.LIVEDATA_API_PORT, () => {
        console.log('server started');
        io = socketio(http);
        resolve(io);
      });
    }
  });
}













//* *************************** LISTEN TO NEW SOCKET CONNECTIONS **********************************/

/**
 * `connectToBroker`
 * connect to mqtt broker
 */
function connectToBroker() {
  return new Promise((resolve, reject) => {
    let mqttSubClient;
    /**
     * if ssl is required
     */
    if (config.MQTT_SSL_ENABLED === 'true') {
      /**
       * create credentials options
       */
      const options = {
        clientId: config.MQTT_CLIENT_ID,
        username: config.MQTT_USERNAME,
        password: config.MQTT_PASSWORD,
        rejectUnauthorized: false,
      };
      mqttSubClient = mqtt.connect(`${config.MQTT_URL}:${config.MQTT_PORT}`, options);
    } else {
      /**
       * connect without ssl or username passsword
       */
      const options = {
        clientId: config.MQTT_CLIENT_ID,
      };
      mqttSubClient = mqtt.connect(config.MQTT_URL, options);
    }

    /**
     * on connected with mqtt broker
     */
    mqttSubClient.on('connect', () => {
      console.log('Connected to mqt broker');
      resolve(mqttSubClient);
    });

    /**
     * on error in connection with mqtt server
     */
    mqttSubClient.on('error', (error) => {
      console.log('error in broker connection');
      reject(error);
    });
  });
}











//* *************************** MAIN **********************************/

/**
 * main function
 */
// eslint-disable-next-line wrap-iife
(async function () {
  try {
    /**
     * create socket io server
     */
    const io = await createServer();

    /**
     * connect to mongodb database
     */
    connectToDB();

    const mqttSubClient = await connectToBroker();

    /**
     * listen to new socket connections
     */
    controller.listenToSocketConnections(io, mqttSubClient);
  } catch (error) {
    console.log(error);
  }
})();
