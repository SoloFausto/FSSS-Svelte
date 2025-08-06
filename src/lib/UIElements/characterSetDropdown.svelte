<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';
	import { characterSetChoices } from '$lib/passwordHasher';

	let open = $state(false);
	let { selection = $bindable(), nodeHashRefresh } = $props();
	let triggerRef = $state<HTMLButtonElement>(null!);
	let selectedValue: string | null = $state(null);
	$effect(() => {
		selectedValue = selection ? selection.label : null;
	});
	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button variant="outline" class="w-[200px] justify-between" {...props} role="combobox" aria-expanded={open}>
				{selectedValue || 'Select a framework...'}
				<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.List>
				<Command.Empty>No framework found.</Command.Empty>
				<Command.Group>
					{#each characterSetChoices as choice}
						<Command.Item
							value={choice.value}
							onSelect={() => {
								selectedValue = choice.label;
								selection = choice;
								console.log('selected character set:', selectedValue);
								nodeHashRefresh();
								closeAndFocusTrigger();
							}}
						>
							<CheckIcon class={cn('mr-2 size-4', selectedValue !== choice.value && 'text-transparent')} />
							{choice.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
