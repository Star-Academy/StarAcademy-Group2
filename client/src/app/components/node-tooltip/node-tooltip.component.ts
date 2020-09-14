import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'node-tooltip',
	templateUrl: './node-tooltip.component.html',
	styleUrls: [ './node-tooltip.component.scss' ]
})
export class NodeTooltipComponent implements OnInit {
	@Input()
	content: { branchName: string; ownerId: string; ownerName: string };
	@Input() position: { x: number; y: number };

	constructor() {}

	ngOnInit(): void {}
}
