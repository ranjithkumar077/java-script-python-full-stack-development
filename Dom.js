console.log(window);
console.log(window["document"]["all"][6]["innerHTML"]);
window["document"]["all"][6]["innerHTML"]="changed the dom"
console.log(window["document"]["all"][6]["innerHTML"]);

// get element 
let h1element=document.getElementsByTagName("h1");
console.dir(h1element["1"]["innerText"]);
h1element["1"]["innerText"]="changed head 2"

//getElementByid
let h1element1=document.getElementById("h4");
console.dir(h1element1);
h1element1.innerText="changed the head 4"

//getElementByclass

let h1element2=document.getElementsByClassName("h5");
console.dir(h1element2);
h1element2.innerText="changed the head 5"


//query Selector
//id 

reqelement=document.querySelector("#h2")
console.dir(reqelement);
reqelement.innerText="this is id query selector"

//by class
reqelement1=document.querySelector(".h2")
console.dir(reqelement1);
reqelement1.innerText="this is class  query selector"

// query selector all
allelement=document.querySelectorAll(".h2")
console.dir(allelement);
allelement.innerText="Thor";

//
for (let i = 0; i < allelement.length; i++) {
  console.log(i);
  console.log(i.innerText);
  allelement[i].innerText = "Thor";
}
