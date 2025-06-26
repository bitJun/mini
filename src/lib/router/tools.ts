const parseURL = (url) => {
  let protocol = '';
  let host = '';
  let pathname = '';
  let urlStr = url;
  if (urlStr) {
    protocol = urlStr.substr(0, urlStr.indexOf(':'));
    host = urlStr.substr(urlStr.indexOf('//') + 2);
    const index = host.indexOf('?');
    if (index === -1) {
      pathname = host.substring(host.indexOf('/') + 1);
    } else {
      pathname = host.substring(host.indexOf('/') + 1, index);
    }
    host = host.substr(0, host.indexOf('/'));
    urlStr = urlStr.indexOf('?') >= 0 ? urlStr.substr(urlStr.indexOf('?') + 1) : '';
  }
  const result: Record<string, string> = {};
  const items = urlStr ? urlStr.split('&') : [];
  items.forEach((item) => {
    const arr = item.split('=');
    const name = arr[0];
    const value = arr[1];
    result[name] = value;
  });
  return {
    protocol, // 项目
    host, // 端 本项目不区分端
    pathname, // 路径
    params: result, // 参数
  };
};

const joinParameters = (params: Record<string, string> = {}) => {
  const paramList = Object.keys(params).map((index) => {
    return `${index}=${params[index]}`;
  });
  return paramList.length > 0 ? `?${paramList.join('&')}` : '';
};

export { parseURL, joinParameters };
