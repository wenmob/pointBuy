<template>
	<div class="setIdCardContainer" @keyup.enter='checkIdCard'>
		<p class="emptyDiv"></p>
		<p>
			<label for="name">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</label>
			<input type="text" v-model='tureName' name="name" id="name" />
		</p>
		<p>
			<label for="idCard">身&nbsp;份&nbsp;证&nbsp;号</label>
			<input type="text" v-model='idCard' name="idCard" id="idCard" />
		</p>
		
		<button @click='checkIdCard'>认  证</button>
	</div>
</template>

<script>
	import $ from 'jquery'
	import {API} from "../../utils/api.js"
	let vm;
	
	export default {
		data() {
			return{
				tureName:'',
				idCard:''
			}
		},
		mounted(){
			vm = this;
			vm.notFot()
		},
		methods: {
			//认证
			checkIdCard(){
	    		if(API.IdCard(vm.idCard)){
	    			API.checkIdcard(vm.tureName,vm.idCard,function(data){
	//	    			console.log(data)
		    			if(data.code == 0 || data.code == 602){/*602指之前已认证过*/
		    				layer.open({
							    content: '认证成功'
							    ,skin: 'msg'
							    ,time: 2 //2秒后自动关闭
							    ,end: function(index){
								    vm.$router.go(-1)
							    }
							});
		    				
		    			}else if(data.code == 600){
		    				layer.open({
							    content: '信息不完整'
							    ,skin: 'msg'
							    ,time: 2 //2秒后自动关闭
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
	@import '@/assets/css/bus.scss';
	.setIdCardContainer {
		p:not(.emptyDiv) {
			height: 100px;
			padding: 0 30px;
			border-bottom: 1px solid #eee;
			line-height: 100px;
			font-size: 28px;
			color: #585858;
			label {
				display: inline-block;
				width: 150px;
			}
			input {
				width: calc(100% - 280px);
				padding-left: 20px;
				/*border:1px solid #ccc;*/
			}
			
		}
		button {
			margin-top: 30px;
			margin-left: 30px;
			width: calc(100% - 60px);
			height: 88px;
			background: $themeColor;
			color: #fff;
			border: 0;
			border-radius: 10px;
			font-size: 32px;
		}
	}
</style>