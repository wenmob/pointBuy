<template>
	<div class="modifyLoginPaw" @keyup.enter='changeLoginPaw'>
		<p class='emptyDiv'></p>
		<p>
			<label for="oldPaw">原登录密码</label>
			<input type="password" id='oldPaw' v-model='oldPaw' autocomplete="new-password" />
		</p>
		<p>
			<label for="newPaw">新登录密码</label>
			<input type="password" id='newPaw' v-model='newPaw' autocomplete="new-password" />
		</p>
		<p>
			<label for="newPawAgain">确&nbsp;认&nbsp;密&nbsp;码</label>
			<input type="password" id='newPawAgain' v-model='newPawAgain' autocomplete="new-password" />
		</p>
		<button @click='changeLoginPaw'>确认</button>
	</div>
</template>
<script>
	import { API } from "../../utils/api.js"
	let vm;
	
	export default {
		data() {
			return {
				oldPaw: '',
				newPaw: '',
				newPawAgain: ''
			}
		},
		mounted() {
			vm = this;
			vm.notFot()
		},
		methods: {
			changeLoginPaw() {
				if(!API.checkPassword(vm.oldPaw) || !API.checkPassword(vm.newPaw)) {
					return
				}
				if(vm.newPaw != vm.newPawAgain) {
					layer.open({
						content: '新密码不一致',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return
				}
				API.updateLoginPsw(vm.oldPaw, vm.newPaw, function(data) {
					console.log(data)
					if(data.code != 0) {
						layer.open({
							content: data.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}
					layer.open({
						content: '密码修改成功',
						skin: 'msg',
						time: 2 //2秒后自动关闭
						,end:function(){
							//退出登录,并跳转至登录页面
							API.userLoginOut(function(data) {
								if(data.code != 0){
									layer.open({
										content: data.msg,
										skin: 'msg',
										time: 2 //2秒后自动关闭
									});
									return
								}
								vm.$router.push({
									path: 'login',
									query: {
										redirect: '/user'
									}
								})
							})
						}
					});
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
	.modifyLoginPaw{
		p:not(.emptyDiv){
			height:100px;
			line-height:100px;
			font-size:28px;
			padding:0 30px;
			border-bottom:1px solid #eee;
			label{
				display:inline-block;
				width:150px;
			}
			input{
				width:calc(100% - 220px);
			}
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