<template>
  <div class="agreenContainer">
    <p class="p1" @click="$router.push('/platformAgreement')">平台服务协议</p>
    <p class="p1" @click="$router.push('/tradeAgreement')">A股交易合作协议</p>
    <!-- <p class="p1">T+D A股交易合作协议</p> -->
  </div>
</template>

<script>
export default {
  mounted () {
    this.notFot()
  },
  methods: {
    // 不需要底部
    notFot () {
      this.$emit('listenFot', '3')
    }
  }
}
</script>

<style lang='scss'>
@import "../../assets/css/bus";
.agreenContainer {
  width: 100%;
  p {
    padding-left: 30px;
    padding-right: 30px;
    height: 88px;
    line-height: 88px;
    color: rgb(40,40,40);
    font-size: 28px;
    &.p1 {
      border-bottom: 2px solid #ddd;
    }
  }
}
</style>
