//const contextMenu = require('electron-context-menu');

module AppModule {
    export class Application {
        dm: DMModule.DataManager;
        ui: UIModule.UI;

        actions: {
            dataset_loaded: Function,
        };

        constructor() {
            this.dm = DMModule.DataManager.getInstance();
            this.dm.setupInstance((data) => { this.on_data(data) });
            this.ui = new UIModule.UI(this);

            //assign actions
            this.actions = {
                dataset_loaded: this.dataset_loaded
            };

            this.ui.setup_load();
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
                switch((data.action as string)){
                    case "dataset_loaded":
                        this.actions.dataset_loaded(data);
                        break;
                }
            }

        }

        //arrow functions to allow for 'this' inside them
        dataset_loaded = (data: any) => {
            console.log(this);
            this.ui.setup_viewer();
        }
    }
}
