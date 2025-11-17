

class MealMaker extends Element {
    constructor(parentDiv, list, label){
        super(parentDiv, list, label);
        this.left = this.createDiv(this.div, ["pane", "search"], "", undefined);
        this.right = this.createDiv(this.div, ["pane", "search", "info"], "", undefined);
        this.createBtn = this.createDiv(this.div, ["btn"], "Create", (e)=>{this.createMeals();});
        this.left.appendChild(this.createBtn);
        this.results = this.createDiv(this.left, ["results", "list"], "", undefined);
    }
    createMeals(){
        const entree = entrees[getRandBetween(0, entrees.length)];
        const meal = new Meal();
        meal.entrees.push(entree);
        this.list.push(meal);
        this.displayList();
    }
    displayList(){
        this.results.innerHTML = "";
        for(let i = 0; i < this.list.length; i++){
            const meal = this.list[i];
            this.createDiv(this.results, ["list-item"], meal.entrees[0].name, ()=>{this.showMeal(meal)});
        }
    }
    showMeal(meal){
        this.right.innerHTML = meal.formatInfo();
    }
}