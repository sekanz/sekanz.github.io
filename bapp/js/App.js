

class DivMaker {
    constructor(){

    }
    createDiv(parentDiv, classNames, content, clickFunc){
        let div = document.createElement("div");
        div.innerText = content;
        for(let i = 0; i < classNames.length; i++){
            div.classList.add(classNames[i]);
        }
        div.onclick = clickFunc;
        parentDiv.appendChild(div);
        return div;
    }
}

class App {
    constructor(parentDiv){
        this.activeApp = undefined;
        this.activeTabDiv = undefined;
    }
    configure(divMaker, parentDiv){
        this.divMaker = divMaker;
        this.tabs = this.divMaker.createDiv(parentDiv, ["tabs"], "", undefined);
        this.body = this.divMaker.createDiv(parentDiv, ["app"], "", undefined);

        this.sizeWindow();
        this.initApps();
    }
    sizeWindow(){
        let width = window.innerWidth;
        let height = window.innerHeight;
        this.body.style.width = `${Math.floor(width *.92)}px`;        
        this.body.style.height = `${Math.floor(height *.8)}px`;
        this.tabs.style.width = `${Math.floor(width *.92)}px`;
    }
    initApps(){
        this.createTab(new Editor());
        this.createTab(new Applet());
        //applet.configure(this.divMaker, this.body);

        return;
        const editor = new ObjectEditor(this.body, [new Thing(), new Thing()], "Template");
        const mealMaker = new MealMaker(this.body, meals, "Meals");
        const entreeSearch = new Search(this.body, entrees, "Entrees");
        const ingredientSearch = new Search(this.body, foods, "Foods");
    }
    createTab(app){
        let tab = this.divMaker.createDiv(this.tabs, ["tab"], app.title, (e)=>{
            this.clickTab(e.target, app)});
        app.configure(this.divMaker, this.body);
        if(this.activeApp == undefined){
            this.activeApp = app;
            this.activeTabDiv = tab;
            this.focus(tab, app);
        }else{
            this.blur(tab, app);
        }
    }
    clickTab(tabDiv, app){
        if(this.activeApp == app){
            return;
        }
        this.blur(this.activeTabDiv, this.activeApp);
        this.activeTabDiv = tabDiv;
        this.activeApp = app;
        this.focus(this.activeTabDiv, this.activeApp);
    }
    focus(tabDiv, app){
        app.focus();
        tabDiv.classList.remove("inactive");
        tabDiv.classList.add("active");
    }
    blur(tabDiv, app){
        app.blur();
        tabDiv.classList.remove("active");
        tabDiv.classList.add("inactive");
    }
}