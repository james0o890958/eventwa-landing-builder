# Backend connectivity report — `src/pages/BlogPost.tsx`

This report documents what parts of the `BlogPost` page are wired to the backend, what’s missing/incomplete, and what endpoints/response fields the backend must provide.

---

## 1) What’s connected to the backend (reads)

### 1.1 Load the blog post
- **Frontend:** `src/pages/BlogPost.tsx` (first `useEffect`)
- **Request:** `GET /blogs/:id`
- **Auth:** sends Bearer token from `localStorage.access_token`
- **Code path:** `api.get(
  `blogs/${id}`,
  undefined,
  token
)`
- **Response fields expected by UI:**
  - `id`
  - `title`
  - `category`
  - `content`
  - `image` **or** `image_url`
  - `author.name` **or** `author`
  - `date` **or** `created_at`
  - `readTime` **or** `read_time`
  - `event_id` (optional; used for the featured event)

**Failure behavior:**
- Toast: “Failed to load blog post.”
- If `post` never gets set, the page renders **“Post Not Found”**.

---

### 1.2 Load linked/featured event (optional)
- **Frontend:** `src/pages/BlogPost.tsx` (inside blog load)
- **Request:** `GET /public/events/:event_id`
- **Auth:** none (no token passed)
- **Response fields expected by UI:**
  - `id`
  - `title`
  - `image` **or** `image_url`
  - `start_date` **or** `date`

**Failure behavior:**
- `.catch(() => null)`; featured block is omitted silently.

---

### 1.3 Load likes count
- **Frontend:** `src/pages/BlogPost.tsx` (second `useEffect`)
- **Request:** `GET /blogs/:id/likes`
- **Auth:** Bearer token from `localStorage.access_token`
- **Response fields expected:**
  - `likes_count` **or** `likes`

**Failure behavior:**
- Errors are swallowed (`catch(() => {})`). UI may show `0`.

---

### 1.4 Load comments list
- **Frontend:** `src/pages/BlogPost.tsx` (second `useEffect`)
- **Request:** `GET /blogs/:id/comments`
- **Auth:** Bearer token from `localStorage.access_token`
- **Response fields expected:**
  - `comments` **or** `data`
  - Must be an array; otherwise UI falls back to `[]`.

**Failure behavior:**
- Errors are swallowed (`catch(() => {})`). UI may show no comments.

---

### 1.5 Load saved/bookmarked state
- **Frontend:** `src/hooks/useSavedBlogs.ts` (used by `BlogPost`)
- **Auth:** Bearer token from `localStorage.access_token`
- **Organizer detection:** derived from parsed `localStorage.user`:
  - checks `is_organizer`, `organizer`, or `user_metadata?.is_organizer`

**Requests:**
- Organizer: `GET /organizer/saved-blogs`
- Attendee: `GET /user/saved-blogs`

---

## 2) What’s connected to the backend (writes)

### 2.1 Like / unlike blog post
- **Frontend:** `src/pages/BlogPost.tsx` (Heart button)
- **Request:** `POST /blogs/:id/likes`
- **Body:** `{}`
- **Auth:** Bearer token
- **Response fields expected:**
  - `likes_count` **or** `likes` (UI uses `likes_count` for post-like update)

---

### 2.2 Save / unsave blog post (bookmark toggle)
- **Frontend:** `src/hooks/useSavedBlogs.ts` (`useBlogBookmark`)

**Requests:**
- Organizer: `POST /organizer/blogs/:blogId/save`
- Attendee: `POST /user/blogs/:blogId/save`

**Body:** `{}`

**UI behavior:**
- Optimistic update of React Query cache (`['saved-blogs']`)
- Then invalidates cache on settle.

---

## 3) Auth / token dependency (how backend calls authenticate)

### 3.1 Token source
- `BlogPost.tsx` reads `localStorage.getItem('access_token')` directly.

### 3.2 AuthContext behavior
- `src/contexts/AuthContext.tsx`
- If `AUTH_CONFIG.AUTH_ENABLED` is true:
  - Supabase manages auth state.
- Regardless, REST API calls in `BlogPost` depend on `localStorage.access_token` being present.

---

## 4) What doesn’t work yet / not fully connected

### 4.1 “Post Comment” is NOT wired to the backend
- The “Post Comment” button only does an **optimistic local state update**:
  - creates a local comment object
  - prepends it to `comments`
  - shows toast
- **No** `api.post(...)` call exists for comments creation.

**Result:**
- The comment appears immediately, but it will not persist after refresh and will not exist in backend data.

### 4.2 “Reply” is UI-only
- Reply button has no click handler.

### 4.3 Silent failures for likes/comments/featured event
- likes/comments fetches swallow errors (`catch(() => {})`).
- featured event fetch uses `catch(() => null)`.

---

## 5) Backend endpoints required to make this page complete

Minimum required to match current UI behavior:
- `GET /blogs/:id`
- `GET /blogs/:id/likes`
- `POST /blogs/:id/likes`
- `GET /blogs/:id/comments`
- `GET /user/saved-blogs` and `POST /user/blogs/:id/save`
- `GET /organizer/saved-blogs` and `POST /organizer/blogs/:id/save`
- Optional: `GET /public/events/:event_id`

**Missing but required for full functionality:**
- `POST /blogs/:id/comments` (or the backend equivalent), plus frontend wiring.

---

## 6) Most important “left to connect” items

1) **Implement comment persistence on backend**
   - Add `POST /blogs/:id/comments`.
   - Update `BlogPost.tsx` to call it instead of only optimistic state.

2) Optional follow-ups
   - Reply threading endpoints + UI handling.
   - Improve error visibility for likes/comments fetches.

