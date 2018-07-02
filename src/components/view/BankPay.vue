<template>
	<div class="bankPay">
		<div class="bankPayInof">
			<span class="row-s1">
				<em>
					<icon class='icon' name='warning3' scale='1.5'></icon>
				</em>
  				<em>你可以通过网上银行、银行柜台、ATM等方式向{{headerContent.siteName}}转账!</em>
  				
  			</span>
		</div>
		<div class="payrow">
			<div class="payrow-tit">
				<span><strong>汇款账户</strong></span>
			</div>
			<div class="bank-account" v-for='item in userBankInfo'>
				<p class="bank-tit">{{item.bankName}}</p>
				<p class="bank-s2"><span>账&nbsp;&nbsp;&nbsp;号：</span>{{item.account}}</p>
				<p class="bank-s2"><span>户&nbsp;&nbsp;&nbsp;名：</span>{{item.name}}</p>
				<p class="bank-s2"><span>开户行：</span>{{item.branch}}</p>
			</div>
			<div class="payrow-bot">
				<p class="bank-s3">转账完成，您可拨打客服热线
					<span style="color: red;">{{headerContent.tel}}</span>
					确认到账进度
				</p>
			</div>
		</div>
	</div>
</template>
<script>
	import $ from 'jquery'
	import Icon from 'vue-svg-icon/Icon.vue'
	import { API } from "../../utils/api.js"
	let vm;
	
	export default {
		data() {
			return {
				headerContent: {},
				userBankInfo: []
			}
		},
		components: {
		    Icon
		},
		mounted() {
			vm = this;
			vm.notFot()
			vm.isWeixinBrowser()
			vm.getsiteName();
			vm.rechargeOffMerchantSet();
		},
		methods: {
			//判断是否是微信
			isWeixinBrowser() {
				const agent = window.navigator.userAgent.toLowerCase()
				if(agent.indexOf('micromessenger') == -1) {/*不是微信*/
//					console.log($('.bankPayInof'))
//					$('.bankPayInof')[0].style.marginTop = '42px';
				}
			},
			/*获取头部数据*/
			getsiteName() {
				API.getCommon(function(data) {
//					console.log(data.data);
					vm.headerContent = data.data;

				})
			},
			rechargeOffMerchantSet() {
				API.rechargeOffMerchantSet(function(data) {
//					console.log(data)
					if(data.code != 0){
						return
					}
					vm.userBankInfo = data.data
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
	/*@import "../../assets/css/bus";*/
	.bankPay{
		position:absolute;
		top:0;
		background:#f5f5f5;
		height:100%;
		.bankPayInof {
			/*margin-top:84px;*/
			padding:30px;
			/*height: 100px;*/
			background-color: #fff;
			border-bottom: 1px solid #e6e6e6;
			border-top: 1px solid #e6e6e6;
			background:#fff;
			.row-s1 {
				/*position:relative;*/
				line-height: 40px;
				font-size: 24px;
				color: #282828;
				/*.icon{
					position:absolute;
					top:0;
					
				}*/
				em{
					&:first-child{
						width:40px;
						float:left;
						margin-top:5px;
					}
					&:last-child{
						display:inline-block;
						width:calc(100% - 50px);
					}
					/*margin-left:60px;*/
				}
			}
		}
		.payrow {
			padding: 0 30px;
			.payrow-tit {
				height: 60px;
				padding-top: 50px;
				span {
					color: #282828;
					font-size: 32px;
					
				}
			}
			.bank-account {
				height: 250px;
				background-color: #fff;
				border-radius: 10px;
				border: 1px solid #e6e6e6;
				margin-bottom: 20px;
				padding:0 30px;
				.bank-tit {
					font-size: 32px;
					color: #f36a6a;
					font-weight: bold;
					line-height:80px;
				}
				.bank-s2 {
					font-size: 26px;
					color: #585858;
					line-height: 50px;
					span {
						display: inline-block;
						width: 110px;
						text-align: right;
					}
				}
			}
			.bank-s3 {
				line-height: 80px;
				color: #585858;
				font-size: 26px;
			}
		}
	}

</style>