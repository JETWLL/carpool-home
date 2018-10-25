<template>
  <div class="phone-container">
    <img class="logo" src="/static/images/login-title.png" />
    <button
      class="button"
      plain="true"
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber">
      <img src="/static/images/wechat.png" />
      <text>授权免费领取课程</text>
    </button>
  </div>
</template>

<script>

export default {
  data () {
    return {
      zybuss: '',
      zybcode: ''
      // isBindPhone: false
    }
  },

  mounted() {
    this.getZybCode();
  },

  methods: {
    /**
     * 把 code,encryptedData, iv 传给后端 session 模块
     * 新用户返回 zybcode
     * 老用户返回 zybuss
     */
    async getZybCode() {
      const loginData = await this.$http.login();
      const userInfo = await this.$http.getUserInfo();
      const data = await this.$http.request({
        url: '/session/oauth/setaccesstokenwxapp',
        param: {
          code: loginData.code,
          encryptedData: userInfo.encryptedData,
          iv: userInfo.iv,
          zybApp: 'mttyk'
        }
      });
      if (data.zybuss) {
        this.zybuss = data.zybuss;
      } else {
        this.zybcode = data.zybcode;
      }
    },
    /**
     * 调起手机号授权
     */
    async getPhoneNumber(e) {
      const data = e.mp.detail;
      const loginData = await this.$http.login();
      if (data.encryptedData) {
        if (this.zybuss) {
          this.bindZybAccount(this.zybuss);
        } else {
          let param = {
            code: loginData.code,
            zybcode: this.zybcode,
            encryptedData: data.encryptedData,
            iv: data.iv
          };
          this.getZybUss(param);
        }
      } else {
        wx.showToast({
          title: '绑定失败T_T, 请重试',
          icon: 'none',
          duration: 1000
        });
      }
    },
    /**
     * 用 zybcode 跟后端换取 zybuss
     */
    async getZybUss(param) {
      const loginData = await this.$http.login();
      param.code = loginData.code;
      console.log('222', param);
      const data = await this.$http.request({
        url: '/clue/wxapp/bindzyb',
        param: param,
        method: 'POST'
      });
      this.bindZybAccount(data.zybuss);
    },
    /**
     * 后端绑定 zybuss 到作业帮
     * @params zybuss
     */
    async bindZybAccount(zybuss) {
      await this.$http.request({
        url: '/clue/mttyk/bindaccount',
        param: {
          zybuss: zybuss
        }
      });
      wx.showToast({
        icon: 'none',
        title: '手机号绑定成功',
        duration: 1000
      });
      wx.reLaunch({
        url: '../confirm/main'
        // ???
        // url: this.$parent.queryUrl
      });
    }
  },
}
</script>

<style lang="less" scoped>
  .phone-container {
    padding: 175rpx 85rpx 236rpx;
    font-size: 0;
    text-align: center;
    .logo {
      height: 140rpx;
      width: 411rpx;
    }
    button {
      margin-top: 470rpx;
      padding: 33rpx 115rpx;
      background: rgba(88, 208, 108, 1);
      line-height: 45rpx;
      display: flex;
      font-size: 32rpx;
      align-items: center;
      border-radius: 55rpx;
      color: #FFFFFF;
      border-color: #58d06c;
      box-shadow: 0 6px 18px 0 rgba(76, 199, 96, 0.4);
      img {
        height: 45rpx;
        width: 45rpx;
        padding-right: 20rpx;
      }
    }
  }
</style>
