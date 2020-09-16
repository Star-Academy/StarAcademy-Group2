import { OnInit, Component, Input, ViewChild, ElementRef } from '@angular/core';

import { HoverEvent } from '../../../dependencies/ogma.min.js';

import { OgmaService } from '../../services/ogma.service';
import { SearchNodesService } from '../../services/search-nodes.service.js';

import { SearchNodesModalComponent } from '../../components/search-nodes-modal/search-nodes-modal.component.js';
import { RadialNodeMenuComponent } from '../../components/radial-node-menu/radial-node-menu.component.js';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component.js';

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

	@ViewChild('snackbar') snackbar: SnackbarComponent;

	// TODO: Remove
	@Input() currentLayout: string = 'force';

	// TODO: Remove
	layouts: string[] = [ 'force', 'hierarchical' ];

	nodeHoveredContent: {
		branchName: string;
		ownerId: string;
		ownerName: string;
	};
	edgeHoveredContent: { Amount: string };
	hoveredPosition: { x: number; y: number };

	devTools: boolean = true;
	isMenuOn = false;

	constructor(
		public ogmaService: OgmaService,
		private searchService: SearchNodesService
	) {}

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
				this.nodeHoveredContent = null;
				this.edgeHoveredContent = null;

				if (button === 'right')
					if (domEvent.shiftKey)
						this.ogmaService.toggleNodeLockStatus(target);
					else
						this.isMenuOn = this.radialComponent.expandMenu(
							this.ogmaService.ogma
								.getSelectedNodes()
								.concat(target)
								.dedupe(),
							target.getAttributes([ 'x', 'y' ])
						);
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
			// target.setAttributes({ outerStroke: { color: 'green' } });
			this.hoveredPosition = {
				x,
				y: y + 20
			};

			if (target.isNode) {
				this.nodeHoveredContent = {
					branchName: target.getData('branchName'),
					ownerId: target.getData('ownerId'),
					ownerName:
						target.getData('ownerName') +
						' ' +
						target.getData('ownerFamilyName')
				};
			} else if (!target.isNode) {
				this.edgeHoveredContent = {
					Amount: target.getData('Amount')
				};
			}
		});

		this.ogmaService.ogma.events.onUnhover(({ target }: HoverEvent) => {
			if (target.isNode) {
				target.setAttributes({ outerStroke: null });

				this.nodeHoveredContent = null;
				this.edgeHoveredContent = null;
			}
		});
	}

	ngAfterContentInit() {
		this.ogmaService.ogma.setContainer(this.container.nativeElement);
		this.runLayout();
	}

	// TODO: Remove
	async addNode() {
		let results = await this.searchService.search('OwnerName', 'ارژنگ');
		this.clickedOnAddNodeButton({ node: results[0] });

		results = await this.searchService.search('OwnerName', 'دریا');
		this.clickedOnAddNodeButton({ node: results[0] });

		results = await this.searchService.search('OwnerName', 'افسر');
		this.clickedOnAddNodeButton({ node: results[0] });

		this.runLayout();
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

	stopPropagation(e: Event) {
		e.stopPropagation();
	}
}
