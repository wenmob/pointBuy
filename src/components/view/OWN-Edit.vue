<template>
  <div class="own-edit-page" id="items">
    <div class="own-edit-fen"></div>
    <div class="own-edit-d2">
      <div class="own-edit-table">
        <div class="th" style="width: 15%"></div>
        <div class="th" style="width: 36%">
          <span>股票名称</span>
        </div>
        <div class="th" style="width: 20%">
          <span>置顶</span>
        </div>
        <div class="th" style="width: 25%;text-align: center">
          <span>位置</span>
        </div>
      </div>
    </div>

    <div class="own-edit-d1" @touchstart="handleDown($event)" @touchend="handleUp($event)" v-for="(ms,index) in myStock" :key="ms.id" :ids="ms.id">
      <div class="own-edit-table">
        <div class="th" style="width: 15%" @click="checkStock(index, ms.stockCode)">
          <icon class="ico3" :name="ms.ischoose ? 'in-box' : 'box'" scale="1.8"></icon>
        </div>
        <div class="th" style="width: 36%">
          <span>{{ms.stockName}}</span>
        </div>
        <div class="th" style="width: 20%" @click="goTop($event)">
          <icon class="ico1" name="gotop" scale="2.6"></icon>
        </div>
        <div class="th handle" style="width: 25%;">
          <icon class="ico2" name="drag" scale="2.6"></icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import Icon from 'vue-svg-icon/Icon.vue'
import selfApi from '../../utils/stockSelf'
import { Toast } from 'mint-ui'
export default {
  name: 'OWN-Edit',
  data () {
    return {
      docm: undefined,
      myStock: [],
      stockIds: [],
      muiltStockIds: []
    }
  },
  components: {
    Icon
  },
  mounted () {
    this.notFot()
    this.getStockSelfList()
  },
  methods: {
    // 触摸开始
    handleDown (e) {
      this.docm = e.target
      while (this.docm.className !== 'own-edit-d1') {
        this.docm = this.docm.parentElement
      }
      this.docm.classList.add('own-edit-d1-active')
    },
    // 触摸放开
    handleUp (e) {
      this.docm.classList.remove('own-edit-d1-active')
    },
    // 获取自己的自选股
    getStockSelfList () {
      let _this = this
      return new Promise((resolve, reject) => {
        selfApi.getSelfStockList().then(res => {
          if (res.code === '0') {
            res.data.forEach(element => {
              element.ischoose = false
              _this.myStock.push(element)
            })
            _this.sortableInit()
            resolve()
          }
        })
      })
    },
    // 回到顶部的功能
    goTop (e) {
      let _this = this
      let elem = e.target
      // 解决未找到元素的功能
      while (elem.className !== 'own-edit-d1') {
        elem = elem.parentElement
      }
      $('.own-edit-page .own-edit-d1:eq(0)').before($(elem))
      // $('.own-edit-page .own-edit-d1:eq(1)').before($(ele))
      _this.stockIds = []
      $('.own-edit-d1').each((index, element) => {
        _this.stockIds.push($(element).attr('ids'))
      })
      selfApi.sortSelfStock(_this.stockIds.toString()).then(res => {
        if (res.code === '0') {
          // 什么也不做
        } else {
          Toast({
            message: res.msg,
            position: 'middle',
            className: 'toastNee',
            duration: 2000
          })
        }
      })
    },
    // 自由运动的功能
    sortableInit () {
      let _this = this
      let dox = document.getElementById('items')
      let sortable = new Sortable(dox, {
        sort: true,
        delay: 0,
        animation: 150,
        handle: '.handle',
        chosenClass: 'opacityClass',
        dragClass: 'dragClass',
        onEnd: function (evt) {
          _this.stockIds = []
          $('.own-edit-d1').each((index, element) => {
            _this.stockIds.push($(element).attr('ids'))
          })
          selfApi.sortSelfStock(_this.stockIds.toString()).then(res => {
            if (res.code === '0') {
              // 什么也不做
            } else {
              Toast({
                message: res.msg,
                position: 'middle',
                className: 'toastNee',
                duration: 2000
              })
            }
          })
        }
      })
    },
    // 选择要删除的股票
    checkStock (n, code) {
      let _this = this
      if (_this.myStock[n].ischoose) {
        _this.myStock[n].ischoose = false
        let set = new Set(_this.muiltStockIds)
        set.delete(code)
        _this.muiltStockIds = [...set]
      } else {
        _this.myStock[n].ischoose = true
        _this.muiltStockIds.push(code)
      }
      this.$emit('listenMuilt', _this.muiltStockIds)
    },
    // 底部不显示
    notFot () {
      this.$emit('listenFot', '2')
    }
  }
}
</script>

<style lang='scss' scoped>
@import "../../assets/css/bus";
.own-edit-page {
  position: relative;
  width: 100%;
  min-height: 100%;
}
.own-edit-fen {
  height: 20px;
  background-color: #f5f5f5;
}
.own-edit-d1 {
  width: calc(100% - 58px);
  padding: 0px 29px;
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -o-transition: all 0.5s;
  .own-edit-table {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #c8c8c8;
    height: 100px;
    .th {
      height: 100px;
      line-height: 100px;
      font-size: 28px;
      color: #383838;
      img {
        width: 26px;
      }
      span {
        color: #383838;
      }
      .ico1 {
        color: #f76160;
        margin-top: 28px;
        margin-left: 7px;
      }
      .ico2 {
        color: #f76160;
        margin-top: 28px;
        margin-left: 70px;
      }
      .ico3 {
        color: #cacaca;
        margin-top: 32px;
      }
    }
  }
}
.own-edit-d1-active {
  background-color: #f76160;
  .own-edit-table {
    .th {
      color: #fff;
      span {
        color: #fff;
      }
      .ico1 {
        color: #fff;
      }
      .ico2 {
        color: #fff;
      }
      .ico3 {
        color: #fff;
      }
    }
  }
}
.own-edit-d2 {
  width: calc(100% - 58px);
  padding: 0px 29px;
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -o-transition: all 0.5s;
  .own-edit-table {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #c8c8c8;
    height: 100px;
    .th {
      height: 100px;
      line-height: 100px;
      font-size: 28px;
      color: #383838;
      img {
        width: 26px;
      }
      span {
        color: #383838;
      }
      .ico1 {
        color: #f76160;
        margin-top: 28px;
        margin-left: 7px;
      }
      .ico2 {
        color: #f76160;
        margin-top: 28px;
        margin-left: 70px;
      }
      .ico3 {
        color: #cacaca;
        margin-top: 32px;
      }
    }
  }
}
.opacityClass {
  opacity: 0;
}
.dragClass {
  -moz-box-shadow: 2px 2px 5px #333333;
  -webkit-box-shadow: 2px 2px 5px #333333;
  box-shadow: 2px 2px 5px #333333;
  opacity: 1;
  transition: all 0s;
}
</style>
