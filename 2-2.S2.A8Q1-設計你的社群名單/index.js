const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/api'
const INDEX_URL = BASE_URL + '/v1/users/'
// Show API https://lighthouse-user-api.herokuapp.com/api/v1/users/:id
// ID 600~800
const userList = document.querySelector('#user-list')
const users = []
// 設計函式將資料輸入
function renderUserList(user) {
  let rawHTML = ''
  user.forEach((data) => {
    rawHTML += `<div class="col-sm-2">
        <div class="card">
          <img src=" ${data.avatar}" class="card-img-top" alt="avatar" id="user-img">
          <div class="card-body">
            <h5 class="card-title" id="user-name">${data.name}</h5>
            <a href="#" class="btn btn-primary btn-show-user" data-id="${data.id}" data-bs-toggle="modal"
              data-bs-target="#user-info">more</a>
          </div>
        </div>
    </div>`
  })
  userList.innerHTML = rawHTML
}

// 監聽事件(FOR MODAL)
userList.addEventListener('click', function userListClicked(event) {
  if (event.target.matches('.btn-show-user')) {
    modalInput(event.target.dataset.id)

  }
})
// 處理MODAL資料，點擊MORE讀取ID，再從ID回傳其他資料
function modalInput(id) {
  const modalName = document.querySelector('#modal-user-allName')
  const modalImg = document.querySelector('#modal-user-avatar')
  const modalDetail = document.querySelector('#modal-user-detail')
  axios.get(INDEX_URL + id)
    .then(response => {
      const data = response.data
      modalName.innerHTML = `${data.name}   ${data.surname}`
      // modalDetail.innerHTML = `<ul style='list-style:none'>
      // <li>email:${data.email}</li>
      // <li>gender:${data.gender}</li>
      // <li>age:${data.age}</li>
      // <li>region:${data.region}</li>
      // <li>birthday:${data.birthday}</li>
      // </ul>`
      modalDetail.innerHTML = `<p>${data.email}</p>
          <p>gender:${data.gender}</p>
          <p>age:${data.age}</p>
          <p>region:${data.region}</p>
          <p>birthday:${data.birthday}</p>`
      modalImg.innerHTML = `<img src="${data.avatar}" alt="user-avatar" class="img-fluid">`
      const topAvater = document.querySelector('#top-avatar')
      topAvater.src = data.avatar
    })

}



axios.get(INDEX_URL).then(response => {
  users.push(...response.data.results)
  renderUserList(users)
})
  .catch((err) => console.log(err))