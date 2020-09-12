import { Component, OnInit, Input } from '@angular/core';

import { AccountNode } from 'src/app/models/AccountNode';

@Component({
	selector: 'search-nodes-details',
	templateUrl: './search-nodes-details.component.html',
	styleUrls: [ './search-nodes-details.component.scss' ]
})
export class SearchNodesDetailsComponent implements OnInit {
	@Input() node: AccountNode;

	constructor() {}

	ngOnInit(): void {}
}
