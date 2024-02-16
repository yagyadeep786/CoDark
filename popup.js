
// const fs = require("fs");

chrome.tabs.onUpdated.addListener(function() {
    console.log("I am working");
        localStorage.setItem("output",null);
        var keyArr= ["Urgency","Scarcity","Misdirection","Social Proof","Obstruction","Sneaking","Forced Action"];
        var countboxs= document.getElementsByClassName("item-value");
            
        for(let i=0;i<countboxs.length;i++){
           countboxs[i].innerHTML= "...";
        }
  });

const runpoup= ()=>{
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var url = tabs[0].url;

    fetch(`http://localhost:3000/?url=${encodeURIComponent(url)}`)
.then((res)=> res.json())
.then((data)=>{
    console.log("Hello i am data: ",data);
    obj= JSON.parse(data.pythonOutput);
    console.log("outdataobject: ", obj)
   
    localStorage.setItem("output",JSON.stringify(obj));

    var keyArr= ["Urgency","Scarcity","Misdirection","Social Proof","Obstruction","Sneaking","Forced Action"];

    var countboxs= document.getElementsByClassName("item-value");
        
    for(let i=0;i<countboxs.length;i++){
       countboxs[i].innerHTML= obj[keyArr[i]].length;
    }


    async function sayHello() {

    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query({ active: true });
    var url= tab.url;
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args:[obj],
        func: (obj) => {
            // document.body.style="border: 10px solid red";

            var allElements=[];

            allElements.push(document.body.querySelectorAll("a"));
            allElements.push(document.body.querySelectorAll("p"));
            allElements.push(document.body.querySelectorAll("h1"));
            allElements.push(document.body.querySelectorAll("h2"));
            allElements.push(document.body.querySelectorAll("h3"));
            allElements.push(document.body.querySelectorAll("h4"));
            allElements.push(document.body.querySelectorAll("h5"));
            allElements.push(document.body.querySelectorAll("h6"));
            allElements.push(document.body.querySelectorAll("li"));
            allElements.push(document.body.querySelectorAll("span"));
            const divs = document.body.querySelectorAll("div");
            const divsWithTextOnly = [];
      
            divs.forEach(div => {
                const hasTextOnly = Array.from(div.childNodes).every(node => node.nodeType === Node.TEXT_NODE);
        
                if (hasTextOnly && div.textContent !== "") {
                    divsWithTextOnly.push(div);
                }
            });

            
            allElements.push(divsWithTextOnly);
            // console.log("jai shree ram")

            console.log(allElements);
            var keyArr= ["Urgency","Scarcity","Misdirection","Social Proof","Obstruction","Sneaking","Forced Action"];

            keyArr.forEach((key,i)=>{
                obj[key].forEach((sentence)=>{

                    allElements.forEach((tags)=>{
                        tags.forEach((tag)=>{
                            if((tag.textContent===sentence  || tag.textContent.includes(sentence) || tag.textContent.match(sentence)) && i==0){
                                tag.style= "border: 3px solid red ; border-radius: 20px ;";
                            }else if((tag.textContent===sentence   || tag.textContent.includes(sentence) || tag.textContent.match(sentence)) && i==1){
                                tag.style="border :3px solid yellow; border-radius: 20px ;";
                            }else if((tag.textContent===sentence  || tag.textContent.includes(sentence) || tag.textContent.match(sentence) ) && i==2){
                                tag.style="border :3px solid green; border-radius: 20px ;";
                            }else if((tag.textContent===sentence   || tag.textContent.includes(sentence) || tag.textContent.match(sentence)) && i==3){
                                tag.style="border :3px solid blue; border-radius: 20px ;";
                            }else if((tag.textContent===sentence   || tag.textContent.includes(sentence) || tag.textContent.match(sentence)) && i==4){
                                tag.style="border :3px solid rgb(43, 92, 252); border-radius: 20px ;";
                            }else if((tag.textContent===sentence   || tag.textContent.includes(sentence) || tag.textContent.match(sentence)) && i==5){
                                tag.style="border :3px solid rgb(91, 89, 94); border-radius: 20px ;";
                            }else if((tag.textContent===sentence   || tag.textContent.includes(sentence) || tag.textContent.match(sentence)) && i==6){
                                tag.style="border :3px solid rgb(166, 109, 231); border-radius: 20px ; ";
                            }
                        })
                    })
                })
            })
        
        }
    });
}

document.getElementById("mybtn").addEventListener("click", sayHello);

})
});
}

document.getElementById("mybtn1").addEventListener("click",()=>{
    var keyArr= ["Urgency","Scarcity","Misdirection","Social Proof","Obstruction","Sneaking","Forced Action"];
    var countboxs= document.getElementsByClassName("item-value");
        
    for(let i=0;i<countboxs.length;i++){
       countboxs[i].innerHTML= "...";
    }
    runpoup();
})



var outputData= JSON.parse(localStorage.getItem("output"));
if(outputData != null){
    var keyArr= ["Urgency","Scarcity","Misdirection","Social Proof","Obstruction","Sneaking","Forced Action"];
    var countboxs= document.getElementsByClassName("item-value");
        
    for(let i=0;i<countboxs.length;i++){
       countboxs[i].innerHTML= outputData[keyArr[i]].length;
    }
}


