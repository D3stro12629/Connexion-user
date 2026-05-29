import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/http'

export const usePostStore = defineStore('post', () => {

  // ── State ──────────────────────────────────────────────
  const posts       = ref([])   // GET /api/posts  → res.data.data[]
  const post        = ref(null) // GET /api/posts/:id → res.data.data
  const ownPosts    = ref([])   // reserved for profile "All Post" tab
  const searchQuery = ref('')   // current search term — watched by HomeView for scroll-to-top
  const searchUsers = ref([])   // users matching the current search — shown in HomeView feed

  // ── Pagination ─────────────────────────────────────────
  const pagination = reactive({
    has_page:       false,
    on_first_page:  true,
    has_more_pages: false,
    first_item:     1,
    last_item:      0,
    total:          0,
    current_page:   1,
    last_page:      1,
  })

  // ── GET /api/posts ─────────────────────────────────────
  async function fetchPosts(search = '', page = 1, perPage = 20, category = 0) {
    try {
      const res = await api.get('/api/posts', {
        params: {
          search,
          page,
          per_page: perPage,
          category,
        },
      })

      posts.value = res.data.data ?? []

      const p = res.data.paginate ?? {}
      pagination.has_page       = p.has_page       ?? false
      pagination.on_first_page  = p.on_first_page  ?? true
      pagination.has_more_pages = p.has_more_pages ?? false
      pagination.first_item     = p.first_item     ?? 1
      pagination.last_item      = p.last_item      ?? 0
      pagination.total          = p.total          ?? 0
      pagination.current_page   = p.current_page   ?? 1
      pagination.last_page      = p.last_page      ?? 1

    } catch (error) {
      console.error('Failed to fetch posts:', error)
      throw error
    }
  }

  // ── GET /api/posts (with append for pagination) ────────
  async function fetchPostsAppend(search = '', page = 1, perPage = 20, category = 0) {
    try {
      const res = await api.get('/api/posts', {
        params: {
          search,
          page,
          per_page: perPage,
          category,
        },
      })

      if (page > 1) {
        posts.value = [...posts.value, ...(res.data.data ?? [])]
      } else {
        posts.value = res.data.data ?? []
      }

      const p = res.data.paginate ?? {}
      pagination.has_page       = p.has_page       ?? false
      pagination.on_first_page  = p.on_first_page  ?? true
      pagination.has_more_pages = p.has_more_pages ?? false
      pagination.first_item     = p.first_item     ?? 1
      pagination.last_item      = p.last_item      ?? 0
      pagination.total          = p.total          ?? 0
      pagination.current_page   = p.current_page   ?? 1
      pagination.last_page      = p.last_page      ?? 1

    } catch (error) {
      console.error('Failed to fetch posts:', error)
      throw error
    }
  }

  // ── POST /api/posts ────────────────────────────────────
  async function addPost(payload) {
    try {
      const res = await api.post('/api/posts', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data.result) {
        posts.value.unshift(res.data.data)
        pagination.total = (pagination.total ?? 0) + 1
      }
      return res
    } catch (error) {
      console.error('Failed to add post:', error)
      throw error
    }
  }

  // ── GET /api/posts/:id ─────────────────────────────────
  async function fetchPostById(id) {
    try {
      const res = await api.get(`/api/posts/${id}`)
      if (res.data.result) {
        post.value = res.data.data
      }
      return res
    } catch (error) {
      console.error('Failed to fetch post:', error)
      throw error
    }
  }

  // ── GET /api/user/posts ────────────────────────────────
  async function fetchOwnPosts(page = 1, perPage = 20) {
    try {
      const res = await api.get('/api/user/posts', {
        params: {
          page,
          per_page: perPage,
        },
      })

      ownPosts.value = res.data.data ?? []

      const p = res.data.paginate ?? {}
      pagination.has_page       = p.has_page       ?? false
      pagination.on_first_page  = p.on_first_page  ?? true
      pagination.has_more_pages = p.has_more_pages ?? false
      pagination.first_item     = p.first_item     ?? 1
      pagination.last_item      = p.last_item      ?? 0
      pagination.total          = p.total          ?? 0
      pagination.current_page   = p.current_page   ?? 1
      pagination.last_page      = p.last_page      ?? 1

    } catch (error) {
      console.error('Failed to fetch own posts:', error)
      throw error
    }
  }

  // ── GET /api/user/posts (with append for pagination) ───
  async function fetchOwnPostsAppend(page = 1, perPage = 20) {
    try {
      const res = await api.get('/api/user/posts', {
        params: {
          page,
          per_page: perPage,
        },
      })

      if (page > 1) {
        ownPosts.value = [...ownPosts.value, ...(res.data.data ?? [])]
      } else {
        ownPosts.value = res.data.data ?? []
      }

      const p = res.data.paginate ?? {}
      pagination.has_page       = p.has_page       ?? false
      pagination.on_first_page  = p.on_first_page  ?? true
      pagination.has_more_pages = p.has_more_pages ?? false
      pagination.first_item     = p.first_item     ?? 1
      pagination.last_item      = p.last_item      ?? 0
      pagination.total          = p.total          ?? 0
      pagination.current_page   = p.current_page   ?? 1
      pagination.last_page      = p.last_page      ?? 1

    } catch (error) {
      console.error('Failed to fetch own posts:', error)
      throw error
    }
  }

  // ── GET /api/user/posts/:id ────────────────────────────
  async function fetchOwnPostById(id) {
    try {
      const res = await api.get(`/api/user/posts/${id}`)
      if (res.data.result) {
        post.value = res.data.data
      }
      return res
    } catch (error) {
      console.error('Failed to fetch own post:', error)
      throw error
    }
  }

  // ── UPDATE /api/posts/:id ──────────────────────────────

async function updatePost(id, payload) {
  try {
  const res = await api.post(`/api/posts/${id}?_method=POST`, payload, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
    if (res.data.result) {
      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1) posts.value[index] = res.data.data
      const ownIndex = ownPosts.value.findIndex(p => p.id === id)
      if (ownIndex !== -1) ownPosts.value[ownIndex] = res.data.data
      if (post.value?.id === id) post.value = res.data.data
    }
    return res
  } catch (error) {
    console.error('Failed to update post:', error)
    throw error
  }
}
  // ── DELETE /api/posts/:id ──────────────────────────────
  async function deletePost(id) {
    try {
      const res = await api.delete(`/api/posts/${id}`)
      if (res.data.result) {
        posts.value    = posts.value.filter(p => p.id !== id)
        ownPosts.value = ownPosts.value.filter(p => p.id !== id)
        pagination.total = Math.max(0, (pagination.total ?? 1) - 1)
        if (post.value?.id === id) post.value = null
      }
      return res
    } catch (error) {
      console.error('Failed to delete post:', error)
      throw error
    }
  }

  // ── Helpers ────────────────────────────────────────────
  function clearPost()  { post.value  = null }
  function clearPosts() {
    posts.value = []
    Object.assign(pagination, {
      has_page: false, on_first_page: true, has_more_pages: false,
      first_item: 1, last_item: 0, total: 0, current_page: 1, last_page: 1,
    })
  }

  return {
    // state
    posts,
    post,
    ownPosts,
    pagination,
    searchQuery,
    searchUsers,
    // actions
    fetchPosts,
    fetchPostsAppend,
    fetchOwnPosts,
    fetchOwnPostsAppend,
    addPost,
    updatePost,
    fetchPostById,
    fetchOwnPostById,
    deletePost,
    clearPost,
    clearPosts,
  }
})