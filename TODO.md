# TODO

- [ ] Implement fetching blog comments and likes count in `src/pages/BlogPost.tsx` using public endpoints:
  - `GET blogs/{blogId}/comments`
  - `GET blogs/{blogId}/likes`
- [ ] Add current-user like toggling for post likes and comment likes using auth endpoints:
  - `POST blogs/{blogId}/likes` (toggle)
  - `POST blogs/{blogId}/comments/{commentId}/flag` (if reused for likes/flags; confirm once API returns)
- [ ] Fix `BlogPost.tsx` issues before wiring (there is a `zzsetLoading(true)` typo).
- [ ] Update `Comment` type and UI to match API response shape (likes count and is_liked if provided).
- [ ] Replace mocked `comments` state with fetched data and keep local optimistic updates when toggling likes.
- [ ] Manual test in browser: load a blog post, verify comment list count, like counts, and liking/unliking works.
