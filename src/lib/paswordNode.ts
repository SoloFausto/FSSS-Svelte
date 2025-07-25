import {hash} from '$lib/passwordHasher';
import {type Edge, type Node,type Position} from '@xyflow/svelte';
export type HandleType = 'source' | 'target';


type NodeHandle = {
    width?: number | undefined;
    height?: number | undefined;
    id?: string | null | undefined;
    x: number;
    y: number;
    position: Position;
    type: HandleType;
}

export class PasswordNode {
    value: string;
    children: PasswordNode[];
    color: string = "rgba(0, 0, 0)"; 
    label: string = ""; 
    parent: PasswordNode | null;
    
    constructor(value: string, parent: PasswordNode | null) {
        this.value = value;
        this.label = value;
        this.children = [];
        this.parent = parent;
    }

    addChild(child: PasswordNode) {
        child.parent = this; // Set the parent of the child node
        this.children.push(child);
    }
    setColor(color: string) {
        this.color = color;
    }
    setLabel(label: string) {
        this.label = label;
    }
    calculateHash(masterPassword:string): string {
        let concatenatedString: string = "";
        let currparent: PasswordNode | null = this.parent;
        while (currparent !== null) {
            concatenatedString = currparent.value + concatenatedString;
            currparent = currparent.parent;
        }
        let createdHash: string = hash(masterPassword, concatenatedString);


        return createdHash;
    }
    toNode(): Node {
        var sourceHandles: number = 1;
        var targetHandles: number = 1;
        if (this.checkIfLeaf()){
            targetHandles = 0; // Leaf nodes have no target handles
        }
        if (this.checkIfRoot()){
            sourceHandles = 0; // Root nodes have no source handles
        }
        return {
            id: this.value,
            type: 'passwordNode',
            position: { x: 0, y: 0 },
            data: { label: this.label, "sourceHandles": sourceHandles, "targetHandles": targetHandles },
            // style: { backgroundColor: this.color }
        };
    }
    checkIfLeaf(): boolean {
        return this.children.length === 0;
    }
    checkIfRoot(): boolean {
        return this.parent === null;
    }
    toEdge(): Edge {
        if (this.parent === null) {
            throw new Error("Cannot create edge for root node without parent");
        }
        return {
            id: `${this.parent.value}-${this.value}`,
            source: this.parent.value,
            target: this.value,
            type: 'simple',
            animated: true,
        };
    }
    childrenToNodes(): Node[] {
        let allNodes: Node[] = [this.toNode()]; // Add the root node first
        
        for (const child of this.children) {
            allNodes.push(child.toNode());
            allNodes.push(...child.childrenToNodes());
        }
        
        return allNodes;
    }
    childrenToEdges(): Edge[] {
        let allEdges: Edge[] = [];

        for (const child of this.children) {
            allEdges.push(child.toEdge()); // Add edge from this node to child
            allEdges.push(...child.childrenToEdges()); // Recursively get edges from child's subtree
        }

        return allEdges;
    }
    
}

