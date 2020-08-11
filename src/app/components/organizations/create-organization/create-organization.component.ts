/// <reference types="@types/googlemaps" />
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Observable, Subscription, timer } from 'rxjs';
import { Organization, ErrorResponse, User } from '@models';
import { GeoLocationService } from '@services/geo-location.service';
import { OrganizationService } from '@services/organization.service';
import { UserService } from '@services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.css']
})
export class CreateOrganizationComponent implements OnInit, OnDestroy {

  @ViewChild('gmap') gmapElement: any;

  org: User;
  orgForm: FormGroup;
  address: any;
  addressForm: FormGroup;
  showAddressError: boolean;
  map: google.maps.Map;
  marker: google.maps.Marker;
  showMap: boolean;
  subs: Subscription[] = [];

  constructor(private os: OrganizationService,
    private gls: GeoLocationService,
    private ro: Router) {}

  ngOnInit() {
    this.setupForm();
  }

  ngOnDestroy() {
    if(this.marker) {
      this.marker.setMap(null);
      this.marker = null;
    }
    this.subs.forEach(s=> s.unsubscribe());
  }

  closeMap() {
    this.showMap = false;
  }

  confirmAddress() {
    this.addressForm.controls['lat'].patchValue(this.address.lat);
    this.addressForm.controls['lng'].patchValue(this.address.lng);
    Object.keys(this.addressForm.value).forEach(key=> {
      this.orgForm.controls[key].patchValue(this.addressForm.value[key]);
    });
    this.showMap = false;
  }

  createOrg() {
    this.subs.push(this.os.createOrganization(this.orgForm.value)
    .subscribe(res=> {
      console.log(res)
      this.ro.navigate(['/admin/organization/'+res.id]);
    }, err=> {
      console.log(err)
    }));
  }

  mapAddress(event: any) {
    event.preventDefault();
    if(this.addressForm.valid) {
      this.subs.push(this.gls.searchAddress(this.addressForm.value)
      .subscribe(res=> {
        console.log(res)
        this.address = res.address;
        this.viewMap(this.address.lat, this.address.lng);
      }, err=>{
        console.log(err.error)
      }));
    } else {
      console.log('form invalid')
      this.showAddressError = true;
    }
  }

  setupForm() {
    this.orgForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z .]+$/)]),
      address1: new FormControl(null, Validators.required),
      address2: new FormControl(),
      city: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
      state: new FormControl(null,  [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
      zip: new FormControl(null,  [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      zipExt: new FormControl(null, Validators.pattern(/^[0-9]+$/)),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null, Validators.pattern(/^[0-9]+$/)),
      phoneExt: new FormControl(null, Validators.pattern(/^[0-9]+$/)),
      lat: new FormControl(null, Validators.required),
      lng: new FormControl(null, Validators.required),
      displayName: new FormControl(null, Validators.pattern(/^[a-zA-Z]+$/))
    });

    this.addressForm = new FormGroup({
      address1: new FormControl(null, Validators.required),
      address2: new FormControl(),
      city: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
      state: new FormControl(null,  [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
      zip: new FormControl(null,  [Validators.required, Validators.pattern(/^[0-9]+$/), Validators.minLength(5)]),
      zipExt: new FormControl(),
      lat: new FormControl(),
      lng: new FormControl()
    });
    this.subs.push(this.orgForm.valueChanges.subscribe(value=> console.log(this.orgForm)));
  }

  viewMap(lat: number, lng: number) {
    this.showMap = true;
    timer(500).subscribe(()=> {
      console.log(this.gmapElement)
      if(this.gmapElement) {
        this.map = new google.maps.Map(this.gmapElement.nativeElement,
        {
            center: new google.maps.LatLng(lat,lng),
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            gestureHandling: 'greedy'
        });
        this.marker = new google.maps.Marker({
          position: new google.maps.LatLng(lat,lng),
          draggable: true,
          map: this.map
        });
        this.marker.addListener('dragend', (event)=> {
          this.address.lat = this.marker.getPosition().lat();
          this.address.lng = this.marker.getPosition().lng();
          // console.log(this)
        });
        // console.log(this.map)
      }
    });
  }


}
