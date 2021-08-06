// 实例需要有两个属性 PromiseState、PromiseResult
// 构造函数需要实现的方法：then、catch、finally

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class PromiseA {
  constructor () {
    this.PromiseState = PENDING
    this.PromiseResult = undefined
    // TODO
  }
  then () {
    // TODO
  }
  catch () {}
  finally () {}
}