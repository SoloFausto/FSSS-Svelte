
<script lang="ts">
    import '@xyflow/svelte/dist/style.css';
    import {hash} from '$lib/passwordHasher';
    import { SvelteFlow } from '@xyflow/svelte';


    var darkMode: boolean = $state(true);

    const toggleDarkMode = () => {
        darkMode = !darkMode;
        document.body.classList.toggle("dark-mode", darkMode);
    };
    $effect(() => {
        document.body.classList.toggle("dark-mode", darkMode);
    });
    var masterPassword: string = $state("");
    var servicePassword: string = $state("");
    var hashedPassword: string = $derived(
        hash(masterPassword, servicePassword)
    );


</script>


<button id="darkModeSwitch" onclick={toggleDarkMode}>Toggle Dark Mode</button>
<img src="img/favicon-192x192.png" alt="Logo" id="logo">
<h1>FSSS</h1>
<p>Fausto's modified Super Secret Settings</p>
<input type="text" id="masterPassword" placeholder="Master Password" bind:value={masterPassword}>
<br> 
<input type="text" id="servicePassword" placeholder="Service Password" bind:value={servicePassword}>
<p id="result" style="cursor:pointer;" title="Click to copy" onclick={() => navigator.clipboard.writeText(hashedPassword)}> {hashedPassword}</p>
