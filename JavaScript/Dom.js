console.log(window);
console.log(window["document"]["all"][6]["innerHTML"]);
window["document"]["all"][6]["innerHTML"]="changed the dom"
console.log(window["document"]["all"][6]["innerHTML"]);
