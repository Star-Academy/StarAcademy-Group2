import {
	OnInit,
	AfterContentInit,
	Component,
	Input,
	ViewChild
} from '@angular/core';

import { NodeId, HoverEvent } from '../../../dependencies/ogma.min.js';

import { OgmaService } from '../../services/ogma.service';

import initialGraph from '../../../assets/graph/dummy-graph-data.js';

@Component({
	selector: 'app-graph',
	templateUrl: './graph.component.html',
	styleUrls: [ './graph.component.scss' ]
})
export class GraphComponent implements OnInit {
	@ViewChild('ogmaContainer', { static: true })
	private container;

	@Input() currentLayout: string = 'force';
	layouts: string[] = [ 'force', 'hierarchical' ];

	hoveredContent: { id: NodeId; type: string };
	hoveredPosition: { x: number; y: number };

	constructor(private ogmaService: OgmaService) {}

	ngOnInit() {
		this.ogmaService.initConfig({
			graph: initialGraph,
			options: {
				backgroundColor: 'rgb(240, 240, 240)'
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
	}

	ngAfterContentInit() {
		this.ogmaService.ogma.setContainer(this.container.nativeElement);
		return this.runLayout();
	}

	public addNode(): Promise<void> {
		this.ogmaService.addNewNode();
		return this.runLayout();
	}

	public runLayout(): Promise<void> {
		return this.ogmaService.runLayout(this.currentLayout);
	}

	public countNodes(): number {
		return this.ogmaService.ogma.getNodes().size;
	}
}
