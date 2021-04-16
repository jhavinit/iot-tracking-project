const ENV = 'development';
// production
// development

if (ENV === 'development') {
  process.env.NODE_ENV = 'development';
  module.exports = {
    API_SSL: 'false',
    PRIVATE_KEY_PATH: undefined,
    CERTIFICATE_PATH: undefined,
    CA_PATH: undefined,

    DB_NAME: 'DIC',
    DB_HEAD: 'mongodb://',
    DB_TAIL: 'localhost:27017/DIC',
    DB_SSL_ENABLED: 'false',

    AUTH_API_PORT: 3000,
    LIVEDATA_API_PORT: 3001,

    MQTT_LIVE_DATA_TOPIC: 'dic/liveData',
    MQTT_SSL_ENABLED: 'false',
    MQTT_CLIENT_ID: 'livedata',
    MQTT_URL: 'mqtt://localhost',
    MQTT_PORT: 1883,
    MQTT_USERNAME: undefined,
    MQTT_PASSWORD: undefined,

    AUTH_JWT: 'password',
    AUTH_JWT_SKIP_CHARS: 4,
    SESSION_EXPIRY_PERIOD: 18000,
  };
} else {
  process.env.NODE_ENV = 'production';
  module.exports = {
    API_SSL: 'true',
    PRIVATE_KEY_PATH: '/etc/letsencrypt/live/www.dicpuchd.in/privkey.pem',
    CERTIFICATE_PATH: '/etc/letsencrypt/live/www.dicpuchd.in/fullchain.pem',
    CA_PATH: '/etc/letsencrypt/live/www.dicpuchd.in/chain.pem',

    AUTH_API_PORT: 3000,
    LIVEDATA_API_PORT: 3001,

    DB_NAME: 'DIC',
    DB_HEAD: 'mongodb://',
    DB_TAIL: 'localhost:27017/DIC',
    DB_SSL_ENABLED: 'false',

    MQTT_LIVE_DATA_TOPIC: 'dic/liveData',
    MQTT_SSL_ENABLED: 'true',
    MQTT_CLIENT_ID: 'livedata',
    MQTT_URL: 'mqtts://mqtt.snelltech.com',
    MQTT_PORT: 8883,
    MQTT_USERNAME: 'testpurposesetusernameformqtt',
    MQTT_PASSWORD: 'mqttsecuritypassword9166512612',

    AUTH_JWT: 'password',
    AUTH_JWT_SKIP_CHARS: 4,
    SESSION_EXPIRY_PERIOD: 18000,
  };
}
