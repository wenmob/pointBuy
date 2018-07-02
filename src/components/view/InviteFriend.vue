<template>
	<div class="inviteFriend">
		<div class="spread" id="spread">
			<p>邀请小伙伴来赚钱啦！</p>
			<div class="spread-code" id="qrcode">

			</div>
		</div>
		<div class="friendList" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
			<p>
				<span>手机号</span>
				<span>注册时间</span>
			</p>
			<p v-if='hasContent' v-for='item in MyusersInfo'>
				<span>{{item.mobile}}</span>
				<span>{{item.dateAdd.split(' ')[0]}}1</span>
			</p>
		</div>
		<div v-if='!hasContent' class='kindInfo'>
			<p>您还没有小伙伴,快去分享吧</p>
		</div>
	</div>
</template>
<script>
	//引入mint-ui的loading图效果
	import { Indicator } from 'mint-ui';

	import $ from 'jquery'
	import QRCode from 'qrcodejs2';
	import { API } from "../../utils/api.js"
	let vm;

	export default {
		data() {
			return {
				MyusersInfo: [],
				totalPage:1,
				userId: '',
				spreadUrl: '',
				pageNum: 1,
				hasContent: true,
				loading:false

			}
		},
		mounted() {
			vm = this;
			vm.notFot()
		},
		methods: {
			//加载更多
			loadMore() {
				console.log(vm.pageNum)
				vm.loading = true;//禁止执行滚动事件
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
				  	text: 'Loading...',
				  	spinnerType: 'fading-circle'
				});
				vm.startBaseMyusers()
				vm.pageNum ++;
			  	setTimeout(() => {
    				Indicator.close();//loading图消失
    				vm.loading = false;
			  	}, 200);
			},
			//生成二维码
			_getQart: function() {
				let qrcode = new QRCode(document.getElementById("qrcode"), {
					width: 150, //设置宽高
					height: 150
				});
				qrcode.makeCode(vm.spreadUrl);
			},
			//第一次进界面渲染的问题
			startBaseMyusers() {
				API.baseMyusers(vm.pageNum, 9, function(data) {
					//    		console.log(data)
					if(data.code == 0) {
						
						vm.totalPage = data.data.totalPage
						let arrayDatas = data.data.result;
						arrayDatas.forEach(function(elem) {
							vm.MyusersInfo.push(elem);
						});
					} else if(data.code == 700) { //无数据
						vm.hasContent = false;
					} else {
						return;
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
	.inviteFriend{
		.spread {
			width: 100%;
			height:550px;
			p {
				width: 100%;
				text-align: center;
				font-size: 36px;
				padding-top:100px;
			}
			.spread-code {
				width: 300px;
				height: 300px;
				border-radius: 0.27rem;
				margin-right: auto;
				margin-left: auto;
				margin-top: 0.54rem;
				img {
					width: 300px;
					height: 300px;
					border: none;
				}
			}
		}
		.friendList{
			/*position:absolute;*/
			width:100%;
			border-top:1px solid #eee;
			border-bottom:1px solid #eee;
			margin-top:70px;
			height:100%;
			overflow-y: auto;
			/*z-index:909990;*/
			p{
				font-size:32px;
				// overflow:hidden;
				height:100px;
				border-bottom:1px solid #eee;
				line-height:100px;
				margin:0 30px;
				&:last-child{
					border:0;
				}
				span{
					&:first-child{
						float:left;
						color: #282828;
					}
					&:last-child{
						float:right;
						color: #9F9F9F;
					}
				}
			}
		}
		.kindInfo{
			p {
				text-align: center;
				font-size: 0.5rem;
				color: #989898;
				margin-top: 2rem;
			}
		}
	}
</style>
