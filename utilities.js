

    function addDiv(parent, content, style){
        let div = document.createElement("div");
        div.innerText = content;
        if(style != undefined)
            div.setAttribute("class", style);
        parent.appendChild(div);
    }

    function emptyChildren(parent){
        while(parent.children.length > 0){
            parent.removeChild(parent.children[0]);
        }
    }