<template>
  <div class="own-search-page">
    <h3 class="own-search-h">搜索</h3>
    <div class="own-search-dd">
      <icon name="search" scale="2.1" class="own-search-ic"></icon>
      <input
        class="own-search-ip"
        ref="ownSearch" v-model="stock"
        @input="searchStock($event)"
        />
    </div>
    <p class="own-search-p1">以下是历史搜索</p>
    <div class="own-search-d1">

      <div class="own-search-table" v-for="(ms,index) in mss" :key="index">
        <div class="th" @click="goTrade(ms.stockCode)">
          <div class="cellLeft" :style="ms.status == 0? 'color: rgb(247,97,96)' : ''">{{ms.stockName}}</div>
        </div>
        <div class="th" @click="goTrade(ms.stockCode)">
          <div class="cellCenter"  :style="ms.status == 0? 'color: rgb(247,97,96)' : ''">{{ms.stockCode.replace(/\D+/g, '')}}</div>
        </div>
        <div class="th">
          <div class="cellRight"  style="color: rgb(247,97,96)" v-if="ms.status == 0"><icon name="add-dd" scale="2.1" @click.native="addSelfFun(ms.stockCode, ms.stockName, index)" v-if="isLogin"></icon></div>
          <div class="cellRight" v-else><icon name="sub" scale="2.1" @click.native="subSelfFun(ms.stockCode, index)" v-if="isLogin"></icon></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Icon from 'vue-svg-icon/Icon.vue'
import selfApi from '../../utils/stockSelf'
import { sinaStock } from '../../quote/sina'
import { API } from '../../utils/api.js'
import { Toast } from 'mint-ui'

export default {
  data () {
    return {
      isLogin: false,
      stock: '',
      myStock: [],
      mss: [],
      hasMyStock: false
    }
  },
  components: {
    Icon
  },
  mounted () {
    this.notFot()
    this.isLoginFun()
  },
  methods: {
    // 获取本地数据
    getLocalData () {
      return new Promise((resolve, reject) => {
        if (typeof (Storage) !== 'undefined') {
        // 针对 localStorage/sessionStorage 的代码
          let items = []
          items = JSON.parse(window.localStorage.getItem('stock'))
          if (!items) {
            items = []
          } else {
            items.forEach(ele => {
              ele.stockName = ele.name
              ele.stockCode = ele.exchange + ele.code
              ele.status = this.myStock.find(element => {
                return element.stockCode === ele.stockCode
              }) ? 1 : 0
            })
          }
          this.mss = items
        } else {
        // 抱歉！不支持 Web Storage ..
          Toast({
            message: '抱歉！不支持浏览记录',
            position: 'middle',
            className: 'toastNee',
            duration: 3000
          })
        }
        resolve()
      })
    },
    // 获取自己的自选股
    getStockSelfList () {
      let _this = this
      return new Promise((resolve, reject) => {
        selfApi.getSelfStockList().then(res => {
          if (res.code === '0') {
            _this.myStock = res.data
          }
          _this.hasMyStock = true
          resolve()
        })
      })
    },
    // 获取股票的信息
    getStockArray (k) {
      return new Promise((resolve, reject) => {
        sinaStock.getStock(k, (data) => {
          resolve(data)
        })
      })
    },
    hasStock (element) {
      let _this = this
      // 渲染的数据内容
      _this.mss = []
      this.getStockArray(element).then(res => {
        res.forEach(elem => {
          let arr = elem.split(',')
          if (arr[1] * 1 === 11) {
            let obj = {
              stockCode: arr[3],
              stockName: arr[4]
            }
            obj.status = _this.myStock.find(ele => {
              return ele.stockCode === arr[3]
            }) ? 1 : 0
            _this.mss.push(obj)
          }
        })
      })
    },
    // 输入内容时，去搜索股票
    searchStock (e) {
      let _this = this
      let element = e.target.value
      // 先判断我的自选股是否进行
      if (!_this.hasMyStock && _this.isLogin) {
        Toast({
          message: '网络异常，请稍后操作',
          position: 'middle',
          className: 'toastNee',
          duration: 2000
        })
        e.target.value = ''
        _this.stock = ''
        return
      }
      _this.hasStock(element)
    },
    // 添加自选股的功能
    addSelfFun (code, name, n) {
      let _this = this
      return new Promise((resolve, reject) => {
        selfApi.addSelfStock(code, name).then(res => {
          if (res.code === '0') {
            _this.mss[n].status = 1
            _this.myStock.push(_this.mss[n])
          }
        })
      })
    },
    // 删除自选的功能
    subSelfFun (code, n) {
      let _this = this
      return new Promise((resolve, reject) => {
        selfApi.subSelfStock(code).then(res => {
          if (res.code === '0') {
            _this.mss[n].status = 0
            let x = _this.myStock.findIndex(ele => {
              return ele.stockCode === code
            })
            _this.myStock.splice(x, 1)
          }
        })
      })
    },
    // 去交易界面 /test/t1
    goTrade (code) {
      this.$router.push({path: '/createDetail', query: {stockCode: code}})
    },
    // 底部不显示
    notFot () {
      this.$emit('listenFot', '3')
    },
    // 判断是否登录
    isLoginFun () {
      let _this = this
      API.checklogin(function (res) {
        if (res.code === 0) {
          _this.isLogin = true
          _this.getStockSelfList().then(() => {
            _this.getLocalData()
          })
        } else {
          _this.isLogin = false
          _this.getLocalData()
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "../../assets/css/bus";
  .own-search-page {
   width: calc(100% - 58px);
   min-height: 100%;
   padding-left: 29px;
   padding-right: 29px;
   background-color: #F5F5F5;
  }
  .own-search-h {
    font-size: 48px;
    font-weight: 500;
  }
  .own-search-dd {
    position: relative;
    width: calc(100% - 60px);
    height: 72px;
    padding-left: 30px;
    padding-right: 30px;
    border: 1px solid #C8C8C8;
    border-radius: 72px;
    background-color: white;
    line-height: 72px;
    -moz-box-shadow:2px 2px 5px #C8C8C8;
    -webkit-box-shadow:2px 2px 5px #C8C8C8;
    box-shadow:2px 2px 5px #C8C8C8;
  }
  .own-search-ic {
    position: absolute;
    top: 15px;
    left: 30px;
  }
  .own-search-ip {
    width: calc(100% - 92px);
    padding-left: 20px;
    padding-right: 20px;
    margin-left: 36px;
    font-size: 32px;
    margin-top: 4px;
  }
  .own-search-p1 {
    color: #797979;
    font-size: 24px;
    margin-top: 40px;
  }
  .own-search-d1 {
    margin-top: 60px;
  }
  .own-search-table {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #C8C8C8;
    .th {
      width: 100%;
      height: 100px;
      .cellLeft {
        display: table-cell;
        height: 100px;
        width: 10%;
        font-size: 28px;
        vertical-align: middle;
        text-align: left;
        color: rgb(56,56,56);
      }
      .cellCenter {
        display: table-cell;
        height: 100px;
        width: 10%;
        font-size: 28px;
        vertical-align: middle;
        text-align: center;
        color: rgb(56,56,56);
      }
      .cellRight {
        display: table-cell;
        height: 100px;
        width: 10%;
        font-size: 28px;
        text-align: right;
        vertical-align: middle;
        color: rgb(56,56,56);
      }
    }
  }
</style>
