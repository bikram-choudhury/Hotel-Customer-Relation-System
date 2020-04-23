import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PastOrderDetails } from '../core/application.types';

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.scss']
})
export class OrderReviewComponent implements OnInit {
  orderDetails: PastOrderDetails[];
  constructor(private _activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this._activatedRoute.data.subscribe(route => {
      this.orderDetails = route.orderDetails.body;
    });
  }
  getTotal(details: PastOrderDetails) {
    return details.itemsInCart.reduce((total, item) => total += (item.qty * item.price), 0);
  }
  getOrderCreatedDate(date: string): Date {
    return new Date(date);
  }

}
