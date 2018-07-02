<template>
	<div class="alipayBound">
		<div class="pay-zfb">
			<div class="zfbpay-top">
				<div class="pay-account">
					<p class="account-s1">
						收款人支付宝账户：
						<span id='target'>{{MyselfInfo.account}}</span>
						<br>
						公司名称：{{MyselfInfo.name}}
					</p>
				</div>
			</div>

			<div class="zfbpay-bot">
				<p class="bot-s1"><strong>绑定您的支付宝账户</strong></p>
				<div class="alipayInfo" @keyup.enter='goAlipayBound'>
					<p>充值金额: <i>{{randomMoney}}</i></p>
					<p>
						<label for="alipayName">支付宝姓名:</label>
						<input type="text" id='alipayName' v-model='alipayName' />
					</p>
					<p>
						<label for="alipayName">支付宝账号:</label>
						<input type="text" id='alipayName' v-model='alipaynum' />
					</p>
					<div style="clear: both;"></div>
				</div>
			</div>
		</div>
		<div class="about-btn">
			<button class="btn-go" @click='goAlipayBound'>下一步</button>
			<p class="bot-s2">客服热线:<span style="color: red;">{{headerContent.tel}}</span></p>
		</div>
	</div>
</template>
<script>
	import { API } from "../../utils/api.js"
	let vm;

	export default {
		data() {
			return {
				MyselfInfo: {},
				userInfo: {},
				isShow: true,
				headerContent: {},
				randomMoney: 0.1,
				alipayName: '',
				alipaynum: ''
			}
		},
		mounted() {
			vm = this;
			vm.notFot()
			vm.getRandom()
			vm.rechargeSetAlipay();
			vm.getsiteName();
			
		},
		methods: {
			//获取随机金额
			getRandom() {
				let random = Math.random().toFixed(2);
				//小数点最后一位不能为0
				if(random.lastIndexOf('0') == 3) {
					vm.getRandom()
				} else {
					vm.randomMoney = random
				}
			},
			//获取客户转账到的账户
			rechargeSetAlipay() {
				API.rechargeSetAlipay(function(data) {
					//    		console.log(data)
					if(data.code == 0){
						vm.MyselfInfo = data.data
					}
				})
			},
			/*获取电话数据*/
			getsiteName() {
				API.getCommon(function(data) {
					//console.log(data.data);
					if(data.code == 0){
						vm.headerContent = data.data;
					}
				})
			},
			//下一步
			goAlipayBound() {
				API.goAlipayBound(vm.randomMoney, vm.alipayName, vm.alipaynum, function(data) {
					//console.log(data)
					if(data.code == 0) {
						layer.open({
							content: '转账金额请填写 <font style="color:red;font-weight:900;font-size:20px">' + vm.randomMoney + '</font> 元,用于绑定.',
							btn: "我知道了",
							yes: function() {
								vm.$router.push({path: '/alipayQrcode'})
							}
						});
					} else if(data.code == 600) {
						layer.open({
							content: '请完善转账信息',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					} else {
						layer.open({
							content: data.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
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
		margin-top: 30px;
	}
	.zfbpay-top {
		width: 100%;
	}
	.pay-account {
		width: 100%;
		background-color: #ffebba;
		border-radius: 10px;
		box-shadow: 2px 2px 2px #ccc;
		padding: 20px 0;
		position: relative;
	}
	.account-s1 {
		margin: 0 30px;
		font-size: 28px;
		line-height: 55px;
		color: #282828;
	}
	.zfbpay-bot {
		margin-top: 60px;
	}
	.bot-s1 {
		color: #282828;
		font-size: 30px;
		line-height: 40px;
		margin-bottom: 40px;
	}
	.bot-s2 {
		margin-top: 80px;
		color: #585858;
		font-size: 30px;
		text-align: center;
	}
	.about-btn {
		margin-top: 60px;
		padding: 0 30px;
	}
	.btn-go {
		width:100%;
		margin-top: 30px;
		height: 88px;
		background: $themeColor;
		color: #fff;
		border: 0;
		border-radius: 10px;
		font-size: 32px;
		outline:0;
	}
	.alipayInfo p {
		font-size: 28px;
		margin-bottom: 40px;
	}
	.alipayInfo i {
		font-style: normal;
		color: red;
		font-size: 32px;
	}
	.alipayInfo input {
		width:calc(100% - 230px);
		border-bottom: 1px solid #ccc;
		height: 40px;
		margin-left: 10px;
		background: none;
	}
</style>
