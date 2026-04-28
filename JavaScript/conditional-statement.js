//if else 
let age=25
if (age>=18){
    console.log("Eligible");

}else{
    console.log("Not Eligible");
}

// if-else-if
let age1=60
if(age1>=60){
    console.log("senior citizen");
}
else if(age1>=45){
    console.log("middle aged");
}
else{
    console.log("Youngster");
}



// Swich Case 
let light="green"
switch(light){
case ("red"):
    console.log("stop");
    break
case("yellow"):
    console.log("Slow Down");
    break
case("green"):
    console.log("Go");
    break
default:
    console.log("No signal");
}


//ternary condition
let age2 = 18;
(age2 > 18)?console.log("yes"):console.log("no");
// max number 

let a1=5,b1=20,c1=300;
if (a1>b1 && a1>c1){
    console.log("a is greater");}
else if (b1>a1 && b1>c1){
    console.log("b is greater");
}
else{
    console.log("c is greater");
}

// using ternary operator
let max=(a1>b1)
?(a1>c1)?console.log("a is greater"):console.log(" cis greater")
:(b1>c1)?console.log("b is greater"):console.log("c is greater");