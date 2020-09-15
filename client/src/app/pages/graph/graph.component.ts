import { OnInit, Component, Input, ViewChild, ElementRef } from '@angular/core';

import { NodeId, HoverEvent } from '../../../dependencies/ogma.min.js';

import { OgmaService } from '../../services/ogma.service';

import { SearchNodesModalComponent } from '../../components/search-nodes-modal/search-nodes-modal.component.js';
import { RadialNodeMenuComponent } from '../../components/radial-node-menu/radial-node-menu.component.js';

@Component({
	selector: 'app-graph',
	templateUrl: './graph.component.html',
	styleUrls: [ './graph.component.scss' ]
})
export class GraphComponent implements OnInit {
	@ViewChild('ogmaContainer', { static: true })
	private container;

	@ViewChild('searchNodesModal') searchNodesModal: SearchNodesModalComponent;
	@ViewChild('radialComponent') radialComponent: RadialNodeMenuComponent;
	@ViewChild('findPathMenu') findPathMenu: ElementRef;

	// TODO: Remove
	@Input() currentLayout: string = 'force';

	// TODO: Remove
	layouts: string[] = [ 'force', 'hierarchical' ];

	hoveredContent: { branchName: string; ownerId: string; ownerName: string };
	hoveredPosition: { x: number; y: number };

	devTools: boolean = true;
	isMenuOn = false;

	constructor(public ogmaService: OgmaService) {}

	ngOnInit() {
		this.ogmaService.initConfig({
			options: {
				backgroundColor: '#f2f2f2',
				directedEdges: true,
				minimumWidth: '800',
				minimumHeight: '600'
			}
		});

		this.ogmaService.ogma.events.onClick(({ target, button, domEvent }) => {
			this.isMenuOn = this.radialComponent.close();

			if (target && target.isNode) {
				this.hoveredContent = null;

				if (button === 'right')
					if (domEvent.shiftKey)
						this.ogmaService.toggleNodeLockStatus(target);
					else
						this.isMenuOn = this.radialComponent.expandMenu(target);
				else if (button === 'left' && domEvent.shiftKey)
					this.searchNodesModal.open(target.getData());
			}
		});

		this.ogmaService.ogma.events.onMouseButtonDown((e) => {
			if (this.isMenuOn) this.isMenuOn = this.radialComponent.close();
		});

		this.ogmaService.ogma.events.onDoubleClick(({ target }) => {
			if (target && target.isNode)
				this.ogmaService.toggleNodeLockStatus(target);
		});

		this.ogmaService.ogma.events.onZoomProgress(() => {
			if (this.isMenuOn) {
				this.isMenuOn = this.radialComponent.close();
			}
		});

		this.ogmaService.ogma.events.onHover(({ x, y, target }: HoverEvent) => {
			if (target.isNode) {
				target.setAttributes({ outerStroke: { color: 'green' } });

				this.hoveredPosition = {
					x,
					y: y + 20
				};

				this.hoveredContent = {
					branchName: target.getData('branchName'),
					ownerId: target.getData('ownerId'),
					ownerName:
						target.getData('ownerName') +
						' ' +
						target.getData('ownerFamilyName')
				};
			}
		});

		this.ogmaService.ogma.events.onUnhover(({ target }: HoverEvent) => {
			if (target.isNode) {
				target.setAttributes({ outerStroke: null });

				this.hoveredContent = null;
			}
		});
	}

	ngAfterContentInit() {
		this.ogmaService.ogma.setContainer(this.container.nativeElement);
		return this.runLayout();
	}

	// TODO: Remove
	addNode() {
		// this.ogmaService.addNode();
		// this.runLayout();
	}

	runLayout() {
		this.ogmaService.runLayout(this.currentLayout);
	}

	countNodes(): number {
		return this.ogmaService.ogma.getNodes().size;
	}

	clickedOnSearchNodesButton(e) {
		this.searchNodesModal.open();
	}

	clickedOnAddNodeButton(e) {
		if (e.attributes) this.ogmaService.addNode(e.node, e.attributes);
		else this.ogmaService.addNode(e.node);
	}

	clickedOnFindPathButton(e) {
		e.stopPropagation();

		// TODO: Request for path
	}

	toggleFindPathMenu(e: Event) {
		this.findPathMenu.nativeElement.classList.toggle('closed');
	}

	lockNodes(nodes) {
		this.ogmaService.lockNodes(nodes);
	}

	unlockNodes(nodes) {
		this.ogmaService.unlockNodes(nodes);
	}
}
