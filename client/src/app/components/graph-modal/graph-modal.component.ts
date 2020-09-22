import { Component, Input, Output, EventEmitter } from '@angular/core';

import { ThemeService } from '../../services/theme.service';
import { OgmaService } from '../../services/ogma.service';
import { SearchNodesService } from '../../services/search-nodes.service';

import { AccountNode } from '../../models/AccountNode';

import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
	selector: 'graph-modal',
	templateUrl: './graph-modal.component.html',
	styleUrls: [ './graph-modal.component.scss' ]
})
export class GraphModalComponent {
	@Input() snackbar: SnackbarComponent;

	@Output() addNodeCallback = new EventEmitter();
	@Output() dragMoveCallback = new EventEmitter();
	@Output() dragEndCallback = new EventEmitter();

	public state: number;
	public title: string;
	public opening: boolean;
	public shaking: boolean;
	public slidingToRight: boolean;
	public slidingToLeft: boolean;
	public dragging: boolean;

	public activeNode: AccountNode;
	public results: AccountNode[];

	private nodeIds: string[];
	private shakingTimeout: number;

	public constructor(
		public theme: ThemeService,
		public ogmaService: OgmaService,
		private searchService: SearchNodesService
	) {
		this.dragging = false;

		this.setState(0);
	}

	public get overlayStateStatus() {
		return this.state === 0 || this.dragging ? 'closed' : 'open';
	}

	private setState(state: number, title?: string) {
		if (this.state === 0) {
			this.opening = true;
			setTimeout(() => {
				this.opening = false;
			}, 1000);
		} else if (state !== 0) {
			this.slide(this.state < state ? 'right' : 'left');
		}

		setTimeout(() => {
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
		}, this.opening || state === 0 ? 0 : 500);
	}

	public open(node?: AccountNode, state?: number, nodeIds?: string[]) {
		this.activeNode = node;
		this.nodeIds = nodeIds;
		this.setState(state ? state : node ? 3 : 1);
	}

	public back = () => this.setState(this.state - 1);
	public close = () => this.setState(0);

	public shake(duration: number = 500) {
		if (this.shaking) clearTimeout(this.shakingTimeout);

		this.shaking = true;

		this.shakingTimeout = setTimeout(() => {
			this.shaking = false;
		}, duration);
	}

	public slide(direction: string) {
		if (direction === 'right') {
			this.slidingToRight = true;
			setTimeout(() => {
				this.slidingToRight = false;
			}, 1000);
		} else {
			this.slidingToLeft = true;
			setTimeout(() => {
				this.slidingToLeft = false;
			}, 1000);
		}
	}

	public clickedOnSearchButton(e) {
		this.searchService
			.search(e.field, e.query)
			.subscribe((res: AccountNode[]) => {
				this.results = res;

				if (this.results.length === 0) {
					this.snackbar.show('نتیجه‌ای یافت نشد', 'danger');
					this.shake();
				} else {
					this.setState(2);
				}
			});
	}

	public clickedOnExpandButton(e) {
		this.ogmaService.expand(this.nodeIds, e.filters);
		this.close();
	}

	public clickedOnAddNodeButton(e) {
		this.close();
		this.emit(this.addNodeCallback, e);
	}

	public clickedOnDetailsButton(e) {
		this.setState(3);
		this.activeNode = e.node;
	}

	public dragStart = () => (this.dragging = true);
	public dragMove = (e) => this.emit(this.dragMoveCallback, e);

	public dragEnd(e) {
		this.emit(this.dragEndCallback, e);

		this.dragging = false;
		this.close();
	}

	private emit = (emitter, e) => emitter.emit(e);
}
