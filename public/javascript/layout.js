  const siginDiv=document.getElementById("sign-button-div");
  var modalTotal=document.getElementById("modal");
  var modalHeader=document.getElementById("modalHeader");
  var modalBody=document.getElementById("modalBody");
  var modalFooter=document.getElementById("modalFooter");
  const offcanvasBodyData=document.getElementById("offcanvas-body-data");
  const toastLive= document.getElementById('liveToast');
  const toastBody=toastLive.querySelector("#toast-body");
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);

  async function signUpCheckUsingRequestToServer(){

      var cookies = document.cookie.split('; ');

      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var [name, value] = cookie.split('=');

        if (name === 'usercredentails') {
          siginDiv.children[0].classList.add("d-none");
          siginDiv.children[1].classList.remove("d-none");
        }else{
          siginDiv.children[0].classList.remove("d-none");
          siginDiv.children[1].classList.add("d-none");
        }
      }
  }

  function logoutModalsetter(){
    modalHeader.innerHTML=` <h1 class="modal-title fs-5" id="exampleModalLabel">logout</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<div class="d-flex flex-column  justify-content-center align-items-around">
        <button type="button" class="btn btn-danger" onclick="logout(this)" data-bs-dismiss="modal">logout from this device</button>
        <button type="button" class="btn btn-danger mt-3" onclick="logout(this)" data-bs-dismiss="modal" id="logout-from-all-device">logout from all the devices</button>
        </div>`;
    modalFooter.innerHTML=`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
  }

  function logout(calingElement){
    var xhr = new XMLHttpRequest();
    if(calingElement.id==="logout-from-all-device"){
      xhr.open("POST", "/api/user/logout-from-all-device", true);
    }
    else{
      xhr.open("POST", "/api/user/logout", true);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
              siginDiv.children[0].classList.remove("d-none");
              siginDiv.children[1].classList.add("d-none");
              // window.location.replace('/');
              return true;
            }
            else if(xhr.status==400){
              return false;
            }
            else{
              alert(response.msg);
              return false;
            }
        }
    };
    xhr.send();
  }

function alertToast(msg){
  toastBody.innerHTML=msg;
  toastBootstrap.show()
}
function myProileRedirect(){
  window.location.replace(`/my-profile?from=${window.location.pathname}`);
}

signUpCheckUsingRequestToServer();

let notificationData=[];

function notificationFecth(){
  var xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/notification/get`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
              notificationData=response.data;
              noticationKeepTheData();
            }
            else{
                noticationKeepTheData(response.msg);
                alert(response.msg);
            }
        }
    }
    xhr.send();
}

function noticationKeepTheData(err){
  if(err||notificationData.length==0){
    // show there is no notification
    offcanvasBodyData.innerHTML='<div class="d-flex flex-column justify-content-center align-items-center" style="height: 100%;"> <p class="text-primary">no notification</p></div>';
    return;
  }
  offcanvasBodyData.innerHTML="";
  notificationData.forEach(i=>{
    offcanvasBodyData.innerHTML+=notificationBoxMaker(i);
  });
}

function notificationBoxMaker(i){
  var box=`      <div class="card text-bg-${i.read?"light":"warning"}   mb-3" style="max-width: 100%;" id="${i._id}">
        <div class="card-header d-flex justify-content-between">
          ${i.companyName}
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close" onclick="removeNotificationBox('${i._id}',this)"></button>
        </div>
        <div class="card-body">
          <h5 class="card-title">${i.msg}</h5>
          <p class="card-text text-end">${formatDate(i.time,true)} </p>
        </div>
      </div>`;
  return box;
}

function removeNotificationBox(id,element){
  if(element){
    element.parentElement.parentElement.remove();
    //if is not found it will stop here only because of null error
  }
  else{
    document.getElementById(id).remove();
    //if is not found it will stop here only because of null error
  }
  notificationData=notificationData.filter(i=>i._id!=id);
  if(notificationData.length==0){
    offcanvasBodyData.innerHTML='<div class="d-flex flex-column justify-content-center align-items-center" style="height: 100%;"> <p class="text-primary">no notification</p></div>';
  }
  var xhr = new XMLHttpRequest();
    xhr.open('DELETE', `/api/notification/remove/${id}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
            }
            else{
                alert(response.msg);
            }
        }
    }
    xhr.send(JSON.stringify({id:id}));
}

function formatDate(inputDate,dayShow=null) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const dateObj = new Date(inputDate);
  const day = dateObj.getUTCDate();
  const monthIndex = dateObj.getUTCMonth();
  const year = dateObj.getUTCFullYear();
  const formattedDay = day < 10 ? `0${day}` : day;
  if(dayShow){
    return `${formattedDay} ${months[monthIndex]} ${year}`;
  }
  else{
    return `${months[monthIndex]}-${year}`;
  }
}


