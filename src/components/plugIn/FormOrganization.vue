<style lang='scss'>
  .organization-cont{
    position: fixed;
    width: 10rem;
    height: 100%;
    background-color: rgba(0,0,0,0.6);
    left: 50%;
    margin-left: -5rem;
    top: 0;
    z-index: 2000;
  }
  .organization-d1{
    position: absolute;
    width: 8.6rem;
    height: 7.3rem;
    left: 50%;
    margin-left: -4.3rem;
    top: 50%;
    margin-top: -4rem;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
    background-color: #ccc;
  }
  .organization-d1-1{
    position: relative;
    padding: 0.26rem;
  }
  .organization-d1-top{
    position: relative;
    display:flex;
    justify-content:space-between;
    flex-direction: row;
    align-items:center;
  }
  .organization-d1-top .d1{
    position: relative;
    width: 2.2rem;
    height: 1rem;
    padding: 0.16rem 0.18rem;
    background-color: white;
    border-radius: 4px;
  }
  .organization-d1-top .d1 span{
    display: inline-block;
    font-size: 0.32rem;
    float: left;
  }
  .organization-d1-top .d1 span:nth-child(1){
    width: 1.1rem;
    line-height: 1.3;
  }
  .organization-d1-top .d1 span:nth-child(2){
    line-height: 1.3;

  }
  .organization-d1-bd{
     display: flex;
     position: relative;
     width: 100%;
     height: 4.58rem;
     margin-top: 0.1rem;
     border-top-left-radius: 4px;
     border-top-right-radius: 4px;
     justify-content:space-between;
     flex-direction: row;
     align-items:center;
     border:0.03rem solid #f5f5f5;
    background-color: #ccc;
  }
  .organization-d1-bd .td1{
    position: relative;
    width: 2.68rem;
    height: 100%;
    background-color: white;
  }
  .org-s1{
    display: block;
    font-size: 0.32rem;
    height: 0.70rem;
    padding: 0.1rem;
  }
  .org-f-a{
    display: block;
    font-size: 0.38rem;
    width: 8.14rem;
    height: 0.8rem;
    text-align: center;
    background-color: #4B7EDB;
    color: white;
    line-height: 0.8rem;
  }
  .org-fen{
    position: absolute;
    width: 100%;
    height: 0.8rem;
    background-color: rgba(232,237,46,0.4);
    top: 0;
    left: 0;
    z-index: 2001;
  }
</style>
<template>
   <div class="organization-cont" @click="isClickThat">
     <div class="organization-d1">
        <div class="organization-d1-1">
          <div class="organization-d1-top">
            <div class="d1"><span>省/市：</span><span meta-d="" id="proName"></span></div>
            <div class="d1"><span>市/区：</span><span meta-d="" id="cityName"></span></div>
            <div class="d1"><span>区/县：</span><span meta-d="" id="areaName"></span></div>
          </div>
          <div class="organization-d1-bd">
            <!--省-->
            <div class="td1">
              <!---分界线-->
              <div class="org-fen"></div>
              <div class="swiper-container" id="province" style="height: 4.6rem">
                <div class="swiper-wrapper">
                  <!--<div class="swiper-slide"><span class="org-s1" meta-p="-1"></span></div>-->

                </div>
              </div>
            </div>
            <!--市-->
            <div class="td1">
              <!---分界线-->
              <div class="org-fen"></div>
              <div class="swiper-container" id="city" style="height: 4.6rem">
                <div class="swiper-wrapper">
                  <!--<div class="swiper-slide"><span class="org-s1" meta-c="-1" >太阳系</span></div>-->
                </div>
              </div>
            </div>
            <!--区-->
            <div class="td1">
              <!---分界线-->
              <div class="org-fen"></div>
              <div class="swiper-container" id="area" style="height: 4.6rem">
                <div class="swiper-wrapper">
                  <!--<div class="swiper-slide"><span class="org-s1" meta-a="-1">火星</span></div>-->
                </div>
              </div>
            </div>
          </div>
          <!--确认按钮-->
          <a class="org-f-a" @click="orgSubmit">确认</a>
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
        provinceSwiper:{},
        citySwiper:{},
        areaSwiper:{}
      }
    },
    mounted(){
      vm = this;
      vm.startSwiperPro();
      vm.startSwiperCity();
      vm.startSwiperArea();
      vm.getProvince();
      vm. getCity(110000,function (data) {
        vm.getArea(data);
      });
    },
    methods:{
      startSwiperPro(){
        vm.provinceSwiper = new Swiper('#province',{
          direction : 'vertical',
          slidesPerView : 5,
          onTransitionEnd:function (swiper) {
             // alert(swiper.clickedIndex);
            let proCode = $('#province .swiper-slide').eq(swiper.activeIndex).find('span').attr('meta-p');
            let proName = $('#province .swiper-slide').eq(swiper.activeIndex).find('span').text();
            $("#proName").text(proName);

            vm.citySwiper.removeAllSlides();
            vm.areaSwiper.removeAllSlides();
            vm.getCity(proCode,function (data) {
              vm.getArea(data);
            });

          }
        });
      },
      startSwiperCity(){
        vm.citySwiper = new Swiper('#city',{
          direction : 'vertical',
          slidesPerView : 5,
          onTransitionEnd:function (swiper) {
            let cityCode = $('#city .swiper-slide').eq(swiper.activeIndex).find('span').attr('meta-c');
            let cityName = $('#city .swiper-slide').eq(swiper.activeIndex).find('span').text();
            $("#cityName").text(cityName);

            vm.areaSwiper.removeAllSlides();
            vm.getArea(cityCode);
          }
        });
      },
      startSwiperArea(){
        vm.areaSwiper = new Swiper('#area',{
          direction : 'vertical',
          slidesPerView : 5,
          onTransitionEnd:function (swiper) {
            let areaCode = $('#area .swiper-slide').eq(swiper.activeIndex).find('span').attr('meta-a');
            let areaName = $('#area .swiper-slide').eq(swiper.activeIndex).find('span').text();
            $("#areaName").text(areaName);
          }
        });
      },
      getProvince(){
        API.getprovince(function (data) {
        	if(data.code != 0){
        		return
        	}
          let province = data.data;
          $("#proName").text(province[0].name);
          $("#proName").attr('meta-d',province[0].id);
          province.forEach(function (elem) {
            vm.provinceSwiper.appendSlide('<div class="swiper-slide"><span class="org-s1" meta-p="'+elem.id+'">'+elem.name+'</span></div>');
          });
          for(let i=0;i<4;i++){
            vm.provinceSwiper.appendSlide('<div class="swiper-slide"><span class="org-s1" meta-p="-1"></span></div>');
          }
        })
      },
      getCity(pid,sucF){
        API.getRegion(pid,function (data) {
        	if(data.code != 0){
        		if(data.code == 700){
	            vm.citySwiper.removeAllSlides();
	            vm.areaSwiper.removeAllSlides();
	            $("#areaName").text("");
	            $("#cityName").text("");
	          }
        		return
        	}
          
           let city = data.data;
           sucF(city[0].id);
          $("#cityName").text(city[0].name);
          $("#cityName").attr('meta-d',city[0].id);
            city.forEach(function (elem) {
             vm.citySwiper.appendSlide('<div class="swiper-slide"><span class="org-s1" meta-c="'+elem.id+'">'+elem.name+'</span></div>');
           });
          for(let i=0;i<4;i++){
            vm.citySwiper.appendSlide('<div class="swiper-slide"><span class="org-s1" meta-c="-1"></span></div>');
          }

        })
      },
      getArea(pid){
        API.getRegion(pid,function (data) {
          if(data.code == 700){
            vm.areaSwiper.removeAllSlides();
            $("#areaName").text("");
            return;
          }
          let area = data.data;
          $("#areaName").text(area[0].name);
          $("#areaName").attr('meta-d',area[0].id);
          area.forEach(function (elem) {
            vm.areaSwiper.appendSlide('<div class="swiper-slide"><span class="org-s1" meta-a="'+elem.id+'">'+elem.name+'</span></div>');
          });
          for(let i=0;i<4;i++){
            vm.areaSwiper.appendSlide('<div class="swiper-slide"><span class="org-s1" meta-a="-1"></span></div>');
          }
        })
      },
      orgSubmit(){
          let str = $("#proName").text() + " "+ $("#cityName").text() + " " + $("#areaName").text();
          let province = $("#proName").text();
          let city = $("#cityName").text();
          let district = $("#areaName").text();
          vm.$emit('listenToOrganization',{title:str,province:province,city:city,district:district,organizationShow:false});
      },
      isClickThat(e){
        e = window.event || e;
        let ele =  $(e.srcElement || e.target);
        let _this = ele[0].className;
        if (_this == "organization-cont"){
          vm.$emit('listenToOrganizationClose',{organizationShow:false});
        }else{
          return;
        }
      }
    }
  }
</script>
