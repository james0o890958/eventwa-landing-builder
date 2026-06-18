# Event Creation API (Organizer) — Backend Technical Documentation

This document analyzes the **event creation** flow only (Organizer side).

## 1) Endpoint / Route
- **HTTP Method:** `POST`
- **URL:** `/api/events`
- **Route definition:** `routes/api.php`

**Route registration (relevant snippet):**
- Organizer routes are registered under:
  - `Route::middleware(['auth:sanctum'])->group(...)`
  - then again inside `Route::middleware(['organizer'])->group(...)`
- Event creation route:
  - `Route::post('events', [EventController::class, 'store']);`

**Route name:** Not specified in the analyzed code.

## 2) Middleware and Permissions Required
Event creation requires:

1. **`auth:sanctum`** (API auth)
   - Request must be authenticated with a valid Laravel Sanctum token.

2. **`organizer` middleware**
   - Applied to the route group that contains `POST /api/events`.
   - In the analyzed repository, `app/Http/Middleware/OrganizerMiddleware.php` is a **no-op** (it simply returns `$next($request)`), so no additional permission checks are enforced in that file.
   - Any further enforcement (role/permission checks) would have to exist elsewhere (not identified in the files available to analysis).

## 3) Controller: `EventController@store`
- **File:** `app/Http/Controllers/Organizer/EventController.php`
- **Method:** `store(Request $request)`

### 3.1 Organizer scoping (server-side business rule)
The controller always sets:
- `organizer_id` to the authenticated user’s organizer record:
  - `organizer_id = $request->user()->organizer->id`
- It injects this into the validated data:
  - `validated['organizer_id'] = $organizer_id;`

**Implication for frontend:** do **not** send `organizer_id` in the request body.

### 3.2 Request validation (exact rules)
The controller calls:

```php
$request->validate([
  'title' => 'required|string|max:255',
  'description' => 'required|string',
  'start_date' => 'required|date',
  'end_date' => 'required|date|after_or_equal:start_date',
  'category_id' => 'required|exists:categories,id',
  'location_id' => 'required|exists:locations,id',
  'price' => 'required|numeric|min:0',
  'capacity' => 'required|integer|min:1',
  'image_url' => 'nullable|url',
  'status' => 'nullable|string|in:draft,published,cancelled',
]);
```

### 3.3 Defaulting logic
If `status` is omitted from the payload:
- it defaults to `draft`.

### 3.4 Persistence
- Uses mass assignment:
  - `Event::create($validated);`

## 4) Exact Request Payload Expected by Backend
### HTTP
- **POST** `/api/events`

### Headers
- `Content-Type: application/json`
- `Authorization: Bearer <sanctum_token>`

### JSON body (field names, types, formats)
#### Required fields
- `title`: `string` (max 255)
- `description`: `string`
- `start_date`: `string` parseable by Laravel validator as a date
- `end_date`: `string` parseable by Laravel validator as a date, and must be `>= start_date`
- `category_id`: `integer` (must exist in `categories.id`)
- `location_id`: `integer` (must exist in `locations.id`)
- `price`: `number` (numeric) and must be `>= 0`
- `capacity`: `integer` and must be `>= 1`

#### Optional fields
- `image_url`: `string` (nullable). If present, must be a valid URL.
- `status`: `string` (nullable). Allowed values:
  - `draft`
  - `published`
  - `cancelled`
  - If omitted, backend sets `draft`.

#### Must NOT be sent
- `organizer_id` (server-derived)

## 5) Validation Rules and Constraints
- `title`: required, string, max length 255
- `description`: required, string
- `start_date`: required, date
- `end_date`: required, date, must be `after_or_equal:start_date`
- `category_id`: required, exists in `categories` table by `id`
- `location_id`: required, exists in `locations` table by `id`
- `price`: required, numeric, min 0
- `capacity`: required, integer, min 1
- `image_url`: optional, must be URL if provided
- `status`: optional, must be one of `draft|published|cancelled`

## 6) Database Tables, Models, and Relationships
### 6.1 Table: `events`
Migration: `database/migrations/2026_05_05_152621_create_events_table.php`

Columns:
- `id` (PK)
- `title` (string)
- `description` (text)
- `start_date` (datetime)
- `end_date` (datetime)
- `organizer_id` (FK → `organizers.id`, cascade delete)
- `category_id` (FK → `categories.id`, cascade delete)
- `location_id` (FK → `locations.id`, cascade delete)
- `price` (decimal(8,2), default 0)
- `capacity` (integer, nullable in schema)
- `image_url` (string, nullable)
- `status` (enum: `draft`, `published`, `cancelled`, default `draft`)
- `created_at`, `updated_at`

### 6.2 Model: `App\Models\Event`
From `app/Models/Event.php`:
- `$fillable` includes:
  - `title, description, start_date, end_date, organizer_id, category_id, location_id, price, capacity, image_url, status`
- `$casts`:
  - `start_date` and `end_date` are cast as `datetime`

Relationships on `Event`:
- `category()`: `belongsTo(Category::class)`
- `location()`: `belongsTo(Location::class)`
- `tickets()`: `hasMany(Ticket::class)`
- `chatrooms()`: `hasOne(Chatroom::class)`
- `promotions()`: `hasMany(Promotion::class)`
- `advertisements()`: `hasMany(Advertisement::class)`
- `blogs()`: `hasMany(Blog::class)`
- `payout()`: `hasMany(Payout::class)`
- `organizer()` is implemented as:
  - `belongsTo(User::class, 'organizer_id')`

### 6.3 Organizer linkage (used during creation)
The controller reads:
- `$user->organizer->id`

From `app/Models/User.php`:
- `organizer()` returns `hasOne(Organizer::class)`

## 7) Success and Error Responses
### Success response (HTTP 201)
Returned by controller:

```json
{
  "status": "success",
  "message": "Event created successfully",
  "event": { /* created event model */ }
}
```

### Validation error (HTTP 422)
If request validation fails, Laravel returns a standard validation error response:
- **HTTP status:** `422`
- **Body:** typically contains an `errors` object keyed by invalid field names.

### Authentication/authorization errors
- If missing/invalid Sanctum token: typically `401 Unauthorized`
- If `organizer` middleware rejects access: typically `403 Forbidden`

(Exact JSON shapes are not overridden in the analyzed code.)

## 8) Business Rules Related to Event Creation
- **Organizer ownership is enforced by server-side scoping**:
  - `organizer_id` is set from the authenticated user’s organizer record.
- **Status default**:
  - If `status` is not provided, it becomes `draft`.
- **Time constraint**:
  - `end_date` must be `>= start_date`.
- **Referential constraints**:
  - `category_id` and `location_id` must exist.
- **Content constraints**:
  - `title` limited to 255 characters.

## 9) Frontend Contract
### Required HTTP headers
- `Content-Type: application/json`
- `Authorization: Bearer <sanctum_token>`

### Frontend must send (successful event creation)
#### JSON payload
```json
{
  "title": "string (max 255)",
  "description": "string",
  "start_date": "string (Laravel-parseable date)",
  "end_date": "string (Laravel-parseable date; must be >= start_date)",
  "category_id": 1,
  "location_id": 1,
  "price": 99.99,
  "capacity": 100,
  "image_url": "https://example.com/image.png",
  "status": "draft"
}
```

#### Notes on formats
- `start_date` / `end_date` should be sent in any Laravel-parseable date string format.
  - Common safe choices: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ssZ`.

#### Optional payload fields
- `image_url` may be omitted or set to `null`.
- `status` may be omitted; backend defaults to `draft`.

#### Must NOT send
- `organizer_id` (server-derived).

