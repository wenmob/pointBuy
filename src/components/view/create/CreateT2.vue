<template>
  <div class="createTDContainer">
    <div class="currentCreate" :style="bgStyle">
      <h3>{{stockData.name ? stockData.name : '-'}}</h3>
      <icon class="icon" name="create" scale="3" @click.native="addSelf(stockData)" v-if="isSelf == 0 && isLogin"></icon>
      <icon class="icon" name="jianshao" scale="3" @click.native="subSelf(stockData)" v-else-if="isSelf == 1 && isLogin"></icon>
      <icon class="icon" name="notLogin" scale="3" v-else></icon>
      <strong>{{isNaN(stockData.current) ? '-' : stockData.current}}</strong>
      <div>
        <p>{{stockData.netChange*1 > 0 ? '+' : ''}}{{isNaN(stockData.netChange) ? '-' : stockData.netChange}}</p>
        <p>{{stockData.netChange*1 > 0 ? '+' : ''}}{{isNaN(stockData.netChangeRatio) ? '-' : stockData.netChangeRatio}}%</p>
      </div>
      <button v-if='isOpen' @click="isOpen = !isOpen">关闭行情</button>
      <button v-if='!isOpen' @click="isOpen = !isOpen">查看行情</button>
    </div>
    <!--分时线-->
    <div v-if='isOpen' class="createLine">
      <ul class="lineTit">
        <li @click="lineTab = '0'" :class="lineTab == '0'?'lineActive':''">分时</li>
        <li @click="lineTab = '1'" :class="lineTab == '1'?'lineActive':''">日线</li>
        <li @click="lineTab = '2'" :class="lineTab == '2'?'lineActive':''">盘口</li>
      </ul>
      <timeline v-if="lineTab == '0'" ref='timeline' :stock-data="stockData"></timeline>
      <dateline v-if="lineTab == '1'" ref='dateline' :stock-data="stockData"></dateline>
      <currentInfo v-if="lineTab == '2'" ref='currentInfo' :stock-data="stockData"></currentInfo>
    </div>
    <!--申请金额-->
    <div class="createMoney">
      <p>
        <span>策略金额</span>
        <input type="tel"
        v-model="tacticsVal"
        onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
        onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"
        ref="tactics"
        @input="tacticsInput"
        @blur="checkTacInput"/>
        <span style="margin-left: 10px;color: #F36A6A;font-size: 13px;line-height: 28px;">(1万整数倍)</span>
      </p>
      <p>
        <span>
          推&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;荐
        </span>
        <span>
          <button v-for="(tb,index) in tuiBtn"
          :key="index" :class="tuiIndex == index ? 'active' : ''"
          @click="clickTui(index)">{{tb.val + '万'}}</button>
        </span>
      </p>
      <p>
        <span>购买数量</span>
        <span><button style="border-style: none;text-align: left;width: auto">{{isNaN(buyNum) || buyNum == Infinity ? 0 : buyNum}}</button></span>
        <em style="margin-left: 0px;color: #F36A6A;line-height: 22px">（资金利用率{{isNaN(fundRate) ? 0 : fundRate}}%）</em>
      </p>
    </div>
    <!--触发止盈止损-->
    <div class="touchOffTD">
      <p>
        <span>触发止盈</span>
        <em>+{{profit}}</em>
      </p>
      <p>
        <span>触发止损</span>
        <em>-{{loss}}</em>
      </p>
    </div>
    <!--履约保证金-->
    <div class="appointBzj">
      <p>
        <span>履约保证金</span>
        <button v-for="(bj,index) in bzjs"
        :key="index"
        :class="bzjIndex == index ? 'active' : ''"
        @click="clickBjz(index, Math.round(tacticsVal*10000 / bj.level))">{{Math.round(tacticsVal*10000 / bj.level)}}</button>
      </p>
      <p>
        <span>综合服务费</span>
        <em>{{serviceFee}}元(包含前两天)</em>
        <em></em>
      </p>
      <!-- <p>
   				<span>递延费</span>
   				<i>20元/万/天</i>
   		</p> -->
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import Icon from 'vue-svg-icon/Icon.vue'
import timeline from '@/components/view/create/Timeline'
import dateline from '@/components/view/create/Dateline'
import currentInfo from '@/components/view/create/CurrentInfo'
import selfApi from '../../../utils/stockSelf'
import { API } from '../../../utils/api'
export default {
  props: ['stockData'],
  data () {
    return {
      lineTab: '0',
      isOpen: false,
      tuiIndex: 2,
      otIndex: 0,
      bzjIndex: 0,
      tacticsVal: 5,
      opent: '',
      bzj: '',
      tuiBtn: [
        { val: '1' },
        { val: '3' },
        { val: '5' },
        { val: '8' },
        { val: '10' },
        { val: '20' },
        { val: '30' }
      ],
      tacticsObj: {},
      bzjs: [],
      buyNum: 0,
      fundRate: 0,
      isSelf: 0,
      profit: 0, // 止赢
      loss: 0, // 止损
      serviceFee: 0, // 递延费
      sum: 0, // 合计
      maxCpje: 0, // 最大操盘金额
      minCpje: 0, // 最小操盘金额
      canSubmit: false,
      listenStock: true,
      isLogin: false,
      notClick: true, // 向父组件传递是否可以点击
      ncick: false,
      resultStr: '发起策略'
    }
  },
  computed: {
    bgStyle () {
      let netChange = isNaN(this.stockData.netChange) ? undefined : this.stockData.netChange
      if (netChange * 1 < 0) {
        return 'background: rgb(118,207,117)'
      } else if (netChange * 1 > 0) {
        return 'background: #f36a6a'
      } else {
        return 'background: #8B8B8B'
      }
    }
  },
  components: {
    Icon,
    timeline,
    dateline,
    currentInfo
  },
  mounted () {
    this.isLoginFun().then(() => {
      this.getStockSelfList()
    })
  },
  methods: {
    // 添加自选的功能
    addSelf (stock) {
      let code = stock.code
      let exchange = stock.exchange
      let name = stock.name
      let stockCode = exchange + code
      selfApi.addSelfStock(stockCode, name).then(res => {
        if (res.code === '0') {
          this.isSelf = 1
        }
      })
    },
    // 删除自选的功能
    subSelf (stock) {
      let code = stock.code
      let exchange = stock.exchange
      let stockCode = exchange + code
      selfApi.subSelfStock(stockCode).then(res => {
        if (res.code === '0') {
          this.isSelf = 0
        }
      })
    },
    // 获取自选股list
    getStockSelfList () {
      return new Promise((resolve, reject) => {
        if (this.isLogin) {
          selfApi.getSelfStockList().then(res => {
            if (res.code === '0') {
              let stockCode = this.$route.query.stockCode
              let t = res.data.find(ele => {
                return ele.stockCode === stockCode
              })
              if (t) {
                this.isSelf = 1
              } else {
                this.isSelf = 0
              }
            } else {
              this.isSelf = 0
            }
            resolve()
          })
        }
      })
    },
    // 点击推荐的效果
    clickTui (n) {
      this.tuiIndex = n
      this.tacticsVal = this.tuiBtn[n].val
      this.buyNum = Math.floor((this.tacticsVal * 10000 / this.stockData.current) / 100) * 100
      this.fundRate = (((this.stockData.current * this.buyNum) / (this.tacticsVal * 10000)) * 100).toFixed(2)
      let bzj = Math.round(this.tacticsVal * 10000 / this.bzjs[this.bzjIndex].level)
      this.algorithm(this.tacticsVal, this.tacticsObj, this.bzjIndex, bzj, this.stockData)
    },
    // 点击保证金的效果
    clickBjz (n, bzj) {
      this.bzjIndex = n
      this.maxCpje = this.bzjs[n].maxCpje // 最大操盘金额
      this.minCpje = this.bzjs[n].minCpje // 最小操盘金额
      this.algorithm(this.tacticsVal, this.tacticsObj, n, bzj, this.stockData)
    },
    // 获取策略组的设置参数
    getSetTD () {
      return new Promise((resolve, reject) => {
        API.strategySet_get(1, (res) => {
          if (res.code === 0) {
            let arr = res.data
            this.tacticsObj = arr[0]
            this.bzjs = this.tacticsObj.rates
            this.maxCpje = this.bzjs[0].maxCpje // 最大操盘金额
            this.minCpje = this.bzjs[0].minCpje
          }
          resolve()
        })
      })
    },
    // 输入框实时
    tacticsInput () {
      let val = this.$refs.tactics.value
      let bzj = Math.round(this.tacticsVal * 10000 / this.bzjs[this.bzjIndex].level)
      this.buyNum = Math.floor((val * 10000 / this.stockData.current) / 100) * 100
      this.fundRate = (((this.stockData.current * this.buyNum) / (val * 10000)) * 100).toFixed(2)
      this.algorithm(val, this.tacticsObj, this.bzjIndex, bzj, this.stockData)
    },
    // 对策略组输入金额进行验证
    checkTacInput () {
      if (this.tacticsVal * 1 === 0) {
        Toast({
          message: '策略金额不能为0',
          position: 'middle',
          className: 'toastNee',
          duration: 3000
        })
        this.canSubmit = false
      } else if (this.tacticsVal === '') {
        Toast({
          message: '策略金额不能为空',
          position: 'middle',
          className: 'toastNee',
          duration: 3000
        })
        this.canSubmit = false
      } else if (this.maxCpje !== -1 && this.tacticsVal * 10000 > this.maxCpje) {
        Toast({
          message: '策略金额不能大于' + this.maxCpje,
          position: 'middle',
          className: 'toastNee',
          duration: 3000
        })
        this.canSubmit = false
      } else if (this.minCpje !== -1 && this.tacticsVal * 10000 < this.minCpje) {
        Toast({
          message: '策略金额不能小于' + this.minCpje,
          position: 'middle',
          className: 'toastNee',
          duration: 3000
        })
        this.canSubmit = false
      } else {
        this.canSubmit = true
      }
    },
    // 策略的算法
    algorithm (total, obj1, n, bzj, obj2) {
      this.profit = ((total * 10000) * (obj1.profitStopPercent / 100)).toFixed(2)
      this.loss = (bzj * obj1.rates[n].zsxPercent / 100).toFixed(2)
      this.serviceFee = total * obj1.rates[n].commFee
      this.sum = bzj + this.serviceFee
      let obj = this.createSubData(this.choosePact, this.tacticsVal, this.canSubmit, this.maxCpje, this.minCpje, this.tacticsObj, obj2.code, n, this.sum)
      this.$emit('listenCreateDetail', obj)
    },
    // 创建新的obj数据源 给父亲
    createSubData (choosePact, tacticsVal, canSubmit, maxCpje, minCpje, tacticsObj, code, bzjIndex, sum) {
      let _this = this
      return {
        choosePact: choosePact,
        tacticsVal: tacticsVal,
        canSubmit: canSubmit,
        maxCpje: maxCpje,
        minCpje: minCpje,
        tacticsObj: tacticsObj,
        code: code,
        bzjIndex: bzjIndex,
        sum: sum,
        mSub: _this.notClick,
        msg: _this.resultStr
      }
    },
    // 判断是否登录
    isLoginFun () {
      let _this = this
      return new Promise((resolve, reject) => {
        API.checklogin(function (res) {
          if (res.code === 0) {
          // 已登录
            _this.isLogin = true
          } else {
          // 游客
            _this.isLogin = false
          }
          resolve()
        })
      })
    },
    // 检查是否可以发起策略
    checkUse (stockCode) {
      let _this = this
      return new Promise((resolve, reject) => {
        API.canBuy(stockCode, (res) => {
          if (res.code !== 0) {
            _this.notClick = false
            _this.resultStr = res.msg
          } else {
            _this.notClick = true
            _this.resultStr = '发起策略'
          }
        })
        resolve()
      })
    }
  },
  watch: {
    stockData: {
      handler (newValue, oldValue) {
        let _this = this
        if (this.listenStock) {
          _this.listenStock = false
          _this.buyNum = Math.floor((_this.tacticsVal * 10000 / newValue.current) / 100) * 100
          _this.fundRate = (((newValue.current * _this.buyNum) / (_this.tacticsVal * 10000)) * 100).toFixed(2)
          // 获取T+1的相关参数
          _this.getSetTD().then(() => {
            _this.ncick = true
          })
        }
        if (_this.ncick) {
          _this.checkUse(newValue.code).then(() => {
            let val = _this.tacticsVal
            let bzj = Math.round(_this.tacticsVal * 10000 / _this.bzjs[0].level)
            _this.algorithm(val, _this.tacticsObj, 0, bzj, newValue)
          })
        }
      },
      deep: true
    }
  }
}
</script>

<style lang='scss'>
@import "../../../assets/css/bus";
.createTDContainer {
  background: #f5f5f5;
  .currentCreate {
    position: relative;
    height: 100px;
    background: #f36a6a;
    display: flex;
    color: #fff;
    padding-top: 30px;
    padding-left: 30px;
    h3 {
      font-size: 42px;
      margin: 0;
      font-weight: normal;
      line-height: 1.5;
    }
    strong {
      font-weight: normal;
      font-size: 48px;
      line-height: 1.5;
    }
    .icon {
      margin: 4px 18px 0 15px;
      color: #fff;
      line-height: 1.5;
    }
    div {
      margin-top: 0px;
      margin-left: 10px;
      opacity: 0.8;
      p {
        margin: 0;
        line-height: 1.5;
      }
    }
    button {
      background: transparent;
      border: 2px solid #fff;
      color: #fff;
      outline: 0;
      height: 48px;
      padding: 0 20px;
      border-radius: 30px;
      position: absolute;
      right: 30px;
      top: 40px;
    }
  }
  .createLine {
    height: 480px;
    background: #fff;
    padding-bottom: 30px;
    ul {
      display: flex;
      padding: 0;
      height: 46px;
      padding-top: 24px;
      margin: 0;
      li {
        flex: 1;
        text-align: center;
        font-size: 24px;
        border-bottom: 1px solid #ccc;
        &.lineActive {
          color: #f36a6a;
          border-bottom: 1px solid #f36a6a;
        }
      }
    }
  }
  .createMoney {
    margin: 15px 0;
    padding: 5px 20px;
    background: #fff;
    p {
      display: flex;
      padding-top: 30px;
      &:nth-of-type(3) {
        padding-top: 15px;
        padding-bottom: 5px;
        span {
          &:nth-of-type(2) {
            margin-left: 0px;
          }
        }
        button {
          width: 180px;
          margin-left: 8px;
          &.active {
            border: 2px solid $themeColor;
            color: $themeColor;
          }
        }
      }
      span {
        display: inline-block;
        color: #585858;
        &:nth-of-type(1) {
          width: 140px;
          line-height: 48px;
        }
        &:nth-of-type(2) {
          margin-left: 50px;
        }
      }
      input[type="tel"] {
        width: 240px;
        height: 48px;
        margin-left: 10px;
        border: 2px solid $themeColor;
        outline: 0;
        color: #767676;
        padding-left: 30px;
        border-radius: 5px;
      }
      button {
        background: transparent;
        outline: 0;
        border: 2px solid #ccc;
        width: 134px;
        height: 48px;
        border-radius: 5px;
        margin-bottom: 22px;
        margin-left: 8px;
        &.active {
          border: 2px solid $themeColor;
          color: $themeColor;
        }
      }
    }
  }
  .touchOffTD {
    background: #fff;
    font-size: 24px;
    margin-bottom: 15px;
    padding: 0 20px;
    p {
      height: 80px;
      line-height: 80px;
      span {
        display: inline-block;
        width: 150px;
        color: #585858;
      }
      em {
        font-style: normal;
        margin-left: 30px;
      }
      &:first-child {
        em {
          color: $themeColor;
        }
      }
      &:last-child {
        em {
          color: $themGreenColor;
        }
      }
    }
  }
  .appointBzj {
    background: #fff;
    padding: 0px 20px 10px 20px;
    font-size: 24px;
    p {
      line-height: 80px;
      span {
        display: inline-block;
        width: 150px;
      }
      button {
        background: transparent;
        border: 2px solid #ccc;
        width: 170px;
        height: 48px;
        border-radius: 5px;
        margin-left: 10px;
        &.active {
          border: 2px solid $themeColor;
          color: $themeColor;
        }
      }
      em {
        color: $themeColor;
        &:nth-of-type(2) {
          display: block;
          line-height: 30px;
          margin-left: 160px;
          margin-bottom: 30px;
        }
      }
    }
  }
}
</style>
