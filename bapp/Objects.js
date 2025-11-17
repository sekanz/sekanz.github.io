

class Element {
    constructor(parentDiv, list, label){
        this.list = list;
        this.div = this.createDiv(parentDiv, ["widget"], "", undefined);
        this.div.innerHTML = `<div>${label}</div>`;
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
    displayInfo(obj){ }
}

class Thing {
    constructor(){
        this.name = "no name";
    }
    formatInfo(){
        return this.name;
    }
}

class Food extends Thing {
    constructor(id, name, type, size, unit, weight, nutrients){
        super();
        this.id = id;
        this.name = name;
        this.type = type;
        this.size = size;
        this.unit = unit;
        this.weight = weight;
        this.nutrients = [];
        this.processNutrients(nutrients);
    }
    processNutrients(values){
        for(let i = 0; i < values.length; i++){
            this.nutrients.push({name: nutrients[i][0], amount: parseInt(values[i]), z: nutrients[i][1]});
        }
        this.nutrients.sort((a,b)=>{
            if(a.z + (a.amount / 1000) < b.z + (b.amount / 1000)){return 1}
            return -1;
        });
    }
    formatInfo(){
        let txt = `${this.name}`;
        txt += `<br>${this.id}`;
        txt += `<hr>${this.type}`;
        txt += `<br>${this.size} ${this.unit}`;
        txt += `<div class="list nutrients">`;
        for(let i = 0; i < this.nutrients.length; i++){
            txt += `${this.nutrients[i].name}: ${this.nutrients[i].amount}<br>`;
        }
        txt += "</div>";
        return txt;
    }
}

class Entree extends Thing {
    constructor(id, name, type, size, unit, ingredients){
        super();
        this.id = id;
        this.name = name;
        this.type = type;
        this.size = size;
        this.unit = unit;
        this.ingredients = [];
        this.nutrients = undefined;
        this.gatherIndredients(ingredients);
    }
    gatherIndredients(ingredients){
        let nutrients = [];
        for(let i = 0; i < ingredients.length; i++){
            let food = getFoodById(ingredients[i][0]);
            this.ingredients.push({food: food, amount: ingredients[i][1]});
            
            for (var n = 0; n < food.nutrients.length; n++){
                this.addNutrient(nutrients, food.nutrients[n].name, food.nutrients[n].amount);
            }
        }
        this.nutrients = nutrients;
        this.nutrients.sort((a,b)=>{
            if(a.name > b.name){return 1}
            return -1;
        });
    }
    addNutrient(list, nutrient, amount){
        for(let i = 0; i < list.length; i++){
            if(list[i].name == nutrient){
                list[i].amount += amount;
                return;
            }
        }
        list.push({name: nutrient, amount: amount});
    }
    formatInfo(){
        let txt = `${this.name}`;
        txt += `<div class="list nutrients">`;
        for(let i = 0; i < this.ingredients.length; i++){
            let ingredient = this.ingredients[i];
            txt += `${ingredient.amount * ingredient.food.size}${ingredient.food.unit} ${ingredient.food.name}<br>`;
        }
        txt += "</div>";
        txt += `<div class="list nutrients">`;
        for(let i = 0; i < this.nutrients.length; i++){
            txt += `<br>${this.nutrients[i].name}: ${this.nutrients[i].amount}`;
        }
        txt += "</div>";        
        return txt;
    }
}

class Meal {
    constructor(){
        this.entrees = [];
    }
    formatInfo(){
        let txt = `<div class="list nutrients">`;
        for(let i = 0; i < this.entrees.length; i++){
            let entree = this.entrees[i];
            txt += `${entree.name}<br>`;
        }
        txt += "</div>";     
        return txt;
    }
}

function getFoodByName(name){
    for(let i = 0; i < foods.length; i++){
        if(foods[i].name == name){
            return foods[i];
        }
    }
}

function getFoodById(id){
    for(let i = 0; i < foods.length; i++){
        if(foods[i].id == id){
            return foods[i];
        }
    }
}