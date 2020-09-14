import { Component, Input } from '@angular/core';

@Component({
	selector: 'tooltip',
	templateUrl: './tooltip.component.html',
	styleUrls: [ './tooltip.component.scss' ]
})
export class TooltipComponent {
	@Input() content: { id: string; type: string };
	@Input() position: { x: number; y: number };
}
