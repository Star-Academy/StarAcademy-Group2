import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNodesResultComponent } from './search-nodes-result.component';

describe('SearchNodesResultComponent', () => {
  let component: SearchNodesResultComponent;
  let fixture: ComponentFixture<SearchNodesResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchNodesResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNodesResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
