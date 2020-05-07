// Importing this adds a right-click menu with 'Inspect Element' option


module NodesUIModule {

    export class NodeElement {
        id: string;
        private static nodeID: number = 0;

        //element is that little badge representing the node
        protected element: HTMLElement;
        node: Nodes.Node;
        
        constructor(node: Nodes.Node)
        {
            this.id = "node" + NodeElement.nodeID.toString();
            NodeElement.nodeID++;
            this.node = node;
            
            //construct UI
            this.element = UIModule.div({
                id: this.id,
                class: 'node'
            });

            this.element.draggable = true;
            
        }
        
        get html() {
            return this.element;
        }

        get context_options()
        {
            return [
                {
                    title: 'Delete',
                    call: () => {
                        console.log('deleting node', this.id);
                        this.node.delete();
                    }
                }
            ]
        }
    }
    
    
    export class DatasetNodeElement extends NodeElement {
        node: Nodes.DatasetNode;

        constructor(node: Nodes.DatasetNode) {
            super(node);

            let title = UIModule.div({
                html: 'Dataset',
                class: 'node_title'
            })

            //gets only the filename from the full path
            let filename = node.path.replace(/^.*[\\\/]/, '');
            //join numbers with cross
            let size = node.res.join("&#10005;");

            let meta = UIModule.div({
                html: filename + " &#8226; " + size,
                class: "node_meta"
            });

            this.element.appendChild(title);
            this.element.appendChild(meta);
        }
    }
}