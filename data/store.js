const { v4: uuidv4 } = require('uuid');

const store = {
  departments: [
    { department_id: 'd1', name: 'Computer Science' },
    { department_id: 'd2', name: 'Electronics Engineering' },
    { department_id: 'd3', name: 'Mechanical Engineering' }
  ],
  batches: [
    { batch_id: 'b1', year: 2, department_id: 'd1', name: 'CS-2024' },
    { batch_id: 'b2', year: 3, department_id: 'd1', name: 'CS-2023' },
    { batch_id: 'b3', year: 2, department_id: 'd2', name: 'EC-2024' }
  ],
  subjects: [
    { subject_id: 's1', name: 'Data Structures', hours_per_week: 4, batch_id: 'b1', faculty_id: 'f1' },
    { subject_id: 's2', name: 'Operating Systems', hours_per_week: 3, batch_id: 'b1', faculty_id: 'f2' },
    { subject_id: 's3', name: 'Database Management', hours_per_week: 4, batch_id: 'b1', faculty_id: 'f3' },
    { subject_id: 's4', name: 'Computer Networks', hours_per_week: 3, batch_id: 'b1', faculty_id: 'f1' },
    { subject_id: 's5', name: 'Software Engineering', hours_per_week: 2, batch_id: 'b1', faculty_id: 'f2' },
    { subject_id: 's6', name: 'Machine Learning', hours_per_week: 4, batch_id: 'b2', faculty_id: 'f4' },
    { subject_id: 's7', name: 'Web Technologies', hours_per_week: 3, batch_id: 'b2', faculty_id: 'f3' },
    { subject_id: 's8', name: 'Digital Circuits', hours_per_week: 4, batch_id: 'b3', faculty_id: 'f5' },
    { subject_id: 's9', name: 'Signal Processing', hours_per_week: 3, batch_id: 'b3', faculty_id: 'f5' }
  ],
  faculty: [
    { faculty_id: 'f1', name: 'Dr. Amit Sharma', availability: ['Mon','Tue','Wed','Thu','Fri'] },
    { faculty_id: 'f2', name: 'Prof. Neha Gupta', availability: ['Mon','Tue','Wed','Thu','Fri'] },
    { faculty_id: 'f3', name: 'Dr. Rajesh Kumar', availability: ['Mon','Tue','Thu','Fri'] },
    { faculty_id: 'f4', name: 'Prof. Sunita Patel', availability: ['Tue','Wed','Thu','Fri'] },
    { faculty_id: 'f5', name: 'Dr. Vikram Singh', availability: ['Mon','Wed','Thu','Fri'] }
  ],
  rooms: [
    { room_id: 'r1', name: 'Room 101', capacity: 60 },
    { room_id: 'r2', name: 'Room 102', capacity: 60 },
    { room_id: 'r3', name: 'Lab A', capacity: 30 },
    { room_id: 'r4', name: 'Seminar Hall', capacity: 100 },
    { room_id: 'r5', name: 'Room 201', capacity: 60 }
  ],
  timeslots: [
    { slot_id: 'ts1', start_time: '09:00', end_time: '10:00' },
    { slot_id: 'ts2', start_time: '10:00', end_time: '11:00' },
    { slot_id: 'ts3', start_time: '11:15', end_time: '12:15' },
    { slot_id: 'ts4', start_time: '12:15', end_time: '13:15' },
    { slot_id: 'ts5', start_time: '14:00', end_time: '15:00' },
    { slot_id: 'ts6', start_time: '15:00', end_time: '16:00' }
  ],
  timetables: [],
  scheduleEntries: []
};

module.exports = store;
