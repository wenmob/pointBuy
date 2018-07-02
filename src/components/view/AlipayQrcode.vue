
<template>
	<div class="alipayQrcode">
		<div id="boundDiv" class='boundDiv'>
		</div>
		<button v-if='btnShow' @click='goAlipay' class="btn-go">打开支付宝</button>
	</div>
</template>

<script>
	import { API } from "../../utils/api.js"
	import QRCode from 'qrcodejs2';
	let vm;
	
	export default {
		data() {
			return {
				spreadUrl:'',
				btnShow:false,
				type:''
			}
		},
		
		mounted() {
			vm = this;
			vm.notFot()
			let type = vm.$route.query.type;
			if(type && type == 'pay' ){
				vm.type = 'pay'
			}else{
				vm.type = ''
			}
			vm.alipayBoundCode()
		},
		methods: {
			//生成二维码
		      _getQart() {
		          let qrcode = new QRCode(document.getElementById("boundDiv"), {
		            width : 200,//设置宽高
		            height : 200
		          });
		          qrcode.makeCode(vm.spreadUrl);
		      },
		      //获取付款码
			alipayBoundCode(){
				API.alipayBoundCode(vm.type,function(data){
//		    		console.log(data)
		    		if(data.code != 0){
		    			layer.open({
							content: '当前排队人数较多,请稍候',
							skin: 'msg',
							time: 2 //2秒后自动关闭
							,end:function(){
								vm.$router.go(-1)
							}
						});
		    			return
		    		}
		    		vm.btnShow = true;
		    		vm.spreadUrl = data.data
		    		vm._getQart()
		      	})
			},
			//打开支付宝
			goAlipay(){
				//用返回的跳转地址获取打开支付宝的短连接(后台已处理微信情况)
				API.fetchShorturl(vm.spreadUrl,function(data){
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
	.alipayQrcode{
		#boundDiv{
			width:400px;
			height:400px;
			margin:0 auto;
			margin-top:150px;
			
		}
		button{
			width:calc(100% - 60px);
			margin-left: 30px;
			margin-top: 100px;
			height: 88px;
			background: $themeColor;
			color: #fff;
			border: 0;
			border-radius: 10px;
			font-size: 32px;
			outline:0;
		}
	}
</style>