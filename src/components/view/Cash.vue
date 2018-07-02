<template>
	<div class="cashContainer">
		<div class="with-head">
			<span class="trank-s1">账户余额</span>
			<span class="trank-s2">{{userMoney.balance}}</span>

		</div>

		<div class="with-list">
			<div class="with-list-cen1">
				<div class="with-list-cen2">
					<span class="s1">提现金额</span>
					<input class='getMoney inp1' v-model='getTrueMoney' type="number" pattern="[0-9]*" placeholder="输入提现金额" />
				</div>
			</div>
		</div>
		<div class="with-list">
			<div class="with-list-cen1">
				<!--未绑定银行卡的状态-->
				<div v-if='!userInfo.bankNumber' class="with-list-cen2">
					<a href='#/bankBound'>
						<span class="w1">
							<i class="fa fa-plus-circle"></i> 
							添加银行卡
						</span>
						<span class="w2">
							<icon class='icon' name='right' scale='2'></icon>
						</span>
					</a>
				</div>
				<!--已绑定银行卡的状态-->
				<div v-if='userInfo.bankNumber' class="with-list-cen2">
					<span class="s1">{{userInfo.bankName}}</span>
					<span class="s4 bankNumber">{{userInfo.bankNumber}}</span>
				</div>
			</div>
		</div>
		<div class="with-list">
			<div class="with-list-cen1">
				<div class="with-list-cen2">
					<span class="s1">提现密码</span>
					<input v-model='tradePaw' class="inp1" type="password" pattern="[0-9]*" placeholder="输入提现密码" />
					<span class="s4"><a href='#/modifyTradePaw'>忘记密码</a></span>
				</div>
			</div>
		</div>
		<div class="about-btn">
			<button class="button" @click='userCashWithdrawApply'>确定</button>
		</div>
		<div class="warn">
			<p v-html='withdrawTime'>
				 {{withdrawTime}}
			</p>
		</div>
	</div>
</template>
<script>
	import Icon from 'vue-svg-icon/Icon.vue'
	import { API } from "../../utils/api.js"
	let vm;
	
	export default {
		data() {
			return {
				userMoney: {},
				getTrueMoney: '',
				tradePaw: '',
				userInfo: {},
				withdrawTime: '',
				imgIcon: require('../../assets/img/trankBg.png')
			}
		},
		components:{
		  	Icon
		},
		mounted() {
			vm = this;
			vm.notFot()
			vm.userMoneyInfo();
			vm.getBaseUserInfo();
			vm.profileWithdraw()
		},
		methods: {
			goAddBank() {
				vm.$router.push({
					path: '/setBankCard'
				});
			},
			//获取客户余额
			userMoneyInfo() {
				API.userMoneyInfo(function(data) {
					//    		console.log(data)
					vm.userMoney = data.data
					vm.userMoney.balance = vm.userMoney.balance.toFixed(2)

				})
			},
			//用户银行卡信息
			getBaseUserInfo() {
				API.getBaseUserInfo(function(data) {
					//    		console.log(data)
					if(data.code == 0) {
						vm.userInfo = data.data
					}
				})
			},
			//提现处理时间
			profileWithdraw() {
				API.profileWithdraw(function(data) {
					//    		console.log(data)
					vm.withdrawTime = data.data
				})
			},
			//确定提现
			userCashWithdrawApply() {
				if(vm.getTrueMoney >= 100) {
					API.userCashWithdrawApply(vm.getTrueMoney, vm.tradePaw, function(data) {
						//   			console.log(data)
						if(data.code == 0) {
							layer.open({
								content: '提现成功',
								skin: 'msg',
								time: 2 //2秒后自动关闭
								,end:function(){
									vm.$router.push('user')
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
				} else {
					layer.open({
						content:'提现金额不能小于100元',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
				}
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
	.cashContainer{
		position:absolute;
		height:100%;
		background:#f5f5f5;
	}
	.with-head {
		width: 100%;
		height: 240px;
		background-size: 100% 100%;
		text-align: center;
		padding-top: 80px;
		background:$themeColor;
		color:#fff;
		span {
			display: block;
			&.trank-s1 {
				font-size: 30px;
			}
			&.trank-s2 {
				margin-top: 20px;
				font-size:80px;
				font-family: Arial, Helvetica, sans-serif;
				font-weight: bold;
			}
		}
	}
	
	/*输入*/
	.with-list {
		margin-top: 20px;
		background-color: #fff;
		border-top: 1px solid #e6e6e6;
		border-bottom: 1px solid #e6e6e6;
		padding-left: 30px;
	}
	
	.with-list-cen1 {
		padding-right: 30px;
	}
	.with-list-cen2 {
		width: 100%;
		height: 100px;
		line-height: 100px;
		color: #282828;
		font-size: 28px;
	}
	
	.with-list-cen2 a {
		display:inline-block;
		width:100%;
		color: #282828;
	}
	
	.with-list-cen2 .inp1 {
		width:calc(100% - 180px);
		font-size: 30px;
		padding-left:20px;
	}
	
	.with-list-cen2 .s1 {
		width: 140px;
		font-size: 30px;
	}
	
	.with-list-cen2 .s4 {
		float: right;
		font-size: 28px;
		text-align: right;
	}
	
	.with-list-cen2 .s4 a {
		color: #f36a6a;
	}
	
	.with-list-cen2 .bankNumber {
		color: #3399fe
	}
	.w2 {
		float: right;
		margin-top:10px;
	}
	
	.about-btn {
		margin-top: 60px;
		padding: 0 30px;
		.button {
			width: 100%;
		}
	}
	
	/*说明*/
	.warn {
		margin-top: 40px;
	}
	
	.warn p {
		width: 100%;
		text-align: center;
		font-size: 26px;
		color: #989898;
		line-height: 50px;
	}
	
</style>