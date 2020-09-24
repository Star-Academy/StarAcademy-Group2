import { Component, Input } from '@angular/core';

import { ThemeService } from '../../services/theme.service';

@Component({
	selector: 'graph-tooltip',
	templateUrl: './graph-tooltip.component.html',
	styleUrls: [ './graph-tooltip.component.scss' ]
})
export class GraphTooltipComponent {
	@Input() content: object;
	@Input() position: { x: number; y: number };

	public constructor(public theme: ThemeService) {}
}
