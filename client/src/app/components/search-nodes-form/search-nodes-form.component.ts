import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'search-nodes-form',
	templateUrl: './search-nodes-form.component.html',
	styleUrls: [ './search-nodes-form.component.scss' ]
})
export class SearchNodesFormComponent implements OnInit {
	@Output() callback = new EventEmitter();

	searchQueryInput;
	queryValue: string = '';
	fieldValue: string = 'BranchName';

	constructor() {}

	ngOnInit(): void {}

	clickedOnSearchButton(e: Event) {
		this.callback.emit({ field: this.fieldValue, query: this.queryValue });
	}
}
