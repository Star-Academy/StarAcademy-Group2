import { Injectable } from '@angular/core';

import Ogma, { NodeId, RawNode, RawEdge } from '../../dependencies/ogma.min.js';

import { GraphService } from './graph.service';

import { AccountNode } from '../models/AccountNode.js';
import { TransactionEdge } from '../models/TransactionEdge.js';

@Injectable({
	providedIn: 'root'
})
export class OgmaService {
	ogma: Ogma;
	sourceNode = null;
	targetNode = null;

	constructor(private graphService: GraphService) {}

	public initConfig(configuration = {}) {
		this.ogma = new Ogma(configuration);
		this.ogma.setOptions({ zoom: { enabled: false } });

		this.ogma.styles.setSelectedNodeAttributes({
			color: false,
			outline: false,
			outerStroke: {
				color: 'blue'
			}
		});

		this.ogma.styles.setHoveredNodeAttributes({
			color: false,
			outline: false,
			outerStroke: {
				color: 'green'
			}
		});

		this.addRule();
	}

	public runLayout(layout: string = 'force'): Promise<void> {
		return this.ogma.layouts[layout]({ locate: true });
	}

	public addRule() {
		this.ogma.styles.addRule({
			nodeAttributes: {
				text: (node) => {
					return node.getId();
				}
			},
			edgeAttributes: {
				text: (node) => {
					return node.getData('Amount');
				},
				shape: { head: 'arrow' }
			}
		});
	}

	public addNode(data?: AccountNode, attributes?): void {
		let id = this.ogma.getNodes().getId().length;
		if (data) id = data.accountId;

		attributes = {
			shape: 'square',
			color: 'transparent',
			outerStroke: 'transparent',
			innerStroke: 'transparent',
			image: {
				fit: true,
				url: '../../../assets/svg/washing_machine.svg'
			},
			...attributes
		};

		this.ogma.addNode({ data, attributes, id });
	}

	public addEdge(
		source: NodeId,
		target: NodeId,
		data?: TransactionEdge,
		attributes?
	) {
		let id = this.ogma.getEdges().getId().length;
		if (data) id = data.transactionId;

		this.ogma.addEdge({ source, target, data, attributes, id });
	}

	public removeNode(nodeId) {
		this.ogma.removeNode(nodeId);

		this.runLayout();
	}

	public expandNode(nodeId) {
		// let jsonResponse;
		// this.graphService.expandRequest('[nodeId]', jsonResponse);
		// let jsonResponse = this.graphService.expandRequest('[nodeId]');
		// let nodes = [];
		// let edges = [];
		// jsonResponse.forEach((single) => {
		// 	single.item1.forEach((node:AccountNode ) => this.addNode (node ) );
		// 	single.item2.forEach((edge) => edges.push(this.modifyEdge(edge)));
		// });
		// this.ogma.addNodes(nodes);
		// this.ogma.addEdges(edges);
		// this.runLayout();
	}

	lockNodes(nodes) {
		nodes.setAttributes({
			draggable: false
		});
	}

	unlockNodes(nodes) {
		nodes.setAttributes({
			draggable: true
		});
	}

	toggleNodeLockStatus(node) {
		node.getAttribute('draggable')
			? node.setAttribute('draggable', false)
			: node.setAttribute('draggable', true);
	}

	getSourceNode() {
		return this.sourceNode;
	}

	getTargetNode() {
		return this.targetNode;
	}

	setSource(node) {
		if (this.sourceNode) this.removeSource();
		this.sourceNode = node;

		this.sourceNode.setAttributes({
			image: {
				fit: true,
				url: '../../../assets/svg/money_source.svg'
			}
		});
	}

	setTarget(node) {
		if (this.targetNode) this.removeTarget();
		this.targetNode = node;

		this.targetNode.setAttributes({
			image: {
				fit: true,
				url: '../../../assets/svg/clean_clothes.svg'
			}
		});
	}

	removeSource() {
		this.sourceNode.setAttributes({
			image: {
				fit: true,
				url: '../../../assets/svg/washing_machine.svg'
			}
		});

		this.sourceNode = null;
	}

	removeTarget() {
		this.targetNode.setAttributes({
			image: {
				fit: true,
				url: '../../../assets/svg/washing_machine.svg'
			}
		});

		this.targetNode = null;
	}
}
