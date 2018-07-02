<template>
  <!--合计-->
    <div class="summationTD">
      <div>
        <p>
          <span>合计</span>
          <em>{{subDate.sum}}元</em>
        </p>
        <p>
          <img class="m1" src="../../assets/img/choose1.png" v-if="choosePact == 0" @click="isPact"/>
          <img class="m1" src="../../assets/img/choose2.png" v-else @click="isPact"/>
          <span class="s2" @click="isPact">阅读并同意</span>
          <span class="s3" @click="$router.push('/agreement')">《相关协议》</span>
        </p>
      </div>
      <button @click="createGroup" ref="createBtn" id="createBtn">{{btnStr}}</button>
    </div>
</template>
<script>
import { Toast } from 'mint-ui'
import { API } from '../../utils/api'
import { setStatuc, setComfit } from '../../utils/request'
export default {
  props: ['subDate'],
  data () {
    return {
      choosePact: 0,
      btnStr: '发起策略'
    }
  },
  beforeDestroy () {
  },
  methods: {
    isPact () {
      if (this.choosePact === 0) {
        this.choosePact = 1
      } else {
        this.choosePact = 0
      }
    },
    // 创建策略组
    createGroup () {
      setStatuc(0)
      setComfit(1)
      this.checkTacInput()
      // 检查数量是否符合
      if (!this.subDate.canSubmit) {
        return false
      }
      // 检查是否选择了同意
      if (this.choosePact === 0) {
        Toast({
          message: '请选择同意相关协议',
          position: 'middle',
          className: 'toastNee',
          duration: 3000
        })
        return false
      }
      let operateAmount = this.subDate.tacticsVal * 10000
      let rateId = this.subDate.tacticsObj.rates[this.subDate.bzjIndex].id
      // console.log(amount, setId, rateId)
      API.buyTAddOne({operateAmount: operateAmount, rateId: rateId, stockCode: this.subDate.code}, (res) => {
        if (res.code === 0) {
          this.$router.push({path: '/strategy', query: {type: 0}})
        } else {
          Toast({
            message: res.msg,
            position: 'middle',
            className: 'toastNee',
            duration: 3000
          })
        }
      })
    },
    // 对策略组输入金额进行验证
    checkTacInput () {
      if (this.subDate.tacticsVal * 1 === 0) {
        Toast({
          message: '策略金额不能为0',
          position: 'middle',
          className: 'toastNee',
          duration: 3000
        })
        this.subDate.canSubmit = false
      } else if (this.subDate.tacticsVal === '') {
        Toast({
          message: '策略金额不能为空',
          position: 'middle',
          className: 'toastNee',
          duration: 3000
        })
        this.subDate.canSubmit = false
      } else if (this.subDate.maxCpje !== -1 && this.subDate.tacticsVal * 10000 > this.subDate.maxCpje) {
        Toast({
          message: '策略金额不能大于' + this.subDate.maxCpje,
          position: 'middle',
          className: 'toastNee',
          duration: 3000
        })
        this.subDate.canSubmit = false
      } else if (this.subDate.minCpje !== -1 && this.subDate.tacticsVal * 10000 < this.subDate.minCpje) {
        Toast({
          message: '策略金额不能小于' + this.subDate.minCpje,
          position: 'middle',
          className: 'toastNee',
          duration: 3000
        })
        this.subDate.canSubmit = false
      } else {
        this.subDate.canSubmit = true
      }
    },
    // 判断按钮是否可点击
    checkUse (m, s) {
      let _this = this
      if (!m) {
        _this.$refs.createBtn.classList.add('cease')
        $('#createBtn').css({'background-color': '#8B8B8B', 'pointer-events': 'none'})
      } else {
        _this.$refs.createBtn.classList.remove('cease')
        $('#createBtn').css({'background-color': '#f36a6a', 'pointer-events': 'auto'})
      }
      _this.btnStr = s
      $('#createBtn').text(_this.btnStr)
    }
  },
  watch: {
    subDate: {
      handler (newValue, oldValue) {
        // 判断按钮是否可点击
        this.checkUse(newValue.mSub, newValue.msg)
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" type="text/css" scoped>
  @import "../../assets/css/bus";
  .summationTD {
    position: absolute;
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
      &.cease {
        background: '#8B8B8B';
        pointer-events: none;
      }
    }
  }
</style>
