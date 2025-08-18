<script lang="ts">
	import '@xyflow/svelte/dist/style.css';
	import { Position, useSvelteFlow, type NodeProps } from '@xyflow/svelte';
	import { PasswordNode } from '$lib/paswordNode';
	import { Handle } from '@xyflow/svelte';
	let { id, data }: NodeProps = $props();
	let { updateNodeData } = useSvelteFlow();
</script>

<div class="password-node" style="background-color: {data.color}; border-color: {data.borderColor};">
	{#if data.sourceHandles == 1}
		<Handle type="target" position={Position.Top} />
	{/if}
	<div>
		<p style="color: {data.textColor}">{data.label}</p>
	</div>
	{#if data.targetHandles == 1}
		<Handle type="source" position={Position.Bottom} />
	{/if}
</div>
