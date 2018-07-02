<template>
  <div class='strategyT1Container'>
    <div class="strategyT1Tit">
      <p>
        <span>T+1策略</span>
        <router-link to='historyT1' tag='button'>历史查询</router-link>
      </p>
      <div>
        <span>
          <em>总市值</em>
          <em>{{marketValSum}}</em>
        </span>
        <span>
          <em>策略盈亏</em>
          <em>{{gainLossSum}}</em>
        </span>
      </div>
    </div>
    <div v-show='hasData' class="positionT1">
      <div class='emptyDiv'></div>
      <div class="tit">
        <icon class='icon' name='kind3' scale='1.5'></icon>
        <span>策略持仓</span>
      </div>
      <ul class='posUl1'>
        <li v-for="(item,index) in listT1">
          <div class='liDiv' @click='liClick(index)'>
            <p>
              <span>{{item.stockName}}</span>
              <span>{{item.stockCode}}</span>
            </p>
            <p>
              <span>盈亏</span>
              <span :class="item.gainLoss>=0?'redColor':'greenColor'">
                {{item.gainLoss!=undefined?item.gainLoss.toFixed(2):'-'}}
              </span>
            </p>
            <p>
              <span>{{item.positionNum}}股</span>
            </p>
            <p>
              <i v-if='item.buttonType == 0'>等待接单</i>
              <i v-if='item.buttonType == 1'>等待买入</i>
              <button class='newBuy' v-if='item.buttonType == 2'>新购</button>
              <button @click="popController('sale',item.id,index)" v-if='item.buttonType == 3'>卖出</button>
              <i v-if='item.buttonType == 4'>等待卖出</i>
              <button class='stopBtn' v-if='item.buttonType == 6'>停牌</button>
            </p>
          </div>
          <div class='posT1ListDetail'>
            <p style="width:100%;">
              策略编号：{{item.orderNumber!=undefined?item.orderNumber:'-'}}
            </p>
            <table>

              <tr>
                <td>
                  成交均价：{{item.buyAveragePrice!=undefined?item.buyAveragePrice.toFixed(2):'-'}}
                </td>
                <td>
                  止盈：{{item.profitStop!=undefined?item.profitStop.toFixed(2):'-'}}
                </td>
                <td>
                  递延条件≥{{item.warningLine!=undefined?item.warningLine.toFixed(2):'-'}}
                </td>
              </tr>
              <tr>
                <td>
                  当前价格：{{item.newPrice!=undefined?item.newPrice.toFixed(2):'-'}}
                </td>
                <td>
                  止损：{{item.closeLine!=undefined?item.closeLine.toFixed(2):'-'}}
                </td>
                <td>
                  递延费：{{item.continueFee!=undefined?item.continueFee.toFixed(2):'-'}}元
                </td>
              </tr>
            </table>
            <p>
              {{item.buyTime}}
              <span>
                自动递延
                <em @click="autoContinueFlag(item.strategyId,0,index)" v-show='item.continueFlag == 1'>
                  <icon class='openIcon' name='open' scale='5'></icon>
                </em>
                <em @click="autoContinueFlag(item.strategyId,1,index)" v-show='item.continueFlag == 0'>
                  <icon class='openIcon' name='close' scale='5'></icon>
                </em>
              </span>

            </p>
            <p v-if='item.buttonType != 6'>
              <button @click="popController('changeZS',item.id,index)">修改止损</button>
              <button @click="popController('addBZJ',item.strategyId,index,item.id)">增加保证金</button>
              <button v-if="item.needContinue ==1" @click="popController('handDefer',item.strategyId,index)">立即递延</button>
            </p>
            <p v-if='item.buttonType == 6'>
              <button @click="popController('giveUp',item.id,index)">放弃策略</button>
              <button @click="popController('buyStop',item.id,index)">买断策略</button>
              <button v-if="item.needContinue ==1" @click="popController('handDefer',item.strategyId,index)">立即递延</button>
            </p>
          </div>
        </li>
      </ul>
    </div>
    <div v-show='!hasData' class="noData">
      <img src="../../../assets/img/nodata1.jpg" alt="" />
      <p>暂无进行中的策略</p>
      <router-link to='create' tag='button'>立即创建</router-link>
    </div>
    <!--创建更多-->
    <!--<router-link to="/create" class='addMoreDiv' tag="div">
			<icon class="addMoreIcon" name='addMore' scale='6'>
				<span></span>
			</icon>
		</router-link>-->
    <!--弹窗-->
    <div v-if="$route.query.type == 0">
      <inputPop v-show="inputPopShow" ref='inputPop'></inputPop>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-svg-icon/Icon.vue'
import { API } from '../../../utils/api.js'
import $ from 'jquery'
import InputPop from '../../plugIn/InputPop.vue'
import { setStatuc, getStatuc } from '../../../utils/request'
let vm

export default {
  data() {
    return {
      hasData: false,
      isOpen: true,
      listT1: [],
      marketValSum: '', // 总市值
      gainLossSum: '', // 策略盈亏
      buyCostTotal: '', // 成交均价
      popType: '',
      inputPopShow: false,
      stockId: 0,
      loadShow: true,
      isInval: true
    }
  },
  components: {
    Icon,
    InputPop
  },
  beforeDestroy () {
    this.isInval = false
  },
  mounted () {
    vm = this
  },
  methods: {
    // T+1持仓列表
    strategyListT1 () {
      let _this = this
      if (_this.isInval) {
        API.strategyListT1(vm.loadShow, res => {
          if (vm.loadShow) {
            vm.loadShow = false
          }
          if (res.code !== 0 || res.data.length <= 0) {
            vm.hasData = false
            return
          }
          vm.hasData = true
          vm.listT1 = res.data

          // 总市值
          vm.marketValSum = ''
          // 策略盈亏
          vm.gainLossSum = ''
          vm.listT1.forEach(item => {
            // item.buttonType = 6//TODO 测试代码
            // 总市值
            vm.marketValSum = (
              Number(vm.marketValSum) +
              item.newPrice * item.positionNum
            ).toFixed(2)
            // 策略盈亏
            vm.gainLossSum = (Number(vm.gainLossSum) + item.gainLoss).toFixed(2)
          })
          setTimeout(() => {
            _this.strategyListT1()
          }, 1000)
        })
      }
    },
    // 保证每次显示一个详情
    liClick(index) {
      let dom = $('.posUl1 li')
        .eq(index)
        .find('.posT1ListDetail')[0]
      if (dom.style.display == 'block') {
        dom.style.display = 'none'
      } else {
        dom.style.display = 'block'
        let oTable = $('.posUl1 li')
          .eq(index)
          .siblings()
          .find('.posT1ListDetail')
        for (var item of oTable) {
          item.style.display = 'none'
        }
      }
    },
    //关闭/开启自动递延
    autoContinueFlag(strategyId, continueFlag, index) {
      API.autoContinueFlag(strategyId, continueFlag, function(res) {
        if (res.code == 0) {
          vm.listT1[index].continueFlag = continueFlag
        } else {
          layer.open({
            content: res.msg,
            skin: 'msg',
            time: 2 //2秒后自动关闭
          })
        }
      })
    },
    //弹出框
    popController(type, strategyId, index, elseId) {
      //				console.log(strategyId)
      vm.inputPopShow = true
      vm.popType = type
      vm.$refs.inputPop.stockId = strategyId
      vm.$refs.inputPop.changeHight()

      if (type == 'changeZS') {
        vm.$refs.inputPop.popTit = '修改止损'
        vm.$refs.inputPop.zsPrice = ''
        vm.$refs.inputPop.getLowClosePrice(strategyId)
        vm.$refs.inputPop.closePrice = vm.listT1[index].closePrice //当前止损价格
      } else if (type == 'addBZJ') {
        vm.$refs.inputPop.popTit = '增加保证金'
        vm.$refs.inputPop.closePrice = vm.listT1[index].closePrice //当前止损价格
        vm.$refs.inputPop.deposit = '' //要增加的保证金
        vm.$refs.inputPop.warningLine = vm.listT1[index].warningLine //递延条件
        vm.$refs.inputPop.elseId = elseId
        vm.$refs.inputPop.bonusAmount = vm.listT1[index].bonusAmount //分红金额
        vm.$refs.inputPop.buyCostTotal = vm.listT1[index].buyCostTotal //买入总价
        vm.$refs.inputPop.positionNum = vm.listT1[index].positionNum //买入数量
        //					vm.$refs.inputPop.getLowClosePrice(elseId)
        vm.$refs.inputPop.lowCloseLine = vm.listT1[index].lowCloseLine //(用于计算止损金额)
      } else if (type == 'handDefer') {
        vm.$refs.inputPop.popTit = '立即递延'
      } else if (type == 'sale') {
        vm.$refs.inputPop.popTit = '卖出'
        vm.$refs.inputPop.saleData = {
          stockName: vm.listT1[index].stockName,
          stockCode: vm.listT1[index].stockCode,
          gainLoss: vm.listT1[index].gainLoss,
          positionNum: vm.listT1[index].positionNum
        }
      } else if (type == 'giveUp') {
        vm.$refs.inputPop.popTit = '放弃策略'
      } /*else if(type == 'deferLong'){
					vm.$refs.inputPop.popTit = '长期递延'
					vm.$refs.inputPop.deferTime = ''
					vm.$refs.inputPop.investorGain = vm.listT1[index].investorGain//长期递延的递延费
				}*/ else if (
        type == 'buyStop'
      ) {
        vm.$refs.inputPop.popTit = '买断策略'
        vm.$refs.inputPop.buyoutAmount = vm.listT1[index].buyoutAmount //买断时需付金额
      }
    }
  }
}
</script>

<style lang='scss'>
@import "../../../assets/css/bus";
.strategyT1Container {
  /*border:2px solid red;*/
  overflow-y: auto;
  
  height:100%;
  .strategyT1Tit {
    padding: 0 30px;
    background: $themeColor;
    color: #fff;
    height: 240px;
    p {
      height: 88px;
      line-height: 88px;
      border-bottom: 1px solid #fff;
      font-size: 28px;
      button {
        float: right;
        /*width: 170px;*/
        padding: 0 20px;
        height: 48px;
        background: transparent;
        border: 2px solid #fff;
        border-radius: 50px;
        color: #fff;
        margin-top: 18px;
        outline: 0;
      }
    }
    div {
      span {
        display: inline-block;
        width: 49%;
        line-height: 50px;
        padding-top: 18px;
        em {
          display: block;
          &:first-child {
            font-size: 24px;
          }
          &:last-child {
            font-size: 30px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  .positionT1 {
    background: #fff;

    .tit {
      height: 80px;
      line-height: 80px;
      padding: 0 20px;
      .icon {
        float: left;
        margin-top: 25px;
        margin-right: 10px;
      }
      span {
        color: #585858;
        font-size: 28px;
      }
    }
    .posUl1 {
      border-bottom: 2px solid #ccc;
      border-collapse: collapse;
      width: 100%;
      padding: 0;
      margin: 0;
      text-align: center;

      li {
        overflow: hidden;
        border-top: 1px solid #ccc;
        .liDiv {
          height: 120px;
          display: flex;
          align-items: center;
          p {
            flex: 1;
            line-height: 40px;
            font-size: 24px;
            color: #282828;
            &:nth-of-type(1) {
              span {
                &:first-child {
                  font-size: 28px;
                }
                &:last-child {
                  color: #585858;
                }
              }
            }
            &:nth-of-type(3) {
              line-height: 120px;
            }
            span {
              display: block;
            }
            button {
              background: transparent;
              color: $themeColor;
              border: 2px solid $themeColor;
              border-radius: 50px;
              width: 120px;
              height: 48px;
              outline: 0;
              &.newBuy,
              &.stopBtn {
                color: #fff;
                border: 0;
                background: #989898;
              }
              &.repealBtn {
                color: #fff;
                border: 0;
                background: $blueColor;
              }
            }
          }
        }
        .posT1ListDetail {
          /*height: 300px;*/
          background: #f5f5f5;
          font-size: 20px;
          padding: 15px 20px 0 20px;
          display: none;
          table {
            td {
              padding: 20px 0;
              width: 30%;
              text-align: left;
            }
          }
          p {
            text-align: left;
            overflow: hidden;
            height: 70px;
            line-height: 70px;
            /*margin-top:20px;*/
            span {
              float: right;
              .openIcon {
                float: right;
                margin-left: 45px;
                margin-top: -14px;
              }
            }
            button {
              width: 200px;
              height: 48px;
              background: transparent;
              color: $themeColor;
              border: 2px solid $themeColor;
              border-radius: 50px;
              outline: 0;
            }
            &:last-child {
              display: flex;
              justify-content: space-around;
              margin-top: 25px;
            }
          }
        }
      }
    }
  }
  .noData {
    img {
      margin-top: 200px;
    }
  }
  .addMoreDiv {
    width: 100px;
    height: 100px;
    position: absolute;
    right: 20px;
    bottom: 120px;
    opacity: 0.7;
  }
}
</style>
