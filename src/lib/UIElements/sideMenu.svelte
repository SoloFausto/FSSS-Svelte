<script lang="ts">
	import { PasswordNode } from '$lib/paswordNode';
	import PasswordNodeElement from './passwordNodeElement.svelte';
	import { useOnSelectionChange } from '@xyflow/svelte';
	import CharacterSetDropdown from './characterSetDropdown.svelte';
	import { characterSetChoices } from '$lib/passwordHasher';
	import { type CharacterSetOption } from '$lib/passwordHasher';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	let { masterPassword, reRender } = $props();

	let selectedNode: PasswordNode | null = $state.raw(null);

	let currentHash: string = $derived.by(() => {
		if (selectedNode) {
			return selectedNode.calculateHash(masterPassword);
		} else {
			return '';
		}
	});

	useOnSelectionChange(({ nodes, edges }) => {
		selectedNode = nodes.length > 0 ? nodes[0].data.passwordNode : null;
		seedValue = selectedNode ? selectedNode.seed : 0;
		lengthValue = selectedNode ? selectedNode.length : 32;
		// selectedCharacterSet = selectedNode ? selectedNode.characterSet : characterSetChoices[0];
		showHash = false;
	});
	let showHash: boolean = $state(false);
	function createNodeChild(value: string) {
		if (selectedNode && value.trim() !== '') {
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
		}
	});
	let lengthValue: number = $state(0);
	$effect(() => {
		if (selectedNode) {
			if (isNaN(lengthValue)) {
				lengthValue = 1;
			} else {
				selectedNode.setLength(lengthValue);
			}
		}
	});
	// let selectedCharacterSet: CharacterSetOption = $state();
	// $effect(() => {
	// 	if (selectedNode) {
	// 		selectedNode.characterSet = selectedCharacterSet;
	// 	}
	// });
</script>

<!-- Sidebar overlay -->
<div class="" role="button" tabindex="0">
	<!-- Sidebar content -->
	<div class="bg-popover flex h-full w-120 flex-col overflow-hidden border-l shadow-xl" aria-modal="true">
		<!-- Header -->
		<div class="bg-popover flex items-center justify-between border-b px-6 py-4">
			<h2 class="text-popover-foreground text-xl font-semibold">Node Information</h2>
		</div>

		<!-- Content -->
		<div class="flex-1 overflow-y-auto p-6">
			{#if selectedNode}
				<div class="mb-8">
					<h3 class="text-popover-foreground mb-4 border-b pb-2 text-base font-semibold">Basic Information</h3>
					<div class="mb-3 flex items-center gap-3">
						<span class="text-muted-foreground w-[100px] font-medium">Label:</span>
						<form onsubmit={() => reRender()} class="flex flex-1 items-center gap-2">
							<input class="bg-background text-foreground focus-visible:ring-ring flex-1 rounded-md border px-3 py-1.5 font-mono text-sm focus:outline-none focus-visible:ring-2" type="text" bind:value={selectedNode.label} />
							<Button type="submit" variant="outline" size="sm" aria-label="Update label">
								<img src="save.svg" alt="Save label" class="h-4 w-4" />
							</Button>
						</form>
					</div>

					<div class="mb-3 flex items-center gap-3">
						<span class="text-muted-foreground w-[100px] font-medium">Color:</span>
						<div class="flex flex-1 items-center gap-2">
							<input type="color" id="nodeColor" name="NodeColor" bind:value={selectedNode.color} class="bg-background h-9 w-16 rounded border" />
							<span class="text-foreground font-mono text-sm">{selectedNode.color}</span>
						</div>
					</div>
					<div class="mb-3 flex items-center gap-3">
						<span class="text-muted-foreground w-[100px] font-medium">Character Set:</span>
						<div class="flex-1">
							<CharacterSetDropdown bind:selection={selectedNode.characterSet} {nodeHashRefresh} />
						</div>
					</div>
					<div class="mb-3 flex items-center gap-3">
						<span class="text-muted-foreground w-[100px] font-medium">Seed:</span>
						<input type="number" min="0" id="nodeSeed" name="NodeSeed" placeholder="0" bind:value={seedValue} oninput={() => nodeHashRefresh()} class="bg-background text-foreground focus-visible:ring-ring flex-1 rounded-md border px-3 py-1.5 font-mono text-sm focus:outline-none focus-visible:ring-2" />
					</div>
					<div class="mb-3 flex items-center gap-3">
						<span class="text-muted-foreground w-[100px] font-medium">Length:</span>
						<input type="number" min="1" max="100" id="nodeLength" name="NodeLength" placeholder="32" bind:value={lengthValue} oninput={() => nodeHashRefresh()} class="bg-background text-foreground focus-visible:ring-ring flex-1 rounded-md border px-3 py-1.5 font-mono text-sm focus:outline-none focus-visible:ring-2" />
					</div>
				</div>

				<div class="mb-8">
					<h3 class="text-popover-foreground mb-4 border-b pb-2 text-base font-semibold">Node Status</h3>
					<div class="mb-3 flex items-center gap-3">
						<span class="text-muted-foreground w-[100px] font-medium">Is Root:</span>
						<span class="font-mono text-sm font-semibold {selectedNode.checkIfRoot() ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}">
							{selectedNode.checkIfRoot() ? 'Yes' : 'No'}
						</span>
					</div>
					<div class="mb-3 flex items-center gap-3">
						<span class="text-muted-foreground w-[100px] font-medium">Is Leaf:</span>
						<span class="font-mono text-sm font-semibold {selectedNode.checkIfLeaf() ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}">
							{selectedNode.checkIfLeaf() ? 'Yes' : 'No'}
						</span>
					</div>
					<div class="mb-3 flex items-center gap-3">
						<span class="text-muted-foreground w-[100px] font-medium">Children Count:</span>
						<span class="text-foreground font-mono text-sm">{selectedNode.children.length}</span>
					</div>
					{#if creatingChild}
						<div class="mb-4 space-y-2">
							<div class="flex items-center gap-3">
								<span class="text-muted-foreground w-[100px] text-sm font-medium">Child Name:</span>
								<div class="flex flex-1 gap-2">
									<input type="text" name="childNodeName" bind:value={childNodeName} class="bg-background text-foreground focus-visible:ring-ring flex-1 rounded-md border px-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2" placeholder="Enter node name..." />
									<Button onclick={() => createNodeChild(childNodeName)} size="sm">Create</Button>
									<Button onclick={() => (creatingChild = false)} variant="outline" size="sm">Cancel</Button>
								</div>
							</div>
						</div>
					{:else}
						<div class="mb-4 flex items-center gap-3">
							<span class="text-muted-foreground w-[100px] font-medium"></span>
							<Button onclick={() => (creatingChild = true)} class="flex-1">Create Child</Button>
						</div>
					{/if}
					<div class="flex items-center gap-3">
						<span class="text-muted-foreground w-[100px] font-medium"></span>
						<Button onclick={() => removeNode(selectedNode!)} variant="destructive" class="flex-1">Remove Node</Button>
					</div>
				</div>

				<div class="mb-8">
					<h3 class="text-popover-foreground mb-4 border-b pb-2 text-base font-semibold">Password</h3>

					<div class="mb-3 flex flex-col gap-2">
						<div class="flex items-center gap-3">
							<span class="text-muted-foreground w-[100px] font-medium">Value:</span>
							<span class="text-foreground font-mono text-sm">{selectedNode.value}</span>
						</div>
						<div class="flex items-start gap-3">
							<span class="text-muted-foreground w-[100px] text-sm font-medium">Generated Hash:</span>
							<div class="bg-muted/50 flex-1 rounded-md border p-3">
								<div class="flex items-center gap-2">
									<input class="text-foreground flex-1 border-none bg-transparent font-mono text-sm break-all outline-none" type={showHash ? 'text' : 'password'} readonly value={currentHash} style="padding: 0; margin: 0;" />
									<Button type="button" variant="outline" size="sm" onclick={() => (showHash = !showHash)} aria-label={showHash ? 'Hide hash' : 'Show hash'}>
										<img src="eye.svg" alt={showHash ? 'Hide hash' : 'Show hash'} class="h-4 w-4" />
									</Button>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onclick={async () => {
											await navigator.clipboard.writeText(currentHash);
										}}
										aria-label="Copy hash"
									>
										<img src="copy.svg" alt="Copy hash" class="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<!-- No node selected -->
				<div class="text-muted-foreground py-8 text-center">
					<p class="mb-2">No node selected</p>
					<p class="text-sm opacity-80">Select a node to view its information</p>
				</div>
			{/if}
		</div>
	</div>
</div>
