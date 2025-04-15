const commentBox =document.getElementById('comment-box-for-div');
const searchForm =document.getElementById('search-form');
const commentPersonView=document.getElementById('comment-person-view');
const commentBoxView=document.getElementById('comment-box-view');
const commentPersonViewImage=commentPersonView.querySelector('#comment-person-view-image');
const bannerBlock=commentPersonView.querySelector("#banner-block");
const commentPersonViewName=commentPersonView.querySelector('#comment-person-view-name');
const commentPersonViewAbout=commentPersonView.querySelector('#comment-person-view-about');
const commentPersonViewRatingBar=commentPersonView.querySelector('#comment-person-view-rating-bar');
const commetBoxContainer=document.getElementById('commet-box-container');

let dataComments=null;
let currentBox=null;
let b=0;

function backButton(){
    if(b==0){
        window.location.href = "/v/e";
    }else{
        commentPersonView.classList.add('d-none');
        commentBoxView.classList.remove('d-none');
        b=0;
    }
}

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



function boxMaker(i){
    var box=`<div class="col"  style="cursor: pointer; height:150px" onclick="changeToEmployee('${i.roleId}')">
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
                            <div class="d-flex justify-content-center">
                                    <h6>rating:&nbsp; </h6>
                                    <div class="rounded" style="width: 125px;height: 5px; background-color: white; margin-top: 8px;">
                                        <div style="width: ${i.rating*20}%;height: 5px; background-color: yellow;"></div>
                                    </div>
                                    <div style="margin-top: -2px;"> &nbsp;&nbsp;(${Math.round(i.rating*10)/10}/5)(${i.noOfRating})</div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </a>
                </div>`;
                return box;
  }

function getCommentData(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/rolesAndRequest/dataCommetsEmployee', true);
    xhr.onload = function(){
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
                dataComments=response["data"];
                commentBox.innerHTML="";
                if(dataComments.length==0){
                    commentBox.innerHTML='<h3 class="text-center" >There is no employee is asigned to you by admin</h3>';
                }
                dataComments.forEach(i => {
                    commentBox.innerHTML+=boxMaker(i);
                });
            }
            else{
                alertToast(`${response["msg"]}`);
            }
        }
    }
    xhr.send();
}

getCommentData();





function searchFormSubmission(event){
    event.preventDefault();
    var formData= new FormData(this);
    commentBox.innerHTML='';
    alertToast("Searching...");
    const searchInput=formData.get("search").trim();
    var arr=searchGivenInput(searchInput);
    if(arr.length==0){
        commentBox.innerHTML=`<h3 class="text-center" style="width:600px" >There is no request to the keyword</h3>`;
        return;
    }
    for(let i of arr){
        commentBox.innerHTML=commentBox.innerHTML+boxMaker(i);
    }
    findAndHighlightInDiv(searchInput);
    alertToast("Searched for the keyword");
}
function findAndHighlightInDiv(searchTerm) {
    if (commentBox && window.find && window.getSelection) {
        var removeHighlights = document.querySelectorAll('.highlight');
        removeHighlights.forEach(function (highlight) {
            highlight.classList.remove('highlight');
        });

        document.designMode = "on";
        var sel = window.getSelection();
        sel.collapse(commentBox, 0);

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

function searchGivenInput(data){
    data=data.trim();
    data=new RegExp(data.split('').map(char => `[${char.toUpperCase()}${char.toLowerCase()}]`).join(''), 'i');
    let newArray=dataComments.filter(function(element){
        if(data.test(element.name)||data.test(element.about)||data.test(element.rating)||data.test(element.noOfRating)){
            return true;
        }
        else{
            return false;
        }
    })
    return newArray;
}
searchForm.addEventListener("submit",searchFormSubmission);

function changeToEmployee(id){
    currentBox=id;
    commentBoxView.classList.add('d-none');
    commentPersonView.classList.remove('d-none');
    b=1;
    const d=dataComments.find((e)=>{return e.roleId==id});
    commentPersonViewImage.src=d.photo;
    commentPersonViewName.innerHTML=d.name;
    commentPersonViewAbout.innerHTML=d.about;
    if(d.banner!='default'){
        bannerBlock.children[0].classList.remove('d-none');
        bannerBlock.children[1].classList.add('d-none');
        bannerBlock.children[0].children[0].src=d.banner;
    }else{
        bannerBlock.children[1].classList.remove('d-none');
        bannerBlock.children[0].classList.add('d-none');
    }
    commentPersonViewRatingBar.children[0].children[0].style.width=d.rating*20+"%";
    commentPersonViewRatingBar.children[1].children[0].innerHTML=Math.round(d.rating*10)/10;
    commentPersonViewRatingBar.children[1].children[1].innerHTML=d.noOfRating;
    commentFencth();
}


function commentModalMaker(){
    modalHeader.innerHTML=`<h1 class="modal-title fs-5" id="exampleModalLabel">Comment box</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML=`<form id="comment-form"><div id="model-message-shower"></div><div class="row g-3">
        <div class="col-auto d-flex">
            <label for="rating">Rating :- </label>
            <div id="rating" class="mx-2" style="margin-top:-15px">
                <div class="rating">
                    <input type="radio" id="star5" name="rating" value="5">
                    <label for="star5"></label>
                    <input type="radio" id="star4" name="rating" value="4">
                    <label for="star4"></label>
                    <input type="radio" id="star3" name="rating" value="3">
                    <label for="star3"></label>
                    <input type="radio" id="star2" name="rating" value="2">
                    <label for="star2"></label>
                    <input type="radio" id="star1" name="rating" value="1">
                    <label for="star1"></label>
                </div>
            </div>
        </div>
        <div class="col-auto input-group">
                <label for="organisationName">Comment :- </label>
                <textarea class="form-control" placeholder="comment msg to the person (optional)"  id="aboutOrganisation" required name="msg"></textarea>
                <div class="invalid-tooltip">
                    please provide about section
                </div>
            </div>
            <div>
            <a href="#" onclick="alert('**You should choose the number of stars and the comment msessage(optional) and press the submit button that will submit the your comment to that person**')">Know more!</a>
            </div>
    </div></form>`;
    modalFooter.innerHTML=`<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary" id="create-organisation-submit" onClick="commentSubmission(this)">Submit</button>`;
    var modal = new bootstrap.Modal(modalTotal);
    modal.show();
}

function commentSubmission(element){
    const comentForm=document.getElementById('comment-form');
    const messageShower=document.getElementById("model-message-shower");
    var formData= new FormData(comentForm);
    //checking for checkbox is checked or not
    if(!formData.get('rating')){
        alertToast("Please give the rating");
        messageShower.innerHTML='<div class="alert alert-danger" role="alert">Please give the rating</div>';
        return;
    }
    //verifying the data
    //clearing error box
    formData.append('toWhomId',currentBox);
    messageShower.innerHTML='';
    //disabling the button
    element.disabled=true;


    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/comment/add", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    var serializedData = new URLSearchParams(formData).toString();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==201){
                var box=`<div class="alert alert-success" role="alert">${response["msg"]}.</div>`
                messageShower.innerHTML=box;
                commentFencth();
            }
            else{
                var box=`<div class="alert alert-danger" role="alert">${response["msg"]}</div>`
                messageShower.innerHTML=box;
                submitButton.disabled =false;
            }
        }
    };

    xhr.send(serializedData);
}

function commentFencth(){

    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/comment/viewComments?toWhomId=${currentBox}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.responseText);
            if(xhr.status==200){
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
      </div>
    </div>`;
    return box;
}