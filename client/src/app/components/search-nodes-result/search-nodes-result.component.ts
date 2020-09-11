import { Component, OnInit, Input } from '@angular/core';
import { AccountNode } from '../../models/AccountNode';
import { OgmaService } from 'src/app/services/ogma.service';

@Component({
	selector: 'search-nodes-result',
	templateUrl: './search-nodes-result.component.html',
	styleUrls: [ './search-nodes-result.component.scss' ]
})
export class SearchNodesResultComponent implements OnInit {
	@Input() node: AccountNode;

	constructor(private ogmaService: OgmaService) {}

	ngOnInit(): void {}

	addNodeToGraph(event) {
		if (event.source.getFreeDragPosition().y < -250) {
			this.ogmaService.addNode(
				event.source.getFreeDragPosition().x,
				event.source.getFreeDragPosition().y
			);
		}
	}
}
