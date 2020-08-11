/// <reference types="@types/googlemaps" />
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Observable, Subscription, timer } from 'rxjs';
import { Group, Organization, User, SuccessResponse, ErrorResponse } from '@models';
import { GeoLocationService } from '@services/geo-location.service';
import { GroupService } from '@services/group.service';
import { OrganizationService } from '@services/organization.service';
import { UserService } from '@services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit, OnDestroy {

  @ViewChild('gmap') gmapElement: any;

  user: User;
  userForm: FormGroup;
  groups: Group[] = [];
  orgs: Organization[] = [];
  address: any;
  addressForm: FormGroup;
  showAddressError: boolean;
  map: google.maps.Map;
  marker: google.maps.Marker;
  showMap: boolean;
  subs: Subscription[] = [];

  constructor(private gls: GeoLocationService,
    private gs: GroupService,
    private os: OrganizationService,
    private us: UserService,
    private ro: Router) { }

  ngOnInit() {
    this.getGroups();
    this.getOrgs();
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
      this.userForm.controls[key].patchValue(this.addressForm.value[key]);
    });
    this.showMap = false;
  }

  createUser() {
    this.subs.push(this.us.createUser(this.userForm.value)
    .subscribe(res=> {
      console.log(res)
      this.ro.navigate(['/admin/user/'+res.id]);
    }, err=> {
      console.log(err)
    }));
  }

  getGroups() {
    this.subs.push(this.gs.getGroups()
    .subscribe(groups=> {
      this.groups = groups;
      console.log(this.groups)
    }, err=> {
      console.log(err)
    }));
  }

  getOrgs() {
    this.subs.push(this.os.getOrganizations()
    .subscribe(orgs=> {
      this.orgs = orgs;
      console.log(this.orgs)
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
    this.userForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
      middleInitial: new FormControl(null, [Validators.pattern(/^[a-zA-Z]+$/), Validators.maxLength(1)]),
      suffix: new FormControl(),
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
      organizationId: new FormControl(null, Validators.pattern(/^[0-9]+$/)),
      groupId: new FormControl(null, Validators.pattern(/^[0-9]+$/)),
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
    this.subs.push(this.userForm.valueChanges.subscribe(value=> console.log(this.userForm)));
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
