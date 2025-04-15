const employeeBox=document.getElementById("requests-box-from-company");
const searchForm=document.getElementById("search-form");
const searchBoxInput=searchForm.querySelector("input");
const backButton=document.getElementById("back-button");
const mainPage=document.getElementById("main-page");
const addRequestBoxShow=document.getElementById("addRequestBoxShow");
const addNewEmployeeBox=document.getElementById("addNewEmployeeBox");
const formData=document.getElementById("form--add-new-Employee-email");
const emailInput=formData.querySelector("#email-input");
const NoteInput=formData.querySelector("#note-input");
const submitButton=formData.querySelector("#email-submit");

let b=0;

function addRequestBox(){
    mainPage.classList.add("d-none");
    addRequestBoxShow.classList.remove("d-none");
    b=1;
    dataRequestsSentToCompany();
}

function addEmployeeBox(){
    mainPage.classList.add("d-none");
    addNewEmployeeBox.classList.remove("d-none");
    b=1;
}

function BackFunction(){
    if(b==0){
        window.location.href = "./";
    }else{
        mainPage.classList.remove("d-none");
        addRequestBoxShow.classList.add("d-none");
        addNewEmployeeBox.classList.add("d-none");
        searchBoxInput.value='';
        b=0; 
    }
}

backButton.addEventListener("click",BackFunction);


function formSubmissionEmail(event){
    event.preventDefault();
    var formData= new FormData(this);

    //disabling the button
    submitButton.disabled=true;
    emailInput.readOnly=true;
    NoteInput.readOnly=true;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/requestTouser/add", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    var serializedData = new URLSearchParams(formData).toString();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                setInterval(()=>{submitButton.disabled =false;},1500)
                alertToast(response.msg);
                emailInput.value='';
                emailInput.readOnly=false;
                NoteInput.readOnly=false;
            }
            else{
                alertToast(`<div style="color:red;">${response.msg}</div>`);
                submitButton.disabled =false;
                emailInput.readOnly=false;
                NoteInput.readOnly=false;
            }
        }
    };

    xhr.send(serializedData);
};

formData.addEventListener("submit",formSubmissionEmail);


let requests=null;

var truncateStyles = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '200px',
    cursor: 'pointer'
  };

  var expandedStyles = {
    whiteSpace: 'normal',
    overflow: 'visible',
    textOverflow: 'initial'
  };

  function applyStyles(element, styles) {
    for (var property in styles) {
      element.style[property] = styles[property];
    }
  }

  function toggleText(element) {
    var isExpanded = element.classList.toggle("expanded");
    var styles = isExpanded ? expandedStyles : truncateStyles;
    applyStyles(element, styles);
  }

  function requestBoxMaker(i){
    var box=`<div class="col"  style="cursor: pointer; height:170px" id="${i._id}">
                    <a style="text-decoration: none;"  style="height: 100%;">
                    <div class="card mb-3 custom-card glass" style="max-width: 540px; height: 100%;">
                        <div class="row g-0" style="height: 100%;">
                        <div class="col-4 " style="height: 100%;">
                            <img src="${i.photo}" class="img-fluid rounded-start" alt="image of the employee" style="height: 100%;width: 100%; object-fit:cover">
                        </div>
                        <div class="col-8">
                            <div class="card-body">
                            <h5 class="card-title" id="highlight-text"onclick="toggleText(this)" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 230px; cursor: pointer;"><small class="text-body-secondary">Name:- ${i.name}</h5>
                            <p class="card-text"  onclick="toggleText(this)" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 230px; cursor: pointer;"><small class="text-body-secondary" >About:- ${i.about}</small></p>
                            <p class="card-text"  onclick="toggleText(this)" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 230px; cursor: pointer;"><small class="text-body-secondary" >Note:- ${i.note}</small></p>
                            <div>
                                <button type="button" class="btn btn-success btn-sm" onclick="approve('${i._id}')">Approve</button>
                                <button type="button" class="btn btn-danger btn-sm" onclick="reject('${i._id}')">Reject</button>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </a>
                </div>`;
                return box;
  }


  function dataRequestsSentToCompany(){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/rolesAndRequest/requestsSent", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                requests=response.request;
                employeeBox.innerHTML='';
                if(response.request.length==0){
                    employeeBox.innerHTML=`<h3 class="text-center" style="width:600px" >There is no request to the organisation</h3>`;
                    return;
                }
                for(let i of response.request){
                    if(!i.note){
                        i.note="No note kept";
                    }
                employeeBox.innerHTML=employeeBox.innerHTML+requestBoxMaker(i);
                }
            }
            else{
                alertToast(err.msg);
            }
        }
    };

    xhr.send();
}

 function SendRequestToChange(path,pathType,requestId){
    var xhr = new XMLHttpRequest();
    xhr.open(pathType, `/api/rolesAndRequest/${path}`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var serializedData = new URLSearchParams({requestId:requestId}).toString();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                return true;
            }
            else{
                alert(response.msg);
                return false;
            }
        }
    }
    xhr.send(serializedData);
}

function removeFromArray(id){
    for(let i=0;i<requests.length;i++){
        if(requests[i]._id==id){
            requests.splice(i,1);
            return;
        }
    }
    setInterval(()=>{
        if(requests.length==0){
            employeeBox.innerHTML=`<h3 class="text-center" style="width:600px" >There is no request to the organisation</h3>`;
            return;
        }
    },1200);
    
}
function approve(requestId){
    var box=`
    <div class="card mb-3 custom-card glass d-flex justify-content-center" style="max-width: 540px; height: 200px;">
      <img src="/website/correct.png" height="100px" style="object-fit: contain;">
    </div>`
    var a=document.getElementById(requestId);
    a.innerHTML=box;
    SendRequestToChange("requestToRole","POST",requestId);
    setInterval(()=>{a.remove();removeFromArray(requestId);},1000);
}

 function reject(requestId){
    var box=`
    <div class="card mb-3 custom-card glass d-flex justify-content-center" style="max-width: 540px; height: 200px;">
      <img src="/website/wrong.png" height="150px" style="object-fit: contain;">
    </div>`;
    var a=document.getElementById(requestId);
    a.innerHTML=box;
    SendRequestToChange("revertRequest","DELETE",requestId);
    setInterval(()=>{a.remove();removeFromArray(requestId);},1500);
}


function findAndHighlightInDiv(searchTerm) {
    if (employeeBox && window.find && window.getSelection) {

        var removeHighlights = document.querySelectorAll('.highlight');
        removeHighlights.forEach(function (highlight) {
            highlight.classList.remove('highlight');
        });

        document.designMode = "on";
        var sel = window.getSelection();
        sel.collapse(employeeBox, 0);

        while (window.find(searchTerm)) {
            document.execCommand("HiliteColor", false, "yellow");
            sel.collapseToEnd();
            var range = sel.getRangeAt(0);
            var span = document.createElement('span');
            span.className = 'highlight';
            range.surroundContents(span);
        }

        document.designMode = "off";
    }
}


function searchFormSubmission(event){
    event.preventDefault();
    var formData= new FormData(this);
    const searchInput=formData.get("search").trim();
    var arr=searchGivenInput(searchInput);
    employeeBox.innerHTML='';
    alertToast("Searching...");
    if(arr.length==0){
        employeeBox.innerHTML=`<h3 class="text-center" style="width:600px" >There is no request to the keyword</h3>`;
        return;
    }
    for(let i of arr){
        employeeBox.innerHTML=employeeBox.innerHTML+requestBoxMaker(i);
    }
    findAndHighlightInDiv(searchInput);
    alertToast("Searched for the keyword");
}
function searchGivenInput(data){
    data=data.trim();
    data=new RegExp(data.split('').map(char => `[${char.toUpperCase()}${char.toLowerCase()}]`).join(''), 'i');
    let newArray=requests.filter(function(element){
        if(data.test(element.name)||data.test(element.about)||(element.note&&data.test(element.note))){
            return true;
        }
        else{
            return false;
        }
    })
    return newArray;
}

searchForm.addEventListener("submit",searchFormSubmission);