export class PermissionService {
    constructor (store) {
      this.store = store
    }
    
    can(operation, resource){       
        if ((operation == null || resource == null) && !this.store.$auth.state.user)
            return false

        let key = resource + "." + operation
        let path;
        // [ { } ] permission: [equimpent.view] <- KEY
        path = this.store.$auth.state.user.claims.filter(claim => {
            let dd = Object.keys(claim.permissions)
            let ddd = dd.filter(k => k === key)
            if (ddd.length > 0)
                return dd
        })

        if (path.length <= 0)
            return false;

        let permission = `${resource}.${operation}`
        let result = Object.keys(path[0].permissions).filter(key => key === permission)
        
        if (result.length <= 0)
            return false;

        return true;
    }
  }