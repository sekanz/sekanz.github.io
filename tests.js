

    function runAllTests(){
        getNumberData_HasCorrectStartValue();
        getNumberData_HasCorrectLength();
        getNumberData_HasCorrectRunningTotal();
        evaluateNumber_CorrectlyEvaluatesMultipleOfThree();
        evaluateNumber_CorrectlyEvaluatesMultipleOfFive();
        evaluateNumber_CorrectlyEvaluatesMultipleOfThreeAndFive();
        evaluateNumber_FormatsMultipleOfThree();
    }


    function getNumberData_HasCorrectStartValue(){
        // arrange
        let start = 1;
        let end = 9;
        let actual = evaluateNumberAsMultiple(start).value;

        // act
        let result = getNumberData(start, end);

        // assert
        if(result.listOfNumbers.length > 0
            && result.listOfNumbers[0].value == actual){
            console.log("Test passed.");
            return;
        }
        console.error("Test failed.");
    }

    function getNumberData_HasCorrectLength(){
        let result = getNumberData(1,9);
        if(result.listOfNumbers.length == 9){
            console.log("Test passed.");
            return;
        }
        console.error("Test failed.");
    }

    function getNumberData_HasCorrectRunningTotal(){
        let result = getNumberData(1,27);
        if(result.runningTotal == 7+14+21){
            console.log("Test passed.");
            return;
        }
        console.error("Test failed.");
    }
   

    function evaluateNumber_CorrectlyEvaluatesMultipleOfThree(){
        let result = evaluateNumberAsMultiple(9);
        if(result.value == MULTIPLE_OF_THREE_TEXT){
            console.log("Test passed.");
            return;
        }
        console.error("Test failed.");
    }

    function evaluateNumber_CorrectlyEvaluatesMultipleOfFive(){
        let result = evaluateNumberAsMultiple(50);
        if(result.value == MULTIPLE_OF_FIVE_TEXT){
            console.log("Test passed.");
            return;
        }
        console.error("Test failed.");
    }

    function evaluateNumber_CorrectlyEvaluatesMultipleOfThreeAndFive(){
        let result = evaluateNumberAsMultiple(30);
        if(result.value == MULTIPLE_OF_BOTH_TEXT){
            console.log("Test passed.");
            return;
        }
        console.error("Test failed.");
    }
    
    function evaluateNumber_FormatsMultipleOfThree(){
        let result = evaluateNumberAsMultiple(66);
        if(result.style == MULTIPLE_OF_THREE_STYLE){
            console.log("Test passed.");
            return;
        }
        console.error("Test failed.");
    }