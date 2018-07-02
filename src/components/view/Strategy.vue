<template>
  <div class='strategyContainer'>
    <!--<div class="tabTit">
   				<div>
	   					<span @click='chsngeTab(0)' :class="$route.query.type == '0'?'titActive':''">T+1</span>
	   					<span @click='chsngeTab(1)' :class="$route.query.type == '1'?'titActive':''">T+D</span>
   				</div>
   		</div>-->
    <div class="createContent">
      <strategyT1 ref="strategyT1" v-show="$route.query.type == '0'"></strategyT1>
      <strategyTD ref="strategyTD" v-show="$route.query.type == '1'"></strategyTD>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-svg-icon/Icon.vue'
import strategyT1 from '@/components/view/strategy/StrategyT1'
import strategyTD from '@/components/view/strategy/StrategyTD'
import { setStatuc, getStatuc } from '../../utils/request'
let vm

export default {
  data() {
    return {}
  },
  components: {
    Icon,
    strategyT1,
    strategyTD
  },
  mounted () {
    vm = this
    /*定时器随时更新盈亏数据*/
    vm.$refs.strategyT1.strategyListT1()
      /*if(vm.$route.query.type == 0){
					vm.$refs.strategyT1.strategyListT1()
				}else if(vm.$route.query.type == 1){
					vm.$refs.strategyTD.strategyListTD()
				}*/
    this.needFot()
  },

  methods: {
    //选项卡
    chsngeTab (index) {
      vm.$router.push({ path: '/strategy', query: { type: index } })
    },
    // 底部显示
    needFot () {
      this.$emit('listenFot', '0')
    }
  }
}
</script>

<style lang='scss'>
@import "../../assets/css/bus";
.strategyContainer {
  /*padding-bottom:100px;*/
 position:absolute;
 height:100%;
  .tabTit {
    width: 100%;
    height: 46px;
    background: #fff;
    padding: 27px 0;
    div {
      width: 280px;
      height: 46px;
      margin: 0 auto;
      display: flex;
      span {
        flex: 1;
        text-align: center;
        line-height: 46px;
        font-size: 30px;
        border: 2px solid #f36a6a;
        &:first-child {
          border-radius: 10px 0 0 10px;
        }
        &:last-child {
          border-radius: 0 10px 10px 0;
        }
        &.titActive {
          background: #f36a6a;
          color: #fff;
        }
      }
    }
  }
}
</style>
