 (function () {
     let _Vue
     // 1.window.Vuex
     // 2.1.Vuex.Store
     // 2.2.Vuex.install
     // 3.实现 Vue.use(Vuex)
     class Store {
         constructor(options) {
             let state = options.state
             let actions = options.actions
             let mutations = options.mutations
             let getters = options.getters
             this.state = {}
             this.actions = {}
             this.mutations = {}
             this.getters = {}
             // 1.将 state 实现响应式
             // Vuex => new Vue({data:{state: options.state}}) => this.state = vm.state
             let vm = new _Vue({
                 data: {
                     state: state
                 }

             })
             this.state = vm.state
             // 2.实现actions
             Object.keys(actions).forEach(fnName => {
                 this.actions[fnName] = (params) => {
                     // TODO
                    actions[fnName](this, params)
                 }
             })
             // 3.mutations
             Object.keys(mutations).forEach(fnName => {
                this.mutations[fnName] = (params) => {
                    // TODO
                    mutations[fnName](this.state, params)
                }
            })
            // 4.getters
            Object.keys(getters).forEach(fnName => {
                // this.getters[fnName] = getters[fnName](this.state)
                Object.defineProperty(this.getters, fnName, {
                    get: () => {
                        return getters[fnName](this.state)
                    }
                })
            })
         }
         // dispatch
         dispatch = (actionName, params)=> {
             this.actions[actionName](params)
         }
         // commit
         commit = (mutationName, params)=>{
            this.mutations[mutationName](params)
         }
     }
     // Vue.use(Vuex)
    //  Vue.use = function (C, options){
    //     C.install && C.install(this, options)
    //  }
     const install = (Vue, options) => {
        _Vue = Vue
        init(options)
     }
     function init (options){
         _Vue.mixin({
             beforeCreate(){
                 let vm = this
                 
                 if (vm.$options.store) {
                    vm.$store = vm.$options.store
                 } else {
                    vm.$store = vm.$parent && vm.$parent.$store
                 }
                 
             }
         })
     }
     window.Vuex = {
         Store,
         install
     }
     if (typeof Vue !== 'undefined') {
         Vue.use(Vuex)
     }
 })()