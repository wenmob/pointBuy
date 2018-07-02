<template>
 <div v-html="userNotice" class="notice">

 </div>
</template>

<script>
import { API } from '../../utils/api'
export default {
  data () {
    return {
      userNotice: ''
    }
  },
  mounted () {
    this.notFot()
    this.getUserNotice()
  },
  methods: {
    getUserNotice () {
      API.siteExtContent('user-agreement', (res) => {
        if (res.code === 0) {
          this.userNotice = res.data.content
        }
      })
    },
    // 不需要底部
    notFot () {
      this.$emit('listenFot', '3')
    }
  }
}
</script>

<style lang='scss' scoped>
 .notice {
   width: calc(100% - 60px);
   padding: 15px 30px;
   line-height: 1.5;
 }
</style>
