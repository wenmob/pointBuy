<template>
  <div class="loginContainer">
    <router-link to='/' tag='div' class="loginLogo">
      <img  :src="commonInfo.logo" alt="" />
    </router-link>
    <div class="loginEdit" @keyup.enter="Go">
      <p>
        <label for="mobile">
          <icon class='icon' name='mobile' scale='2'></icon>
        </label>
        <input v-model='tel' autocomplete="off" type="number" name='mobile' placeholder="手机号" />
      </p>
      <p>
        <label for="password">
          <icon class='icon' name='paw' scale='2'></icon>
        </label>
        <input v-model='password' autocomplete="off" type="password" name="password" placeholder="密码" />
        <span @click='forgetPaw'>忘记密码</span>
      </p>
      <div>
        <button @click='Go'>登 录</button>
      </div>
      <div>
        <span @click='goRegister'>新用户注册</span>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-svg-icon/Icon.vue'
import { API } from '../../utils/api.js'
let vm

export default {
  data() {
    return {
    	commonInfo:{},
      redirect: '',
      tel: '',
      password: ''
    }
  },
  components: {
    Icon
  },
  mounted() {
    vm = this
    this.notFot()
    if (vm.$route.query.redirect) {
      vm.redirect = vm.$route.query.redirect
    }
    vm.getCommon()
  },
  methods: {
  	//获取公共信息接口
  	getCommon(){
	  		API.getCommon(function(res){
					if(res.code == 0){
						vm.commonInfo = res.data
					}
				})
  	},
    //登录
    Go() {
      //如果手机验证和密码验证成功，再请求数据
      if (API.phoneNumInput(vm.tel) && API.checkPassword(vm.password)) {
        API.getLogin(vm.tel, vm.password, function(data) {
          //            console.log(data)
          if (data.code == 0) {
            layer.open({
              content: '登录成功',
              skin: 'msg',
              time: 2, //2秒后自动关闭
              end: function(index) {
                if (vm.redirect) {
                  vm.$router.push({ path: vm.redirect })
                } else {
                  vm.$router.push('/')
                }
              }
            })
          } else {
            layer.open({
              content: data.msg,
              skin: 'msg',
              time: 2 //2秒后自动关闭
            })
          }
        })
      }
    },
    //去注册
    goRegister() {
      vm.$router.replace({ path: 'register', query: { redirect: vm.redirect } })
    },
    //忘记密码
    forgetPaw() {
      vm.$router.replace({
        path: 'changePaw',
        query: { redirect: vm.redirect }
      })
    },
    // 底部不显示
    notFot () {
      this.$emit('listenFot', '3')
    },
  }
}
</script>

<style lang='scss'>
@import "../../assets/css/bus";
.loginContainer {
  .loginLogo {
    width: 260px;
    height: 260px;
    border: 1px solid #ccc;
    /*background:$themeColor;*/
    /*background: url(../../assets/img/5.png) no-repeat;*/
    background-size:cover;
    margin: 78px auto;
    img {
    	width:100%;
    	height:100%;
    }
  }
  .loginEdit {
    font-size: 28px;
    padding: 0 30px;
    span {
      color: $themeColor;
    }
    p {
      height: 88px;
      border: 2px solid #ccc;
      border-radius: 5px;
      margin-bottom: 20px;
      line-height: 88px;
      label {
        display: inline-block;
        width: 80px;
        height: 100%;
        float: left;
        text-align: center;
        .icon {
          margin-top: 25px;
        }
      }
      input {
        border: 1px s/olid #ccc;
        outline: 0;
      }
      &:nth-of-type(1) {
        input {
          width: calc(100% - 130px);
          /*margin-top:30px;*/
        }
      }
      &:nth-of-type(2) {
        input {
          width: calc(100% - 320px);
        }
        span {
          display: inline-block;
          width: 200px;
          text-align: center;
          line-height: 68px;
          border-left: 1px solid $themeColor;
          margin: 10px 0;
          float: right;
        }
      }
    }
    button {
      width: 100%;
      height: 88px;
      background: $themeColor;
      color: #fff;
      border-radius: 5px;
      border: 0;
      outline: 0;
      font-size: 32px;
      margin-top: 20px;
    }
    div {
      span {
        float: right;
        margin-top: 30px;
      }
    }
  }
}
</style>
