<template>
	<div class="netBankPay">
		<div class="paylist">
			<div class="pay-list">
				<div class="pay-list-li">
					<span class="unionpay-s1">账户余额：</span>
					<span class="unionpay-s2">
						<strong>{{userMoney}}</strong>
						元
					</span>
				</div>
			</div>
		</div>
		<div>
			<div class="pay-list">
				<div class="pay-list-li" style="height: 1.0rem">
					<span class="unionpay-s3">
						<img src="../../assets/img/mine_icon17.jpg" />
					</span>
					<span class="unionpay-s4">
						无需开通网银，有银行卡就能支付
					</span>
				</div>
			</div>
		</div>
		<div class="paylist" @keyup.enter='trueNetBank'>
			<div class="pay-list" style='border-bottom:1px solid #ddd'>
				<div class="pay-list-li">
					<span class="unionpay-s1">充值金额：</span>
					<span class="unionpay-s2">
		              	<input type="number" pattern="[0-9]*" placeholder="0" v-model='amount'>
		            </span>
				</div>
			</div>
			<div v-if="type=='netBankFee'" class="pay-list">
				<div class="pay-list-li">
					<span class="unionpay-s1">验&nbsp;&nbsp;证&nbsp;&nbsp;码：</span>
					<span class="unionpay-s2">
		              	<input type="number" v-model='verifyCode' style='width:calc(100% - 200px)'>
		            </span>
					<span class="telStr" @click='getTelStr'>获取验证码</span>
				</div>
			</div>
		</div>

		<div>
			<div class="pay-list">
				<div class="pay-list-li">
					<span class="unionpay-s5">注:</span>
					<span class="unionpay-s4">1,单卡单笔限额50000，每日最高20万</span>
					<span class="unionpay-s6">
						2,本次充值<em v-html='serverRate'>{{serverRate}}</em>
					</span>
				</div>
			</div>
		</div>
		<div class="about-btn">
			<button class="button" @click='truePay'>确认</button>
		</div>
	</div>
</template>
<script>
	import $ from 'jquery'
	import { API } from "../../utils/api.js"
	let vm;

	export default {
		data() {
			return {
				type: 'netBankFee',
				amount: '',
				verifyCode: '',
				bankId: '',
				count: 60,
				userMoney: 0,
				serverRate: ''
			}
		},
		mounted() {
			vm = this;
			vm.notFot()
			vm.isWeixinBrowser()
			vm.type = vm.$route.query.type
			vm.getPayType()
			vm.userMoneyInfo()
			
		},
		methods: {
			//判断是否是微信
			isWeixinBrowser() {
				const agent = window.navigator.userAgent.toLowerCase()
				if(agent.indexOf('micromessenger') == -1) {/*不是微信*/
					console.log($('.paylist'))
					$('.paylist')[0].style.marginTop = '52px';
				}
			},
			//查看资产接口
			userMoneyInfo() {
				API.userMoneyInfo(function(data) {
					if(data.code == 0) {
						vm.userMoney = data.data.balance.toFixed(2)
					}
				})
			},
			//获取验证码
			getTelStr() {
				if(vm.amount == '') {
					layer.open({
						content: '请填写充值金额',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return
				}
				if(vm.amount * 100 % 1 != 0) {
					layer.open({
						content: '充值金额最多两位小数',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return
				}
				//第一次点击获取验证码
				if($('.telStr').text() == '获取验证码') {
					let amount = vm.amount * 100
					//					console.log(amount)
					API.getNetBankCode(amount, function(data) {
						//						console.log(data)
						if(data.code == 0) {
							layer.open({
								content: '验证码发送成功',
								skin: 'msg',
								time: 2 //2秒后自动关闭
								,end: function() {
									vm.bankId = data.data
									vm.countDown();
								}
							});

						} else if(data.code == 601) {
							layer.open({
								content: data.data,
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
				}
				//第二次点击获取验证码
				if($('.telStr').text() == '重新获取验证码') {
					API.netBankCodeAgain(vm.bankId, function(data) {
						//									console.log(data)
						if(data.code == 0) {
							layer.open({
								content: '验证码发送成功',
								skin: 'msg',
								time: 2 //2秒后自动关闭
								,end: function() {
									vm.countDown();
								}
							});
						} else if(data.code == 601) {
							layer.open({
								content: data.data,
								skin: 'msg',
								time: 2 //2秒后自动关闭
									,
								end: function() {
									vm.countDown();
								}
							});
						} else {
							layer.open({
								content: data.msg,
								skin: 'msg',
								time: 2 //2秒后自动关闭
								,end: function() {
									vm.countDown();
								}
							});
						}
					})
				}
			},

			//倒计时
			countDown() {
				$('.telStr').text(vm.count + "秒");
				$('.telStr').css({
					"pointer-events": "none"
				});
				setTimeout(function() {
					vm.count--;
					if(vm.count == 0) {
						$('.telStr').css({
							"pointer-events": "auto"
						});
						$('.telStr').text('重新获取验证码');
						vm.count = 60;
						return;
					} else {
						$('.telStr').text(vm.count + "秒");
						vm.countDown();
					}
				}, 1000)
			},
			//重新获取银联支付验证码
			netBankCodeAgain() {
				API.netBankCodeAgain(vm.bankId, function(data) {
					//							console.log(data)
					if(data.code == 0) {
						layer.open({
							content: '验证码发送成功',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				})
			},
			//确认
			truePay() {
				console.log(vm.type)
				if(vm.type == 'netBankFee') {
					if(vm.verifyCode == '' || vm.amount == '') {
						layer.open({
							content: '请填写完整',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
						return
					}
					vm.netBankPay()
				} else if(vm.type == 'wlyxNetBank') {
					if(vm.amount == '') {
						layer.open({
							content: '请填写完整',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
						return
					}
					vm.wlyxNetBankPay()
				}
			},
			//银联支付
			netBankPay() {
				API.trueNetBank(vm.bankId, vm.verifyCode, function(data) {
					console.log(data)
					if(data.code == 0) {
						layer.open({
							content: '充值成功',
							skin: 'msg',
							time: 2 //2秒后自动关闭
								,
							end: function() {
								vm.$router.push('user')
							}
						});
					} else if(data.code == -1) {
						layer.open({
							content: data.data,
							skin: 'msg',
							time: 2 //2秒后自动关闭
								,
							end: function() {
								vm.$router.push('bankBound') //去绑卡
							}
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
			//未来优势支付
			wlyxNetBankPay() {
				API.wlyxNetBankPay(vm.amount, function(data) {
					console.log(data)
					if(data.code == 0) {
						window.location.href = data.data
					} else if(data.code == -1) {
						layer.open({
							content: data.data,
							skin: 'msg',
							time: 2 //2秒后自动关闭
								,
							end: function() {
								vm.$router.push('bankBound') //去绑卡
							}
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
			//获取手续费
			getPayType() {
				API.getPayType(function(data) {
					//    		console.log(data)
					if(data.code == 0) {
						if(vm.type == 'netBankFee') {
							if(data.data.canPayUseNetBankFee == 0) {
								vm.serverRate = "免手续费"
							} else {
								vm.serverRate = "需扣除手续费<span style='color:#f36a6a;font-size:0.4rem;'> " + data.data.canPayUseNetBankFee + " </span>%"
							}
						} else if(vm.type == 'wlyxNetBank') {
							if(data.data.canPayUseWlyxNetBankFee == 0) {
								vm.serverRate = "免手续费"
							} else {
								vm.serverRate = "需扣除手续费<span style='color:#f36a6a;font-size:0.4rem;'> " + data.data.canPayUseWlyxNetBankFee + " </span>%"
							}
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
	@import "../../assets/css/bus";
	.netBankPay {
		position: absolute;
		top: 0;
		height:100%;
		background: #f5f5f5;
	}
	
	.paylist {
		background-color: #fff;
		border-top: 1px solid #e6e6e6;
		border-bottom: 1px solid #e6e6e6;
		width: 100%;
		/*&:nth-of-type(1) {
			margin-top: 104px;
		}*/
		&:nth-of-type(3) {
			margin-top: 20px;
		}
	}
	
	.pay-list {
		padding-left: 30px;
	}
	
	.pay-list-li {
		height: 100px;
		line-height: 100px;
	}
	
	.unionpay-s1 {
		display: inline-block;
		width: 150px;
		color: #585858;
		font-size: 30px;
	}
	
	.unionpay-s2 {
		margin-left: 10px;
		font-size: 30px;
		color: #282828;
		input {
			font-size: 28px;
			color: #282828;
			font-weight: 600;
			width: calc(100% - 250px);
		}
	}
	
	.unionpay-s3 img {
		float: left;
		width: 120px;
		height: 45px;
		margin-top: 28px;
	}
	
	.unionpay-s4 {
		margin-left: 25px;
		font-size: 26px;
		color: #989898;
		margin-top: 20px;
	}
	
	.unionpay-s5 {
		font-size: 26px;
		color: #f36a6a;
	}
	
	.unionpay-s6 {
		display: block;
		margin-top: -45px;
		padding-left: 66px;
		color: #989898;
	}
	
	.button {
		width: calc(100% - 60px);
		margin-left: 30px;
		margin-top: 90px;
	}
	
	.telStr {
		float: right;
		color: $themeColor;
		font-size: 0.405rem;
		line-height: 1.4rem;
		padding-right: 30px;
	}
	
	button {
		outline: 0;
	}
</style>