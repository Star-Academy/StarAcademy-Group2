import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AccountNode } from 'src/app/models/AccountNode';

@Component({
	selector: 'search-nodes-details',
	templateUrl: './search-nodes-details.component.html',
	styleUrls: [ './search-nodes-details.component.scss' ]
})
export class SearchNodesDetailsComponent implements OnInit {
	@Input() node: AccountNode;

	@Output() callback = new EventEmitter();

	constructor() {}

	ngOnInit(): void {}

	clickedOnAddNodeButton(node: AccountNode) {
		this.callback.emit({ node });
	}
}
