import { loginApi, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    user: null
  }
}

const state = getDefaultState()

const mutations = {
  // RESET_STATE: (state) => {
  //   Object.assign(state, getDefaultState())
  // },
  // SET_TOKEN: (state, token) => {
  //   state.token = token
  // },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_USER: (state, payload) => {
    state.user = payload;
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    // return new Promise((resolve, reject) => {
    //   loginApi(userInfo).then(response => {
    //     const { data } = response
    //     if (data) {
    //       commit('SET_USER', data);
    //       resolve();
    //     } else {
    //       reject(response);
    //     }
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })

    try {
      const data = await loginApi(userInfo);
      const res = data.data;
      if (res) {
        commit('SET_USER', res);
        return res;
      }
      return Promise.reject(data);
    } catch (e) {
      throw e;
    }
  },

  // get user info
  async getInfo({ commit, state }) {
    // return new Promise((resolve, reject) => {
    //   getInfo().then(res => {

    //     if (typeof res === 'string') {
    //       res = JSON.parse(res);
    //       if (res.code === 401) {
    //         reject(res.msg);
    //       }
    //     } else {
    //       commit('SET_USER', res.data);
    //       resolve();
    //     }
    //   })
    try {
      const data = await getInfo();
      if (typeof data === 'string') {
        data = JSON.parse(data);
        if (data.code === 401) {
          throw new Error('登录过期，请重新登录');
        } 
      } else {
        commit('SET_USER', data.data);
        return data.data;
      }
    } catch (e) {
      throw e;
    }

    // 框架自带方法
    //   getInfo(state.token).then(response => {
    //     const { data } = response

    //     if (!data) {
    //       return reject('Verification failed, please Login again.')
    //     }

    //     const { name, avatar } = data

    //     commit('SET_NAME', name)
    //     commit('SET_AVATAR', avatar)
    //     resolve(data)
    //   }).catch(error => {
    //     reject(error)
    //   })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

