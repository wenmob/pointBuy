<template>
	<div class="historyT1">
		<div class="dateT1">
			<div>
				<p>起始时间</p>
				<input type="date" @change='changeDate' v-model='startDate'/>
				<span>
					{{startDate}}
				</span>
			</div>
			<div>
				<p>截止时间</p>
				<input @change='changeDate' type="date"  v-model='endDate'/>
				<span>
					{{endDate}}
				</span>
			</div>
		</div>
		<div v-show='hasData' class="historyT1List">
			<div class="emptyDiv"></div>
			<div class="historyT1Tit">
				<icon class='icon' name='kind3' scale='1.5'></icon>
				策略持仓
			</div>
			<ul v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" 
		infinite-scroll-distance='30'>
				<li v-for='item in historyT1List'>
					<div>
						<p>{{item.stockName}}</p>
						<p>{{item.stockCode}}</p>
					</div>
					<div>
						<p>盈亏</p>
						<p :class="item.settleProfit>=0?'redColor':'greenColor'">{{item.settleProfit!=undefined?item.settleProfit.toFixed(2):'-'}}</p>
					</div>
					<div>
						{{item.stockNumber}}股
					</div>
					<div>
						<router-link :to="'strategyDetail?type=1&id='+item.stockId" tag='button'>查看</router-link>
					</div>
				</li>
			</ul>
		</div>
		<div v-show='!hasData' class="noData">
			<img src="../../assets/img/nodata1.jpg" alt="" />
			<p>暂无已完成的策略</p>
		</div>
	</div>
</template>

<script>
	import Icon from 'vue-svg-icon/Icon.vue'
	import { API } from "../../utils/api.js"
	import request from '../../utils/request'
	let vm;
	import { Indicator } from 'mint-ui';
	
	export default{
		data() {
			return {
				historyT1List:[],
				hasData:false,
				startDate:'',
				endDate:'',
				pageNum:1,
				pageSize:4,
				loading:false
				
			}
		},
		components: {
			Icon

		},
		mounted() {
			vm = this;
			vm.getSeatchDate()
			vm.notFot()
		},
		methods: {
			loadMore() {
//				console.log(vm.pageNum)
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
				vm.historyTaddOne()
				vm.pageNum ++;
			  	setTimeout(() => {
    				Indicator.close();//loading图消失
			    	this.loading = false;//允许执行滚动事件
			  	}, 200);
			},
			//获取默认的搜索时间(前7天至今)
			getSeatchDate(){
				let date = new Date()
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				let day = date.getDate()
				vm.endDate = year + '-' + month + '-' + day
				
				let beforeDate = new Date(date.getTime() - 7*24*60*60*1000);
				vm.startDate = beforeDate.getFullYear()+"-"+(beforeDate.getMonth()+1)+"-"+beforeDate.getDate();
//				vm.historyTaddOne()
			},
			//T+1历史查询
			historyTaddOne(){
				API.historyTaddOne(vm.startDate,vm.endDate,vm.pageNum,vm.pageSize,function(res){
					if(res.code == 0 && res.data.result.length > 0){
						vm.historyT1List = res.data.result
						vm.hasData = true
//						console.log(vm.historyT1List)
					}else{
						vm.hasData = false
					}
				})
			},
			//选择时间
			changeDate(){
				vm.historyT1List = undefined
				vm.pageNum = 1
				vm.historyTaddOne()
				console.log(vm.historyT1List)
			},
			// 底部不显示
		    notFot () {
		      this.$emit('listenFot', '3')
		    }
		}
	}
</script>

<style lang='scss' scoped>

	@import "../../assets/css/bus";
	.historyT1{
		.dateT1{
			height:160px;
			background:$themeColor;
			display:flex;
			div{
				position:relative;
				flex:1;
				text-align:center;
				color:#fff;
				
				p{
					line-height:60px;
					padding-top:20px;
				}
				input{
					
					width:240px;
					position:absolute;
					left:0;
					right:0;
					margin:0 auto;
					background:transparent;
					border:1px solid #ccc;
					color:#fff;
					text-align:center;
					z-index:100;
					opacity:0;
				}
				span{
					position:absolute;
					left:0;
					right:0;
					margin:0 auto;
					width:250px;
					height:40px;
					line-height:40px;
					font-size:30px;
					/*border:1px solid #ccc;*/
				}
			}
		}
		.historyT1List{
			.historyT1Tit{
				font-size:28px;
				height:80px;
				line-height:80px;
				border-bottom:1px solid #ccc;
				padding-left:30px;
				.icon{
					float:left;
					margin-top:25px;
					margin-right:10px;
				}
			}
			ul{
				margin:0;
				padding:0;
				li{
					height:120px;
					border-bottom:1px solid #ccc;
					display:flex;
					padding:0 30px;
					align-items: center;
					div{
						flex:1;
						text-align:center;
						color:#282828;
						font-size:24px;
						&:nth-of-type(1){
							text-align:left;
							p{
								&:nth-of-type(1){
									font-size:28px;
								}
								&:nth-of-type(1){
									color:#585858;
								}
							}
						}
						&:nth-of-type(4){
							text-align:right;
						}
						p{
							padding-bottom:6px;
						}
						button{
							width: 120px;
							height: 48px;
							background:transparent;
							border:2px solid $themeColor;
							color:$themeColor;
							outline:0;
							border-radius: 50px;
						}
					}
				}
			}
		}
		.noData{
			img{
				margin-top:300px;
			}
		}
	}
</style>