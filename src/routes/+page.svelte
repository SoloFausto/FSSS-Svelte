<script lang="ts">
    import "@xyflow/svelte/dist/style.css";
    import { PasswordNode } from "$lib/paswordNode";
    import PasswordNodeElement from "$lib/SvelteFlowLib/passwordNodeElement.svelte";
    import {
        SvelteFlow,
        Background,
        Panel,
        BackgroundVariant,
        type Edge,
        type Node,
    } from "@xyflow/svelte";
    import { getLayoutedElements } from "$lib/dagre/dagreLayout";
    import Dropdown from "$lib/SvelteFlowLib/dropdown.svelte";
    import SideMenu from "$lib/SvelteFlowLib/sideMenu.svelte";


    const nodeTypes = { passwordNode: PasswordNodeElement };
    var darkMode: boolean = $state(true);

    var masterPassword: string = $state("");

    var rootPasswordNode: PasswordNode = $state(new PasswordNode("root", null));

    rootPasswordNode.addChild(new PasswordNode("child1", rootPasswordNode));
    rootPasswordNode.addChild(new PasswordNode("child2", rootPasswordNode));
    rootPasswordNode.children[0].addChild(
        new PasswordNode("child1.1", rootPasswordNode.children[0]),
    );


    var graphNodes: any[] = $state([]);
    var graphEdges: any[] = $state([]);
    let rawNodes: Node[] = rootPasswordNode.childrenToNodes();
    let rawEdges: Edge[] = rootPasswordNode.childrenToEdges();

    $effect(() => {
        ({ nodes: graphNodes, edges: graphEdges } = getLayoutedElements(
            rawNodes,
            rawEdges,
        ));
    });

    const toggleDarkMode = () => {
        darkMode = !darkMode;
        document.body.classList.toggle("dark-mode", darkMode);
    };


    function reRenderGraph() {
        rawNodes = rootPasswordNode.childrenToNodes();
        rawEdges = rootPasswordNode.childrenToEdges();
        ({ nodes: graphNodes, edges: graphEdges } = getLayoutedElements(
            rawNodes,
            rawEdges,
        ));
    }
    function exportSchema(){

    }
    function showTutorial(){

    }
    
</script>

<div>
    <!-- <div>
        <p>Master Password</p>
        <p>Export</p>
        <button><img src="" alt=""></button>
    </div> -->

    <div id="canvas" style:width="100vw" style:height="100vh">
        <SvelteFlow
            nodes={graphNodes}
            edges={graphEdges}
            fitView
            ondelete={reRenderGraph}
            nodesDraggable={false}
            nodesConnectable={false}
            {nodeTypes}
        >
            <Background variant={BackgroundVariant.Dots} />
            <Panel position="top-left">
                <Dropdown darkMode={darkMode} bind:masterPassword={masterPassword} />
            </Panel>
            <Panel position="top-right">
                <SideMenu reRender={reRenderGraph} masterPassword={masterPassword} />
            </Panel>
        </SvelteFlow>
    </div>
    <!--  -->
</div>
