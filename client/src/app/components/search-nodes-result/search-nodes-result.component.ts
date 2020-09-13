import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountNode } from '../../models/AccountNode';
import { OgmaService } from 'src/app/services/ogma.service';
import { GraphService } from 'src/app/services/graph.service';

@Component({
	selector: 'search-nodes-result',
	templateUrl: './search-nodes-result.component.html',
	styleUrls: [ './search-nodes-result.component.scss' ]
})
export class SearchNodesResultComponent implements OnInit {
	@Input() results: Array<AccountNode>;

	@Output() addNodeCallback = new EventEmitter();
	@Output() detailsCallback = new EventEmitter();

	constructor(private ogmaService: OgmaService) {}

	ngOnInit(): void {}

	addNodeToGraph(e, node: AccountNode) {
		this.addNodeCallback.emit({
			node,
			attributes: {
				x: e.source.getFreeDragPosition().x,
				y: e.source.getFreeDragPosition().y
			}
		});
	}

	clickedOnAddNodeButton(node: AccountNode) {
		this.addNodeCallback.emit({ node });
	}

	clickedOnDetailsButton(node: AccountNode) {
		this.detailsCallback.emit({ node });
	}
}
