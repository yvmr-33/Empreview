const formEmail=document.getElementById("form-email");
const formNext=document.getElementById("form-next");
const wholePageMessageShower=document.getElementById("message-shower");
const sideHeading=document.getElementById("side-heading");
const emailInput=document.getElementsByName("email");

let email='';

function formSubmissionEmail(event){
    event.preventDefault();
    var formData=new FormData(this);
    var xhr=new XMLHttpRequest();
    //removing all invalid
    for (let a of document.querySelectorAll(".is-invalid")){
        a.classList.remove("is-invalid");
    }
    var emailForm=true;
    if(this===formEmail){
        xhr.open("POST", "/api/otp/send", true);
        email=formData.get('email');
    }
    else{
        xhr.open("PUT", "/api/otp/reset-password", true);
        const passconf=document.getElementsByName("confirm-password");
        if(formData.get("password")!==formData.get("confirm-password")){
            passconf[0].classList.add("is-invalid");
            return;
        }
        formData.set('email',email);
        emailForm=false;
    }
    //disabing the button
    const submitButton=this.querySelector(".btn");
    submitButton.disabled=true;
    //clearing error message block
    wholePageMessageShower.innerHTML='';
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    var serializedData = new URLSearchParams(formData).toString();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                if(emailForm){
                    var box=`<div class="alert alert-success" role="alert">${response["msg"]}.</div>`
                    sideHeading.innerHTML="enter your otp and new passord";
                }
                else{
                    var box=`<div class="alert alert-success" role="alert">${response["msg"]}. redirecting to login page ....</div>`
                    setTimeout(function(){window.location.replace(`/login`);},3000)   
                }
                wholePageMessageShower.innerHTML=box;
                formEmail.classList.add("d-none");
                formNext.classList.remove("d-none");
            }
            else{
                var box=`<div class="alert alert-danger" role="alert">${response["msg"]}</div>`
                wholePageMessageShower.innerHTML=box;
                submitButton.disabled =false;
            }
        }
    };
    xhr.send(serializedData);
}

formEmail.addEventListener("submit",formSubmissionEmail);
formNext.addEventListener("submit",formSubmissionEmail);

//checking for the query

const urlParams = new URLSearchParams(window.location.search);

const emailI= urlParams.get("email");

if(emailI&&emailInput&&emailInput[0]){
    emailInput[0].value=emailI;
}
if(urlParams.get("from")){
    const backButton=document.getElementById("back-button");
    backButton.href=urlParams.get("from");
}
if(urlParams.get("heading")){
    const heading=document.getElementById("heading-of-page");
    heading.innerHTML=urlParams.get("heading");
}