import { Component, ViewChild, ElementRef, Input } from '@angular/core';

import { Color, ThemeService } from '../../services/theme.service';

@Component({
	selector: 'snackbar',
	templateUrl: './snackbar.component.html',
	styleUrls: [ './snackbar.component.scss' ]
})
export class SnackbarComponent {
	@ViewChild('snackbar') snackbar: ElementRef;

	public state: string;
	public text: string;
	public color: Color;

	private timeout: number;

	public constructor(public theme: ThemeService) {
		this.state = '';
		this.text = 'اسنک‌بار!';
	}

	public show(text, color: string = 'dark', duration = 3000) {
		if (this.state === 'show') clearTimeout(this.timeout);

		this.state = 'show';
		this.text = text;
		this.color = this.theme[color];

		this.timeout = setTimeout(() => {
			this.hide();
		}, duration);
	}

	private hide = () => (this.state = '');
}
