<script lang="ts">
    import { PasswordNode } from "$lib/paswordNode";
    import type { Node } from "@xyflow/svelte";
    import PasswordNodeElement from "./passwordNodeElement.svelte";
    import { useOnSelectionChange } from "@xyflow/svelte";

    let { masterPassword, reRender } = $props();

    let selectedNode: PasswordNode | null = $state.raw(null);

    let currentHash: string = $derived.by(() => {
        return selectedNode ? selectedNode.calculateHash(masterPassword) : "";
    });

    useOnSelectionChange(({ nodes, edges }) => {
        selectedNode = nodes.length > 0 ? nodes[0].data.passwordNode : null;
        showHash = false;
    });
    let showHash: boolean = $state(false);
    function createNodeChild(value: string) {
        if (selectedNode) {
            const newChild = new PasswordNode(value, selectedNode);
            selectedNode.addChild(newChild);
            creatingChild = false;
            childNodeName = "";
            reRender();
        }
    }
    function removeNode(node: PasswordNode) {
        if (node.parent) {
            node.parent.removeChild(node);
        }
        reRender();
    }

let childNodeName = $state("");
let creatingChild = $state(false);
</script>       

<!-- Sidebar overlay -->
<div class="" role="button" tabindex="0">
    <!-- Sidebar content -->
    <div
        class="w-120 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl flex flex-col overflow-hidden"
        aria-modal="true"
    >
        <!-- Header -->
        <div
            class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-900"
        >
            <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Node Information
            </h2>
        </div>

        <!-- Content -->
        <div class="flex-1 p-6 overflow-y-auto">
            {#if selectedNode}
                <div class="mb-8">
                    <h3
                        class="text-base font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4"
                    >
                        Basic Information
                    </h3>
                    <div class="flex items-center mb-3 gap-2">
                        <span
                            class="font-medium text-gray-600 dark:text-gray-400 min-w-[100px]"
                            >Value:</span
                        >
                        <span class="text-gray-900 dark:text-gray-100 font-mono"
                            >{selectedNode.value}</span
                        >
                    </div>
                    <div class="flex items-center mb-3 gap-2">
                        <span
                            class="font-medium text-gray-600 dark:text-gray-400 min-w-[100px]"
                            >Label:</span
                        >
                        <form onsubmit={() => reRender()}>
                            <input
                                class="text-gray-900 dark:text-gray-100 font-mono bg-transparent border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                type="text"
                                bind:value={selectedNode.label}
                            />
                            <button
                                    type="submit"
                                    class="px-2 py-1 rounded text-xs border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    aria-label="Update label"
                                >
                                    <img
                                        src="save.svg"
                                        alt="Save label"
                                        class="w-7 h-7 max-w-none"
                                    />
                                </button>
                        </form>
                    </div>
                    </div>
                    <div class="flex items-center mb-3 gap-2">
                        <span
                            class="font-medium text-gray-600 dark:text-gray-400 min-w-[100px]"
                            >Color:</span
                        >
                        <div
                            class="w-5 h-5 rounded border border-gray-200 dark:border-gray-600"
                            style="background-color: {selectedNode.color}"
                        ></div>
                        <span class="text-gray-900 dark:text-gray-100 font-mono"
                            >{selectedNode.color}</span
                        >
                    </div>

                <div class="mb-8">
                    <h3
                        class="text-base font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4"
                    >
                        Node Status
                    </h3>
                    <div class="flex items-center mb-3 gap-2">
                        <span
                            class="font-medium text-gray-600 dark:text-gray-400 min-w-[100px]"
                            >Is Root:</span
                        >
                        <span
                            class="font-mono font-semibold {selectedNode.checkIfRoot()
                                ? 'text-green-600'
                                : 'text-red-600'}"
                        >
                            {selectedNode.checkIfRoot() ? "Yes" : "No"}
                        </span>
                    </div>
                    <div class="flex items-center mb-3 gap-2">
                        <span
                            class="font-medium text-gray-600 dark:text-gray-400 min-w-[100px]"
                            >Is Leaf:</span
                        >
                        <span
                            class="font-mono font-semibold {selectedNode.checkIfLeaf()
                                ? 'text-green-600'
                                : 'text-red-600'}"
                        >
                            {selectedNode.checkIfLeaf() ? "Yes" : "No"}
                        </span>
                    </div>
                    <div class="flex items-center mb-3 gap-2">
                        <span
                            class="font-medium text-gray-600 dark:text-gray-400 min-w-[100px]"
                            >Children Count:</span
                        >
                        <span class="text-gray-900 dark:text-gray-100 font-mono"
                            >{selectedNode.children.length}</span
                        >
                    </div>
                    {#if creatingChild}
                    <div>
                        <span
                            class="font-medium text-gray-600 dark:text-gray-400 min-w-[100px]"
                        >
                            Child Node Name:
                        </span>
                        <input type="text" name="childNodeName" bind:value={childNodeName} />
                        <button onclick={() => createNodeChild(childNodeName)}>Create Child</button>
                    </div>
                    {:else}

                    <button
                        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onclick={() => (creatingChild = true)}
                    >
                        Create Child
                    </button>
                    {/if}
                    <button
                        class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        onclick={() => removeNode(selectedNode!)}
                    >
                        Remove Node
                    </button>
                </div>

                <div class="mb-8">
                    <h3
                        class="text-base font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4"
                    >
                        Password
                    </h3>

                    <div class="flex items-start mb-3 gap-2">
                        <span
                            class="font-medium text-gray-600 dark:text-gray-400 min-w-[100px]"
                        >
                            Generated Hash:
                        </span>
                        <div
                            class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md p-3 mt-2 flex-1"
                        >
                            <div class="flex items-center gap-2">
                                <input
                                    class="font-mono text-sm break-all text-gray-900 dark:text-gray-100 bg-transparent border-none outline-none flex-1"
                                    type={showHash ? "text" : "password"}
                                    readonly
                                    value={currentHash}
                                    style="padding: 0; margin: 0;"
                                />
                                <button
                                    type="button"
                                    class="px-2 py-1 rounded text-xs border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    onclick={() => (showHash = !showHash)}
                                    aria-label={showHash
                                        ? "Hide hash"
                                        : "Show hash"}
                                >
                                    <img
                                        src="eye.svg"
                                        alt={showHash
                                            ? "Hide hash"
                                            : "Show hash"}
                                        class="w-7 h-7 max-w-none"
                                    />
                                </button>
                                <button
                                    type="button"
                                    class="px-2 py-1 rounded text-xs border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    onclick={async () => {
                                        await navigator.clipboard.writeText(
                                            currentHash,
                                        );
                                    }}
                                    aria-label="Copy hash"
                                >
                                    <img
                                        src="copy.svg"
                                        alt="Copy hash"
                                        class="w-7 h-7 max-w-none"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            {:else}
                <!-- No node selected -->
                <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p class="mb-2">No node selected</p>
                    <p class="text-sm opacity-80">
                        Select a node to view its information
                    </p>
                </div>
            {/if}
        </div>
    </div>
</div>
