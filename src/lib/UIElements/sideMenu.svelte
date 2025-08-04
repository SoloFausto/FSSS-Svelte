<script lang="ts">
	import { PasswordNode } from '$lib/paswordNode';
	import PasswordNodeElement from './passwordNodeElement.svelte';
	import { useOnSelectionChange } from '@xyflow/svelte';
	import CharacterSetDropdown from './characterSetDropdown.svelte';

	let { masterPassword, reRender } = $props();

	let selectedNode: PasswordNode | null = $state.raw(null);

	let currentHash: string = $derived.by(() => {
		return selectedNode ? selectedNode.calculateHash(masterPassword) : '';
	});

	useOnSelectionChange(({ nodes, edges }) => {
		selectedNode = nodes.length > 0 ? nodes[0].data.passwordNode : null;
		showHash = false;
	});
	let showHash: boolean = $state(false);
	function createNodeChild(value: string) {
		if (selectedNode) {
			const newChild = new PasswordNode(value, selectedNode);
			selectedNode.addChild(newChild);
			creatingChild = false;
			childNodeName = '';
			reRender();
		}
	}
	function removeNode(node: PasswordNode) {
		if (node.parent) {
			node.parent.removeChild(node);
		}
		reRender();
	}
	function nodeHashRefresh() {
		if (!selectedNode) return;
		currentHash = selectedNode.calculateHash(masterPassword);
	}

	let childNodeName = $state('');
	let creatingChild = $state(false);

	let seedValue: number = $state(0);
	$effect(() => {
		if (selectedNode) {
			if (isNaN(seedValue) || seedValue === null || seedValue < 0) {
				seedValue = 0;
			} else {
				selectedNode.setSeed(seedValue);
			}
			nodeHashRefresh();
		}
	});
</script>

<!-- Sidebar overlay -->
<div class="" role="button" tabindex="0">
	<!-- Sidebar content -->
	<div class="flex h-full w-120 flex-col overflow-hidden border-l border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900" aria-modal="true">
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Node Information</h2>
		</div>

		<!-- Content -->
		<div class="flex-1 overflow-y-auto p-6">
			{#if selectedNode}
				<div class="mb-8">
					<h3 class="mb-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">Basic Information</h3>
					<div class="mb-3 flex items-center gap-2">
						<span class="min-w-[100px] font-medium text-gray-600 dark:text-gray-400">Value:</span>
						<span class="font-mono text-gray-900 dark:text-gray-100">{selectedNode.value}</span>
					</div>
					<div class="mb-3 flex items-center gap-2">
						<span class="min-w-[100px] font-medium text-gray-600 dark:text-gray-400">Label:</span>
						<form onsubmit={() => reRender()}>
							<input class="rounded border border-gray-300 bg-transparent px-2 py-1 font-mono text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:text-gray-100" type="text" bind:value={selectedNode.label} />
							<button type="submit" class="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600" aria-label="Update label">
								<img src="save.svg" alt="Save label" class="h-7 w-7 max-w-none" />
							</button>
						</form>
					</div>
					<div class="mb-3 flex items-center gap-2">
						<span class="min-w-[100px] font-medium text-gray-600 dark:text-gray-400">Color:</span>
						<input type="color" id="nodeColor" name="NodeColor" bind:value={selectedNode.color} />
						<span class="font-mono text-gray-900 dark:text-gray-100">{selectedNode.color}</span>
					</div>
					<div class="mb-3 flex items-center gap-2">
						<span class="min-w-[100px] font-medium text-gray-600 dark:text-gray-400">Character Set:</span>
						<span class="font-mono text-gray-900 dark:text-gray-100"><CharacterSetDropdown /></span>
					</div>
					<div class="mb-3 flex items-center gap-2">
						<span class="min-w-[100px] font-medium text-gray-600 dark:text-gray-400">Seed:</span>
						<input type="number" min="0" id="nodeSeed" name="NodeSeed" placeholder="0" bind:value={seedValue} oninput={() => nodeHashRefresh()} class="rounded border border-gray-300 bg-transparent px-2 py-1 font-mono text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:text-gray-100" />
					</div>
					<div class="mb-3 flex items-center gap-2">
						<span class="min-w-[100px] font-medium text-gray-600 dark:text-gray-400">Length:</span>
						<input type="number" min="1" id="nodeLength" name="NodeLength" bind:value={selectedNode.length} oninput={() => nodeHashRefresh()} class="rounded border border-gray-300 bg-transparent px-2 py-1 font-mono text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:text-gray-100" />
					</div>
				</div>

				<div class="mb-8">
					<h3 class="mb-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">Node Status</h3>
					<div class="mb-3 flex items-center gap-2">
						<span class="min-w-[100px] font-medium text-gray-600 dark:text-gray-400">Is Root:</span>
						<span class="font-mono font-semibold {selectedNode.checkIfRoot() ? 'text-green-600' : 'text-red-600'}">
							{selectedNode.checkIfRoot() ? 'Yes' : 'No'}
						</span>
					</div>
					<div class="mb-3 flex items-center gap-2">
						<span class="min-w-[100px] font-medium text-gray-600 dark:text-gray-400">Is Leaf:</span>
						<span class="font-mono font-semibold {selectedNode.checkIfLeaf() ? 'text-green-600' : 'text-red-600'}">
							{selectedNode.checkIfLeaf() ? 'Yes' : 'No'}
						</span>
					</div>
					<div class="mb-3 flex items-center gap-2">
						<span class="min-w-[100px] font-medium text-gray-600 dark:text-gray-400">Children Count:</span>
						<span class="font-mono text-gray-900 dark:text-gray-100">{selectedNode.children.length}</span>
					</div>
					{#if creatingChild}
						<div>
							<span class="min-w-[100px] font-medium text-gray-600 dark:text-gray-400"> Child Node Name: </span>
							<input type="text" name="childNodeName" bind:value={childNodeName} />
							<button onclick={() => createNodeChild(childNodeName)}>Create Child</button>
						</div>
					{:else}
						<button class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" onclick={() => (creatingChild = true)}> Create Child </button>
					{/if}
					<button class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none" onclick={() => removeNode(selectedNode!)}> Remove Node </button>
				</div>

				<div class="mb-8">
					<h3 class="mb-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-900 dark:border-gray-700 dark:text-gray-100">Password</h3>

					<div class="mb-3 flex items-start gap-2">
						<span class="min-w-[100px] font-medium text-gray-600 dark:text-gray-400"> Generated Hash: </span>
						<div class="mt-2 flex-1 rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800">
							<div class="flex items-center gap-2">
								<input class="flex-1 border-none bg-transparent font-mono text-sm break-all text-gray-900 outline-none dark:text-gray-100" type={showHash ? 'text' : 'password'} readonly value={currentHash} style="padding: 0; margin: 0;" />
								<button type="button" class="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600" onclick={() => (showHash = !showHash)} aria-label={showHash ? 'Hide hash' : 'Show hash'}>
									<img src="eye.svg" alt={showHash ? 'Hide hash' : 'Show hash'} class="h-7 w-7 max-w-none" />
								</button>
								<button
									type="button"
									class="rounded border border-gray-300 bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
									onclick={async () => {
										await navigator.clipboard.writeText(currentHash);
									}}
									aria-label="Copy hash"
								>
									<img src="copy.svg" alt="Copy hash" class="h-7 w-7 max-w-none" />
								</button>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<!-- No node selected -->
				<div class="py-8 text-center text-gray-500 dark:text-gray-400">
					<p class="mb-2">No node selected</p>
					<p class="text-sm opacity-80">Select a node to view its information</p>
				</div>
			{/if}
		</div>
	</div>
</div>
