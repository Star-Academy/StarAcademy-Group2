import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNodesModalComponent } from './search-nodes-modal.component';

describe('SearchNodesModalComponent', () => {
	let component: SearchNodesModalComponent;
	let fixture: ComponentFixture<SearchNodesModalComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ SearchNodesModalComponent ]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchNodesModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
