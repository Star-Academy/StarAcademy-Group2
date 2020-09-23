import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';
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
	@Output() dragStartCallback = new EventEmitter();
	@Output() dragMoveCallback = new EventEmitter();
	@Output() dragEndCallback = new EventEmitter();

	public constructor(public theme: ThemeService) {}

	public clickedOnAddNodeButton = (node: AccountNode) =>
		this.addNodeCallback.emit({ node });

	public clickedOnDetailsButton = (node: AccountNode) =>
		this.detailsCallback.emit({ node });

	dragStart = () => this.dragStartCallback.emit();

	dragProgress = (event, node) =>
		this.dragMoveCallback.emit({
			node,
			position: event.pointerPosition
		});

	dragEnd = (event, node) =>
		this.dragEndCallback.emit({
			node,
			position:
				event.source._dragRef._pointerPositionAtLastDirectionChange
		});
}
