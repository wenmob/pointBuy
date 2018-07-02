<template>
	<div class="registerContainer">
		<p class='emptyDiv'></p>
		<p>
			<input v-model='tel' autocomplete="off" type="number" placeholder='请输入手机号'/>
		</p>
		<p>
			<input v-model='random' autocomplete="off" type="number" placeholder='请输入右侧验证码'/>
			<span><img @click="changeCode" class='imgCode' :src="imgCode" alt="" /></span>
		</p>
		<p>
			<input v-model='teTelStr' autocomplete="off" type="number" placeholder='请输入短信验证码'/>
			<span class='getTelStr' @click='UpdateTelStr'>获取短信验证码</span>
		</p>
		<p>
			<input v-model='password' autocomplete="off" type="password" placeholder='请输入密码'/>
		</p>
		<p v-if="referrerType == 'sm'">
			<input v-model='referrerId' type="text" placeholder='请输入机构代码'/>
		</p>
			<button @click='Go'>注  册</button>
		<div>
			联系客服：{{headerContent.tel}}
		</div>
	</div>
</template>

<script>
	import $ from 'jquery'
	import {API} from "../../utils/api.js"
	let vm;
	export default{
		data(){
			return{
				imgCode:'/code',
				headerContent:{},
				tel:'',
		        password:'',
		        random:'',
		        teTelStr:'',
		        count:60,
		        redirect:'',
		        referrerType:'',
		        referrerId:''//机构代码
			}
		},
		mounted(){
			vm = this;
			if(vm.$route.query.redirect){
				vm.redirect = vm.$route.query.redirect
			}
			vm.getCall();
			vm.notFot()
		},
		methods:{
			//刷新验证码
			changeCode(){
				$('.imgCode').attr('src',vm.imgCode)
			},
			/*获取电话数据*/
	    	getCall(){
				API.getCommon(function(res){
	//					console.log(data.data);
					vm.headerContent = res.data;
					if(vm.headerContent.regUseSellerid){
						vm.referrerType = 'sm'
					}else{
						vm.referrerType = ''
					}
				})
	    	},
	    	UpdateTelStr(){//更新短信验证码
				//如果手机号验证成功，再请求发送短信验证码
				if(API.phoneNumInput(vm.tel)){
					API.get_sms_code(vm.tel,1,vm.random,function(data){
//						console.log(data)
						if(data.code == 0){
							layer.open({
							    content: '验证码发送成功'
							    ,skin: 'msg'
							    ,time: 2 //2秒后自动关闭
							});
							//开始倒计时
							vm.countDown();
						}else if(data.code == 6000){
							layer.open({
							    content: '图形验证码错误'
							    ,skin: 'msg'
							    ,time: 2 //2秒后自动关闭
							});
							vm.changeCode()//刷新验证码
						}else if(data.code == 605){
							layer.open({
							    content: '手机号已注册，请登录'
							    ,skin: 'msg'
							    ,time: 2 //2秒后自动关闭
							    ,end: function(index){
								    vm.$router.push({path:'/login',query:{redirect:vm.redirect}});
							    }
							});
						}else{
							layer.open({
							    content: data.msg
							    ,skin: 'msg'
							    ,time: 2 //2秒后自动关闭
							});
						}
					})
				}
			},
	      //倒计时
	      countDown() {
	        $('.getTelStr').text(vm.count+"秒");
	        $('.getTelStr').css({"pointer-events":"none"});
	        setTimeout(function () {
	          vm.count--;
	          if(vm.count == 0){
	            $('.getTelStr').css({"pointer-events":"auto"});
	            $('.getTelStr').text('获取手机验证码');
	            vm.count = 60;
	            return;
	          }else {
	            $('.getTelStr').text(vm.count+"秒");
	            vm.countDown();
	          }
	        },1000)
	      },
	      Go(){
				//如果手机号和密码验证成功，再请求数据
				if(API.phoneNumInput(vm.tel) && API.checkPassword(vm.password)){
					if(vm.teTelStr == ''){
						layer.open({
						    content: '请输入短信验证码'
						    ,skin: 'msg'
						    ,time: 2 //2秒后自动关闭
						});
						return
					}
					if(vm.referrerType == 'sm' && vm.referrerId == ''){
						layer.open({
						    content: '请输入机构代码'
						    ,skin: 'msg'
						    ,time: 2 //2秒后自动关闭
						});
						return
					}
					API.getRegister(vm.tel,'',vm.password,vm.teTelStr,0,vm.referrerType,vm.referrerId,function(data){
//							console.log(data)
							if(data.code == 0){
								layer.open({
								    content: '注册成功，请登录'
								    ,skin: 'msg'
								    ,time: 2 //2秒后自动关闭
								    ,end: function(index){
									    vm.$router.push({path:'/login',query:{redirect:vm.redirect}});
								    }
								});
							}else if(data.code == 30000){
								layer.open({
								    content: '手机号已注册，请登录'
								    ,skin: 'msg'
								    ,time: 2 //2秒后自动关闭
								    ,end: function(index){
									    vm.$router.push({path:'/login',query:{redirect:vm.redirect}});
								    }
								});
							}else{
								layer.open({
								    content: data.msg
								    ,skin: 'msg'
								    ,time: 2 //2秒后自动关闭
								});
							}
					})
				}
			},
			// 底部不显示
		    notFot () {
		      this.$emit('listenFot', '3')
		    }
		}
	}
</script>

<style lang='scss' scoped>
	@import "../../assets/css/inputCom";
	.registerContainer{
		font-size:30px;
		p{
			/*position:relative;
			height:100px;
			line-height:100px;
			padding:0 30px;
			border-bottom:1px solid #eee;
			&:first-child{
				height:20px;
				box-shadow: 0 -2px 4px #282828;
			}
			&:nth-of-type(7){
				margin-top:20px;
			}
			&:last-child{
				text-align:center;
				color:$themeColor;
			}*/
			&:nth-of-type(3),&:nth-of-type(4){
				input{
					width:calc(100% - 280px);
				}
			}
			input{
				width:calc(100% - 60px);
				/*border:0;
				padding-left:30px;
				outline:0;*/
			}
			/*button{
				width:100%;
				background:$themeColor;
				color:#fff;
				height:88px;
				border:0;
				outline:0;
				border-radius:10px;
			}
			span{
				display:inline-block;
				width:200px;
				height:100px;
				float:right;
				color:$themeColor;
				text-align:center;
				img{
					width:100%;
					height:80px;
					margin-top:10px;
					
				}
			}*/
			
		}
		div{
			color:$themeColor;
			text-align:center;
			margin-top:20px;
		}
	}
</style>