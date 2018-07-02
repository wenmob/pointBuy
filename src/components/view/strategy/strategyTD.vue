<template>
	<div class='strategyTDContainer'>
		<div class="strategyTDTit">
			<p>
				<span>T+D策略</span>
				<router-link to='historyTD' tag='button'>历史查询</router-link>
			</p>
			<div>
				<span>
					可用金额(元)
				</span>
				<span>
					{{TDData.balance?TDData.balance.toFixed(2):'-'}}
				</span>
				<router-link :to="'strategyList?type=2&id='+TDData.id+'&orderNumber='+TDData.orderNumber" tag='span'>
					资金记录
				</router-link>
			</div>
		</div>
		<div class="strategyTDMoney">
			<div class="timeTD">
				<span>剩余时间：aaaa天</span>
				<button @click="popController('handDefer','','')">手动递延</button>
				<span>
					自动递延
					<em @click="autoContinueFlag(0)" v-show='TDData.continueFlag == 1'>
						<icon class='openIcon' name='open' scale='5'></icon>
					</em>
					<em @click="autoContinueFlag(1)" v-show='TDData.continueFlag == 0'>
						<icon class='openIcon' name='close' scale='5'></icon>
					</em>
				</span>
			</div>
			<ul class="moneyTD">
				<li>
					<p>总资产</p>
					<p>{{TDData.assets?TDData.assets.toFixed(2):'-'}}</p>
				</li>
				<li>
					<p>持仓市值</p>
					<p>{{TDData.marketValue?TDData.marketValue.toFixed(2):'-'}}</p>
				</li>
				<li>
					<p>总盈亏</p>
					<p>{{TDData.gainLoss?TDData.gainLoss.toFixed(2):'-'}}</p>
				</li>
				<li>
					<p>止盈金额</p>
					<p>{{TDData.profitStop?TDData.profitStop.toFixed(2):'-'}}</p>
				</li>
				<li>
					<p>止损金额</p>
					<p>{{TDData.closeLine?TDData.closeLine.toFixed(2):'-'}}</p>
				</li>
				<li>
					<p>递延条件</p>
					<p>{{TDData.warningLine?TDData.warningLine.toFixed(2):'-'}}</p>
				</li>
			</ul>
		</div>
		<div v-if='hasData&&hasList' class="positionTD">
			<div class='emptyDiv'></div>
			<div class="tit">
				<icon class='icon' name='kind3' scale='1.5'></icon>
				<span>策略持仓</span>
			</div>
			<ul class='posUlD'>
				<li v-for='(item,index) in TDData.stock'>
					<div class='liDiv' @click='liClick(index)'>
						<p>
							<span>{{item.stockName}}</span>
							<span>{{item.stockCode}}</span>
						</p>
						<p>
							<span>盈亏</span>
							<span v-if='item.gainLoss' :class="item.gainLoss>=0?'redColor':'greenColor'">{{item.gainLoss.toFixed(2)}}</span>
							<span v-if='!item.gainLoss'>-</span>
						</p>
						<p>
							<span>{{item.positionNum}}股</span>
						</p>
						<p>
							<i class='waitBuy' v-if='item.buttonType == 0'>等待接单</i>
							<i class='waitBuy' v-if='item.buttonType == 1'>等待买入</i>
							<button class='newBuy' v-if='item.buttonType == 2'>新购</button>
							<button v-if='item.buttonType == 3'>卖出</button>
							<i v-if='item.buttonType == 4'>等待卖出</i>
							<button class='stopBtn' v-if='item.buttonType == 6'>停牌</button>
						</p>
					</div>
					<div class='posTDListDetail'>
						<table>
							<tr>
								<td>
									成交均价：{{item.buyAveragePrice?item.buyAveragePrice:'-'}}
								</td>
								<td>
									止盈：{{item.profitStop?item.profitStop.toFixed(2):'-'}}
								</td>
							</tr>
							<tr>
								<td>
									当前价格：{{item.newPrice?item.newPrice.toFixed(2):'-'}}
								</td>
								<td>
									止损：{{item.closeLine?item.closeLine.toFixed(2):'-'}}
								</td>
							</tr>
						</table>
						<p>
							{{item.buyTime}}
							<button v-if="item.buttonType == 6" @click="popController('buyStop',item.id,index)">买断股票</button>
							<button v-if="item.buttonType != 6" @click="popController('changeZS',item.id,index)">修改止损</button>
						</p>
					</div>
				</li>
			</ul>
		</div>
		<div v-if='!hasData' class="noData">
			<img src="../../../assets/img/nodata1.jpg" alt="" />
			<p>暂无进行中的策略</p>
			<router-link to='create' tag='button'>立即创建</router-link>
		</div>
		
		<router-link to="/create" v-if='!hasList' class="noData noList" tag="div">
			<icon class='icon' name='addMore2' scale='15'></icon>
			<p>点击创建策略</p>
		</router-link>
		<!--创建更多悬浮框-->
		<icon v-if='hasData' class="addMoreIcon" name='addMore' scale='6'></icon>
		<!--弹窗-->
		<div  v-if="$route.query.type == 1">
			<inputPop v-show="inputPopShow" ref='inputPop'></inputPop>
		</div>
		<!--底部-->
		<div class="footerTD">
			<p @click="popController('addMoney',TDData.id,'')">
				<icon class="icon" name='$' scale='2'></icon>
				<span>增加金额</span>
			</p>
			<p @click="popController('stopList',TDData.id,'')">
				<icon class="icon" name='calculator' scale='1.8'></icon>
				<span>&nbsp;&nbsp;终止策略组</span>
			</p>
			<p @click="popController('addBZJ',TDData.id,'')">
				增加保证金
			</p>
		</div>
	</div>
</template>
<script>
	import Icon from 'vue-svg-icon/Icon.vue'
	import { API } from "../../../utils/api.js"
	import InputPop from '../../plugIn/InputPop.vue'
	import $ from 'jquery'
	let vm;

	export default {
		data() {
			return {
				isOpen: true,
				hasData:true,
				TDData:{},
				hasList:true,
				inputPopShow:false,
				popType:'',
				stockId:0
			}
		},
		components: {
			Icon,
			InputPop
		},
		mounted() {
			vm = this;
		},
		methods: {
			//T+D持仓列表
			strategyListTD(){
				API.strategyListTD(function(res){
					if(res.code != 0){
						vm.hasData = false
						return
					}
					vm.hasData = true
					vm.TDData = res.data
					if(vm.TDData.stock.length>0){
						vm.hasList = true
					}else{
						vm.hasList = false
					}
				})
			},
			//保证每次显示一个详情
			liClick(index){
				let dom = $('.posUlD li').eq(index).find('.posTDListDetail')[0]
				if(dom.style.display == 'block'){
					dom.style.display = 'none'
				}else{
					dom.style.display = 'block'
					if($('.posUlD li').length > 1){
						$('.posUlD li').eq(index).siblings().find('.posTDListDetail')[0].style.display = 'none'
					}
					
				}
			},
			//策略递延
			continueStrategy(){
				API.continueStrategy(vm.TDData.id,function(res){
					if(res.code == 0){
						layer.open({
							content:'递延成功',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				})
			},
			//关闭/开启自动递延
			autoContinueFlag(continueFlag){
				API.autoContinueFlag(vm.TDData.id,continueFlag,function(res){
					if(res.code == 0){
						vm.TDData.continueFlag = continueFlag
					}else{
						layer.open({
							content:res.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				})
			},
			//弹出框
			popController(type,strategyId,index){
				console.log(strategyId)
				vm.inputPopShow = true
				vm.popType = type
				vm.$refs.inputPop.stockId = strategyId
				if(type == 'handDefer'){
					vm.$refs.inputPop.popTit = '手动递延'
					vm.$refs.inputPop.dayNum = vm.TDData.dayNum//递延天数
					vm.$refs.inputPop.continueFee = vm.TDData.continueFee//递延费
				}else if(type == 'addMoney'){
					vm.$refs.inputPop.popTit = '增加资金'
					vm.$refs.inputPop.amount = ''
					vm.$refs.inputPop.lever = vm.TDData.lever//杠杆(用于计算履约保证金)
					vm.$refs.inputPop.continueFeeRate = vm.TDData.continueFeeRate//用于计算综合服务费
				}else if(type == 'stopList'){
					vm.$refs.inputPop.popTit = '终止策略组'
					vm.$refs.inputPop.surplusDeposit = vm.TDData.deposit+vm.TDData.supplyDeposit+vm.TDData.gainLoss//剩余保证金
				}else if(type == 'addBZJ'){
					vm.$refs.inputPop.popTit = '增加保证金'
					vm.$refs.inputPop.closeLine = vm.TDData.closeLine//(用于计算止损金额)
				}else if(type == 'buyStop'){
					vm.$refs.inputPop.popTit = '买断策略'
					vm.$refs.inputPop.buyoutAmount = vm.TDData.stock[index].buyoutAmount//买断时需付金额
				}else if(type == 'changeZS'){
					vm.$refs.inputPop.popTit = '修改止损'
					vm.$refs.inputPop.getLowClosePrice()
					vm.$refs.inputPop.closePrice = vm.TDData.closeLine//止损金额
				}
			},
			
		}
	}
</script>

<style lang='scss'>
	@import "../../../assets/css/bus";
	.strategyTDContainer {
		.strategyTDTit {
			padding: 0 30px;
			background: $themeColor;
			color: #fff;
			height: 240px;
			p {
				height: 88px;
				line-height: 88px;
				border-bottom: 1px solid #fff;
				font-size: 28px;
				button {
					float: right;
					/*width: 170px;*/
					padding:0 20px;
					height: 48px;
					background: transparent;
					border: 2px solid #fff;
					border-radius: 50px;
					color: #fff;
					margin-top: 18px;
					outline:0;
				}
			}
			div {
				padding:15px 0px;
				span {
					display:block;
					&:nth-of-type(2){
						font-size:54px;
						text-align:center;
					}
					&:nth-of-type(3){
						text-align:right;
					}

				}
			}
		}
		.strategyTDMoney{
			padding:0 30px;
			.timeTD{
				border-bottom:1px solid $borderColor;
				height:100px;
				line-height:100px;
				overflow:hidden;
				span{
					&:nth-of-type(2){
						float:right;
						em{
							float:right;
							margin-left:30px;
							margin-top:5px;
						}
					}
				}
				button{
					background:transparent;
					border:0;
					outline:0;
					padding:0 30px;
					height: 48px;
					border: 2px solid $themeColor;
					border-radius: 50px;
					color: $themeColor;
					margin-left:20px;
				}
			}
			.moneyTD{
				height:200px;
				margin:0;
				padding:0;
				li{
					float:left;
					width:33.3%;
					text-align:center;
					font-size:24px;
					padding:20px 0;
					p{
						line-height:30px;
					}
				}
			}
		}
		.positionTD {
			background: #fff;
			.tit {
				height: 80px;
				line-height: 80px;
				padding: 0 30px;
				.icon{
					float:left;
					margin-top:25px;
					margin-right:10px;
				}
				span {
					color: #585858;
					font-size: 28px;
				}
			}
			.posUlD {
				border-bottom: 2px solid $borderColor;
				border-collapse: collapse;
				width: 100%;
				padding: 0;
				margin: 0;
				text-align: center;
				li {
					overflow: hidden;
					border-top: 1px solid $borderColor;
					.liDiv {
						height: 120px;
						padding:0 30px;
						display:flex;
						align-items: center;
						p {
							flex:1;
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
							&:nth-of-type(4) {
								text-align:right;
							}
							span {
								display: block;
								&:last-child{
									padding-top:10px;
								}
							}
							button {
								background: transparent;
								color: $themeColor;
								border: 2px solid $themeColor;
								border-radius: 50px;
								width: 120px;
								height: 48px;
								outline:0;
								&.newBuy,&.stopBtn{
									color:#fff;
									border:0;
									background:#989898;
								}
								&.repealBtn{
									color:#fff;
									border:0;
									background:$blueColor;
								}
							}
						}
					}
					.posTDListDetail {
						height: 192px;
						background: #f5f5f5;
						font-size: 20px;
						padding: 15px 30px 0 30px;
						display:none;
						table {
							td {
								padding: 13px 0;
								width: 30%;
								text-align: left;
							}
						}
						p {
							text-align: left;
							overflow: hidden;
							height: 70px;
							line-height: 70px;
							button {
								float: right;
								width: 200px;
								height: 48px;
								background: transparent;
								color: $themeColor;
								border: 2px solid $themeColor;
								border-radius: 50px;
								outline:0;
								margin-top:10px;
							}

						}
					}
				}
			}
		}
		.noData{
			border-top:1px solid $borderColor;
			img{
				margin-top:80px;
			}
		}
		.noList{
			.icon{
		        margin-left:calc(50% - 137.14px);
		        margin-top:80px;
		    }
		    p{
		    	line-height:50px;
		    }
		}
		.footerTD{
			position:fixed;
			bottom:0;
			width:100%;
			height:97px;
			background:#f5f5f5;
			z-index:200;
			line-height:97px;
			display:flex;
			border-top:1px solid $borderColor;
			font-size:24px;
			colo:#383838;
			p{
				position:relative;
				text-align:center;
				width:30%;
				&:first-child{
					border-right:1px solid $borderColor;
				}
				&:last-child{
					width:40%;
					background:$themeColor;
					color:#fff;
					font-size:30px;
				}
				.icon{
					position:absolute;
					top:30px;
					left:40px;
				}
				span{
					padding-left:30px;
				}
			}
		}
	}
</style>
