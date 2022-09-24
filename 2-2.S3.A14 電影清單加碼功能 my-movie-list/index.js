const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
// 讀取圖片
const POSTER_URL = BASE_URL + '/posters/'
// 將一頁總共要有幾個電影設定好
const MOVIE_PER_PAGE = 12


const dataPanel = document.querySelector('#data-panel')
// search功能設定提取的節點
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const switchToList = document.querySelector('#switch-to-list')
const switchToCard = document.querySelector('#switch-to-card')
const searchBar = document.querySelector('#search-bar')
// 抓取顯示頁面的數字節點
const showPage = document.querySelector('#page-name')


// 將電影名稱輸出，使用const代表不能更改所以不能賦值(使用'=')，所以我們需要用 movies.push() 的方式把資料放進去。可參考保存資料的方式:By Value v.s. By Reference
const movies = []
// 設定搜尋結果放入的陣列
let filteredMovies = []


// 設定function可以render資料
function renderMovieList(data) {
  let rawHTML = ''
  // 使用forEach將資料分別帶入
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image
      }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id=${item.id}>More</button>
      
          <button class="btn btn-info btn-add-favorite" data-id=${item.id}>+</button>
        </div>
      </div>
    </div>
  </div>`
  })
  // 將資料放回
  dataPanel.innerHTML = rawHTML
}

// 設計函數能輸出modal的內容，要該改的項目分別有title、img、data、description
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImg = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id)
    .then(response => {
      const data = response.data.results
      modalTitle.innerText = data.title
      modalDate.innerText = 'Release date: ' + data.release_date
      modalDescription.innerText = data.description
      modalImg.innerHTML = `<img src="${POSTER_URL + data.image
        }" alt="movie-poster" class="img-fluid">`

    })
}

// 設計函式將每頁的電影資料列出
function getMovieByPage(page) {
  // 因為搜尋也需要分頁，所以設定一個變數，可以放neither movie nor search。filteredMovies.length為計算filterMovies是否為空陣列，不為空時計算filteredMovies的分頁電影資料，為空時則計算movies
  const data = filteredMovies.length ? filteredMovies : movies
  // page1->0~11部電影資料輸入，以此類推。起始位置計算方式:當為第一頁時，起始資料為0，最後一個資料為一頁資料總數減一。結束位置:起始位置+一頁資料總數(因為slice的結束位置不會回傳本身資料)
  const startIndex = (page - 1) * MOVIE_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIE_PER_PAGE)

}

// 計算有幾個分頁js輸出
function renderPaginator(amount) {
  // 總數/一頁幾個，餘數也有一頁，所以最後計算出來的總數+1，直接使用函式無條件進位
  const numberOfPage = Math.ceil(amount / MOVIE_PER_PAGE)
  let rawHTML = ''
  // 將分頁格式輸入，設定id給等下監聽器使用(點擊分頁會跳頁)
  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += ` <li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}


// 設計輸出我的最愛函式，在這裡會使用到LocalStorage，因為我們要把收藏的元素暫存在使用者瀏覽器，然後在叫出來輸出在收藏頁面
function addToFavorite(id) {
  // 設定取出的value放入list當中(使用||左邊會優先運行)。當getItem為null時(沒有任何值)，回傳空陣列。但因為在localStorage裡的資料，list是字串型態，所以要轉成object

  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  // 將ID對應的電影找出來，由於一次只會加一個，所以使用FIND(會在找到第一個相符的時候break)
  // movie.id是movies陣列裡面一一取出的movie id。而後面的id則是監聽器點擊出現的id
  const movie = movies.find((movie) => movie.id === id)

  // 設定不重複警告，使用some(布林值判斷)。P.S要注意把return加上
  if (list.some((movie) => movie.id === id)) {
    return alert('電影已在清單中!')
  }
  // 將符合條件的movie推進list中
  list.push(movie)
  console.log(list)
  // 將list轉成字串丟進localStorage
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// 設計切換成list格式的函式
function changeToList(pagess) {
  // 點擊list icon時，當前頁面要直接轉換。頁面分別有:搜尋、頁數對應等等。所以函數的參數應該是數字(頁數，即使是搜尋出來的資料，也依舊回傳給頁數)。注意搜尋的資料都在搜尋的監聽器裡執行。輸出的資料依舊在dataPanel裡。
  let movieList = getMovieByPage(pagess)
  let rawHTML = ''
  rawHTML = '<ul class="list-group">'
  for (const item of movieList) {
    rawHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">
          ${item.title}
          <span>
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id=${item.id}>More</button>
          <button class="btn btn-info btn-add-favorite" data-id=${item.id}>+</button>
          </span>
        </li>`
  }
  rawHTML += '</ul>'
  dataPanel.innerHTML = rawHTML
}

// 監聽切換list按鈕
searchBar.addEventListener('click', function clickedList(event) {
  const nowPage = showPage.textContent
  if (event.target.className === 'fa-solid fa-list mr-6 fa-xl') {
    changeToList(nowPage)
  } else if (event.target.className === 'fa fa-th mr-6 fa-xl') {
    renderMovieList(getMovieByPage(nowPage))
  }
})




// 監聽 data panel，當點擊More的時候出現modal，由於dataset回傳的是字串，需要轉乘數字才能放入函數讀取
// Q但是沒有放NUMBER也可以正常運行?因為在axios.get(INDEX_URL + id)裡，兩者都是STRING，所以不用加。但是在else if裡面要用到的就是數字間的比對，所以要轉成數字(movie.id === id)
// 當event.target有match填入的參數時，運行XXXX函式(event.target的dataset.id)
dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal((event.target.dataset.id))
  }
  // 在dataPanel之下，將favorite(+)也納入監聽器的範圍，才能收藏(運行addToFavorite函式)。若使用者點擊了收藏按鈕，就會呼叫 addToFavorite() 並傳入電影的 id。
  else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

// 設計分頁的監聽器
paginator.addEventListener('click', function onPaginatorClicked(event) {
  // 使用if來檢查是否點擊到正確的頁面，在點擊目標的tagName中不含<a></a>時，中斷
  if (event.target.tagName !== 'A') return
  //使用dataset。點擊目標裡的dataset有page就會對應讀取
  // Q:理論上是要轉成數字，但是使用console.log印出時卻不是字串??不轉也能使用，又是遇到JS自動轉換型別嗎?查看型別，page是string沒錯，但在函數裡面的startIndex為數字
  const page = Number(event.target.dataset.page)
  // 將對應讀取到的page使用getMoviesByPage函數讀取該輸出的movies資料，在用renderMovieList列出格式
  renderMovieList(getMovieByPage(page))
  showPage.innerHTML = `${page}`
})



// 'submit'表單的提交事件。監聽器掛在search bar 的form裡面(提取節點form)

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  // 瀏覽器對某些網頁元素具有預設行為， EX:* 點擊 form 裡的 input[type="submit"] 或 button[type="submit"] 時，也會自動跳頁，並且將表單內容提交給遠端伺服器 (如果有設定 method 和 action 屬性的話，沒有設定 action 則會重新導向當前頁面)。
  // 在此案例中，我們想要頁面不會刷新，event.preventDefault() 會請瀏覽器終止元件的預設行為，把控制權交給 JavaScript。運用 DOM 操作時，通常會使用 JavaScript 來掌控 UI 行為。 
  event.preventDefault()
  // 設定篩選條件
  // 輸入的input刪掉空白並全部小寫
  const keyword = searchInput.value.trim().toLowerCase()

  // 在輸入值為空白時跳出警告，if的條件布林值如果為false則不會執行條件，所以要讓他變成TRUE
  // 當字串長度為零時，執行警告
  // 之所以用不到是因為在這個狀況之下，渲染的電影清單會全不見，所以就不用
  // if (!keyword.length) {
  //   return alert('Please enter a valid string')
  // }

  // 使用filter條件函式push新的陣列
  //                          參數         條件函式      是否包含keyword
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword))
  // 若是輸入亂數則跳出警告，使用filteredMovies.length做條件，表示上面函式比對沒有任何結果，所以長度才會為0
  if (filteredMovies.length === 0) {
    return alert('Cannot find movie with keyword')
  }

  // 分頁器頁數也要根據搜尋的數量做更新
  renderPaginator(filteredMovies.length)
  renderMovieList(getMovieByPage(1))
  showPage.innerHTML = '1'
})

// 取得電影API資料(印出全部80)
// axios.get(INDEX_URL).then(response => {
//   movies.push(...response.data.results)
//   // 寫完 renderMovieList 之後，別忘了要調用函式
//   renderMovieList(movies)
// })


// 取得電影API資料(使用分頁器)
axios.get(INDEX_URL).then(response => {
  movies.push(...response.data.results)
  // 將分頁器格式在這裡輸出，才能載入movies展開的資料(80個)，不然會是奇怪的格式
  renderPaginator(movies.length)
  // 寫完 renderMovieList 之後，別忘了要調用函式
  // 將分好頁的電影資料render出，起始第一頁永遠為1，所以可以直接放入
  renderMovieList(getMovieByPage(1))

})
  .catch((err) => console.log(err))