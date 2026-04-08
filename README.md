# TimeForge — Timetable Scheduling System

A full-stack Node.js + Express web application for academic timetable generation, based on the class diagram and use cases provided.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in browser
http://localhost:3000
```

For development with auto-reload:
```bash
npm install -g nodemon
npm run dev
```

---

## 📁 Project Structure

```
timetable-app/
├── server.js              # Express entry point
├── package.json
├── data/
│   └── store.js           # In-memory data store (seeded with sample data)
├── routes/
│   ├── api.js             # All REST API routes
│   └── generator.js       # Timetable generation algorithm
└── public/
    └── index.html         # Full frontend SPA
```

---

## 🗓 Features

### Admin
- **Dashboard** — live stats, timetable status overview
- **Generate Timetable** — auto-schedule subjects for a batch
  - Respects faculty availability (days)
  - No room double-booking
  - Spreads sessions across the week
  - Reports unplaced slots (conflicts)
- **View Timetable** — visual Mon–Fri grid
  - Color-coded by subject
  - Delete individual sessions
  - Publish timetable
  - Export to CSV
- **Manage Departments, Batches, Subjects, Faculty, Rooms**

### Roles (from use case diagram)
| Feature            | Admin | Teacher | Student |
|--------------------|-------|---------|---------|
| Generate Timetable | ✅    | —       | —       |
| Modify Timetable   | ✅    | —       | —       |
| Publish Timetable  | ✅    | —       | —       |
| View Timetable     | ✅    | ✅      | ✅      |
| Export Timetable   | ✅    | ✅      | —       |

---

## 🔌 REST API

| Method | Endpoint                        | Description              |
|--------|----------------------------------|--------------------------|
| GET    | /api/departments                | List departments         |
| POST   | /api/departments                | Add department           |
| DELETE | /api/departments/:id            | Delete department        |
| GET    | /api/batches?department_id=     | List batches             |
| POST   | /api/batches                    | Add batch                |
| GET    | /api/subjects?batch_id=         | List subjects            |
| POST   | /api/subjects                   | Add subject              |
| PUT    | /api/subjects/:id               | Update subject           |
| GET    | /api/faculty                    | List faculty             |
| POST   | /api/faculty                    | Add faculty              |
| PUT    | /api/faculty/:id                | Update faculty           |
| GET    | /api/rooms                      | List rooms               |
| POST   | /api/rooms                      | Add room                 |
| POST   | /api/timetable/generate         | Generate timetable       |
| GET    | /api/timetable/:batch_id        | Get timetable for batch  |
| POST   | /api/timetable/:id/publish      | Publish timetable        |
| PUT    | /api/timetable/entry/:id        | Update a schedule entry  |
| DELETE | /api/timetable/entry/:id        | Remove a schedule entry  |
| GET    | /api/stats                      | Dashboard stats          |

---

## 🧠 Algorithm

The generator uses a **greedy constraint-satisfaction** approach:

1. For each subject in the batch:
   - Get required `hours_per_week`
   - Get assigned faculty and their available days
2. Iterate through days × timeslots
3. For each free slot: check faculty not busy + room available
4. Assign and mark both as occupied
5. Report any unplaced sessions as conflicts

### Constraints enforced
- ✅ Faculty can't teach two classes simultaneously
- ✅ A room can't be double-booked
- ✅ Faculty availability days are respected
- ✅ Sessions spread across the week

---

## 🔮 Next Steps

- Add authentication (Admin / Teacher / Student roles)
- Connect to a real database (PostgreSQL / MongoDB)
- Add constraint editor (max sessions/day, lunch breaks)
- Teacher/Student view-only portals
- Email notifications on publish
