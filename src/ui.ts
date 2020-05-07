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
        onclick?: (e: MouseEvent) => void;
        onmouseenter?: (e: MouseEvent) => void;
        onmouseleave?: (e: MouseEvent) => void;
    }

    interface ImgInterface {
        src: string;
        alt: string;
        id?: string;
        class?: string | Array<string>;
    }


    interface SelectInterface {
        values: Array<string | number>;
        default: string | number;
        onchange: (e: Event) => void;
        id?: string;
        class?: string | Array<string>;
    }

    export function div(options?: DivInterface) {
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

        if (options.onclick) {
            e.onclick = options.onclick;
        }

        if (options.onmouseenter && options.onmouseleave)
        {
            e.onmouseenter = options.onmouseenter;
            e.onmouseleave = options.onmouseleave;

        }

        return e;
    }

    export function select(options: SelectInterface)
    {   
        let e = document.createElement("select");

        for(let o of options.values)
        {
            let v = document.createElement("option");
            v.value = o.toString();
            v.innerHTML = o.toString();

            e.appendChild(v);
        }

        if (options.class) {
            if (Array.isArray(options.class))
                for (let c of options.class)
                    e.classList.add(c);
            else
                e.classList.add(options.class);
        }

        e.onchange = options.onchange;

        return e;
    }   

    export function img(options: ImgInterface) {
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


    function open_dataset(app: AppModule.Application){
        dialog.showOpenDialog({
            properties: ['openFile']
        }).then((result: any) => {
            if (!result.canceled) {
                let file = result.filePaths[0]

                //todo some fancy loading stuff

                app.load_file(file);
            }
        }).catch((err: any) => {
            console.log(err);
        })
    }

    interface MenuOption{
        title: string;
        call: () => void;
    }

    interface ErrorOption{
        title: string;
        call: () => void;
    }


    export class UI {
        status: string;
        app: AppModule.Application;
        body: HTMLElement;
        
        sideBar: HTMLElement;
        detail: HTMLElement;
        tools: HTMLElement;
        canvas: HTMLElement;
        main: Element;

        nodes: { [key: string] : NodesUIModule.NodeElement };
        detailID: string; 

        constructor(app: AppModule.Application) {
            this.status = 'loading';
            this.app = app;
            this.nodes = {};
        }

        setup_viewer() {
            //init view only if the project is new
            if (this.status === 'viewer')
                return;

            this.clear();
            this.status = 'viewer';

            this.sideBar = div({
                id: 'sidebar'
            });

            this.tools = div({
                id: 'tools',
                child: [
                    div({
                        class: 'tools-icon',
                        html: 'add node',
                        onclick: (e) => {
                            console.log(e.srcElement);

                            let rect = (e.srcElement as HTMLElement).getBoundingClientRect();

                            this.context_menu(e, [
                                {
                                    title: 'dataset',
                                    call: () => {
                                        open_dataset(this.app);
                                    }
                                }
                            ], rect.right + 5, rect.top); 
                        }
                    })
                ]
            });

            this.canvas = document.createElement('canvas');
            this.canvas.id = '3d';

            this.main = div({
                id: 'main'
            });

            this.detail = div({
                id: 'detail'
            });

            this.body.appendChild(this.main);
            this.main.appendChild(this.sideBar);
            this.main.appendChild(this.detail);
            this.main.appendChild(this.tools);
            this.main.appendChild(this.canvas);

            this.body.onresize = this.resize;
        }

        setup_splash() {
            this.body = document.getElementsByTagName("body")[0];
            this.body.innerHTML = '';
            let dropArea = document.createElement("div");
            dropArea.id = "loading-drop-area";

            let splash = new SplashModule.SplashScreen(this.app);
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
                ]
            })

            //update options according to status
            switch((this.status as string)){
                case "loading":
                    this.clear();
                    options = [
                        {
                            title: "Back to Splash",
                            call: () => {
                                this.setup_splash();
                            }
                        },
                        {
                            title: "Dismiss",
                            call: () => {
                                this.setup_viewer();
                            }
                        }
                    ]
                    break;
                default:
                    if (options)
                        options.push({
                            title: 'Dismiss',
                            call: () => {}
                        })
                    else 
                       options = [{
                                    title: 'Dismiss',
                                    call: () => { }
                                   }];
            }


            let optionsElem = div({
                id: "error-options"
            });


            for (let o of options)
            {
                let option = div({
                    class: "error-option",
                    html: o.title
                });

                option.onclick = () => {
                    this.body.removeChild(error);
                    o.call();
                }

                optionsElem.appendChild(option);
                
            }

            error.appendChild(optionsElem);       
            this.body.appendChild(error);
        }


        register_node(node: NodesUIModule.NodeElement){
            this.nodes[node.id] = node;
            this.sideBar.appendChild(node.html);

            node.html.onmousedown = (e) => {
                if (e.button == 2)
                    this.context_menu(e, node.context_options);
            }

            node.html.onclick = (e) => {
                this.node_detail(node);
            }
        }

        unregister_node(nodeID: string){
            if (nodeID in this.nodes)
            {
                let elem = document.getElementById(nodeID);
                this.sideBar.removeChild(elem);
                delete this.nodes[nodeID];
            }

            if (nodeID == this.detailID)
                this.detail.innerHTML = '';
            else 
                this.node_detail(this.nodes[this.detailID])
        }

        node_detail(node: NodesUIModule.NodeElement) {
            console.log('detail', node.id);

            this.detail.innerHTML = '';
            this.detail.appendChild(node.detail);
            this.detailID = node.id;
        }


        context_menu(e: MouseEvent, options: Array<MenuOption>, x?: number, y?: number)
        {
            let wall = div({
                id: 'wall'
            });

            let menu = div({
                id: 'context-menu'
            });

            
            for(let option of options)
            {
                let html = div({
                    class: 'menu-option',
                    html: option.title
                });
                
                html.onclick = () => {
                    option.call();
                    this.body.removeChild(wall);
                    this.body.removeChild(menu);
                }
                
                menu.appendChild(html);
            }
            
            menu.style.visibility = 'hidden';
            menu.style.position = 'absolute';
            
            this.body.appendChild(wall);
            this.body.appendChild(menu);
            
            //dimensions
            let width = menu.offsetWidth;
            let bw = this.body.offsetWidth;
            let height = menu.offsetHeight;
            let bh = this.body.offsetHeight;

            //positions
            let posx = x ? x : e.x;
            let posy = y ? y : e.y;
            if (e.x + width > bw)
                posx -= width;

            if (e.y + height > bh)
                posy -= height;


            menu.style.left = posx + 'px';
            menu.style.top = posy + 'px';
            menu.style.visibility = 'visible';

            wall.onmousedown = () => {
                this.body.removeChild(menu);
                this.body.removeChild(wall);
            }

            console.log(width, height);
            //menu.style.top = this.body.style.width
        }

        close_context_menu() {
            let menu = document.getElementById("context-menu");
            let wall = document.getElementById("wall");

            if (menu) {
                this.body.removeChild(wall);
                this.body.removeChild(menu);
            }
        }
        
        resize = () => {
            this.close_context_menu();
        }
    }



}


