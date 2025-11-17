

class Search extends Element {
    constructor(parentDiv, objList, label){
        super(parentDiv, objList, label);
        this.maxResults = 20;
        this.left = this.createDiv(this.div, ["pane", "search"], "", undefined);
        this.right = this.createDiv(this.div, ["pane", "search", "info"], "", undefined);
        this.search = document.createElement("input");
        this.search.setAttribute("type", "text");
        this.search.setAttribute("placeholder", "search for...");
        this.search.onkeyup = (e)=>{
            this.onChange(e.target.value);
        };
        this.left.appendChild(this.search);
        this.results = this.createDiv(this.left, ["results", "list"], "", undefined);

        this.debounceTimer = undefined;
        this.doSearch("");
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
                let div = this.createDiv(this.results, ["list-item"], obj.name, ()=>{this.displayInfo(obj)});
                hits++;
            }
            if(hits + 1 > this.maxResults){
                let div = this.createDiv(this.results, ["list-item"], "...", undefined);
                break;
            }
        }
        if(hits == 0){
            this.createDiv(this.results, ["list-item"], "No results", undefined);
        }
    }
    displayInfo(obj){
        this.right.innerHTML = obj.formatInfo();
    }
}