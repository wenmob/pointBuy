<template>
	<div class="errorContainer">
		<img src="../../assets/img/404.jpg" alt="" />
		<p>您访问的页面走丢了!</p>
		<router-link to='/' tag='button'>返回首页</router-link>
	</div>
</template>

<script>
	export default{
		mounted(){
			this.notFot()
		},
		methods:{
			// 底部显示
		    notFot () {
		      this.$emit('listenFot', '3')
		    }
		}
	}
</script>

<style lang='scss' scoped>
	@import "../../assets/css/bus";
	.errorContainer{
		width:100%;
		img{
			width:400px;
			height:350px;
			margin-top:200px;
			margin-left:calc(50% - 200px);
		}
		p{
			text-align:center;
			font-size:30px;
			line-height:80px;
		}
		button{
			width:360px;
			height:88px;
			border:2px solid $themeColor;
			border-radius:50px;
			background:transparent;
			font-size:30px;
			color:#282828;
			margin-top:100px;
			margin-left:calc(50% - 180px);
			outline:0;
		}
	}
</style>