<template>
  <div class='createContainer'>
    <div class="tabTit">
    </div>
    <div class="createContent">
      <createT2 ref='createt1' :stock-data="stock" v-show="tabActive == '0'" v-on:listenCreateDetail="getCreateDetail">
      </createT2>
    </div>

  </div>
</template>

<script>
import Icon from 'vue-svg-icon/Icon.vue'
import createT2 from '@/components/view/create/CreateT2'
import { sinaStock } from '../../quote/sina'
export default {
  name: 'B',
  data () {
    return {
      isLogin: false,
      tabActive: '0',
      stockCode: '',
      stock: {},
      startGo: true
    }
  },
  components: {
    Icon,
    createT2
    // createT1,
    // createTD,
    // createTDT
  },
  beforeDestroy () {
    this.startGo = false
  },
  mounted () {
    this.notFot()
    this.hasStockCode()
  },
  methods: {
    // 判断页面是否有stockCode
    hasStockCode () {
      if (this.startGo) {
        if (this.$route.query.stockCode) {
          this.stockCode = this.$route.query.stockCode
          sinaStock.Detail(this.stockCode, (res) => {
            this.stock = res[0]
            this.loalSave(this.stock)
            setTimeout(() => {
              this.hasStockCode()
            }, 1500)
          })
        } else {
          this.stockCode = ''
        }
      }
    },
    // 本地存储
    loalSave (stock) {
      if (typeof (Storage) !== 'undefined') {
        let items = []
        items = JSON.parse(window.localStorage.getItem('stock'))
        if (items) {
          if (items.length < 10) {
            let n = items.findIndex(ele => {
              return ele.code === stock.code
            })
            if (n === -1) {
              items.push(stock)
            }
          } else {
            items[0] = stock
          }
        } else {
          items = []
          items.push(stock)
        }
        window.localStorage.setItem('stock', JSON.stringify(items))
      } else {
        // 什么也不做
      }
    },
    // 底部不显示
    notFot () {
      this.$emit('listenFot', '4')
    },
    getCreateDetail (obj) {
      this.$emit('listenCreateDetail', obj)
    }
  }
}
</script>

<style lang='scss'>
@import "../../assets/css/bus";
.createContainer {
  padding-bottom: 156px;
  position: absolute;
  min-height: calc(100% - 156px);
  top: 0;
  .tabTit {
    /*margin-top:84px;*/
    width: 100%;
    // height: 46px;
    background: #fff;
    // padding: 27px 0;
    border-bottom: 2px solid #f5f5f5;
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
