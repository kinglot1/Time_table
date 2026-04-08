const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

function generateTimetable(batchId) {
  const batch = store.batches.find(b => b.batch_id === batchId);
  if (!batch) throw new Error('Batch not found');

  const subjects = store.subjects.filter(s => s.batch_id === batchId);
  if (!subjects.length) throw new Error('No subjects found for this batch');

  // Build slot grid: day x timeslot
  const grid = {}; // grid[day][slot_id] = { subject, faculty, room } or null
  DAYS.forEach(day => {
    grid[day] = {};
    store.timeslots.forEach(ts => { grid[day][ts.slot_id] = null; });
  });

  // Tracking allocations
  const facultyBusy = {}; // facultyBusy[faculty_id][day][slot_id] = true
  const roomBusy = {};    // roomBusy[room_id][day][slot_id] = true

  store.faculty.forEach(f => {
    facultyBusy[f.faculty_id] = {};
    DAYS.forEach(day => { facultyBusy[f.faculty_id][day] = {}; });
  });
  store.rooms.forEach(r => {
    roomBusy[r.room_id] = {};
    DAYS.forEach(day => { roomBusy[r.room_id][day] = {}; });
  });

  const entries = [];

  for (const subject of subjects) {
    const faculty = store.faculty.find(f => f.faculty_id === subject.faculty_id);
    if (!faculty) continue;

    let placed = 0;
    const needed = subject.hours_per_week;

    // Try to spread across days
    for (const day of DAYS) {
      if (placed >= needed) break;
      if (!faculty.availability.includes(day)) continue;

      for (const slot of store.timeslots) {
        if (placed >= needed) break;
        if (grid[day][slot.slot_id] !== null) continue;
        if (facultyBusy[faculty.faculty_id][day][slot.slot_id]) continue;

        // Find a free room
        const room = store.rooms.find(r => !roomBusy[r.room_id][day][slot.slot_id]);
        if (!room) continue;

        // Allocate
        grid[day][slot.slot_id] = { subject, faculty, room };
        facultyBusy[faculty.faculty_id][day][slot.slot_id] = true;
        roomBusy[room.room_id][day][slot.slot_id] = true;

        entries.push({
          entry_id: uuidv4(),
          timetable_id: null,
          day,
          slot_id: slot.slot_id,
          start_time: slot.start_time,
          end_time: slot.end_time,
          subject_id: subject.subject_id,
          subject_name: subject.name,
          faculty_id: faculty.faculty_id,
          faculty_name: faculty.name,
          room_id: room.room_id,
          room_name: room.name
        });

        placed++;
      }
    }
  }

  // Save timetable
  const timetable = {
    timetable_id: uuidv4(),
    batch_id: batchId,
    batch_name: batch.name,
    status: 'draft',
    generated_at: new Date().toISOString()
  };

  entries.forEach(e => { e.timetable_id = timetable.timetable_id; });

  // Replace existing timetable for this batch
  store.timetables = store.timetables.filter(t => t.batch_id !== batchId);
  store.scheduleEntries = store.scheduleEntries.filter(e => {
    const tt = store.timetables.find(t => t.timetable_id === e.timetable_id);
    return tt && tt.batch_id !== batchId;
  });

  store.timetables.push(timetable);
  store.scheduleEntries.push(...entries);

  return { timetable, entries };
}

function getTimetableForBatch(batchId) {
  const timetable = store.timetables.find(t => t.batch_id === batchId);
  if (!timetable) return null;
  const entries = store.scheduleEntries.filter(e => e.timetable_id === timetable.timetable_id);
  return { timetable, entries };
}

function publishTimetable(timetableId) {
  const tt = store.timetables.find(t => t.timetable_id === timetableId);
  if (!tt) throw new Error('Timetable not found');
  tt.status = 'published';
  return tt;
}

function modifyEntry(entryId, changes) {
  const entry = store.scheduleEntries.find(e => e.entry_id === entryId);
  if (!entry) throw new Error('Entry not found');
  Object.assign(entry, changes);
  return entry;
}

module.exports = { generateTimetable, getTimetableForBatch, publishTimetable, modifyEntry };
