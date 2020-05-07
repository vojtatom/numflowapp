

module Nodes {
    export class Node {
        element: NodesUIModule.NodeElement;
        graphics: GraphicsModule.Graphics;
        app: AppModule.Application

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
        res: [number, number, number];
        path: string;
        mode: string;
        element: NodesUIModule.DatasetNodeElement;

        constructor(data: any, app: AppModule.Application){
            super(app);

            this.path = data.file;
            this.res = data.res;
            this.mode = data.mode;
            
            this.element = new NodesUIModule.DatasetNodeElement(this);
            this.app.ui.register_node(this.element);
        }
    }
}



