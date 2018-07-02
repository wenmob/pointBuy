<style lang='scss' scoped>
  .depositBank{
    width: 10rem;
    height: 100%;
    position: fixed;
    background-color: rgba(0,0,0,0.6);
    left: 50%;
    margin-left: -5rem;
    top:0px;
    z-index: 2000;
  }
  .depositBank-cont{
    position: absolute;
    width: 8rem;
    height: 6.3rem;
    left: 50%;
    margin-left: -4rem;
    top: 50%;
    margin-top: -3rem;
    background-color: #ccc;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
  }
  .depositBank-cont-1{
      position: relative;
      padding: 0.26rem;
  }
  .depositBank-td1{
    padding: 0.26rem;
    background-color: white;

  }
  .depositBank-td1 span{
    font-size: 0.32rem;
  }
  .depositBank-td2{
    position: relative;
    width: 100%;
    height: 4rem;
    background-color: white;
    margin-top: 0.15rem;
  }
  .depositBank-submit{
    display: block;
    font-size: 0.38rem;
    width:100%;
    height: 0.8rem;
    text-align: center;
    background-color: #4B7EDB;
    color: white;
    line-height: 0.8rem;

  }
  .depos-span{
    display: block;
    height: 0.8rem;
    text-align: center;
    font-size: 0.34rem;
    line-height: 0.8rem;
  }
  .depositBank-td2-fen{
    position: absolute;
    width: 100%;
    height: 0.8rem;
    background-color: rgba(232,237,46,0.4);
    z-index: 2001;
    top: 0;
    left: 0;
  }
</style>
<template>
   <div class="depositBank" @click="isClickThatFun">
     <div class="depositBank-cont">
      <div class="depositBank-cont-1">
        <!--显示银行卡的内容区域-->
        <div class="depositBank-td1">
          <span>银行卡：{{bankStr}}</span>
        </div>
        <!--银行区域-->
        <div class="depositBank-td2">
          <!--分界线-->
          <div class="depositBank-td2-fen"></div>
          <div class="swiper-container" id="depos" style="height: 4.0rem">
            <div class="swiper-wrapper">

            </div>
          </div>
        </div>
        <!--确认按钮-->
        <a class="depositBank-submit" @click="sendBank">确认</a>
      </div>
     </div>
   </div>
</template>
<script>
	import $ from 'jquery'
  import Swiper from '../../../static/swiper/swiper-3.4.2.min.js';
  import {API} from "../../utils/api.js"
  let vm;
  export default {
    data(){
      return{
         deposSwiper:{},
         bankStr:"",
         bankId:0
      }
    },
    mounted(){
      vm = this;
      vm.startDeposSwiper();
      vm.getBankDepos();
    },
    methods:{
      isClickThatFun:function(e){
        e = window.event || e;
        let ele =  $(e.srcElement || e.target);
        let _this = ele[0].className;
        if (_this == "depositBank"){
          vm.$emit('listenDepositBankClose',{depositBankShow:false});
        }else{
          return;
        }
      },
      startDeposSwiper(){
        vm.deposSwiper = new Swiper('#depos', {
          direction : 'vertical',
          slidesPerView : 5,
          onTransitionEnd:function (swiper) {
            let bankCode = $('#depos .swiper-slide').eq(swiper.activeIndex).find('span').attr('meta-d');
            let bankName = $('#depos .swiper-slide').eq(swiper.activeIndex).find('span').text();
            vm.bankStr = bankName;
            vm.bankId = bankCode;
          }

        })
      },
      getBankDepos(){
        API.sysBankListWithdraw(function (data) {
            let arr = data.data;
            vm.bankStr = data.data[0].bankFullName;
            vm.bankId = data.data[0].id;
            arr.forEach(function (elem) {
              vm.deposSwiper.appendSlide('<div class="swiper-slide">' +
                '<span class="depos-span" meta-d="'+elem.id+'">'+elem.bankFullName+'</span>' +
                '</div>');
            });
          for(let i = 0; i<4;i++){
            vm.deposSwiper.appendSlide('<div class="swiper-slide">' +
              '<span class="depos-span" meta-d="-1"></span>' +
              '</div>');
          }

        })
      },
      sendBank(){
         vm.$emit('listenDepositBank',{bankStr:vm.bankStr,bankId:vm.bankId,depositBankShow:false});
      }

    }
  }
</script>
