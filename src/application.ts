//const contextMenu = require('electron-context-menu');

module AppModule {
    // `keyof any` is short for "string | number | symbol"
    // since an object key can be any of those types, our key can too
    // in TS 3.0+, putting just "string" raises an error
    function hasKey<O>(obj: O, key: keyof any): key is keyof O {
        return key in obj
    }
    
    export class Application {
        dm: DMModule.DataManager;
        ui: UIModule.UI;
        nodes: { [key: string]: Nodes.Node };
        graphics: GraphicsModule.Graphics;

        actions: {
            dataset_loaded: Function,
        };


        constructor() {
            this.dm = DMModule.DataManager.getInstance();
            this.dm.setupInstance((data) => { this.on_data(data) });
            this.ui = new UIModule.UI(this);
            this.graphics = new GraphicsModule.Graphics();

            //assign actions
            this.actions = {
                dataset_loaded: this.dataset_loaded
            };

            this.ui.setup_splash();
            this.nodes = {};

            //for faster debuging
            this.load_file('/home/vojtatom/Documents/projects/numflow/numflow/test.csv');
        }
        
        load_file(file_path: string) {
            this.dm.send({
                command: 'open',
                filename: file_path
            });
        }
        
        
        on_data(data: any) {
            console.log(data);
            console.log(this);
            
            if (data.status == "error") {
                this.ui.error(data.message);
            } else if (data.status == "okay") {
                const action = data.action;

                if (hasKey(this.actions, action))
                    this.actions[action](data);
                else
                    console.error("got unknown message", data);
            }

        }

        //arrow functions to allow for 'this' inside them
        dataset_loaded = (data: any) => {
            console.log(this);
            this.ui.setup_viewer(); //possible app initialization

            //add node
            let dataset = new Nodes.DatasetNode(data, this);
            this.nodes[dataset.id] = dataset;
            

            console.log(this.nodes);
        }



        remove_node(nodeID: string){
            if (nodeID in this.nodes){
                delete this.nodes[nodeID];
            }
        }
    }
}
