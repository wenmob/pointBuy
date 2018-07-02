
<template>
	<div id="changePassword">
		<div class="emptyDiv"></div>
		<div class="changePassword-td1" @keyup.enter='changeGo'>
			<div class="changePassword-d1">
				<input type="text" class="changePassword-d1-in1" autocomplete="off" v-model='tel' placeholder="手机号" />
			</div>
			<div class="changePassword-d1">
				<input type="text" class="changePassword-d1-in2" autocomplete="off" v-model='random' placeholder="请输入右侧验证码" />
				<img v-bind:src="verificationCode" class="changePassword-d1-m1" @click='UpdateSrc()' />
				<div style="clear: both"></div>
			</div>
			<div class="changePassword-d1">
				<input type="text" class="changePassword-d1-in2" autocomplete="off" v-model='teTelStr' placeholder="手机验证码" />
				<a class="changePassword-d1-a1" @click="confineCode">获取手机验证码</a>
				<div style="clear: both"></div>
			</div>
			<div class="changePassword-d1">
				<input type="password" class="changePassword-d1-in1" autocomplete="new-password" v-model='password' placeholder="新密码" />
			</div>
			<div class="changePassword-d1" style="border-bottom-style: none">
				<input type="password" class="changePassword-d1-in1" autocomplete="new-password" v-model='passwordAgain' placeholder="确认新密码" />
			</div>
		</div>
		<!--确认按钮-->
		<div class="changePassword-submit">
			<a @click='changeGo'>确认</a>
		</div>
		<p class="changePassword-b-s1">联系客服：{{headerContent.tel}}</p>
	</div>
</template>
<script>
	import $ from 'jquery'
	import { API } from "../../utils/api.js"
	let vm;

	export default {
		data() {
			return {
				count: 60,
				verificationCode: "/code",
				headerContent: '',
				tel: '',
				random: '',
				password: '',
				passwordAgain: '',
				teTelStr: '',
				type: 'login'
			}
		},

		mounted() {
			vm = this;
			vm.getCall();
			vm.notFot()
		},
		methods: {
			/*获取电话数据*/
			getCall() {
				API.getCommon(function(data) {
					//					console.log(data.data);
					vm.headerContent = data.data;
				})
			},
			//更新随机验证码
			UpdateSrc() {
				$('.changePassword-d1-m1').attr('src', vm.verificationCode)
			},
			//获取手机验证码点击事件
			confineCode() {
				vm.getTelRandom();
			},

			//获取手机验证码
			getTelRandom() {
				//如果手机号验证成功，再请求发送短信验证码
				if(!API.phoneNumInput(vm.tel)) {
					return
				}
				API.get_sms_code(vm.tel, 2, vm.random, function(data) {
					//	            console.log(data)
					if(data.code == 0) {
						layer.open({
							content: '验证码发送成功',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
						//开始倒计时
						vm.countDown();
					} else if(data.code == 604) {
						layer.open({
							content: '未绑定该手机号,请先绑定',
							skin: 'msg',
							time: 2 //2秒后自动关闭
							,end: function(index) { 
								vm.$router.push({
									path: 'changMobile'
								})
							}
						});

					} else if(data.code == 6000) {
						layer.open({
							content: data.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
						$('.changePassword-d1-m1').attr('src', vm.verificationCode)

					} else {
						layer.open({
							content: data.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
				})
			},
			//倒计时
			countDown() {
				$('.changePassword-d1-a1').text(vm.count + "秒");
				$('.changePassword-d1-a1').css({
					"pointer-events": "none"
				});
				setTimeout(function() {
					vm.count--;
					if(vm.count == 0) {
						$('.changePassword-d1-a1').css({
							"pointer-events": "auto"
						});
						$('.changePassword-d1-a1').text('获取手机验证码');
						vm.count = 60;
						return;
					} else {
						$('.changePassword-d1-a1').text(vm.count + "秒");
						vm.countDown();
					}
				}, 1000)
			},
			//确认
			changeGo() {
				//如果密码验证成功，再请求数据
				if(API.phoneNumInput(vm.tel) && API.checkPassword(vm.password)) {
					if(vm.passwordAgain == vm.password) {
						API.changeLoginPaw(vm.type, vm.tel, vm.password, vm.teTelStr, function(data) {
							console.log(data)
							if(data.code == 0) {
								layer.open({
									content: '设置成功',
									skin: 'msg',
									time: 2 //2秒后自动关闭
									,end: function(index) { 
										vm.$router.go(-1);
									}
								});
							} else if(data.code == 700) {
								layer.open({
									content: '您还未注册',
									skin: 'msg',
									time: 2 //2秒后自动关闭
								});
							} else {
								layer.open({
									content: data.msg,
									skin: 'msg',
									time: 2 //2秒后自动关闭
								});
							}

						})
					} else {
						layer.open({
							content: '密码不一致,请重新输入',
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}

				}

			},
			// 底部不显示
		    notFot () {
		      this.$emit('listenFot', '3')
		    },
		}
	}
</script>
<style scoped lang='scss'>
	@import "../../assets/css/bus";
	#changePassword {
		position: relative;
		width: 100%;
	}
	
	.changePassword-td1 {
		position: relative;
		background-color: white;
		border-bottom: 1px solid #E8E8E8;
	}
	
	.changePassword-d1 {
		position: relative;
		padding:0 30px;
		height: 100px;
		border-bottom: 1px solid #E8E8E8;
		line-height:100px;
	}
	
	.changePassword-d1-in1 {
		width: 100%;
		font-size:28px;
		/*line-height: 80px;*/
		/*border:1px solid #ccc;*/
	}
	.changePassword-d1-in2 {
		width: calc(100% - 320px);
		font-size: 0.402rem;
	}
	
	.changePassword-d1-a1 {
		float: right;
		color: #E58487;
		font-size: 28px;
		line-height: 100px;
		display: inline-block;
	}
	
	.changePassword-submit{
		padding:0 30px;
		a{
			display: block;
			height: 88px;
			background-color: #F46A6A;
			text-align: center;
			line-height: 88px;
			font-size: 32px;
			color: white;
			border-radius: 10px;
			margin-top: 0.8rem;
		}
	} 
	
	.changePassword-b-s1 {
		font-size: 28px;
		color: $themeColor;
		margin-top: 30px;
		text-align:center;
	}
	
	.changePassword-d1-m1 {
		float: right;
		width: 180px;
		height: 60px;
		margin-top: 20px;
	}
</style>