import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApplicationStore, Cart, Item } from '../core/application.types';
import { getApplicationData } from '../core/state/actions/application.action';
import { showSigninSignupModal } from '../core/state/actions/auth.action';
import { handleCartItemSubmitSuccess, saveItemToCart, submitCartItems } from '../core/state/actions/cart.action';
declare var $: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private ngDestroy$ = new Subject();
  cartItems: Cart[];
  items: Item[];
  isOrderConfirmed: boolean;
  isUserSignedUp: boolean;

  constructor(
    private _store: Store<ApplicationStore>,
    private action$: Actions
  ) { }

  ngOnInit() {
    this._store.select('auth', 'accessToken').pipe(takeUntil(this.ngDestroy$))
      .subscribe((token: string) => this.isUserSignedUp = !!token);

    this._store.select('items').pipe(takeUntil(this.ngDestroy$))
      .subscribe((items: Item[]) => {
        this.items = items;

        if (this.items && this.items.length) {
          this._store.select('cart').pipe(takeUntil(this.ngDestroy$))
            .subscribe((cartItems: Cart[]) => {
              this.cartItems = JSON.parse(JSON.stringify(cartItems));
            });
        } else {
          this._store.dispatch(getApplicationData());
        }
      });
  }
  getItemName(itemId: string) {
    if (this.items && this.items.length) {
      const item = this.items.find(adhoc => adhoc.id === itemId);
      return item.name;
    }
  }
  getItemPrice(itemId: string) {
    if (this.items && this.items.length) {
      const item = this.items.find(adhoc => adhoc.id === itemId);
      return item.price;
    }
  }
  removeItem(itemId: string) {
    const cartItems = this.cartItems.filter(item => item.itemId != itemId);
    this._store.dispatch(
      saveItemToCart({ payload: [...cartItems] })
    );
  }
  incrementItemQty(itemId: string) {
    const item = this.cartItems.find(item => item.itemId === itemId);
    item.qty += 1;

    this._store.dispatch(
      saveItemToCart({ payload: [...this.cartItems] })
    );
  }
  decrementItemQty(itemId: string) {
    const item = this.cartItems.find(item => item.itemId === itemId);
    if (item.qty > 1) {
      item.qty -= 1;
      this._store.dispatch(
        saveItemToCart({ payload: [...this.cartItems] })
      );
    } else {
      if (confirm("Are you sure, to remove the item from list?")) {
        this.removeItem(itemId);
      }
    }
  }
  getTotal() {
    let totalPrice = 0;
    this.cartItems.forEach(cartItem => {
      totalPrice += (cartItem.qty * cartItem.price);
    });
    return totalPrice;
  }
  checkout() {
    if (this.isUserSignedUp) {
      this._store.dispatch(
        submitCartItems({ payload: [...this.cartItems] })
      );
      this.action$.pipe(
        ofType(handleCartItemSubmitSuccess.type)
      ).subscribe(_ => {
        this._store.dispatch(
          saveItemToCart({ payload: [] })
        );
        $("#orderSuccessModal").modal('show');
      });
    } else {
      this._store.dispatch(showSigninSignupModal());
    }
  }
  ngOnDestroy() {
    this.ngDestroy$.next();
    this.ngDestroy$.complete();
  }

}
