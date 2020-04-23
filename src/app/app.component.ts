import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Hotel Customer Relation System';
  isLoggedInRoute: boolean;
  loggedInRoutes: string[] = ['/my-orders', '/checkout'];

  constructor(private _router: Router) {
    this._router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      this.isLoggedInRoute = this.loggedInRoutes.includes(event.url);
    });
  }
}
