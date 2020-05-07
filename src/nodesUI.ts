// Importing this adds a right-click menu with 'Inspect Element' option


module NodesUIModule {

    let div = UIModule.div;
    let select = UIModule.select;

    function generateNodeUI(structure: Array<Nodes.NodeAttribute>) {
        let e = div({
            class: 'node-attribs'
        });

        for (let attrib of structure)
        {
            let title = div({
                class: 'node-attrib-title',
                html: attrib.title
            });

            let value;
            switch(attrib.type){
                case 'string':
                    value = div({
                        class: ['node-attrib-value', 'string'],
                        html: (attrib as Nodes.NodeStringAttribute).value
                    });

                    break;
                case 'select':
                    value = select({
                        values: (attrib as Nodes.NodeSelectAttribute).options,
                        default: (attrib as Nodes.NodeSelectAttribute).value,

                        onchange: (e: Event) => { 
                            (attrib as Nodes.NodeSelectAttribute).onchange(
                                    (e.target as HTMLSelectElement).value
                                );
                            },

                        class: ['node-attrib-value', 'select']

                    });
                    break;
            }

            let line = div({
                class: 'node-attrib',
                child: [title, value]
            });

            e.appendChild(line);
        }

        return e;
    }


    export class NodeElement {
        id: string;
        private static nodeID: number = 0;

        //element is that little badge representing the node
        protected element: HTMLElement;
        protected detailElement: HTMLElement;
        node: Nodes.Node;
        
        constructor(node: Nodes.Node)
        {
            this.id = "node" + NodeElement.nodeID.toString();
            NodeElement.nodeID++;
            this.node = node;
            
            //construct UI
            this.element = div({
                id: this.id,
                class: 'node'
            });

            this.detailElement = div({
                class: 'node-detail'
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

        get detail() {
            return this.detailElement;
        }
    }
    
    
    export class DatasetNodeElement extends NodeElement {
        node: Nodes.DatasetNode;

        constructor(node: Nodes.DatasetNode) {
            super(node);

            //setup widget
            let title = UIModule.div({
                html: 'Dataset',
                class: 'node-title'
            })

            //gets only the filename from the full path
            console.log(node.structure);
            let filename = node.structure.path.value.replace(/^.*[\\\/]/, '');
            let size = node.structure.res.value;

            let meta = UIModule.div({
                html: filename + " &#8226; " + size,
                class: "node-meta"
            });

            this.element.appendChild(title);
            this.element.appendChild(meta);

            //setup element detail

            let struct = generateNodeUI([
                node.structure.path, 
                node.structure.res, 
                node.structure.mode
            ]);

            this.detailElement.appendChild(struct);
        }
    }
}