const cl = console.log;
const titleControl = document.getElementById('title');
const bodyControl = document.getElementById('body');
const userId = document.getElementById('userId');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const postForm = document.getElementById('postForm');
const postContainer = document.getElementById('postContainer');
const spinner = document.getElementById('spinner');



let postArr = [];



let BaseURL = "https://jsonplaceholder.typicode.com";
let post_Url = `${BaseURL}/posts`;

function snackbar(msg,icon){
    Swal.fire({
        title:msg,
        icon:icon,
        timer:3000
    });
}

function makeApiCall(methodName,API_URL,body = null,successcb,errorCb){

    spinner.classList.remove('d-none');

    body = body ? JSON.stringify(body) : null
    
    let xhr =  new XMLHttpRequest();

    xhr.open(methodName,API_URL);

    xhr.send(body);

    xhr.onload = function () {
        if(xhr.status>=200 && xhr.status<=299){
            let response = JSON.parse(xhr.response);
            if(methodName === 'GET'){
                successcb(response);
            }else if(methodName === 'POST'){
                let obj = {...JSON.parse(body),id:response.id}
                successcb(obj);
            }else if(methodName === 'GET'){
              successcb(response);
            }else if(methodName === 'PATCH' || methodName === 'PUT'){
             
             successcb(JSON.parse(body));
            }
            
            
            
            else 
              {
                successcb();

            }
        }else{
            errorCb(xhr)
        }
    spinner.classList.add('d-none');

    }
    xhr.onerror = function () {
        errorCb(xhr);
    spinner.classList.add('d-none');

    }

}

function creatCards(eve) {
  let result = "";

  eve.forEach((ele) => {
    result += `
      <div class="col-md-4 mt-4" id="${ele.id}">
        <div class="card h-100">
          <div class="card-header">
            <h2>${ele.title}</h2>
          </div>
          <div class="card-body">
            <p>${ele.body}</p>
            <h1>${ele.userId}</h1>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-primary btn-sm" onclick="onEdit(this)">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="removeFun(this)">Delete</button>
          </div>
        </div>
      </div>
    `;
  });

  postContainer.innerHTML = result;
}

makeApiCall('GET',post_Url,null,creatCards,snackbar);


function onPostCreate(eve){
    
    eve.preventDefault();
    
    let newObj = {
        title:titleControl.value,
        body:bodyControl.value,
        userId:userId.value
    }
    makeApiCall('POST',post_Url,newObj,createSingleCard,snackbar);
}
    function createSingleCard(response){
         let div = document.createElement("div");
      div.className = "col-md-4 mt-4";
      div.id = response.id;

      div.innerHTML = `
        <div class="card h-100 shadow ">
          <div class="card-header">
            <h2>${response.title}</h2>
          </div>
          <div class="card-body">
            <p>${response.body}</p>
            <h1>${response.userId}</h1>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-primary btn-sm" onclick="onEdit(this)">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="removeFun(this)">Delete</button>
          </div>
        </div>`

        postContainer.prepend(div);
        postForm.reset();
    }



postForm.addEventListener('submit',onPostCreate);


function removeCallBack(){
    let remove_id = localStorage.getItem('remove_id');
    document.getElementById(remove_id).remove();
     Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
    });
}

function removeFun(ele){
    let remove_id = ele.closest('.col-md-4').id;
    let remove_url  = `${BaseURL}/posts/${remove_id}`;
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {          
            localStorage.setItem('remove_id',remove_id);
            makeApiCall('DELETE',remove_url,null,removeCallBack,snackbar)
        }
    });
    
}

function patchDataInform(postObj){
  titleControl.value = postObj.title;
  bodyControl.value = postObj.body;
  userId.value = postObj.userId;
  addBtn.classList.add('d-none');
  updateBtn.classList.remove('d-none')
  postForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


}


function onEdit(ele){
    let editId = ele.closest(".col-md-4").id;
    localStorage.setItem('editId',editId);
    let edit_url = `${BaseURL}/posts/${editId}`;
    makeApiCall('GET',edit_url,null,patchDataInform,snackbar)
}

function onPostUpdate(){
  let updateId = localStorage.getItem('editId');
  let updateUrl =  `${BaseURL}/posts/${updateId}`;
  let updateObj = {
        title:titleControl.value,
        body:bodyControl.value,
        userId:userId.value,
        id:updateId

  }
makeApiCall('PATCH', updateUrl, updateObj, updatePostCard, snackbar);

}
function updatePostCard(updateObj){
  let card = document.getElementById(updateObj.id);
  card.querySelector('.card-header h2').innerHTML=updateObj.title;
  card.querySelector('.card-body p').innerHTML=updateObj.body;
  card.querySelector('.card-body h1').innerHTML=updateObj.userId;

   addBtn.classList.remove('d-none');
  updateBtn.classList.add('d-none');
setTimeout(() => {
  
  
        card.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, 100);
  postForm.reset();




}
updateBtn.addEventListener('click',onPostUpdate);