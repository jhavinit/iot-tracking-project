//* *************************** IMPORTS **********************************/

const utility = require('../utility');
const config = require('../../../config');

//* *************************** GLOBALS **********************************/

/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-console */

/**
 * `REQUESTED_DEVICES`
 * requested devices by any socket client
 */
const REQUESTED_DEVICES = {};

/**
 * `SOCKET_TOPIC`
 * socket topic
 */
const SOCKET_TOPIC = 'dataUpdate';

/**
 * `REQUESTED_DEVICES_PAHO_DATA`
 */
const REQUESTED_DEVICES_PAHO_DATA = {
  Device001: [
    {
      name: 'Temperature',
      unit: 'degree celcius',
      measure: 'T',
    },
    {
      name: 'CO2',
      unit: 'particles',
      measure: 'C',
    },
    {
      name: 'Humidity',
      unit: 'rh',
      measure: 'H',
    },
    {
      name: 'PM 1.0',
      unit: 'mass',
      measure: 'PM1',
    },
    {
      name: 'PM 2.5',
      unit: 'mass',
      measure: 'PM25',
    },
    {
      name: 'PM 4.0',
      unit: 'mass',
      measure: 'PM40',
    },
    {
      name: 'PM 10',
      unit: 'mass',
      measure: 'PM10',
    },
    {
      name: 'PM 0.5',
      unit: 'mass',
      measure: 'PM05',
    },
    {
      name: 'Latitude',
      unit: 'degree',
      measure: 'LAT',
    },
    {
      name: 'Longitude',
      unit: 'degree',
      measure: 'LNG',
    },
  ],
};




//* *************************** SUBSCRIBE BROKER **********************************/

/**
 * `subscribeToDevices`
 */
function subscribeToDevices(io, client) {
  client.subscribe(config.MQTT_LIVE_DATA_TOPIC, async (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Subscribed to broker');

      /**
       * listen to published msg from devices
       */
      client.on('message', (topic, message) => {
        /**
         * recieved data from device
         */
        const newMsg = JSON.parse(message);
        if (REQUESTED_DEVICES[newMsg.DID]) {
          const { sockets } = REQUESTED_DEVICES[newMsg.DID];
          const paho = REQUESTED_DEVICES_PAHO_DATA[newMsg.DID];
          let c = 0;
          const resData = [];
          paho.forEach((element) => {
            resData.push({
              name: element.name,
              unit: element.unit,
              value: newMsg[element.measure],
            });
            c += 1;
            if (c >= paho.length) {
              const responseData = {
                data: resData,
                timeVal: new Date().getTime(),
              };
              const res = {
                code: 200,
                data: responseData,
                msg: 'Successfully loaded live data',
                success: true,
              };
              sockets.forEach((socketId) => {
                io.to(socketId).emit(SOCKET_TOPIC, res);
                console.log('Sent data to client...');
              });
            }
          });
        } else {
          // eslint-disable-next-line no-console
          console.log('NOT REQUESTED BY ANY CLIENT ~~~~~~~~~~~~~~');
        }
      });
    }
  });
}








//* *************************** LISTEN TO SOCKET CONNECTIONS **********************************/

/**
 * `listenToSocketConnections`
 */
module.exports.listenToSocketConnections = ((io, mqttSubClient) => {
  /**
   * subscribe to device data
   */
  subscribeToDevices(io, mqttSubClient);
  console.log('Waiting for devices...');

  /**
   * on new client connection
   */
  io.on('connection', async (socket) => {
    /**
     * Extract data from request
     */
    const reqBody = {
      deviceId: socket.handshake.query.deviceId,
      authToken: socket.handshake.query.authToken,
    };
    utility.trimStringInputs(reqBody);
    const { authToken } = reqBody;
    const { deviceId } = reqBody;

    /**
     * socket on disconnection
     */
    socket.once('disconnect', () => {
      /**
       * remove particular socket id or entire object if no socket/s connected
       */
      if (REQUESTED_DEVICES[deviceId]) {
        if (REQUESTED_DEVICES[deviceId].sockets.includes(socket.id)) {
          // eslint-disable-next-line max-len
          REQUESTED_DEVICES[deviceId].sockets = REQUESTED_DEVICES[deviceId].sockets.filter((item) => item !== socket.id);
          if (REQUESTED_DEVICES[deviceId].sockets.length === 0) {
            delete REQUESTED_DEVICES[deviceId];
          }
        }
      }

      /**
       * disconnect client from server end
       */
      socket.disconnect();
    });

    /**
     * ! Check if auth token missing
     */
    if (!authToken || authToken.length === 0) {
      socket.disconnect();
    } else {
      /**
       * ! check if device id missing
       */
      if (!deviceId || deviceId.length === 0) {
        socket.disconnect();
      } else {
        try {
          /**
           * inform mqtt to listen to published msg by this device
           */
          if (!REQUESTED_DEVICES[deviceId]) {
            /**
             * if a new connection
             */
            REQUESTED_DEVICES[deviceId] = {
              sockets: [socket.id],
            };
          } else {
            /**
             * if connection already exists ie. request on same device with different client
             * then push new socket id
             */
            REQUESTED_DEVICES[deviceId].sockets.push(socket.id);
          }
        } catch (error) {
          socket.disconnect();
        }
      }
    }
  });
});
