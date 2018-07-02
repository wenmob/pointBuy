<template>
	<div class="modifyTradePaw">
		<p class="emptyDiv"></p>
		<p>
			<input type="number"  autocomplete="off" v-model='tel' placeholder='手机号'/>
		</p>
		<p>
			<input  autocomplete="off" v-model='random' placeholder='请输入右侧验证码'/>
			<span>
				<img :src="verificationCode" class="imgCode" @click='UpdateSrc()' />
			</span>
		</p>
		<p>
			<input autocomplete="off" v-model='teTelStr' placeholder='手机验证码'/>
			<span class="getTelStr" @click="confineCode">获取手机验证码</span>
		</p>
		<p>
			<input type='password' v-model='password' autocomplete="off" placeholder='新提现密码'/>
		</p>
		<p>
			<input type='password' v-model='passwordAgain' autocomplete="off" placeholder='确认提现密码'/>
		</p>
		<button @click='changeGo'>确认</button>
		<div>
			联系客服<span>{{headerContent.tel}}</span>
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
				count: 60,
				verificationCode: "/code",
				headerContent: '',
				tel: '',
				random: '',
				password: '',
				passwordAgain: '',
				teTelStr: ''
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
				$('.imgCode').attr('src', vm.verificationCode)
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
							,end:function(){
								//开始倒计时
								vm.countDown();
							}
						});
					}else if(data.code == 6000) {
						layer.open({
							content: data.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
							,end:function(){
								$('.imgCode').attr('src', vm.verificationCode)
							}
						});
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
				$('.getTelStr').text(vm.count + "秒");
				$('.getTelStr').css({
					"pointer-events": "none"
				});
				setTimeout(function() {
					vm.count--;
					if(vm.count == 0) {
						$('.getTelStr').css({
							"pointer-events": "auto"
						});
						$('.getTelStr').text('获取手机验证码');
						vm.count = 60;
						return;
					} else {
						$('.getTelStr').text(vm.count + "秒");
						vm.countDown();
					}
				}, 1000)
			},
			//确认
			changeGo() {
				//如果密码验证成功，再请求数据
				if(!API.phoneNumInput(vm.tel) || !API.checkPassword(vm.password)) {
					return	
				}	
				if(vm.passwordAgain != vm.password) {
					layer.open({
						content: '密码不一致,请重新输入',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
				}
				API.saveResetPayPsw(vm.tel, vm.password, vm.teTelStr, function(data) {
					console.log(data)
					if(data.code == 0) {
						layer.open({
							content: '设置成功',
							skin: 'msg',
							time: 2 //2秒后自动关闭
							,end:function(){
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
			},
			// 底部不显示
		    notFot () {
		      this.$emit('listenFot', '3')
		    },
		}
	}
</script>
<style lang='scss' scoped>
	@import "../../assets/css/inputCom";
	.modifyTradePaw{
		p{
			input{
				width:100%;
			}
			&:nth-of-type(3),
			&:nth-of-type(4),{
				input{
					width:calc(100% - 280px);
				}
			}
		}
		div{
			text-align:center;
			margin-top:40px;
			color:$themeColor;
			font-size:28px;
			span{
				
				margin-left:10px;
			}
		}
	}
	
</style>