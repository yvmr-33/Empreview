
const fin= document.getElementById("form-login");
const submitButton=document.getElementById("submit-button");
const checkBox=document.getElementById("flexCheckDefault");
const wholePageMessageShower=document.getElementById("message-shower");
const emailInput=document.getElementsByName("email");
const passwordInput=document.getElementsByName("password");

async function formSubmission(event){
    event.preventDefault();
    var formData= new FormData(this);
    //checking for checkbox is checked or not
    if(!checkBox.checked){
        checkBox.classList.add('is-invalid');
        return;
    }
    else{
        checkBox.classList.remove('is-invalid');
    }
    //verifying the data
    //clearing error box
    wholePageMessageShower.innerHTML='';
    //disabling the button
    submitButton.disabled=true;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/user/login", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    var serializedData = new URLSearchParams(formData).toString();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                var box=`<div class="alert alert-success" role="alert">${response["msg"]}. redirecting to home page...</div>`
                wholePageMessageShower.innerHTML=box;
                setTimeout(function(){window.location.replace('/v');},2000)
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

fin.addEventListener("submit",formSubmission);

//query reader

const urlParams = new URLSearchParams(window.location.search);

const email= urlParams.get("email");
const password= localStorage.getItem(email);
localStorage.removeItem(email);
if(email&&password&&emailInput&&passwordInput&&emailInput[0]&&passwordInput[0]){
    emailInput[0].value=email;
    passwordInput[0].value=password;
}

//a redirection to the forgot password

function redirectionForgotPassword(){
    if(emailInput[0].value){
        window.location.replace(`/forgot-password?email=${emailInput[0].value}`);
    }
    else{
        window.location.replace(`/forgot-password`);
    }
}