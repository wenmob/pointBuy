<template>
	<div class="noticeList">
		<ul v-if="hasData">
			<router-link :to="'noticeDetail?id='+item.id" tag='li' v-for='(item,index) in noticeData' :key='index'>
				<span>
					{{item.title}}&nbsp;&nbsp;&nbsp;( {{item.date}} )
				</span>
				<span>
					{{item.time}}
				</span>
			</router-link>
		</ul>
		<div v-show="!hasData" class="noData">
			<img src="../../assets/img/nodata1.jpg" alt="" />
			<p>暂无资金记录</p>
		</div>
	</div>
</template>

<script>
	import { API } from "../../utils/api.js"
	let vm;
	
	export default{
		data(){
			return{
				hasData:false,
				noticeData:[]
			}
		},
		mounted(){
			vm = this;
			vm.notFot()
			vm.getNotice()
		},
		methods:{
			//获取公告面板的内容
			getNotice() {
				API.getNotice(1, 1, 1, function(data) {
					//	       	console.log(data)
					if(data && data.code == 0) {
						vm.hasData = true
						vm.noticeData = data.data;
						vm.noticeData.forEach(function(item){
							let month = item.dateAdd.split(' ')[0].split('-')[1]
							let day = item.dateAdd.split(' ')[0].split('-')[2]
							item.date = month + '月' + day + '日'
							item.time = item.dateAdd.split(' ')[1].split(':')[0]+':'+item.dateAdd.split(' ')[1].split(':')[1]
						})
					}else{
						vm.hasData = false
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
	.noticeList{
		ul{
			margin:0;
			padding:0;
			li{
				height:100px;
				line-height:100px;
				border-bottom:1px solid #eee;
				margin-left:30px;
				padding-right:30px;
				/*padding:0 30px;*/
				font-size:28px;
				span{
					&:first-child{
						display:inline-block;
						width:500px;
						overflow:hidden;
					    text-overflow:ellipsis;
					    white-space:nowrap
					}
					&:last-child{
						font-size:26px;
						color:#989898;
						float:right;
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