// ======= default data =======
const menu = document.querySelector("#menu");
const cart = document.querySelector("#cart");
const totalAmount = document.querySelector("#total-amount");
const button = document.querySelector("#submit-button");
const cardList = document.querySelector('#card-list')
let cartList = ''
let totalPrice = 0
// 菜單資料
const productData = [
  {
    id: "product-1",
    imgUrl:
      "https://images.unsplash.com/photo-1558024920-b41e1887dc32?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "馬卡龍",
    price: 90
  },
  {
    id: "product-2",
    imgUrl:
      "https://images.unsplash.com/photo-1560691023-ca1f295a5173?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "草莓",
    price: 60
  },
  {
    id: "product-3",
    imgUrl:
      "https://images.unsplash.com/photo-1568271675068-f76a83a1e2d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "奶茶",
    price: 100
  },
  {
    id: "product-4",
    imgUrl:
      "https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    name: "冰咖啡",
    price: 180
  }
];
// ======= 請從這裡開始 =======


// 菜單資料render輸出
function renderMenu(data) {
  let rawHtml = ''
  for (let i = 0; i < productData.length; i++) {
    // imgUrl，name，price
    rawHtml += `      <div  class="col-3">
        <div class="card">
          <img
            src="${productData[i].imgUrl}"
            class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${productData[i].name}</h5>
            <p class="card-text">${productData[i].price}</p>
            <a href="#" class="btn btn-primary">加入購物車</a>
        </div>
        </div>
      </div>`
  }
  menu.innerHTML = rawHtml
}

renderMenu(productData)

// 點擊加入購物車，會將資料放入下面的購物車列表裡
menu.addEventListener('click', function addedToCart(event) {
  if (event.target.tagName === 'A') {
    const targetName = event.target.parentElement.firstElementChild
    const targetPrice = targetName.nextElementSibling
    cartList += `<li class="list-group-item">${targetName.textContent} X 1小計：${targetPrice.textContent}</li>`
    cart.innerHTML = cartList
    totalPrice += Number(targetPrice.textContent)
  }
  totalAmount.innerText = totalPrice
})

// 計算購物車金額
button.addEventListener('click', function calculate(event) {

  alert(`感謝購買!\n 總金額是: ${totalPrice}元`)
})