
<template>
	<div class='wechantDiv'>
		<div v-show='!wechantCodeShow' class="wechantPay">
			<p style='text-align:center'>
				当前余额
			</p>
			<p style='text-align:center;color:rgba(243,106,106,1);font-size:30px;'>
				￥{{balance}}
			</p>
			<p style='margin-top:50px;'>
				充值金额
			</p>
			<p>
				<input v-model='addMoney' type="number" />
			</p>
			<p class='last'>
				<button class='button' @click='getWechantCode'>下一步</button>
			</p>
		</div>
		<div v-show='wechantCodeShow' class="wechantCode">
			<p class='first'>￥{{wechantData.money}}</p>
			<p style=''>
				为了能及时到账，请付款 
				<span style='color:rgba(243,106,106,1);font-size:18px;'>{{wechantData.money}}</span> 元
			</p>
			<p class='wechantImg'>
				<img :src="wechantData.qrcode" alt="" />
			</p>
			<div class='endTime'>
				<p>
					<span>{{endTime.min}}分</span>
					<span>{{endTime.sec}}秒</span>
				</p>
			</div>
			<div class='wechantSyS'>
				<img src="../../assets/img/wechant.png" alt="" />
				<div>
					<p>请使用微信扫一扫</p>
					<p>扫描二维码完成支付</p>
				</div>
			</div>
		</div>
		
	</div>
</template>

<script>
	import { API } from "../../utils/api.js"
	let vm;
	
	export default {
		data() {
			return {
				balance:'',
				addMoney:'',
				wechantData:{},
				wechantCodeShow:false,
				endTime:{
					min:'',
					sec:''
				}
			}
		},
		mounted() {
			vm = this;
			/*//判断是否是微信，改变wechantDiv高度，从而改变背景颜色
			if(checkWechant()){
				$('.wechantDiv').css({'height':window.innerHeight})
			}else{
				$('.wechantDiv').css({'height':window.innerHeight-40})
			}*/
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
			getWechantCode(){
				let addMoney = vm.addMoney *100
				if(addMoney <= 0){
					layer.open({
						content: '请填写有效的充值金额',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return
				}
				if(addMoney%1 != 0){
					layer.open({
						content: '充值金额最多两位小数',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return
				}
				if(addMoney.toString().length >= 8){
					layer.open({
						content: '充值金额过大',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return
				}
				API.wechantPay(addMoney,function(data){
//					console.log(data)
					if(data.code != 0){
						layer.open({
							content: data.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
		    			return
					}
					vm.wechantData = data.data
					layer.open({
					    content: "为了能及时到账，请付款 <span style='color:orangered;font-size:18px;'>"+vm.wechantData.money+"</span> 元"
					    ,btn: '我知道了'
					    ,yes: function(index){
					    	layer.close(index)
					      	vm.wechantCodeShow = true
					      	vm.getCountDown(vm.wechantData.endTime)
					    }
					});
				})
			},
			//倒计时
			getCountDown(timestamp){
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
						      	vm.wechantCodeShow = false
						    }
						});
	                	
	                }
	            
	            },1000);
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
	.wechantContainer{
		padding:0;
	}
	
	.wechantPay,.wechantCode{
		padding-top:60px;
	}
	.wechantPay p:not(.last){
		font-size:32px;
		line-height:80px;
		margin:20px 0;
	}
	.wechantPay p{
		padding: 0 30px;
	}
	.wechantPay input{
		/*background:transparent;*/
		border-bottom:1px solid #ccc;
		font-size:36px;
		width:100%;
	}
	.wechantDiv button{
		width:100%;
		margin-top:40px;
	}
	.wechantCode p{
		font-size:32px;
		text-align:center;
		margin-top:40px;
	}
	.wechantCode p.first{
		font-size:78px;
		color:rgba(243,106,106,1);
	}
	.wechantCode p.wechantImg{
		width:360px;
		height:360px;
		border:1px solid #ccc;
		padding:5px;
		margin:40px auto;
	}
	.wechantCode p img{
		width:360px;
		height:360px;
	}
	.endTime span {
	    display: inline-block;
	    width: 100px;
	    height: 40px;
	    line-height:40px;
	    border-radius: 20px;
	    background: limegreen;
	    color: #fff;
	    font-size:26px;
	}
	.wechantSyS{
		text-align:center;
		margin-top:60px;
		position:relative;
	}
	.wechantSyS img{
		position:absolute;
		width:120px;
		height:120px;
	}
	.wechantSyS div{
		display:inline-block;
		margin-left:150px;
	}
	.wechantSyS p{
		margin:0;
		line-height:60px;
		flat:left;
		text-align:left;
		font-size:30px;
	}
	
</style>