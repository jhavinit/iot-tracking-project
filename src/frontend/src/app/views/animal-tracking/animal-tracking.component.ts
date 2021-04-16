import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
// import { AntPath, antPath } from 'leaflet-ant-path';
import * as L from 'leaflet';

@Component({
  templateUrl: 'animal-tracking.component.html',
  styleUrls: ['animal-tracking.component.css']
})

export class AnimalTrackingComponent implements OnInit {
  /**
   * `notifier`
   * notification service
   */
  private readonly notifier: NotifierService;

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
  ) {
    this.title.setTitle('Animal tracker · DIC - TRAFFIC SENSING AND IT');
    this.notifier = notifierService;
  }

  /**
   * `openSolution`
   * open solution's page
   * @param path
   */
  openSolution(path) {
    this.router.navigate([path]);
  }

  /**
   * `rad`
   * @param x 
   */
  rad(x) {
    return x * Math.PI / 180;
  };

  /**
   * `getDistance`
   * @param lat1 
   * @param lon1 
   * @param lat2 
   * @param lon2 
   */
  getDistance(lat1, lon1, lat2, lon2) {
    const R = 6378137;
    const dLat = this.rad(lat2 - lat1);
    const dLong = this.rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.rad(lat1)) * Math.cos(this.rad(lat2)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = (R * c / 1000).toFixed(2);
    return d;
  };

  newIcon = new L.Icon({
    iconUrl: '../../../assets/others/Capture-removebg-preview (1).png',
    iconAnchor: new L.Point(13, 0),
    iconSize: new L.Point(60, 60),
    size: new L.Point(32, 32)
  });

  /**
   * `ngOnInit`
   */
  ngOnInit(): void {
    /**
     * initialize map
     */
    const map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(map);
    map.locate({
      setView: true,
      maxZoom: 50,
      watch: true,
      enableHighAccuracy: true,
      maximumAge: 15000,
      timeout: 3000000
    });


    // * simulate path
    var latlngs = Array();
    const marker = L.marker(
      [51.505, -0.09],
      { icon: this.newIcon, draggable: true }).addTo(map);
    const newPopup = new L.Popup();
    marker.bindPopup(
      `
          <div>
          DEVICE-001
          </div>
          `
    );
    marker.openPopup();
    newPopup.setLatLng(new L.LatLng(51.505, -0.09));
    newPopup.setContent(
      `
          <h6 class="my-primary-color">DEVICE-001</h6>
          `);
    newPopup.openPopup();

    var lat = 30.346444799999993;
    var lng = 76.4116992;
    setInterval(function () {
      lat = lat + ((Math.random() * 0.5) - 0.25) * 0.001;
      lng = lng + ((Math.random() * 1) - 0.5) * 0.001; 
      latlngs.push([lat, lng]);
      var polyline = L.polyline(latlngs, { color: 'red' }).addTo(map);
      /**
       * zoom the map to the polyline
       */
      map.fitBounds(polyline.getBounds());
      const newLatLng = new L.LatLng(lat, lng);
      marker.setLatLng(newLatLng);
    }, 1000);
  }
}
