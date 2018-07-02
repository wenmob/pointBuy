<template>
	<div class="bankBound" @keyup.enter='bankTure'>
		<p class="emptyDiv"></p>
		<p>
			<label for="name">开&nbsp;户&nbsp;&nbsp;名</label>
			<span>{{username}}</span>
		</p>
		<p @click="startBank($event)">
			<label for="name" id="bankName">开户银行</label>
			<icon class='icon' name='right' scale='2'></icon>
		</p>
		<p @click="startSelect($event)">
			<label for="name" id="sel_city">开户省市</label>
			<icon class='icon' name='right' scale='2'></icon>
		</p>
		<p>
			<label for="bankAddress">开户支行</label>
			<input v-model='branch' autocomplete="off" id='bankAddress' type="text" placeholder="输入银行卡所在支行" />
		</p>
		<p class="emptyDiv"></p>
		<p>
			<label for="bankNum">银行卡号</label>
			<input style='-moz-appearance:textfield;' id='bankNum' v-model='CardNum' name="" autocomplete="off" type="number" pattern="[0-9]*" placeholder="输入银行卡号" />
		</p>
		<p>
			<label for="bankNumAgain">确认卡号</label>
			<input style='-moz-appearance:textfield;' id='bankNumAgain' class='CardNumAgain' v-model='CardNumAgain' autocomplete="off" type="number" pattern="[0-9]*" placeholder="再次输入银行卡号" />
		</p>
		<button class="btn-go" @click='bankTure'>确认</button>

		<form-organization v-if="organizationShow" ref="form_organization" v-on:listenToOrganization="showOrgMesg" v-on:listenToOrganizationClose="orgIsClose"></form-organization>
		<!--显示可选银行-->
		<depositBank v-if="depositBankShow" v-on:listenDepositBank="showDepMesg" v-on:listenDepositBankClose="depIsClose" ref="depositBank"></depositBank>

	</div>

</template>
<script>
	import $ from 'jquery'
	import Icon from 'vue-svg-icon/Icon.vue'
	import { API } from "../../utils/api.js"
	import FormOrganization from '@/components/plugIn/FormOrganization';
	import DepositBank from '@/components/plugIn/DepositBank';
	let vm;

	export default {
		data() {
			return {
				organizationShow: false,
				depositBankShow: false,
				userId: '',
				username: '',
				bankId: '',
				province: '', //市
				city: '', //区
				district: '', //县
				branch: '',
				CardNum: '',
				CardNumAgain: ''
			}
		},
		components: {
			"form-organization": FormOrganization,
			"depositBank": DepositBank,
  			Icon
		},
		mounted() {
			vm = this;
			vm.getBaseUserInfo();
			vm.notFot()
		},
		methods: {
			//获取用户信息
			getBaseUserInfo() {
				API.getBaseUserInfo(function(data) {
					//  			console.log(data)
					if(data.code == 0) {
						vm.userId = data.data.id
						vm.username = data.data.name
					} else {
						layer.open({
							content: data.msg,
							skin: 'msg',
							time: 2 //2秒后自动关闭
						});
					}

				})
			},
			/*
			 *点击省市区
			 * **/
			startSelect(e) {
				let _this = $(e.currentTarget);
				vm.organizationShow = true;
			},
			/*
			 *监听省市区组件的
			 * **/
			showOrgMesg(data) {
				//       console.log(data);
				$('#sel_city').text(data.title);
				vm.organizationShow = data.organizationShow;
				vm.province = data.province;
				vm.city = data.city;
				vm.district = data.district;
			},
			startBank(e) {
				let _this = $(e.currentTarget);
				vm.depositBankShow = true;
			},
			/*
			 *银行卡组件
			 * **/
			showDepMesg(data) {
				//         console.log(data);
				$("#bankName").text(data.bankStr);
				vm.bankId = data.bankId;
				vm.depositBankShow = data.depositBankShow;
			},
			//确认绑定
			/*
			 *是否显示隐藏省市区级联
			 **/
			orgIsClose(data) {
				vm.organizationShow = data.organizationShow;
			},
			depIsClose(data) {
				vm.depositBankShow = data.depositBankShow;
			},
			bankTure() {
				if(vm.CardNumAgain == vm.CardNum) {
					API.saveUserBank(vm.bankId, vm.province, vm.city,
						vm.district, vm.branch, vm.CardNum,
						function(data) {
							//							console.log(data)
							if(data.code == 0) {
								layer.open({
									content: '绑定成功',
									skin: 'msg',
									time: 2 //2秒后自动关闭
										,
									end: function(index) {
										vm.$router.go(-1)
									}
								});
							} else if(data.code == 600) {
								layer.open({
									content: '信息不完善',
									skin: 'msg',
									time: 2 //2秒后自动关闭
								});
							}
						})
				} else {
					layer.open({
						content: '卡号不一致,请重新输入',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
				}

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
	.bankBound{
		p:not(.emptyDiv){
			height:100px;
			line-height:100px;
			padding:0 30px;
			font-size: 28px;
			border-bottom:1px solid #eee;
			span{
				float:right;
			}
			.icon{
				float:right;
				margin-top:31px;
			}
			&:nth-of-type(5){
				border:0;
			}
			&:nth-of-type(5),
			&:nth-of-type(7),
			&:nth-of-type(8),{
				label {
					display: inline-block;
					width: 120px;
				}
			}
			input{
				width:calc(100% - 180px);
			}
			
		}
		.emptyDiv{
				/*border-bottom:1px solid #eee;*/
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