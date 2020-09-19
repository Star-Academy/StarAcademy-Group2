import { Component, Input, Output, EventEmitter } from '@angular/core';

import { OgmaService } from '../../services/ogma.service';
import { SearchNodesService } from '../../services/search-nodes.service';

import { AccountNode } from '../../models/AccountNode';

import { SnackbarComponent } from '../snackbar/snackbar.component';

import { Animations } from './animations';

@Component({
	selector: 'graph-modal',
	templateUrl: './graph-modal.component.html',
	styleUrls: [ './graph-modal.component.scss' ],
	animations: Animations
})
export class GraphModalComponent {
	@Input() snackbar: SnackbarComponent;

	@Output() callback = new EventEmitter();

	public activeNode: AccountNode;

	public state: number;
	public title: string;
	public results: AccountNode[];

	private nodeIds: string[];

	public constructor(
		public ogmaService: OgmaService,
		private searchService: SearchNodesService
	) {
		this.setState(0);
	}

	public get modalStateStatus() {
		switch (this.state) {
			case 1:
			case 4:
				return 'form';
			case 2:
				return 'results';
			case 3:
			case 5:
				return 'details';
			default:
				return 'closed';
		}
	}

	public get overlayStateStatus() {
		return this.state === 0 ? 'closed' : 'open';
	}

	private setState(state: number, title?: string) {
		this.state = state;

		if (title) {
			this.title = title;
		} else {
			switch (state) {
				case 1:
				case 4:
					this.title = 'جستجو';
					break;
				case 2:
					this.title = 'نتایج';
					break;
				case 3:
				case 5:
					this.title = 'جزئیات';
					break;
				default:
					this.title = '';
					this.results = [];
			}
		}
	}

	public open(node?: AccountNode, state?: number, nodeIds?: string[]) {
		this.activeNode = node;
		this.nodeIds = nodeIds;
		this.setState(state ? state : node ? 3 : 1);
	}

	public back = () => this.setState(this.state - 1);
	public close = () => this.setState(0);

	public clickedOnSearchButton(e) {
		this.searchService
			.search(e.field, e.query)
			.subscribe((res: AccountNode[]) => {
				this.results = res;

				if (this.results.length === 0)
					this.snackbar.show('نتیجه‌ای یافت نشد');
				else this.setState(2);
			});
	}

	public clickedOnExpandButton(e) {
		this.ogmaService.expand(this.nodeIds, e.filters);
		this.close();
	}

	public clickedOnAddNodeButton(e) {
		this.close();
		this.callback.emit(e);
	}

	public clickedOnDetailsButton(e) {
		this.setState(3);
		this.activeNode = e.node;
	}
}
