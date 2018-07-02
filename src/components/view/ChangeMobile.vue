<template>
	<div class="checkMobileContainer" @keyup.enter='goChange'>
		<p class="emptyDiv"></p>
		<p>
			<label for="mobile">新&nbsp;手&nbsp;机&nbsp;&nbsp;号</label>
			<input v-model='tel' type="number" autocomplete="off" id='mobile' />
		</p>
		<p>
			<label for="random">验&nbsp;&nbsp;&nbsp;&nbsp;证&nbsp;&nbsp;&nbsp;码</label>
			<input v-model='random' type="number" autocomplete="off" id='random' />
			<span @click='UpdateSrc'>
				<img class='imgCode' :src="verificationCode" alt="" />
			</span>
		</p>
		<p>
			<label for="telCode">手机验证码</label>
			<input v-model='telStr' autocomplete="off" id='telCode' />
			<span @click='UpdateTelStr' class='getTelCode'>获取手机验证码</span>
		</p>
		<p>
			<label for="password">登录密码</label>
			<input v-model='password' type="password" autocomplete="off" id='password' />
		</p>
		<button @click='goChange'>确认</button>
	</div>
</template>

<script>
	import $ from 'jquery'
	import {API} from "../../utils/api.js"
	let vm;

	export default {
		data() {
			return {
				verificationCode:'/code',
				tel:'',
				random:'',
				telStr:'',
				password:'',
				count:60
			}
		},
		mounted() {
			vm = this;
			vm.notFot()
		},
		methods: {
			//更新随机验证码
			UpdateSrc() { 
				$('.imgCode').attr('src', vm.verificationCode)
			},
			//更新短信验证码
			UpdateTelStr() { 
				//如果手机号验证成功，再请求发送短信验证码
				if(API.phoneNumInput(vm.tel)) {
					API.get_sms_code(vm.tel, 1, vm.random, function(data) {
						console.log(data)
						if(data.code == 0) {
							layer.open({
							    content: '验证码发送成功'
							    ,skin: 'msg'
							    ,time: 2 //2秒后自动关闭
							    ,end: function(index){
								    //开始倒计时
									vm.countDown();
							    }
							});
							
						} else if(data.code == 6000) {
							layer.open({
							    content: '图形验证码错误'
							    ,skin: 'msg'
							    ,time: 2 //2秒后自动关闭
							    ,end: function(index){
								   $('.imgCode').attr('src', vm.verificationCode) //刷新验证码
							    }
							});
							
						} else {
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
				$('.getTelCode').text(vm.count + "秒");
				$('.getTelCode').css({
					"pointer-events": "none"
				});
				setTimeout(function() {
					vm.count--;
					if(vm.count == 0) {
						$('.getTelCode').css({
							"pointer-events": "auto"
						});
						$('.getTelCode').text('获取手机验证码');
						vm.count = 60;
						return;
					} else {
						$('.getTelCode').text(vm.count + "秒");
						vm.countDown();
					}
				}, 1000)
			},
			//确认更换/绑定
			goChange() {
				console.log('1111')
				if(!API.phoneNumInput(vm.tel) || !API.checkPassword(vm.password)) {
					console.log('222')
					return
				}
				
				if(vm.telStr == ''){
					layer.open({
					    content: '请输入短信验证码'
					    ,skin: 'msg'
					    ,time: 2 //2秒后自动关闭
					});
					return
				}
				console.log('333')
					API.changePhone(vm.tel, vm.password, vm.telStr, function(data) {
//						console.log(data)
						if(data.code == 0) {
							layer.open({
							    content: '绑定成功'
							    ,skin: 'msg'
							    ,time: 2 //2秒后自动关闭
							    ,end: function(index){
								    vm.$router.go(-1);
							    }
							});
						} else if(data.code == 600) {
							layer.open({
							    content: '信息不完善'
							    ,skin: 'msg'
							    ,time: 2 //2秒后自动关闭
							});
						} else {
							layer.open({
							    content: data.msg
							    ,skin: 'msg'
							    ,time: 2 //2秒后自动关闭
							});
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
	@import '@/assets/css/bus.scss';
	.checkMobileContainer {
		p:not(.emptyDiv) {
			height: 100px;
			border-bottom: 1px solid #eee;
			padding: 0 30px;
			line-height: 100px;
			font-size: 28px;
			label {
				display: inline-block;
				width: 150px;
			}
			&:nth-of-type(2),
			&:nth-of-type(5) {
				input {
					width: calc(100% - 190px);
				}
			}
			&:nth-of-type(3),
			&:nth-of-type(4) {
				input {
					width: calc(100% - 410px);
				}
			}
			input {
				/*border:1px solid #ccc;*/
			}
			span {
				float: right;
				color: $themeColor;
				display: inline-block;
				width: 200px;
				height: 100px;
				text-align:center;
				img {
					width: 100%;
					margin-top: 5px;
				}
			}
		}
		button {
			width: calc(100% - 60px);
			margin-left: 30px;
			margin-top: 30px;
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