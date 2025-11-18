

class Applet {
    constructor(){
        this.title = "none";
    }
    configure(divMaker, parentDiv){
        this.divMaker = divMaker;
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
    constructor(){
        super();
        this.title = "Editor";
    }
    onConfigure(){
        this.div.innerText = "hi";
    }
}