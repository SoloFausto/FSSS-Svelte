<script lang="ts">
	import { notifications } from '$lib/notifications';
	import { fly, fade } from 'svelte/transition';

	const colorMap: Record<string, string> = { info: 'bg-popover text-popover-foreground border-border', success: 'bg-green-600 text-white border-green-500', warning: 'bg-yellow-500 text-black border-yellow-400', error: 'bg-red-600 text-white border-red-500' };

	function icon(type: string) {
		switch (type) {
			case 'success':
				return '✓';
			case 'warning':
				return '⚠';
			case 'error':
				return '!';
			default:
				return 'i';
		}
	}
</script>

<div class="pointer-events-none fixed top-4 left-1/2 z-[1000] flex w-full max-w-full -translate-x-1/2 flex-col items-center gap-2 px-4">
	{#each $notifications as n (n.id)}
		<div class={`pointer-events-auto flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-md border px-4 py-3 shadow-lg ring-1 ring-black/5 ${colorMap[n.type]}`} role="status" aria-live={n.type === 'error' ? 'assertive' : 'polite'} in:fly={{ y: -20, duration: 160 }} out:fade={{ duration: 120 }}>
			<span class="text-lg leading-none">{icon(n.type)}</span>
			<div class="flex-1 text-sm">{n.message}</div>
			<button class="ml-1 rounded p-1 text-xs opacity-70 transition hover:opacity-100" on:click={() => notifications.dismiss(n.id)} aria-label="Dismiss notification"> ✕ </button>
		</div>
	{/each}
</div>
