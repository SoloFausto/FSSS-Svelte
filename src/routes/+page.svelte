<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import { PasswordNode } from '$lib/paswordNode';
	import PasswordNodeElement from '$lib/UIElements/passwordNodeElement.svelte';
	import { SvelteFlow, Background, Panel, BackgroundVariant, type Edge, type Node, type ColorMode } from '@xyflow/svelte';
	import { getLayoutedElements } from '$lib/dagre/dagreLayout';
	import Dropdown from '$lib/UIElements/dropdown.svelte';
	import SideMenu from '$lib/UIElements/sideMenu.svelte';
	import { encryptGraph, decryptGraph, type EncryptedGraph } from '$lib/encryption';
	import { notify } from '$lib/notifications';
	import Cookies from 'js-cookie';

	const nodeTypes = { passwordNode: PasswordNodeElement };
	var darkMode: boolean = $state(true);

	var masterPassword: string = $state('');
	var rootPasswordNode: PasswordNode = $state(new PasswordNode('root', null));

	var inputSchemaFile: FileList | null = $state(null);
	let colorMode: ColorMode = $state('dark');

	var graphNodes: any[] = $state([]);
	var graphEdges: any[] = $state([]);
	let rawNodes: Node[] = new Array();
	let rawEdges: Edge[] = new Array();
	reRenderGraph();

	$effect(() => {
		({ nodes: graphNodes, edges: graphEdges } = getLayoutedElements(rawNodes, rawEdges));
	});

	const toggleDarkMode = () => {
		darkMode = !darkMode;
		document.body.classList.toggle('dark-mode', darkMode);
	};
	let isInPortrait: boolean = typeof window !== 'undefined' && window.matchMedia('(orientation: portrait)').matches;
	function reRenderGraph() {
		rawNodes = rootPasswordNode.childrenToNodes();
		rawEdges = rootPasswordNode.childrenToEdges();
		({ nodes: graphNodes, edges: graphEdges } = getLayoutedElements(rawNodes, rawEdges));
	}
	async function exportSchema() {
		if (!masterPassword) {
			notify({ type: 'warning', message: 'Set a master password before exporting.' });
			return;
		}
		const encryptedSchemaJson = JSON.stringify(await encryptGraph(rootPasswordNode, masterPassword));
		const blob = new Blob([encryptedSchemaJson], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'encrypted-graph-schema.json';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
	$effect(() => {
		if (inputSchemaFile) {
			console.log('processing inputSchemaFile');
			const reader = new FileReader();
			reader.onload = async (e) => {
				try {
					const data: EncryptedGraph = JSON.parse(e.target?.result as string);
					const decryptedData = await decryptGraph(data, masterPassword);
					rootPasswordNode = PasswordNode.fromJSON(decryptedData);
					reRenderGraph();
					notify({ type: 'success', message: 'Schema imported successfully.' });
				} catch (error) {
					notify({ type: 'error', message: 'Error processing input schema file, check the master password.' });
				}
			};
			reader.readAsText(inputSchemaFile[0]);
			inputSchemaFile = null;
		}
	});
	async function loadFromLocalStorage() {
		if (!checkIfLocalStorageExists() || !masterPassword) {
			return;
		}
		try {
			const encryptedSchemaJson = localStorage.getItem('encryptedGraphSchema');
			if (!encryptedSchemaJson) {
				return;
			}
			const data: EncryptedGraph = JSON.parse(encryptedSchemaJson);
			const decryptedData = await decryptGraph(data, masterPassword);
			rootPasswordNode = PasswordNode.fromJSON(decryptedData);
			reRenderGraph();
			notify({ type: 'success', message: 'Schema loaded from local storage successfully.' });
		} catch (error) {
			notify({ type: 'error', message: 'Error loading schema from local storage, check the master password.' });
		}
	}
	async function saveToLocalStorage() {
		if (!masterPassword) {
			notify({ type: 'warning', message: 'Set a master password before saving to local storage.' });
			return;
		}
		const encryptedSchemaJson = JSON.stringify(await encryptGraph(rootPasswordNode, masterPassword));
		localStorage.setItem('encryptedGraphSchema', encryptedSchemaJson);
		notify({ type: 'success', message: 'Schema saved to local storage successfully.' });
	}
	function checkIfLocalStorageExists(): boolean {
		return localStorage.getItem('encryptedGraphSchema') !== null;
	}
	function showTutorial() {}
</script>

<div>
	<div id="canvas" style:width="100vw" style:height="100vh">
		<SvelteFlow nodes={graphNodes} edges={graphEdges} fitView ondelete={reRenderGraph} nodesDraggable={false} nodesConnectable={false} {nodeTypes} {colorMode}>
			<Background variant={BackgroundVariant.Dots} />
			<Panel position="top-left">
				<div class="mt-6">
					<Dropdown bind:masterPassword {exportSchema} bind:importSchemaFile={inputSchemaFile} bind:colorMode {saveToLocalStorage} {loadFromLocalStorage} />
				</div>
			</Panel>
			<Panel position={isInPortrait ? 'bottom-center' : 'top-right'}>
				<div class="mt-6">
					<SideMenu reRender={reRenderGraph} {masterPassword} {isInPortrait} />
				</div>
			</Panel>
		</SvelteFlow>
	</div>
	<!--  -->
</div>
