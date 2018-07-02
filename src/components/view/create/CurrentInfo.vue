<template>
  <table class='currentInfoTable'>
    <tr>
      <td>
        <span>今开</span>
        <span>{{isNaN(stockData.open) ? '-' : stockData.open}}</span>
      </td>
      <td>
        <span>昨收</span>
        <span>{{isNaN(stockData.close) ? '-' : stockData.close}}</span>
      </td>
    </tr>
    <tr>
      <td>
        <span>振幅</span>
        <span>{{isNaN(stockData.zf) ? '-' : stockData.zf}}%</span>
      </td>
      <td>
        <span>涨跌</span>
        <span>{{isNaN(stockData.zd) ? '-' : stockData.zd}}</span>
      </td>
    </tr>
    <tr>
      <td>
        <span>涨停</span>
        <span>{{isNaN(stockData.zt) ? '-' : stockData.zt}}</span>
      </td>
      <td>
        <span>跌停</span>
        <span>{{isNaN(stockData.dt) ? '-' : stockData.dt}}</span>
      </td>
    </tr>
    <tr>
      <td>
        <span>最高</span>
        <span>{{isNaN(stockData.highest) ? '-' : stockData.highest}}</span>
      </td>
      <td>
        <span>最低</span>
        <span>{{isNaN(stockData.lowest) ? '-' : stockData.lowest}}</span>
      </td>
    </tr>
    <tr>
      <td>
        <span>成交量</span>
        <span>{{isNaN(stockData.volume) ? '-' : stockData.volume}}万手</span>
      </td>
      <td>
        <span>成交额</span>
        <span>{{isNaN(stockData.business) ? '-' : stockData.business}}亿元</span>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  props: ['stockData'],
  data () {
    return {

    }
  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style lang='scss'>
.currentInfoTable {
  width: calc(100% - 40px);
  border-collapse: collapse;
  margin: 0 auto;

  tr {
    border-bottom: 1px solid #ccc;
    height: 88px;
    &:last-child {
      border: 0;
    }
    td {
      color: #585858;
      font-size: 24px;
      padding: 30px 10px 30px 12px;
      &:first-child {
        padding-right: 30px;
      }
      &:last-child {
        padding-left: 30px;
      }
      span {
        &:first-child {
          color: #585858;
        }
        &:last-child {
          float: right;
        }
      }
    }
  }
}
</style>
