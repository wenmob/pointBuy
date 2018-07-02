<template>
  <div class="optional-container">
    <div class="optional-head">
      <a class="optional-head-a1" @click="goEdit" v-if="isLogin">编辑</a>
      <a class="optional-head-a1" v-else></a>
      <div class="optional-head-d1">
        <a :class="local == 0 ? 'active' : ''" @click="loaclFun(0)">我的自选</a><!--
        --><a :class="local == 1 ? 'active' : ''" @click="loaclFun(1)">浏览记录</a>
      </div>
      <a class="optional-head-a2" @click="goSearch"><icon name="search" scale="2.5"></icon></a>
    </div>
    <!--分割线-->
    <div class="optional-cut"></div>
    <!--表个数据-->
    <div class="optional-cont">
      <div class="optional-cont-table">
        <div class="th">
          <div class="cellLeft">股票名称</div>
        </div>
        <div class="th">
          <div class="cellCenter">当前价</div>
        </div>
        <div class="th">
          <div class="cellRight">张跌幅</div>
        </div>
      </div>

      <div class="optional-cont-table" v-for="(ms,index) in myStock" :key="index" @click="goTrade(ms.stockCode)">
        <div class="thA">
          <div class="cellLeft">{{ms.stockName}}<br/>{{ms.stockCode.replace(/\D+/g, '')}}</div>
        </div>
        <div class="thA">
          <div class="cellCenter" style="color: rgb(118,207,117)" v-if="ms.netChange*1 < 0">{{ms.price ? ms.price : '-'}}</div>
          <div class="cellCenter" style="color: rgb(247,97,96)" v-else-if="ms.netChange*1 > 0">{{ms.price ? ms.price : '-'}}</div>
          <div class="cellCenter" v-else>{{ms.price ? ms.price : '-'}}</div>
        </div>
        <div class="thA">
          <div class="cellRight" style="color: rgb(118,207,117)" v-if="ms.netChange*1 < 0">{{ms.netChangeRatio ? ms.netChangeRatio : '-'}}</div>
          <div class="cellRight" style="color: rgb(247,97,96)" v-else-if="ms.netChange*1 > 0">{{ms.netChangeRatio ? ms.netChangeRatio : '-'}}</div>
          <div class="cellRight" v-else>{{ms.netChangeRatio ? ms.netChangeRatio : '-'}}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Toast } from 'mint-ui'
import Icon from 'vue-svg-icon/Icon.vue'
import selfApi from '../../utils/stockSelf'
import { sinaStock } from '../../quote/sina'
import { API } from '../../utils/api.js'
export default {
  data () {
    return {
      isLogin: false,
      myStock: [],
      local: 0,
      startAuto: true
    }
  },
  components: {
    Icon
  },
  beforeDestroy () {
    this.startAuto = false
  },
  mounted () {
    this.needFot()
    this.isLoginFun()
  },
  methods: {
    initEmptySelfStocks () {
      let arrobj = [
        {
          stockName: '上证指数',
          stockCode: 'sh000001'
        },
        {
          stockName: '沪深300',
          stockCode: 'sh000300'
        },
        {
          stockName: '深圳成指',
          stockCode: 'sz399001'
        }
      ]
      this.myStock = arrobj
    },
    // 获取自己的自选股
    getStockSelfList () {
      let _this = this
      return new Promise((resolve, reject) => {
        selfApi.getSelfStockList().then(res => {
          if (res.code === '0') {
            _this.myStock = res.data
          } else if (res.code === '700') {
            _this.initEmptySelfStocks()
          }
          resolve()
        })
      })
    },
    // 循环股票的行情
    startGetAuto () {
      let _this = this
      if (_this.startAuto) {
        if (_this.myStock.length === 0) {
          _this.startAuto = true
          return
        }
        let arr = []
        this.myStock.forEach(element => {
          arr.push(element.stockCode)
        })
        sinaStock.Detail(arr.toString(), (res) => {
          for (let i = 0; i < _this.myStock.length; i++) {
            _this.myStock[i].price = isNaN(res[i].current) ? undefined : res[i].current
            _this.myStock[i].netChange = isNaN(res[i].netChange) ? undefined : res[i].netChange
            _this.myStock[i].netChangeRatio = isNaN(res[i].netChangeRatio.replace(/%/g, '')) ? undefined : res[i].netChangeRatio
          }
          Vue.set(_this.myStock)
          setTimeout(() => {
            _this.startGetAuto()
          }, 1500)
        })
      }
    },
    // 去搜索
    goSearch () {
      this.$router.push('/ownSearch')
    },
    // 去编辑
    goEdit () {
      if (!this.isLogin) {
        Toast({
          message: '请先登录',
          position: 'middle',
          className: 'toastNee',
          duration: 3000
        })
        return
      }
      this.$router.push('/ownEdit')
    },
    // 去交易界面 /test/t1
    goTrade (code) {
      this.$router.push({path: '/createDetail', query: {stockCode: code}})
    },
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
            })
          }
          this.myStock = items
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
    // 点击浏览记录或自选
    loaclFun (n) {
      this.local = n
      if (n === 0) {
        this.myStock = []
        this.isLoginFun()
      } else {
        this.startAuto = false
        this.myStock = []
        this.getLocalData().then(() => {
          this.startAuto = true
          this.startGetAuto()
        })
      }
    },
    // 判断是否登录
    isLoginFun () {
      let _this = this
      API.checklogin(function (res) {
        if (res.code === 0) {
          // 已登录
          _this.isLogin = true
          _this.getStockSelfList().then(() => {
            _this.startAuto = true
            _this.startGetAuto()
          })
        } else {
          // 游客
          _this.isLogin = false
          _this.startAuto = true
          _this.initEmptySelfStocks()
          _this.startGetAuto()
        }
      })
    },
    // 底部显示
    needFot () {
      this.$emit('listenFot', '0')
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "../../assets/css/bus";
  .optional-container {
    width: 100%;
    height: 100%;
  }
  .optional-head {
    display: flex;
    padding: 26px 29px;
    justify-content: space-between;
    .optional-head-a1 {
      display: block;
      width: 80px;
      height: 48px;
      line-height: 48px;
      font-size: 30px;
    }
    .optional-head-d1 {
      width: 360px;
      height: 48px;
      border: 2px solid #FF5D5E;
      border-radius: 4px;
      a {
        display: inline-block;
        width: 180px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 26px;
      }
      .active {
        background-color: #FF5D5E;
        color: white;
      }
    }
    .optional-head-a2 {
      display: block;
    }
  }
  .optional-cut {
    height: 20px;
    background-color: rgb(238,238,238)
  }
  .optional-cont {
    padding: 0px 29px;
  .optional-cont-table {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid rgb(238,238,238);
    .th {
      width: 100%;
      height: 90px;
      .cellLeft {
        display: table-cell;
        height: 90px;
        width: 10%;
        font-size: 28px;
        vertical-align: middle;
        text-align: left;
        color: rgb(56,56,56);
      }
      .cellCenter {
        display: table-cell;
        height: 90px;
        width: 10%;
        font-size: 28px;
        vertical-align: middle;
        text-align: center;
        color: rgb(56,56,56);
      }
      .cellRight {
        display: table-cell;
        height: 90px;
        width: 10%;
        font-size: 28px;
        text-align: right;
        vertical-align: middle;
        color: rgb(56,56,56);
      }
    }
    .thA {
      width: 100%;
      height: 110px;
      .cellLeft {
        display: table-cell;
        height: 110px;
        width: 5%;
        font-size: 28px;
        line-height: 1.3;
        vertical-align: middle;
        text-align: left;
        color: rgb(56,56,56);
      }
      .cellCenter {
        display: table-cell;
        height: 110px;
        width: 5%;
        font-size: 28px;
        vertical-align: middle;
        text-align: center;
        color: rgb(56,56,56);
      }
      .cellRight {
        display: table-cell;
        height: 110px;
        width: 5%;
        font-size: 28px;
        text-align: right;
        vertical-align: middle;
        color: rgb(56,56,56);
      }
    }
  }
  }
</style>
