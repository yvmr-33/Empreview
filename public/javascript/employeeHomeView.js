const commetBoxContainer = document.getElementById("commet-box-container");


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


  function commentFencth(){

    var xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/comment/viewComments`, true);
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

commentFencth();