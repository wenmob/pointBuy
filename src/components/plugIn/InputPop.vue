<template>
	<div class="inputPop">
		<div class="inputcontent">
			<div class="popTit">
				<i></i>
				<span>{{popTit}}</span>
				<em @click="$parent.inputPopShow=false;zsShow = false">&times;</em>
			</div>
			<!--修改止损-->
			<div v-show="$parent.popType == 'changeZS'" class="popCenter">
				<div @keyup.enter='autoContinueFlag'>
					<span>设置止损价</span>
					<input type="number" v-model='zsPrice'/>
					<span>
						<p>止损价格</p>
						<p class='greenColor'>{{closePrice?closePrice.toFixed(2):'-'}}</p>
					</span>
				</div>
				<div>最低止损价:<span class='redColor'>{{lowClosePrice?lowClosePrice.toFixed(2):'-'}}</span></div>
				<div><button @click='updateCloseLine(stockId)'>确 定</button></div>
			</div>
			<!--增加保证金-->
			<div v-show="$parent.popType == 'addBZJ'&&zsShow == false" class="popCenter">
				<div>
					<input style='width:200px' type="number" v-model='deposit'/>
				</div>
				<div>止损金额：<span class='greenColor'>{{lowCloseLine?(Number(lowCloseLine)-Number(deposit)).toFixed(2):'-'}}</span></div>
				<!--<div>
					<em @click="zsPrice>lowClosePrice?zsPrice--:''">-</em>
					<input type="number" v-model='zsPrice'/>
					<em @click='zsPrice++'>+</em>
				</div>
				<div>最低止损价:<span class='redColor'>{{lowClosePrice?lowClosePrice.toFixed(2):'-'}}</span></div>
				<div><button @click='addDeposit'>确 定</button></div>-->
				<div>递延条件<span class='greenColor'>≥{{warningLine?(warningLine-deposit).toFixed(2):'-'}}</span></div>
				<div><button @click='zsNext' style="margin-top:20px">下一步</button></div>
			</div>
			<div v-show="$parent.popType == 'addBZJ'&&zsShow == true" class="popCenter">
				<div>止损价格：<span class='greenColor'>{{closePrice?closePrice.toFixed(2):'-'}}</span></div>
				<div>最低止损价:<span class='redColor'>{{((buyCostTotal+(Number(lowCloseLine)-bonusAmount-Number(deposit)))/positionNum).toFixed(2)}}</span></div>
				<div>
					是否止损价调整到最低
					<i @click="lowClose = 0" v-show='lowClose == 1'>
						<icon class='openIcon' name='open' scale='5'></icon>
					</i>
					<i @click="lowClose = 1" v-show='lowClose == 0'>
						<icon class='openIcon' name='close' scale='5'></icon>
					</i>
				</div>
				<div><button @click='addDeposit' style="margin-top:10px">确 定</button></div>
			</div>
			<!--卖出-->
			<div v-show="$parent.popType == 'sale'" class="popCenter salePop">
				<div>
					<span>
						<p>{{saleData.stockName}}</p>
						<p>{{saleData.stockCode}}</p>
					</span>
					<span>
						<p>盈亏</p>
						<p :class="saleData.gainLoss>=0?'redColor':'greenColor'">{{saleData.gainLoss}}</p>
					</span>
					<span>
						{{saleData.positionNum}}股
					</span>
				</div>
				<div>是否即时卖出？</div>
				<div>
					<button @click='stockSell'>确 定</button>
					<button @click="$parent.inputPopShow=false">取 消</button>
				</div>
			</div>
			<!--放弃策略-->
			<div v-show="$parent.popType == 'giveUp'" class="popCenter giveUp">
				<div>
					放弃策略履约保证金归投资人所有，不享有盈利分成；
				</div>
				<div>
					此策略将由投资人单独承担盈亏。
				</div>
				<div>
					<button @click="stopStockGiveUp">确定</button>
				</div>
			</div>
			<!--长期递延-->
			<!--<div v-show="$parent.popType == 'deferLong'" class="popCenter deferLong">
				<div>交易日</div>
				<div>
					<em @click="deferTime>5?deferTime--:''">-</em>
					<input type="number" v-model='deferTime'/>
					<em @click='deferTime++'>+</em>
				</div>
				<div>递延费:<span class='redColor'>{{investorGain}}</span>元</div>
				<div>
					<button @click=''>确 定</button>
				</div>
			</div>-->
			<!--买断策略-->
			<div v-show="$parent.popType == 'buyStop'" class="popCenter giveUp">
				<div>
					买断股票停牌市值，自己承担策略产生的盈亏；
				</div>
				<div>
					向投资人支付：								
					<span style='font-size:20px' class='redColor'>{{buyoutAmount?buyoutAmount.toFixed(2):'-'}}</span>
				</div>
				<div>
					<button @click="buyOut">确定</button>
				</div>
			</div>
			<!--立即/手动递延-->
			<div v-show="$parent.popType == 'handDefer'" class="popCenter salePop">
				<!--T+1立即递延-->
				<div v-show="$route.query.type == 0">
					是否确定递延?
				</div>
				<!--T+D手动递延-->
				<div v-show="$route.query.type == 1">
					是否确定递延<em style='font-size:16px;' class="redColor">&nbsp;{{dayNum}}&nbsp;</em>天，
					将扣除余额<em style='font-size:16px;' class="redColor">&nbsp;{{continueFee}}&nbsp;</em>
					元
				</div>
				<div style='margin-top:30px;'>
					<button @click='continueStrategy'>确 定</button>
					<button @click="$parent.inputPopShow=false">取 消</button>
				</div>
			</div>
			<!--增加资金-->
			<div v-show="$parent.popType == 'addMoney'" style="width:200px;margin:0 auto;padding-top:20px;" class="popCenter">
				<div>
					<input style='width:200px;margin:0;' type="number" v-model="amount"/>
				</div>
				<div style="justify-content:left;line-height:25px;width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
					履约保证金：<span class='redColor'>{{(amount/lever).toFixed(2)}}</span>
				</div>
				<div style="justify-content:left;line-height:25px;">
					综合服务费：<span class='redColor'>{{((continueFeeRate*amount)/10000).toFixed(2)}}</span>
				</div>
				<div>
					<button @click='addAmount' style="margin-top:15px;">确 定</button>
				</div>
			</div>
			<!--终止策略组-->
			<div v-show="$parent.popType == 'stopList'" class="popCenter">
				<div>
					剩余保证金：
					<span style='font-size:16px;' class='redColor'>{{surplusDeposit?surplusDeposit.toFixed(2):'-'}}</span>
				</div>
				<div>
					<button @click='settleTaddD' style="margin-top:30px;">确 定</button>
				</div>
			</div>
			
			
		</div>
	</div>
</template>

<script>
	import { API } from "../../utils/api.js"
	import Icon from 'vue-svg-icon/Icon.vue'
	let vm;
	
	export default{
		data(){
			return{
				popTit:'',
				stockId:'',
				zsPrice:'',//设置的止损价格
				closePrice:'',//当前的止损金额
				lowCloseLine:'',//(用于计算止损金额)
				deposit:'',//添加的保证金
				lowClosePrice:'',//最低止损价格
				deferTime:5,//长期递延时间
				dayNum:'',//手动递延时间
				continueFee:'',//手动递延费
				warningLine:'',//递延条件
				amount:'',//增加的金额
				bonusAmount:'',//分红金额
				lever:'',//T+d杠杆
				continueFeeRate:'',
				surplusDeposit:'',//终止策略组
				zsShow:false,//增加保证金的时候是否调整到最低止损价
				lowClose:1,
				elseId:'',
				saleData:{//卖出弹窗的数据
						stockName:'',
						stockCode:'',
						gainLoss:'',
						positionNum:''
					},
				investorGain:'',//长期递延的递延费
				buyoutAmount:'',//买断时需付金额
				buyCostTotal:'',//买入总价
				positionNum:'',//买入数量
			}
		},
		components: {
			Icon
		},
		mounted(){
			vm = this;
//			console.log(vm.$parent)
			
		},
		methods:{
			zsNext(){
				if(vm.deposit == ''){
					layer.open({
						content:'请设置保证金',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return
				}
				vm.zsShow =true
			},
			//改变增加保证金弹窗的高度
			changeHight(){
				if(vm.$parent.popType == 'addBZJ'){
					$('.inputcontent')[0].style.height= '300px';
				}else{
					$('.inputcontent')[0].style.height= '230px';
				}
			},
			//获取最低止损价
			getLowClosePrice(stockId){
//				console.log(stockId)
				API.getLowClosePrice(stockId,function(res){
					if(res.code == 0){
						vm.lowClosePrice = res.data
					}else{
						layer.open({
							content:res.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				})
			},
			//修改止损
			updateCloseLine(stockId){
				console.log(vm.stockId)
				if(vm.zsPrice == ''){
					layer.open({
						content:'请设置止损价',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return
				}
				console.log(stockId)
				API.updateCloseLine(stockId,vm.zsPrice,function(res){
					if(res.code == 0){
						vm.$parent.inputPopShow=false
						layer.open({
							content:'操作成功',
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
			//增加保证金
			addDeposit(){
				console.log(vm.stockId)
				
				API.addDeposit(vm.stockId,vm.deposit,vm.lowClose,function(res){
					if(res.code == 0){
						vm.$parent.inputPopShow=false
						vm.zsShow = false
						vm.lowClose=1//调整到最低止损价的开关
					}else{
						layer.open({
							content:res.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				})
				vm.updateCloseLine(vm.elseId)
			},
			//股票卖出
			stockSell(){
				API.stockSell(vm.stockId,function(res){
					if(res.code == 0){
						vm.$parent.inputPopShow=false
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
			//策略递延(T+1立即递延/T+D手动递延)
			continueStrategy(){
				API.continueStrategy(vm.stockId,function(res){
					if(res.code == 0){
						vm.$parent.inputPopShow=false
						layer.open({
							content: '递延成功',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}else{
						layer.open({
							content: res.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				})
			},
			//T+D增加资金
			addAmount(){
				if(vm.amount == ''){
					layer.open({
						content:'请设置增加金额',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return
				}
				API.addAmount(vm.stockId,vm.amount,function(res){
					if(res.code == 0){
						vm.$parent.inputPopShow=false
						layer.open({
							content: '增加资金成功',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}else{
						layer.open({
							content: res.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				})
			},
			//T+D终止策略组(结算)
			settleTaddD(){
				API.settleTaddD(function(res){
					if(res.code == 0){
						vm.$parent.inputPopShow=false
						layer.open({
							content:'终止成功',
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
			//T+1停牌放弃策略
			stopStockGiveUp(){
				API.stopStockGiveUp(vm.stockId,function(res){
					if(res.code == 0){
						layer.open({
							content:'已放弃该策略',
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
			//T+1停牌买断
			buyOut(){
				API.buyOut(vm.stockId,function(res){
					if(res.code == 0){
						vm.$parent.inputPopShow=false
						layer.open({
							content:'买断成功',
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
			
			
		}
	}
</script>

<style lang='scss' scoped>
	@import "../../assets/css/bus";
	.inputPop{
		position:absolute;
		top:0;
		left:0;
		bottom:0;
		width:100%;
		height:100%;
		background:rgba(0,0,0,.7);
		z-index:99000;
		.inputcontent{
			position:absolute;
			left:0;
			right:0;
			top:0;
			bottom:0;
			margin:auto;
			width:calc(100% - 60px);
			height:460px;
			background:#fff;
			border-radius:10px;
			.popTit{
				height:102px;
				background:$themeColor;
				color:#fff;
				padding:0 30px;
				font-size:30px;
				line-height:102px;
				border-radius:10px 10px 0  0;
				i{
					display:inline-block;
					float:left;
					width:8px;
					height:28px;
					background:#fff;
					margin-top:40px;
				}
				span{
					padding-left:10px;
				}
				em{
					position:absolute;
					top:-20px;
					right:30px;
					font-size:50px;
				}
			}
			.popCenter{
				padding:70px 30px 0 30px;
				div{
					display:flex;
					justify-content: center;
					font-size:26px;
					color:#585858;
					line-height:60px;
					input{
						border:2px solid #eee;
						border-radius:10px;
						width:210px;
						height:56px;
						margin:0 20px;
						text-align:center;
					}
					span{
						p{
							line-height:35px;
							text-align:center;
						}
					}
					&:nth-of-type(2){
						line-height:90px;
					}
					i{
						margin-top:-15px;
						margin-left:15px;
					}
					em{
						width:68px;
						height:56px;
						line-height:44px;
						text-align:center;
						font-size:70px;
						border:2px solid #eee;
						border-radius:10px;
						color:#989898;
					}
					button{
						width:360px;
						height:68px;
						background:$themeColor;
						color:#fff;
						border:0;
						border-radius:8px;
						font-size:28px;
					}
				}
				
			}
			.salePop{
				div{
					font-size:24px;
					span{
						flex:1;
						text-align:center;
						color:#282828;
						&:first-child{
							p{
								&:first-child{
									font-size:28px;
								}
								
							}
						}
					}
					button{
						width:200px;
						margin:0 30px;
						&:last-child{
							background:#989898;
						}
					}
				}
			}
			.giveUp{
				padding-top:50px;
				div{
					justify-content: left;
					&:last-child{
						justify-content: center;
						margin-top:30px;
					}
				}
			}
			.deferLong{
				padding-top:30px;
				div{
					input{
						text-align:center;
						width:258px;
					}
					em{
						width:68px;
						height:56px;
						line-height:44px;
						text-align:center;
						font-size:70px;
						border:2px solid #eee;
						border-radius:10px;
						color:#989898;
					}
					&:nth-of-type(3){
						line-height:60px;
					}
					button{
						margin-top:30px;
					}
				}
			}
			
		}
	}
</style>