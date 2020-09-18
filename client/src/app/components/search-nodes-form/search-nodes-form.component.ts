import { Component, Output, EventEmitter, Input } from '@angular/core';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
	selector: 'search-nodes-form',
	templateUrl: './search-nodes-form.component.html',
	styleUrls: [ './search-nodes-form.component.scss' ]
})
export class SearchNodesFormComponent {
	@Input() snackbar: SnackbarComponent;

	@Output() callback = new EventEmitter();

	public maxLength: number = 100;

	private validators = {
		branchTelephone: new Validator(PATTERNS.numberPattern, 8),
		ownerId: new Validator(PATTERNS.numberPattern, 10),
		accountType: new Validator(PATTERNS.nonNumericalPattern, 20),
		accountId: new Validator(PATTERNS.numberPattern, 10),
		cardId: new Validator(PATTERNS.numberPattern, 16),
		sheba: new Validator(PATTERNS.shebaPattern, 23)
	};

	public updateMaxLength(field: string) {
		this.maxLength = this.validators[field]
			? this.validators[field].length
			: 256;
	}

	public clickedOnSearchButton({ field, query }) {
		const error = this.validateForm(field, query);

		if (!error) this.callback.emit({ field, query });
		else this.snackbar.show(error);
	}

	private validateForm(field: string, query: string): string {
		if (!field || !query)
			return 'لطفاً ابتدا تمام موارد خواسته‌شده را ثبت کنید';

		const validator = this.validators[field];

		return validator && !this.validQuery(query, validator)
			? 'فرمت واردشده صحیح نمی‌باشد'
			: null;
	}

	private validQuery(query: string, validator: Validator): boolean {
		return (
			query.length === validator.length &&
			query.match(validator.pattern).length > 0
		);
	}
}

class Validator {
	public pattern: RegExp;
	public length: number;

	public constructor(pattern: RegExp, length: number) {
		this.pattern = pattern;
		this.length = length;
	}
}

const PATTERNS = {
	numberPattern: /^\d+$/,
	shebaPattern: /^IR(\d)+$/,
	nonNumericalPattern: /^\D+$/
};
