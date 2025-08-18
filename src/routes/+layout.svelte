<script>
	let { children } = $props();
	import '../app.css';
	import '$lib/notifications';
	import Notifications from '$lib/UIElements/Notifications.svelte';
</script>

{@render children()}

<Notifications />
