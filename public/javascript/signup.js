const pin=document.querySelector("#photo-input");
const pim=document.querySelector("#photo-preview");
const bin=document.querySelector("#banner-input");
const bim=document.querySelector("#banner-preview");
const fin=document.querySelector("#form-signup");
const emailError=document.getElementById("email-error-shower");
const wholePageMessageShower=document.getElementById("whole-page-message-shower");
const submitButton=document.getElementById("submit-button")

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

pin.addEventListener('change',customElementPreview(pim));
bin.addEventListener('change',customElementPreview(bim));

//from submission 

function formSubmission(event){
    event.preventDefault();
    var formData=new FormData(this);
    var xhr=new XMLHttpRequest();
    //removing the all the invalid
    for (let a of document.querySelectorAll(".is-invalid")){
        a.classList.remove("is-invalid");
    }
    //changing the error of email 
    emailError.innerHTML="please provide email";
    //clearing main error
    wholePageMessageShower.innerHTML='';
    //conforming the password
    const passconf=document.getElementsByName("confirm-password");
    if(formData.get("password")!==formData.get("confirm-password")){
        passconf[0].classList.add("is-invalid");
        return;
    }
    else{
        passconf[0].classList.remove("is-invalid");
    }
    //disabling the submit button
    submitButton.disabled =true;
    //clearing error box
    wholePageMessageShower.innerHTML='';
    //sending the data to client
    xhr.open("POST","/api/user/sigin",true);
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==201){formData.get("email")
                var box=`<div class="alert alert-success" role="alert">${response["msg"]}. redirecting to login page...</div>`
                wholePageMessageShower.innerHTML=box;
                localStorage.setItem(`${formData.get("email")}`, `${formData.get("password")}`);
                //local storage will be deleted in the page once after login
                setTimeout(function(){window.location.replace(`/login?email=${formData.get("email")}`);},3000)
            }
            else{
                if(response["email"]){
                    const passconf=document.getElementsByName("email");
                    emailError.innerHTML=response["email"];
                    passconf[0].classList.add("is-invalid");
                }
                else if(typeof(response["msg"])=="object"){
                    for(let a in response["msg"]){
                        const passconf=document.getElementsByName(a);
                        passconf[0].classList.add("is-invalid");
                    }
                }
                else{
                    var box=`<div class="alert alert-danger" role="alert">${response["msg"]}</div>`
                    wholePageMessageShower.innerHTML=box;
                }
                submitButton.disabled =false;

            }
        }
    }
    xhr.send(formData);
}

fin.addEventListener("submit",formSubmission);


const forms = document.querySelectorAll('.needs-validation')