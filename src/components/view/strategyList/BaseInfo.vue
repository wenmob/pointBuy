<template>
	<div class="baseInfo">
		<p>
			<span>起止时间</span>
			<span>{{strategyInfo.dateAdd?strategyInfo.dateAdd.split(' ')[0]:''}}-{{strategyInfo.settleTime?strategyInfo.settleTime.split(' ')[0]:''}}</span>
		</p>
		<p>
			<span>策略金额</span>
			<span>{{strategyInfo.operateAmount!=undefined?strategyInfo.operateAmount.toFixed(2):'-'}}</span>
		</p>
		<p>
			<span>履约保证金</span>
			<span>{{strategyInfo.deposit!=undefined?(strategyInfo.deposit+strategyInfo.supplyDeposit).toFixed(2):'-'}}</span>
		</p>
		<p>
			<span>总盈亏</span>
			<span>{{strategyInfo.settleProfit!=undefined?strategyInfo.settleProfit.toFixed(2):'-'}}</span>
		</p>
		<p>
			<span>递延费</span>
			<span>{{strategyInfo.continueFeeTotal!=undefined?strategyInfo.continueFeeTotal.toFixed(2):'-'}}</span>
		</p>
		<p>
			<span>交易综合费</span>
			<span>{{strategyInfo.traderFee!=undefined?strategyInfo.traderFee.toFixed(2):'-'}}</span>
		</p>
	</div>
</template>

<script>
	import { API } from "../../../utils/api.js"
	let vm;
	
	export default{
		data() {
			return {
				strategyInfo:{}
			}
		},
		
		mounted() {
			vm = this;
			vm.tdStrategyInfo()
		},
		methods: {
			//T+D组详情
			tdStrategyInfo(){
				API.tdStrategyInfo(vm.$route.query.id,function(res){
					if(res.code == 0){
						vm.strategyInfo = res.data
					}
				})
			},
		},
	}
</script>

<style lang='scss' scoped>
	@import "../../../assets/css/bus";
	.baseInfo{
		p{
			height:90px;
			line-height:90px;
			padding:0 30px;
			font-size:28px;
			color:#585858;
			border-bottom:1px solid #ccc;
			span{
				&:first-child{
					display:inline-block;
					width:180px;
				}
			}
		}
	}
</style>