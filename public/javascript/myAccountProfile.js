const buttonsdiv=document.querySelector("#buttons-div");
const editButtonDiv=buttonsdiv.querySelector("#edit-button-div");
const submitButtonDiv=buttonsdiv.querySelector("#edit-submit-div");
const bannerInput=document.querySelector("#banner-input");
const photoInput=document.querySelector("#photo-input");
const bannerImgShowElement=document.querySelector("#banner-preview");
const photoImgShowElement=document.querySelector("#photo-preview");

const nameInput=document.querySelector("#name-input");
const aboutInput=document.querySelector("#about-input");

let fileChangeRequest=null;

function customElementPreview(element){
    return function preshowImageViaInput(event){
        const input=event.target;
        if(input.files&&input.files[0]){
            const reader=new FileReader();
            reader.onload=function(e){
                element.src=e.target.result;
                element.classList.remove("d-none");
            }
            reader.readAsDataURL(input.files[0]);
        }
        else{
            element.src='';
            element.classList.add("d-none");
        }
    };
}

function editButtonClick(){
    editButtonDiv.classList.add("d-none");
    submitButtonDiv.classList.remove("d-none");
    nameInput.removeAttribute("readonly");
    aboutInput.removeAttribute("readonly");
    alertToast("Now you can edit,  name and about sections");
}
function closeButtonClick(){
    editButtonDiv.classList.remove("d-none");
    submitButtonDiv.classList.add("d-none");
    nameInput.setAttribute("readonly","");
    aboutInput.setAttribute("readonly","");
}


function submitButtonClick(element){
    element.disabled=true;
    const name=nameInput.value;
    const about=aboutInput.value;
    const data={name,about};
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/user/update-profile-details", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var serializedData = new URLSearchParams(data).toString();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alertToast("Profile updated");
                element.disabled=false;
                closeButtonClick();
            }
            else{
                alertToast(response["msg"]);
            }
        }
    };

    xhr.send(serializedData);
}

function deleteModelMaker(){
    modalHeader.innerHTML=`<h1 class="modal-title fs-5" id="exampleModalLabel">Delete the account</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div id="model-message-shower">
    
    <div class="alert alert-danger" role="alert">
    <h4 class="alert-heading">Warning!</h4>
    <p>This action is irreversible</p>
    <hr>
    Once you delete the account you cannot recover it back.All the data related to the account will be deleted</div>
    <h5>Are you sure you want to delete the account?</h5>
    </div>`;
    modalFooter.innerHTML=`<button type="button" class="btn btn-danger" id="delete-organisation-confirm-button" onClick="deleteAccount(this)">delete</button><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    `;
    var modal = new bootstrap.Modal(modalTotal);
    modal.show();
}

function deleteAccount(element){
    element.disabled=true;
    const modelMessgeShower=document.getElementById("model-message-shower");
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/api/user/delete-account", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alertToast(response.msg);
                var box=`<div class="alert alert-danger" role="alert">Account is deleted, redirecting to the home</div>`
                modelMessgeShower.innerHTML=box;
                setTimeout(()=>{
                    window.location.href="/";
                },2000);
            }
            else{
                alertToast(err.msg);
            }
        }
    };

    xhr.send();

}


function customElementPreview(type){
    return function preshowImageViaInput(event){
        const input=event.target;
        if(input.files&&input.files[0]){
            fileChangeRequest=input.files[0];
            confirmCompanyPhotoChange(type);
        }
        else{
            alertToast("please select the file");
        }
    };
}

photoInput.addEventListener('change',customElementPreview("photo"));
bannerInput.addEventListener('change',customElementPreview("banner"));

function confirmCompanyPhotoChange(type){
    modalHeader.innerHTML=` <h1 class="modal-title fs-5" id="exampleModalLabel">Confirm the ${type} change</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div class="d-flex align-items-center justify-content-around">
    <i class="fa-solid fa-file fa-2xl"></i>
    <h3>${fileChangeRequest.name}</h3>
   </div>`;
    modalFooter.innerHTML=`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button type="button" class="btn btn-success" data-bs-dismiss="modal" onclick="confrimPhotoSubmission('${type}')">Change</button>`;
    var modal = new bootstrap.Modal(modalTotal);
    modal.show();
}

function confrimPhotoSubmission(type){
    var formData=new FormData();
    if(!fileChangeRequest){alert("please select photo");return;}
    if(type=="banner"){
        bannerImgShowElement.style.opacity="0.5";
        formData.append('banner', fileChangeRequest);
    }
    else{
        photoImgShowElement.style.opacity="0.5";
        formData.append('photo', fileChangeRequest);
    } 
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/user/update-profile-photo", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alertToast(response["msg"]);
                const reader=new FileReader();
                reader.onload=function(e){
                    if(type=="banner"){
                        bannerImgShowElement.style.opacity="1";
                        bannerImgShowElement.src=e.target.result;
                    }
                    else{
                        photoImgShowElement.style.opacity="1";
                        photoImgShowElement.src=e.target.result;
                    }
                }
                reader.readAsDataURL(fileChangeRequest);
            }
            else{
                alertToast(`${response["msg"]}`);
            }
        }
    };
    xhr.send(formData);
}

const urlParams = new URLSearchParams(window.location.search);

if(urlParams.get("from")&&urlParams.get("from")!="/my-profile"){
    const backButton=document.getElementById("back-button");
    backButton.href=urlParams.get("from");
}