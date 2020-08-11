/// <reference types="@types/googlemaps" />
import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import {
    FormGroup,
    FormControl,
    Validators,
    ValidatorFn,
} from '@angular/forms';
import { Observable, Subscription, timer } from 'rxjs';
import { Organization, ErrorResponse, User } from '@models';
import { GeoLocationService } from '@services/geo-location.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnDestroy {
    @ViewChild('gmap') gmapElement: any;
    @Input() lat: string;
    @Input() lng: string;

    map: google.maps.Map;
    marker: google.maps.Marker;
    showMap: boolean;

    constructor() {}

    ngOnInit(): void {
        this.viewMap(Number(this.lat), Number(this.lng));
    }

    ngOnDestroy(): void {
        if (this.marker) {
            this.marker.setMap(null);
            this.marker = null;
        }
    }

    closeMap() {
        this.showMap = false;
    }

    viewMap(lat: number, lng: number): void {
        this.showMap = true;
        timer(500).subscribe(() => {
            console.log(this.gmapElement);
            if (this.gmapElement) {
                this.map = new google.maps.Map(this.gmapElement.nativeElement, {
                    center: new google.maps.LatLng(lat, lng),
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    gestureHandling: 'greedy',
                });
                this.marker = new google.maps.Marker({
                    position: new google.maps.LatLng(lat, lng),
                    draggable: true,
                    map: this.map,
                });
            }
        });
    }
}
