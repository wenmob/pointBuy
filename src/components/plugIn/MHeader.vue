<template>
  <div class="mobile-head">
    <div class="left">
      <div v-show="leftShow" @click="goBack">
        <icon name="fanhui" scale="2.4"></icon>
      </div>
    </div>
    <div class="title">{{mTitle}}</div>
    <router-link :to='rightRouter' class="right" tag='div'>
      <icon v-show='questionShow' name="question" scale="2.4"></icon>
    </router-link>
  </div>
</template>

<script>
import Icon from 'vue-svg-icon/Icon.vue'
import { API } from '../../utils/api.js'
let vm

export default {
  name: 'mheader',
  data () {
    return {
      mTitle: '',
      leftShow: false,
      searchShow: false,
      questionShow: false,
      rightRouter: ''
    }
  },
  mounted () {
    vm = this
    this.routerController()
  },
  components: {
    Icon
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    // 路由特殊处理
    routerController () {
      // console.log(this.$route)
      /*获取头部信息*/
      API.getCommon(function (res) {
        // console.log(res)
        if (vm.$route.path === '/') {
          // console.log(vm.mTitle)
          vm.mTitle = res.data.siteName
          document.title = res.data.siteName
        } else if (vm.$route.path === '/alipayQrcode') {
          if (vm.$route.query.type && vm.$route.query.type == 'pay') {
            vm.mTitle = document.title = '支付宝转账'
          } else {
            vm.mTitle = document.title = '支付宝绑定'
          }
        } else {
          vm.mTitle = vm.$route.name
          document.title = vm.$route.name
        }
      })

      /*控制头部左侧图标*/
      if (this.$route.path === '/') {
        this.leftShow = false
      } else {
        this.leftShow = true
      }
      /*控制头部右侧图标*/
      if (this.$route.path === '/createDetail') {
        this.questionShow = true
        this.rightRouter = 'userNotice'
      } else {
        this.questionShow = false
      }
    }
  },
  watch: {
    // 监听路由的方法
    $route (to, from) {
      this.routerController()
    }
  }
}
</script>

<style lang="scss" type="text/css" scoped>
@import "../../assets/css/bus";
.mobile-head {
  position: relative;
  width: calc(100% - 52px);
  display: flex;
  padding: 20px 26px;
  height: 44px;
  background-color: $themeBgColor;
  justify-content: space-between;
	border-bottom:1px solid $borderColor;  
  .left {
    width: 10%;
    height: 100%;
  }
  .title {
    width: 80%;
    height: 100%;
    text-align: center;
    font-size: 36px;

    font-weight: 500;
  }
  .right {
    width: 10%;
    height: 100%;
  }
}
</style>
