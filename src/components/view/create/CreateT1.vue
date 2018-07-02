<template>
  <div class="createT1Container">
    <div class="currentCreate" :style="bgStyle">
      <h3>{{stockData.name ? stockData.name : '-'}}</h3>
      <icon class="icon" name="create" scale="3" @click.native="addSelf(stockData)" v-if="stockData.isSelf == 0"></icon>
      <icon class="icon" name="jianshao" scale="3" @click.native="subSelf(stockData)" v-else></icon>
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
    <!--即时买入-->
    <div class="createBuy">
      <p>
        <span>现&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价</span>
        <em>即时买入</em>
        <input type="radio" />
      </p>
      <!-- <p>
   				<span>触&nbsp;&nbsp;发&nbsp;&nbsp;价<icon class="icon" scale="1.8" name='warning'></icon></span>
   				<input type="text" value='0.00'/>
   				<input type="radio" />
   			</p> -->
      <p>
        <span>买入数量</span>
        <input type="tel"
         v-model="buyNum"
         @input="buyVol"
         @blur="checkBuyNum"
         ref="buyNumbel"
         onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
         onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"/>
        <em>预计占用{{totalPrice}}元</em>
      </p>
    </div>
    <!--触发止盈止损-->
    <div class="touchOff">
      <p>
        <span>触发止盈</span>
        <em>+{{profit}}</em>
      </p>
      <p>
        <span>触发止损</span>
        <em>-{{loss}}</em>
      </p>
    </div>
    <!-- 履约保证金-->
    <div class="appointBzj">
      <p>
        <span>履约保证金</span>
        <button v-for="(sr,index) in setRule.rates"
        :class="bzjActive == index ? 'active' : ''"
        @click="agreeBtn(index, Math.round((totalPrice / (sr.level))))"
        :style="index == 0 ? 'margin-left: 0px' : ''"
        :key="index">{{Math.round((totalPrice / (sr.level)))}}</button>
      </p>
      <p>
        <span>综合服务费</span>
        <em>{{serviceFee}}元(包含前两天)</em>
        <em>注：最低按1万占用资金收取服务费</em>
      </p>
      <!-- <p>
   				<span>递延费</span>
   				<i>20元/万/天</i>
   			</p> -->
    </div>
    <!--合计 -->
    <div class="summation">
      <div>
        <p>
          <span>合计</span>
          <em>{{sum}}元</em>
        </p>
        <p>
          <img class="m1" src="../../../assets/img/choose1.png" v-if="choosePact == 0" />
          <img class="m1" src="../../../assets/img/choose2.png" v-else/>
          <span class="s2" @click="isPact">阅读并同意</span>
          <span class="s3" @click="$router.push('/agreement')">《相关协议》</span>
        </p>
      </div>
      <button @click="sendTactics">发起策略</button>
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
      choosePact: 0,
      buyNum: '',
      maxCpje: 0, // 最大操盘金额
      minCpje: 0, // 最小操盘金额
      totalPrice: 0, // 预计占用金额
      profit: 0, // 止赢
      loss: 0, // 止损
      bzj0: 0, // 保证金0
      bzj1: 0, // 保证金1
      bzjActive: 0,
      serviceFee: 0, // 综合服务费
      sum: 0,
      setRule: {},
      rateId: '',
      listenStock: true,
      canSubmit: false
    }
  },
  components: {
    Icon,
    timeline,
    dateline,
    currentInfo
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
  mounted () {
    this.getSetT1()
  },
  methods: {
    isPact () {
      if (this.choosePact === 0) {
        this.choosePact = 1
      } else {
        this.choosePact = 0
      }
    },
    // 添加自选的功能
    addSelf (stock) {
      let code = stock.code
      let exchange = stock.exchange
      let name = stock.name
      let stockCode = exchange + code
      selfApi.addSelfStock(stockCode, name).then(res => {
        if (res.code === '0') {
          this.$route.query.hasSelf = 1
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
          this.$route.query.hasSelf = 0
        }
      })
    },
    // 获取T+1的设置的配置项
    getSetT1 () {
      return new Promise((resolve, reject) => {
        API.strategySet_get(1, (res) => {
          if (res.code === 0) {
            this.setRule = res.data[0]
            this.rateId = this.setRule.rates[0].id
            this.maxCpje = this.setRule.rates[0].maxCpje
            this.minCpje = this.setRule.rates[0].minCpje
            resolve()
          }
        })
      })
    },
    // 输入购买数量时的效果
    buyVol () {
      let val = this.$refs.buyNumbel.value
      let totalPrice = ((val * 1) * this.stockData.zt).toFixed(2)
      let bzj = Math.round((totalPrice / (this.setRule.rates[0].level)))
      this.algorithm(val, this.stockData, this.bzjActive, bzj)
    },
    // 点击履约保证金的效果
    agreeBtn (n, bzj) {
      this.bzjActive = n
      this.rateId = this.setRule.rates[n].id
      this.maxCpje = this.setRule.rates[n].maxCpje
      this.minCpje = this.setRule.rates[n].minCpje
      this.algorithm(this.buyNum, this.stockData, n, bzj)
    },
    // 发起策略的按钮
    sendTactics () {
      this.checkBuyNum()
      // 检查数量是否符合
      if (!this.canSubmit) {
        return false
      }
      // 检查是否选择了同意
      if (this.choosePact === 0) {
        Toast({
          message: '请选择同意相关协议',
          position: 'middle',
          duration: 3000
        })
        return false
      }
      API.buyTAddOne({stockCode: this.stockData.code, number: this.buyNum, rateId: this.rateId}, (res) => {
        if (res.code === 0) {
          this.$router.push({path: '/strategy', query: {type: 0}})
        } else {
          Toast({
            message: res.msg,
            position: 'middle',
            duration: 3000
          })
        }
      })
    },
    // input失去焦点的验证
    checkBuyNum () {
      if (this.buyNum % 100 !== 0) {
        Toast({
          message: '购买数量必须是100的整数倍',
          position: 'middle',
          duration: 3000
        })
        this.canSubmit = false
      } else if (this.buyNum * 1 === 0) {
        Toast({
          message: '购买数量不能为0',
          position: 'middle',
          duration: 3000
        })
        this.canSubmit = false
      } else if (this.buyNum === '') {
        Toast({
          message: '购买数量不能为空',
          position: 'middle',
          duration: 3000
        })
        this.canSubmit = false
      } else if (this.maxCpje !== -1 && this.totalPrice > this.maxCpje) {
        Toast({
          message: '购买数量超过最大操盘金额',
          position: 'middle',
          duration: 3000
        })
        this.canSubmit = false
      } else if (this.minCpje !== -1 && this.totalPrice < this.minCpje) {
        Toast({
          message: '购买数量小于最小操盘金额',
          position: 'middle',
          duration: 3000
        })
        this.canSubmit = false
      } else {
        this.canSubmit = true
      }
    },
    // T+1的算法
    algorithm (val, obj, n, bzj) {
      this.totalPrice = ((val * 1) * obj.zt).toFixed(2)
      this.profit = (this.totalPrice * ((this.setRule.profitStopPercent * 1) / 100)).toFixed(2)
      this.loss = (bzj * (this.setRule.rates[n].zsxPercent / 100)).toFixed(2)
      this.serviceFee = ((this.totalPrice / 10000 < 1 ? 10000 : this.totalPrice) * this.setRule.rates[n].commFee / 10000).toFixed(2)
      this.sum = ((bzj * 1) + (this.serviceFee * 1)).toFixed(2)
    }
  },
  watch: {
    stockData: {
      handler (newValue, oldValue) {
        if (this.listenStock) {
          this.listenStock = false
          let val = newValue.defaultNum
          this.buyNum = val
          this.getSetT1().then(() => {
            let totalPrice = ((val * 1) * newValue.zt).toFixed(2)
            let bzj = Math.round((totalPrice / (this.setRule.rates[0].level)))
            this.algorithm(val, newValue, 0, bzj)
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
.createT1Container {
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
      top: 25px;
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
  .createBuy {
    margin: 15px 0;
    background: #fff;
    line-height: 80px;
    font-size: 24px;
    padding: 0 20px 10px 20px;
    p {
      position: relative;
      margin: 0;
      span {
        display: inline-block;
        width: 150px;

        .icon {
          position: absolute;
          top: 22px;
          left: 105px;
        }
      }
      em {
        font-style: normal;
        color: $themeColor;
      }
      input[type="tel"] {
        width: 170px;
        height: 48px;
        text-align: center;
        border-radius: 5px;
        border: 0;
        border: 2px solid #ccc;
      }
      input[type="radio"] {
        margin-left: 80px;
        position: absolute;
        top: 28px;
      }
      &:first-child {
        em {
          display: inline-block;
          width: 174px;
          text-align: center;
        }
      }
      &:nth-of-type(3) {
        input {
          border: 2px solid $themeColor;
        }
      }
    }
  }
  .touchOff {
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
    padding: 0 20px 50px 20px;
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
  .summation {
    position: fixed;
    width: calc(100% - 54px);
    padding-top: 30px;
    padding-left: 30px;
    padding-right: 30px;
    left: 0px;
    bottom: 0px;
    font-size: 24px;
    background: #f5f5f5;
    div {
      overflow: hidden;
      p {
        float: left;
        line-height: 50px;
        &:last-child {
          float: right;
        }
        em {
          color: $themeColor;
        }
        .m1 {
          width: 24px;
          float: left;
          margin-top: 14px;
          margin-right: 3px;
        }
        .s2 {
          color: #585858;
        }
        .s3 {
          color: cornflowerblue;
        }
      }
    }
    button {
      width: 100%;
      height: 80px;
      background: $themeColor;
      border: 0;
      outline: 0;
      color: #fff;
      font-size: 30px;
      border-radius: 10px;
      margin: 28px 0;
    }
  }
}
</style>
