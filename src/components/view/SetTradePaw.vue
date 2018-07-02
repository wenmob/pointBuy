<template>
	<div class="setTradePaw">
		<p class="emptyDiv"></p>
		<p>
			<label for="paw">提&nbsp;&nbsp;现&nbsp;&nbsp;密&nbsp;&nbsp;码</label>
			<input type="password" v-model='pwd' id='paw'/>
		</p>
		<p>
			<label for="pawAgain">确认提现密码</label>
			<input type="password" v-model='pwd2' id='pawAgain'/>
		</p>
		<button @click='savePayPsw'>确认</button>
	</div>
</template>
<script>
	import { API } from "../../utils/api.js"
	let vm;

	export default {
		data() {
			return {
				pwd: '',
				pwd2: ''
			}
		},

		mounted() {
			vm = this;
			vm.notFot()
		},
		methods: {
			savePayPsw() {
				if(!API.checkPassword(vm.pwd)) {
					return
				}
				if(vm.pwd != vm.pwd2) {
					layer.open({
						content: '两次密码输入不一致',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					return
				}
				API.savePayPsw(vm.pwd, function(data) {
					if(data.code == 0) {
						vm.$router.push('/personlCen')
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
	.setTradePaw{
		p{
			label{
				display:inline-block;
				width:180px;
			}
		}
	}
</style>