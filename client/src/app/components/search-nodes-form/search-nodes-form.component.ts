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

	public items: Item[] = [ new Item() ];

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

	public selectedOptions: boolean[] = [
		true,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false,
		false
	];

	private validators = {
		BranchTelephone: new Validator(PATTERNS.numberPattern, 8),
		OwnerID: new Validator(PATTERNS.numberPattern, 10),
		AccountID: new Validator(PATTERNS.numberPattern, 10),
		CardID: new Validator(PATTERNS.numberPattern, 16),
		Sheba: new Validator(PATTERNS.shebaPattern, 23)
	};

	public constructor(public theme: ThemeService) {}

	public updateSelectedField(itemIndex, optionIndex, field: string) {
		const item = this.items[itemIndex];

		item.maxLength = this.validators[field]
			? this.validators[field].length
			: 256;

		// if (optionIndex > item.selectedOptionIndex) optionIndex++;

		const options = this.getOptions(itemIndex);
		const option = options[optionIndex];

		this.selectedOptions[item.selectedOptionIndex] = false;
		for (let i = 0; i < 10; i++) {
			if (this.options[i].en === option.en) {
				this.selectedOptions[i] = true;
				item.selectedOptionIndex = i;
				break;
			}
		}
	}

	public clickedOnSearchButton() {
		let filters = [];
		for (let item of this.items) {
			const query = item.query;
			const field = item.options[item.selectedOptionIndex].en;
			const error = this.validateForm(field, query);

			if (!error) {
				filters.push({ field, query });
			} else {
				this.snackbar.show(error, 'danger');
				this.shakeCallback.emit();
				return;
			}
		}
		this.searchCallback.emit({ filters });
	}

	public addNewField() {
		for (let i = 0; i < 10; i++) {
			if (!this.selectedOptions[i]) {
				this.items.push(new Item(i));
				this.selectedOptions[i] = true;
				return;
			}
		}
	}

	public getOptions(index: number) {
		const item = this.items[index];
		let a = item.selectedOptionIndex;

		let result = [];
		for (let i = 0; i < 10; i++) {
			if (!this.selectedOptions[i] || i == item.selectedOptionIndex)
				result.push(item.options[i]);
			else if (i < a) a--;
		}

		item.a = a;
		return result;
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

class Item {
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

	public constructor(
		public selectedOptionIndex: number = 0,
		public fieldSelectOpen: boolean = false,
		public query: string = '',
		public maxLength: number = 256,
		public a: number = -1
	) {}
}
