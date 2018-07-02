<template>
	<div class="alipayPay">
		<div class="pay-zfb">
			<div class="zfbpay-top">
				<p class="account-s1">
					收款人支付宝账户：<span id='target'>{{MyselfInfo.account}}</span><br> 公司名称：{{MyselfInfo.name}}
				</p>
			</div>
			<div class="zfbpay-cen">
				<p class="cen-s1">
					请使用绑定支付宝:
					<span class="cen-s1-1">{{alipayInfo.name}}({{alipayInfo.account}})</span> 转账
				</p>
			</div>
			<div class="zfbpay-bot">
				<p class="bot-s1"><strong>如果您的资金没有到账？</strong></p>
				<div class="bot-cen">
					<p class="bot-cen-s1">打开支付宝，复制您的转账记录里的订单号，<br>确认您的转账进度以上都无法完成转账;</p>
					<a><span class="bot-cen-s2" @click="goPollZfb">点击查询</span></a>
					<div style="clear: both;"></div>
				</div>
				<p class="bot-s2">您可拨打客服热线:<span style="color: red;">{{headerContent.tel}}</span> 确认您的转账进度。</p>
			</div>
		</div>
		<div class="about-btn">
			<router-link to="/alipayQrcode?type=pay" class="btn-go" @click='goAlipay' tag='button'>下一步</router-link>
		</div>
	</div>
</template>
<script>
	import { API } from "../../utils/api.js"
//	import Clipboard from 'clipboard';
	let vm;
	
	export default {
		data() {
			return {
				MyselfInfo: {},
				userInfo: {},
				isShow: true,
				headerContent: {},
				alipayInfo: {}
			}
		},
		mounted() {
			vm = this;
			vm.rechargeSetAlipay();
			vm.getsiteName();
			vm.checkAlipayBound()
			vm.notFot()
		},

		methods: {
			//获取客户转账到的账户
			rechargeSetAlipay() {
				API.rechargeSetAlipay(function(data) {
					//    		console.log(data)
					if(data.code == 0){
						vm.MyselfInfo = data.data
					}
				})
			},
			//绑定的支付宝账号
			checkAlipayBound() {
				API.checkAlipayBound(function(data) {
					//    		console.log(data)
					if(data.code != 0) {
						layer.open({
							content: data.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
						return
					}
					vm.alipayInfo = data.data
					
				})
			},
			
			/*获取电话数据*/
			getsiteName() {
				API.getCommon(function(data) {
					//						console.log(data.data);
					if(data.code == 0){
						vm.headerContent = data.data;
					}
				})
			},
			//点击查询
			goPollZfb() {
				vm.$router.push({
					path: '/paySearch'
				});
			},
			//下一步
			goAlipay() {
				vm.$router.push({
					path: '/alipayQrcode',
					query: {
						type: 'pay'
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
	@import "../../assets/css/bus";
	.pay-zfb {
		padding: 0 30px;
		margin-top: 40px;
	}
	.zfbpay-top {
		width: 100%;
		background-color: #ffebba;
		border-radius: 10px;
		box-shadow: 2px 2px 2px #ccc;
		padding: 20px 0;
		.account-s1 {
			margin: 0 30px;
			font-size: 28px;
			line-height: 55px;
			color: #282828;
		}
	}
	.zfbpay-cen {
		margin-top: 60px;
		.cen-s1 {
			font-size: 30px;
			line-height: 0.486rem;
			.cen-s1-1 {
				color: #f36a6a;
				font-weight: 900;
			}
		}
	}
	
	
	.zfbpay-bot {
		margin-top: 60px;
		.bot-s1 {
			color: #282828;
			font-size: 30px;
			line-height: 40px;
		}
		.bot-cen {
			margin-top: 30px;
			.bot-cen-s1 {
				float: left;
				color: #585858;
				font-size: 24px;
				line-height: 35px;
			}
			
			.bot-cen-s2 {
				display: inline-block;
				/*width: 140px;*/
				padding:0 20px;
				height: 50px;
				line-height: 50px;
				border-radius:40px;
				background-color: $themeColor;
				color: #fff;
				float: right;
				text-align: center;
				font-size:24px;
			}
		}
	}
	.bot-s2 {
		margin-top: 20px;
		color: #585858;
		font-size: 30px;
		line-height: 0.486rem;
	}
	
	.about-btn {
		margin-top: 60px;
		padding: 0 30px;
	}
	
	.btn-go {
		width: 100%;
		height: 88px;
		border-radius: 10px;
		border: none;
		background-color: $themeColor;
		color: #fff;
		font-size: 32px;
		outline: 0;
	}
</style>