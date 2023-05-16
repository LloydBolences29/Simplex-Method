$(function(){
    var cj = [0,0];
    var objFunctionValues = [];
    var S1constraintA = [];
    var S2constraintB = [];
    var zj = [];
    var cJzJ = [];
    var isSolve = false;

    var pivotVariables = ['A', 'B'];
    var solutionMixVar = ['S1','S2'];


    var pivotColumn = 0;
    var pivotRow = '';
    var pivotIndex = 0;
    var pivot = 0;

    var counterForTest = 0;
    var bolTest = false;


    ///

    const initializeData = () => {
        let objA = parseInt($('#objA').val());
        let objB = parseInt($('#objB').val());

        let slack1A = parseInt($('#s1A').val());
        let slack1B = parseInt($('#s1B').val());
        let slack1Quantity = parseInt($('#s1Quantity').val());

        let slack2A = parseInt($('#s2A').val());
        let slack2B = parseInt($('#s2B').val());
        let slack2Quantity = parseInt($('#s2Quantity').val());


        objFunctionValues = [objA, objB, 0, 0];
        S1constraintA = [slack1A, slack1B, 1, 0, slack1Quantity];
        S2constraintB = [slack2A, slack2B, 0, 1, slack2Quantity];


    }

    $('#create-table-btn').on('click', function(){

        $('#exampleModal').modal('hide');

        //recieve data here.

        initializeData();

        //initial table
        computeZj();
        computeCjMinusZj();
        createTable();
        checkOptimalSolution();

        
        //second table
        
        getPivotColumn();
        console.log(`Pivotal Column: ${pivotColumn}`);
        console.log(`Getting pivotal column is done..`);
        getPivotRow();
        console.log(`Pivotal Row: ${pivotRow}`);
        console.log(`Getting pivotal row is done..`);
        console.log(`Pivot: ${pivot}`);
        console.log(`Getting pivot row is done..`);
        computeZj();
        computeCjMinusZj();
        zj = [0,0,0,0,0];
        createTable();
        checkOptimalSolution();

    });

    const createTable = () => {

        var $table = $('<table style="width:100%;" class="table">');

        var $tbody = $('<tbody>');
        //rows 
        var $row1 = $('<tr>');
        var $row2 = $('<tr>');
        var $row3 = $('<tr>');
        var $row4 = $('<tr>');
        var $row5 = $('<tr>');
        var $row6 = $('<tr>');

        $row1.append($('<td>').text('PROFIT PER UNIT COLUMN'));
        $row1.append($('<td>').text('PRODUCTION MIX COLUMN'));
        $row1.append($('<td colspan="2">').text('REAL VARIABLES COLUMN'));
        $row1.append($('<td colspan="2">').text('SLACK VARIABLES COLUMN'));
        $row1.append($('<td>').text('CONSTANT COLUMN'));

        $row2.append($('<td>').text('Cj'));
        $row2.append($('<td>').text('Solution Mix'));
        $row2.append($('<td>').html("$ "+ objFunctionValues[0] +" <br/>" + pivotVariables[0]));
        $row2.append($('<td>').html("$ "+ objFunctionValues[1] +" <br/>" + pivotVariables[1]));
        $row2.append($('<td>').html("$ "+ objFunctionValues[2] +" <br/>S1"));
        $row2.append($('<td>').html("$ "+ objFunctionValues[3] +" <br/>S2"));
        $row2.append($('<td>').text('Quantity'));

        $row3.append($('<td>').text(`$ ${cj[0]}`));
        $row3.append($('<td>').text(`${solutionMixVar[0]}`));
        $row3.append($('<td>').html(`${S1constraintA[0]}`));
        $row3.append($('<td>').html(`${S1constraintA[1]}`));
        $row3.append($('<td>').html(`${S1constraintA[2]}`));
        $row3.append($('<td>').html(`${S1constraintA[3]}`));
        $row3.append($('<td>').text(`${S1constraintA[4]}`));

        $row4.append($('<td>').text(`$ ${cj[1]}`));
        $row4.append($('<td>').text(`${solutionMixVar[1]}`));
        $row4.append($('<td>').html(`${S2constraintB[0]}`));
        $row4.append($('<td>').html(`${S2constraintB[1]}`));
        $row4.append($('<td>').html(`${S2constraintB[2]}`));
        $row4.append($('<td>').html(`${S2constraintB[3]}`));
        $row4.append($('<td>').text(`${S2constraintB[4]}`));

        //zj
        $row5.append($('<td>').text(''));
        $row5.append($('<td>').text(`Zj`));
        $row5.append($('<td>').html(`${zj[0]}`));
        $row5.append($('<td>').html(`${zj[1]}`));
        $row5.append($('<td>').html(`${zj[2]}`));
        $row5.append($('<td>').html(`${zj[3]}`));
        $row5.append($('<td>').text(`${zj[4]}`));

        //cj - zj
        $row6.append($('<td>').text(''));
        $row6.append($('<td>').text('Cj - Zj'));
        $row6.append($('<td>').html(`${cJzJ[0]}`));
        $row6.append($('<td>').html(`${cJzJ[1]}`));
        $row6.append($('<td>').html(`${cJzJ[2]}`));
        $row6.append($('<td>').html(`${cJzJ[3]}`));
        $row6.append($('<td>').text(''));

        $tbody.append($row1);
        $tbody.append($row2);
        $tbody.append($row3);
        $tbody.append($row4);
        $tbody.append($row5);
        $tbody.append($row6);
        $table.append($tbody);

        // Add the table to the container element
        $('.table-container').append($table);
    }

    const computeZj = () => {
        let tmp_slack1 = [];
        let tmp_slack2 = [];

        for (let index = 0; index < S1constraintA.length; index++) {
            tmp_slack1[index] = cj[0] * S1constraintA[index];
            tmp_slack2[index] = cj[1] * S2constraintB[index];
        }

        for (let index = 0; index < 5; index++) {
            zj[index] = tmp_slack1[index] + tmp_slack2[index];
        }

    }

    const computeCjMinusZj = () => {

        for (let index = 0; index < objFunctionValues.length; index++) {
            cJzJ[index] = objFunctionValues[index] - zj[index];
        }
    }

    //step 7
    const getPivotColumn = () => {
        let maxPositiveNumber = 0;

        for (let i = 0; i < cJzJ.length; i++) {
            if (cJzJ[i] > maxPositiveNumber) {
              maxPositiveNumber = cJzJ[i];
            }
        }

        pivotColumn = maxPositiveNumber;
    }

    // //step 8
    const getPivotRow = () => {
        let pivotalIntersection = cJzJ.indexOf(pivotColumn);
        

        let slack_row1 = S1constraintA[4] / S1constraintA[0];
        let slack_row2 = S2constraintB[4] / S2constraintB[0];


        if(slack_row1 < slack_row2){
            pivotRow = 'Slack 1';
            pivot = S1constraintA[pivotalIntersection];
            pivotIndex = pivotalIntersection;
            //step 9
            solutionMixVar[pivotalIntersection] = pivotVariables[pivotalIntersection];
            cj[pivotalIntersection] = objFunctionValues[pivotalIntersection];
            console.log('Step 9 has been executed.');

            //step 10
            for (let index = 0; index < S1constraintA.length; index++) {
                S1constraintA[index] = S1constraintA[index] / pivot; 
            }
            console.log('Step 10 has been executed.');
            
            let tmpA = [];

            //step 11
            for (let i = 0; i < S2constraintB.length; i++) {
                tmpA[i] = (-Math.abs(S2constraintB[pivotalIntersection]) * S1constraintA[i]) + S2constraintB[i]; 
            }

            S2constraintB = tmpA;
            console.log('Step 11 has been executed.');

        }else{
            pivotRow = 'Slack 2';
            pivot = S1constraintA[pivotalIntersection];
            pivotIndex = pivotalIntersection;
            //step 9
            solutionMixVar[pivotalIntersection] = pivotVariables[pivotalIntersection];
            cj[pivotalIntersection] = objFunctionValues[pivotalIntersection];
            console.log('Step 9 has been executed.');

            //step 10
            for (let index = 0; index < S2constraintB.length; index++) {
                S1constraintA[index] = S1constraintA[index] / pivot; 
            }
            console.log('Step 10 has been executed.');

            let tmpB = [];
            //step 11
            for (let index = 0; index < S1constraintA.length; index++) {
                tmpB[index] = (-Math.abs(S1constraintA[pivotalIntersection]) * S2constraintB[index]) + S1constraintA[index];
            }
            S1constraintA = tmpB;
            console.log('Step 11 has been executed.');
        }
    }

    const checkOptimalSolution = () => {
        let isAllElementsLowerOrEqualToZero = cJzJ.map(cj => cj <= 0).every(Boolean);

        if(isAllElementsLowerOrEqualToZero == true){
            isSolve = true;
        }else{
            isSolve = false;
        }
    }
});
