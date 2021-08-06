// ***** 熟练的使用Promise ****


// 实例需要有两个属性 PromiseState、PromiseResult
// 构造函数需要实现的方法：then、catch、finally

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class PromiseA {
  constructor (expression) {
    this.PromiseState = PENDING
    this.PromiseResult = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []
    // TODO
    let resolve = (value) => {
      if (this.PromiseState === PENDING) {
        this.PromiseState = FULFILLED
        this.PromiseResult = value
        this.onFulfilledCallbacks.forEach(cb => {
          cb()
        })
      }
    }
    let reject = (reason) => {
      if (this.PromiseState === PENDING) {
        this.PromiseState = REJECTED
        this.PromiseResult = reason
        this.onRejectedCallbacks.forEach(cb => {
          cb()
        })
      }
    }
    expression(resolve, reject)
  }
  then (onFulfilled, onRejected) {
    // let [onFulfilled, onRejected] = Array.prototype.slice.call(arguments, 0);
    // TODO
    if (!isFunction(onFulfilled)) {
      // TODO
      onFulfilled = (data) => {
        return data
      }
    }
    if (!isFunction(onRejected)) {
      // TODO
      onRejected = (error) => {
        throw error
      }
    }
    let x
    let promise2 = new PromiseA((resolve, reject) => {
      if (this.PromiseState === PENDING) {
        console.log('PENDING');
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              x = onFulfilled(this.PromiseResult)
              resolutionProcedure(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              x = onRejected(this.PromiseResult)
              resolutionProcedure(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }
      if (this.PromiseState === FULFILLED) {
        setTimeout(() => {
          try {
            x = onFulfilled(this.PromiseResult)
            resolutionProcedure(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      if (this.PromiseState === REJECTED) {
        console.log('REJECTED');
        setTimeout(() => {
          try {
            x = onRejected(this.PromiseResult)
            resolutionProcedure(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }

    })
    return promise2
  }
  catch () {}
  finally () {}
}



function isFunction (func) {
  return typeof func === 'function'
}

function isObject (obj) {
  return typeof obj === 'object' && obj !== null
}


function resolutionProcedure (promise, x, resolve, reject) {
  
  if (promise === x) {
    reject(new TypeError('promise and x refer to the same object'))
    return
  }
  if (isObject(x) || isFunction(x)) {
    // TODO
    try {
      let then = x.then
      if (isFunction(then)) {
        let isCalled = false
        try {
          then.call(
            x,
            (y) => {
              if (isCalled) {
                return
              }
              isCalled = true
              resolutionProcedure(promise, y, resolve, reject)
            },
            (r) => {
              if (isCalled) {
                return
              }
              isCalled = true
              reject(r)
            },
          )
        } catch (error) {
          if (isCalled) {
            return
          }
          isCalled = true
          reject(error)
        }
      } else {
        resolve (x)
      }
    } catch (error) {
      reject(error)
    }
  } else {
    resolve (x)
  }
}


PromiseA.defer = PromiseA.deferred = function () {
  let dfd = {}
  dfd.promise = new PromiseA((resolve,reject)=>{
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}
module.exports = PromiseA;