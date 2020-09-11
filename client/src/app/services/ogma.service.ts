import { Injectable } from '@angular/core';
import Ogma, { RawNode, RawEdge } from '../../dependencies/ogma.min.js';

function createNode(id: number): RawNode {
	return {
		id,
		attributes: {
			color: id % 2 ? 'purple' : 'orange'
		}
	};
}

function createEdge(node: RawNode, ids: RawNode['id'][]): RawEdge {
	const randomIndex = Math.floor(Math.random() * ids.length);
	const otherNode = ids[randomIndex];
	return {
		id: `${otherNode}-${node.id}`,
		source: otherNode,
		target: node.id
	};
}

@Injectable({
	providedIn: 'root'
})
export class OgmaService {
	public ogma: Ogma;

	constructor() {}

	public initConfig(configuration = {}) {
		this.ogma = new Ogma(configuration);
	}

	public addNode(x?: number, y?: number): void {
		const idsInGraph = this.ogma.getNodes().getId();

		if (x && y)
			this.ogma.addNode({ id: idsInGraph.length, attribute: { x, y } });
		else this.ogma.addNode({ id: idsInGraph.length });
	}

	public runLayout(layout: string = 'force'): Promise<void> {
		return this.ogma.layouts[layout]({ locate: true });
	}

	public expandNode(nodeId) {
		//read json file from back
		let nodes = [
			{
				id: '5',
				isIncomming: true,
				attributes: { x: 0, y: 0, color: 'green' }
			},
			{
				id: '6',
				isIncomming: true,
				attributes: { x: 60, y: 20, color: 'magenta' }
			},
			{
				id: '7',
				isIncomming: false,
				attributes: { x: 30, y: -30, color: 'orange' }
			}
		];
		let edges = [];
		nodes.forEach((node) => {
			edges.push(this.CreateEdge(nodeId, node));
		});

		this.addNodes(nodes);
		this.addEdges(edges);
	}

	private addEdges(edges) {
		this.ogma.addEdges(edges);
	}

	private CreateEdge(nodeId, node) {
		let edge = { id: undefined, source: undefined, target: undefined };
		if (node.isIncomming === true) {
			edge.source = node.id;
			edge.target = nodeId;
		} else {
			edge.source = nodeId;
			edge.target = node.id;
		}
		edge.id = edge.source + '-' + edge.target + new Date().getMilliseconds;

		return edge;
	}

	private addNodes(nodes) {
		this.ogma.addNodes(nodes);
	}
}
