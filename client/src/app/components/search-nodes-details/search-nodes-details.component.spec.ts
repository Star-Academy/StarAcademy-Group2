import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNodesDetailsComponent } from './search-nodes-details.component';

describe('SearchNodesDetailsComponent', () => {
	let component: SearchNodesDetailsComponent;
	let fixture: ComponentFixture<SearchNodesDetailsComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ SearchNodesDetailsComponent ]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchNodesDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
