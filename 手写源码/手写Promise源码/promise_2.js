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
    if (this.PromiseState === PENDING) {
      // console.log('PENDING');
      this.onFulfilledCallbacks.push(() => {
        setTimeout(() => {
          onFulfilled(this.PromiseResult)
        })
      })
      this.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          onRejected(this.PromiseResult)
        })
      })
    }
    if (this.PromiseState === FULFILLED) {
      setTimeout(() => {
        onFulfilled(this.PromiseResult)
      })
    }
    if (this.PromiseState === REJECTED) {
      console.log('REJECTED');
      setTimeout(() => {
        onRejected(this.PromiseResult)
      })
    }
  }
  catch () {}
  finally () {}
}