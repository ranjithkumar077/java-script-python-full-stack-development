// Selecting Elements
let title = document.getElementById("title");
let message = document.getElementById("message");
let container = document.getElementById("container");

// Changing Content
function changeContent()
{
    message.textContent = "The content has been changed using JavaScript DOM.";
}

// Changing Styles
function changeStyle(){
    message.style.color = "blue";
    message.style.fontSize = "22px";
    message.style.fontWeight = "bold";
}
// Creating Elements
function createElement(){
    let newPara = document.createElement("p");
    newPara.textContent = "This paragraph is created dynamically.";
    container.appendChild(newPara);
}
