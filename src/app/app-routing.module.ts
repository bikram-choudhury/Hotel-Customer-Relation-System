import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderReviewComponent } from './order-review/order-review.component';
import { OrderDetailsService } from './core/services/order-detail.service';


const routes: Routes = [{
  path: '',
  component: LandingComponent
}, {
  path: 'checkout',
  component: CheckoutComponent
}, {
  path: 'my-orders',
  component: OrderReviewComponent,
  resolve: { orderDetails: OrderDetailsService }
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
