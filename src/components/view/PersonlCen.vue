<template>
	<div class="personCen">
		<p class="emptyDiv"></p>
		<!--已实名认证-->
		<p v-if='baseInfo.idcard'>
			<span>实名认证</span>
			<span>{{baseInfo.name}}</span>
		</p>
		<!--未实名认证-->
		<router-link to='setIdCard' v-if='!baseInfo.idcard' tag='p'>
			<span>实名认证</span>
			<span>
				<em>未认证</em>
				<icon class='icon' name='right' scale='2'></icon>
			</span>
		</router-link>
		<!--电话-->
		<router-link to='changeMobile' tag='p'>
			<span>{{baseInfo.mobile}}</span>
			<icon class='icon' name='right' scale='2'></icon>
		</router-link>
		<!--未绑定银行卡-->
		<router-link to='bankBound' v-if='!baseInfo.bankNumber' tag='p'>
			<span>绑定银行卡</span>
			<icon class='icon' name='right' scale='2'></icon>
		</router-link>
		<!--已绑定银行卡-->
		<p v-if='baseInfo.bankNumber'>
			<span>银行卡</span>
			<span>{{baseInfo.bankNumber}}</span>
		</p>
		<!--未绑定支付宝-->
		<router-link to='alipayBound' v-if='!hasAlipay' tag='p'>
			<span>绑定支付宝</span>
			<icon class='icon' name='right' scale='2'></icon>
		</router-link>
		<!--已绑定支付宝-->
		<p v-if='hasAlipay'>
			<span>支付宝</span>
			<span>{{alipayInfo.account}}</span>
		</p>
		<p class="emptyDiv"></p>
		<router-link to='modifyPaw' tag='p'>
			<span>修改登录密码</span>
			<icon class='icon' name='right' scale='2'></icon>
		</router-link>
		<!--未设置交易密码-->
		<router-link v-if='!baseInfo.hasPayPassword' to='setTradePaw' tag='p'>
			<span>设置提现密码</span>
			<icon class='icon' name='right' scale='2'></icon>
		</router-link>
		<!--已设置交易密码-->
		<router-link v-if='baseInfo.hasPayPassword' to='modifyTradePaw' tag='p'>
			<span>修改提现密码</span>
			<icon class='icon' name='right' scale='2'></icon>
		</router-link>
		<button @click='userLoginOut'>退出账户</button>
	</div>
</template>

<script>
	import Icon from 'vue-svg-icon/Icon.vue'
	import {API} from "../../utils/api.js"
	let vm;
	
	export default{
		data(){
			return{
				baseInfo:{},
				hasAlipay:false,
				alipayInfo:{}
			}
		},
		components:{
			Icon
		},
		mounted(){
			vm = this;
			vm.notFot()
			vm.getBaseUserInfo()
			vm.checkAlipayBound()
		},
		methods:{
			//获取用户基本信息
			getBaseUserInfo(){
				API.getBaseUserInfo(function(res){
					if(res.code == 0){
						vm.baseInfo = res.data
					}
				})
			},
			//判断是否绑定支付宝
			checkAlipayBound(){
				API.checkAlipayBound(function(res){
					if(res.code == 0){
						vm.hasAlipay = true
						vm.alipayInfo = res.data
					}else{
						vm.hasAlipay = false
					}
				})
			},
			//退出登录
			userLoginOut(){
				API.userLoginOut(function(res){
					if(res.code == 0){
						vm.$router.push('login')
					}
				})
			},
			// 底部不显示
		    notFot () {
		      this.$emit('listenFot', '3')
		    },
		}
	}
</script>

<style lang='scss' scoped>
	@import '@/assets/css/bus.scss';
	.personCen{
		p{
			height:100px;
			line-height:100px;
			padding:0 30px;
			color:#585858;
			font-size:28px;
			border-bottom:1px solid #eee;
			&.emptyDiv{
				height:20px;
			}
			span{
				&:last-child{
					float:right;
					em{
						color:rgb(31, 168, 255);
						margin-right:10px;
					}
				}
			}
			.icon{
				float:right;
				margin-top:31px;
			}
		}
		button{
			width:calc(100% - 60px);
			margin-left:30px;
			height:88px;
			background:$themeColor;
			color:#fff;
			border:0;
			border-radius:10px;
			font-size:32px;
			margin-top:100px;
		}
	}
</style>