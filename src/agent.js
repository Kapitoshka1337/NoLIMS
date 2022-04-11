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

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

const Auth = {
  current: () =>
    requests.get('/v1/user/info'),
  login: (login, password) =>
    requests.post('/account/login', { userName: login, password: password }),
  register: (username, email, password) =>
    requests.post('/v1/user', { user: { username, email, password } }),
  save: user =>
    requests.put('/user', { user })
};

// const Tags = {
//   getAll: () => requests.get('/tags')
// };
const EquipmentService = {
  view: (page, size, sorter = null) => {
    if (sorter == null)
      return requests.get(`/v1/equipment?pageNumber=${page}&pageSize=${size}`)
    else
      return requests.get(`/v1/equipment?pageNumber=${page}&pageSize=${size}&sortBy=${sorter.dataIndex} ${sorter.sortOrder ? "desc" : ""}`);
  }
};

const VerificationService = {
  view: (page, size, sorter = null) => {
    if (sorter == null)
      return requests.get(`/v1/equipment?pageNumber=${page}&pageSize=${size}`)
    else
      return requests.get(`/v1/equipment?pageNumber=${page}&pageSize=${size}&sortBy=${sorter.dataIndex} ${sorter.sortOrder ? "desc" : ""}`);
  },
  add: (item) => {
    return requests.post('/v1/verification', item)
  }
};

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = article => Object.assign({}, article, { slug: undefined })
// const Articles = {
//   all: page =>
//     requests.get(`/articles?${limit(10, page)}`),
//   byAuthor: (author, page) =>
//     requests.get(`/articles?author=${encode(author)}&${limit(5, page)}`),
//   byTag: (tag, page) =>
//     requests.get(`/articles?tag=${encode(tag)}&${limit(10, page)}`),
//   del: slug =>
//     requests.del(`/articles/${slug}`),
//   favorite: slug =>
//     requests.post(`/articles/${slug}/favorite`),
//   favoritedBy: (author, page) =>
//     requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
//   feed: () =>
//     requests.get('/articles/feed?limit=10&offset=0'),
//   get: slug =>
//     requests.get(`/articles/${slug}`),
//   unfavorite: slug =>
//     requests.del(`/articles/${slug}/favorite`),
//   update: article =>
//     requests.put(`/articles/${article.slug}`, { article: omitSlug(article) }),
//   create: article =>
//     requests.post('/articles', { article })
// };

// const Comments = {
//   create: (slug, comment) =>
//     requests.post(`/articles/${slug}/comments`, { comment }),
//   delete: (slug, commentId) =>
//     requests.del(`/articles/${slug}/comments/${commentId}`),
//   forArticle: slug =>
//     requests.get(`/articles/${slug}/comments`)
// };

// const Profile = {
//   follow: username =>
//     requests.post(`/profiles/${username}/follow`),
//   get: username =>
//     requests.get(`/profiles/${username}`),
//   unfollow: username =>
//     requests.del(`/profiles/${username}/follow`)
// };

export default {
  Auth,
  EquipmentService,
  VerificationService,
  setToken: _token => { token = _token; }
};
