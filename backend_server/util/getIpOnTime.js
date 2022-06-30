const { getIpListByKXproxy } = require('../service/ip/getIp');

let timer = setInterval(() => {
  getIpListByKXproxy(1, 5);
}, 1000 * 60 * 30);