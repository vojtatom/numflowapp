
module SplashModule {
    let div = UIModule.div; 
    let img = UIModule.img; 

    const { dialog } = require('electron').remote;

    export class SplashScreen {
        div: Element;
        bottom: Element;
        app: AppModule.Application;

        constructor(app: AppModule.Application) {
            this.app = app;
        }

        loadingBottom(fileName: string)
        {
            return div({
                id: "splash-loading",
                html: "loading",
                child: div({
                    id: "splash-loading-filename",
                    html: fileName
                })
            });
        }

        selectMenu()
        {
            let open_dataset = div({
                id: "splash-open",
                class: "splash-option",
                child: [
                    img({
                        src: "assets/file.svg",
                        alt: "",
                        class: "icon"
                    }),
                        div({
                        html: "open dataset",
                        class: "option"
                    }),
                ]
            });

            open_dataset.onclick = () => {
                dialog.showOpenDialog({
                    properties: ['openFile']
                }).then((result: any) => {
                    if (!result.canceled) {
                        //file selected okay
                        let file = result.filePaths[0]
                        this.bottom.innerHTML = "";
                        this.bottom.appendChild(this.loadingBottom(file));
                        this.app.load_file(file);
                    }
                }).catch((err: any) => {
                    console.log(err);
                })
            };

            let open_visualization = div({
                id: "splash-open",
                class: "splash-option",
                child: [
                    img({
                        src: "assets/3d.svg",
                        alt: "",
                        class: "icon"
                    }),
                    div({
                        html: "open visualization",
                        class: "option"
                    }),
                ]
            });

            return div({
                child: [
                    div({
                        id: "splash-title",
                        child: [
                            div({
                                class: "title",
                                html: "numflow"
                            }),
                            div({
                                class: "description",
                                html: "vector field visualization app"
                            })
                        ]
                    }),
                    open_dataset,
                    open_visualization
                ]
            });
        }

        get html() {
            let canvasDiv = div({
                id: "splash-animation"
            });

            this.bottom = this.selectMenu();

            this.div = div({
                id: "splash-screen",
                child: [
                    canvasDiv,
                    this.bottom
                ]
            });

            createLoadScreen(canvasDiv);

            return this.div;
        }

    }

}