<template>
	<div class="moneyDetail">
		<!--选项卡-->
		<div class="fd-top">
			<template v-for="(fda,index) in fdas">
				<a v-bind:class="index==0?'fd-top-a fd-top-active':'fd-top-a'" @click="chooseFda($event)">{{fda.name}}</a>
			</template>
		</div>
		<!--无数据的状态-->
		<div v-show='!hasContent' class="noData">
			<img src="../../assets/img/nodata.png" />
			<p>暂无交易记录</p>
		</div>
		<!--有数据的状态-->
		<div class="hasData">
			<div v-infinite-scroll="loadMore"
		  		:infinite-scroll-disabled="loading" :infinite-scroll-distance='scrollDistance'
		  		v-show='hasContent' class="cash-list">
					<dl v-for="(item,index) in finaDetails">
						<dd>
							<div class="cash-list-left">
								<span>{{btype == 'recharge' ? '余额' : item.typeStr}}</span>
								<span>{{btype == 'recharge' ? item.balance :''}}</span>
								<span>{{item.dateAdd}}</span>
							</div>
							<div class="cash-list-right">
								<span v-if="item.behavior == 0&& item.amount > 0">+{{item.amount}}</span>
								<span v-else-if="item.behavior == 0&& item.amount < 0">{{item.amount}}</span>
								<span v-else-if="item.behavior == 1&& item.amount > 0">-{{item.amount}}</span>
								<span v-else>{{item.amount}}</span>
								
							</div>
						</dd>
					</dl>
			</div>
		</div>
	</div>
</template>
<script>
	import $ from 'jquery'
	import { API } from "../../utils/api.js"
	let vm;
	import { Indicator } from 'mint-ui';

	export default {
		data() {
			return {
				fdas: [{
						name: "充值"
					},
					{
						name: "提现"
					},
					{
						name: "其他"
					}
				],
				finaDetails: [],
				totalPage:1,
				recharge: [],
				withdraw: [],
				other: [],
				page: 1,
				btype: 'recharge',
				hasContent: true,
				pageNum: 1,
				pageSize: 11,
				loading:false,
				scrollDistance:10,
				
				allLoaded:false,
				bottomDistance:100
			}
		},
		mounted() {
			vm = this;
			vm.isWeixinBrowser()
			vm.notFot()
		},
		methods: {
			loadMore() {
//				console.log(this.pageNum)
			  	this.loading = true;//禁止执行滚动事件
			  	/*如果是最后一页停止加载更多*/
				if(vm.totalPage < vm.pageNum){
					layer.open({
						content: '没有更多数据了',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return
				}
			 	//loading图出现
			  	Indicator.open({
				  	text: '加载更多',
				  	spinnerType: 'fading-circle'
				});
				vm.startUserMoneyCashLog()
				
				console.log(this.pageNum)
			  	setTimeout(() => {
    				Indicator.close();//loading图消失
			    	this.loading = false;//允许执行滚动事件
			  	}, 200);
			 
    			
			},
			//判断是否是微信
			isWeixinBrowser() {
				const agent = window.navigator.userAgent.toLowerCase()
				if(agent.indexOf('micromessenger') == -1) { /*不是微信*/
									console.log($('.tabTit'))
//					$('.fd-top')[0].style.marginTop = '42px';
					$('.cash-list')[0].style.marginTop = '65px';
				}else{
					$('.cash-list')[0].style.top = '62px';
					$('.cash-list')[0].style.height = "calc(100% - 60px)";
				}
			},
			//选项卡
			chooseFda(even) {
				vm.finaDetails = []; //每次点击后把之前加载的数据清空
				vm.pageNum = 1;
				let ele = even.currentTarget;
				let _this = $(ele);
				_this.addClass("fd-top-active");
				$(".fd-top-a").not(_this).removeClass("fd-top-active");
				let txt = _this.text();
				switch(txt) {
					case "充值":
						vm.btype = 'recharge';
						vm.startUserMoneyCashLog();
						break;
					case "提现":
						vm.btype = 'withdraw';
						vm.startUserMoneyCashLog();
						break;
					case "其他":
						vm.btype = 'other';
						vm.startUserMoneyCashLog();
						break;
				}
//				console.log(vm.finaDetails)
			},
			/*界面渲染*/
			startUserMoneyCashLog() {
//				console.log(vm.pageNum)
				API.userMoneyCashLog('', vm.btype, vm.pageNum, vm.pageSize, function(data) {
//					    		console.log(data)
					if(data.code == 0) {
						vm.pageNum ++;
						vm.hasContent = true;
						vm.totalPage = data.data.totalPage
						let arryDatas = data.data.result;
						arryDatas.forEach(function(elem) {
							vm.finaDetails.push(elem);
						});

					} else if(data.code == 700) {
						vm.hasContent = false;
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
	.moneyDetail {
		position: absolute;
		top: 0;
		height: 100%;
		background: #f5f5f5;
		.cash-list{
			position:absolute;
			top: 0;
			width:100%;
			height:calc(100% - 130px);
			overflow-y: auto;
		}
	}
	
	.fd-top {
		display: flex;
		width: 100%;
		height: 100px;
		background-color: white;
		border-top: 1px solid $borderColor;
	}
	
	.fd-top-a {
		font-size: 28px;
		flex: 1;
		height: 100%;
		line-height: 100px;
		text-align: center;
		color: #585858;
		border-bottom: 1px solid #F5F5F5;
	}
	
	.fd-top-active {
		color: rgba(243, 106, 106, 1);
		border-bottom: 1px solid #F46A6A;
	}
	.cash-list dl{
		margin:0;
		background-color: rgba(250, 250, 250, 1);
		&:nth-of-type(1){
			dd{
				border-top: 1px solid rgba(230, 230, 230, 1);
			}
		}
		dd {
			margin: 0;
			height: 100px;
			padding: 10px 30px;
			border-bottom: 1px solid rgba(230, 230, 230, 1);
		}
	}
	
	.cash-list-left {
		float: left;
		margin-top: 22px;
	}
	
	.cash-list-left span:nth-child(1) {
		font-size: 28px;
		display: inline-block;
		color: rgba(88, 88, 88, 1);
	}
	
	.cash-list-left span:nth-child(2) {
		color: #F46A6A;
		margin-left: 10px;
		font-weight: 600;
		font-size: 30px;
	}
	
	.cash-list-left span:nth-child(3) {
		font-size: 24px;
		display: block;
		color: rgba(88, 88, 88, 1);
	}
	
	.cash-list-right {
		float: right;
		margin-top: 35px;
	}
	
	.cash-list-right span {
		font-size: 0.39rem;
		font-weight: 600;
	}
	.noData{
		img{
			margin-top:250px;
		}
	}
	
	/*.noContent {
		position: absolute;
		width: 100%;
		text-align: center;
		background: #f5f5f5;
		z-index: 100;
	}
	
	.noContent img {
		width: 2rem;
		height: 2rem;
		margin-top: 3rem;
	}
	
	.noContent .info {
		font-size: 28px;
		font-weight: 600;
		padding-top: 50px;
		margin: 1rem auto;
	}*/
</style>