const commetBoxContainer = document.getElementById("commet-box-container");
const permissionLink =document.getElementById("permission-link");
const noOfCommentsInput=document.getElementById("no-of-comments-input");

let data=[];

var truncateStyles = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '230px',
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


const currentUrl = window.location.href;

const url = new URL(currentUrl);

const pathname = url.pathname;

const pathSegments = pathname.split('/').filter(segment => segment !== '');

const toWhomId = pathSegments[3];

permissionLink.setAttribute("href",`/v/a/employee/${toWhomId}/addPermission`);

  function commentFencth(){

    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/comment/viewComments?toWhomId=${toWhomId}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                data=response["data"];
                CommentsBoxAdder(response["data"]);
            }
            else{
                alertToast(`${response["msg"]}`);
            }
        }
    };
    xhr.send();
}

function CommentsBoxAdder(data){
    if(data.length==0){
        commetBoxContainer.innerHTML=`<h5 class="text-center"  >There is no comment to show</h5>`;
        return;
    }
    commetBoxContainer.innerHTML='';
    for(let i of data){commetBoxContainer.innerHTML+=commetBoxMaker(i)};
}

function commetBoxMaker(i){
    var box=`
    <div style="color:  gray;" >
      <div class="glass p-3 m-3 rounded" style="width: 250px;">
        <h5  onclick="toggleText(this)" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 230px; cursor: pointer;">Name:-${i.name}</h5>
    
        <div class="d-flex justify-content-center">
            <h6>rating:&nbsp; </h6>
            <div class="rounded" style="width: 1000px;height: 5px; background-color: white; margin-top: 8px;">
                <div style="width: ${i.rating*20}%;height: 5px; background-color: yellow;"></div>
            </div>
            <div style="margin-top: -2px;"> &nbsp;&nbsp;(${i.rating}/5)</div>
        </div>
    
        <h6  onclick="toggleText(this)" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 230px; cursor: pointer;">comment:- ${i.msg}</h6>
        <div class="d-flex justify-content-end">
            <button class="btn btn-outline-primary btn-sm" onclick="editComment('${i._id}')">Edit</button>
        </div>
      </div>
    </div>`;
    return box;
}


commentFencth();



function editComment(id){
    let comment=data.find((i)=>i._id==id);
    editCommentModelMaker(comment);
};

function editCommentModelMaker(i){
    modalHeader.innerHTML=`<h1 class="modal-title fs-5" id="exampleModalLabel">Edit the comment</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div id="model-message-shower">
    <div id="model-msg-shower"></div>
    <form id="comment-update-form">
    <div class="mb-3 input-group">
        <label for="name" class="input-group-text">Name</label>
        <input type="text" value="${i.name}" class="form-control" id="name" aria-describedby="emailHelp" readonly>
    </div>
    <div class="mb-3 input-group">
        <label for="rating" class="input-group-text">Rating</label>
        <input type="number" value="${i.rating}" class="form-control" id="rating" min=1 max=5>
    </div>
    <div class="mb-3 input-group">
        <label for="msg" class="input-group-text">Comment</label>
        <textarea class="form-control" id="msg" rows="3">${i.msg}</textarea>
    </div>
    </form>
    <div class="d-flex ">
        <button type="button" class="btn btn-outline-danger" onClick="deleteComment(this,'${i._id}')">Delete comment</button>
    </div>
    </div>`;
    modalFooter.innerHTML=`<button type="button" class="btn btn-outline-success" onClick="updateComment(this,'${i._id}')">Update comment</button><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    `;
    var modal = new bootstrap.Modal(modalTotal);
    modal.show();
}

function deleteComment(element,id){
    element.disabled=true;
    const data={_id:id,toWhomId:toWhomId};
    const modelMsgShower=document.getElementById("model-msg-shower");
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `/api/comment/deleteComment`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var serializedData = new URLSearchParams(data).toString();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                modelMsgShower.innerHTML=`<div class="alert alert-success" role="alert"> ${response["msg"]} </div>`;
                alertToast(`${response["msg"]}`);
                commentFencth();
            }
            else{
                modelMsgShower.innerHTML=`<div class="alert alert-danger" role="alert"> ${response["msg"]} </div>`;
                alertToast(`${response["msg"]}`);
            }
        }
    };
    xhr.send(serializedData);
}

function updateComment(element,id){
    element.disabled=true;
    const form=document.getElementById("comment-update-form");
    const modelMsgShower=document.getElementById("model-msg-shower");
    const data={
        rating:form["rating"].value,
        msg:form["msg"].value,
        toWhomId:toWhomId,
        _id:id
    }
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `/api/comment/updateComment`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var serializedData = new URLSearchParams(data).toString();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                modelMsgShower.innerHTML=`<div class="alert alert-success" role="alert"> ${response["msg"]} </div>`;
                alertToast(`${response["msg"]}`);
                commentFencth();
            }
            else{
                element.disabled=false;
                modelMsgShower.innerHTML=`<div class="alert alert-danger" role="alert"> ${response["msg"]} </div>`;
                alertToast(`${response["msg"]}`);
            }
        }
    };
    xhr.send(serializedData);
}

function changeRole(role,element){
    const data={
        roleId:toWhomId,
        role:role
    };
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `/api/rolesAndRequest/changeRole`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var serializedData = new URLSearchParams(data).toString();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                if(role=="both"){
                    role="admin";
                    element.innerHTML="Demotivate to employee";
                    element.classList.remove("btn-outline-success");
                    element.classList.add("btn-outline-danger");
                    element.setAttribute("onClick",`changeRole('employee',this)`);
                }else{
                    element.innerHTML="Promote to admin";
                    element.classList.remove("btn-outline-danger");
                    element.classList.add("btn-outline-success");
                    element.setAttribute("onClick",`changeRole('both',this)`);
                }
                alertToast(`${response["msg"]} to ${role}`);
            }
            else{
                alertToast(`${response["msg"]}`);
            }
        }
    };
    xhr.send(serializedData);
}

function deleteEmployeeModelMaker(){
    modalHeader.innerHTML=`<h1 class="modal-title fs-5" id="exampleModalLabel">Delete the employee</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div id="model-message-shower">
    <div id="model-msg-shower"></div>
    <div class="alert alert-danger" role="alert">
        <h4 class="alert-heading">Warning!</h4>
        <p>This action is irreversible</p>
        <hr>
        <p class="mb-0">If you delete this employee, all the data of this employee will be deleted</p>
    </div>
    <div class="d-flex justify-content-center">
        <h5>Are you sure you want to delete this employee?</h5>
    </div>
    </div>`;
    modalFooter.innerHTML=`
    <button type="button" class="btn btn-danger" onclick="deleteEmployee(this)" >Delete</button>
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    `;
    var modal = new bootstrap.Modal(modalTotal);
    modal.show();

}


function deleteEmployee(element){
    element.disabled=true;
    const data={
        roleId:toWhomId
    };
    const modelMsgShower=document.getElementById("model-msg-shower");
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `/api/rolesAndRequest/deleteRole`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var serializedData = new URLSearchParams(data).toString();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alertToast(`${response["msg"]}`);
                modelMsgShower.innerHTML=`<div class="alert alert-success" role="alert"> ${response["msg"]} redirecting to the admin employes page</div>`;
                setTimeout(() => {
                    window.location.href="/v/a/employee";
                }, 2000);
            }
            else{
                modelMsgShower.innerHTML=`<div class="alert alert-danger" role="alert"> ${response["msg"]} </div>`;
                alertToast(`${response["msg"]}`);
            }
        }
    };
    xhr.send(serializedData);
}

function changeNoOfrating(){
    const data={
        roleId:toWhomId,
        noOfComments:noOfCommentsInput.value
    };
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `/api/rolesAndRequest/changeNoOfComments`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var serializedData = new URLSearchParams(data).toString();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alertToast(`${response["msg"]}`);
            }
            else{
                alertToast(`${response["msg"]}`);
            }
        }
    };
    xhr.send(serializedData);
}