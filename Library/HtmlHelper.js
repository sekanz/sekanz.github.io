
	
function createButton(parentDiv){
	let btn = createHtmlElement(parentDiv, "input");
	btn.setAttribute("type", "button");
	return btn;
}

function createHtmlElement(parentDiv, type){
	let div = document.createElement(type);
	parentDiv.appendChild(div);
	return div;
}

let www = 0;
class Tile {
	constructor(width, height){
		this.id = www++;
		this.width = width;
		this.height = height;
		this.text = "";
		this.div;
	}
	updateContent(text){
		this.text = text;
		this.div.innerHTML = this.text;
	}
}

class TileDisplay {
	constructor(parentDiv){
		this.parentDiv = parentDiv;
		this.tiles = [];
	}
	addTile(tile){
		tile.div = createHtmlElement(this.parentDiv, "div");
		tile.updateContent("hello");
		tile.div.style.display = "inline-block";
		tile.div.style.height = `${tile.height}px`;
		tile.div.style.width = `${tile.width}px`;
		tile.div.style.backgroundColor = `#444`;
		tile.div.style.margin = `4px`;
		tile.div.style.padding = `2px`;
		tile.div.style.textAlign = `center`;		
		tile.div.style.userSelect = `none`;		
		tile.div.style.cursor = `pointer`;
		tile.div.style.border = "1px solid black";

		tile.div.onmouseover = ()=>{
			tile.div.style.border = `1px solid white`;};
		tile.div.onmouseout = ()=>{
			tile.div.style.border = `1px solid black`;
		};
		tile.div.onclick = ()=>{
			console.log(tile.id);
		}
	}
}