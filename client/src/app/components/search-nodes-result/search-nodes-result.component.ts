import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AccountNode } from '../../models/AccountNode';

@Component({
	selector: 'search-nodes-result',
	templateUrl: './search-nodes-result.component.html',
	styleUrls: [ './search-nodes-result.component.scss' ]
})
export class SearchNodesResultComponent {
	@Input() results: AccountNode[];

	@Output() addNodeCallback = new EventEmitter();
	@Output() detailsCallback = new EventEmitter();

	public clickedOnAddNodeButton = (node: AccountNode) =>
		this.addNodeCallback.emit({ node });

	public clickedOnDetailsButton = (node: AccountNode) =>
		this.detailsCallback.emit({ node });
}
