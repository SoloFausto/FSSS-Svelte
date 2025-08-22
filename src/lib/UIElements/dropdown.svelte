<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import logo from '$lib/img/favicon.svg';
	let { colorMode = $bindable(), masterPassword = $bindable(''), exportSchema, importSchemaFile = $bindable(), saveToLocalStorage, loadFromLocalStorage } = $props();

	function toggleDarkMode() {
		colorMode = colorMode === 'dark' ? 'light' : 'dark';
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline"><img src={logo} alt="FSSS" class="h-5 w-5" /></Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="start">
		<DropdownMenu.Label>Settings</DropdownMenu.Label>
		<DropdownMenu.Group>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>Enter Master Password</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<input type="password" name="masterPassword" placeholder="Enter Master Password here..." bind:value={masterPassword} />
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>Schema File</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<DropdownMenu.Item onclick={exportSchema}>Export Graph Schema File</DropdownMenu.Item>
					<DropdownMenu.Item>
						<label for="importSchemaFile">Choose Schema File</label>
						<input accept=".json" bind:files={importSchemaFile} id="importSchemaFile" type="file" style="display:none;" />
					</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>Local Storage</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<DropdownMenu.Item onclick={saveToLocalStorage}>Save</DropdownMenu.Item>
					<DropdownMenu.Item onclick={loadFromLocalStorage}>Load</DropdownMenu.Item>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Item>
				<a href="https://github.com/SoloFausto/FSSS-Svelte/wiki/User-Guide">Show Tutorial </a>
			</DropdownMenu.Item>
			<DropdownMenu.Item><a href="https://github.com/SoloFausto/FSSS-Svelte">GitHub</a></DropdownMenu.Item>
			<DropdownMenu.Item>
				<button onclick={toggleDarkMode}>{colorMode === 'dark' ? 'Disable Dark Mode' : 'Enable Dark Mode'}</button>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
