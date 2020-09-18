import { Component, Input } from '@angular/core';

@Component({
	selector: 'graph-tooltip',
	templateUrl: './graph-tooltip.component.html',
	styleUrls: [ './graph-tooltip.component.scss' ]
})
export class GraphTooltipComponent {
	@Input() content;
	@Input() position: { x: number; y: number };
}
