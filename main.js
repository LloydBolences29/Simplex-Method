
//table reference
var content = document.getElementById("contentDiv");

var isOptimalSolution = false;

var cjVal = [0,0];
var objFuncValue = [];
var constrainValuesS1 = [];
var constrainValuesS2 = [];
var zjValues = [];
var CjZjValues = [];

var counter = 0;

var pivot = 0;
var pivotRow = '';


function createTable(){
    content.innerHTML = '<table style="width:100%;" class="table table-bordered">'+
                            this.headerOne() +
                            this.headerTwo(objFuncValue[0], objFuncValue[1]) +
                            this.constraintEquationRow()+
                        '</table>';
}

function headerOne(){
    return '<tr>'+
            '<td>PROFIT PER UNIT</td>'+
            '<td>PRODUCTION MIX COLUMN</td>'+
            '<td colspan="2">REAL VARIABLES COLUMN</td>'+
            '<td colspan="2">SLACK VARIABLES COLUMN</td>'+
            '<td>CONSTANT COLUMN</td>'+
           '</tr>';
}

function headerTwo(val1,val2, s1 = 0, s2 = 0){
    return '<tr>'+
           '<td>Cj</td>'+
           '<td>SOLUTION MIX</td>'+
           '<td>'+
           '<span id="">$'+ val1 +'</span></br>'+
           '<span id="">A</span>'+
           '</td>'+
           '<td>'+
           '<span id="">$'+ val2 +'</span></br>'+
           '<span id="">B</span>'+
           '</td>'+
           '<td>'+
           '<span id="">$'+s1+'</span></br>'+
           '<span id="">S1</span>'+
           '</td>'+
           '<td>'+
           '<span id="">$'+ s2 +'</span></br>'+
           '<span id="">S2</span>'+
           '</td>'+
           '<td>QUANTITY</td>'+
           '</tr>';
}

function constraintEquationRow(){
    return '<tr>'+
            '<td><span id="cjS1">$'+ cjVal[0] +'</span></td>'+
            '<td><span id="slS1">S1</span></td>'+
            '<td>'+ constrainValuesS1[0] +'</td>'+
            '<td>'+ constrainValuesS1[1] +'</td>'+
            '<td>'+ constrainValuesS1[2] +'</td>'+
            '<td>'+ constrainValuesS1[3] +'</td>'+
            '<td>'+ constrainValuesS1[4] +'</td>'+
           '</tr>' +
           '<tr>'+
           '<td><span id="cjS2">$'+ cjVal[1] +'</span></td>'+
           '<td><span id="slS2">S2</span></td>'+
           '<td>'+ constrainValuesS2[0] +'</td>'+
           '<td>'+ constrainValuesS2[1] +'</td>'+
           '<td>'+ constrainValuesS2[2] +'</td>'+
           '<td>'+ constrainValuesS2[3] +'</td>'+
           '<td>'+ constrainValuesS2[4] +'</td>'+
           '</tr>'+
           '<tr>'+
            '<td></td>'+
            '<td>Zj</td>'+
            '<td>'+ zjValues[0] +'</td>'+
            '<td>'+ zjValues[1] +'</td>'+
            '<td>'+ zjValues[2] +'</td>'+
            '<td>'+ zjValues[3] +'</td>'+
            '<td>'+ zjValues[4] +'</td>'+
           '</tr>'+
           '<tr>'+
            '<td></td>'+
            '<td>Cj - Zj</td>'+
            '<td>'+ CjZjValues[0] +'</td>'+
            '<td>'+ CjZjValues[1] +'</td>'+
            '<td>'+ CjZjValues[2] +'</td>'+
            '<td>'+ CjZjValues[3] +'</td>'+
            '<td></td>'+
           '</tr>';
}



$(function(){
    
    $('#submitBtn').on('click', function(e){
        e.preventDefault();
        //object function values
        let profitA = parseInt($('#profitA').val());
        let profitB= parseInt($('#profitB').val());
        
        //constraint values
        //first Row
        let slack1A = parseInt($('#s1A').val());
        let slack1B = parseInt($('#s1B').val());
        let slack1Quantity = parseInt($('#s1Quantity').val());
        
        // //second Row
        let slack2A = parseInt($('#s2A').val());
        let slack2B = parseInt($('#s2B').val());
        let slack2Quantity = parseInt($('#s2Quantity').val());
        
        
        constrainValuesS1 = [slack1A, slack1B, 1, 0, slack1Quantity];
        constrainValuesS2 = [slack2A, slack2B, 0, 1, slack2Quantity];
        objFuncValue = [profitA, profitB, 0, 0];

        
        $('#exampleModal').modal('hide');
        //close modal
        //

        getZj();
        getCjZj();
        // getOptiomalSolution();

        //post pivotal reference
        $('#pivotalCol').text(`Pivotal Column: ${GetPivotalColmn()}`);
        $('#pivotalRow').text(`Pivotal Row: ${pivotRow}`);
        $('#pivotalPivot').text(`Pivot: ${pivot}`);
        createTable();
        GetPivot()
        getOptimalSolution();

        //this is for second table.
        constraintDivision(pivotRow);
        

    })
});


function getZj(){
    let tmp_sum_constraintA = [];
    let tmp_sum_constraintB = [];
    let zj = [];

    //loop to get the product.
    for (let index = 0; index < constrainValuesS1.length; index++) {

        //S1
        tmp_sum_constraintA[index] = cjVal[0] * constrainValuesS1[index];
        //S2
        tmp_sum_constraintB[index] = cjVal[1] * constrainValuesS2[index];

    }
    //loop to add the 2 temp. var
    for (let index = 0; index < tmp_sum_constraintA.length; index++) {
        zj[index] = tmp_sum_constraintA[index] + tmp_sum_constraintB[index];
    }

    return zjValues = zj;
}

function getCjZj(){

    let test = [];

    for (let index = 0; index < 4; index++) {
       test[index] = objFuncValue[index] + zjValues[index];
    }

    return CjZjValues = test;
}

function GetPivotalColmn(){

    let maxPositiveNumber = 0;
    
    for (let i = 0; i < CjZjValues.length; i++) {
      if (CjZjValues[i] > maxPositiveNumber) {
        maxPositiveNumber = CjZjValues[i];
      }
    }

    return maxPositiveNumber;
}

function GetPivot(){

    let pivotalIndex = CjZjValues.indexOf(GetPivotalColmn());
    let total = 0;
    let pivotalRowA = constrainValuesS1[pivotalIndex];
    let pivotalRowB = constrainValuesS2[pivotalIndex];
    // let pivot = 0;
    // let pivotString = '';

  
    //division
    let s1 = constrainValuesS1[4] / pivotalRowA;
    let s2 = constrainValuesS2[4] / pivotalRowB;

    if(s1 < s2){
        total = s1;
        pivot = pivotalRowA;
        pivotRow = 'S1';
    }else{
        total = s2;
        pivot = pivotalRowB;
        pivotRow = 'S2';

        
    }
}

function getOptimalSolution(){

    let isAllElementsLowerOrEqualToZero = CjZjValues.map(cjVal => cjVal <=0).every(Boolean);


    if(isAllElementsLowerOrEqualToZero == false){
        isOptimalSolution = false;
    }else{
        isOptimalSolution = true;
    }
}

function pointer(pivot){
    let pointerContraints = [];

    switch (pivot){
        case 'S1':
            pointerContraints = constrainValuesS1;
            break;
        case 'S2':
            pointerContraints = constrainValuesS2;
            break;
        default :
            console.log('pointer parameters not allowed.');
    }

    return pointerContraints;
}

//solving for the second table
function constraintDivision(pivotRow){

    let tmpArray1 = [];
    let pointer = this.pointer(pivotRow);
    

    for(let i = 0; i< pointer.length; i++){
        constrainValuesS1[i] = pointer[i]/pivot;
    
    }
    return tmpArray1;
}



function elementaryAddition(){

}


