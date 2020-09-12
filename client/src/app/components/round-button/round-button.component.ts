import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
	selector: 'round-button',
	templateUrl: './round-button.component.html',
	styleUrls: [ './round-button.component.scss' ]
})
export class RoundButtonComponent implements OnInit {
	@Input() btnClass: string;
	@Input() icon: string;
	@Input() iconSize: number;

	@Output() callback: EventEmitter<Event> = new EventEmitter();

	constructor() {}

	ngOnInit(): void {}

	clickedOnButton(e) {
		this.callback.emit(e);
	}
}
