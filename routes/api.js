const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { generateTimetable, getTimetableForBatch, publishTimetable, modifyEntry } = require('./generator');
const { v4: uuidv4 } = require('uuid');

// --- Departments ---
router.get('/departments', (req, res) => res.json(store.departments));
router.post('/departments', (req, res) => {
  const dept = { department_id: uuidv4(), ...req.body };
  store.departments.push(dept);
  res.json(dept);
});
router.delete('/departments/:id', (req, res) => {
  store.departments = store.departments.filter(d => d.department_id !== req.params.id);
  res.json({ ok: true });
});

// --- Batches ---
router.get('/batches', (req, res) => {
  const { department_id } = req.query;
  const batches = department_id
    ? store.batches.filter(b => b.department_id === department_id)
    : store.batches;
  res.json(batches);
});
router.post('/batches', (req, res) => {
  const batch = { batch_id: uuidv4(), ...req.body };
  store.batches.push(batch);
  res.json(batch);
});
router.delete('/batches/:id', (req, res) => {
  store.batches = store.batches.filter(b => b.batch_id !== req.params.id);
  res.json({ ok: true });
});

// --- Subjects ---
router.get('/subjects', (req, res) => {
  const { batch_id } = req.query;
  const subjects = batch_id
    ? store.subjects.filter(s => s.batch_id === batch_id)
    : store.subjects;
  res.json(subjects);
});
router.post('/subjects', (req, res) => {
  const subject = { subject_id: uuidv4(), ...req.body };
  store.subjects.push(subject);
  res.json(subject);
});
router.put('/subjects/:id', (req, res) => {
  const s = store.subjects.find(s => s.subject_id === req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  Object.assign(s, req.body);
  res.json(s);
});
router.delete('/subjects/:id', (req, res) => {
  store.subjects = store.subjects.filter(s => s.subject_id !== req.params.id);
  res.json({ ok: true });
});

// --- Faculty ---
router.get('/faculty', (req, res) => res.json(store.faculty));
router.post('/faculty', (req, res) => {
  const f = { faculty_id: uuidv4(), ...req.body };
  store.faculty.push(f);
  res.json(f);
});
router.put('/faculty/:id', (req, res) => {
  const f = store.faculty.find(f => f.faculty_id === req.params.id);
  if (!f) return res.status(404).json({ error: 'Not found' });
  Object.assign(f, req.body);
  res.json(f);
});
router.delete('/faculty/:id', (req, res) => {
  store.faculty = store.faculty.filter(f => f.faculty_id !== req.params.id);
  res.json({ ok: true });
});

// --- Rooms ---
router.get('/rooms', (req, res) => res.json(store.rooms));
router.post('/rooms', (req, res) => {
  const room = { room_id: uuidv4(), name: req.body.name, capacity: req.body.capacity };
  store.rooms.push(room);
  res.json(room);
});
router.delete('/rooms/:id', (req, res) => {
  store.rooms = store.rooms.filter(r => r.room_id !== req.params.id);
  res.json({ ok: true });
});

// --- Timetable Generation ---
router.post('/timetable/generate', (req, res) => {
  try {
    const { batch_id } = req.body;
    if (!batch_id) return res.status(400).json({ error: 'batch_id required' });
    const result = generateTimetable(batch_id);
    res.json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/timetable/:batch_id', (req, res) => {
  const result = getTimetableForBatch(req.params.batch_id);
  if (!result) return res.status(404).json({ error: 'No timetable found' });
  res.json(result);
});

router.post('/timetable/:id/publish', (req, res) => {
  try {
    const tt = publishTimetable(req.params.id);
    res.json(tt);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/timetable/entry/:id', (req, res) => {
  try {
    const entry = modifyEntry(req.params.id, req.body);
    res.json(entry);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/timetable/entry/:id', (req, res) => {
  store.scheduleEntries = store.scheduleEntries.filter(e => e.entry_id !== req.params.id);
  res.json({ ok: true });
});

// --- Stats ---
router.get('/stats', (req, res) => {
  res.json({
    departments: store.departments.length,
    batches: store.batches.length,
    subjects: store.subjects.length,
    faculty: store.faculty.length,
    rooms: store.rooms.length,
    timetables: store.timetables.length,
    published: store.timetables.filter(t => t.status === 'published').length
  });
});

module.exports = router;
