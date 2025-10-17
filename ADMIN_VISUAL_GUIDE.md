# 🎨 Admin Dashboard - Visual Guide

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Navbar (with Admin link for admin users)                  │
└─────────────────────────────────────────────────────────────┘
┌──────────────┬──────────────────────────────────────────────┐
│              │                                              │
│   SIDEBAR    │           MAIN CONTENT AREA                  │
│              │                                              │
│  ┌────────┐  │  ┌────────────────────────────────────────┐ │
│  │ Admin  │  │  │                                        │ │
│  │ Panel  │  │  │     Page Content (Outlet)              │ │
│  └────────┘  │  │                                        │ │
│              │  │  - Dashboard Overview                  │ │
│  User Info   │  │  - Manage Hospitals                    │ │
│  ┌────────┐  │  │  - Manage Doctors                      │ │
│  │  JD    │  │  │  - Manage Treatments                   │ │
│  │ John   │  │  │  - Manage Users                        │ │
│  │ Admin  │  │  │                                        │ │
│  └────────┘  │  └────────────────────────────────────────┘ │
│              │                                              │
│ Navigation   │                                              │
│ ┌──────────┐ │                                              │
│ │Dashboard │ │                                              │
│ │Hospitals │ │                                              │
│ │Doctors   │ │                                              │
│ │Treatments│ │                                              │
│ │Users     │ │                                              │
│ │Reports   │ │                                              │
│ │Settings  │ │                                              │
│ └──────────┘ │                                              │
│              │                                              │
│ ┌──────────┐ │                                              │
│ │ Logout   │ │                                              │
│ └──────────┘ │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

---

## 🏠 Dashboard Overview Page

```
┌─────────────────────────────────────────────────────────────┐
│  Admin Dashboard                                            │
│  Manage your medical tourism platform                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ 🏥 Total         │ │ 👨‍⚕️ Total        │ │ 💊 Total         │
│ Hospitals        │ │ Doctors          │ │ Treatments       │
│                  │ │                  │ │                  │
│      42          │ │      156         │ │      89          │
└──────────────────┘ └──────────────────┘ └──────────────────┘

┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ 📋 Total         │ │ 📈 Total         │ │ 💰 Total         │
│ Inquiries        │ │ Bookings         │ │ Revenue          │
│                  │ │                  │ │                  │
│      234         │ │      178         │ │   $1,234,567     │
└──────────────────┘ └──────────────────┘ └──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Quick Actions                                              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ 🏥           │  │ 👨‍⚕️          │  │ 💊           │     │
│  │ Manage       │  │ Manage       │  │ Manage       │     │
│  │ Hospitals    │  │ Doctors      │  │ Treatments   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏥 Manage Hospitals Page

```
┌─────────────────────────────────────────────────────────────┐
│  Manage Hospitals                          [+ Add Hospital] │
│  Add, edit, or remove hospitals                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🔍 Search hospitals...                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Hospital          │ Location      │ Rating │ Status │ Actions│
├─────────────────────────────────────────────────────────────┤
│ 🏥 City Hospital │ New York, USA │ ★ 4.5  │ Active │ ✏️ 🗑️  │
│ contact@city.com │               │        │        │        │
├─────────────────────────────────────────────────────────────┤
│ 🏥 Care Center   │ London, UK    │ ★ 4.8  │ Active │ ✏️ 🗑️  │
│ info@care.com    │               │        │        │        │
└─────────────────────────────────────────────────────────────┘
```

### Hospital Form Modal

```
┌─────────────────────────────────────────────────────────────┐
│  Add Hospital                                          [X]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Hospital Name *        Email *                             │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │              │      │              │                    │
│  └──────────────┘      └──────────────┘                    │
│                                                             │
│  Phone *                City *                              │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │              │      │              │                    │
│  └──────────────┘      └──────────────┘                    │
│                                                             │
│  Country *              Status                              │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │              │      │ Active ▼     │                    │
│  └──────────────┘      └──────────────┘                    │
│                                                             │
│  Address *                                                  │
│  ┌─────────────────────────────────────┐                   │
│  │                                     │                   │
│  └─────────────────────────────────────┘                   │
│                                                             │
│  Description                                                │
│  ┌─────────────────────────────────────┐                   │
│  │                                     │                   │
│  │                                     │                   │
│  └─────────────────────────────────────┘                   │
│                                                             │
│  [  Cancel  ]              [ Save Hospital ]                │
└─────────────────────────────────────────────────────────────┘
```

---

## 👨‍⚕️ Manage Doctors Page

```
┌─────────────────────────────────────────────────────────────┐
│  Manage Doctors                              [+ Add Doctor] │
│  Add, edit, or remove doctors                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🔍 Search doctors...                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Doctor           │ Specialization │ Experience │ Actions    │
├─────────────────────────────────────────────────────────────┤
│ 👨‍⚕️ Dr. John Doe│ Cardiology     │ 15 years   │ ✏️ 🗑️      │
│ john@example.com │                │            │            │
├─────────────────────────────────────────────────────────────┤
│ 👩‍⚕️ Dr. Jane    │ Neurology      │ 12 years   │ ✏️ 🗑️      │
│ jane@example.com │                │            │            │
└─────────────────────────────────────────────────────────────┘
```

---

## 💊 Manage Treatments Page

```
┌─────────────────────────────────────────────────────────────┐
│  Manage Treatments                      [+ Add Treatment]   │
│  Add, edit, or remove treatments                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🔍 Search treatments...                                    │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ 💊               │ │ 💊               │ │ 💊               │
│                  │ │                  │ │                  │
│ Heart Surgery    │ │ Knee Replacement │ │ Dental Implants  │
│ Cardiac surgery  │ │ Orthopedic...    │ │ Dental care...   │
│                  │ │                  │ │                  │
│ Category: Cardiac│ │ Category: Ortho  │ │ Category: Dental │
│ Duration: 7 days │ │ Duration: 14 days│ │ Duration: 3 days │
│ Price: $10k-$20k │ │ Price: $8k-$15k  │ │ Price: $2k-$5k   │
│                  │ │                  │ │                  │
│      ✏️ 🗑️       │ │      ✏️ 🗑️       │ │      ✏️ 🗑️       │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## 👥 Manage Users Page

```
┌─────────────────────────────────────────────────────────────┐
│  Manage Users                                               │
│  View and manage user accounts                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🔍 Search users...                                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ User             │ Role      │ Status  │ Joined  │ Actions  │
├─────────────────────────────────────────────────────────────┤
│ 👤 John Doe     │ Patient ▼ │ Active  │ Jan 2024│ 🔄 🛡️    │
│ john@email.com  │           │         │         │          │
├─────────────────────────────────────────────────────────────┤
│ 👤 Jane Smith   │ Admin ▼   │ Active  │ Feb 2024│ 🔄 🛡️    │
│ jane@email.com  │           │         │         │          │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Total Users      │ │ Active Users     │ │ Admins           │
│                  │ │                  │ │                  │
│      156         │ │      142         │ │       8          │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## 🎨 Color Coding

### Status Badges
- 🟢 **Active** - Green background (#10b981)
- 🔴 **Inactive** - Red background (#ef4444)

### Action Buttons
- 🔵 **Edit** - Sky blue (#0ea5e9)
- 🔴 **Delete** - Red (#ef4444)
- 🟢 **Add** - Sky blue (#0ea5e9)

### Statistics Cards
- 🔵 **Hospitals** - Blue (#3b82f6)
- 🟣 **Doctors** - Purple (#a855f7)
- 🟢 **Treatments** - Green (#10b981)
- 🟡 **Inquiries** - Yellow (#f59e0b)
- 🔴 **Bookings** - Pink (#ec4899)
- 💚 **Revenue** - Emerald (#10b981)

---

## 📱 Responsive Behavior

### Desktop (> 1024px)
```
┌────────┬──────────────────────────────────┐
│        │                                  │
│ SIDE   │     FULL CONTENT                 │
│ BAR    │                                  │
│        │                                  │
└────────┴──────────────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌────────┬──────────────────────┐
│        │                      │
│ SIDE   │   CONTENT            │
│ BAR    │   (2 columns)        │
│        │                      │
└────────┴──────────────────────┘
```

### Mobile (< 768px)
```
┌──────────────────────────────┐
│  [☰] Header                  │
├──────────────────────────────┤
│                              │
│  Content                     │
│  (1 column)                  │
│                              │
└──────────────────────────────┘
```

---

## 🔄 User Flow Examples

### Adding a Hospital
```
1. Click "Admin" in navbar
2. Click "Hospitals" in sidebar
3. Click "+ Add Hospital" button
4. Fill in form fields
5. Click "Save Hospital"
6. Hospital appears in table
```

### Editing a Doctor
```
1. Navigate to Manage Doctors
2. Find doctor in table
3. Click edit icon (✏️)
4. Modify form fields
5. Click "Save Doctor"
6. Changes reflected in table
```

### Deleting a Treatment
```
1. Navigate to Manage Treatments
2. Find treatment card
3. Click delete icon (🗑️)
4. Confirm deletion
5. Treatment removed from grid
```

### Managing User Roles
```
1. Navigate to Manage Users
2. Find user in table
3. Change role dropdown
4. Confirm role change
5. Role updated immediately
```

---

## 🎯 Key Features Visual

### Search Functionality
```
┌─────────────────────────────────────────┐
│  🔍 Search...                           │
└─────────────────────────────────────────┘
         ↓
    Filters results instantly
         ↓
┌─────────────────────────────────────────┐
│  Matching results only                  │
└─────────────────────────────────────────┘
```

### Modal Forms
```
Background Page (Dimmed)
         ↓
┌─────────────────────────┐
│  Form Modal (Centered)  │
│  ┌───────────────────┐  │
│  │ Form Fields       │  │
│  │                   │  │
│  │ [Cancel] [Save]   │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

### Confirmation Dialogs
```
Action Triggered (Delete)
         ↓
┌─────────────────────────┐
│  Are you sure?          │
│  [Cancel] [Confirm]     │
└─────────────────────────┘
         ↓
    Action Executed
```

---

## 🎨 Icon Legend

- 🏥 Hospital
- 👨‍⚕️ Doctor
- 💊 Treatment
- 👤 User
- 🔍 Search
- ✏️ Edit
- 🗑️ Delete
- ➕ Add
- 🔄 Toggle Status
- 🛡️ Delete User
- ⭐ Rating
- 📊 Statistics
- 📈 Analytics
- 💰 Revenue
- 📋 Inquiries
- 📅 Bookings

---

**This visual guide helps you understand the layout and structure of the Admin Dashboard!**
