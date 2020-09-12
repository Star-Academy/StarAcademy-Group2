import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNodesFormComponent } from './search-nodes-form.component';

describe('SearchNodesFormComponent', () => {
  let component: SearchNodesFormComponent;
  let fixture: ComponentFixture<SearchNodesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchNodesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNodesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
