import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
	selector: 'app-snackbar',
	templateUrl: './snackbar.component.html',
	styleUrls: [ './snackbar.component.scss' ]
})
export class SnackbarComponent implements OnInit {
	@Input() class: string = '';

	@ViewChild('snackbar') snackbar: ElementRef;

	text: string = 'اسنک‌بار!';
	duration: number = 0.0;

	timeout;

	constructor() {}

	ngOnInit(): void {}

	public show(text, duration = 3000) {
		if (!this.snackbar.nativeElement.classList.contains('hide')) {
			clearTimeout(this.timeout);
			this.hide();
		}

		this.text = text;
		this.duration = duration - 500;
		this.snackbar.nativeElement.classList.remove('hide');

		this.timeout = setTimeout(() => {
			this.hide();
		}, this.duration);
	}

	private hide() {
		this.snackbar.nativeElement.classList.add('hide');
	}
}
