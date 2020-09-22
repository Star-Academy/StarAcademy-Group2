import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
	selector: 'theme-settings',
	templateUrl: './theme-settings.component.html',
	styleUrls: [ './theme-settings.component.scss' ]
})
export class ThemeSettingsComponent implements OnInit {
	public items: Item[] = [
		new Item('default', 'پیش‌فرض'),
		new Item('primary', 'اصلی'),
		new Item('secondary', 'ثانوی'),
		new Item('success', 'کامل'),
		new Item('danger', 'خطر'),
		new Item('warning', 'هشدار'),
		new Item('info', 'اطلاعات'),
		new Item('light', 'روشن'),
		new Item('dark', 'تیره'),
		new Item('label', 'برچسب'),
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
}

class Item {
	public constructor(public name: string, public title: string) {}
}
