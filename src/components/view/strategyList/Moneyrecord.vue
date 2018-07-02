<template>
	<div>
		<div class="moneyrecord" v-show="hasData"
			v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" 
			infinite-scroll-distance='10'>
			<p v-for="(item,index) in userMoney">
				<span>{{item.typeStr}}</span>
				<span>{{item.dateAdd}}</span>
				<span><em>{{item.balance!=undefined?item.balance.toFixed(2):'-'}}</em>元</span>
			</p>
		</div>
		<div v-show="!hasData" class="noData">
			<img src="../../../assets/img/nodata1.jpg" alt="" />
			<p>暂无资金记录</p>
		</div>
	</div>
	
</template>

<script>
	import { API } from "../../../utils/api.js"
	let vm;
	import { Indicator } from 'mint-ui';
	
	export default{
		data() {
			return {
				pageNum:1,
				pageSize:3,
				userMoney:[],
				totalPage:1,
				loading:false,
				hasData:false
			}
		},
		
		mounted() {
			vm = this;
		},
		methods: {
			//资金明细
			userMoneyCashLog(){
				API.userMoneyCashLog(vm.$route.query.orderNumber,'',vm.pageNum,vm.pageSize,function(res){
					if(res.code == 0 ){
						vm.hasData = true
						vm.userMoney  = res.data.result
						vm.totalPage = res.data.totalPage
					}else{
						vm.hasData = false
					}
				})
			},
			loadMore() {
				console.log(vm.pageNum)
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
				console.log('3333333333')
			 	//loading图出现
			  	Indicator.open({
				  	text: '加载更多',
				  	spinnerType: 'fading-circle'
				});
				vm.userMoneyCashLog()
				vm.pageNum ++;
			  	setTimeout(() => {
    				Indicator.close();//loading图消失
			    	this.loading = false;//允许执行滚动事件
			  	}, 200);
			 
    			
			},
		},
	}
</script>

<style lang='scss' scoped>
	@import "../../../assets/css/bus";
	.moneyrecord{
		position:absolute;
		width:100%;
		height:100%;
		overflow-y:auto;
		p{
			height:90px;
			border-bottom:1px solid #ccc;
			line-height:90px;
			padding:0 30px;
			span{
				display:inline-block;
				/*width:calc((100% - 160px)/2);*/
				&:first-child{
					width:150px;
				}
				&:last-child{
					float:right;
				}
				&:nth-of-type(2){
					width:320px;
					float:right;
					text-align:right;
				}
			}
		}
	}
	.noData{
		img{
			margin-top:250px;
		}
	}
</style>