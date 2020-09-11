import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadialNodeMenuComponent } from './radial-node-menu.component';

describe('RadialNodeMenuComponent', () => {
  let component: RadialNodeMenuComponent;
  let fixture: ComponentFixture<RadialNodeMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadialNodeMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadialNodeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
