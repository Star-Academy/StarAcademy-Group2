import { Component, Output, EventEmitter, Input } from '@angular/core';

import { Color, ThemeService } from '../../services/theme.service';

import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
	selector: 'search-nodes-form',
	templateUrl: './search-nodes-form.component.html',
	styleUrls: [ './search-nodes-form.component.scss' ]
})
export class SearchNodesFormComponent {
	@Input() snackbar: SnackbarComponent;
	@Input() actionStyle: Color;

	@Output() searchCallback = new EventEmitter();
	@Output() shakeCallback = new EventEmitter();

	public maxLength: number = 100;
	public fieldSelectOpen: boolean = false;

	public options: Option[] = [
		new Option('BranchName', 'نام شعبه'),
		new Option('BranchTelephone', 'شماره تلفن شعبه'),
		new Option('OwnerID', 'شناسه صاحب حساب'),
		new Option('OwnerName', 'نام صاحب حساب'),
		new Option('OwnerFamilyName', 'نام خانوادگی صاحب حساب'),
		new Option('AccountType', 'نوع حساب'),
		new Option('AccountID', 'شماره حساب'),
		new Option('CardID', 'شماره کارت'),
		new Option('Sheba', 'شماره شبا'),
		new Option('BranchAddress', 'آدرس شعبه')
	];

	public selectedOption: Option = this.options[0];

	private validators = {
		BranchTelephone: new Validator(PATTERNS.numberPattern, 8),
		OwnerID: new Validator(PATTERNS.numberPattern, 10),
		AccountID: new Validator(PATTERNS.numberPattern, 10),
		CardID: new Validator(PATTERNS.numberPattern, 16),
		Sheba: new Validator(PATTERNS.shebaPattern, 23)
	};

	public constructor(public theme: ThemeService) {}

	public updateMaxLength(field: string) {
		this.maxLength = this.validators[field]
			? this.validators[field].length
			: 256;
	}

	public clickedOnSearchButton({ query }) {
		const field = this.selectedOption.en;
		const error = this.validateForm(field, query);

		if (!error) {
			this.searchCallback.emit({ field, query });
		} else {
			this.snackbar.show(error, 'danger');
			this.shakeCallback.emit();
		}
	}

	private validateForm(field: string, query: string): string {
		if (!query) return 'لطفاً ابتدا تمام موارد خواسته‌شده را ثبت کنید';

		const validator = this.validators[field];

		return validator && !this.validQuery(query, validator)
			? 'فرمت واردشده صحیح نمی‌باشد'
			: null;
	}

	private validQuery = (query: string, validator: Validator): boolean =>
		query.length === validator.length && validator.pattern.test(query);
}

class Validator {
	public constructor(public pattern: RegExp, public length: number) {}
}

class Option {
	public constructor(
		public en: string,
		public fa: string,
		public selected: boolean = false,
		public hovered: boolean = false
	) {}
}

const PATTERNS = {
	numberPattern: /^\d+$/,
	shebaPattern: /^IR(\d)+$/,
	nonNumericalPattern: /^\D+$/
};
