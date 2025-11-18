

class MealMaker extends ObjectEditor {
    constructor(parentDiv, list, label){
        super(parentDiv, list, label);
        this.createBtn = this.createDiv(this.toolbar, ["btn"], "Create", (e)=>{this.createMeals();});
        
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