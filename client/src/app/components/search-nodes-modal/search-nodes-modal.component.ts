import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ViewChild
} from '@angular/core';
import {
	trigger,
	style,
	state,
	transition,
	animate,
	keyframes
} from '@angular/animations';

import { SearchNodesService } from '../../services/search-nodes.service';

import { AccountNode } from '../../models/AccountNode';

import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
	selector: 'search-nodes-modal',
	templateUrl: './search-nodes-modal.component.html',
	styleUrls: [ './search-nodes-modal.component.scss' ],
	animations: [
		trigger('overlayState', [
			state(
				'closed',
				style({
					opacity: 0
				})
			),
			state(
				'open',
				style({
					opacity: 1
				})
			),
			transition(
				'closed => open',
				animate(
					'300ms',
					keyframes([ style({ opacity: 0 }), style({ opacity: 1 }) ])
				)
			),
			transition(
				'open => closed',
				animate(
					'300ms',
					keyframes([ style({ opacity: 1 }), style({ opacity: 0 }) ])
				)
			)
		]),
		trigger('modalState', [
			state(
				'closed',
				style({
					opacity: 0,
					transform: 'scale(0.3)'
				})
			),
			state(
				'form',
				style({
					opacity: 1,
					transform: 'scale(1)'
				})
			),

			state(
				'results',
				style({
					opacity: 1
				})
			),
			state(
				'details',
				style({
					opacity: 1
				})
			),
			transition(
				'closed => form',
				animate(
					'300ms',
					keyframes([
						style({ transform: 'scale(0)', opacity: 1 }),
						style({ transform: 'scale(1.05)', opacity: 1 }),
						style({ transform: 'scale(0.95)', opacity: 1 }),
						style({ transform: 'scale(1)' })
					])
				)
			),
			transition(
				'form => results, results => details, details => results, results => form',
				animate(
					'600ms',
					keyframes([
						style({ transform: 'scale(1)' }),
						style({ transform: 'scale(1.2)' }),
						style({ transform: 'scale(0)' }),
						style({ transform: 'scale(1.05)', opacity: 1 }),
						style({ transform: 'scale(0.95)', opacity: 1 }),
						style({ transform: 'scale(1)' })
					])
				)
			),
			transition(
				'form => closed, results => closed, details => closed',
				animate(
					'300ms',
					keyframes([
						style({ transform: 'scale(1)' }),
						style({ transform: 'scale(0.9)' }),
						style({ transform: 'scale(1.1)' }),
						style({ transform: 'scale(0.5)' })
					])
				)
			)
		])
	]
})
export class SearchNodesModalComponent implements OnInit {
	@ViewChild('snackbar') snackbar: SnackbarComponent;

	@Input() show: number;

	@Output() callback = new EventEmitter();

	title: string;
	results: Array<AccountNode> = [];
	activeNode: AccountNode;
	searching: boolean = true;

	constructor(private searchService: SearchNodesService) {}

	ngOnInit(): void {
		this.results = this.searchService.search('a', 'b');
		this.show = 0;
		this.title = 'جستجو';
	}

	get modalStateStatus() {
		switch (this.show) {
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

	get overlayStateStatus() {
		return this.show === 0 ? 'closed' : 'open';
	}

	open(node?: AccountNode) {
		if (node) {
			console.log(node);

			this.show = 3;
			this.title = 'جزئیات';
			this.activeNode = node;
			this.searching = false;
		} else {
			this.show = 1;
			this.title = 'جستجو';
		}
	}

	back() {
		this.show--;
	}

	close() {
		this.show = 0;
	}

	clickedOnSearchButton(e) {
		this.show = 2;
		this.title = 'نتایج جستجو';

		console.log(e.field, e.query);

		this.results = this.searchService.search(e.field, e.query);

		if (this.results.length === 0) this.snackbar.show('نتیجه‌ای یافت نشد');
	}

	clickedOnAddNodeButton(e) {
		this.close();
		this.callback.emit(e);
	}

	clickedOnDetailsButton(e) {
		this.show = 3;
		this.title = 'جزئیات';

		this.activeNode = e.node;
	}
}
