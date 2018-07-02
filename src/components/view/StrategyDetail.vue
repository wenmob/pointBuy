<template>
	<div class="strategyDetail">
		<div class="detail">
			<div>
				<p>
					<span>
						<em>策略编号</em>
						<em>{{detailData.orderNumber?detailData.orderNumber:'-'}}</em>
					</span>
				</p>
			</div>
		</div>
		<div class="detail">
			<h4>
				<icon class="icon" name='heart' scale='2'></icon>
				交易合作
			</h4>
			<div>
				<p>
					<span>
						<em>投资人</em>
						<em>{{detailData.investorName?detailData.investorName:'-'}}</em>
					</span>
				</p>
				<p>
					<span>
						<em>点买人</em>
						<em>{{detailData.userName?detailData.userName:'-'}}</em>
					</span>
				</p>
			</div>
		</div>
		<div class="detail">
			<h4>
				<icon class="icon" name='payDetail' scale='2'></icon>
				交易明细
			</h4>
			<div>
				<p>
					<span>
						<em>股票名称:</em>
						<em>{{detailData.stockName}}</em>
					</span>
					<span>
						<em>交易数量:</em>
						<em>{{detailData.positionNum!=undefined?detailData.positionNum:'-'}}股</em>
					</span>
				</p>
				<p>
					<span>
						<em>买入价格:</em>
						<em>{{detailData.buyAveragePrice!=undefined?detailData.buyAveragePrice.toFixed(2):'-'}}</em>
					</span>
					<span>
						<em>卖出价格:</em>
						<em>{{detailData.sellAveragePrice!=undefined?detailData.sellAveragePrice.toFixed(2):'-'}}</em>
					</span>
				</p>
				<p>
					<span>
						<em>买入类型:</em>
						<em>市价</em>
					</span>
					<span>
						<em>卖出类型:</em>
						<em>市价</em>
					</span>
				</p>
				<p>
					<span>
						<em>买入时间:</em>
						<em>{{detailData.dateAdd?detailData.dateAdd.split(' ')[0]:'-'}}</em>
					</span>
					<span>
						<em>卖出时间:</em>
						<em>{{detailData.sellTime?detailData.sellTime.split(' ')[0]:'-'}}</em>
					</span>
				</p>
				<p>
					<span>
						<em>股票分红:</em>
						<em>{{detailData.bonusAmount!=undefined?detailData.bonusAmount.toFixed(2):'-'}}</em>
					</span>
				</p>
				<p>&nbsp;</p>
				<p v-if="$route.query.type == '1'">
					<span>
						<em>履约保证金:</em>
						<em class='redColor'>{{detailData.deposit!=undefined?detailData.deposit.toFixed(2):'-'}}</em>
					</span>
				</p>
				<p v-if="$route.query.type == '1'">
					<span>
						<em>综合服务费:</em>
						<em>{{detailData.comFee!=undefined?detailData.comFee.toFixed(2):'-'}}</em>
					</span>
					<span>
						<em>递延费:</em>
						<em>{{detailData.continueFee!=undefined?detailData.continueFee.toFixed(2):'-'}}</em>
					</span>
				</p>
				<p v-if="$route.query.type == 'D'">
					<span>
						<em>交易综合费:</em>
						<em>{{detailData.traderFee!=undefined?detailData.traderFee.toFixed(2):'-'}}</em>
					</span>
				</p>
			</div>
		</div>
		<div class="detail">
			<h4>
				<icon class="icon" name='allocation' scale='1.8'></icon>
				盈亏分配
			</h4>
			<div>
				<p>
					<span>
						<em>点买人</em>
						<em :class="detailData.gainLoss>=0?'redColor':'greenColor'">{{detailData.gainLoss!=undefined?detailData.gainLoss.toFixed(2):'-'}}</em>
					</span>
					<span>
						<em>投资人</em>
						<em class='redColor'>{{detailData.investorGain!=undefined?detailData.investorGain.toFixed(2):'-'}}</em>
					</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	import Icon from 'vue-svg-icon/Icon.vue'
	import { API } from "../../utils/api.js"
	let vm;

	export default{
		data() {
			return {
				detailData:{}
			}
		},
		components: {
			Icon

		},
		mounted() {
			vm = this;
			vm.strategyDetail()
			vm.notFot()
		},
		methods: {
			//策略(历史)详情
			strategyDetail(){
				API.strategyDetail(vm.$route.query.id,function(res){
					if(res.code == 0){
						vm.detailData = res.data
					}
					console.log(vm.detailData)
				})
				//卖出价格
				if(vm.detailData.sellCostTotal!=0&&vm.detailData.sellDoneNum!=0){
					vm.detailData.sellPrice = vm.detailData.sellCostTotal/vm.detailData.sellDoneNum
				}else{
					vm.detailData.sellPrice = 0
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
	.strategyDetail{
		.redColor{
			color:$themeColor;
		}
		.greenColor{
			color:greenColor;
		}
		&:not(h4){
			line-height:42px;

		}
		h4{
			height:80px;
			margin:0;
			background:#f5f5f5;
			padding-left:30px;
			line-height:80px;
			color:#585858;
			font-size:28px;
			/*font-weight:600;*/
			.icon{
				float:left;
				margin-top:22px;
				margin-right:5px;
			}
		}
		.detail{
			div{
				padding:20px 30px;
				font-size:24px;
				color:#585858;
				p{
					display:flex;
					span{
						flex:1;
						em{
							&:first-child{
								margin-right:20px;
							}
						}
					}
					
				}
			}
			&:nth-of-type(3){
				h4{
					.icon{
						color:cadetblue;
					}
				}
			}
			&:nth-of-type(4){
				h4{
					.icon{
						color:sandybrown;
					}
				}
			}
		}
	}
</style>
