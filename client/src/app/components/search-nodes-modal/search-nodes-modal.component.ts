import { Component, OnInit, Input } from '@angular/core';
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

@Component({
	selector: 'search-nodes-modal',
	templateUrl: './search-nodes-modal.component.html',
	styleUrls: [ './search-nodes-modal.component.scss' ],
	animations: [
		trigger('modalState', [
			state(
				'show',
				style({
					opacity: 1,
					transform: 'scale(1)'
				})
			),
			state(
				'hide',
				style({
					opacity: 0,
					transform: 'scale(0.3)'
				})
			),
			transition(
				'show => hide',
				animate(
					'300ms',
					keyframes([
						style({ transform: 'scale(1)' }),
						style({ transform: 'scale(0.9)' }),
						style({ transform: 'scale(1.1)' }),
						style({ transform: 'scale(0.5)' })
					])
				)
			),
			transition(
				'hide => show',
				animate(
					'300ms',
					keyframes([
						style({ transform: 'scale(0.3)', opacity: 1 }),
						style({ transform: 'scale(1.05)', opacity: 1 }),
						style({ transform: 'scale(0.95)', opacity: 1 }),
						style({ transform: 'scale(1)' })
					])
				)
			)
		])
	]
})
export class SearchNodesModalComponent implements OnInit {
	@Input() show: boolean = false;
	results: Array<AccountNode> = [];

	constructor(private searchService: SearchNodesService) {}

	ngOnInit(): void {}

	get stateName() {
		return this.show ? 'show' : 'hide';
	}

	open() {
		this.show = true;
	}

	close() {
		this.show = false;
	}

	search(query: string) {
		this.results = this.searchService.search(query);
	}
}
