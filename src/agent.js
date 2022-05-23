import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = process.env.REACT_APP_BACKEND_URL || 'https://localhost:9001/api' //'http://192.168.0.156:9001/api';

const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Bearer ${token}`);
  }
}

const computedFilter = (filter) => {
    let url = '';

    if (Object.keys(filter).length > 0)
    {
        Object.keys(filter).forEach(el => {
            if (filter[el])
                url += `&${el}=${filter[el]}`
        })
    }

    return url
}

const computedUrl = (url, page, size, sorter) => {
    let uri = ''

    if (sorter == null)
      uri = `${url}?pageNumber=${page}&pageSize=${size}`
    else
      uri = `${url}?pageNumber=${page}&pageSize=${size}&sortBy=${sorter.dataIndex} ${sorter.sortOrder ? "desc" : ""}`
    
    return uri
}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody).catch(console.log(responseBody)),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody).catch(console.log(responseBody)),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody).catch(console.log(responseBody)),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody).catch(console.log(responseBody))
};

const Auth = {
  current: () =>
    requests.get('/v1/user/info'),
  login: (login, password) =>
    requests.post('/account/login', { userName: login, password: password }),
  register: (username, email, password) =>
    requests.post('/v1/user', { user: { username, email, password } }),
  save: user =>
    requests.put('/user', { user }),
  roles: () =>
    requests.get('/v1/roles/roles')
};

const EquipmentService = {
  view: (page, size, sorter = null) => {
    if (sorter == null)
      return requests.get(`/v1/equipment?pageNumber=${page}&pageSize=${size}`)
    else
      return requests.get(`/v1/equipment?pageNumber=${page}&pageSize=${size}&sortBy=${sorter.dataIndex} ${sorter.sortOrder ? "desc" : ""}`);
  },
  addVO: (item) => {
    return requests.post('/v1/equipment/vo', item)
  },
  addIO: (item) => {
    return requests.post('/v1/equipment/io', item)
  },
  addSI: (item) => {
    return requests.post('/v1/equipment/si', item)
  },
  get: (id) => {
    return requests.get(`/v1/equipment/detail/${id}`)
  },
  update: (item) => {
    return requests.post(`/v1/equipment/update/${item.id}`, item)
  },
};

const ManufacturerService = {
  view: (page, size, sorter = null) => {
    if (sorter == null)
      return requests.get(`/v1/manufacturer?pageNumber=${page}&pageSize=${size}`)
    else
      return requests.get(`/v1/manufacturer?pageNumber=${page}&pageSize=${size}&sortBy=${sorter.dataIndex} ${sorter.sortOrder ? "desc" : ""}`);
  },
  add: (item) => {
    return requests.post('/v1/manufacturer', item)
  },
  get: (id) => {
    return requests.get(`/v1/manufacturer/${id}`)
  },
  update: (item) => {
    return requests.post('/v1/manufacturer/update', item)
  }
};

const UsersService = {
  view: (page, size, sorter = null) => {
    if (sorter == null)
      return requests.get(`/v1/user?pageNumber=${page}&pageSize=${size}`)
    else
      return requests.get(`/v1/user?pageNumber=${page}&pageSize=${size}&sortBy=${sorter.dataIndex} ${sorter.sortOrder ? "desc" : ""}`);
  },
  add: (item) => {
    return requests.post('/v1/user', item)
  },
  get: (id) => {
    return requests.get(`/v1/user/${id}`)
  },
  update: (item) => {
    return requests.post('/v1/user/update', item)
  },
  changePassword: (item) => {
    return requests.post('/account/reset-password', item)
  }
};

const DepartmentService = {
  view: (page, size, sorter = null, filters = null) => {
    // debugger
    let url = computedUrl('/v1/department', page, size, sorter);
    let filterUrl = "";
    if (filters) filterUrl = computedFilter(filters);
    
    return requests.get(url + filterUrl)
  },
  add: (item) => {
    return requests.post('/v1/department', item)
  },
  get: (id) => {
    return requests.get(`/v1/department/${id}`)
  },
  update: (item) => {
    return requests.post('/v1/department/update', item)
  }
};

const LocationService = {
  view: (page, size, sorter = null) => {
    if (sorter == null)
      return requests.get(`/v1/location?pageNumber=${page}&pageSize=${size}`)
    else
      return requests.get(`/v1/location?pageNumber=${page}&pageSize=${size}&sortBy=${sorter.dataIndex} ${sorter.sortOrder ? "desc" : ""}`);
  },
  add: (item) => {
    return requests.post('/v1/location', item)
  },
  get: (id) => {
    return requests.get(`/v1/location/${id}`)
  },
  update: (item) => {
    return requests.post('/v1/location/update', item)
  }
};

const DocumentKindService = {
  view: (page, size, sorter = null) => {
    if (sorter == null)
      return requests.get(`/v1/documentKind?pageNumber=${page}&pageSize=${size}`)
    else
      return requests.get(`/v1/documentKind?pageNumber=${page}&pageSize=${size}&sortBy=${sorter.dataIndex} ${sorter.sortOrder ? "desc" : ""}`);
  },
  add: (item) => {
    return requests.post('/v1/documentKind', item)
  },
  get: (id) => {
    return requests.get(`/v1/documentKind/${id}`)
  },
  update: (item) => {
    return requests.post('/v1/documentKind/update', item)
  }
};

const EquipmentTypeService = {
  view: (page, size, sorter = null) => {
    if (sorter == null)
      return requests.get(`/v1/type?pageNumber=${page}&pageSize=${size}`)
    else
      return requests.get(`/v1/type?pageNumber=${page}&pageSize=${size}&sortBy=${sorter.dataIndex} ${sorter.sortOrder ? "desc" : ""}`);
  },
  add: (item) => {
    return requests.post('/v1/type', item)
  },
  get: (id) => {
    return requests.get(`/v1/type/${id}`)
  },
  update: (item) => {
    return requests.post('/v1/type/update', item)
  }
};

const VerificationService = {
  view: (page, size, sorter = null) => {
    if (sorter == null)
      return requests.get(`/v1/verification?pageNumber=${page}&pageSize=${size}`)
    else
      return requests.get(`/v1/verification?pageNumber=${page}&pageSize=${size}&sortBy=${sorter.dataIndex} ${sorter.sortOrder ? "desc" : ""}`);
  },
  add: (item) => {
    return requests.post('/v1/verification', item)
  },
  play: (item) => {
    return requests.post('/v1/verification/play', item)
  },
  reset: (item) => {
    return requests.post('/v1/verification/reset', item)
  },
  delete: (item) => {
    return requests.post('/v1/verification/delete', item)
  },
  return: (item) => {
    return requests.post('/v1/verification/return', item)
  }
};

const ChecksService = {
  view: (page, size, sorter = null) => {
    if (sorter == null)
      return requests.get(`/v1/check?pageNumber=${page}&pageSize=${size}`)
    else
      return requests.get(`/v1/check?pageNumber=${page}&pageSize=${size}&sortBy=${sorter.dataIndex} ${sorter.sortOrder ? "desc" : ""}`);
  },
  add: (item) => {
    return requests.post('/v1/check', item)
  }
};

const FileService = {
  upload: (item) => {
    return requests.post('/v1/files/upload', item)
  }
};

const UserRoleService = {
  view: (id) => {
    return requests.get(`/v1/userrole?userId=${id}`, id)
  },
  grant: (item) => {
    return requests.post('/v1/userrole/grant', item)
  },
  invoke: (item) => {
    return requests.post('/v1/userrole/invoke', item)
  }
};

const RoleService = {
  view: (page, size, sorter = null) => {
    if (sorter == null)
      return requests.get(`/v1/roles?pageNumber=${page}&pageSize=${size}`)
    else
      return requests.get(`/v1/roles?pageNumber=${page}&pageSize=${size}&sortBy=${sorter.dataIndex} ${sorter.sortOrder ? "desc" : ""}`);
  },
  add: (item) => {
    return requests.post('/v1/roles', item)
  },
  get: (id) => {
    return requests.get(`/v1/roles/${id}`)
  },
  update: (item) => {
    return requests.post('/v1/roles/update', item)
  },
  grant: (item) => {
    return requests.post('/v1/roles/grant', item)
  },
  invoke: (item) => {
    return requests.post('/v1/roles/invoke', item)
  },
  getClaim: (id) => {
    return requests.get(`/permission/byrole?roleId=${id}`)
  }
};

export default {
  Auth,
  EquipmentService,
  VerificationService,
  ManufacturerService,
  UsersService,
  DepartmentService,
  ChecksService,
  LocationService,
  DocumentKindService,
  FileService,
  API_ROOT,
  UserRoleService,
  RoleService,
  EquipmentTypeService,
  setToken: _token => { token = _token; }
};
