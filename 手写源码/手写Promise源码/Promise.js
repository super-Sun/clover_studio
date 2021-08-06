// 等待状态
const PENDING = 'pending'
// 失败状态
const REJECT = 'reject'
// 结束状态
const FULFILLED = 'fulfilled'
class LuckyPromise {
    constructor(exception) {
        this.value = null
        this.reason = null
        this.state = PENDING
        this.onFulfilledCallbacks = []
        this.onRejectCallbacks = []
        // 成功的调用
        const resolve = (value) => {
            if (this.state === PENDING) {
                this.state = FULFILLED
                this.value = value
                this.onFulfilledCallbacks.forEach(cb => {
                    cb(this.value)
                })
            }
        }
        // 失败的调用
        const reject = (reason) => {
            if (this.state === PENDING) {
                this.state = REJECT
                this.reason = reason
                this.onRejectCallbacks.forEach(cb => {
                    cb(this.reason)
                })
            }
        }
        try {
            exception(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }
    then(onFulfilled, onRejected) {
        typeof onFulfilled === 'function' ? '' : onFulfilled = data => data
        typeof onRejected === 'function' ? '' : onRejected = error => {
            throw error
        }
        let promise = new LuckyPromise((resolve, reject) => {
            if (this.state === PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
                this.onRejectCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
            }
            if (this.state === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }
            if (this.state === REJECT) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }
        })
        return promise
    }

}

function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
        let err = new TypeError('TypeError')
        reject(err)
    }
    if (typeof x === 'object' && x !== null || typeof x === 'function') {
        // 是对象或者函数
        try {
            let then = x.then
            let called = false
            if (typeof then === 'function') {
                try {
                    // 是promise
                    then.call(x, (y) => {
                        if (called) {
                            return
                        }
                        called = true
                        resolvePromise(promise, y, resolve, reject)
                    }, (r) => {
                        if (called) {
                            return
                        }
                        called = true
                        reject(r)
                    })
                } catch (e) {
                    if (called) {
                        return
                    }
                    called = true
                    reject(e)
                }
            } else {
                // 普通值
                resolve(x)
            }
        } catch (e) {
            reject(e)
        }
    } else {
        // 普通值
        resolve(x)
    }
}
LuckyPromise.defer = LuckyPromise.deferred = function () {
    let dfd = {}
    dfd.promise = new LuckyPromise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}
module.exports = LuckyPromise

LuckyPromise.race = function(){}
LuckyPromise.all = function(){}
LuckyPromise.prototype.finally = function(callback){
    return this.then(data => {
        return LuckyPromise.resolve(callback()).then(() => data)
    }, error => {
        return LuckyPromise.resolve(callback()).then(() => {
            throw error
        })
    })
}
// console.log(1);
// let p = new LuckyPromise(function (resolve, reject) {
//     console.log(2);
//     setTimeout(()=>{
//         resolve(Promise.resolve(111))
//     })
// })
// console.log(3);
// p.then(data => {
//     console.log(5);
//     console.log('success: ');
//     console.log(data);
// }, err => {
//     console.log('error: ');
//     console.log(err);
// }).then(data => {
//     console.log(data);
// })
// console.log(4);