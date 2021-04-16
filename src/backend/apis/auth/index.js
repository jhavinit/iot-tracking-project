/* eslint-disable no-console */
//* *************************** IMPORTS **********************************/

const express = require('express');
const path = require('path');
const useragent = require('express-useragent');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
const http = require('http');
const https = require('https');
const helmet = require('helmet');
const csp = require('helmet-csp');
const hsts = require('hsts');
const ienoopen = require('ienoopen');
const nocache = require('nocache');
const dontSniffMimetype = require('dont-sniff-mimetype');
const frameguard = require('frameguard');
const xssFilter = require('x-xss-protection');
const routes = require('./routes');
const config = require('../../config');

//* *************************** GLOBALS **********************************/

/* eslint-disable func-names */
/* eslint-disable wrap-iife */

/**
 * `app`
 * express app for server
 */
const app = express();

//* *************************** MIDDLEWARES **********************************/

app.use(compression());
app.use(useragent.express());
app.use(cors());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(mongoSanitize());
app.use(helmet());
app.use(ienoopen());
app.use(hsts({
  maxAge: 15552000,
}));
app.use(nocache());
app.use(dontSniffMimetype());
app.use(frameguard({ action: 'deny' }));
app.use(frameguard({ action: 'sameorigin' }));
app.use(frameguard());
app.disable('x-powered-by');
app.use(csp({
  directives: {
    defaultSrc: ['\'self\'', 'default.com'],
    scriptSrc: ['\'self\'', '\'unsafe-inline\''],
    styleSrc: ['style.com'],
    fontSrc: ['\'self\'', 'fonts.com'],
    imgSrc: ['img.com', 'data:'],
    sandbox: ['allow-forms', 'allow-scripts'],
    reportUri: '/report-violation',
    objectSrc: ['\'none\''],
    upgradeInsecureRequests: true,
    workerSrc: false,
  },
  loose: false,
  reportOnly: false,
  setAllHeaders: false,
  disableAndroid: false,
  browserSniff: true,
}));
app.use(xssFilter());
app.use(xssFilter({ reportUri: '/report-xss-violation' }));
app.use('/api', routes);
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});
app.get('*', (req, res) => {
  res.redirect('/');
});

//* *************************** CONNECT TO MONGODB **********************************/

/**
 * `connectToMongoDB`
 * connect to database
 */
const connectToMongoDB = () => {
  if (config.DB_SSL_ENABLED === 'true') {
    mongoose.connect(
      `${config.DB_HEAD}${config.AUTH_API_USERNAME}:${encodeURIComponent(config.AUTH_API_PASSWORD)}${config.DB_TAIL}`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        ssl: true,
        sslValidate: false,
      },
    );
  } else {
    mongoose.connect(config.DB_HEAD + config.DB_TAIL,
      { useUnifiedTopology: true, useNewUrlParser: true });
  }
};

let connectTimeout;

/**
 * on connected to mongodb
 */
mongoose.connection.on('connected', () => {
  console.log('connected to database');
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
  connectTimeout = setTimeout(connectToMongoDB, Number(5000));
});

/**
 * `createServer`
 * create server
 */
function createServer() {
  if (config.API_SSL === 'true') {
    /**
     * * create ssl details
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

    /**
     * * running server
     */
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(config.AUTH_API_PORT, () => {
      console.log('Server started');
    });
  } else {
    /**
     * * running server
     */
    const httpServer = http.createServer(app);
    httpServer.listen(config.AUTH_API_PORT, () => {
      console.log('Server started');
    });
  }
}

/**
 * main function
 */
(function () {
  /**
   * create server
   */
  createServer();

  /**
   * connect to database
   */
  connectToMongoDB();
})();
