const { Worker } = require("worker_threads");
const os = require("os");
const path = require('path')
// const test1 = require("./test1");
// const test2 = require('./test2');
const cpuNumber = os.cpus().length;


const worker1 = new Worker(path.resolve(__dirname,"./test1.js"), {
  workerData: {
    index:1,
    num:3
  },
}); // worker是子线程实例
worker1.on("message", (result) => {
  console.log(result);
  // worker1.terminate();
});


