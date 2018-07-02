<template>
  <div class="homeContainer">
    <!--轮播图-->
    <mt-swipe :auto="4000">
      <mt-swipe-item v-for="(item,index) in bannerList" :key="index">
        <img :src="item.pic" alt="" />
      </mt-swipe-item>
    </mt-swipe>
    <!--指数-->
    <div class="exponent">
      <div v-for="(item,index) in sinajsNum" :key="index">
        <h4>{{item[0]}}</h4>
        <h3 :class="item[2]<0?'downNum':'upNum'">
          <span>
            <em></em>
          </span>
          <i>{{item[1]}}</i>
        </h3>
        <p>
          <span :style="item[2]<0?'color: #76cf75':'color: #f36a6a'">
            {{item[2] < 0 ? item[2]: '+'+item[2]}}
          </span>
          <span :style="item[2]<0?'color: #76cf75':'color: #f36a6a'">
            {{item[3] < 0 ? item[3]: '+'+item[3]}}%
          </span>
        </p>
      </div>
    </div>
    <!--服务信息-->
    <div class="service">
      <router-link to='newHandLearn' tag='div'>
        <span>
          <icon class='serviceIcon' name='newLearn' scale='3.5'></icon>
        </span>
        <p>新手学堂</p>
      </router-link>
      <router-link to='register' tag='div'>
        <span>
          <icon class='serviceIcon' name='member' scale='4.3'></icon>
        </span>
        <p>注册会员</p>
      </router-link>
      <router-link to='create' tag='div'>
        <span>
          <icon class='serviceIcon' name='createStatic' scale='3.2'></icon>
        </span>
        <p>创建策略</p>
      </router-link>
      <router-link to='payStyle' tag='div'>
        <span>
          <icon class='serviceIcon' name='payCenter' scale='4'></icon>
        </span>
        <p>充值中心</p>
      </router-link>
    </div>
    <!--策略动态-->
    <div class="tactics">
      <div class="title">
        <icon class='icon' name='kind' scale='1.5'></icon>
        <strong>策略动态</strong>
      </div>
      <table v-if='hasData'>
        <tr v-for='(item,index) in tacticsList' :key="index">
          <td>
            <p>{{item.mobile}}</p>
            <p>{{item.dateStr}}</p>
          </td>
          <td>
            <p>{{item.stockName}}</p>
            <p>{{item.number}}股</p>
          </td>
          <td>
            <router-link :to="'/createDetail?stockCode='+(item.stockCodeFull).toLowerCase()" tag="button">点 买</router-link>
          </td>
        </tr>
      </table>
      <div v-if='!hasData' class="noData">
        <img src="../../assets/img/nodata1.jpg" alt="" />
        <p>暂无策略动态</p>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-svg-icon/Icon.vue'
import { API } from '../../utils/api.js'
let vm
export default {
  data () {
    return {
      bannerList: [],
      sinajsNum: [],
      tacticsList: [],
      hasData: false
    }
  },
  components: {
    Icon
  },
  mounted () {
    vm = this
    vm.startgetBanners()
    vm.getsinajs()
    vm.rollingStrategy()
    this.needFot()
  },
  methods: {
    // 获取轮播图
    startgetBanners () {
      API.getBanner(1, res => {
        // console.log(data.data);
        if (res.code === 0) {
          vm.bannerList = res.data
        }
      })
    },
    // 获取上证指数
    getsinajs () {
      $.ajax({
        url: 'http://hq.sinajs.cn/list=s_sh000001,s_sz399001,s_sz399006',
        dataType: 'script',
        cache: true,
        success: function (data) {
          vm.sinajsNum.push(hq_str_s_sh000001.split(','))
          vm.sinajsNum.push(hq_str_s_sz399001.split(','))
          vm.sinajsNum.push(hq_str_s_sz399006.split(','))
          // console.log(vm.sinajsNum);
        }
      })
    },
    // 首页滚动策略
    rollingStrategy () {
      API.rollingStrategy(function (res) {
        if (res.code === 0) {
          vm.hasData = true
          vm.tacticsList = res.data
        } else {
          vm.hasData = false
        }
      })
    },
    // 底部显示
    needFot () {
      this.$emit('listenFot', '0')
    },
  }
}
</script>
<style lang='scss'>
@import "../../assets/css/bus";
.homeContainer {
  background: #fff;
  /*轮播图*/
  .mint-swipe {
    height: 260px;
    margin-top: 20px;
    .mint-swipe-item {
      img {
        width: calc(100% - 40px);
        margin-left: 20px;
        height: 100%;
        border-radius: 20px;
      }
    }
    .mint-swipe-indicator {
      width: 15px;
      height: 15px;
      background: #fff;
      opacity: 0.5;
      &.is-active {
        background: $themeColor;
        opacity: 1;
      }
      &:nth-of-type(2) {
        margin: 0 10px;
      }
    }
  }
  .exponent {
    padding: 40px 20px;
    box-shadow: 0 -2px 5px #eee inset;
    overflow: hidden;
    div {
      width: 33%;
      float: left;
      text-align: center;
      &:nth-of-type(1),
      &:nth-of-type(2) {
        border-right: 1px solid #ccc;
      }
      h4 {
        font-size: 24px;
        color: #585858;
        margin: 0;
      }
      h3 {
        font-size: 38px;
        font-weight: normal;
        height: 40px;
        width: 100%;
        span {
          display: inline-block;
          position: relative;
          left: 10px;
          width: 20px;
          height: 100%;
          em {
            position: absolute;
            left: 0;
            top: 18px;
            width: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
          }
        }
        &.downNum {
          color: $greenColor;
          em {
            border-top: 14px solid $greenColor;
          }
        }
        &.upNum {
          color: $themeColor;
          em {
            border-bottom: 14px solid $themeColor;
          }
        }
        i {
          display: inline-block;
          width: calc(100% - 60px);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .service {
    display: flex;
    padding: 40px 0;
    box-shadow: 0 -2px 5px #eee inset;
    div {
      flex: 1;
      text-align: center;
      color: #585858;
      span {
        display: inline-block;
        width: 108px;
        height: 108px;
        background: $themeColor;
        border-radius: 50%;
        .serviceIcon {
          color: #fff;
          margin-top: 25px;
        }
      }

      p {
        margin: 30px 0;
      }
      &:nth-of-type(2) {
        span {
          background: $greenColor;
          .serviceIcon {
            margin-top: 15px;
          }
        }
      }
      &:nth-of-type(3) {
        span {
          background: #4ab7bd;
          .serviceIcon {
            margin-top: 25px;
          }
        }
      }
      &:nth-of-type(4) {
        span {
          background: sandybrown;
          .serviceIcon {
            margin-top: 17px;
          }
        }
      }
    }
  }
  .tactics {
    padding: 0 30px;
    .title {
      height: 45px;
      padding-top: 30px;
      .icon {
        float: left;
      }
      strong {
        padding-left: 13px;
        font-size: 28px;
        color: #282828;
      }
    }
    table {
      border-collapse: collapse;
      width: 100%;
      border-bottom: 1px solid #eee;
      tr {
        border-top: 1px solid #eee;
        td {
          font-size: 24px;
          &:nth-of-type(2) {
            text-align: center;
          }
          &:nth-of-type(3) {
            text-align: right;
          }
          p {
            margin: 30px 0;
            color: #282828;
          }
          button {
            color: #fff;
            background: #f36a6a;
            border: 0;
            outline: 0;
            width: 120px;
            border-radius: 30px;
            padding: 10px 0;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>
