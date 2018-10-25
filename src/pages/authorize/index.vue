<template>
  <div class="container">
    <img class="logo" src="/static/images/login-title.png" />
    <button
      class="button"
      plain="true"
      open-type="getUserInfo"
      @getuserinfo="wxAuthorize">
      <img src="/static/images/wechat.png" />
      <span>微信用户快速登陆</span>
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      motto: 'Hello World',
      userInfo: {}
    }
  },

  methods: {
    async loginCode() {
      let data = await this.getData();
      console.log(data.data);
    },
    async getLocation () {
      const name1  = await this.$http.login();
      console.log('111', name1);
      const name2  = await this.$http.getUserInfo();
      console.log('222', name2);
    },

    async test2() {
      let params = {
        url: '/5b558d79a9db0b2cbee7ecbc/mina/test01',
        param: {}
      };
      let data = await this.$http.request(params);
      console.log('88888', data);
    },
    /**
     * 调起微信授权的回调
     */
    wxAuthorize(e) {
      if(e.mp.detail.userInfo) {
        wx.reportAnalytics('authorize_click_btn_state', {
          state: '确认授权',
        });
        this.wxLogin();
      } else{
        wx.reportAnalytics('authorize_click_btn_state', {
          state: '取消授权',
        });
        wx.showToast({
          title: '授权失败~',
          icon: 'none',
          duration: 1000
        });
      }
    },
    /**
     * 微信登录
     * 获取用户加密的敏感信息
     */
    async wxLogin() {
      wx.showLoading({
        title: '登录中',
        mask: true
      });
      const loginData = await this.$http.login();
      const userInfo = await this.$http.getUserInfo();
      wx.setStorageSync('userInfo', userInfo.userInfo);
      let params = {
        code: loginData.code,
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv
      };
      this.getSession(params);
    },
    /**
     * 加密的敏感信息发送给后端，解析出 openId/unionId
     * 把得到的 wxUserInfo 存到本地
     * 请求 header 中携带
     */
    async getSession(params) {
      let data = await this.$http.request({url: '/clue/mttyk/login', param: params});
      wx.setStorageSync('openId', data.openId);
      wx.setStorageSync('wxUserInfo', encodeURIComponent(data.wxUserInfo));
      wx.reLaunch({
        // url: this.queryUrl
        url: '../phone/main'
      });
    }
  }
}
</script>

<style lang="less" scoped>
  .container {
    padding: 86px 43px 118px;
    font-size: 0;
    text-align: center;
    .logo {
      height: 70px;
      width: 205px;
    }
    button {
      margin-top: 235px;
      padding: 16px 57px;
      background: rgba(88, 208, 108, 1);
      line-height: 22px;
      display: flex;
      font-size: 16px;
      align-items:center;
      border-radius: 28px;
      color: #FFFFFF;
      border-color: #58d06c;
      box-shadow: 0 3px 9px 0 rgba(76, 199, 96, 0.4);
      img {
        height: 22px;
        width: 22px;
        padding-right: 10px;
      }
    }
  }
</style>
