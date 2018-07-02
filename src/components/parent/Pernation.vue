<template>
  <div class="bis-page">
    <m-header :m-title="title" :left-show="ls" v-show="topShow" />
    <div class="app-main" ref="appMain">
      <transition :name="transitionName" @before-enter="beforeEnter" @after-enter="afterEnter">
        <router-view class="child-view"
         ref="rou"
         v-on:listenFot="checkBom"
         v-on:listenMuilt="getMuilt"
         v-on:listenCreateDetail="getCreateDetail"
         />
      </transition>
    </div>
    <m-footer ref='foot' v-if="footShow === 0" />
    <!--自选编辑底部组件 0需要、3是不需要、2是编辑删除的底部、4是自选股底部-->
    <m-detele ref="det" :muilt-stock="muiltStockIds" v-else-if="footShow === 2" />
    <!--创建T+1自选股底部组件-->
    <m-create-submit ref="fund" :sub-date="fundata" v-else-if="footShow === 4"/>
  </div>
</template>

<script>
import MHeader from '../plugIn/MHeader'
import MFooter from '../plugIn/MFooter'
import Mdetele from '../plugIn/Mdetele'
import McreateSubmit from '../plugIn/McreateSubmit'
let vm

export default {
  name: 'Pernation',
  data () {
    return {
      topShow: true,
      footShow: 0,
      transitionName: 'slide-right',
      title: '赢钱网',
      ls: true,
      fotHiddenArr: ['/register', '/login', '/createDetail'],
      muiltStockIds: [],
      fundata: {
        choosePact: 0,
        tacticsVal: '',
        canSubmit: false,
        maxCpje: 0,
        minCpje: 0,
        tacticsObj: {},
        code: '',
        bzjIndex: '',
        sum: 0
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    let isBack = this.$router.isBack
    if (isBack) {
      this.transitionName = 'slide-right'
    } else {
      this.transitionName = 'slide-left'
    }
    this.$router.isBack = false
    next()
  },
  components: {
    mHeader: MHeader,
    mFooter: MFooter,
    mDetele: Mdetele,
    mCreateSubmit: McreateSubmit
  },
  mounted () {
    vm = this
    this.isWeixinBrowser()
    // vm.footerController()
  },
  methods: {
    beforeEnter () {
      this.$refs.rou.$el.style.opacity = '0'

      // $('.child-view').css("opacity","0");
    },
    afterEnter () {
      this.$refs.rou.$el.style.opacity = '1'
      // $('.child-view').css("opacity","1");
    },
    // 判断是否为微信浏览器
    isWeixinBrowser () {
      const agent = window.navigator.userAgent.toLowerCase()
      // 微信端的样式
      if (agent.indexOf('micromessenger') !== -1) {
        vm.topShow = false
        if (this.footShow === 2) {
          $('.app-main').css('height', 'calc(100% - 58px)')
        } else if (this.footShow === 3) {
          $('.app-main').css('height', 'calc(100% - 0px)')
        } else {
          $('.app-main').css('height', 'calc(100% - 48px)')
        }
      } else {
        // 浏览器端的样式
        vm.topShow = true
        if (this.footShow === 2) {
          $('.app-main').css('height', 'calc(100% - 96px)')
        } else if (this.footShow === 3) {
          $('.app-main').css('height', 'calc(100% - 41px)')
        }
      }
    },
    // 检查页面底部是否显示的问题
    checkBom (e) {
      this.footShow = parseInt(e)
    },
    // 获取编辑的内容
    getMuilt (arr) {
      this.muiltStockIds = arr
    },
    // 获取详情的内容
    getCreateDetail (obj) {
      this.fundata = Object.assign({}, this.fundata, obj)
    }
    // // 控制底部显示隐藏
    // footerController () {
    //   //  console.log(vm.$route)
    //   let fotArr = vm.$refs.foot.items
    //   let fotHiddenArr = []
    //   fotArr.forEach(function (item) {
    //     fotHiddenArr.push(item.path)// 底部四个路由
    //   })
    //   // console.log(fotHiddenArr)
    //   if (fotHiddenArr.indexOf(vm.$route.path) !== -1) {
    //     if (vm.$route.fullPath === '/strategy?type=1') {
    //       vm.footShow = false
    //       return
    //     }
    //     vm.footShow = true
    //   } else {
    //     vm.footShow = false
    //   }
    // }
  },
  watch: {
    // 监听路由的方法
    $route (to, from) {
      //  console.log(to)
      let isBack = vm.$router.isBack // 监听路由变化时的状态为前进还是后退
      if (isBack) {
        vm.transitionName = 'slide-right'
      } else {
        vm.transitionName = 'slide-left'
      }
      vm.$router.isBack = false
    },
    footShow (newVal, oldVal) {
      this.isWeixinBrowser()
    }
  }
}
</script>

<style lang="scss" type="text/css">
@import "../../assets/css/bus";
.child-view {
  position: absolute;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(50px, 0);
  transform: translate(50px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-50px, 0);
  transform: translate(-50px, 0);
}
</style>
