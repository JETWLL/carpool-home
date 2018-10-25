<script>
  export default {
    created () {
      this.checkAuthorize();
    },
    methods: {
      /**
       * 检测当前用户微信授权状态
       */
      async checkAuthorize() {
        const setting = await this.$http.getSetting();
        if (setting.authSetting['scope.userInfo']) {
          if (!wx.getStorageSync('wxUserInfo')) {
            this.wxLogin(); // 微信已经授权，但是本地存贮的用户密钥丢失,再执行一遍登录流程
          }
          if (!wx.getStorageSync('userInfo')) {
            const userInfo = await this.$http.getUserInfo();
            wx.setStorageSync('userInfo', userInfo.userInfo);
          }
        } else {
          wx.redirectTo({
            url: '../authorize/main'
          });
        }
      },
      /**
       * 微信登录
       * 获取用户加密的敏感信息
       */
      async wxLogin() {
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
        const data = await this.$http.request({url: '/clue/mttyk/login', param: params});
        wx.setStorageSync('openId', data.openId);
        wx.setStorageSync('wxUserInfo', encodeURIComponent(data.wxUserInfo));
        // wx.reLaunch({
        //   // url: this.queryUrl
        //   url: '../phone/main'
        // });
        this.checkBindPhone();
      },

      /**
       * 判断是否绑定过手机号
       */
      async checkBindPhone() {
        const data = await this.$http.request({url: '/clue/mttyk/takeinfo'});
        // this.globalData.isBindPhone = data.isBind;
        // if (this.globalData.isBindPhone) {
        //
        // }
      }
    }
  }
</script>

<style>
  /*.container {*/
  /*height: 100%;*/
  /*display: flex;*/
  /*flex-direction: column;*/
  /*align-items: center;*/
  /*justify-content: space-between;*/
  /*padding: 200rpx 0;*/
  /*box-sizing: border-box;*/
  /*}*/
  /*!* this rule will be remove *!*/
  /** {*/
  /*transition: width 2s;*/
  /*-moz-transition: width 2s;*/
  /*-webkit-transition: width 2s;*/
  /*-o-transition: width 2s;*/
  /*}*/
</style>
