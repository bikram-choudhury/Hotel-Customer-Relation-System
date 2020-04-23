import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApplicationStore, Category, Item, Cart } from '../core/application.types';
import { saveItemToCart } from '../core/state/actions/cart.action';

@Component({
  selector: 'app-resturant-menu',
  templateUrl: './resturant-menu.component.html',
  styleUrls: ['./resturant-menu.component.scss']
})
export class ResturantMenuComponent implements OnInit {
  private ngDestroy$ = new Subject();
  categories: Category[];
  items: Item[];
  selectedCategory: Category;
  itemsForSelectedCategory: Item[];
  cartItems: Cart[];

  constructor(private _store: Store<ApplicationStore>) { }

  ngOnInit() {
    this._store.select('categories').pipe(takeUntil(this.ngDestroy$))
      .subscribe((categories: Category[]) => {
        this.categories = categories;
        this.getItems();
      });
    this._store.select('cart').pipe(takeUntil(this.ngDestroy$))
      .subscribe((items: Cart[]) => this.cartItems = items);
  }
  getItems() {
    this._store.select('items').pipe(takeUntil(this.ngDestroy$))
      .subscribe((items: Item[]) => {
        this.items = items;
        this.setCategory(this.categories[0]);
      });
  }
  setCategory(category: Category) {
    this.selectedCategory = category;
    this.itemsForSelectedCategory = this.items.filter(item => item.categoryId === this.selectedCategory.id);
  }
  addToCart(item: Item, qty: number) {
    if (item) {
      const itemId = item.id;
      let itemToAddInCart = this.cartItems.find(cartItem => cartItem.itemId === itemId);
      if (itemToAddInCart) {
        itemToAddInCart.qty = itemToAddInCart.qty + qty;
      } else {
        itemToAddInCart = { itemId, qty, price: item.price };
      }
      this._store.dispatch(
        saveItemToCart({ payload: [...this.cartItems, itemToAddInCart] })
      )
    }
  }
  ngOnDestroy() {
    this.ngDestroy$.next();
    this.ngDestroy$.complete();
  }

}
