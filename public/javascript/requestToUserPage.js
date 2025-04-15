const jb=document.getElementById("join-button");
const rb=document.getElementById("reject-button");


async function selection(type){

    var xhr = new XMLHttpRequest();
    const urlParams = new URLSearchParams(window.location.search);
    const companyId= urlParams.get("c");
    const formData={companyId};
    jb.disabled=true;
    rb.disabled=true;
    if(type=="reject"){
        xhr.open("DELETE", "/api/requestTouser/d", true);
    }
    else{
        xhr.open("POST", "/api/requestTouser/a", true);
    }
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    var serializedData = new URLSearchParams(formData).toString();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                alertToast(response.msg+" redirecting to the home ");
                setTimeout(function(){window.location.replace('/v');},4000)
            }
            else{
                alertToast(response.msg);
                jb.disabled=false;
                rb.disabled=false;
            }
        }
    };

    xhr.send(serializedData);

}