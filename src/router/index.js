import Vue from 'vue'
import Router from 'vue-router'
import Pernation from '@/components/parent/Pernation'
import { API } from '../utils/api.js'
Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    name: 'Pernation',
    component: Pernation,
    children: [

      {
        path: '',
        name: '云服策略',
        meta: {
          requireAuth: false
        },
        component: () =>
					import('@/components/view/Index')
      },
      {
        path: '/create',
        name: '选择股票',
        meta: {
          requireAuth: false
        },
        component: () =>
					import('@/components/view/Create')
      },
      {
        path: '/createDetail',
        name: '创建',
        meta: {
          requireAuth: false
        },
        component: () =>
					import('@/components/view/CreateDetail')
      },
      {
        path: '/strategy',
        name: '策略',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/Strategy')
      },
      {
        path: '/user',
        name: '我的',
        meta: {
          requireAuth: false
        },
        component: () =>
					import('@/components/view/User')
      },
      {
        path: '/userNotice',
        name: '用户须知',
        meta: {
          requireAuth: false
        },
        component: () =>
					import('@/components/view/UserNotice')
      },
      {
        path: '/login',
        name: '登录',
        meta: {
          requireAuth: false
        },
        component: () =>
					import('@/components/view/Login')
      },
      {
        path: '/register',
        name: '注册',
        meta: {
          requireAuth: false
        },
        component: () =>
					import('@/components/view/Register')
      },
      {
        path: '/changePaw',
        name: '重置密码',
        meta: {
          requireAuth: false
        },
        component: () =>
					import('@/components/view/ChangePaw')
      },
      {
        path: '/stopStock',
        name: '停牌股票',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/StopStock')
      },
      {
        path: '/personlCen',
        name: '个人中心',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/PersonlCen')
      },
      {
        path: '/setIdCard',
        name: '实名认证',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/SetIdCard')
      },
      {
        path: '/changeMobile',
        name: '修改手机号',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/ChangeMobile')
      },
      {
        path: '/bankBound',
        name: '银行卡绑定',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/BankBound')
      },
      {
        path: '/alipayBound',
        name: '支付宝绑定',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/AlipayBound')
      },
      {
        path: '/alipayQrcode',
        name: '支付宝转账',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/AlipayQrcode')
      },
      {
        path: '/modifyPaw',
        name: '修改登录密码',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/ModifyPaw')
      },

      {
        path: '/setTradePaw',
        name: '设置提现密码',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/SetTradePaw')
      },
      {
        path: '/modifyTradePaw',
        name: '修改提现密码',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/ModifyTradePaw')
      },
      {
        path: '/checkMobile',
        name: '验证身份',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/CheckMobile')
      },
      {
        path: '/inviteFriend',
        name: '邀请好友',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/InviteFriend')
      },
      {
        path: '/notice',
        name: '公告',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/Notice')
      },
      {
        path: '/noticeDetail',
        name: '公告详情',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/NoticeDetail')
      },
      {
        path: '/moneyDetail',
        name: '资金明细',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/MoneyDetail')
      },
      {
        path: '/payStyle',
        name: '支付方式',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/PayStyle')
      },
      {
        path: '/cash',
        name: '提现',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/Cash')
      },
      {
        path: '/alipayPay',
        name: '支付宝转账',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/AlipayPay')
      },
      {
        path: '/paySearch',
        name: '转账查询',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/PaySearch')
      },
      {
        path: '/bankPay',
        name: '银行卡转账',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/BankPay')
      },
      {
        path: '/wechantPay',
        name: '微信转账',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/WechantPay')
      },
      {
        path: '/netBankPay',
        name: '快捷充值',
        /* 银联转账、未来优势转账 */
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/NetBankPay')
      },
      {
        path: '/codeAlipayPay',
        name: '快捷充值',
        /* 银联转账、未来优势转账 */
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/CodeAlipayPay')
      },
      {
        path: '/ownSearch',
        name: '搜索',
        meta: {
          requireAuth: false
        },
        component: () =>
					import('@/components/view/OWN-Search')
      },
      {
	          	path: '/ownEdit',
	          	name: '编辑',
	          	meta: {
	            	requireAuth: true
	          	},
	          	component: () => import('@/components/view/OWN-Edit')
	    },
      {
        path: '/historyT1',
        name: 'T+1历史',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/HistoryT1')
      },
      {
        path: '/historyTD',
        name: 'T+D历史',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/HistoryTD')
      },
      {
        path: '/strategyDetail',
        name: '策略详情',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/StrategyDetail')
      },
      {
        path: '/strategyList',
        name: '策略组详情',
        meta: {
          requireAuth: true
        },
        component: () =>
					import('@/components/view/StrategyList')
      },
      {
        path: '/newHandLearn',
        name: '新手学堂',
        meta: {
          requireAuth: false
        },
        component: () =>
					import('@/components/view/NewHandLearn')
      },
      {
        path: '/agreement',
        name: '相关协议',
        meta: {
          requireAuth: false
        },
        component: () =>
					import('@/components/view/Agreement')
      },
      {
        path: '/platformAgreement',
        name: '平台协议',
        meta: {
          requireAuth: false
        },
        component: () =>
					import('@/components/view/PlatformAgreement')
      },
      {
        path: '/tradeAgreement',
        name: 'A股交易合作协议',
        meta: {
          requireAuth: false
        },
        component: () =>
					import('@/components/view/TradeAgreement')
      },
      {
        path: '*',
        name: '页面错误',
        meta: {
          requireAuth: false
        },
        component: () =>
					import('@/components/view/Error')
      }

    ]
  }]

})

router.beforeEach((to, from, next) => {
  // console.log(to)
  if (to.path === '/strategy' && !to.query.type) {
    to.query.type = '0'
  }
  if (to.matched.some(record => record.meta.requireAuth)) {
    API.checklogin(function (data) {
      if (data.code === 0) {
        if (to.path !== '/login') {
          next()
        } else {
          next({ path: '/' })
        }
      } else {
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        })
      }
    })
  } else {
    next()
  }
})

export default router
