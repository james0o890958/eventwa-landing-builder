# Eventwa Platform - Admin Interface Functional Breakdown

## Document Overview

This document maps all user (attendee) and organizer functionalities in the Eventwa platform to corresponding admin roles, pages, and management capabilities needed for platform administration.

---

## 🔐 **ADMIN ROLES & PERMISSIONS**

### **Role 1: Super Admin**
**Highest privilege level - Full platform control**

**Permissions:**
- Complete system access
- User management across all roles
- Financial oversight (all transactions, payouts, commissions)
- Content moderation and approval
- System configuration
- Analytics & reporting across entire platform
- Can impersonate any user for support

**Key Pages Needed:**
- Admin Dashboard (platform-wide metrics)
- User Management (bulk operations)
- Financial Management (global view)
- Content Moderation Queue
- System Settings
- Platform Analytics
- Support Ticket System

---

### **Role 2: Platform Moderator**
**Content & community oversight**

**Permissions:**
- Review and approve new organizer applications
- Moderate event listings (approve/reject/flag)
- Handle user reports and complaints
- Manage user suspensions/bans
- Review chatroom content for violations
- Moderate blog posts and comments

**Key Pages Needed:**
- Pending Organizer Applications
- Event Moderation Queue
- User Reports Dashboard
- Content Flagged Items
- Ban/Suspend User Management

---

### **Role 3: Organizer Success Manager**
**Organizer support & growth**

**Permissions:**
- View all organizer accounts (read-only)
- Access organizer analytics (aggregate view)
- Send bulk announcements to organizers
- Review organizer support tickets
- Access organizer resources usage stats
- Monitor organizer activity and engagement

**Key Pages Needed:**
- Organizer Directory (all organizers)
- Organizer Performance Analytics
- Organizer Support Tickets
- Bulk Communications Tool
- Onboarding Progress Tracker

---

### **Role 4: Financial Admin**
**Payment & billing management**

**Permissions:**
- View all transactions (platform-wide)
- Manage payout schedules
- Review payment disputes
- Access commission reports
- Manage subscription plans
- Handle refund requests
- Generate financial statements

**Key Pages Needed:**
- Transaction Ledger (all payments)
- Payout Management
- Dispute Resolution Center
- Commission Analytics
- Subscription Plan Management
- Refund Request Queue
- Financial Reports & Exports

---

### **Role 5: Help Desk / Support Agent**
**User support & troubleshooting**

**Permissions:**
- View user accounts (limited info)
- Access support ticket system
- Reset user passwords (with approval)
- Handle refund requests (within limits)
- Access help center content
- Respond to user inquiries

**Key Pages Needed:**
- Support Ticket Dashboard
- User Lookup (limited fields)
- Password Reset Requests
- Common Issues Database
- FAQ Management
- Live Chat Monitoring

---

### **Role 6: Content Manager**
**Platform content & marketing**

**Permissions:**
- Create/edit blog posts and articles
- Manage help center articles
- Update platform announcements
- Manage featured events
- Edit homepage content
- Manage newsletter campaigns

**Key Pages Needed:**
- Blog Post Editor
- Help Center CMS
- Announcement Composer
- Featured Events Curation
- Homepage Banner Manager
- Newsletter Campaign Tool

---

## 📱 **ADMIN PAGES & MANAGEMENT INTERFACES**

### **1. Admin Dashboard**
**Purpose:** Platform-wide overview and KPIs

**Metrics to Display:**
- Total registered users (breakdown: attendees vs organizers)
- Total events published (draft, live, ended)
- Total ticket sales (revenue, volume)
- Active events this month
- New user signups (daily/weekly/monthly)
- Platform commission earned
- Most popular event categories
- Geographic distribution of users
- System health status

**Widgets:**
- Real-time revenue tracker
- User growth chart
- Event lifecycle funnel
- Top performing organizers
- Recent signups
- Pending moderation items
- System alerts

---

### **2. User Management**
**Path:** `/admin/users`

**Sub-pages:**
- **All Users** (`/admin/users/all`) - Searchable list with filters (role, join date, status, location)
- **Attendees** (`/admin/users/attendees`) - Filter to only attendee accounts
- **Organizers** (`/admin/users/organizers`) - Filter to only organizer accounts
- **User Detail** (`/admin/users/:userId`) - Individual user profile with:
  - Account info (email, join date, last login)
  - Role history
  - Activity log
  - Joined events
  - Purchased tickets
  - Account actions (impersonate, suspend, delete)

**Actions Available:**
- Search/filter users
- Bulk actions (email, suspend, role change)
- View user details
- Edit user information
- Manually verify accounts
- Reset password (with notification)
- View login history
- Export user data (CSV)

---

### **3. Organizer Management**
**Path:** `/admin/organizers`

**Sub-pages:**
- **All Organizers** (`/admin/organizers/all`) - Directory with search and filters
- **Organizer Detail** (`/admin/organizers/:id`) - Complete view:
  - Profile information
  - Events created (list with stats)
  - Revenue and payouts
  - Analytics overview
  - Subscription status
  - Account actions (verify, promote, demote)

**Actions Available:**
- Approve/reject organizer applications
- View organizer analytics
- Manually set verified status
- Promote to featured organizer
- Access organizer audit logs
- Contact organizer (internal messaging)
- Export organizer data

---

### **4. Event Moderation**
**Path:** `/admin/events`

**Sub-pages:**
- **All Events** (`/admin/events/all`) - Full event listing with filters
- **Pending Approval** (`/admin/events/pending`) - Events awaiting moderator review
- **Flagged Events** (`/admin/events/flagged`) - Events reported by users
- **Event Detail** (`/admin/events/:id`) - Full event preview:
  - Event information (title, date, location, description)
  - Organizer information
  - Ticket information and pricing
  - Attendee list preview
  - Moderation actions (approve, reject, flag, request changes)

**Moderation Actions:**
- ✅ Approve event (publish)
- ❌ Reject event (with reason sent to organizer)
- ⚠️ Flag event (auto-hide + notify organizer)
- 📝 Request changes (send feedback to organizer)
- 🚫 Take down event (emergency removal)

**Bulk Operations:**
- Approve multiple events
- Send standard rejection messages
- Export flagged events list

---

### **5. Ticket & Attendee Management**
**Path:** `/admin/attendees`

**Capabilities:**
- Search all attendees across all events
- View attendee details (name, email, tickets purchased)
- Check attendance status (checked-in/not checked-in)
- Access event attendee lists (read-only view of all events)
- Generate platform-wide attendee reports
- Export attendee data (CSV with filters)

**Use Cases:**
- Fraud investigation (duplicate accounts, fake tickets)
- Support user who lost tickets
- Security verification for large events

---

### **6. Financial Management**
**Path:** `/admin/finances`

**Sub-pages:**
- **Overview** (`/admin/finances`) - Platform financial dashboard:
  - Total revenue
  - Platform commissions
  - Organizer payouts
  - Pending payouts
  - Refunds issued
  - Subscription revenue breakdown

- **Transactions** (`/admin/finances/transactions`) - All payment records:
  - Searchable transaction list
  - Filters: date range, event, organizer, status
  - Transaction details (buyer, seller, amount, fees)
  - Refund capability

- **Payouts** (`/admin/finances/payouts`) - Organizer payment management:
  - Pending payouts (awaiting processing)
  - Paid history
  - Scheduled payouts
  - Manual payout trigger (override)
  - Payout reports

- **Subscriptions** (`/admin/finances/subscriptions`) - Plan management:
  - All organizer subscriptions
  - Plan changes history
  - Revenue by plan tier
  - Create/modify subscription plans

- **Disputes & Refunds** (`/admin/finances/disputes`) - Payment issues:
  - Refund requests queue
  - Dispute cases
  - Resolution actions
  - Communication log

---

### **7. Analytics & Reporting**
**Path:** `/admin/analytics`

**Sections:**
- **Platform Overview**
  - User growth (daily/monthly active users)
  - Event creation trends
  - Ticket sales volume
  - Revenue trends
  - Geographic heat maps

- **Organizer Performance**
  - Top organizers (by revenue, events, attendees)
  - Organizer retention rates
  - Average organizer earnings
  - Event success rate

- **Event Analytics**
  - Top events (by tickets sold, revenue)
  - Category performance
  - Event completion rates
  - Cancellation rates

- **User Behavior**
  - Most saved categories
  - Average tickets per purchase
  - Peak booking times
  - User engagement (messages, follows, bookmarks)

- **Export Center**
  - Generate custom reports
  - Scheduled report delivery
  - Data export formats (CSV, JSON, PDF)

---

### **8. Content Management System (CMS)**
**Path:** `/admin/content`

**Sub-pages:**
- **Homepage** (`/admin/content/homepage`) - Hero carousel, featured sections
- **Blog** (`/admin/content/blog`) - Create/edit blog posts, manage categories
- **Help Center** (`/admin/content/help`) - FAQ and help article management
- **Announcements** (`/admin/content/announcements`) - Platform-wide alerts
- **Email Templates** (`/admin/content/emails`) - Transactional email templates
- **SEO Settings** (`/admin/content/seo`) - Meta tags, structured data

**Features:**
- WYSIWYG editor for rich content
- Media library (upload images, videos)
- Draft/publish workflow
- Preview before publishing
- Scheduling (auto-publish)
- Multilingual support (if applicable)

---

### **9. Communication & Messaging**
**Path:** `/admin/communicate`

**Tools:**
- **Bulk Email** - Send targeted emails to users:
  - By user segment (new users, inactive, organizers)
  - By event category interests
  - Custom recipient lists
  - Template-based or custom HTML

- **Push Notifications** - Send app notifications:
  - Platform announcements
  - Maintenance notices
  - Feature updates

- **In-App Messages** - Internal user messaging:
  - Direct message any user
  - Support ticket responses
  - Organizer outreach

- **Schedule Composer** - Plan communications in advance

---

### **10. Platform Settings & Configuration**
**Path:** `/admin/settings`

**Sections:**
- **General Settings**
  - Platform name, logo, branding
  - Contact information
  - Timezone, date format, currency settings
  - Default locale/language

- **Email Configuration**
  - SMTP settings
  - Email sender identity
  - Template branding

- **Payment Gateways**
  - Configure payment providers (Flutterwave, Paystack)
  - API keys & webhooks
  - Transaction fee settings
  - Payout configuration

- **Feature Flags**
  - Enable/disable platform features
  - Beta feature controls
  - A/B testing controls

- **Security Settings**
  - Rate limiting configuration
  - IP blocking/whitelisting
  - Session timeout settings
  - Two-factor auth requirements

- **Tax Configuration**
  - VAT/sales tax settings
  - Tax rate by region
  - Tax reporting settings

---

### **11. Support Ticket System**
**Path:** `/admin/support`

**Features:**
- Ticket queue (all user-submitted tickets)
- Priority tagging (low, medium, high, urgent)
- Assignment to support agents
- Internal notes (private)
- User communication log
- Ticket status tracking (open, pending, resolved, closed)
- SLA monitoring
- Ticket templates for common issues
- Knowledge base integration

---

### **12. System Monitoring**
**Path:** `/admin/system`

**Health Checks:**
- Server status (CPU, memory, disk)
- Database performance
- API response times
- Error rate monitoring
- Third-party service health (Supabase, payment gateways)

**Logs Access:**
- Application logs (with search/filter)
- Error logs
- Audit logs (admin actions)
- Payment webhooks logs
- Authentication logs

---

### **13. Organizer Application Review**
**Path:** `/admin/applications`

**Queue:** `/admin/applications/become-organizer`

**Review Interface:**
- Application details view:
  - Organization name
  - Contact info
  - Website/social media
  - Location data
  - Event type focus
  - Previous experience (if any)

**Reviewer Actions:**
- ✅ Approve → Auto-upgrade to organizer role
- ❌ Reject → Send automated rejection email with reason
- ⏸️ Request More Info → Send message to applicant
- 🏷 Add Tags → "Music Events", "Corporate", etc. for categorization

---

## 🛠️ **IMPLEMENTATION NOTES**

### **Routing Structure**
```
/admin/
  ├── dashboard
  ├── users/
  │    ├── all
  │    ├── attendees
  │    ├── organizers
  │    └── :userId
  ├── organizers/
  │    ├── all
  │    ├── :id
  │    └── applications
  ├── events/
  │    ├── all
  │    ├── pending
  │    ├── flagged
  │    └── :eventId
  ├── attendees/
  │    └── (search across all events)
  ├── finances/
  │    ├── overview
  │    ├── transactions
  │    ├── payouts
  │    ├── subscriptions
  │    └── disputes
  ├── analytics/
  │    ├── platform
  │    ├── organizers
  │    ├── events
  │    └── users
  ├── content/
  │    ├── homepage
  │    ├── blog
  │    ├── help-center
  │    ├── announcements
  │    ├── emails
  │    └── seo
  ├── communicate/
  │    ├── bulk-email
  │    ├── push-notifications
  │    └── in-app-messages
  ├── settings/
  ├── support/
  ├── system/
  └── applications/
```

### **Authentication & Authorization**

**Role-Based Access Control (RBAC) config:**
```typescript
const ROLE_PERMISSIONS = {
  super_admin: ['*'], // all permissions
  moderator: [
    'events:read', 'events:update', 'events:delete',
    'users:read', 'users:suspend',
    'organizer_applications:read', 'organizer_applications:update'
  ],
  support: [
    'users:read', 'support:read', 'support:update',
    'tickets:read', 'refunds:create'
  ],
  finance: [
    'transactions:read', 'payouts:read', 'payouts:update',
    'subscriptions:read', 'refunds:read', 'refunds:update'
  ],
  content_manager: [
    'content:create', 'content:update', 'content:publish'
  ],
  organizer_success: [
    'organizers:read', 'analytics:read',
    'bulk_message:create', 'support:assign'
  ]
};
```

### **Database Tables Needed (if not present)**

1. **admin_users** - Admin accounts
   - id, email, role, permissions, created_at, last_login

2. **admin_audit_logs** - Track all admin actions
   - id, admin_id, action, entity_type, entity_id, old_values, new_values, ip_address, timestamp

3. **moderation_queue** - Events/organizers pending review
   - id, type, entity_id, status, reviewer_id, notes, submitted_at, reviewed_at

4. **support_tickets** - User support tickets
   - id, user_id, subject, description, priority, status, assigned_to, messages[], created_at

5. **system_settings** - Platform configuration
   - key, value, data_type, description, updated_by, updated_at

---

## 📋 **FEATURE MAPPING SUMMARY**

### **Current Platform Features → Admin Oversight Required**

| Feature | Admin Concern | Admin Page |
|---------|---------------|------------|
| User Registration | Account verification, fraud detection | User Management |
| Event Creation | Content moderation, fraud prevention | Event Moderation |
| Ticket Sales | Revenue tracking, payout validation | Financial Management |
| Chat Rooms | Content monitoring, abuse handling | Content Moderation / Support |
| Organizer Applications | Verification, approval workflow | Organizer Applications |
| Subscription Plans | Plan management, revenue analysis | Financial Settings |
| Help Center Articles | Content quality, accuracy | CMS |
| Refunds | Fraud prevention, customer service | Dispute Resolution |
| User Reports | Community safety, moderation | User Reports Dashboard |

---

## 🎯 **PRIORITY IMPLEMENTATION ORDER**

### **Phase 1: Essential Admin Tools (MVP)**
1. Admin Authentication system
2. User Management (view, suspend, basic actions)
3. Event Moderation (approve/reject events)
4. Financial Overview (basic revenue/payout view)
5. Simple support ticket view

### **Phase 2: Operational Excellence**
6. Advanced Analytics Dashboard
7. Bulk communications (email tool)
8. Content Management (blog, help center)
9. Organizer Application Review
10. Detailed financial reports & payout management

### **Phase 3: Growth & Optimization**
11. Advanced user segmentation & targeting
12. Automated moderation rules
13. Advanced reporting (custom report builder)
14. System monitoring & health dashboard
15. Role-based permissions management UI

### **Phase 4: Advanced Features**
16. A/B testing controls
17. Feature flag management
18. Audit log search & analysis
19. API access logs & management
20. Multi-language content management

---

## 🔧 **TECHNICAL REQUIREMENTS**

### **Components to Build**
1. Admin authentication middleware
2. Role-based layout wrapper (AdminLayout)
3. Permission check hooks (`usePermission`, `can()`)
4. Audit logging service
5. Admin-side data tables with advanced filtering
6. File uploader for CMS content
7. Rich text editor integration
8. Chart components for analytics
9. Bulk action handlers
10. Export functionality (CSV, Excel, PDF)

### **Existing Components to Reuse/Leverage**
- DashboardLayout (adapt for admin sidebar)
- DataTable pattern from organizer pages
- Form components (already exist)
- Toast notifications (already exist)
- Modal/Dialog components
- Sheet components

### **Integration Points**
- Supabase for user/organizer/event data
- Existing event data models
- User authentication context (extend for admin)
- Payment transaction records (if logged)
- Notification system (for admin-triggered messages)

---

## 📊 **ADMIN DASHBOARD WIDGETS**

### **Quick Stats Row**
- Total Users (with trend %)
- Total Events Published
- Total Tickets Sold (this month)
- Platform Revenue (this month)
- Pending Moderations (count)
- Open Support Tickets (count)

### **Activity Feed**
- Recent user signups
- New events published
- Recent payouts
- Recent support tickets
- Recent refunds

### **Alerts Panel**
- High-priority events pending review
- Unusual payment activity
- Spike in user reports
- System errors

---

## 📱 **RESPONSIVE DESIGN CONSIDERATIONS**

All admin pages should:
- Work on desktop (primary)
- Have basic tablet support (landscape)
- Mobile-friendly essential views (ticket queue, urgent alerts)
- Admin-heavy pages may require desktop-first approach due to complexity

---

## ✅ **COMPLETION CHECKLIST**

**Before building admin interface:**
- [ ] Define admin roles and permissions matrix
- [ ] Set up admin authentication separate from user auth
- [ ] Create admin_users table in database
- [ ] Implement audit logging middleware
- [ ] Build admin layout shell with sidebar navigation
- [ ] Create role-based route guards
- [ ] Implement search/filter infrastructure
- [ ] Set up data export utilities

**Phase 1 Deliverables (MVP):**
- [ ] Admin login & dashboard
- [ ] User management (view, suspend, search)
- [ ] Event moderation queue (approve/reject)
- [ ] Basic financial overview
- [ ] Simple support ticket viewer

**Phase 2 Deliverables:**
- [ ] Advanced analytics charts
- [ ] Bulk email composer
- [ ] CMS for blog/help articles
- [ ] Organizer application review flow
- [ ] Detailed payout management

**Phase 3+ Enhancements:**
- [ ] Advanced reporting tools
- [ ] Automated moderation rules
- [ ] Feature flag management
- [ ] System monitoring dashboard
- [ ] API gateway dashboard

---

**End of Document**

*This breakdown is based on reverse-engineering the Eventwa platform's existing user and organizer functionality. Each admin role and page corresponds to operational needs that naturally arise from managing a two-sided marketplace of event organizers and attendees.*