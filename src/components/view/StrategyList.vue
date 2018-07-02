<template>
	<div class="strategyList">
		<ul class="tabTit">
			<li @click='tabIndex = 0' :class="tabIndex == 0?'tabActive':''">基本信息</li>
			<li @click='tabIndex = 1' :class="tabIndex == 1?'tabActive':''">持仓股票</li>
			<li @click='tabIndex = 2' :class="tabIndex == 2?'tabActive':''">资金记录</li>
		</ul>
		<div class="emptyDiv"></div>
		<div style='height:100%;'>
			<baseInfo v-if='tabIndex == 0'></baseInfo>
			<positionlist v-if='tabIndex == 1'></positionlist>
			<moneyrecord v-if='tabIndex == 2'></moneyrecord>
		</div>
	</div>
</template>

<script>
	import baseInfo from '@/components/view/strategyList/BaseInfo'
	import positionlist from '@/components/view/strategyList/Positionlist'
	import moneyrecord from '@/components/view/strategyList/Moneyrecord'
	let vm;
	
	export default{
		data() {
			return {
				tabIndex:0
			}
		},
		components: {
			baseInfo,
			positionlist,
			moneyrecord
		},
		mounted() {
			vm = this;
			if(vm.$route.query.type){
				vm.tabIndex = vm.$route.query.type
			}
			vm.notFot()
		},
		methods: {
			// 底部不显示
			notFot () {
		      this.$emit('listenFot', '3')
		    },
		},
	}
</script>

<style lang='scss' scoped>
	@import "../../assets/css/bus";
	.strategyList{
		/*position:absolute;*/
		height:calc(100% - 130px);
		.tabTit{
			display:flex;
			margin:0;
			padding:0;
			height:100px;
			li{
				flex:1;
				height:100%;
				line-height:100px;
				text-align:center;
				font-size:28px;
				color:#585858;
				&.tabActive{
					border-bottom:1px solid $themeColor;
				}
			}
		}
	}
</style>