import { Component, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
	selector: 'app-snackbar',
	templateUrl: './snackbar.component.html',
	styleUrls: [ './snackbar.component.scss' ]
})
export class SnackbarComponent {
	@Input() class: string;

	@ViewChild('snackbar') snackbar: ElementRef;

	public state: string;
	public text: string;

	private timeout: number;

	public constructor() {
		this.state = 'hide';
		this.text = 'اسنک‌بار!';
	}

	public show(text, duration = 3000) {
		if (this.state !== 'hide') {
			clearTimeout(this.timeout);
			this.hide();
		}

		this.state = '';

		this.text = text;
		duration -= 500;

		this.timeout = setTimeout(() => {
			this.hide();
		}, duration);
	}

	private hide = () => (this.state = 'hide');
}
