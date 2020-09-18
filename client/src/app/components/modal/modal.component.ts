import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SearchNodesService } from '../../services/search-nodes.service';

import { AccountNode } from '../../models/AccountNode';

import { SnackbarComponent } from '../snackbar/snackbar.component';

import { Animations } from './animations';

@Component({
	selector: 'modal',
	templateUrl: './modal.component.html',
	styleUrls: [ './modal.component.scss' ],
	animations: Animations
})
export class ModalComponent {
	@Input() snackbar: SnackbarComponent;

	@Output() callback = new EventEmitter();

	public activeNode: AccountNode;

	public state: number;
	public title: string;
	public results: AccountNode[];

	public constructor(private searchService: SearchNodesService) {
		this.setState(0);
	}

	public get modalStateStatus() {
		switch (this.state) {
			case 0:
				return 'closed';
			case 1:
				return 'form';
			case 2:
				return 'results';
			case 3:
				return 'details';
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
				case 0:
					this.title = '';
					this.results = [];
					break;
				case 1:
					this.title = 'جستجو';
					break;
				case 2:
					this.title = 'نتایج';
					break;
				case 3:
					this.title = 'جزئیات';
					break;
				default:
					break;
			}
		}
	}

	public open(node?: AccountNode) {
		this.activeNode = node;
		this.setState(node ? 3 : 1);
	}

	public back = () => this.setState(this.state - 1);
	public close = () => this.setState(0);

	public async clickedOnSearchButton(e) {
		this.results = await this.searchService.search(e.field, e.query);

		if (this.results.length === 0) this.snackbar.show('نتیجه‌ای یافت نشد');
		else this.setState(2);
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
