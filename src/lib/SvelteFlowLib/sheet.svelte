<script lang="ts">
    import { PasswordNode } from "$lib/paswordNode";
    import type { Node } from "@xyflow/svelte";
    import PasswordNodeElement from "./passwordNodeElement.svelte";
    import { useOnSelectionChange } from "@xyflow/svelte";

    let { masterPassword, reRender } = $props();

    let selectedNode: PasswordNode | null = $state.raw(null);

    useOnSelectionChange(({ nodes, edges }) => {
        selectedNode = nodes.length > 0 ? nodes[0].data.passwordNode : null;
    });
</script>

<!-- Sidebar overlay -->
<div class="" role="button" tabindex="0">
    <!-- Sidebar content -->
    <div class="w-96 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl flex flex-col overflow-hidden" aria-modal="true">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-900">
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
                        <span class="text-gray-900 dark:text-gray-100 font-mono"
                            >{selectedNode.label}</span
                        >
                    </div>
                    <div class="flex items-center mb-3 gap-2">
                        <span  class="font-medium text-gray-600 dark:text-gray-400 min-w-[100px]">Color:</span>
                        <div class="w-5 h-5 rounded border border-gray-200 dark:border-gray-600" style="background-color: {selectedNode.color}"></div>
                        <span class="text-gray-900 dark:text-gray-100 font-mono">{selectedNode.color}</span>
                    </div>
                </div>

                <div class="mb-8">
                    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                        Node Status
                    </h3>
                    <div class="flex items-center mb-3 gap-2">
                        <span class="font-medium text-gray-600 dark:text-gray-400 min-w-[100px]">Is Root:</span>
                        <span class="font-mono font-semibold {selectedNode.checkIfRoot() ? 'text-green-600': 'text-red-600'}">
                            {selectedNode.checkIfRoot() ? "Yes" : "No"}
                        </span>
                    </div>
                    <div class="flex items-center mb-3 gap-2">
                        <span class="font-medium text-gray-600 dark:text-gray-400 min-w-[100px]">Is Leaf:</span>
                        <span class="font-mono font-semibold {selectedNode.checkIfLeaf()? 'text-green-600': 'text-red-600'}">
                            {selectedNode.checkIfLeaf() ? "Yes" : "No"}
                        </span>
                    </div>
                    <div class="flex items-center mb-3 gap-2">
                        <span class="font-medium text-gray-600 dark:text-gray-400 min-w-[100px]">Children Count:</span>
                        <span class="text-gray-900 dark:text-gray-100 font-mono">{selectedNode.children.length}</span>
                    </div>
                </div>


                <div class="mb-8">
                    <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                        Password Generation
                    </h3>
                    <div class="mb-4">
                        <label for="master-password" class="block mb-2 font-medium text-gray-600 dark:text-gray-400">
                            Master Password:
                        </label>
                    </div>

                    <div class="flex items-start mb-3 gap-2">
                        <span class="font-medium text-gray-600 dark:text-gray-400 min-w-[100px]">
                            Generated Hash:
                        </span>
                        <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md p-3 mt-2 flex-1">
                            <code class="font-mono text-sm break-all text-gray-900 dark:text-gray-100"></code>
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
