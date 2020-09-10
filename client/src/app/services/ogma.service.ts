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

	public addNewNode() {
		const idsInGraph = this.ogma.getNodes().getId();
		const newNode = createNode(idsInGraph.length);

		this.ogma.addGraph({
			nodes: [ newNode ],
			edges: [ createEdge(newNode, idsInGraph) ]
		});
	}

	public runLayout(layout: string = 'force'): Promise<void> {
		return this.ogma.layouts[layout]({ locate: true });
	}
}
