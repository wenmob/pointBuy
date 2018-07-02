<template>
	<div class="newHandLearn">
		<div v-html="learnData.content">
			<!--<img src="../../assets/img/5.png" alt="" />-->
		</div>
		<!--<router-link to="create" tag="button">立即创建策略</router-link>-->
	</div>
</template>
<script>
	import { API } from "../../utils/api.js"
	import $ from 'jquery'
	let vm;
	
	export default{
		data(){
			return{
				learnData:{}
			}
		},
		mounted(){
			vm = this;
			vm.siteExtContent()
			vm.needFot()
		},
		methods:{
			//新手指引
			siteExtContent(){
				API.siteExtContent('guid-h5',function(res){
					if(res.code == 0){
						vm.learnData = res.data
						let imgInterval = setInterval(function(){
							console.log($('.newHandLearn img'))
							if($('.newHandLearn img')[0]){
								$('.newHandLearn img')[0].style.width = '100%';
								$('.newHandLearn img')[1].style.width = '100%';
//								$('.newHandLearn img')[0].style.position = 'absolute';
								clearInterval(imgInterval)
							}
							
						})
						
					}
				})
			},
			// 底部显示
		    needFot () {
		      this.$emit('listenFot', '0')
		    },
		}
	}
</script>

<style lang='scss' scoped>
	@import "../../assets/css/bus";
	.newHandLearn{
		width:100%;
		div{
			width:100%;
			/*padding-bottom:86px;*/
		}
	}
</style>