<template>
	<div class="historyTD"
		v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" 
		infinite-scroll-distance='50'>
		<div v-for="(item,index) in historyTD" v-if='hasData' class="detail">
			<div class="emptyDiv"></div>
			<div class='tit'>
				<icon class="icon" name='clock' scale='1.5'></icon>
				<span>{{item.dateAdd.split(' ')[0]}}-{{item.settleTime?item.settleTime.split(' ')[0]:''}}</span>
				<router-link :to="'strategyList?id='+item.id+'&orderNumber='+item.orderNumber" tag='button'>查看</router-link>
			</div>
			<ul>
				<li>
					<P>
						策略金额
					</P>
					<P>
						{{item.operateAmount!=undefined?item.operateAmount.toFixed(2):'-'}}
					</P>
				</li>
				<li>
					<P>
						履约保证金
					</P>
					<P>
						{{item.deposit!=undefined?(item.deposit+item.supplyDeposit).toFixed(2):'-'}}
					</P>
				</li>
				<li>
					<P>
						总盈亏
					</P>
					<P>
						<em>{{item.settleProfit!=undefined?item.settleProfit.toFixed(2):'-'}}</em>
					</P>
				</li>
				<li>
					<P>
						递延费
					</P>
					<P>
						{{item.continueFeeTotal!=undefined?item.continueFeeTotal.toFixed(2):'-'}}
					</P>
				</li>
			</ul>
		</div>
		<!--年份选择显示-->
		<div class="dateFooter">
			<!--<input type="date" @change='changeYear' v-model='year'/>-->
			<div v-show="yearShow">
				<p>
					<em @click="yearShow = false">取消</em>
					<em @click="yearShow = false;year = newVal;pageNum=1;historyTaddD()">确定</em>
				</p>
				<mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
			</div>
			<span @click="yearShow = true">{{year}}年</span>
		</div>
		<!--无数据状态-->
		<div v-if='!hasData' class="noData">
			<img src="../../assets/img/nodata1.jpg" alt="" />
			<p>暂无已完成的策略</p>
		</div>
	</div>
</template>

<script>
	import Icon from 'vue-svg-icon/Icon.vue'
	import { API } from "../../utils/api.js"
	let vm;
	
	import { Indicator } from 'mint-ui';
	
	export default{
		data() {
			return {
				hasData:false,
				newVal:'',
				year:'',
				pickerVisible:'',
				dateAddBegin:'',
				dateAddEnd:'',
				pageNum:1,
				pageSize:1,
				historyTD:[],
				loading:false,
				yearShow:false,
				startYear : 2018,
				slots: [
			        {
			          values: [],
			          className: 'slot1',
			          textAlign: 'right'
			        }
			    ]
			}
		},
		components: {
			Icon

		},
		mounted() {
			vm = this;
			vm.notFot()
//			vm.historyTaddD()
//			vm.getSeachDate()
			vm.getyearArr()
			vm.year = new Date().getFullYear()
			
		},
		methods: {
			//获取选中的年份
			onValuesChange(picker, value) {
				this.newVal = value[0]
//				console.log(this.year)
			},
			//根据当前年份获取可选的年份数组
			getyearArr(){
				let nowYear = new Date().getFullYear()+3	/*new Date().getFullYear()*/
				if(nowYear >= vm.startYear){
					vm.slots[0].values.push(vm.startYear)
					vm.startYear++
//					 console.log(vm.slots[0].values)
					 vm.getyearArr()
				}
				
			},
			//加载更多
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
				vm.historyTaddD()
				vm.pageNum ++;
			  	setTimeout(() => {
    				Indicator.close();//loading图消失
			    	this.loading = false;//允许执行滚动事件
			  	}, 200);
			},
		   	//获取历史列表
		   	historyTaddD(){
		   		API.historyTaddD(vm.year,vm.pageNum,vm.pageSize,function(res){
		   			if(res.code == 0 && res.data.result.length>0){
		   				vm.hasData = true
		   				vm.historyTD = res.data.result
		   			}else{
		   				vm.hasData = false
		   			}
		   		})
		   	},
		   	// 底部不显示
		    notFot () {
		      this.$emit('listenFot', '3')
		    }
			/*//获取默认的搜索时间
			getSeachDate(){
				let date = new Date()
				vm.year = date.getFullYear()
			},
			changeYear(){
				console.log(vm.year)
				vm.year = vm.year.split('-')[0]
			},*/
		}
	}
</script>

<style lang='scss' scoped>
	@import "../../assets/css/bus";
	.historyTD{
		position:absolute;
		height:calc(100% - 84px);
		overflow-y:auto;
		.detail{
			div:not(.emptyDiv){
				padding:0 30px;
				height:80px;
				line-height:80px;
				font-size:24px;
				color:#585858;
				border-bottom:1px solid #eee;
				.icon{
					float:left;
					margin-right:5px;
					margin-top:28px;
				}
				span{
					color:#585858;
					
				}
				button{
					float:right;
					width:120px;
					height:48px;
					background:transparent;
					outline:0;
					border:2px solid $themeColor;
					color:$themeColor;
					border-radius:30px;
					margin-top:14px;
				}
			}
			ul{
				width:calc(100% - 60px);
				margin:0;
				padding:20px 30px;
				display:flex;
				flex-wrap: wrap;
				li{
					width:33.3%;
					line-height:40px;
					padding-top:10px;
					color:#585858;
				}
			}
		}
		.dateFooter{
			position:fixed;
			bottom:0;
			width:100%;
			height:100px;
			background:rgba(0,0,0,.5);
			line-height:100px;
			/*input{
				position:absolute;
				top:0;
				background:transparent;
				border:1px solid #ccc;
				width:100%;
				height:100px;
				text-align:center;
				z-index:2000;
				opacity:0;
			}*/
			div{
				position:fixed;
				bottom:0;
				width:100%;
				height:100%;
				background:rgba(0,0,0,.5);
				/*display:none;*/
				p{
					position:absolute;
					width:100%;
					bottom:460px;
					height:100px;
					display:flex;
					align-items: center;
					border-top:1px solid $borderColor;
					background:#fff;
					em{
						flex:1;
						text-align:center;
						color:$blueColor;
						&:first-child{
							/*border-right:1px solid $*/
						}
					}
				}
				.picker{
					position:absolute;
					bottom:100px;
					width:100%;
					height:360px;
					border-top:1px solid $borderColor;
					background:#fff;
					/*.picker-item.picker-selected{
						color:$blueColor !important;
						border:1px solid #eee;
					}*/
				}
			}
			span{
				position:absolute;
				bottom:0;
				width:100%;
				height:100px;
				font-size:36px;
				color:$themeColor;
				box-sizing:border-box;
				border-top:1px solid $borderColor;
				text-align:center;
				background:#fff;
			}
		}
		.noData{
			img{
				margin-top:300px;
			}
		}
	}
	
</style>