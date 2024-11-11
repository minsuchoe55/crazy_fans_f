import { createStore } from 'vuex'

export default createStore({
  state: {
    loading: false,
    profile: null,
    video: null,
    filter_video:null,
    error: null
  },

  getters: {
    isLoading: state => state.loading,
    getProfile: state => state.profile,
    getVideo: state => state.video,
    getError: state => state.error,

  },

  mutations: {
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_PROFILE(state, data) {
      state.profile = data
    },
    SET_VIDEO(state, data) {
      state.video = data
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_FILTER_VIDEO(state, data) {
      state.filter_video = data
    }
  },

  actions: {
    async fetchProfileData({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await fetch(`https://fansonly.b-cdn.net/json/face_thumb.json`)
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()
        commit('SET_PROFILE', data)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async fetchVideoData({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await fetch(`https://fansonly.b-cdn.net/json/video_list.json`)
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()
        commit('SET_VIDEO', data)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    filterVideoData({ commit, state }, searchTerm) {
      commit('SET_LOADING', true)
      try {
        const videos = state.video
        let filteredVideos

        // user로 검색하는 경우
        if (typeof searchTerm === 'string' && !searchTerm.startsWith('#')) {
          filteredVideos = videos.filter(video => video.user === searchTerm)
        } 
        // 해시태그로 검색하는 경우
        else {
          const searchHash = searchTerm.startsWith('#') ? searchTerm : `#${searchTerm}`
          filteredVideos = videos.filter(video => {
            const searchTags = video.search.split(' ')
            return searchTags.some(tag => tag.toLowerCase().includes(searchHash.toLowerCase()))
          })
        }
        
        commit('SET_FILTER_VIDEO', filteredVideos)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    resetFilter({ commit }) {
      commit('SET_FILTER_VIDEO', null)
    }
  }
})