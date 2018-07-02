
<template>
	<div class='codeAlipay'>
		<div v-show='!alipayCodeShow' class="codePay">
			<p style='text-align:center'>
				当前余额
			</p>
			<p>
				￥{{balance}}
			</p>
			<p>
				充值金额
			</p>
			<p>
				<input v-model='alipayAmount' type="number" />
			</p>
			<p class='last'>
				<button class='button' @click='getAlipayCode' style='background:rgba(243,106,106,1)'>下一步</button>
			</p>
		</div>
		<div v-show='alipayCodeShow' class="codeAlipayCode">
			<p class='first'>￥{{alipayData.money}}</p>
			<p style=''>
				为了能及时到账，请付款 
				<span style='color:rgba(243,106,106,1);font-size:18px;'>{{alipayData.money}}</span> 元
			</p>
			<p class='alipayImg'>
				<img :src="alipayData.qrcode" alt="" />
			</p>
			<div class='endTime'>
				<p>
					<span>{{endTime.min}}分</span>
					<span>{{endTime.sec}}秒</span>
				</p>
			</div>
			<div class='wechantSyS'>
				<p>请使用支付宝扫描二维码支付</p>
			</div>
			<button class='button' @click='alipayApp'>打开支付宝</button>
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
	import { API } from "../../utils/api.js"
	let vm;
	
	export default {
		data() {
			return {
				balance:'',
				alipayAmount:'',
				alipayData:{},
				alipayCodeShow:false,
				endTime:{
					min:'',
					sec:''
				}
			}
		},
		mounted() {
			vm = this;
			vm.userMoneyInfo()
			vm.notFot()
		},
		methods: {
		    //获取当前余额
			userMoneyInfo(){
				API.userMoneyInfo(function(data){
//		    		console.log(data)
		    		if(data.code != 0){
		    			layer.open({
							content: data.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
		    			return
		    		}
		    		vm.balance = data.data.balance
		      	})
			},
			//下一步
			getAlipayCode(){
				let alipayAmount = vm.alipayAmount *100
				if(alipayAmount <= 0){
					layer.open({
						content: '请填写有效的充值金额',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return
				}
				if(alipayAmount%1 != 0){
					layer.open({
						content: '充值金额最多两位小数',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return
				}
				if(alipayAmount.toString().length >= 8){
					layer.open({
						content: '充值金额过大',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return
				}
				API.alipayPay(alipayAmount,function(data){
//					console.log(data)
					if(data.code != 0){
						layer.open({
							content: data.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
		    			return
					}
					vm.alipayData = data.data
					layer.open({
					    content: "为了能及时到账，请付款 <span style='color:orangered;font-size:18px;'>"+vm.alipayData.money+"</span> 元"
					    ,btn: '我知道了'
					    ,yes: function(index){
					      	layer.close(index);
					      	vm.alipayCodeShow = true
					      	vm.getCountDown(vm.alipayData.endTime)
					    }
					});
				})
			},
			//倒计时
			getCountDown(timestamp){
//				console.log($('.codeAlipayCode'))
//				console.log($('.codeAlipayCode')[0].clientHeight)
	            vm.endTimeControll = setInterval(function(){
	                var nowTime = new Date();
	                var endTime = timestamp*1
//					console.log(nowTime,endTime)
	                var t = endTime - nowTime.getTime();
                   	var min=Math.floor(t/1000/60%60);
                   	var sec=Math.floor(t/1000%60);
	    			
	                if (min < 10) {
	                     min = "0" + min;
	                }
	                if (sec < 10) {
	                     sec = "0" + sec;
	                }
	                vm.endTime.min = min
	                vm.endTime.sec = sec
	                if(min<=0 && sec <= 0){
	                	clearInterval(vm.endTimeControll)
	                	layer.open({
						    content: '二维码时间已到期，请重新填写转账金额'
						    ,btn: '我知道了'
						    ,yes: function(index){
						      	layer.close(index);
						      	vm.alipayCodeShow = false
						      	vm.$router.push('codeAlipayPay')
						    }
						});
	                }
	            },1000);
	        },
	        //打开支付宝
			alipayApp(){
				//用返回的跳转地址获取打开支付宝的短连接(后台已处理微信情况)
				API.fetchShorturl(vm.alipayData.qrcodeText,function(data){
//					console.log(data)
					if(data.code != 0){
						layer.open({
							content: '服务器繁忙',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
		    			return
					}
					location.href='/shorturl/' + data.data
//					location.href='http://a.yingqw.com/shorturl/'+data.data
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
	.codeAlipay{
		width:100%;
	}
	.codePay,.codeAlipayCode{
		padding-top:60px;
	}
	.codePay p:not(.last){
		font-size:32px;
		line-height:40px;
	}
	.codePay p{
		padding: 0 30px;
		&:nth-of-type(2){
			margin-top:40px;
			text-align:center;
			color:rgba(243,106,106,1);
			font-size:60px;
		}
		&:nth-of-type(3){
			margin-top:130px;
		}
	}
	.codePay input{
		border-bottom:1px solid #ccc;
		font-size:38px;
		width:100%;
		margin-top:30px;
	}
	.codePay button{
		width:100%;
    	margin-top:80px;
	}
	.codeAlipayCode p{
		font-size:32px;
		text-align:center;
		margin-top:40px;
	}
	.codeAlipayCode p.first{
		font-size:70px;
		color:rgba(243,106,106,1);
	}
	.codeAlipayCode p.alipayImg{
		width:360px;
		height:360px;
		border:1px solid #ccc;
		padding:5px;
		margin:40px auto;
	}
	.codeAlipayCode p img{
		width:360px;
		height:360px;
	}
	.endTime span {
	    display: inline-block;
	    width: 120px;
	    height: 40px;
	    border-radius: 30px;
	    background: #019fe8;
	    color: #fff;
	    font-size:28px;
	    line-height:40px;
	}
	.wechantSyS{
		text-align:center;
		margin-top:80px;
	}
	.codeAlipayCode{
		.button{
			width:calc(100% - 60px);
			margin-left:30px;
			background:#019fe8;
			margin-top:100px;
		}
	}
</style>