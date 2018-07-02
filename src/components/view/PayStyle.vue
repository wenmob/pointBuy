<template>
	<div class="payStyle">
		<div class="pay-tit">
			<span class="pay-tit-s1">选择支付方式</span>
		</div>
		<div class="pay-list">
			<!--银联快捷支付-->
			<div v-if='UseNetBank' @click="checkNetBank('netBankFee')" class="pay-list-dd">
				<a>
					<span class="pay-list-s1">
				        <img src="../../assets/img/mine_icon8.jpg"/>
				      </span>
					<span class="pay-list-s2">
					      <strong>银联快捷支付</strong>
					      <span>无需网银，支付各大银行</span>
					</span>
					<span class='serviceMoney'>{{NetBankFee}}</span>
				</a>
			</div>
			<!--支付宝转账1(需绑定)-->
			<div v-if='UseAlipay' class="pay-list-dd" @click='checkAlipayBound'>
				<a>
					<span class="pay-list-s1">
						<img src="../../assets/img/mine_icon9.jpg"/>
					</span>
					<span class="pay-list-s2">
						<strong>支付宝转账</strong>
	                	<span>安全便捷，小额资金直接到账</span>
					</span>
					<span class='serviceMoney'>{{AlipayFee}}</span>
				</a>
			</div>
			<!--银行卡转账-->
			<div v-if='UseOff' class="pay-list-dd">
				<a href='#/bankPay'>
					<span class="pay-list-s1">
					    <img src="../../assets/img/mine_icon11.jpg"/>
				    </span>
					<span class="pay-list-s2">
				        <strong>银行卡转账</strong>
				        <span>大额支付，ATM、网银、柜台等支付方式</span>
					</span>
					<span class='serviceMoney'>{{UseOffFee}}</span>
				</a>
			</div>
			<!--微信转账-->
			<div v-if='UseWechat' class="pay-list-dd">
				<a href='#/wechantPay'>
					<span class="pay-list-s1">
					      <img src="../../assets/img/mine_icon10.jpg"/>
				       </span>
					<span class="pay-list-s2">
					        <strong>微信转账</strong>
					        <span>手机支付，安全便捷</span>
					</span>
					<span class='serviceMoney'>{{UseWechatFee}}</span>
				</a>
			</div>
			<!--支付宝转账2(无需绑定)-->
			<div v-if='UseCodeAlipay' class="pay-list-dd">
				<a href='#/codeAlipayPay'>
					<span class="pay-list-s1">
								<img src="../../assets/img/mine_icon9.jpg"/>
							</span>
					<span class="pay-list-s2">
									<strong>支付宝转账</strong>
	                <span>安全便捷，小额资金直接到账</span>
					</span>
					<span class='serviceMoney'>{{UseCodeAlipayFee}}</span>
				</a>
			</div>
			<!--未来优势支付-->
			<div v-if='UseWlyxNetBank' @click="checkNetBank('wlyxNetBank')" class="pay-list-dd" style="border-bottom-style: none">
				<a>
					<span class="pay-list-s1">
				        <img src="../../assets/img/mine_icon8.jpg"/>
				      </span>
					<span class="pay-list-s2">
					      <strong>未来优势支付</strong>
					      <span>无需网银，支付各大银行</span>
					</span>
					<span class='serviceMoney'>{{UseWlyxNetBankFee}}</span>
				</a>
			</div>

		</div>
	</div>
</template>
<script>
	import { API } from "../../utils/api.js"
	let vm;

	export default {
		data() {
			return {
				UseAlipay: false, //支付宝1
				UseNetBank: false, //银联
				UseOff: false, //银行卡
				UseWechat: false, //微信
				UseCodeAlipay: false, //支付宝2
				UseWlyxNetBank: false, //未来优势
				NetBankFee: '',
				AlipayFee: '',
				UseOffFee: '',
				UseWechatFee: '',
				UseCodeAlipayFee: '',
				UseWlyxNetBankFee: '',
				hasBankNumber: false
			}
		},
		mounted() {
			vm = this;
			vm.getBaseUserInfo();
			vm.getPayType()
			vm.notFot()
		},
		methods: {
			//判断是否实名认证
			getBaseUserInfo() {
				API.getBaseUserInfo(function(data) {
					//    		console.log(data)//用户具体信息
					if(data.code == 0) {
						if(!data.data.idcard) {
							vm.$router.replace({
								path: '/setIdCard',
								query: {}
							});
						}
						if(data.data.bankNumber) {
							vm.hasBankNumber = true
						} else {
							vm.hasBankNumber = false
						}
					}
				})
			},
			//判断是否绑定银行卡
			checkNetBank(type) {
				if(vm.hasBankNumber) {
					vm.$router.push({
						path: '/netBankPay',
						query: {
							type: type
						}
					}) //银联支付
				} else {
					layer.open({
						content: '请先绑定银行卡',
						skin: 'msg',
						time: 2 //2秒后自动关闭
						,end: function(index) {
							vm.$router.push('bankBound')
						}
					});
				}
			},
			//判断是否绑定支付宝
			checkAlipayBound() {
				API.checkAlipayBound(function(data) {
					//    		console.log(data)
					if(data.code == 700) {
						vm.$router.push('/alipayBound') //跳转至支付宝绑定页
					} else {
						vm.$router.push('/alipayPay') //跳转至支付宝转账页 
					}
				})
			},
			//系统支持的支付方式
			getPayType() {
				API.getPayType(function(data) {
					//    		console.log(data)
					if(data.code == 0) {
						vm.UseNetBank = data.data.canPayUseNetBank //银联
						vm.UseAlipay = data.data.canPayUseAlipay //支付宝1
						vm.UseOff = data.data.canPayUseOff //银行卡
						vm.UseWechat = data.data.canPayUseWechat //微信
						vm.UseCodeAlipay = data.data.canPayUseCodeAlipay //支付宝2
						vm.UseWlyxNetBank = data.data.canPayUseWlyxNetBank //未来优势
						if(data.data.canPayUseNetBankFee == 0) {
							vm.NetBankFee = '免手续费'
						} else {
							vm.NetBankFee = '手续费' + data.data.canPayUseNetBankFee + '%'
						}
						if(data.data.canPayUseAlipayFee == 0) {
							vm.AlipayFee = '免手续费'
						} else {
							vm.AlipayFee = '手续费' + data.data.canPayUseAlipayFee + '%'
						}
						if(data.data.canPayUseOffFee == 0) {
							vm.UseOffFee = '免手续费'
						} else {
							vm.UseOffFee = '手续费' + data.data.canPayUseOffFee + '%'
						}
						if(data.data.canPayUseWechatFee == 0) {
							vm.UseWechatFee = '免手续费'
						} else {
							vm.UseWechatFee = '手续费' + data.data.canPayUseWechatFee + '%'
						}
						if(data.data.canPayUseCodeAlipayFee == 0) {
							vm.UseCodeAlipayFee = '免手续费'
						} else {
							vm.UseCodeAlipayFee = '手续费' + data.data.canPayUseCodeAlipayFee + '%'
						}
						if(data.data.canPayUseWlyxNetBankFee == 0) {
							vm.UseWlyxNetBankFee = '免手续费'
						} else {
							vm.UseWlyxNetBankFee = '手续费' + data.data.canPayUseWlyxNetBankFee + '%'
						}

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
	@import "../../assets/css/inputCom";
	.payStyle {
		/*background-color: #fff;
		border-top: 0.03rem solid #e6e6e6;
		position: relative;
		width: 100%;
		height: 100%;*/
		border-bottom: 1px solid #e6e6e6;
	}
	.pay-tit {
		height: 1.35rem;
		padding: 0 0.375rem;
		border-bottom: 0.03rem solid #e6e6e6;
	}
	.pay-tit-s1 {
		line-height: 1.35rem;
		font-size: 0.378rem;
		color: #585858;
	}
	.pay-list {
		padding-left: 0.375rem;
		div{
			&:last-child{
				border:0;
			}
		}
	}
	.pay-list-dd {
		position: relative;
		width: 100%;
		height: 1.89rem;
		border-bottom: 0.03rem solid #e6e6e6;
		a {
			display: inline-block;
			width: 100%;
			height: 100%;
		}
	}
	.pay-list-s1 {
		float: left;
		margin-top: 0.405rem;
		img {
			width: 1.08rem;
			height: 1.08rem;
		}
	}
	.pay-list-s2 {
		float: left;
		margin-left: 0.27rem;
		margin-top: 0.44rem;
		strong {
			display: block;
			font-size: 0.46rem;
			color: #282828;
			margin-bottom:10px;
		}
		span {
			display: block;
			font-size: 0.324rem;
			color: #989898;
		}
	}
	.serviceMoney {
		float: right;
		padding-right: 0.5rem;
		padding-top: 0.3rem;
		font-size: 0.35rem;
		color: orangered;
	}
</style>