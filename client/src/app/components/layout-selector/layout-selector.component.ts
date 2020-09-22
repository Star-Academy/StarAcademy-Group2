import { Component, OnInit } from '@angular/core';

import { ThemeService } from '../../services/theme.service';
import { OgmaService } from '../../services/ogma.service';

@Component({
	selector: 'layout-selector',
	templateUrl: './layout-selector.component.html',
	styleUrls: [ './layout-selector.component.scss' ]
})
export class LayoutSelectorComponent implements OnInit {
	public hovered: boolean;
	public open: boolean;
	public transitioning: boolean;

	public layouts;
	public currentLayout;
	public directions;
	public currentDirection;

	public constructor(
		public theme: ThemeService,
		public ogmaService: OgmaService
	) {
		this.hovered = false;
		this.open = false;
	}

	public ngOnInit() {
		this.layouts = [ ...this.ogmaService.layouts ];
		this.currentLayout = { ...this.ogmaService.currentLayout };
		this.directions = [ ...this.ogmaService.directions ];
		this.currentDirection = { ...this.ogmaService.currentDirection };
	}

	public get menuBackground(): string {
		return this.hovered || this.open || this.transitioning
			? this.theme.light.background
			: this.theme.default.background;
	}

	public get menuClassName(): string {
		return this.open ? 'open' : '';
	}

	public toggleStatus() {
		this.open = !this.open;

		this.transitioning = true;
		setTimeout(() => {
			this.transitioning = false;
		}, 1500);
	}

	public updateLayout() {
		this.ogmaService.currentLayout = this.currentLayout;
		this.ogmaService.currentDirection = this.currentDirection;

		this.ogmaService.runLayout();
	}
}
