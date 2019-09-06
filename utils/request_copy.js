//路径拼接
const joinPath = (...args) => {
  let length = args.length;
  return (length > 1 ? args.map((item, index) => {
    let path = String(item);
    if (index === 0) {
      return path.replace(/\/+$/g, "");
    } else if (index === length - 1) {
      return path.replace(/^\/+/g, "");
    } else {
      return path.replace(/^\/+|\/+$/g, "");
    }
  }) : args).join("/");
};
//是否是包含域名的url
const isUrl = (url) => {
  return /^(https|http|ftp|rtsp|mms)/.test(url);
};
//requestLoading
const requestLoading = (() => {
  let count = 0;
  return {
    show() {
      if (!count) {
        wx.showLoading({
          title: "正在加载",
          mask: true
        });
      }
      count++;
    },
    hide() {
      if (!--count) {
        wx.hideLoading();
      }
    }
  }
})();

const createRequest = (initMethod) => {
  return (...args) => {
    let opt, url, method,
      header = {
        "content-type": "application/json"
      },
      showLoading,
      showError;
    if (initMethod) {
      opt = args[1] || {};
      url = args[0];
      method = initMethod;
    } else {
      opt = args[0] || {};
      url = opt.url || "";
      method = opt.method;
    }
    showLoading = typeof opt.showLoading === "undefined" ? true : opt.showLoading;
    showError = typeof opt.showError === "undefined" ? true : opt.showError;
    if (showLoading) {
      requestLoading.show();
    }
    let Authorization = wx.getStorageSync("token的key");
    if (Authorization) {
      header["Authorization"] = Authorization;
    }
    if (opt.header) {
      Object.assign(header, opt.header);
    }
    return new Promise(resolve => {
      if (!isUrl(url)) {
        url = joinPath(opt.baseURL || "默认接口域名", url);
      }
      wx.request({
        method: (method || "GET").toUpperCase(),
        url,
        data: opt.data,
        header,
        dataType: opt.dataType || "json",
        responseType: opt.responseType || "text",
        complete(res) {
          typeof opt.complete === "function" && opt.complete(res);
          if (showLoading) {
            Loading.hide();
          }
          if (res.statusCode != 200) {
            let message;
            switch (res.statusCode) {
              case 400:
                message = "验证码错误";
                break;
              case 401:
                message = "登录已过期";
                wx.navigateTo({ url: "登陆页面url" });
                break;
              default:
                message = "系统请求异常";
                break;
            }
            showError && wx.showToast({
              icon: 'none',
              duration: 2000,
              title: message
            });
            typeof opt.fail === "function" && opt.fail({ status: res.statusCode, message });
            resolve({ status: res.statusCode, message });
          } else {
            //此处可进一步过滤统一接口返回格式
            typeof opt.success === "function" && opt.success(res.data);
            resolve(res.data);
          }
        }
      });
    });
  };
}

const Request = createRequest();

Request.get = createRequest("get");
Request.post = createRequest("post");
Request.put = createRequest("put");
Request.delete = createRequest("delete");

export default Request;



/**
 * 引用
 *
import Request from './request_copy.js'

const Get = Request.get;
const Post = Request.post;
const Put = Request.put;
const Delete = Request.delete;

export const getCode = data => Get('url', { data });

export const login = data => Post('url', {
  baseURL: "LOGIN_HOST",
  data,
  header: {
    "Authorization": 'Basic' + token,
    'Content-Type': 'application/x-www-from-urlencoded',
  }
})
 *
 */

