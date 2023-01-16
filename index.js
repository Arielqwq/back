import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import userRoute from './routes/users.js'
import productRoute from './routes/products.js'
import orderRoute from './routes/orders.js'
import './passport/passport.js'

mongoose.connect(process.env.DB_URL)
// 消毒:過濾
mongoose.set('sanitizeFilter', true)

// 以下設定的順序有差
const app = express()

// 跨域請求設定
app.use(cors({
  // origin 代表請求來源, Postman 等後端的請求會是 undefined (增加  || origin === undefined  為允許 postman 請求)
  // callback(錯誤, 是否允許)
  origin (origin, callback) {
    if (origin.includes('github') || origin.includes('localhost') || origin === undefined) {
      callback(null, true)
    /*
  }else {
        if (asdad) {
          判斷如果是 asdad的話跳進 new Error('a')
          callback(new Error('a'), false)
        }
        else {
          判斷如果不是 asdad 的話跳進 new Error('b')
          callback(new Error('b'), false)
        }
      }
      */
    } else {
      // 不允許請求
      callback(new Error(), false)
    }
  }
}))
// 處理跨域錯誤
// callback(new Error(), false) 跳來這裡
app.use((_, req, res, next) => {
  res.status(403).json({ success: false, message: '請求被拒' })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(400).json({ success: false, message: '格式錯誤' })
})

app.use('/users', userRoute)
// 商品
app.use('/products', productRoute)
// orders
app.use('/orders', orderRoute)

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: '' })
})

app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: '我找不到~' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('~伺服器啟動~')
})
