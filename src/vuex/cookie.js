// 设置cookie,增加到vue实例方便全局调用
// vue全局调用的理由是，有些组件所用到的接口可能需要session验证，session从cookie获取
// 当然，如果session保存到vuex的话除外
// 全局引入vue

let cookie = {
  setCookie (cname, value, expiredays) {
    let exdate = new Date();
    exdate.setTime(exdate.getTime() + expiredays);
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = cname + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
  },
  getCookie (name) {
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    let arr = document.cookie.match(reg);
    if (arr) {
      return (arr[2])
    } else {
      return null
    }
  },
  delCookie (name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = cookie.getCookie(name);
    if (cval != null) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    }
  }
};

export default cookie
