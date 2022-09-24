// 常數儲存的資料不會變動，因此習慣上將首字母大寫以表示此特性。
const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

// 狀態管理(state management)
// GAME_STATE變數，被稱為狀態機(state machine):為你的程式碼提供了一層抽象化的管理架構，提高可讀性，也會限制程式的行為不能跳脫出這五種狀態。
const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",//等待翻第一張牌
  SecondCardAwaits: "SecondCardAwaits",//等待翻第二張牌
  CardsMatchFailed: "CardsMatchFailed",//卡片配對失敗
  CardsMatched: "CardsMatched",//卡片配對成功
  GameFinished: "GameFinished",//遊戲結束
}

// 使用MVC架構，即model(資料)物件模組,view(外觀介面)物件模組,controller(流程)物件模組，分類寫入。
// 整理：Controller 在外、view 隱藏於內部。程式中所有動作應該由 controller 統一發派，view 或 model 等其他元件只有在被 controller 呼叫時，才會動作。不要讓 controller 以外的內部函式暴露在 global 的區域。


const view = {

  // 將原本的getCardElement拆解成牌背跟牌面
  // 牌面
  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]
    return `<p>${number}</p>
      <img src="${symbol}" alt="">
         <p>${number}</p>`
  },
  // 牌背
  getCardElement(index) {
    // 建立dataset綁定每個卡片
    return `<div data-index="${index}" class="card back"></div>`
  },

  // // 此函式執行產出每張卡片
  // getCardElement(index) {

  //   // 牌面數字總共是0~51(陣列位置)。但實際顯現的數字不會有0，所以需要加1。
  //   //將數字1、11、12、13使用函數輸出A、J、Q、K
  //   const number = this.transformNumber((index % 13) + 1)
  //   // this===transformNumber()
  //   // 在物件裡呼叫函式執行，都需要用this去執行呼叫函式本身? 

  //   // 按照數字排列下來，0~12為黑桃 13~25為愛心 26~38為方塊 39~51為梅花。所以0~12其商數均為0，Symbols[0]，即讀取黑桃圖片。
  //   const symbol = Symbols[Math.floor(index / 13)]

  //   // 回來修改class name，因為遊戲卡片應該均為覆蓋狀態
  //   return `<div class="card back">
  //     <p>${number}</p>
  //     <img src="${symbol}" alt="">
  //       <p>${number}</p>
  //   </div>`
  // },


  // 因為撲克牌的花色有A、J、Q、K，所以使用switch來分類條件，改變數字型態
  transformNumber(number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  },

  // 將產出的卡片渲染入牌桌
  // 新增controller之後，避免與utility產生耦合，所以給予變數
  displayCards(indexes) {
    const rootElement = document.querySelector('#cards')

    // 放入52張牌。
    // 使用Array(52)先建立52個空格之後，使用keys迭代數字，再用from產生實體陣列，最後使用map依次丟入getCardElement函式，最後再使用join('')改變成為一個字串，才能被innerHTML讀取。現已被移到utility。
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('')
    // 這裡的this是getCardElement()。
    // this可以讀取物件本身之外，物件中的方法還可以執行自己本身的方法，getCardElement()目前是個物件，所以如果getCardElement()不加上this，就會undefined。

  },

  // 卡片正反顯示，優化程式碼，將輸入的物件改成能陣列迭代。
  flipCards(...cards) {
    cards.map(card => {
      // 如果是背面，回傳正面
      if (card.classList.contains('back')) {
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        // this===getCardContent()
        return
      }
      // 如果是正面，回傳背面，加上back class name，以及清空牌面內容
      card.classList.add('back')
      card.innerHTML = null
    })
  },

  // 卡片配對成功後的顯示方式，在CSS裡新增樣式即可，這裡也需要優化成能陣列迭代。
  pairCards(...cards) {
    cards.map(card => {
      card.classList.add('paired')
    })
  },

  // 分數
  renderScore(score) {
    document.querySelector('.score').textContent = `Score=${score}`
  },
  // 次數
  renderTriedTimes(times) {
    document.querySelector(".tried").textContent = `You've tried: ${times} times`;
  },

  // 比對錯誤動畫
  appendWrongAnimation(...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      // 在卡片加上監聽器，為了能讓動畫重複顯示。使用animationend(動畫結束事件)，執行remove class。最後加上once:true，是要求在事件執行一次之後，就要卸載這個監聽器。因為同一張卡片可能會被點錯好幾次，每一次都需要動態地掛上一個新的監聽器，並且用完就要卸載。
      card.addEventListener('animationend', event =>
        event.target.classList.remove('wrong', { once: true }))
    })
  },

  // 結束畫面
  showGameFinished() {
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
    `
    const header = document.querySelector('#header')
    header.before(div)
  }

}


// 宣告controller物件，其物件會依照遊戲狀態來分配動作
const controller = {
  // 定義currentState屬性，來標記目前的遊戲狀態
  currentState: GAME_STATE.FirstCardAwaits,

  // 由 controller 啟動遊戲初始化，在 controller 內部新增函式，呼叫 view.displayCards(將產出的卡片渲染入牌桌)，再從裡面呼叫 utility.getRandomNumberArray，避免 view 和 utility 產生接觸(耦合)。
  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },

  // 依照不同遊戲狀態，做不同的行為
  dispatchCardAction(card) {
    // 已翻開的卡片，不需要再點開
    if (!card.classList.contains('back')) {
      return
    }
    // 未翻開的卡片，及其對應的動作
    switch (this.currentState) {
      // dispatchCardAction裡的this.currentState指的是controller.currentState

      // 當遊戲狀態為待翻第一張牌時，1.改狀態為待翻第二張牌，2.翻牌(view.flipCard)，3.將翻出的牌推model.revealedCards，待會跟第二張牌作比較。
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break

      // 當遊戲狀態為待翻第二張牌時，1.翻牌(view.flipCard)，2.將翻出的牌推入model.revealedCards，這裡會有分歧，會需要做比對。3.比對是否一樣(由於revealedCards由model管理，因此我們也把檢查配對成功的函式歸類在model裡)。
      case GAME_STATE.SecondCardAwaits:
        //  在這裡放入嘗試的次數
        view.renderTriedTimes(++model.triedTimes)

        view.flipCards(card)
        model.revealedCards.push(card)

        // 卡片比對
        if (model.isRevealedCardsMatched()) {
          // 比對正確，分數增加
          view.renderScore(model.score += 10)
          // isRevealedCardsMatched()為true，兩張牌相同。更改遊戲狀態
          this.currentState = GAME_STATE.CardsMatched

          // 將配對成功的卡片加上樣式，重複的動作之後可以做優化
          view.pairCards(...model.revealedCards)
          // 將配對陣列清空，因為每次只會比對兩張
          model.revealedCards = []

          // 遊戲結束時的分數為260，呼叫view.showGameFinished()結束畫面
          if (model.score === 260) {
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()
            return
          }

          // 更改遊戲狀態，回到待翻第一張牌，才能後續動作
          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          // 配對失敗，將卡片翻回去
          this.currentState = GAME_STATE.CardsMatchFailed

          // 在這裡呼叫失敗比對的動畫
          view.appendWrongAnimation(...model.revealedCards)

          // 設定翻開後再翻回去的延遲時間為1秒，但內容較為累贅，所以改開新的函式，resetCards。
          //setTimeout第一個參數為函式，若是加上()，則是導入函式結果 
          // 我們期待 this 要指向 controller，然而當我們把 resetCards 當成參數傳給 setTimeout 時，this 的對象變成了 setTimeout，而 setTimeout 又是一個由瀏覽器提供的東西，而不是我們自己定義在 controller 的函式。
          setTimeout(this.resetCards, 1000)
        }
        break
    }

  },

  resetCards() {
    // 注意這裡的順序，必須先翻卡片之後，再清空陣列
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    // 將配對陣列清空，因為每次只會比對兩張
    // 這裡this在搬進resetCards之後要改成controller。
    // this.currentState = GAME_STATE.FirstCardAwaits
    controller.currentState = GAME_STATE.FirstCardAwaits
  }
}

// 宣告model，資料管理
const model = {
  // 被翻開的卡片
  revealedCards: [],

  // 比對revealedCards裡的兩張牌是否一樣。revealedCards的第一個跟第二個根據dataset-index值的餘數是否相同。回傳true or false。
  isRevealedCardsMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },

  score: 0,
  triedTimes: 0
}

// 設定utility物件(外掛函式庫)，放入非MVC的物件
const utility = {
  // 洗牌囉，使用Fisher-Yates Shuffle演算法
  getRandomNumberArray(count) {
    const number = Array.from(Array(count).keys())
    // 先將數字按照順序迭代，洗牌基本上會從最後一張開始
    for (let index = number.length - 1; index > 0; index--) {
      // 設定要交換的對象
      let randomIndex = Math.floor(Math.random() * (index + 1))
        //  解構賦值，前面的分號不可省略，因為前面呼叫了 Math.floor() 這個函式庫，如果沒有加上分號，會和後面的 [] 連起來，被解讀成 Math.floor()[]。
        ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    // 回傳number陣列
    return number
  }
}

// 程式中所有動作應該由 controller 統一發派，view 或 model 等其他元件只有在被 controller 呼叫時，才會動作。所以這裡從view.displayCards()，改成從controller呼叫。
controller.generateCards()


// 在每張卡片上面設定監聽器，用以翻牌
// 使用SelectorAll選出的會是node list(若使用map不會成功)
document.querySelectorAll('.card').forEach(card => card.addEventListener('click', event => {
  // 呼叫翻牌囉，但是動作都要用controller執行，所以view.flipCard(card)，要改成以下。
  controller.dispatchCardAction(card)
}))
