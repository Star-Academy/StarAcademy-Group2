import {
	animate,
	keyframes,
	state,
	style,
	transition,
	trigger
} from '@angular/animations';
import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';

import { OgmaService } from 'src/app/services/ogma.service';

import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
	selector: 'search-edges-modal',
	templateUrl: './search-edges-modal.component.html',
	styleUrls: [ './search-edges-modal.component.scss' ],
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
export class SearchEdgesModalComponent implements OnInit {
	@ViewChild('snackbar') snackbar: SnackbarComponent;

	@Input() show: number;

	@Output() callback = new EventEmitter();

	title: string;
	nodes: string[];
	searching: boolean = true;

	@Input() ogmaService: OgmaService;

	constructor() {}

	ngOnInit(): void {
		this.show = 0;
		this.title = '';
	}

	get modalStateStatus() {
		switch (this.show) {
			case 0:
				return 'closed';
			case 1:
				return 'form';
		}
	}

	get overlayStateStatus() {
		return this.show === 0 ? 'closed' : 'open';
	}

	public open(nodes) {
		this.nodes = nodes;
		this.show = 1;
		this.title = 'بسط‌دادن';
	}

	back() {
		this.show--;
	}

	close() {
		this.show = 0;
	}

	clickedOnSearchButton(e) {
		this.ogmaService.expandNode(this.nodes, e);
		this.close();
	}
}
