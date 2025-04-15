const inputGroup=document.getElementById("input-group-div").querySelectorAll("input");
const saveButton=document.getElementById("save-button");

function deleteModalSetter(){
    modalHeader.innerHTML=`<h1 class="modal-title fs-5" id="exampleModalLabel">Delete the organisation</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div id="model-message-shower">
    
    <div class="alert alert-danger" role="alert">
    <h4 class="alert-heading">Warning!</h4>
    <p>This action is irreversible</p>
    <hr>
    Once you delete the organisation you cannot recover it back.All the data related to the organisation will be deleted</div>
    <h5>Are you sure you want to delete the organisation?</h5>
    </div>`;
    modalFooter.innerHTML=`<button type="button" class="btn btn-danger" id="delete-organisation-confirm-button" onClick="deleteConfirm(this)">delete</button><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    `;
    var modal = new bootstrap.Modal(modalTotal);
    modal.show();
}

function deleteConfirm(element){
    element.disabled=true;
    const modelMessgeShower=document.getElementById("model-message-shower");
    modelMessgeShower.innerHTML='';
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/api/company/deleteCompany", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alertToast(response.msg);
                var box=`<div class="alert alert-danger" role="alert">Organisation is deleted, redirecting to the home</div>`
                modelMessgeShower.innerHTML=box;
                setTimeout(()=>{
                    window.location.href="/v";
                },2000);
            }
            else{
                alertToast(response.msg);
            }
        }
    };

    xhr.send();
}

function getOptions(){
    alertToast("Loading...");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/company/getOptions", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                inputGroup[0].checked=response.data.EachOtherComments;
                inputGroup[1].checked=response.data.privateComment;
                inputGroup[2].checked=response.data.userNoComments;
                inputGroup[3].checked=response.data.NoMoreComments;
                inputGroup[4].checked=response.data.showPrivateComment;
                inputGroup[5].checked=response.data.showNoComments;

                inputGroup.forEach((element)=>{element.disabled=false;});

                inputGroup[inputGroup.length-1].value=response.data.defaultNoOfComments;
                inputGroup[inputGroup.length-1].readOnly=false;

                saveButton.disabled=false;
            }
            else{
                alertToast(response.msg);
            }
        }
    };
    xhr.send();
}

function updateModalSetter(){
    var data={
        EachOtherComments:inputGroup[0].checked,
        privateComment:inputGroup[1].checked,
        userNoComments:inputGroup[2].checked,
        NoMoreComments:inputGroup[3].checked,
        showPrivateComment:inputGroup[4].checked,
        showNoComments:inputGroup[5].checked,
        defaultNoOfComments:inputGroup[inputGroup.length-1].value,
    }
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/company/updateOptions", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alertToast(response.msg);
            }
            else{
                alertToast(response.msg);
            }
        }
    };
    xhr.send(JSON.stringify(data));

}


getOptions();