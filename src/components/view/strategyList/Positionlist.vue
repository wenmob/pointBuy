<template>
	<div class="positionlist">
		<ul v-if="hasData">
			<router-link v-for="item in tdStockData" :to="'strategyDetail?type=D&id='+item.id" tag='li'>
				<div>
					<p>{{item.stockName}}</p>
					<p>{{item.stockCode}}</p>
				</div>
				<div>
					<p>盈亏</p>
					<p :class="item.gainLoss>=0?'redColor':'greenColor'">{{item.gainLoss!=undefined?item.gainLoss.toFixed(2):'-'}}</p>
				</div>
				<div>
					<p>{{item.buyNum}}股</p>
				</div>
			</router-link>
		</ul>
		<div v-if="!hasData" class="noData">
			<img src="../../../assets/img/nodata1.jpg" alt="" />
			<p>暂无持仓股票</p>
		</div>
	</div>
</template>

<script>
	import { API } from "../../../utils/api.js"
	let vm;
	
	export default{
		data() {
			return {
				hasData:false,
				tdStockData:[]
			}
		},
		
		mounted() {
			vm = this;
			vm.tdStockList()
		},
		methods: {
			//T+D策略股票列表
			tdStockList(){
				API.tdStockList(vm.$route.query.id,function(res){
					if(res.code == 0){
						vm.hasData = true
						vm.tdStockData = res.data
					}else{
						vm.hasData = false
					}
				})
			},
			
			
			
		},
	}
</script>

<style lang='scss' scoped>
	@import "../../../assets/css/bus";
	.positionlist{
		ul{
			margin:0;
			padding:0;
			li{
				display:flex;
				height:120px;
				padding:0 30px;
				border-bottom:1px solid #ccc;
				align-items: center;
				div{
					flex:1;
					text-align:center;
					font-size:24px;
					color:#585858;
					p{
						&:last-child{
							padding-top:5px;
						}
					}
					&:first-child{
						p{
							&:first-child{
								font-size:30px;
							}
							&:last-child{
								font-size:26px;
							}
						}
					}
				}
			}
		}
		.noData{
			img{
				margin-top:250px;
			}
		}
	}
</style>