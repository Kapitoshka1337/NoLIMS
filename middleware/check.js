export default function ({ store }) {
    // equipment-view
    store.app.router.beforeEach((to, from, next) => {
        if (to.name == null)
            return
        
        if (to.name === "login-view")
        {
            next()
            return
        }
        
        let splitRoute = to.name.split('-');
        // [ { } ] permission: [equimpent.view] <- KEY
        let path = store.$auth.state.user.claims.filter(claim => {
            if (claim.module == splitRoute[0])
                return true;
        })

        if (path.length <= 0)
        {
            next(false)
            return
        }

        if (splitRoute.length == 1)
            next()

        let str = '';

        if (splitRoute.length == 3 && !splitRoute.includes('id'))
            str = `${splitRoute[1]}.${splitRoute[2]}`
        else if (splitRoute.length == 3 && splitRoute.includes('id'))
            str = `${splitRoute[0]}.${splitRoute[1]}`
        
        if (splitRoute.length == 2)
            str = `${splitRoute[0]}.${splitRoute[1]}`

        let keys = Object.keys(path[0].permissions).filter(key => key === str)
        
        if (keys == null || keys.length <= 0)
            next(false)
        else
            next()
    })
}