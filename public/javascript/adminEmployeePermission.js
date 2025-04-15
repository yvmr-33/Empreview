const employeeBox=document.getElementById("employee-box-from-company");
const searchForm=document.getElementById("search-form");


const currentUrl = window.location.href;
const url = new URL(currentUrl);
const pathname = url.pathname;
const pathSegments = pathname.split('/').filter(segment => segment !== '');
const toWhomId = pathSegments[3];


let dataE = [];
let dataR=[];

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


function getEmployeePermission() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/rolesAndRequest/dataEmployeesAndPermissions?r=${toWhomId}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                dataE=response["data"]["employees"];
                dataR=response["data"]["allowedtoComment"];
                computeData(dataE);
            }
            else{
                alertToast(`${response["msg"]}`);
            }
        }
    };
    xhr.send();
}

function computeData(data){
    let dataemployee=data;
    if(dataemployee.length==0){
        employeeBox.innerHTML=`<div class="col-12 text-center" style="height: 100%;">
        <h5 class="text-body-secondary">No Employee to give permission</h5>
        </div>`;
        return;
    }
    employeeBox.innerHTML="";
    for(let i of dataemployee){
        employeeBox.innerHTML+=employeePermissionBoxMaker(i);
    }
    AprrroveOrRejectEmployeePermissionMaker(dataR);
}

function employeePermissionBoxMaker(i){
    var box=`<div class="col"  style="cursor: pointer; height:150px" id="${i._id}">
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
                            <div id="${i.roleId}-button-div">
                                <button type="button" class="btn btn-success btn-sm" onclick="approve('${i.roleId}',this)">Give permission</button>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </a>
                </div>`;
                return box;
  }

function AprrroveOrRejectEmployeePermissionMaker(data){
    for(let i of data){
        const element=document.getElementById(`${i}-button-div`);
        if(element)
        element.innerHTML=`<button type="button" class="btn btn-danger btn-sm" onclick="reject('${i}',this)">Remove permission</button>`;
    }
}


getEmployeePermission();


function approve(id,element){
    element.disabled=true;
    const data={method:"add",roleId:toWhomId,allowedtoComment:id};
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/rolesAndRequest/changePermission`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var serializedData = new URLSearchParams(data).toString();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                element.innerHTML="Remove permission";
                element.classList.remove("btn-success");
                element.classList.add("btn-danger");
                element.onclick=function(){reject(id,this)};
                element.disabled=false;
                alertToast(`${response["msg"]}`);
            }
            else{
                alertToast(`${response["msg"]}`);
            }
        }
    };
    xhr.send(serializedData);
}
function reject(id,element){
    element.disabled=true;
    const data={method:"remove",roleId:toWhomId,allowedtoComment:id};
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/rolesAndRequest/changePermission`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var serializedData = new URLSearchParams(data).toString();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                element.innerHTML="Give permission";
                element.classList.remove("btn-danger");
                element.classList.add("btn-success");
                element.onclick=function(){approve(id,this)};
                element.disabled=false;
                alertToast(`${response["msg"]}`);
            }
            else{
                alertToast(`${response["msg"]}`);
            }
        }
    };
    xhr.send(serializedData);
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
        employeeBox.innerHTML=`<h3 class="text-center" style="width:600px" >There is no employee to the keyword</h3>`;
        return;
    }
    computeData(arr);
    findAndHighlightInDiv(searchInput);
    alertToast("Searched for the keyword");
}
function searchGivenInput(keyword){
    keyword=keyword.trim();
    keyword=new RegExp(keyword.split('').map(char => `[${char.toUpperCase()}${char.toLowerCase()}]`).join(''), 'i');
    let newArray=dataE.filter(function(element){
        if(keyword.test(element.name)||keyword.test(element.about)||(element.note&&keyword.test(element.note))){
            return true;
        }
        else{
            return false;
        }
    })
    return newArray;
}

searchForm.addEventListener("submit",searchFormSubmission);

alertToast("These are the employees who are working in the organisation. You can give permission to comment to the particular employee. to the now selected person (press me or hover for showing long time)")