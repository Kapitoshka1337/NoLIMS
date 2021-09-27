import Vue from 'vue'

export default ({store, context}) => {
    Vue.directive('can', { 
        inserted (el, binding, vnode) {
                let route = store.app.router.app.$route;
                let routeName = route.name.split('-').length > 0 ? route.name.split('-')[0] : route.name
                let value = store.$auth.$state.user.claims.filter(claim => claim.module == routeName)
                
                if (value.length <= 0)
                    return false;

                let permission = `${binding.value}.${binding.arg}`
                let result = Object.keys(value[0].permissions).filter(key => key === permission)
                
                if (result.length <= 0)
                {
                    let className = el.classList[0];
                    el.className += ` ${className}--disabled`
                }
            }
    })

    Vue.prototype.$permissions = {

        can(operation, module){
            
            if (operation == null || module == null)
                return false

            let route = store.app.router.app.$route;
            let routeName = route.name.split('-').length > 0 ? route.name.split('-')[0] : route.name
            let value = store.$auth.$state.user.claims.filter(claim => claim.module == routeName)
            
            if (value.length <= 0)
                return false;

            let permission = `${module}.${operation}`
            let result = Object.keys(value[0].permissions).filter(key => key === permission)
            
            if (result.length <= 0)
                return false;

            return true;
        }
    }
}