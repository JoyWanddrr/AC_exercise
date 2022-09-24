const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/api'
const INDEX_URL = BASE_URL + '/v1/users/'
// Show API https://lighthouse-user-api.herokuapp.com/api/v1/users/:id
// ID 600~800

const userList = document.querySelector('#user-list')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const userPage = document.querySelector('#user-page')
const navHome = document.querySelector('#nav-home')
const modalName = document.querySelector('#modal-user-allName')
const modalImg = document.querySelector('.modal-avatar')
const modalDetail = document.querySelector('.modal-user-detail')
const topAvatar = document.querySelector('#top-avatar')//navbar圖標改變
const favorHeart = document.querySelector('#favor-heart')
const favorCount = document.querySelector('#f-count')

const USER_PAGE = 12
const users = []
let filterUserList = ''
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
             <a class='btn' style='color:tomato;'><i class="fa-regular fa-heart" data-id="${data.id}"></i></a>
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

// 自動產出分頁頁數(一頁要放12個)
function renderPaginator(page) {
  let totalPages = Math.ceil(page.length / USER_PAGE)
  let rawHTML = ''
  for (let i = 1; i <= totalPages; i++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${i}>${i}</a></li>`
  }
  userPage.innerHTML = `<li class="page-item">
        </a>${rawHTML}
      </li > `
}

// 輸出每頁的資料
function userPerPage(eachPages) {
  const data = filterUserList.length ? filterUserList : users
  const startIndex = (eachPages - 1) * USER_PAGE
  return data.slice(startIndex, eachPages * USER_PAGE)
}

// favorite 函式
function addToFavorite(id) {
  //設定user變數，將users.id取出與id(函式變數)，做比對。find會在遇到第一個符合的對象時結束。 
  const user = users.find((user) => user.id === id)
  // // // 設定不重複警告，使用some(布林值判斷)。P.S要注意把return加上，這裡不需要
  if (favoriteFriendsList.some((user) => user.id === id)) return
  // 將符合條件的user推進list中
  favoriteFriendsList.push(user)
  // 將list轉成字串丟進localStorage
  localStorage.setItem('favoriteFriends', JSON.stringify(favoriteFriendsList))
}

// 同學的寫法，省略掉  if (favoriteFriendsList.some((user) => user.id === id)) return，是不會重複加嗎?
// function addToFollowList(id) {
//   const member = MEMBER_LISTS.find(member => member.id === id)
//   list.push(member)
//   localStorage.setItem('followMember', JSON.stringify(list))
//   alert(`已加入追蹤`)
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
}

// 同學的寫法，更為簡潔?
// function delToFollowList(id) {
//   const listIndex = list.findIndex(list => list.id === id)
//   if (listIndex < 0) return //如果 index < 0 表示沒東西就中斷
//   list.splice(listIndex, 1)
//   localStorage.setItem('followMember', JSON.stringify(list))
//   alert(`已取消追蹤`)
// }



// 點擊navbar回首頁
navHome.addEventListener(('click'), function (event) {
  const indexPage = users.slice(0, 12)
  renderUserList(indexPage)
})


// 監聽事件(FOR MODAL)
userList.addEventListener('click', function userListClicked(event) {
  let target = event.target
  if (target.matches('.btn-show-user')) {
    modalInput(target.dataset.id)
  }
  else if (target.tagName === 'I') {
    if (target.matches('.fa-regular')) {
      // favorHeart.classList.toggle('fa-solid')//連動MODAL裡的顯示"愛心"，但好像要連棟外面的才會成功，單純只開modal會一直錯亂
      target.className = 'fa-heart fa-solid'
      favorHeart.className = 'fa-heart fa-solid'
      addToFavorite(Number(target.dataset.id))
    }
    else if (target.matches('.fa-solid')) {
      target.className = 'fa-heart fa-regular'
      favorHeart.className = 'fa-heart fa-regular'
      removeFromFavorite(Number(target.dataset.id))
    }
  }
  // 好友數根據好友名單長度做及時變化 
  favorCount.innerHTML = `my favorite friends :${favoriteFriendsList.length}`
})

// 同學成功的案例，matches
// DATA_PANEL.addEventListener('click', function onPanelClicked(event) {
//   if (event.target.matches('.btn-show-info')) {

//     showUserModal(Number(event.target.dataset.id)) //抓到該物件id
//   } else if (event.target.matches('.btn-add-follower')) {
//     if (event.target.matches('.add-color')) {
//       delToFollowList(Number(event.target.dataset.id))
//       displayUserList(getMemberByPage(page)) // 重新渲染畫面
//     } else {
//       addToFollowList(Number(event.target.dataset.id))
//       displayUserList(getMemberByPage(page)) // 重新渲染畫面
//     }
//   }
// })


// 點擊search button後的反應，監聽search form
searchForm.addEventListener('click', function clickedSearchButton(event) {
  // 使用preventDefault終止預設行為，不然會一直跳掉
  event.preventDefault()
  // 輸入的值
  let keySearch = searchInput.value.trim().toLowerCase()
  // 使用filter條件函式push新的陣列
  filterUserList = users.filter((user) => user.name.toLowerCase().includes(keySearch) || user.surname.toLowerCase().includes(keySearch))
  if (filterUserList.length === 0) {
    return alert('Oops! Try again!')
  }
  renderPaginator(filterUserList)
  renderUserList((userPerPage(1)))
})

// 連結分頁器與頁面輸出資料
userPage.addEventListener('click', function clickedPage(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderUserList(userPerPage(page))
})


favorCount.innerHTML = `my favorite friends: ${favoriteFriendsList.length}`

axios.get(INDEX_URL).then(response => {
  users.push(...response.data.results)
  renderPaginator(users)
  renderUserList(userPerPage(1))
})
  .catch((err) => console.log(err))
