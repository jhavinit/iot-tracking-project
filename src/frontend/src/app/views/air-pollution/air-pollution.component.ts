import { Component, OnInit, AfterViewInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
// import { AntPath, antPath } from 'leaflet-ant-path';
import * as L from 'leaflet';
import { LiveDataService } from '../../services/live-data.service';
import { UtlityService } from '../../services/utility.service';

@Component({
  templateUrl: 'air-pollution.component.html',
  styleUrls: ['air-pollution.component.css']
})

export class AirPollutionComponent implements OnInit {
  /**
   * `notifier`
   * notification service
   */
  private readonly notifier: NotifierService;

  map;
  latlngs = Array();


  gaugeType = "full";


  /**
   * `liveData`
   */
  liveData: object;


  newIcon = new L.Icon({
    iconUrl: '../../../assets/others/new-marker.svg',
    iconAnchor: new L.Point(13, 0),
    iconSize: new L.Point(60, 60),
    size: new L.Point(32, 32)
  });

  /**
   * `constructor`
   * @param notifierService notification service
   * @param authService authentication service
   * @param router routing service
   * @param title title service
   */
  constructor(
    notifierService: NotifierService,
    private router: Router,
    public authService: AuthService,
    private title: Title,
    private liveDataService: LiveDataService,
    private utilityService: UtlityService,
  ) {
    this.title.setTitle('Air pollution · DIC - TRAFFIC SENSING AND IT');
    this.notifier = notifierService;
  }


  /**
 * `addLiveChartData`
 * add live data to chart
 */
  addLiveChartData(data, timestampData, marker) {
    this.liveData['tempVal']['label'].push(timestampData);
    this.liveData['tempVal']['data'][0].data.push(data['tempVal']);
    this.liveData['humidity']['label'].push(timestampData);
    this.liveData['humidity']['data'][0].data.push(data['humidity']);
    this.liveData['CO2']['label'].push(timestampData);
    this.liveData['CO2']['data'][0].data.push(data['CO2']);

    this.liveData['PM1']['gaugeValue'] = data['PM1'];
    this.liveData['PM25']['gaugeValue'] = data['PM25'];
    this.liveData['PM40']['gaugeValue'] = data['PM40'];
    this.liveData['PM10']['gaugeValue'] = data['PM10'];
    this.liveData['PM05']['gaugeValue'] = data['PM05'];

    this.liveData['LAT'] = data['LAT'];
    this.liveData['LNG'] = data['LNG'];


    this.latlngs.push([this.liveData['LAT'], this.liveData['LNG']]);
    var polyline = L.polyline(this.latlngs, { color: 'red' }).addTo(this.map);
    this.map.fitBounds(polyline.getBounds());
    const newLatLng = new L.LatLng(this.liveData['LAT'], this.liveData['LNG']);
    marker.setLatLng(newLatLng);

  }

  /**
   * `removeLiveChartData`
   * remove live chart data after 20 points
   */
  removeLiveChartData() {
    if (this.liveData['tempVal']['label'].length === 10) {
      this.liveData['tempVal']['label'].shift();
      this.liveData['humidity']['label'].shift();
      this.liveData['CO2']['label'].shift();
      this.liveData['tempVal']['data'][0].data.shift();
      this.liveData['humidity']['data'][0].data.shift();
      this.liveData['CO2']['data'][0].data.shift();
    }
  }


  /**
   * `onDeviceSelect`
   * @param deviceId 
   */
  onDeviceSelect(deviceId) {
    // * simulate path
    const marker = L.marker(
      [24, 77],
      { icon: this.newIcon, draggable: true }).addTo(this.map);
    const newPopup = new L.Popup();
    marker.bindPopup(
      `
                  <div>
                  ${deviceId}
                  </div>
                  `
    );
    marker.openPopup();
    newPopup.setLatLng(new L.LatLng(24, 77));
    newPopup.setContent(
      `
                  <h6 class="my-primary-color">
                  ${deviceId}
                
                  </h6>
                  `);
    newPopup.openPopup();

    this.liveDataService.listen(deviceId).subscribe((res: any) => {
      const dataRecieved = res;
      if (dataRecieved) {

        /**
         * modify time to local timezone
         */
        const timestampData = this.utilityService.convertToLocalTimeZone(dataRecieved['timeVal']);

        /**
         * create data
         */
        const data = {
          tempVal: dataRecieved['data'].filter((x => (x['name'] === 'Temperature')))[0]['value'],
          humidity: dataRecieved['data'].filter((x => (x['name'] === 'Humidity')))[0]['value'],
          CO2: dataRecieved['data'].filter((x => (x['name'] === 'CO2')))[0]['value'],

          PM1: dataRecieved['data'].filter((x => (x['name'] === 'PM 1.0')))[0]['value'],
          PM40: dataRecieved['data'].filter((x => (x['name'] === 'PM 4.0')))[0]['value'],
          PM25: dataRecieved['data'].filter((x => (x['name'] === 'PM 2.5')))[0]['value'],
          PM05: dataRecieved['data'].filter((x => (x['name'] === 'PM 0.5')))[0]['value'],
          PM10: dataRecieved['data'].filter((x => (x['name'] === 'PM 10')))[0]['value'],

          LAT: dataRecieved['data'].filter((x => (x['name'] === 'Latitude')))[0]['value'],
          LNG: dataRecieved['data'].filter((x => (x['name'] === 'Longitude')))[0]['value'],
        };

        /**
        * remove points if extra
        */
        this.removeLiveChartData();

        /**
         * add new point to chart
         */
        this.addLiveChartData(data, timestampData, marker);
      }
    });
  }


  /**
   * `ngOnInit`
   */
  ngOnInit() {
    this.map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(this.map);
    this.map.locate({
      setView: true,
      maxZoom: 50,
      watch: true,
      enableHighAccuracy: true,
      maximumAge: 15000,
      timeout: 3000000
    });

    this.liveData = {
      tempVal: {
        type: 'line',
        legend: false,
        options: {
          tooltips: {
            enabled: false,
            custom: CustomTooltips,
            intersect: true,
            mode: 'index',
            position: 'nearest',
            callbacks: {
              labelColor: function (tooltipItem, chart) {
                return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              gridLines: {
                drawOnChartArea: true,
              },
              ticks: {
                callback: function (value: any) {
                  return value;
                }
              },
              scaleLabel: {
                display: true,
                labelString: 'Timestamp'
              }
            }],
            yAxes: [{
              ticks: {
                // beginAtZero: true,
                // maxTicksLimit: 5,
                // stepSize: Math.ceil(250 / 5),
                callback: function (value: any) {
                  return value;
                }
              },
              scaleLabel: {
                display: true,
                labelString: 'Temperature'
              }
            }]
          },
          elements: {
            line: {
              borderWidth: 2,
            },
            point: {
              radius: 3,
            }
          },
          legend: {
            display: true
          }
        },
        colors: [
          {
            // backgroundColor: hexToRgba(getStyle('--success'), 10),
            borderColor: getStyle('--success'),
            pointHoverBackgroundColor: '#fff'
          }
        ],
        data: [
          { data: [], label: 'Live data', lineTension: 0 },
        ],
        label: []
      },
      humidity: {
        type: 'line',
        legend: false,
        options: {
          tooltips: {
            enabled: false,
            custom: CustomTooltips,
            intersect: true,
            mode: 'index',
            position: 'nearest',
            callbacks: {
              labelColor: function (tooltipItem, chart) {
                return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              gridLines: {
                drawOnChartArea: true,
              },
              ticks: {
                callback: function (value: any) {
                  return value;
                }
              },
              scaleLabel: {
                display: true,
                labelString: 'Timestamp'
              }
            }],
            yAxes: [{
              ticks: {
                // beginAtZero: true,
                // maxTicksLimit: 5,
                // stepSize: Math.ceil(250 / 5),
                callback: function (value: any) {
                  return value;
                }
              },
              scaleLabel: {
                display: true,
                labelString: 'Humidity'
              }
            }]
          },
          elements: {
            line: {
              borderWidth: 2,
            },
            point: {
              radius: 3,
            }
          },
          legend: {
            display: true
          }
        },
        colors: [
          {
            // backgroundColor: hexToRgba(getStyle('--success'), 10),
            borderColor: getStyle('--success'),
            pointHoverBackgroundColor: '#fff'
          }
        ],
        data: [
          { data: [], label: 'Live data', lineTension: 0 },
        ],
        label: []
      },
      CO2: {
        type: 'line',
        legend: false,
        options: {
          tooltips: {
            enabled: false,
            custom: CustomTooltips,
            intersect: true,
            mode: 'index',
            position: 'nearest',
            callbacks: {
              labelColor: function (tooltipItem, chart) {
                return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{
              gridLines: {
                drawOnChartArea: true,
              },
              ticks: {
                callback: function (value: any) {
                  return value;
                }
              },
              scaleLabel: {
                display: true,
                labelString: 'Timestamp'
              }
            }],
            yAxes: [{
              ticks: {
                // beginAtZero: true,
                // maxTicksLimit: 5,
                // stepSize: Math.ceil(250 / 5),
                callback: function (value: any) {
                  return value;
                }
              },
              scaleLabel: {
                display: true,
                labelString: 'CO2'
              }
            }]
          },
          elements: {
            line: {
              borderWidth: 2,
            },
            point: {
              radius: 3,
            }
          },
          legend: {
            display: true
          }
        },
        colors: [
          {
            // backgroundColor: hexToRgba(getStyle('--success'), 10),
            borderColor: getStyle('--success'),
            pointHoverBackgroundColor: '#fff'
          }
        ],
        data: [
          { data: [], label: 'Live data', lineTension: 0 },
        ],
        label: []
      },
      PM1: {
        gaugeValue: 0,
        gaugeLabel: 'PM 1.0',
        gaugeAppendText: 'mass',
      },
      PM25: {
        gaugeValue: 0,
        gaugeLabel: 'PM 2.5',
        gaugeAppendText: 'mass',
      },
      PM40: {
        gaugeValue: 0,
        gaugeLabel: 'PM 4.0',
        gaugeAppendText: 'mass',
      },
      PM10: {
        gaugeValue: 0,
        gaugeLabel: 'PM 10',
        gaugeAppendText: 'mass',
      },
      PM05: {
        gaugeValue: 0,
        gaugeLabel: 'PM 0.5',
        gaugeAppendText: 'mass',
      },
      LAT: undefined,
      LNG: undefined,
    };
  }
}
