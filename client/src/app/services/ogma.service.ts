import { Injectable } from '@angular/core';

import Ogma, { NodeId } from '../../dependencies/ogma.min.js';

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

	attributes = {
		shape: 'square',
		color: 'transparent',
		outerStroke: 'transparent',
		innerStroke: 'transparent',
		image: {
			fit: true,
			url: '../../../assets/svg/washing_machine.svg'
		}
	};

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

	public addNode(data: AccountNode, attributes?): void {
		let id = data.accountId;

		this.graphService.addNode(data).subscribe((res: TransactionEdge[]) => {
			for (let edge of res) {
				if (
					this.ogma.getNode(edge.SourceAccount) &&
					this.ogma.getNode(edge.DestinationAccount)
				) {
					this.addEdge(
						edge.SourceAccount,
						edge.DestinationAccount,
						edge
					);
				}
			}
		});

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
		if (data) id = data.TransactionID;

		this.ogma.addEdge({ source, target, data, attributes, id });
	}

	public removeNode(nodeId) {
		this.ogma.removeNodes(nodeId);
	}

	lockNodes(nodes) {
		nodes.setAttributes({
			color: 'gray',
			draggable: false
		});
	}

	unlockNodes(nodes) {
		nodes.setAttributes({
			color: 'transparent',
			draggable: true
		});
	}

	toggleNodeLockStatus(node) {
		node.getAttribute('draggable')
			? this.lockNodes(node)
			: this.unlockNodes(node);
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

		this.setSourceAttributes(this.sourceNode);
	}

	setSourceAttributes(node) {
		node.setAttributes({
			image: {
				fit: true,
				url: '../../../assets/svg/money_source.svg'
			}
		});
	}

	setTarget(node) {
		if (this.targetNode) this.removeTarget();
		this.targetNode = node;

		this.setTargetAttributes(this.targetNode);
	}

	setTargetAttributes(node) {
		node.setAttributes({
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

	public expand(nodeIds: string[], filters?) {
		let request = { accounts: nodeIds };
		if (filters) {
			request['amountCeiling'] = String(filters.amountCeiling);
			request['amountFloor'] = String(filters.amountFloor);
			request['dateCeiling'] = String(filters.dateCeiling);
			request['dateFloor'] = String(filters.dateFloor);
			if (filters.tratransactionId) {
				request['transactionId'] = String(filters.transactionId);
			}
			if (filters.type) {
				request['type'] = String(filters.type);
			}
		}
		let jsonResponse = this.graphService.expandRequest(request);
		jsonResponse.subscribe((res) => {
			let jsonString = JSON.parse(JSON.stringify(res));
			jsonString.forEach((single) => {
				single.item1.forEach((node: AccountNode) => this.addNode(node));
			});
			jsonString.forEach((single) => {
				single.item2.forEach((edge: TransactionEdge) => {
					this.addEdge(
						edge.SourceAccount,
						edge.DestinationAccount,
						edge
					);
				});
			});
			this.runLayout();
		});
	}

	removePreviousGraph() {
		this.ogma.removeNodes(this.ogma.getNodes('raw'));
	}

	findPath(length) {
		this.removePreviousGraph();
		this.ogma.addNode({
			data: this.targetNode.getData(),
			attributes: this.attributes,
			id: this.targetNode.getId()
		});
		this.ogma.addNode({
			data: this.sourceNode.getData(),
			attributes: this.attributes,
			id: this.sourceNode.getId()
		});
		const sourceId = this.sourceNode.getId();
		const targetId = this.targetNode.getId();
		this.setSource(this.ogma.getNode(sourceId));
		this.setTarget(this.ogma.getNode(targetId));

		let jsonResponse = this.graphService.findMaxFlow(sourceId, targetId);
		jsonResponse.subscribe((res) => {
			this.ogma.addEdge({
				id: 'flow',
				source: sourceId,
				target: targetId,
				attributes: {
					color: 'pink',
					width: 3,
					opacity: 0.5
				},
				data: { Amount: res }
			});
		});

		this.ogma.addEdge({
			id: 'dummy',
			source: sourceId,
			target: targetId,
			attributes: {
				opacity: 0,
				detectable: false
			}
		});

		jsonResponse = this.graphService.findPath(
			this.sourceNode.getId(),
			this.targetNode.getId(),
			length
		);

		jsonResponse.subscribe((res) => {
			let jsonString = JSON.parse(JSON.stringify(res));
			jsonString.item1.forEach((node: AccountNode) => {
				this.addNode(node);
			});
			jsonString.item2.forEach((edge: TransactionEdge) => {
				this.addEdge(edge.SourceAccount, edge.DestinationAccount, edge);
			});

			this.ogma.layouts.hierarchical({
				direction: 'LR',
				duration: 300,
				nodeDistance: 30,
				levelDistance: 40
			});
		});
	}
}
