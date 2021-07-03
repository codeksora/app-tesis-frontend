import { Component, OnInit, ViewChild } from '@angular/core'
import { HospitalService } from 'app/services/hospital.service';
import { circle, divIcon, icon, latLng, marker, polygon, tileLayer, Util } from 'leaflet';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { DistritosService } from 'app/services/distritos.service';
import { UpssService } from 'app/services/upss.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  distrito = ''
  especialidades = []
  instituciones = []
  institucion = ''
  especialidad = ''
  options = {}
  layers = []
  layersControl = {}
  hospitals = []
  currentDataIpress = {}
  apiLoaded: Observable<boolean>;

  // markerPosition = {lat: -12.08723818102419, lng: -77.07035136062521}
  distritos: Array<any> = []
  markerPositions = []
  private customIconPath = 'assets/images/misc/';
  titlePoint = ''
  markerOptions: google.maps.MarkerOptions = {draggable: false, icon: this.customIconPath + 'hospital.png'};

  // optionsG: google.maps.MapOptions = {
  //   center: {lat: 40, lng: -20},
  //   zoom: 4
  // };-12.08723818102419, -77.07035136062521
  center = {lat: -12.030632644183802, lng: -77.04340780341268};
  zoom = 11;
  display?: google.maps.LatLngLiteral;

  mapOptions = {
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      }
    ]
  }
  // customIconOptions = {
  //   icon: this.customIconPath + 'leaf-red.png'
  // };

  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;

  constructor(
    public hospitalService: HospitalService,
    public distritosService: DistritosService,
    public upssService: UpssService,
    httpClient: HttpClient
  ) {
    // this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyDx00t4aISipqp82fvnGLZDW3DUDr-_esg', 'callback=initMap')
    //     .pipe(
    //       map(() => true),
    //       catchError(() => of(false)),
    //     );
  }

  public contentHeader: object

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this.contentHeader = {
      headerTitle: 'Principal',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Inicio',
            isLink: true,
            link: '/'
          },
          {
            name: 'principal',
            isLink: false
          }
        ]
      }
    }

    const iconSettings = {
      mapIconUrl: '<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><path fill="{mapIconColor}" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="{mapIconColorInnerCircle}" cx="74" cy="75" r="61"/><circle fill="#FFF" cx="74" cy="75" r="{pinInnerCircleRadius}"/></svg>',
      mapIconColor: '#cc756b',
      mapIconColorInnerCircle: 'red',
      pinInnerCircleRadius:48
    }

    this.distritosService.getAllUbigeoDistrito().subscribe(resp => {
      this.distritos = resp
    })

    this.hospitalService.getAllHospitalMapa().subscribe((resp) => {
      
      const hospitalList = []
      resp.map((item) => {
        hospitalList.push({
          ipress: item.ipress,
          pos: {
            lat: item.latitud, 
            lng: item.longitud
          },
          name: item.nombre
        })
      })
      this.markerPositions = hospitalList
    })
    // // tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 20, attribution: '...' }),
    // marker([-12.046162563922234, -77.11254126510022])
    // marker([ -12.030632644183802, -77.04340780341268 ]).bindPopup("Hospital Rebagliati"),
    this.options = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 11,
      center: latLng(-12.030632644183802, -77.04340780341268)
    };


    // this.layersControl = {
    //   baseLayers: {
    //     'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    //     'Open Cycle Map': tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    //   },
    //   overlays: {
    //     'Big Circle': circle([ 46.95, -122 ], { radius: 5000 }),
    //     'Big Square': polygon([[ 46.8, -121.55 ], [ 46.9, -121.55 ], [ 46.9, -121.7 ], [ 46.8, -121.7 ]])
    //   }
    // }
    
    
  }

  openInfoWindow(marker: MapMarker, position) {
    console.log(marker, position);
    this.titlePoint = position.name
    this.infoWindow.open(marker);
    this.getHospitalDetail(position.ipress)
  }

  getHospitalDetail(ipress) {
    this.hospitalService.getHospitalByIpress(ipress).subscribe((resp) => {
      this.currentDataIpress = resp
    })

    return
  }

  onDistritoIsSelected() {
    this.reloadMap()
    if(!this.distrito) return

    const ubigeo = this.distrito
    this.upssService.getAllUpssByUbigeo(ubigeo).subscribe(resp => {
      this.especialidades = resp
    })

    this.hospitalService.getAllInstitucionByUbigeo(ubigeo).subscribe(resp => {
      this.instituciones = resp
      console.log('Institucion', resp);
    })
  }

  onInstitutoIsSelected() {
    this.reloadMap()
  }

  onEspecialidadIsSelected() {
    this.reloadMap()
  }

  reloadMap() {
    // this.markerPositions = []
    

    const body = {}
    if(this.distrito !== '') body['ubigeo'] = this.distrito
    if(this.institucion !== '') body['institucion'] = this.institucion
    if(this.especialidad !== '') body['especialidad'] = this.especialidad

    this.hospitalService.getAllHospitalByParams(body).subscribe((resp) => {
      const hospitalList = []

      resp.map((item) => {
        hospitalList.push({
          ipress: item.ipress,
          pos: {
            lat: item.latitud, 
            lng: item.longitud
          },
          name: item.nombre
        })
      })
      this.markerPositions = hospitalList
    })
  }
}
