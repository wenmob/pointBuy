<template>
	<div class="stopStockContainer">
		<ul class='stopUl1' v-if="hasData">
			<li v-for="(item,index) in stopStockList">
				<div class='liDiv' @click="changeStatus(index)">
					<p>
						<span>{{item.stockName}}</span>
						<span>{{item.stockCode}}</span>
					</p>
					<p>
						<span>盈亏</span>
						<span :class="item.gainLoss>=0?'redColor':'greenColor'">{{item.gainLoss!=undefined?item.gainLoss.toFixed(2):'-'}}</span>
					</p>
					<p>
						<span>{{item.positionNum}}股</span>
					</p>
					<p>
						<button v-if="item.status == 2" @click="popController('sale',item.id,index)">卖出</button>
						<span>{{item.statusStr}}</span>
					</p>
				</div>
				<div class='stopListDetail'>
					<p>
						<span>成交均价：{{item.buyAveragePrice!=undefined?item.buyAveragePrice.toFixed(2):'-'}} </span>
						<span>当前价格： {{item.newPrice!=undefined?item.newPrice.toFixed(2):'-'}}</span>
					</p>
					<p>
						<span>{{item.dateAdd}}</span>
					</p>
				</div>
			</li>
		</ul>
		<div v-if='!hasData' class="noData">
			<img src="../../assets/img/nodata1.jpg" alt="" />
			<p>暂无停牌股票</p>
		</div>
		<!--弹窗-->
		<div v-if="$route.path == '/stopStock'">
			<inputPop v-show="inputPopShow" ref='inputPop'></inputPop>
		</div>
	</div>
</template>

<script>
	import { API } from "../../utils/api.js"
	import InputPop from '../plugIn/InputPop.vue'
	let vm;
	
	export default{
		data(){
			return{
				hasData:false,
				inputPopShow:false,
				stopStockList:[]
			}
		},
		components: {
			InputPop
		},
		mounted(){
			vm = this;
			vm.notFot()
			vm.getStopStockList()
		},
		methods:{
			//停牌股票列表
			getStopStockList(){
				API.stopStockList(function(res){
					if(res.code == 0 && res.data.length>0){
						vm.hasData = true
						vm.stopStockList = res.data
						//成交均价
						vm.stopStockList.forEach(function(item){
							//成交均价
							if(item.buyCostTotal&&item.buyDoneNum){
								item.buyPriceMean = (item.buyCostTotal/item.buyDoneNum).toFixed(2)
							}else{
								item.buyPriceMean = 0
							}
						})
					}
				})
			},
			//卖出
			sellOut(stockId){
				API.sellOut(stockId,function(res){
					if(res.code == 0){
						layer.open({
							content:'卖出成功',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}else{
						layer.open({
							content:res.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				})
			},
			//保证每次显示一个详情
			changeStatus(index){
				let dom = $('.stopUl1 li').eq(index).find('.stopListDetail')[0]
				if(dom.style.display == 'block'){
					dom.style.display = 'none'
				}else{
					dom.style.display = 'block'
					let oTable = $('.stopUl1 li').eq(index).siblings().find('.stopListDetail')
					for(var item of oTable){
						item.style.display = 'none'
					}
				}
			},
			//卖出弹窗
			popController(type,strategyId,index){
				console.log(strategyId)
				vm.inputPopShow = true
				vm.$refs.inputPop.popTit = '卖出'
				vm.popType = type
				vm.$refs.inputPop.stockId = strategyId
				console.log(vm.stopStockList[index])
				vm.$refs.inputPop.saleData = {
					stockName:vm.stopStockList[index].stockName,
					stockCode:vm.stopStockList[index].stockCode,
					gainLoss:vm.stopStockList[index].gainLoss,
					positionNum:vm.stopStockList[index].positionNum
				}
			},
			notFot () {
		      this.$emit('listenFot', '3')
		    },
		}
	}
</script>

<style lang='scss' scoped>
	@import "../../assets/css/bus";
	.stopStockContainer{
		.stopUl1 {
			border-collapse: collapse;
			width: 100%;
			padding: 0;
			margin: 0;
			text-align: center;
			li {
				overflow: hidden;
				border-bottom:1px solid $borderColor;
				.liDiv {
					height: 120px;
					padding:0 30px;
					p {
						float: left;
						display: inline-block;
						width: 25%;
						padding-top:35px;
						font-size: 24px;
						color: #282828;
						&:nth-of-type(1) {
							text-align:left;
							span {
								&:first-child {
									font-size: 28px;
								}
								&:last-child {
									color: #585858;
								}
							}
						}
						&:nth-of-type(2) {
							span {
								&:last-child {
									color: #76cf75;
								}
							}
						}
						&:nth-of-type(3),&:nth-of-type(4) {
							span{
								line-height: 50px;
							}
							
						}
						span {
							display: block;
						}
						button {
							/*margin-top: 35px;*/
							background: transparent;
							color: $themeColor;
							border: 2px solid $themeColor;
							border-radius: 50px;
							width: 120px;
							height: 48px;
							float:right;
						}
					}
				}
				.stopListDetail {
					height: 120px;
					background: #f5f5f5;
					font-size: 20px;
					color:#282828;
					text-align:left;
					padding: 15px 30px 0 30px;
					display:none;
					p{
						span{
							display:inline-block;
							line-height:50px;
							width:260px;
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