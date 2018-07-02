<template>
    <div class="own-edit-footer" ref="delBtn" @click="delStock">
      <icon class="own-edit-ico" name="del" scale="2.8"></icon>
    </div>
</template>

<script>
import selfApi from '../../utils/stockSelf'
import Icon from 'vue-svg-icon/Icon.vue'
export default {
  props: ['muiltStock'],
  data () {
    return {

    }
  },
  inject: ['reload'], // 注入刷新的方法
  components: {
    Icon
  },
  methods: {
    // 删除已选的股票
    delStock () {
      if (this.muiltStock.length === 0) {
        return
      }
      let stockCode = this.muiltStock.toString()
      selfApi.subSelfStock(stockCode).then(res => {
        if (res.code === '0') {
          this.reload()
        }
      })
    }
  },
  watch: {
    'muiltStock': {
      handler: function (newVal) {
        if (newVal.length === 0) {
          this.$refs.delBtn.classList.remove('active')
        } else {
          this.$refs.delBtn.classList.add('active')
        }
      },
      deep: true //  深度监听
    }
  }
}
</script>

<style lang="scss" type="text/css" scoped>
  @import "../../assets/css/bus";
 .own-edit-footer {
  position: fixed;
  width: 100%;
  height: 98px;
  left: 0px;
  bottom: 0px;
  z-index: 2000;
  background-color: #f6f6f8;
  text-align: center;
  &.active {
    background-color: #f76160;
    .own-edit-ico {
      margin-top: 25px;
      color: #fff;
    }
  }
  .own-edit-ico {
    margin-top: 25px;
    color: #f76160;
  }
 }
</style>
