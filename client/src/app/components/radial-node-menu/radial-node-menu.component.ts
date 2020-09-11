import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'radial-node-menu',
	templateUrl: './radial-node-menu.component.html',
	styleUrls: [ './radial-node-menu.component.scss' ]
})
export class RadialNodeMenuComponent implements OnInit {
	public nodeId;

	constructor() {}

	ngOnInit(): void {}

	public expand(node, x, y) {
		this.nodeId = node.getId();
		let menu = document.getElementById('menu');
		menu.style.left = `${x}px`;
		menu.style.top = `${y}px`;

		menu.style.transform = 'scale(2)';
	}

	public close() {
		let menu = document.getElementById('menu');
		menu.style.transform = 'scale(0)';
	}
}
