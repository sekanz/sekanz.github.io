
        

        function doStuff(){
            //determine number of elements in category.
            var caTcount = 0
            for (var a=0; a<foodArray.length; a++){
                if (foodArray[a].category==caT){caTcount++}
            };
          
            //generate random number based on number of elements of that category in array.
            var raN = getRandomInt(0, caTcount);
           
           
            //retrieve that element based on random number above
            var fooD
            for (var b=0; b<foodArray.length; b++){
                if (foodArray[b].category==caT){
                    if (raN == 0){fooD = foodArray[b].description;
                        break;
                    }raN--;
                } 
            } 
            // go through array and compare category to caT
            //if = increase counter
            //does counter = raN
            //no continue or yes retrieve description and category for that element
           
    
            //display the element
        }