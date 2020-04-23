import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplicationStore } from '../core/application.types';
import { getApplicationData } from '../core/state/actions/application.action';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(private _store: Store<ApplicationStore>) { }

  ngOnInit() {
    this._store.dispatch(getApplicationData());
  }


}
