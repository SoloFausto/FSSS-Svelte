import { hash } from "$lib/passwordHasher";
import { type Edge, type Node, type Position } from "@xyflow/svelte";
import { type CharacterSetOption, characterSetChoices } from '$lib/passwordHasher';
import { Colord, colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";

extend([a11yPlugin]);

export type HandleType = "source" | "target";

export class PasswordNode {
  value: string;
  children: PasswordNode[];
  color: Colord;
  borderColor: Colord;
  textColor: Colord;
  label: string = "";
  seed: number = 0;
  characterSet: CharacterSetOption;
  length: number = 32;
  parent: PasswordNode | null;

  constructor(value: string, parent: PasswordNode | null) {
    this.value = value;
    this.label = value;
    this.children = [];
    this.parent = parent;
    this.color = colord("rgb(255, 255, 255)");
    this.borderColor = colord("rgb(0, 0, 0)");
    this.textColor = colord("rgb(0, 0, 0)");
    this.characterSet = characterSetChoices[2];
  }
  static fromJSON(data: any): PasswordNode {
    const node = new PasswordNode(data.value, null);
    node.label = data.label;
    node.color = data.color;
    node.seed = data.seed;
    node.characterSet = data.characterSet;
    node.length = data.length;
    for (const childData of data.children) {
      PasswordNode.fromJSON(childData);
      const child = PasswordNode.fromJSON(childData);
      node.addChild(child);
      child.parent = node;
    }
    return node;
  }

  addChild(child: PasswordNode) {
    child.parent = this; // Set the parent of the child node
    this.children.push(child);
  }
  removeChild(child: PasswordNode) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.parent = null; // Clear the parent reference
    }
  }

  setColor(color: Colord) {
    this.color = color;
    this.borderColor = color.darken(0.2);
    this.textColor = color.contrast(colord("black")) > 1.5 ? colord("black") : colord("white");
  }
  setLabel(label: string) {
    this.label = label;
  }
  setSeed(seed: number) {
    this.seed = seed;
    if (seed < 0) {
      this.seed = 0;
    }
  }
  setLength(length: number) {
    this.length = length;
    if (length < 1) {
      this.length = 1;
    } else if (length > 100) {
      this.length = 100;
    }
  }
  calculateHash(masterPassword: string): string {
    let concatenatedString: string = this.value;
    let currparent: PasswordNode | null = this.parent;
    while (currparent !== null) {
      concatenatedString = currparent.value + concatenatedString;
      currparent = currparent.parent;
    }
    let createdHash: string = hash(masterPassword, concatenatedString, this.characterSet, this.length, this.seed);

    return createdHash;
  }
  toNode(): Node {
    var sourceHandles: number = 1;
    var targetHandles: number = 1;
    if (this.checkIfLeaf()) {
      targetHandles = 0; // Leaf nodes have no target handles  export let passwordNode: PasswordNode = data.passwordNode;
    }
    if (this.checkIfRoot()) {
      sourceHandles = 0; // Root nodes have no source handles
    }
    return {
      id: this.value,
      type: "passwordNode",
      position: { x: 0, y: 0 },
      data: {
        label: this.label,
        sourceHandles: sourceHandles,
        targetHandles: targetHandles,
        passwordNode: this,
        textColor: this.textColor.toHex(),
        color: this.color.toHex(),
        borderColor: this.borderColor.toHex(),
      },
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
      type: "simple",
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
