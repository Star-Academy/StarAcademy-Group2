import { EventEmitter, Output, Component, OnInit } from '@angular/core';

import { ThemeService } from '../../services/theme.service';

@Component({
	selector: 'graph-tab-group',
	templateUrl: './tab-group.component.html',
	styleUrls: [ './tab-group.component.scss' ]
})
export class TabGroupComponent implements OnInit {
	@Output() onTabChange = new EventEmitter();
	@Output() onTabAdd = new EventEmitter();
	@Output() onTabDelete = new EventEmitter();

	public tabs = [ 'پیش‌فرض' ];
	public activeTab = 0;

	public addHovered: boolean = false;
	public settingsHovered: boolean = false;
	public isSettingsActive: boolean = false;
	public closeHovered: boolean = false;

	constructor(public theme: ThemeService) {}

	ngOnInit(): void {
		// TODO: remove
		this.clickedOnAddTab();
		this.clickedOnAddTab();
		this.clickedOnAddTab();
		this.tabChange({ index: 1 });
	}

	public addStyle() {
		return this.addHovered
			? this.theme.primary.hovered
			: this.theme.primary.selected;
	}

	public settingsStyle() {
		return this.isSettingsActive
			? this.theme.primary.selected
			: this.settingsHovered
				? this.theme.primary.hovered
				: this.theme.primary;
	}

	public closeStyle() {
		return this.closeHovered
			? this.theme.danger.hovered
			: this.theme.primary;
	}

	tabChange(event) {
		this.activeTab = event.index;
		this.onTabChange.emit({ index: event.index });
	}

	deleteTab(event) {
		if (this.tabs.length > 1) {
			this.tabs.splice(event.index, 1);
			if (this.activeTab === event.index) {
				this.activeTab = event.index - 1;
			} else if (this.activeTab > event.index) {
				this.activeTab -= 1;
			}
			if (this.activeTab < 0) {
				this.activeTab = 0;
			}
			this.onTabDelete.emit({ index: event.index });
		}
	}

	clickedOnAddTab() {
		if (this.tabs.length < 10) {
			this.tabs.push('گراف جدید');
			this.activeTab = this.tabs.length - 1;
			this.onTabAdd.emit({ index: this.activeTab });
		}
	}

	onChangeName(event) {
		this.tabs[event.index] = event.newName;
	}
}
