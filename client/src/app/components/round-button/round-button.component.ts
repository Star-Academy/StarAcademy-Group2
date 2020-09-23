import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Color, ThemeService } from 'src/app/services/theme.service';

@Component({
	selector: 'round-button',
	templateUrl: './round-button.component.html',
	styleUrls: [ './round-button.component.scss' ]
})
export class RoundButtonComponent {
	@Input() btnStyle: Color;
	@Input() icon: string;
	@Input() iconSize: number;

	@Output() callback: EventEmitter<Event> = new EventEmitter();

	public hovered: boolean = false;

	public constructor(public theme: ThemeService) {}

	public clickedOnButton = (e) => this.callback.emit(e);

	public get style() {
		return {
			background: this.hovered
				? this.theme.light.hovered.background
				: this.theme.light.background,
			color: this.hovered
				? this.btnStyle.background
				: this.theme.label.color,
			width: this.iconSize + 'rem',
			height: this.iconSize + 'rem'
		};
	}
}
