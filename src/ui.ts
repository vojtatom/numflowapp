/*
UI status:
viewer
loading

*/
module UIModule {
    interface DivInterface {
        id?: string;
        html?: string;
        class?: string | Array<string>;
        child?: Element | Array<Element>;
    }

    interface ImgInterface {
        src: string;
        alt: string;
        id?: string;
        class?: string | Array<string>;
    }

    function div(options?: DivInterface) {
        let e = document.createElement("div");

        if (!options)
            return e;

        if (options.id)
            e.id = options.id;

        if (options.html)
            e.innerHTML = options.html;

        if (options.class) {
            if (Array.isArray(options.class))
                for (let c of options.class)
                    e.classList.add(c);
            else
                e.classList.add(options.class);
        }

        if (options.child) {
            if (Array.isArray(options.child))
                for (let c of options.child)
                    e.appendChild(c);
            else
                e.appendChild(options.child);
        }
        return e;
    }

    function img(options: ImgInterface) {
        let e = document.createElement("img");

        e.src = options.src;
        e.alt = options.alt;

        if (options.id)
            e.id = options.id;

        if (options.class) {
            if (Array.isArray(options.class))
                for (let c of options.class)
                    e.classList.add(c);
            else
                e.classList.add(options.class);
        }
        return e;
    }

    const { dialog } = require('electron').remote;

    class SplashScreen {
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

    interface ErrorOption{
        title: string;
        call: () => void;
    }



    export class UI {
        status: string;
        app: AppModule.Application;
        body: Element;

        constructor(app: AppModule.Application) {
            this.status = 'loading';
            this.app = app
        }

        setup_viewer() {
            this.clear();
            this.status = 'viewer';


        }

        setup_load() {
            this.body = document.getElementsByTagName("body")[0];
            this.body.innerHTML = '';
            let dropArea = document.createElement("div");
            dropArea.id = "loading-drop-area";

            let splash = new SplashScreen(this.app);
            let splash_html = splash.html;

            dropArea.ondragover = (e) => {
                e.preventDefault();
                console.log("dragging");
            }

            dropArea.ondragenter = (e) => {
                e.preventDefault();
                console.log("dragging on");
            }

            dropArea.ondragleave = (e) => {
                e.preventDefault();
                console.log("dragging off");
            }

            dropArea.ondrop = (e) => {
                e.preventDefault();
                let file = e.dataTransfer.files[0];
                let path = (file as any).path;
                console.log(path);
                this.app.load_file(path);
            }

            dropArea.appendChild(splash_html);
            this.body.appendChild(dropArea);
        }

        clear()
        {
            if (this.status === "loading")
            {
                stopLoadScreen();
            }

            this.body.innerHTML = "";
        }

        error(message: string, options?: Array<ErrorOption>) {
            //update according to status
            switch((this.status as string)){
                case "loading":
                    this.clear();
                    options = [
                        {
                            title: "Back",
                            call: () => {
                                this.setup_load();
                            }
                        }
                    ]
                    break;
            }

            let optionsElem = div({
                id: "error-options"
            });

            //error options
            if (options)
            {
                for (let o of options)
                {
                    let option = div({
                        class: "error-option",
                        html: o.title
                    });
                    option.onclick = o.call;
                    optionsElem.appendChild(option);
                }
            }

            //close option on error
            let closeOption = div({
                class: "error-option",
                html: "Dismiss"
            });
            optionsElem.appendChild(closeOption);
            
            let error = div({
                id: "error",
                child: [
                    div({
                        id: "error-header",
                        html: "Error"
                    }),
                    div({
                        id: "error-message",
                        html: message
                    }),
                    optionsElem
                ]
            })
            
            closeOption.onclick = () => {this.body.removeChild(error)};    
                
            this.body.appendChild(error);
        }
    }
}


