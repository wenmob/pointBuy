<template>
	<div class="checkMobileContainer">
		<p class="emptyDiv"></p>
		<p>
			<label for="mobile">手&nbsp;&nbsp;&nbsp;&nbsp;机&nbsp;&nbsp;&nbsp;号</label>
			<input type="number" autocomplete="off" id='mobile'/>
		</p>
		<p>
			<label for="random">验&nbsp;&nbsp;&nbsp;&nbsp;证&nbsp;&nbsp;&nbsp;码</label>
			<input type="number" autocomplete="off" id='random'/>
			<span><img src="/code" alt="" /></span>
		</p>
		<p>
			<label for="telCode">手机验证码</label>
			<input autocomplete="off" id='telCode'/>
			<span>获取手机验证码</span>
		</p>
		<button>下一步</button>
	</div>
</template>

<script>
	import $ from 'jquery'
	import {API} from "../../utils/api.js"
	
	export default{
		data(){
			return{
				
			}
		},
		mounted(){
			this.notFot()
		},
		methods:{
			// 底部不显示
		    notFot () {
		      this.$emit('listenFot', '3')
		    },
		}
	}
</script>

<style lang='scss' scoped>
	@import '@/assets/css/bus.scss';
	.checkMobileContainer{
		p:not(.emptyDiv){
			height:100px;
			border-bottom:1px solid #eee;
			padding:0 30px;
			line-height:100px;
			font-size:28px;
			label{
				display:inline-block;
				width:150px;
			}
			&:nth-of-type(2){
				input{
					width:calc(100% - 180px);
				}
			}
			input{
				/*border:1px solid #ccc;*/
			}
			span{
				float:right;
				color:$themeColor;
				display:inline-block;
				width:200px;
				height:100px;
				img{
					width:100%;
					margin-top:5px;
				}
			}
			
		}
		button{
			width:calc(100% - 60px);
			margin-left:30px;
			margin-top:30px;
			height:88px;
			background:$themeColor;
			color:#fff;
			border:0;
			border-radius:10px;
			font-size:32px;
		}
	}
</style>