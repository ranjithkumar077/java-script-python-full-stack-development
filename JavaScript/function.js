// function declaration
function sum(a,b){
        let sum=a+b;
        return sum;

}
let ans=sum(10,20);
console.log(ans)
 

// function Expression 
const sum1=function(a,b){
        let sum=a+b;
        return sum;

}
let ans2=sum1(1,20);
console.log(ans2)

//arrow function
const sum3=(a,b)=>{
    let c=a+b;
    return c;

}
console.log(sum3(1,40));


//even number
let arr1=[1,2,3,4,5,6,7,8,9,10];
console.log("EVEN NUMBERS");
let even=arr1=>{
  for ( let i=0;i<=arr1.length;i++){
    if(arr1[i]%2 === 0){
    console.log(arr1[i]);
  }
}
};
even(arr1)