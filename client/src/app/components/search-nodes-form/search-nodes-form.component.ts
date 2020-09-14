import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PatternValidator, Form, NgForm } from '@angular/forms';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
	selector: 'search-nodes-form',
	templateUrl: './search-nodes-form.component.html',
	styleUrls: [ './search-nodes-form.component.scss' ]
})
export class SearchNodesFormComponent implements OnInit {
	@Input() snackbar: SnackbarComponent;

	@Output() callback = new EventEmitter();

	numberPattern = /^\d+$/;
	shebaPattern = /^IR(\d)+$/;
	nonNumericalPattern = /^\D+$/;

	patterns = {
		branchTelephone: { pattern: this.numberPattern, length: 8 },
		ownerId: { pattern: this.numberPattern, length: 10 },
		accountType: { pattern: this.nonNumericalPattern, length: 20 },
		accountId: { pattern: this.numberPattern, length: 10 },
		cardId: { pattern: this.numberPattern, length: 16 },
		sheba: { pattern: this.shebaPattern, length: 23 }
	};

	maxLength: number = 100;

	constructor() {}

	ngOnInit(): void {}

	onFieldChanged(field: string) {
		if (this.patterns[field]) this.maxLength = this.patterns[field].length;
		else this.maxLength = 256;
	}

	clickedOnSearchButton(form: any) {
		const error = this.validateForm(form);

		if (!error) {
			this.callback.emit({
				field: form.field,
				query: form.query
			});
		} else {
			this.snackbar.show(error, 3000);
		}
	}

	validateForm(form: any) {
		if (!form.field || !form.query)
			return 'لطفاً ابتدا تمام موارد خواسته‌شده را ثبت کنید';

		if (
			!this.patterns[form.field] ||
			(form.query.length === this.patterns[form.field].length &&
				form.query.match(this.patterns[form.field].pattern))
		)
			return null;

		return 'فرمت واردشده صحیح نمی‌باشد';
	}
}
