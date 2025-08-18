<script lang="ts">
	import { PasswordNode } from '$lib/paswordNode';
	import { useOnSelectionChange, useSvelteFlow } from '@xyflow/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { Colord, colord, extend } from 'colord';
	import type { CharacterSetOption } from '$lib/passwordHasher';

	let { masterPassword, reRender, isInPortrait } = $props();
	let selectedNode: PasswordNode | null = $state(null);
	let showHash: boolean = $state(false);
	let childNodeName = $state('');
	let creatingChild = $state(false);
	let currentHash: string = $derived.by(() => {
		if (selectedNode) {
			return selectedNode.calculateHash(masterPassword);
		} else {
			return '';
		}
	});

	useOnSelectionChange(({ nodes, edges }) => {
		selectedNode = nodes.length > 0 ? ((nodes[0] as any).data.passwordNode as PasswordNode) : null;
		seedValue = selectedNode ? selectedNode.seed : 0;
		lengthValue = selectedNode ? selectedNode.length : 32;
		// selectedCharacterSet = selectedNode ? selectedNode.characterSet : characterSetChoices[0];
		selectedColor = selectedNode ? selectedNode.color.toHex() : colord('#ffffff').toHex();
		showHash = false;
		savedLabel = selectedNode ? selectedNode.label : '';
	});

	////////////////////////////
	// Node Child Creation
	/////////////////////////////
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

	function toggleChar<K extends keyof CharacterSetOption>(key: K) {
		if (!selectedNode) return;
		selectedNode.characterSet = { ...selectedNode.characterSet, [key]: !selectedNode.characterSet[key] };
		nodeHashRefresh();
		let pastSelectedNode = selectedNode;
		selectedNode = null;
		selectedNode = pastSelectedNode;
		// reRender();
	}

	///////////////////////////
	// Node Property setters
	/////////////////////////
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
	let selectedColor: string = $state('#ffffff');
	$effect(() => {
		if (selectedNode && selectedColor) {
			selectedNode.setColor(colord(selectedColor));
		}
	});
	let savedLabel: string = $state('');
	$effect(() => {
		if (selectedNode) {
			selectedNode.setLabel(savedLabel);
			savedLabel = selectedNode.label;
		}
	});
</script>

<!-- Sidebar overlay -->
<div class="" role="button" tabindex="0">
	<!-- Sidebar content -->
	<div class="bg-popover flex {isInPortrait ? 'max-h-[35svh]' : 'max-h-[100svh]'} w-[clamp(16rem,90vw,26rem)] max-w-full flex-col overflow-y-auto border-l shadow-xl md:overflow-hidden" aria-modal="true">
		<!-- Header -->
		<div class="bg-popover sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3">
			<h2 class="text-popover-foreground text-lg font-semibold">Node Information</h2>
		</div>

		<!-- Content -->
		<div class="flex-1 overflow-visible p-4 md:overflow-y-auto">
			{#if selectedNode}
				<div class="mb-6">
					<h3 class="text-popover-foreground mb-3 border-b pb-1.5 text-sm font-semibold">Basic Information</h3>
					<div class="mb-2 flex items-center gap-2">
						<span class="text-muted-foreground text-s w-[80px] font-medium">Label:</span>
						<form onsubmit={() => reRender()} class="flex flex-1 items-center gap-1.5">
							<input class="bg-background text-foreground focus-visible:ring-ring text-s flex-1 rounded border px-2 py-1 font-mono focus:outline-none focus-visible:ring-1" type="text" bind:value={savedLabel} />
							<Button type="submit" variant="outline" size="sm" aria-label="Update label" class="h-7 w-7 p-0">
								<img src="save.svg" alt="Save label" class="h-3 w-3" />
							</Button>
						</form>
					</div>

					<div class="mb-2 flex items-center gap-2">
						<span class="text-muted-foreground text-s w-[80px] font-medium"></span>
						<div class="flex flex-1 items-center gap-1.5">
							<form onsubmit={() => reRender()} class="flex flex-1 items-center gap-1.5">
								<ColorPicker bind:hex={selectedColor} position="fixed" />
								<Button type="submit" variant="outline" size="sm" aria-label="Update label" class="h-7 w-7 p-0">
									<img src="save.svg" alt="Save label" class="h-3 w-3" />
								</Button>
							</form>
						</div>
					</div>
					<div class="mb-2 flex items-center gap-2">
						<span class="text-muted-foreground text-s w-[80px] font-medium">Character Set:</span>
						<div class="flex-1">
							<div class="mb-2 flex flex-wrap gap-1">
								<button type="button" class="rounded border px-2 py-1 text-xs transition-colors {selectedNode && selectedNode.characterSet.upperAlphanumeric ? 'border-blue-500 bg-blue-500 text-white' : 'bg-background text-foreground border-border hover:bg-accent'}" onclick={() => toggleChar('upperAlphanumeric')}> A-Z </button>
								<button type="button" class="rounded border px-2 py-1 text-xs transition-colors {selectedNode && selectedNode.characterSet.lowerAlphanumeric ? 'border-blue-500 bg-blue-500 text-white' : 'bg-background text-foreground border-border hover:bg-accent'}" onclick={() => toggleChar('lowerAlphanumeric')}> a-z </button>
								<button type="button" class="rounded border px-2 py-1 text-xs transition-colors {selectedNode && selectedNode.characterSet.numbers ? 'border-blue-500 bg-blue-500 text-white' : 'bg-background text-foreground border-border hover:bg-accent'}" onclick={() => toggleChar('numbers')}> 0-9 </button>
								<button type="button" class="rounded border px-2 py-1 text-xs transition-colors {selectedNode && selectedNode.characterSet.simpleSpecialCharacters ? 'border-blue-500 bg-blue-500 text-white' : 'bg-background text-foreground border-border hover:bg-accent'}" onclick={() => toggleChar('simpleSpecialCharacters')}> # $ % & @ ^ ` ~</button>
								<button type="button" class="rounded border px-2 py-1 text-xs transition-colors {selectedNode && selectedNode.characterSet.extendedASCII ? 'border-blue-500 bg-blue-500 text-white' : 'bg-background text-foreground border-border hover:bg-accent'}" onclick={() => toggleChar('extendedASCII')}> Extended ASCII </button>
							</div>
							<div class="flex flex-wrap gap-1">
								<button type="button" class="rounded border px-2 py-1 text-xs transition-colors {selectedNode && selectedNode.characterSet.punctuationCharacters ? 'border-blue-500 bg-blue-500 text-white' : 'bg-background text-foreground border-border hover:bg-accent'}" onclick={() => toggleChar('punctuationCharacters')}> . , : ; </button>
								<button type="button" class="rounded border px-2 py-1 text-xs transition-colors {selectedNode && selectedNode.characterSet.quotations ? 'border-blue-500 bg-blue-500 text-white' : 'bg-background text-foreground border-border hover:bg-accent'}" onclick={() => toggleChar('quotations')}> " ' </button>
								<button type="button" class="rounded border px-2 py-1 text-xs transition-colors {selectedNode && selectedNode.characterSet.dashes ? 'border-blue-500 bg-blue-500 text-white' : 'bg-background text-foreground border-border hover:bg-accent'}" onclick={() => toggleChar('dashes')}> / \ | - _ </button>
								<button type="button" class="rounded border px-2 py-1 text-xs transition-colors {selectedNode && selectedNode.characterSet.mathSymbols ? 'border-blue-500 bg-blue-500 text-white' : 'bg-background text-foreground border-border hover:bg-accent'}" onclick={() => toggleChar('mathSymbols')}> {'> < * + ! ? ='} </button>
								<button type="button" class="rounded border px-2 py-1 text-xs transition-colors {selectedNode && selectedNode.characterSet.braces ? 'border-blue-500 bg-blue-500 text-white' : 'bg-background text-foreground border-border hover:bg-accent'}" onclick={() => toggleChar('braces')}> {'{} [] ()'} </button>
							</div>
						</div>
					</div>
					<div class="mb-2 flex items-center gap-2">
						<span class="text-muted-foreground text-s w-[80px] font-medium">Seed:</span>
						<input type="number" min="0" id="nodeSeed" name="NodeSeed" placeholder="0" bind:value={seedValue} oninput={() => nodeHashRefresh()} class="bg-background text-foreground focus-visible:ring-ring text-s flex-1 rounded border px-2 py-1 font-mono focus:outline-none focus-visible:ring-1" />
					</div>
					<div class="mb-2 flex items-center gap-2">
						<span class="text-muted-foreground text-s w-[80px] font-medium">Length:</span>
						<input type="number" min="1" max="100" id="nodeLength" name="NodeLength" placeholder="32" bind:value={lengthValue} oninput={() => nodeHashRefresh()} class="bg-background text-foreground focus-visible:ring-ring text-s flex-1 rounded border px-2 py-1 font-mono focus:outline-none focus-visible:ring-1" />
					</div>
				</div>

				<div class="mb-6">
					<h3 class="text-popover-foreground mb-3 border-b pb-1.5 text-sm font-semibold">Node Status</h3>
					<div class="mb-2 flex items-center gap-2">
						<span class="text-muted-foreground text-s w-[80px] font-medium">Is Root:</span>
						<span class="text-s font-mono font-semibold {selectedNode.checkIfRoot() ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}">
							{selectedNode.checkIfRoot() ? 'Yes' : 'No'}
						</span>
					</div>
					<div class="mb-2 flex items-center gap-2">
						<span class="text-muted-foreground text-s w-[80px] font-medium">Is Leaf:</span>
						<span class="text-s font-mono font-semibold {selectedNode.checkIfLeaf() ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}">
							{selectedNode.checkIfLeaf() ? 'Yes' : 'No'}
						</span>
					</div>
					<div class="mb-2 flex items-center gap-2">
						<span class="text-muted-foreground text-s w-[80px] font-medium">Children Count:</span>
						<span class="text-foreground text-s font-mono">{selectedNode.children.length}</span>
					</div>
					{#if creatingChild}
						<div class="mb-3">
							<div class="flex items-center gap-2">
								<span class="text-muted-foreground text-s w-[80px] font-medium">Child Name:</span>
								<div class="flex flex-1 gap-1.5">
									<input type="text" name="childNodeName" bind:value={childNodeName} class="bg-background text-foreground focus-visible:ring-ring text-s flex-1 rounded border px-2 py-1 focus:outline-none focus-visible:ring-1" placeholder="Enter node name..." />
									<Button onclick={() => createNodeChild(childNodeName)} class="text-s h-7 bg-sky-400 px-2" size="sm">Create</Button>
									<Button onclick={() => (creatingChild = false)} variant="outline" size="sm" class="text-s h-7 px-2">Cancel</Button>
								</div>
							</div>
						</div>
					{:else}
						<div class="mb-2 flex items-center gap-2">
							<span class="text-muted-foreground w-[80px] font-medium"></span>
							<Button onclick={() => (creatingChild = true)} class="text-s h-8 flex-1 bg-sky-400">Create Child</Button>
						</div>
					{/if}
					<div class="flex items-center gap-2">
						<span class="text-muted-foreground w-[80px] font-medium"></span>
						<Button onclick={() => removeNode(selectedNode!)} class="text-s h-8 flex-1 bg-red-400">Remove Node</Button>
					</div>
				</div>

				<div class="mb-6">
					<h3 class="text-popover-foreground mb-3 border-b pb-1.5 text-sm font-semibold">Password</h3>

					<div class="mb-3 flex flex-col gap-2">
						<div class="flex items-center gap-2">
							<span class="text-muted-foreground text-s w-[80px] font-medium">Value:</span>
							<span class="text-foreground text-s font-mono">{selectedNode.value}</span>
						</div>
						<div class="flex items-start gap-2">
							<span class="text-muted-foreground text-s w-[80px] font-medium">Generated Hash:</span>
							<div class="bg-muted/50 flex-1 rounded border p-2">
								<div class="flex items-center gap-1.5">
									<input class="text-foreground text-s flex-1 border-none bg-transparent font-mono break-all outline-none" type={showHash ? 'text' : 'password'} readonly value={currentHash} style="padding: 0; margin: 0;" />
									<Button type="button" variant="outline" onclick={() => (showHash = !showHash)} aria-label={showHash ? 'Hide hash' : 'Show hash'} class="h-6 w-6 p-1">
										<img src="eye.svg" alt={showHash ? 'Hide hash' : 'Show hash'} class="h-6 w-6" />
									</Button>
									<Button
										type="button"
										variant="outline"
										onclick={async () => {
											await navigator.clipboard.writeText(currentHash);
										}}
										aria-label="Copy hash"
										class="h-6 w-6 p-1"
									>
										<img src="copy.svg" alt="Copy hash" class="h-6 w-6" />
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<!-- No node selected -->
				<div class="text-muted-foreground py-6 text-center">
					<p class="mb-2 text-sm">No node selected</p>
					<p class="text-s opacity-80">Select a node to view its information</p>
				</div>
			{/if}
		</div>
	</div>
</div>
