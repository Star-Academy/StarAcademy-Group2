import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
	selector: 'round-button',
	templateUrl: './round-button.component.html',
	styleUrls: [ './round-button.component.scss' ]
})
export class RoundButtonComponent {
	@Input() btnClass: string;
	@Input() icon: string;
	@Input() iconSize: number;

	@Output() callback: EventEmitter<Event> = new EventEmitter();

	public clickedOnButton = (e) => this.callback.emit(e);
}
