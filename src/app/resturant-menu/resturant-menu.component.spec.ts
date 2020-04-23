import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResturantMenuComponent } from './resturant-menu.component';

describe('ResturantMenuComponent', () => {
  let component: ResturantMenuComponent;
  let fixture: ComponentFixture<ResturantMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResturantMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResturantMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
