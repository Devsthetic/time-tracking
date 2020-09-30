/// <reference types="@types/googlemaps" />
import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    Input,
    ElementRef,
    SimpleChanges,
    OnChanges,
} from '@angular/core';
import { timer } from 'rxjs';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('gmap') gmapElement: ElementRef;
    @Input() lat: string;
    @Input() lng: string;

    map: google.maps.Map;
    marker: google.maps.Marker;
    showMap: boolean;

    ngOnInit(): void {
        this.viewMap();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['lat'] && changes['lng']) {
            if (changes['lat'].currentValue && changes['lng'].currentValue) {
                this.viewMap();
            }
        }
    }

    ngOnDestroy(): void {
        if (this.marker) {
            this.marker.setMap(null);
            this.marker = null;
        }
    }

    closeMap(): void {
        this.showMap = false;
    }

    viewMap(): void {
        if (this.lat && this.lng) {
            timer(500).subscribe(() => {
                if (this.gmapElement) {
                    this.map = new google.maps.Map(
                        this.gmapElement.nativeElement,
                        {
                            center: new google.maps.LatLng(
                                Number(this.lat),
                                Number(this.lng)
                            ),
                            zoom: 14,
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            disableDefaultUI: false,
                            gestureHandling: 'greedy',
                        }
                    );
                    this.marker = new google.maps.Marker({
                        position: new google.maps.LatLng(
                            Number(this.lat),
                            Number(this.lng)
                        ),
                        draggable: true,
                        map: this.map,
                    });
                    this.showMap = true;
                }
            });
        }
    }
}
