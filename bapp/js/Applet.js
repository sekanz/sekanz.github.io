

class Applet {
    constructor(){
        this.title = "none";
    }
    configure(divMaker, parentDiv, appInfo){
        this.divMaker = divMaker;
        this.appInfo = appInfo;
        this.div = this.divMaker.createDiv(parentDiv, [], "", undefined);
        this.onConfigure();
    }
    onConfigure(){}
    focus(){
        this.div.style.display = "block";
        this.onFocus();
    }
    blur(){
        this.div.style.display = "none";
        this.onBlur();
    }
    onFocus(){}
    onBlur(){}
}

class Editor extends Applet {
    constructor(list, title){
        super();
        this.title = title;
        this.list = list;
        this.maxResults = 20;
    }
    onConfigure(){
        this.buildStructure();
        this.doSearch("");
    }
    buildStructure(){
        this.toolbar = this.divMaker.createDiv(this.div, ["toolbar"], "", undefined);
        this.left = this.divMaker.createDiv(this.div, ["pane", "search"], "", undefined);
        this.right = this.divMaker.createDiv(this.div, ["pane", "info"], "", undefined);
        this.right.style.maxHeight = `${this.appInfo.height - 600}px`;
        this.setUpSearch();        
        this.results = this.divMaker.createDiv(this.left, ["results", "list"], "", undefined);
        this.results.style.maxHeight = `${this.appInfo.height - 200}px`;
    }
    setUpSearch(){
        this.search = document.createElement("input");
        this.search.setAttribute("type", "text");
        this.search.setAttribute("placeholder", "search for...");
        this.search.setAttribute("class", "tool");
        this.search.onkeyup = (e)=>{
            this.onChange(e.target.value);
        };
        this.left.appendChild(this.search);
    }
    onChange(value){
        if(this.debounceTimer != undefined){
            clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(()=>{
            this.doSearch(value);
        }, 600);
    }
    doSearch(value){
        let hits = 0;
        this.results.innerHTML = "";
        for(let i = 0; i < this.list.length; i++){
            const obj = this.list[i];
            if(obj.name.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) >= 0){
                let div = this.divMaker.createDiv(this.results, ["list-item"], obj.name, ()=>{this.displayInfo(obj)});
                hits++;
            }
            if(hits + 1 > this.maxResults){
                let div = this.divMaker.createDiv(this.results, ["list-item"], "...", undefined);
                break;
            }
        }
        if(hits == 0){
            this.divMaker.createDiv(this.results, ["list-item"], "No results", undefined);
        }
    }
    displayInfo(obj){
        this.right.innerHTML = obj.formatInfo();
    }
}