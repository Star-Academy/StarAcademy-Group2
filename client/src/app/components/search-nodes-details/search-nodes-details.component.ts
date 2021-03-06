import { Component, Input, Output, EventEmitter } from '@angular/core';

import { AccountNode } from 'src/app/models/AccountNode';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
	selector: 'search-nodes-details',
	templateUrl: './search-nodes-details.component.html',
	styleUrls: [ './search-nodes-details.component.scss' ]
})
export class SearchNodesDetailsComponent {
	@Input() node: AccountNode;
	@Input() searching: boolean;

	@Output() callback = new EventEmitter();

	public constructor(public theme: ThemeService) {}

	clickedOnAddNodeButton = (node: AccountNode) =>
		this.callback.emit({ node });
}
