<template>
	<div class="paySearch">
		<div class="pay-row">
			<span class="row-s1">
				<strong>充值没有到账？</strong>
			</span>
		</div>
		<div class="emptyDiv"></div>
		<div class="payrow">
			<div class="pay-row-cen">
				<span class="row-s2"><input class='' type="text" v-model='ddh' placeholder="请输入您的转账记录里的订单号"></span>
			</div>
			
		</div>
		<div class="about-btn">
			<button class="btn-go" @click='addStatus'>查询充值状态</button>
		</div>
	</div>
</template>
<script>
	import { API } from "../../utils/api.js"
	let vm;
	
	export default {
		data() {
			return {
				ddh: ''
			}
		},
		mounted() {
			vm = this;
			vm.notFot()
		},
		methods: {
			//查询
			addStatus() {
				API.checkAlipayNofee(vm.ddh, function(data) {
					console.log(data)
					if(data.code == 0) {
						layer.open({
							content: '充值已到账',
							skin: 'msg',
							time: 2 //2秒后自动关闭
							,end:function(){
								vm.$router.push('user')
							}
						});
					} else if(data.code == 600) {
						layer.open({
							content: '请输入您要查询的订单号',
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
	@import "../../assets/css/bus";
	.paySearch{
		position:absolute;
		background:#f5f5f5;
		top:0;
		height:100%;
	}
	.pay-row {
		padding: 0 30px;
		height: 100px;
		background-color: #fff;
		border-top: 1px solid #e6e6e6;
		border-bottom: 1px solid #e6e6e6;
	}
	.payrow {
		background-color: #fff;
		border-top: 1px solid #e6e6e6;
	}
	
	.pay-row-cen {
		padding: 0 0.375rem;
		height: 1.35rem;
		background-color: #fff;
		margin-top: 0.27rem;
	}
	
	.row-s1 {
		line-height: 1.35rem;
		font-size: 0.405rem;
		color: #282828;
	}
	
	.row-s2 {
		display: block;
		width: 100%;
		height: 100px;
		line-height:100px;
	}
	
	.row-s2 input {
		width: 100%;
		font-size: 30px;
		color: #585858;
		height:50px;
		/*border:1px solid #ccc;*/
	}
	
	.about-btn {
		padding: 0 30px;
	}
	
	.btn-go {
		width: 100%;
	    margin-top: 150px;
	    height: 88px;
	    background: $themeColor;
	    color: #fff;
	    border: 0;
	    border-radius: 10px;
	    font-size: 32px;
	    outline:0;
	}
</style>