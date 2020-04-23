import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApplicationEffects } from './core/state/effects/application.effects';
import { metaReducers, reducers } from './core/state/reducers';
import { LandingComponent } from './landing/landing.component';
import { HeaderComponent } from './header/header.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ResturantMenuComponent } from './resturant-menu/resturant-menu.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { GalleryComponent } from './gallery/gallery.component';
import { EmployeesComponent } from './employees/employees.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { FooterComponent } from './footer/footer.component';
import { ApplicationService } from './core/services/application.service';
import { ApiService } from './core/services/api.sesrvice';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { JWTInterceptor } from './core/services/jwt.interceptor';
import { OrderReviewComponent } from './order-review/order-review.component';
import { OrderDetailsService } from './core/services/order-detail.service';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    HeaderComponent,
    AboutUsComponent,
    ResturantMenuComponent,
    CatalogueComponent,
    GalleryComponent,
    EmployeesComponent,
    FeedbackComponent,
    FeedbackFormComponent,
    FooterComponent,
    CheckoutComponent,
    OrderReviewComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    EffectsModule.forRoot([ApplicationEffects]),
    !environment.production
      ? StoreDevtoolsModule.instrument({
        maxAge: 25, // Retains last 25 states
        logOnly: environment.production // Restrict extension to log-only mode
      })
      : []
  ],
  providers: [
    ApiService,
    ApplicationService,
    OrderDetailsService,
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
