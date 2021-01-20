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


// ******************* Network Requests *****************
function loadAllRamensPage(){
    fetch('http://localhost:3000/ramens')
    .then(res => res.json())
    .then(ramensArray => showRamenImages(ramensArray))
}


function loadRamenDetails(objId){
    fetch(`http://localhost:3000/ramens/${objId}`)
    .then(res => res.json())
    .then(ramenObj => showDetails(ramenObj))
}

function updateFetch(formRamenId){
    fetch(`http://localhost:3000/ramens/${formRamenId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedObj)
    })
    // .then(res => res.json())
    // .then(console.log)
}



// ******************* Dom Manipulation / functions *****************
function showRamenImages(ramensArray){
    // console.log(ramensArray);
    ramensArray.forEach(ramen => {
        let img = document.createElement('img');
        img.src = ramen.image;
        img.alt = ramen.name;
        img.className = "detail-image";
        img.setAttribute('data-id',`${ramen.id}`)
        ramenMenuDiv.append(img);
        // console.log(img);
    })
}

function imgBtnHandler(e){
    if (e.target.className === "detail-image"){
        // console.log(e.target.dataset.id)
        let ramenID = e.target.dataset.id;
        loadRamenDetails(ramenID)
    }
}

function showDetails(ramenObj){
    console.log(ramenObj)
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
    let formRamenId = parseInt(event.target.dataset.id)
    updateFetch(formRamenId)
    let commentValue = event.target.comment.value;
    let ratingValue = event.target.rating.value;
    let updatedObj = {Rating: ratingValue, Comment: commentValue}
    event.target.reset()
    })
}





// ******************* Events Listeners *****************
ramenMenuDiv.addEventListener('click', imgBtnHandler)





