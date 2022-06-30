const getErr = function(errCode = 500, errMsg = "server internal error") {
    return {
        code: errCode,
        msg: errMsg,
        data: ""
    };
};

const getResult = function(result) {
    return {
        code: 0,
        msg: "",
        data: result,
    };
};

module.exports = {
    getErr,
    getResult
}