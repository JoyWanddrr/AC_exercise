// 載入express
const express = require('express')
const app = express()
// 載入handlebars
const exphbs = require('express-handlebars')

// 載入port
const port = 3000

// 載入餐廳資料
const restaurant_list = require('./restaurant.json')

// 設定template engine，預載的主頁布局為main檔案。
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
// app.set:透過這個方法告訴 Express 說要設定的 view engine 是 handlebars。
app.set('view engine', 'handlebars')

// 設定靜態檔案，讓express知道檔案在哪裡(bootstrap,popper...)
app.use(express.static('public'))

// 建立接收回傳主頁
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurant_list.results })
})

// 搜尋路由，使用filter比對搜尋的字。
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurant_list.results.filter(restaurant => { return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword) })
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

// 建立細項路由
app.get('/restaurants/:id', (req, res) => {
  // 比對點擊的ID相符，即放入資料。使用fine提取list裡的id，轉成字串，與req.params.id做比對。
  const restaurantId = restaurant_list.results.find(restaurant => restaurant.id.toString() === req.params.id)
  console.log(restaurantId)
  res.render('show', { restaurant: restaurantId })
})


// 啟動監聽
app.listen(port, () => {
  console.log(`${port} is running now.`)
})