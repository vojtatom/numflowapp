

module Nodes {


    export interface NodeAttribute {
        type: 'string' | 'select';
        title: string;
    }


    export interface NodeStringAttribute extends NodeAttribute {
        type: 'string';
        value: string;
    }

    export interface NodeSelectAttribute extends NodeAttribute {
        type: 'select';
        options: Array<string | number>;
        value: string | number;
        onchange: (value: string) => void;
    }

    export class Node {
        structure: {
            [key: string]: NodeAttribute
        };

        element: NodesUIModule.NodeElement;
        graphics: GraphicsModule.Graphics;
        app: AppModule.Application;

        constructor(app: AppModule.Application)
        {

            this.app = app;
        }

        get id(){
            return this.element.id;
        }

        delete() {
            //delete ui
            this.app.ui.unregister_node(this.id);
            
            //delete graphics
            
            //delete from app??
            this.app.remove_node(this.id);
        }
    }


    export class DatasetNode extends Node  {
        structure: {
            path: NodeStringAttribute,
            res: NodeStringAttribute,
            mode: NodeSelectAttribute
        };
        element: NodesUIModule.DatasetNodeElement;

        constructor(data: any, app: AppModule.Application){
            super(app);
            console.log(data);

            this.structure = {
                path: {
                    title: 'path',
                    type: 'string',
                    value: data.file,
                } ,
                res: {
                    title: 'resolution',
                    type: 'string',
                    value: data.res.join("&#10005;")
                },
                mode: {
                    title: 'mode',
                    type: 'select',
                    options: ['scipy', 'c'],
                    value: 'c',
                    onchange: (value: string) => {
                        this.structure.mode.value = value
                        console.log('updated to ', value, this);
                    
                    }
                }
            }
            
            this.element = new NodesUIModule.DatasetNodeElement(this);
            this.app.ui.register_node(this.element);
        }
    }
}



