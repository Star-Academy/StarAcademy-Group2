import { Injectable } from '@angular/core';
import Ogma, { RawNode, RawEdge } from '../../dependencies/ogma.min.js';
import { GraphService } from './graph.service';

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
	private sourceNode = null;
	private targetNode = null;

	constructor(private graphService: GraphService) {}

	public initConfig(configuration = {}) {
		this.ogma = new Ogma(configuration);
	}

	public addNode(x?: number, y?: number): void {
		const idsInGraph = this.ogma.getNodes().getId();

		if (x && y)
			this.ogma.addNode({ id: idsInGraph.length, attribute: { x, y } });
		else this.ogma.addNode({ id: idsInGraph.length });
	}

	public deleteNode(nodeId) {
		this.ogma.removeNode(nodeId);
	}

	public runLayout(layout: string = 'force'): Promise<void> {
		return this.ogma.layouts[layout]({ locate: true });
	}

	public expandNode(nodeId) {
		let jsonResponse = this.graphService.expandRequest('[nodeId]');
		let nodes = [];
		let edges = [];
		jsonResponse.forEach((single) => {
			single.item1.forEach((node) => nodes.push(this.modifyNode(node)));
			single.item2.forEach((edge) => edges.push(this.modifyEdge(edge)));
		});

		this.ogma.addNodes(nodes);
		this.ogma.addEdges(edges);
		this.runLayout();
	}

	private modifyNode(node) {
		node['id'] = node.AccountID;
		return node;
	}

	private modifyEdge(edge) {
		edge['id'] = edge.TransactionID;
		edge['source'] = edge.SourceAcount;
		edge['target'] = edge.DestiantionAccount;
		return edge;
	}

	lockNodes(nodesList) {
		nodesList.setAttributes({
			draggable: false,
			image: { url: '../../assets/svg/clean_clothes.svg' }
		});
	}

	unlockNodes(nodesList) {
		nodesList.setAttributes({
			draggable: true,
			image: { url: null }
		});
	}

	setSource(node) {
		this.sourceNode = node;
	}

	setTarget(node) {
		this.targetNode = node;
	}

	removeSource() {
		this.sourceNode = null;
	}

	removeTarget() {
		this.targetNode = null;
	}
}
