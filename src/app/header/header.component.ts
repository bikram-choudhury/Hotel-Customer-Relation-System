import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApplicationStore, Cart } from '../core/application.types';
import { createUser, Logout, setTokens, showSigninSignupModal, validateUser } from '../core/state/actions/auth.action';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private ngDestroy$ = new Subject();
  panelState: string;
  cartItems: Cart[];
  signinForm: FormGroup;
  signupForm: FormGroup;
  isUserSignedUp: boolean;

  constructor(
    private _store: Store<ApplicationStore>,
    private _fb: FormBuilder,
    private _action$: Actions
  ) { }

  ngOnInit() {
    this._store.select('cart').pipe(takeUntil(this.ngDestroy$))
      .subscribe((items: Cart[]) => this.cartItems = items);

    this._store.select('auth', 'accessToken').pipe(takeUntil(this.ngDestroy$))
      .subscribe((token: string) => this.isUserSignedUp = !!token);

    this._action$.pipe(ofType(setTokens.type)).subscribe(
      () => $("#signinSignupModal").modal('hide')
    );
    this._action$.pipe(
      ofType(showSigninSignupModal.type, Logout.type)
    ).subscribe(
      () => this.showLoginModal()
    );

    this.signinForm = this._fb.group({
      username: new FormControl('', Validators.compose([
        Validators.required,
        this.emailValidator.bind(this)
      ])),
      password: new FormControl('', [Validators.required])
    });
    this.signupForm = this._fb.group({
      name: new FormControl('', [Validators.required]),
      contactNo: new FormControl('', [Validators.required]),
      username: new FormControl('', Validators.compose([
        Validators.required,
        this.emailValidator.bind(this)
      ])),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }
  emailValidator(control: FormControl) {
    const value = control.value;
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmailValid = regex.test(value);
    return isEmailValid ? null : { email: false };
  }
  get usernameForSignin() {
    return this.signinForm.get('username');
  }
  get passwordForSignin() {
    return this.signinForm.get('password');
  }
  get customerName() {
    return this.signupForm.get('name');
  }
  get contactNo() {
    return this.signupForm.get('contactNo');
  }
  get usernameForSignup() {
    return this.signupForm.get('username');
  }
  get passwordForSignup() {
    return this.signupForm.get('password');
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }
  showLoginModal() {
    this.panelState = 'signin';
    $("#signinSignupModal").modal('show');
  }
  updatePanelVisibility(state: string) {
    this.panelState = state;
  }
  submitSigninForm() {
    this._store.dispatch(
      validateUser({ payload: { ...this.signinForm.value } })
    );
  }
  submitSignupForm() {
    this._store.dispatch(
      createUser({ payload: { ...this.signupForm.value } })
    );
  }
  ngOnDestroy() {
    this.ngDestroy$.next();
    this.ngDestroy$.complete();
  }
}
