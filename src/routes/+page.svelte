<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import { PasswordNode } from '$lib/paswordNode';
	import PasswordNodeElement from '$lib/UIElements/passwordNodeElement.svelte';
	import { SvelteFlow, Background, Panel, BackgroundVariant, type Edge, type Node, type ColorMode } from '@xyflow/svelte';
	import { getLayoutedElements } from '$lib/dagre/dagreLayout';
	import Dropdown from '$lib/UIElements/dropdown.svelte';
	import SideMenu from '$lib/UIElements/sideMenu.svelte';

	const nodeTypes = { passwordNode: PasswordNodeElement };
	var darkMode: boolean = $state(true);

	var masterPassword: string = $state('');

	var rootPasswordNode: PasswordNode = $state(new PasswordNode('root', null));
	var inputSchemaFile: FileList | null = $state(null);

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

	function reRenderGraph() {
		rawNodes = rootPasswordNode.childrenToNodes();
		rawEdges = rootPasswordNode.childrenToEdges();
		({ nodes: graphNodes, edges: graphEdges } = getLayoutedElements(rawNodes, rawEdges));
	}
	function exportSchema() {
		const schemaJSON = JSON.stringify(rootPasswordNode, getCircularReplacer());
		const blob = new Blob([schemaJSON], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'graph-schema.json';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
	$effect(() => {
		console.log('processing inputSchemaFile');
		if (inputSchemaFile) {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const data = JSON.parse(e.target?.result as string);
					rootPasswordNode = PasswordNode.fromJSON(data);
					reRenderGraph();
				} catch (error) {
					console.error('Error parsing JSON:', error);
				}
			};
			reader.readAsText(inputSchemaFile[0]);
			inputSchemaFile = null;
		}
	});
	function getCircularReplacer() {
		const seen = new WeakSet();
		return (key: any, value: any) => {
			if (typeof value === 'object' && value !== null) {
				if (seen.has(value)) {
					return;
				}
				seen.add(value);
			}
			return value;
		};
	}
	function showTutorial() {}

	let colorMode: ColorMode = $state('dark');
</script>

<div>
	<div id="canvas" style:width="100vw" style:height="100vh">
		<SvelteFlow nodes={graphNodes} edges={graphEdges} fitView ondelete={reRenderGraph} nodesDraggable={false} nodesConnectable={false} {nodeTypes} {colorMode}>
			<Background variant={BackgroundVariant.Dots} />
			<Panel position="top-left">
				<Dropdown bind:masterPassword {exportSchema} bind:importSchemaFile={inputSchemaFile} bind:colorMode />
			</Panel>
			<Panel position="top-right">
				<SideMenu reRender={reRenderGraph} {masterPassword} />
			</Panel>
		</SvelteFlow>
	</div>
	<!--  -->
</div>
