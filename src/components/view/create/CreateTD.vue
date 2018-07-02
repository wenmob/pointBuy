<template>
  <div class="createTDContainer">
    <!--申请金额-->
    <div class="createMoney">
      <p>
        <span>策略金额</span>
        <input type="tel"
        v-model="tacticsVal"
        placeholder='输入您要申请的金额，单位万元'
        onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
        onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}"
        ref="tactics"
        @input="tacticsInput"
        @blur="checkTacInput"/>
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
        <span>持仓时间</span>
        <span>
          <button v-for="(ta,index) in tacticsArr"
          :key="index"
          :class="otIndex == index ? 'active' : ''"
          @click="clickOpenTime(index)">T+{{ta.days}}</button>
        </span>
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
    <div class="appointBzjTD">
      <p>
        <span>履约保证金</span>
        <button v-for="(bj,index) in tacticsArr[otIndex].rates"
        :key="index"
        :class="bzjIndex == index ? 'active' : ''"
        @click="clickBjz(index, Math.round(tacticsVal*1*10000 / bj.level))">{{Math.round(tacticsVal*1*10000 / bj.level)}}</button>
      </p>
      <p>
        <span>递延费</span>
        <em>{{continueFee}}元（{{cfee}}元/万）</em>
      </p>
      <!-- <p>
   				<span>递延费</span>
   				<i>20元/万/天</i>
   			</p> -->
    </div>
    <!--合计-->
    <div class="summationTD">
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
      <button @click="createGroup">发起策略</button>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import Icon from 'vue-svg-icon/Icon.vue'
import { API } from '../../../utils/api'
export default {
  data () {
    return {
      choosePact: 0,
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
      tacticsArr: [],
      tacticsObj: {},
      bzjs: [{ val: '1234' }, { val: '2342' }],
      profit: 0, // 止赢
      loss: 0, // 止损
      cfee: 0, // 20元/万
      continueFee: 0, // 递延费
      sum: 0, // 合计
      maxCpje: 0, // 最大操盘金额
      minCpje: 0, // 最小操盘金额
      canSubmit: false
    }
  },
  components: {
    Icon
  },
  mounted () {
    this.getSetTD()
  },
  methods: {
    isPact () {
      if (this.choosePact === 0) {
        this.choosePact = 1
      } else {
        this.choosePact = 0
      }
    },
    // 点击推荐的效果
    clickTui (n) {
      this.tuiIndex = n
      this.tacticsVal = this.tuiBtn[n].val
      let bzj = Math.round(this.tacticsVal * 10000 / this.tacticsArr[this.otIndex].rates[this.bzjIndex].level)
      this.tacticsAlg(this.tacticsVal, this.tacticsArr[this.otIndex], this.bzjIndex, bzj)
    },
    // 点击持仓时间
    clickOpenTime (n) {
      this.otIndex = n
      this.tacticsObj = this.tacticsArr[n]
    },
    // 点击保证金的效果
    clickBjz (n, bzj) {
      this.bzjIndex = n
      this.maxCpje = this.tacticsObj.rates[n].maxCpje
      this.minCpje = this.tacticsObj.rates[n].minCpje
      this.tacticsAlg(this.tacticsVal, this.tacticsArr[this.otIndex], n, bzj)
    },
    // 获取策略组的设置参数
    getSetTD () {
      return new Promise((resolve, reject) => {
        API.strategySet_get(2, (res) => {
          if (res.code === 0) {
            let arr = res.data
            this.tacticsArr = arr
            this.tacticsObj = arr[0]
            this.maxCpje = this.tacticsObj.rates[0].maxCpje
            this.minCpje = this.tacticsObj.rates[0].minCpje
            let bzj = Math.round(this.tacticsVal * 10000 / this.tacticsObj.rates[0].level)
            this.tacticsAlg(this.tacticsVal, this.tacticsObj, this.bzjIndex, bzj)
          }
          resolve()
        })
      })
    },
    // 输入框实时
    tacticsInput () {
      let val = this.$refs.tactics.value
      let bzj = Math.round(val * 10000 / this.tacticsObj.rates[this.bzjIndex].level)
      this.tacticsAlg(val, this.tacticsObj, this.bzjIndex, bzj)
    },
    // 创建策略组
    createGroup () {
      this.checkTacInput()
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
      let amount = this.tacticsVal * 10000
      let setId = this.tacticsArr[this.otIndex].id
      let rateId = this.tacticsObj.rates[this.bzjIndex].id
      // console.log(amount, setId, rateId)
      API.createTAddD({amount: amount, setId: setId, rateId: rateId}, (res) => {
        if (res.code === 0) {
          this.$router.push({path: '/strategy', query: {type: 1}})
        } else {
          Toast({
            message: res.msg,
            position: 'middle',
            duration: 3000
          })
        }
      })
    },
    // 对策略组输入金额进行验证
    checkTacInput () {
      if (this.tacticsVal === 0) {
        Toast({
          message: '策略金额不能为0',
          position: 'middle',
          duration: 3000
        })
        this.canSubmit = false
      } else if (this.tacticsVal === '') {
        Toast({
          message: '策略金额不能为空',
          position: 'middle',
          duration: 3000
        })
        this.canSubmit = false
      } else if (this.maxCpje !== -1 && this.tacticsVal > this.maxCpje) {
        Toast({
          message: '策略金额大于最大金额',
          position: 'middle',
          duration: 3000
        })
        this.canSubmit = false
      } else if (this.minCpje !== -1 && this.tacticsVal < this.minCpje) {
        Toast({
          message: '策略金额小于最小金额',
          position: 'middle',
          duration: 3000
        })
        this.canSubmit = false
      } else {
        this.canSubmit = true
      }
    },
    // 策略组的算法
    tacticsAlg (total, obj, n, bzj) {
      this.profit = ((total * 10000) * (obj.profitStopPercent / 100)).toFixed(2)
      this.loss = (bzj * obj.rates[n].zsxPercent / 100).toFixed(2)
      this.cfee = obj.rates[n].rate
      this.continueFee = total * this.cfee
      this.sum = bzj + this.continueFee
    }
  }
}
</script>

<style lang='scss'>
@import "../../../assets/css/bus";
.createTDContainer {
  background: #f5f5f5;
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
        width: 100%;
        height: 48px;
        margin-left: 42px;
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
  .appointBzjTD {
    background: #fff;
    padding: 0 20px 50px 20px;
    font-size: 24px;
    p {
      line-height: 80px;
      span {
        display: inline-block;
        width: 140px;
        color: #585858;
      }
      button {
        background: transparent;
        border: 2px solid #ccc;
        width: 180px;
        height: 48px;
        margin-left: 8px;
        border-radius: 5px;
        &.active {
          border: 2px solid $themeColor;
          color: $themeColor;
        }
      }
      em {
        color: $themeColor;
      }
    }
  }
  .summationTD {
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
