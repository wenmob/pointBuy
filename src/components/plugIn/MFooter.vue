<template>
  <div class="mobile-footer">
    <div class='footerItem' :class="$route.path == item.path ? css2 :css1" v-for="(item,index) in items" :key="index" @click="nextFill(item.path)">
      <div>
      <icon class="icon" :name="item.svg" :scale="item.sacle"></icon>
      </div>
      <div class="title">{{item.name}}</div>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-svg-icon/Icon.vue'
export default {
  name: 'MFooter',
  data () {
    return {
      css1: 'm-f-item',
      css2: 'm-f-item-active',
      items: [
        {
          name: '首页',
          svg: 'home',
          path: '/',
          sacle: 2.4
        },
        {
          name: '创建',
          svg: 'create',
          path: '/create',
          sacle: 2.4
        },
        {
          name: '策略',
          svg: 'strategy',
          path: '/strategy',
          sacle: 2.4
        },
        {
          name: '我的',
          svg: 'user',
          path: '/user',
          sacle: 2.4
        }
      ]
    }
  },
  components: {
    Icon
  },
  methods: {
    nextFill (e) {
//  	console.log(e)
      this.$router.push(e)
    }
  }
}
</script>

<style lang="scss" type="text/css" scoped>
  @import "../../assets/css/bus";
  .mobile-footer {
    position: absolute;
    width:100%;
    left: 0px;
    bottom: 0px;
    z-index: 2000;
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-top: 1px solid #EAEAEA;
    background-color: #f5f5f5;
    height: 72px;
    .footerItem {
      text-align: center;
     	flex:1;
      .icon {
        color:#4D4D4D;
      }
      .title{
      font-size: 23px;
      margin-top: 2px;
      color: #4D4D4D;
    }
  }
  .m-f-item-active {
      text-align: center;
      .icon {
        color:$themeColor;
      }
      .title{
      font-size: 23px;
      margin-top: 2px;
      color: $themeColor;
    }
  }
  }
</style>
