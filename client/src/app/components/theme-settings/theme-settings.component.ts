import { Component, Input, OnInit } from '@angular/core';

import { ThemeService } from '../../services/theme.service';

import { SnackbarComponent } from '../snackbar/snackbar.component';

@Component({
	selector: 'theme-settings',
	templateUrl: './theme-settings.component.html',
	styleUrls: [ './theme-settings.component.scss' ]
})
export class ThemeSettingsComponent implements OnInit {
	@Input() snackbar: SnackbarComponent;

	public items: Item[] = [
		new Item('default', 'پیش‌فرض'),
		new Item('primary', 'اصلی'),
		new Item('secondary', 'ثانوی'),
		new Item('success', 'موفقیت'),
		new Item('danger', 'خطر'),
		new Item('warning', 'هشدار'),
		new Item('info', 'اطلاعات'),
		new Item('light', 'روشن'),
		new Item('dark', 'تیره'),
		new Item('disabled', 'غیر فعال')
	];

	public hoveredRowIndex: number = -1;

	public constructor(public theme: ThemeService) {}

	public ngOnInit() {}

	public rowStyle(index: number) {
		return this.hoveredRowIndex === index
			? this.theme.light.hovered
			: this.theme.light;
	}

	public changedColor(e, background: boolean, index) {
		const value = e.target.value;
		const name = this.items[index].name;

		this.theme[name][background ? 'background' : 'color'] = value;
	}

	public saveChanges() {
		for (const item of this.items) {
			localStorage.setItem(
				`theme_${item.name}`,
				JSON.stringify(this.theme[item.name])
			);
		}

		this.snackbar.show('تغییرات با موفقیت ذخیره شد', 'success');
	}

	public revertChanges(index: number) {
		this.theme.resetColor(this.items[index].name);
	}
}

class Item {
	public constructor(public name: string, public title: string) {}
}
