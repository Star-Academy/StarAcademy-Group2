import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'edge-tooltip',
	templateUrl: './edge-tooltip.component.html',
	styleUrls: [ './edge-tooltip.component.scss' ]
})
export class EdgeTooltipComponent implements OnInit {
	@Input() content: { Amount: string };
	@Input() position: { x: number; y: number };

	constructor() {}

	ngOnInit(): void {}
}
