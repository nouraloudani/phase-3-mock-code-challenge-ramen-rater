// info && pseudo code:
// GET /ramens
// GET /ramens/:id
// PATCH /ramens/:id
// 1 show all images here <div id="ramen-menu">
// 2 show single ramen info in <div id="ramen-detail">
// 3 update the rating and the comments by submiting the form. only update the server /refresh is ok 

loadAllRamensPage()

// ******************* Dom Elements *****************
const ramenMenuDiv = document.querySelector('#ramen-menu');
const ramenDetailFormDiv = document.querySelector('#ramen-detail-form');
const newRamenForm = document.querySelector('#new-ramen');


// ******************* Network Requests *****************
function loadAllRamensPage(){
    fetch('http://localhost:3000/ramens')
    .then(res => res.json())
    .then(ramensArray => showRamenImages(ramensArray))
    //showRamenImages returns the first found ramen id. 
    //reason is to always have an image of the first element when loading the page.
    .then(loadRamenDetails)
}


function loadRamenDetails(objId){
    fetch(`http://localhost:3000/ramens/${objId}`)
    .then(res => res.json())
    .then(ramenObj => showDetails(ramenObj))
}

function updateFetch(updatedObj, formRamenId){
    fetch(`http://localhost:3000/ramens/${formRamenId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedObj)
    })
}


function postNewRamen(newFormObj){
    fetch(`http://localhost:3000/ramens`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFormObj)
    })
    .then(loadAllRamensPage)
}


function deleteRequest(id){
    fetch(`http://localhost:3000/ramens/${id}`,{
        method: 'DELETE'
    })
    .then(loadAllRamensPage)
}



// ******************* Dom Manipulation / functions *****************
function showRamenImages(ramensArray){

    // console.log(ramensArray);
    ramenMenuDiv.innerHTML = ""
    ramensArray.forEach(ramen => {
        let deleteBtn = document.createElement('button');
        deleteBtn.innerText = `X`;
        deleteBtn.className = 'button';
        deleteBtn.setAttribute('data-id',`${ramen.id}`);
        ramenMenuDiv.append(deleteBtn);
        let img = document.createElement('img');
        img.src = ramen.image;
        img.alt = ramen.name;
        img.className = "detail-image";
        img.setAttribute('data-id',`${ramen.id}`);
        ramenMenuDiv.append(img);
        }) 
    return ramensArray[0].id;
}

function btnHandler(e){
    if (e.target.className === "detail-image"){
        // console.log(e.target.dataset.id)
        let ramenID = e.target.dataset.id;
        loadRamenDetails(ramenID)
    }else if (e.target.matches('.button')){
        let ramenId = e.target.dataset.id
        deleteAlert()
        deleteRequest(ramenId)
    }
}

function showDetails(ramenObj){
    // console.log(ramenObj)
    ramenDetailFormDiv.innerHTML = ""
    ramenDetailFormDiv.innerHTML = `
        <div id="ramen-detail">
        <img class="detail-image" src="${ramenObj.image}" alt="${ramenObj.name}"/>
        <h2 class="name">${ramenObj.name}</h2>
        <h3 class="restaurant">${ramenObj.restaurant}</h3>
        </div>
        <form id="ramen-rating" data-id="${ramenObj.id}">
        <label for="rating">Rating: </label>
        <input type="text" name="rating" id="rating" value="${ramenObj.rating}" />
        <label for="comment">Comment: </label>
        <textarea name="comment" id="comment">${ramenObj.comment}</textarea>
        <input type="submit" value="Update" />
        </form>
    `
    const ramenForm = document.querySelector('#ramen-rating');
    ramenForm.addEventListener('submit', event=>{
    event.preventDefault()
    // console.log("submit")
    let formRamenId = parseInt(event.target.dataset.id)
    updateFetch(gatherInfo(event), formRamenId)
    // event.target.reset()
    })
}

function gatherInfo(event){
    let commentValue = event.target.comment.value;
    let ratingValue = parseInt(event.target.rating.value);
    let updatedObj = {rating: ratingValue, comment: commentValue}
    return updatedObj
}

function grabNewFormInfo(e){
    e.preventDefault()
    let newFormObj = {
        name: e.target.name.value,
        restaurant: e.target.restaurant.value,
        image: e.target.image.value,
        rating: parseInt(e.target.rating.value),
        comment: e.target.comment.value
    }
    postNewRamen(newFormObj)
    e.target.reset()
}


// ******************* Events Listeners *****************
ramenMenuDiv.addEventListener('click', btnHandler)
newRamenForm.addEventListener('submit', grabNewFormInfo)
// deleteBtn.addEventListener('click', (e) => {
//     console.log(e.target)

ramenMenuDiv.addEventListener('click', btnHandler)


function deleteAlert() {
    alert("You are about to delete the bowl!");
}




