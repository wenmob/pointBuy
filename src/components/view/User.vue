<template>
	<div class='userContainer'>
		<div class="userTop">
			<div class="top1"></div>
			<div class="topContent">
				<div class="headPortrait">
					<img :src="headerContent.logo" alt="" />
				</div>
				<div class="userTit">
						<p v-if='!isLogin'>您好，请登录</p>
						<p v-if='isLogin'>
							<span>账户余额</span>
							<span style='font-size:24px;'>{{userMoney.balance}}</span>
						</p>
						<p v-if='!isLogin'>
							<router-link to="login?redirect=user" tag='span'>登录</router-link>
							<router-link to="register?redirect=user" tag='span'>注册</router-link>
						</p>
						<p v-if='isLogin'>
							<router-link to='payStyle' tag='span'>充值</router-link>
							<router-link to='cash' tag='span'>提现</router-link>
							<router-link to='moneyDetail' tag='span'>明细</router-link>
						</p>
				</div>
					
			</div>
		</div>
		<ul class="userList">
			<router-link to='strategy' tag='li'>
				<icon class='icon' name='kind' scale='1.8'></icon>
				<span>我的策略</span>
				<icon class='icon' name='right' scale='2'></icon>
			</router-link>
			<router-link to='stopStock' tag='li'>
				<icon class='icon' name='waring2' scale='2'></icon>
				<span>停牌策略</span>
				<icon class='icon' name='right' scale='2'></icon>
			</router-link>
			<li class="emptyDiv" style='height:15px;border:0;'></li>
			<router-link to='personlCen' tag='li'>
				<icon class='icon' name='smile' scale='1.8'></icon>
				<span>个人中心</span>
				<icon class='icon' name='right' scale='2'></icon>
			</router-link>
			<router-link to='notice' tag='li'>
				<icon class='icon' name='news' scale='2'></icon>
				<span>消息通知</span>
				<icon class='icon' name='right' scale='2'></icon>
			</router-link>
			<router-link v-if='headerContent.regUseSellerid' to='inviteFriend' tag='li'>
				<icon class='icon' name='share' scale='2'></icon>
				<span>邀请好友</span>
				<icon class='icon' name='right' scale='2'></icon>
			</router-link>
			<li>
				<a :href="'tel:'+headerContent.tel">
					<icon class='icon' name='mobile' scale='2'></icon>
					<span>客服咨询</span>
					<icon class='icon' name='right' scale='2'></icon>
				</a>
			</li>
		</ul>
	</div>
</template>

<script>
	import Icon from 'vue-svg-icon/Icon.vue'
	import {API} from "../../utils/api.js"
	let vm;
	
	export default {
		data(){
			return{
				isLogin:false,
				userMoney:{},
				headerContent:{},
				noticeShow: false
			}
		},
		components:{
		  	Icon
		},
		mounted(){
			vm = this;
			vm.needFot()
			vm.checklogin()
			vm.getsiteName()
		},
		methods:{
			//判断是否登录
			checklogin(){
				API.checklogin(function(res){
					if(res.code == 0){
						vm.isLogin = true
						vm.userMoneyInfo()
					}else{
						vm.isLogin = false
					}
				})
			},
			/*获取头部数据*/
	 		getsiteName(){
	 			API.getCommon(function(data){
	//					console.log(data.data);
						vm.headerContent = data.data;
					})
	 		},
			//查看资产
			userMoneyInfo(){
				API.userMoneyInfo(function(res){
					if(res.code == 0){
						vm.userMoney = res.data
						vm.userMoney.balance = vm.userMoney.balance.toFixed(2)
					}
				})
			},
			// 底部显示
		    needFot () {
		      this.$emit('listenFot', '0')
		    }
		}
	}
</script>

<style scoped lang='scss'>
	@import '@/assets/css/bus.scss';
	.userContainer{
		width:100%;
		padding-bottom:100px;
		.userTop{
			position:relative;
			width:100%;
			height:400px;
			.top1{
				height:260px;
				background:$themeColor;
			}
			.topContent{
				position:absolute;
				top:0;
				width:100%;
				padding-top:100px;
				.headPortrait{
					position:absolute;
					top:30px;
					left:calc(50% - 70px);
					width:120px;
					height:120px;
					border-radius:50%;
					border:10px solid $themeColor;
					img{
						width:100%;
						height:100%;
						border-radius:50%;
						box-shadow:0 0 15px #606060;
					}
				}
			 	.userTit{
		 			width:calc(100% - 120px);
				 	font-size:36px;
				 	text-align:center;
				 	background:#fff;
				 	margin:0 auto;
				 	padding:100px 30px 0 30px;
				 	border-radius:10px;
				 	box-shadow:0 0 10px #989898;
				 	p{
				 		position:relative;
				 		font-size:24px;
				 		padding-bottom:33px;
				 		color:#585858;
				 		&:first-child{
				 			border-bottom:1px solid #ccc;
				 			span{
				 				&:first-child{
				 					position:absolute;
					 				left:0;
					 				top:35px;
				 				}
				 				&:last-child{
				 					font-weight:600;
				 				}
				 			}
				 		}
				 		&:last-child{
				 			padding-top:35px;
				 			font-size:28px;
				 			display:flex;
				 			span{
				 				flex:1;
				 				/*display:inline-block;
				 				width:49%;
				 				text-align:center;*/
				 			}
				 		}
				 	}   
			 	}
			}
		}
		.userList{
			padding:0;
			
			li{
				border-bottom:1px solid #ccc;
				height:100px;
				line-height:100px;
				font-size:28px;
				padding:0 30px;
				color:#282828;
				a{
					display:inline-block;
					color:#282828;
					width:100%;
				}
				&:nth-of-type(2){
					border:0;
				}
				.icon{
					float:left;
					margin-top:32px;
					&:last-child{
						float:right;
					}
				}
				span{
					float:left;
					margin-left:10px;
				}
			}
		}
	}
</style>