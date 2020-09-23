import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AccountNode } from '../models/AccountNode';

import options from './options';

@Injectable({
	providedIn: 'root'
})
export class GraphService {
	public constructor(private httpClient: HttpClient) {}

	public addNode(node: AccountNode) {
		return this.httpClient.post(
			'https://localhost:5001/mapState/addNode',
			`"${node.AccountID}"`,
			options
		);
	}

	public expand(payload) {
		console.log(payload);

		return this.httpClient.post(
			'https://localhost:5001/UserQuery/expand',
			payload,
			options
		);
	}

	public deleteNode(nodeId) {
		return this.httpClient.post(
			'https://localhost:5001/MapState/deleteNode',
			`"${nodeId}"`,
			options
		);
	}

	public restartTabs() {
		console.log('RESTART');

		return this.httpClient.post(
			'https://localhost:5001/MapState/restartMap',
			options
		);
	}

	public addTab() {
		return this.httpClient.post(
			'https://localhost:5001/MapState/createMap',
			options
		);
	}

	public changeTab(index) {
		return this.httpClient.post(
			'https://localhost:5001/MapState/switchMap',
			index,
			options
		);
	}

	public deleteTab(index) {
		return this.httpClient.post(
			'https://localhost:5001/MapState/deleteMap',
			index,
			options
		);
	}

	public findPath(sourceId, destinationId, maxLength) {
		maxLength = Math.max(1, Math.min(5, maxLength));
		console.log({
			sourceIds: sourceId,
			destinationIds: destinationId,
			maxLength: maxLength
		});

		return this.httpClient.post(
			'https://localhost:5001/UserQuery/FindAllPath',
			{
				sourceIds: sourceId,
				destinationIds: destinationId,
				maxLength: maxLength
			},
			options
		);
	}

	public findMaxFlow(sources, targets) {
		return this.httpClient.post(
			'https://localhost:5001/UserQuery/flow',
			{ item1: sources, item2: targets },
			options
		);
	}
}
