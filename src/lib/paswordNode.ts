import {hash} from '$lib/passwordHasher';

class PasswordNode {
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
}

