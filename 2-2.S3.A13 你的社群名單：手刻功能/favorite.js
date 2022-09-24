const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/api'
const INDEX_URL = BASE_URL + '/v1/users/'
// Show API https://lighthouse-user-api.herokuapp.com/api/v1/users/:id
// ID 600~800

const userList = document.querySelector('#user-list')
const modalName = document.querySelector('#modal-user-allName')
const modalImg = document.querySelector('.modal-avatar')
const modalDetail = document.querySelector('.modal-user-detail')
const topAvatar = document.querySelector('#top-avatar')//navbar圖標改變
const favorHeart = document.querySelector('#favor-heart')
const favorCount = document.querySelector('#f-count')
// 設定取出的value放入favoriteFriendsList當中(使用||左邊會優先運行)。當getItem為null時(沒有任何值)，回傳空陣列。使用parse，因為favoriteFriendsList是字串型態，在localStorage要使用object型態
const favoriteFriendsList = JSON.parse(localStorage.getItem('favoriteFriends')) || []//設為全域變數，為刪除好友做準備

// 設計函式將資料輸入
function renderUserList(user) {
  let rawHTML = ''
  user.forEach((data) => {
    rawHTML += `<div class="col-sm-2">
        <div class="card m-2">
          <img src=" ${data.avatar}" class="card-img-top" alt="avatar" id="user-img">
          <div class="card-body">
            <h5 class="card-title" id="user-name">${data.name}</h5>
            <a href="#" class="btn btn-primary btn-show-user" data-id="${data.id}" data-bs-toggle="modal"
              data-bs-target="#user-info">more</a>
            <a class='btn' style='color:tomato;'><i class="fa-solid fa-heart" data-id="${data.id}"></i></a>
          </div>
        </div>
    </div>`
  })
  userList.innerHTML = rawHTML
}

// 處理MODAL資料，點擊MORE讀取ID，再從ID回傳其他資料
function modalInput(id) {
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
      modalImg.src = data.avatar
      topAvatar.src = data.avatar
    })
    .catch(error => console.log(error))
}

// // favorite 函式
// function addToFavorite(id) {
//   //設定user變數，將users.id取出與id(函式變數)，做比對。find會在遇到第一個符合的對象時結束。 
//   const user = users.find((user) => user.id === id)
//   // // // 設定不重複警告，使用some(布林值判斷)。P.S要注意把return加上，這裡不需要
//   if (favoriteFriendsList.some((user) => user.id === id)) return
//   // 將符合條件的user推進list中
//   favoriteFriendsList.push(user)
//   // 將list轉成字串丟進localStorage
//   localStorage.setItem('favoriteFriends', JSON.stringify(favoriteFriendsList))
// }

// removeFromFavorite函式
function removeFromFavorite(id) {
  for (const fUser of favoriteFriendsList) {
    if (fUser.id === id) {
      const fUserIndex = favoriteFriendsList.indexOf(fUser)
      favoriteFriendsList.splice(fUserIndex, 1)
      localStorage.setItem('favoriteFriends', JSON.stringify(favoriteFriendsList))
    }
  }
  favorCount.innerHTML = `my favorite friends: ${favoriteFriendsList.length}`
  renderUserList(favoriteFriendsList)

}



// 監聽事件(FOR MODAL)
userList.addEventListener('click', function userListClicked(event) {
  let target = event.target
  // if (target.matches('.btn-show-user')) {
  //   modalInput(target.dataset.id)
  // } else if (target.matches('.fa-solid')) {
  //   target.className = 'fa-heart fa-regular'
  //   removeFromFavorite(Number(target.dataset.id))
  // }
  // // 好友數根據好友名單長度做及時變化 
  // favorCount.innerHTML = `my favorite friends :${favoriteFriendsList.length}`
  if (target.matches('.fa-solid')) {
    target.className = 'fa-heart fa-regular'
    removeFromFavorite(Number(target.dataset.id))
    console.log(target.dataset.id)
  }
})

favorCount.innerHTML = `my favorite friends: ${favoriteFriendsList.length}`
renderUserList(favoriteFriendsList)