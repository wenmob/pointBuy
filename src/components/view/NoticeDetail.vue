<template>
	<div class="noticeDetail">
		<div class="noticeTit">
			<span v-html='noticeDetail.title'>
			</span>
			<span>{{noticeDetail.date}}</span>
		</div>
		<p></p>
		<div v-html='noticeDetail.content'></div>
	</div>
</template>

<script>
  import { API } from "../../utils/api.js"
  let vm;
  export default {
    data(){
      return{
       notice_id:"",
	   noticeDetail:{}
      }
    },
    mounted(){
      vm = this;
      vm.notFot()
      vm.notice_id = vm.$route.query.id;
	  vm.getNoticeDetail();
    },
    methods:{
		getNoticeDetail(){
		   API.getNoticeDetail(vm.notice_id,function (data) {
			  if(data && data.code == 0){
				vm.noticeDetail = data.data[0];
				let month = vm.noticeDetail.dateAdd.split(' ')[0].split('-')[1]
				let day = vm.noticeDetail.dateAdd.split(' ')[0].split('-')[2]
				vm.noticeDetail.date = month + '月' + day + '日'
				vm.noticeDetail.time = vm.noticeDetail.dateAdd.split(' ')[1].split(':')[0]
										+':'+vm.noticeDetail.dateAdd.split(' ')[1].split(':')[1]
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
	.noticeDetail{
		padding:30px;
		.noticeTit{
			font-size:38px;
			margin-bottom:30px;
		}
	}
</style>