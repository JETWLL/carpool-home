
// const baseUrl = 'http://www.easy-mock.com/mock';
const baseUrl = 'https://www.zybang.com';

const login = () => new Promise((resolve, reject) => {
  wx.login({
    success (res) {
      resolve(res)
    },
    fail (e) {
      reject(e)
    }
  })
});

const getUserInfo = (obj) => new Promise((resolve, reject) => {
  wx.getUserInfo({
    ...obj,
    success (res) {
      resolve(res)
    },
    fail (e) {
      reject(e)
    }
  })
});

const getSetting = (obj) => new Promise((resolve, reject) => {
  wx.getSetting({
    ...obj,
    success (res) {
      resolve(res)
    },
    fail (e) {
      reject(e)
    }
  })
});

const request = (options) => new Promise((resolve, reject) => {

  const { method = 'GET', param = {} } = options;
  const cookie = wx.getStorageSync('wxUserInfo');
  wx.showLoading({
    title: '加载中',
    mask: true
  });
  wx.request({
    url: baseUrl + options.url,
    data: options.param,
    header: {
      'content-type': 'application/json',
      'Cookie': 'wxUserInfo=' + cookie
      // ...obj.header
    },
    method: options.method,
    success (res) {
      if (res.data && res.data.errNo === 0) {
        resolve(res.data.data);
      } else if (res.data.errNo === 4) {
        wx.redirectTo({url: 'authorize'});
      } else {
        wx.showToast({
          icon: 'none',
          title: '请求失败，请稍后再试~'
        });
      }
    },
    fail (e) {
      console.log('fail', e);
      reject(e)
    },
    complete (e) {
      console.log('complete', e);
      wx.hideLoading();
    }
  })
});

export default {
  request,
  login,
  getUserInfo,
  getSetting
};
