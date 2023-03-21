import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import axios from 'axios';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = process.env.REACT_APP_BACKEND_URL || 'https://localhost:9001/api'

const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const client = axios.create({
  baseURL: API_ROOT,
});
    
const tokenPlugin = req => {
  if (token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}
const request = function(options)
{
  const onSuccess = function(response)
  {
    return response.data;
  }

  const onError = function(error)
  {
    console.log('Request Failed:', error.config);

    if (error.response)
    {
      console.error('Data:',    error.response.data);
    }
    else
    {
      console.log('Error Message:', error.message);
    }

    return Promise.reject(error.response || error.message);
  }

  return client(options).then(onSuccess).catch(onError);
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
  get: (url) => 
    request({url: url, method: 'GET', headers: {'Authorization': `Bearer ${token}`}}).then(response => response).catch(response => response),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody).catch(console.log(responseBody)),
  post: (url, body) =>
    request({url: url, method: 'POST', data: body, headers: {'Authorization': `Bearer ${token}`}}).then(response => response).catch(response => response),
  download: (url) =>
    request(
      {
        url: url, 
        method: 'GET', 
        headers: {'Authorization': `Bearer ${token}`},
        responseType: 'blob'
      }).then(response => response).catch(response => response),
  report: (url, body) =>
    request(
      {
        url: url, 
        method: 'POST', 
        data: body,
        headers: {'Authorization': `Bearer ${token}`},
        responseType: 'blob'
      }).then(response => {return response}).catch(response => response),
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
  view: (page, size, sorter = null, filters = null) => {
    let url = computedUrl('/v1/equipment', page, size, sorter);
    let filterUrl = "";
    if (filters) filterUrl = computedFilter(filters);
    
    return requests.get(url + filterUrl)
  },
  add: (item) => {
    return requests.post('/v1/equipment', item)
  },
  get: (id) => {
    return requests.get(`/v1/equipment/detail/${id}`)
  },
  update: (item) => {
    return requests.post(`/v1/equipment/update/${item.id}`, item)
  },
  delete: (id) => {
    return requests.get(`/v1/equipment/delete/${id}`)
  }
};

const ManufacturerService = {
  view: (page, size, sorter = null, filters = null) => {
    let url = computedUrl('/v1/manufacturer', page, size, sorter);
    let filterUrl = "";
    if (filters) filterUrl = computedFilter(filters);
    
    return requests.get(url + filterUrl)
  },
  add: (item) => {
    return requests.post('/v1/manufacturer', item)
  },
  get: (id) => {
    return requests.get(`/v1/manufacturer/${id}`)
  },
  update: (item) => {
    return requests.post('/v1/manufacturer/update', item)
  },
  delete: (id) => {
    return requests.get(`/v1/manufacturer/delete/${id}`)
  }
};

const UsersService = {
  view: (page, size, sorter = null, filters = null) => {
    let url = computedUrl('/v1/user', page, size, sorter);
    let filterUrl = "";
    if (filters) filterUrl = computedFilter(filters);
    
    return requests.get(url + filterUrl)
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
  },
  delete: (id) => {
    return requests.get(`/v1/user/delete/${id}`)
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
  },
  delete: (id) => {
    return requests.get(`/v1/department/delete/${id}`)
  }
};

const LocationService = {
  view: (page, size, sorter = null, filters = null) => {
    let url = computedUrl('/v1/location', page, size, sorter);
    let filterUrl = "";
    if (filters) filterUrl = computedFilter(filters);
    
    return requests.get(url + filterUrl)
  },
  add: (item) => {
    return requests.post('/v1/location', item)
  },
  get: (id) => {
    return requests.get(`/v1/location/${id}`)
  },
  update: (item) => {
    return requests.post('/v1/location/update', item)
  },
  delete: (id) => {
    return requests.get(`/v1/location/delete/${id}`)
  }
};

const DocumentKindService = {
  view: (page, size, sorter = null, filters = null) => {
    let url = computedUrl('/v1/documentKind', page, size, sorter);
    let filterUrl = "";
    if (filters) filterUrl = computedFilter(filters);
    
    return requests.get(url + filterUrl)
  },
  add: (item) => {
    return requests.post('/v1/documentKind', item)
  },
  get: (id) => {
    return requests.get(`/v1/documentKind/${id}`)
  },
  update: (item) => {
    return requests.post('/v1/documentKind/update', item)
  },
  delete: (id) => {
    return requests.get(`/v1/documentKind/delete/${id}`)
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

const EquipmentTagsService = {
  view: (page, size, sorter = null) => {
    if (sorter == null)
      return requests.get(`/v1/tags?pageNumber=${page}&pageSize=${size}`)
    else
      return requests.get(`/v1/tags?pageNumber=${page}&pageSize=${size}&sortBy=${sorter.dataIndex} ${sorter.sortOrder ? "desc" : ""}`);
  },
  get: (id) => {
    return requests.get(`/v1/tags/${id}`)
  },
};

const VerificationService = {
  view: (page, size, sorter = null, filters = null) => {
    let url = computedUrl('/v1/verification', page, size, sorter);
    let filterUrl = "";
    if (filters) filterUrl = computedFilter(filters);
    
    return requests.get(url + filterUrl)
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
  delete: (id) => {
    return requests.get(`/v1/verification/delete/${id}`)
  },
  return: (item) => {
    return requests.post('/v1/verification/return', item)
  }
};

const ChecksService = {
  view: (page, size, sorter = null, filters = null) => {
    let url = computedUrl('/v1/check', page, size, sorter);
    let filterUrl = "";
    if (filters) filterUrl = computedFilter(filters);
    
    return requests.get(url + filterUrl)
  },
  add: (item) => {
    return requests.post('/v1/check', item)
  },
  get: (id) => {
    return requests.get(`/v1/check/${id}`)
  },
  update: (item) => {
    return requests.post('/v1/check/update', item)
  },
  delete: (id) => {
    return requests.get(`/v1/check/delete/${id}`)
  }
};

const InstructionService = {
  view: (page, size, sorter = null, filters = null) => {
    let url = computedUrl('/v1/instruction', page, size, sorter);
    let filterUrl = "";
    if (filters) filterUrl = computedFilter(filters);
    
    return requests.get(url + filterUrl)
  },
  add: (item) => {
    return requests.post('/v1/instruction', item)
  },
  get: (id) => {
    return requests.get(`/v1/instruction/${id}`)
  },
  update: (item) => {
    return requests.post('/v1/instruction/update', item)
  },
  delete: (id) => {
    return requests.get(`/v1/instruction/delete/${id}`)
  }
};

const FileService = {
  upload: (item) => {
    return requests.post('/v1/files/upload', item)
  },
  download: (fileId) => {
    return requests.download(`/file/download/${fileId}`)
  },
  info: (fileId) => {
    return requests.get(`/file/info/${fileId}`)
  }
};

const ReportService = {
  sticker: (item) => {
    return requests.report('/v1/report/sticker', item)
  },
  checkTable: (item) => {
    return requests.report('/v1/report/checktable', item)
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
  view: (page, size, sorter = null, filters = null) => {
    let url = computedUrl('/v1/roles', page, size, sorter);
    let filterUrl = "";
    if (filters) filterUrl = computedFilter(filters);
    
    return requests.get(url + filterUrl)
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
  },
  delete: (id) => {
    return requests.get(`/v1/roles/delete/${id}`)
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
  ReportService,
  EquipmentTagsService,
  InstructionService,
  setToken: _token => { token = _token; }
};
