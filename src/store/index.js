import { createStore } from 'vuex'

export default createStore({
  state: {
    loading: false,
    profile: null,
    video: null,
    filter_video: null,
    selectedProfileIndex: null,
    error: null
  },

  getters: {
    isLoading: state => state.loading,
    getProfile: state => state.profile,
    getVideo: state => state.video,
    getError: state => state.error,
    getSelectedProfileIndex: state => state.selectedProfileIndex
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
    },
    SET_SELECTED_PROFILE_INDEX(state, index) {
      state.selectedProfileIndex = index
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
    findSearch({ commit, state }, searchTerm) {
      commit('SET_LOADING', true)
      try {
        const videos = state.video
        const searchHash = searchTerm.startsWith('#') ? searchTerm : `#${searchTerm}`
        const filteredVideos = videos.filter(video => {
          const searchTags = video.search.split(' ')
          return searchTags.some(tag => 
            tag.toLowerCase().includes(searchHash.toLowerCase())
          )
        })
        
        commit('SET_FILTER_VIDEO', filteredVideos)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    findUser({ commit, state }, username) {
      commit('SET_LOADING', true)
      try {
        const videos = state.video
        const profile = state.profile.find(p => p.user === username)
        
        if (profile) {
          let filteredVideos = videos.filter(video => video.user === username)
          const profileIndex = state.profile.findIndex(p => p.user === username)
          commit('SET_SELECTED_PROFILE_INDEX', profileIndex)
          commit('SET_FILTER_VIDEO', filteredVideos)
        } else {
          commit('SET_SELECTED_PROFILE_INDEX', null)
          commit('SET_FILTER_VIDEO', []) // 해당 사용자가 없을 경우 빈 배열
        }
      } catch (error) {
        commit('SET_ERROR', error.message)
        commit('SET_SELECTED_PROFILE_INDEX', null)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    filterVideoData({ dispatch }, searchTerm) {
      if (searchTerm.startsWith('@')) {
        const username = searchTerm.substring(1)
        dispatch('findUser', username)
      } else {
        dispatch('findSearch', searchTerm)
      }
    },
    selectProfile({ commit, dispatch, state }, slide) {
      if (!slide) {
        commit('SET_SELECTED_PROFILE_INDEX', null)
        commit('SET_FILTER_VIDEO', null)
        return
      }

      const profileIndex = state.profile.findIndex(p => p.user === slide.user)
      
      if (state.selectedProfileIndex === profileIndex) {
        commit('SET_SELECTED_PROFILE_INDEX', null)
        commit('SET_FILTER_VIDEO', null)
        return
      }

      commit('SET_SELECTED_PROFILE_INDEX', profileIndex)
      dispatch('filterVideoData', "@" + slide.user)
    },
    resetFilter({ commit }) {
      commit('SET_FILTER_VIDEO', null)
      commit('SET_SELECTED_PROFILE_INDEX', null)
    }
  }
})