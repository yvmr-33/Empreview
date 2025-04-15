const imgInputElemet=document.getElementById("photo-input");
const imgShowElement=document.getElementById("photo-preview");
const buttonsdiv=document.getElementById("buttons-div");
const editButtonDiv=buttonsdiv.querySelector("#edit-button-div");
const submitButtonDiv=buttonsdiv.querySelector("#edit-submit-div");
const companyNameInput=document.querySelector("#companyNameInput");
const aboutInput=document.querySelector("#aboutInput");
const submitButton=submitButtonDiv.querySelector("#edit-submit");
const companyIdGroup=document.getElementById("companyIdGroup");
const resetCompanyIdButton=companyIdGroup.querySelector("#reset-company-id-button");
const resetCompanyIdInput=companyIdGroup.querySelector("#reset-company-id-edit");
const resetIcon=companyIdGroup.querySelector("#reset-button-icon");
const modalShowerButton=document.getElementById("modal-shower-butoon");
const companyImagefrom=document.getElementById("company-image-from");
const spinnerForCompanyPhoto=document.getElementById("spinner-for-company-photo");

let fileChangeRequest=null;

function customElementPreview(){
    return function preshowImageViaInput(event){
        const input=event.target;
        if(input.files&&input.files[0]){
            fileChangeRequest=input.files[0];
            confirmCompanyPhotoChange();
        }
        else{
            alertToast("please select the file");
        }
    };
}

imgInputElemet.addEventListener('change',customElementPreview());

function editButtonClick(){
    editButtonDiv.classList.add("d-none");
    submitButtonDiv.classList.remove("d-none");
    companyNameInput.readOnly=false;
    aboutInput.readOnly=false;
    alertToast("Now you can edit, Company name and about sections");
}
function closeButtonClick(){
    editButtonDiv.classList.remove("d-none");
    submitButtonDiv.classList.add("d-none");
    companyNameInput.readOnly=true;
    aboutInput.readOnly=true;   
}
function submitButtonClick(){
    const companyName=companyNameInput.value.trim();
    const about=aboutInput.value.trim();
    if(companyName==''||about==''){alertToast("company name or about are empty, please fill");return;}
    submitButton.disabled=true;

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/company/companyDetails", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    var serializedData = new URLSearchParams({companyName,about}).toString();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alert("changed sucessfully");
                closeButtonClick();
                submitButton.disabled=false;
            }
            else{
                alertToast(`${response["msg"]}`);
                submitButton.disabled=false;
            }
        }
    };
    xhr.send(serializedData);
}

function resertCompanyId(){
    resetCompanyIdButton.disabled=true;
    resetIcon.classList.add("fa-spin");

    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/company/resetCompanyId", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alertToast("reset succesfull");
                resetCompanyIdInput.value=response["companyId"];
                resetCompanyIdButton.disabled=false;
                resetIcon.classList.remove("fa-spin");
            }
            else{
                alertToast(`${response["msg"]}`);
                resetCompanyIdButton.disabled=false;
                resetIcon.classList.remove("fa-spin");
            }
        }
    };
    xhr.send();
}

function confirmCompanyPhotoChange(){
    modalHeader.innerHTML=` <h1 class="modal-title fs-5" id="exampleModalLabel">Confirm the company photo change</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div class="d-flex align-items-center justify-content-around">
    <i class="fa-solid fa-file fa-2xl"></i>
    <h3>${fileChangeRequest.name}</h3>
   </div>`;
    modalFooter.innerHTML=`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button type="button" class="btn btn-success" data-bs-dismiss="modal" onclick="confrimPhotoSubmission()">Change</button>`;
    modalShowerButton.click();

}

function confrimPhotoSubmission(){
    imgShowElement.style.opacity=0.5;
    spinnerForCompanyPhoto.classList.remove("d-none");
    var formData=new FormData();
    if(!fileChangeRequest){alert("please select photo");return;}
    formData.append('company-photo', fileChangeRequest);
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/company/companyPhoto", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alertToast("company photo change succesfull");
                imgShowElement.style.opacity=1;
                spinnerForCompanyPhoto.classList.add("d-none");
                const reader=new FileReader();
                reader.onload=function(e){
                    imgShowElement.src=e.target.result;
                }
                reader.readAsDataURL(fileChangeRequest);
            }
            else{
                alertToast(`${response["msg"]}`);
                imgShowElement.style.opacity=1;
                spinnerForCompanyPhoto.classList.add("d-none");
            }
        }
    };
    xhr.send(formData);
}
editButtonDiv.querySelector("#edit-button").addEventListener("click",editButtonClick);
submitButtonDiv.querySelector("#edit-close").addEventListener("click",closeButtonClick);
submitButton.addEventListener("click",submitButtonClick);
resetCompanyIdButton.addEventListener("click",resertCompanyId);
