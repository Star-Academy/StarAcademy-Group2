import {
	OnInit,
	AfterContentInit,
	Component,
	Input,
	ViewChild,
	ViewChildren
} from '@angular/core';

import { NodeId, HoverEvent } from '../../../dependencies/ogma.min.js';

import { OgmaService } from '../../services/ogma.service';

import { SearchNodesModalComponent } from 'src/app/components/search-nodes-modal/search-nodes-modal.component.js';
import { RadialNodeMenuComponent } from 'src/app/components/radial-node-menu/radial-node-menu.component.js';

@Component({
	selector: 'app-graph',
	templateUrl: './graph.component.html',
	styleUrls: [ './graph.component.scss' ]
})
export class GraphComponent implements OnInit {
	@ViewChild('ogmaContainer', { static: true })
	private container;

	@ViewChild('searchNodesModal') searchNodesModal: SearchNodesModalComponent;

	@Input() currentLayout: string = 'force';
	layouts: string[] = [ 'force', 'hierarchical' ];

	hoveredContent: { id: NodeId; type: string };
	hoveredPosition: { x: number; y: number };

	public radialComponent: RadialNodeMenuComponent = new RadialNodeMenuComponent();
	public height;
	public width;
	public zoom;

	constructor(private ogmaService: OgmaService) {}

	ngOnInit() {
		this.ogmaService.initConfig({
			options: {
				backgroundColor: 'gray',
				directedEdges: true,
				minimumWidth: '800',
				minimumHeight: '600'
			}
		});

		this.ogmaService.ogma.events.onHover(({ x, y, target }: HoverEvent) => {
			if (target.isNode) {
				this.hoveredContent = {
					id: target.getId(),
					type: target.getAttribute('color')
				};
				this.hoveredPosition = { x, y: y + 20 };
			}
		});

		this.ogmaService.ogma.events.onUnhover((_: HoverEvent) => {
			this.hoveredContent = null;
		});

		this.width = Number(this.ogmaService.ogma.view.get().width);
		this.height = Number(this.ogmaService.ogma.view.get().height);

		this.setOnClickListener(this.ogmaService.ogma);
	}

	ngAfterContentInit() {
		this.ogmaService.ogma.setContainer(this.container.nativeElement);
		return this.runLayout();
	}

	addNode(): Promise<void> {
		this.ogmaService.addNode();
		return this.runLayout();
	}

	runLayout(): Promise<void> {
		return this.ogmaService.runLayout(this.currentLayout);
	}

	countNodes(): number {
		return this.ogmaService.ogma.getNodes().size;
	}

	clickedOnSearchNodesButton(e) {
		console.log(this.searchNodesModal);

		this.searchNodesModal.open();
	}

	setPosition() {
		this.lockNodes(this.ogmaService.ogma.getSelectedNodes());
		this.unlockNodes(this.ogmaService.ogma.getNonSelectedNodes());
	}

	lockNodes(nodesList) {
		nodesList.setAttributes({
			draggable: false,
			image: { url: '../assets/lock.png' }
		});
	}

	unlockNodes(nodesList) {
		nodesList.setAttributes({
			draggable: true,
			image: { url: null }
		});
	}

	hoverNode() {
		const element = this.ogmaService.ogma.getHoveredElement();
		this.ogmaService.ogma.getNodes().setAttributes({
			color: 'gray',
			radius: 5
		});
		this.ogmaService.ogma.getEdges().setAttribute('color', 'gray');
		if (element && element.isNode) {
			element.setAttribute('radius', 7);
		}
	}

	public setOnClickListener(ogma) {
		ogma.events.onClick((e) => {
			let target = e.target;
			if (e.button === 'right' && target && target.isNode) {
				this.ogmaService.expandNode(target.getId());
				// this.radialComponent.close();
				// this.radialComponent.expand(target, this.findGlobalCoorinate(target.getAttribute('x'), this.width, ogma.view.getZoom()),
				// this.findGlobalCoorinate(target.getAttribute('y'), this.width, ogma.view.getZoom()));
			} else {
				this.radialComponent.close();
			}
		});
	}

	private findGlobalCoordinate(x, length, zoom) {
		return (Number(x) - length / 2) / +zoom;
	}

	public addEdge(ogma) {
		var e = {
			id: 'e0',
			source: 'n0',
			target: 'n1',
			attributes: {
				shape: 'arrow'
			}
		};

		ogma.addEdge(e);
	}
}
