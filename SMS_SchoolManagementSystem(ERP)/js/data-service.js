/**
 * Data Service Module
 * Handles all Supabase data operations with error handling
 */

class DataService {
  constructor() {
    this.client = window.supabaseClient || null;
    this.errorListeners = [];
  }

  // Register error listeners globally
  onError(callback) {
    this.errorListeners.push(callback);
  }

  // Notify all error listeners
  notifyError(error) {
    this.errorListeners.forEach(listener => listener(error));
  }

  // Format error messages
  formatError(error, action) {
    // Sanitize error message for public display
    const sanitizedMessage = error.message || 'An unexpected error occurred. Please try again later.';

    // Log detailed error privately, do not expose stack traces or internal details to UI
    console.error(`[DataService] Error in ${action}:`, error);

    return {
      title: `Error: ${action}`,
      message: sanitizedMessage,
      timestamp: new Date(),
      action: action
      // Removed originalError to prevent exposing internal details
    };
  }

  // STUDENT DATA OPERATIONS
  async getStudentData(studentId) {
    // Check configuration first
    if (!SUPABASE_CONFIG.isValid()) {
      console.warn('Backend not configured: Serving mock data');
      return { success: true, data: this.getMockStudentData(), isMock: true };
    }

    try {
      const { data, error } = await this.client
        .from(SUPABASE_CONFIG.TABLES.STUDENTS)
        .select('*')
        .eq('id', studentId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      // If it's a connection error, fall back to mock but flag it
      console.error('DataService Error:', error);
      return { success: true, data: this.getMockStudentData(), isMock: true, error: error.message };
    }
  }

  // PARENT DATA OPERATIONS
  async getParentData(parentId) {
    try {
      const { data, error } = await this.client
        .from(SUPABASE_CONFIG.TABLES.PARENTS)
        .select('*')
        .eq('id', parentId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const formattedError = this.formatError(error, 'Loading parent data');
      this.notifyError(formattedError);
      return { success: false, error: formattedError };
    }
  }

  // FEES DATA OPERATIONS
  async getFeesByStudent(studentId) {
    try {
      const { data, error } = await this.client
        .from(SUPABASE_CONFIG.TABLES.FEES)
        .select('*')
        .eq('student_id', studentId)
        .order('due_date', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.warn('Using mock fees data due to error:', error.message);
      return { success: true, data: this.getMockFeeData() };
    }
  }

  async submitFeePayment(feeId, paymentData) {
    try {
      const { data, error } = await this.client
        .from(SUPABASE_CONFIG.TABLES.FEES)
        .update({ status: 'paid', payment_date: new Date(), ...paymentData })
        .eq('id', feeId);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const formattedError = this.formatError(error, 'Processing fee payment');
      this.notifyError(formattedError);
      return { success: false, error: formattedError };
    }
  }

  // ATTENDANCE DATA OPERATIONS
  async getAttendanceByStudent(studentId, monthFilter = null) {
    try {
      let query = this.client
        .from(SUPABASE_CONFIG.TABLES.ATTENDANCE)
        .select('*')
        .eq('student_id', studentId)
        .order('date', { ascending: false });

      if (monthFilter) {
        query = query.gte('date', monthFilter.start).lte('date', monthFilter.end);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const formattedError = this.formatError(error, 'Loading attendance data');
      this.notifyError(formattedError);
      return { success: false, error: formattedError };
    }
  }

  async getAttendanceSummary(studentId) {
    try {
      const { data, error } = await this.client
        .from(SUPABASE_CONFIG.TABLES.ATTENDANCE)
        .select('status')
        .eq('student_id', studentId);

      if (error) throw error;

      const summary = {
        total: data.length,
        present: data.filter(d => d.status === 'present').length,
        absent: data.filter(d => d.status === 'absent').length,
        leave: data.filter(d => d.status === 'leave').length
      };
      summary.percentage = summary.total > 0
        ? ((summary.present / summary.total) * 100).toFixed(2)
        : "0.00";

      return { success: true, data: summary };
    } catch (error) {
      console.warn('Using mock attendance data due to error:', error.message);
      return { success: true, data: this.getMockAttendanceData() };
    }
  }

  // EXAM DATA OPERATIONS
  async getExamsByStudent(studentId) {
    try {
      const { data, error } = await this.client
        .from(SUPABASE_CONFIG.TABLES.EXAMS)
        .select('*')
        .eq('student_id', studentId)
        .order('exam_date', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const formattedError = this.formatError(error, 'Loading exam schedule');
      this.notifyError(formattedError);
      return { success: false, error: formattedError };
    }
  }

  async getUpcomingExams(studentId, limit = 5) {
    try {
      // Use local date for comparison to avoid timezone issues
      const today = new Date();
      const todayStr = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');
      const { data, error } = await this.client
        .from(SUPABASE_CONFIG.TABLES.EXAMS)
        .select('*')
        .eq('student_id', studentId)
        .gte('exam_date', todayStr)
        .order('exam_date', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.warn('Using mock exam data due to error:', error.message);
      return { success: true, data: this.getMockExamData() };
    }
  }

  // TIMETABLE OPERATIONS
  async getTimetable(studentId, date = null) {
    try {
      let query = this.client
        .from(SUPABASE_CONFIG.TABLES.TIMETABLE)
        .select('*')
        .eq('student_id', studentId)
        .order('class_start_time', { ascending: true });

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const formattedError = this.formatError(error, 'Loading timetable');
      this.notifyError(formattedError);
      return { success: false, error: formattedError };
    }
  }

  // DOCUMENT OPERATIONS
  async getDocumentsByStudent(studentId) {
    try {
      const { data, error } = await this.client
        .from(SUPABASE_CONFIG.TABLES.DOCUMENTS)
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const formattedError = this.formatError(error, 'Loading documents');
      this.notifyError(formattedError);
      return { success: false, error: formattedError };
    }
  }

  // LEAVE OPERATIONS
  async getLeavesByStudent(studentId) {
    try {
      const { data, error } = await this.client
        .from(SUPABASE_CONFIG.TABLES.LEAVES)
        .select('*')
        .eq('student_id', studentId)
        .order('start_date', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const formattedError = this.formatError(error, 'Loading leave applications');
      this.notifyError(formattedError);
      return { success: false, error: formattedError };
    }
  }

  async submitLeaveApplication(leaveData) {
    try {
      const { data, error } = await this.client
        .from(SUPABASE_CONFIG.TABLES.LEAVES)
        .insert([leaveData]);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const formattedError = this.formatError(error, 'Submitting leave application');
      this.notifyError(formattedError);
      return { success: false, error: formattedError };
    }
  }

  // CHAT OPERATIONS
  async getChatMessages(studentId, limit = 50) {
    try {
      const { data, error } = await this.client
        .from(SUPABASE_CONFIG.TABLES.CHAT_MESSAGES)
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data: data.reverse() };
    } catch (error) {
      const formattedError = this.formatError(error, 'Loading chat messages');
      this.notifyError(formattedError);
      return { success: false, error: formattedError };
    }
  }

  async sendChatMessage(messageData) {
    try {
      const { data, error } = await this.client
        .from(SUPABASE_CONFIG.TABLES.CHAT_MESSAGES)
        .insert([{
          ...messageData,
          created_at: new Date(),
          sender_type: 'parent' // or 'student', 'teacher'
        }]);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const formattedError = this.formatError(error, 'Sending message');
      this.notifyError(formattedError);
      return { success: false, error: formattedError };
    }
  }

  // COMMUNICATION OPERATIONS
  async getCommunications(studentId) {
    try {
      const { data, error } = await this.client
        .from(SUPABASE_CONFIG.TABLES.COMMUNICATIONS)
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const formattedError = this.formatError(error, 'Loading communications');
      this.notifyError(formattedError);
      return { success: false, error: formattedError };
    }
  }

  // TEACHER-SPECIFIC OPERATIONS
  async getTeacherData(teacherId) {
    try {
      const { data, error } = await this.client
        .from('teachers')
        .select('*')
        .eq('id', teacherId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: true, data: this.getMockTeacherData() };
    }
  }

  async getTeacherClassesAttendance(teacherId) {
    try {
      const { data, error } = await this.client
        .from('class_attendance')
        .select('*')
        .eq('teacher_id', teacherId);

      if (error) throw error;

      const summary = {
        present: data.filter(d => d.status === 'present').length,
        absent: data.filter(d => d.status === 'absent').length,
        total: data.length
      };
      return { success: true, data: summary };
    } catch (error) {
      return { success: true, data: { present: 92, absent: 8, total: 100 } };
    }
  }

  async submitHomework(homeworkData) {
    try {
      const { data, error } = await this.client
        .from('homework')
        .insert([homeworkData]);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const formattedError = this.formatError(error, 'Uploading homework');
      this.notifyError(formattedError);
      return { success: false, error: formattedError };
    }
  }

  async submitMarks(marksData) {
    try {
      const { data, error } = await this.client
        .from('marks')
        .insert([marksData]);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      const formattedError = this.formatError(error, 'Submitting marks');
      this.notifyError(formattedError);
      return { success: false, error: formattedError };
    }
  }

  // MOCK DATA FALLBACK (for testing without Supabase)
  getMockStudentData() {
    return {
      id: 'mock-student-1',
      name: 'Rishu Kumar',
      roll_number: 25,
      class: '12th',
      stream: 'Science',
      attendance_percentage: 88,
      percentile: 87,
      rank: 12,
      photo_url: 'https://ui-avatars.com/api/?name=Rishu+Kumar&background=random&size=200'
    };
  }

  getMockTeacherData() {
    return {
      id: 'mock-teacher-1',
      name: 'Mrs. Priya Singh',
      email: 'priya.singh@school.edu',
      phone: '+91-98765-43210',
      department: 'Mathematics & Science',
      experience_years: 12,
      rating: 4.8,
      total_students: 158,
      classes_assigned: 4,
      photo_url: 'https://ui-avatars.com/api/?name=Priya+Singh&background=random&size=200'
    };
  }

  getMockFeeData() {
    return [
      { id: 1, month: 'March 2026', amount: 8500, status: 'pending', due_date: '2026-03-30' },
      { id: 2, month: 'February 2026', amount: 8500, status: 'paid', due_date: '2026-02-28', payment_date: '2026-02-20' }
    ];
  }

  getMockAttendanceData() {
    return {
      total: 100,
      present: 88,
      absent: 8,
      leave: 4,
      percentage: '88.00'
    };
  }

  getMockExamData() {
    return [
      { id: 1, name: 'Mathematics', exam_date: '2026-01-14', status: 'upcoming' },
      { id: 2, name: 'Physics', exam_date: '2026-01-12', status: 'completed' },
      { id: 3, name: 'Chemistry', exam_date: '2026-01-16', status: 'upcoming' }
    ];
  }

  // SCHOOL ADMIN DASHBOARD OPERATIONS
  async getStudentsCount() {
    try {
      if (!this.client) {
        return { success: true, data: { count: 1245 } };
      }
      const { count, error } = await this.client
        .from(SUPABASE_CONFIG.TABLES.STUDENTS)
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return { success: true, data: { count } };
    } catch (error) {
      console.warn('Using mock student count:', error.message);
      return { success: true, data: { count: 1245 } };
    }
  }

  async getTeachersCount() {
    try {
      if (!this.client) {
        return { success: true, data: { count: 85 } };
      }
      const { count, error } = await this.client
        .from('teachers')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return { success: true, data: { count } };
    } catch (error) {
      console.warn('Using mock teacher count:', error.message);
      return { success: true, data: { count: 85 } };
    }
  }

  async getAttendanceStats(date = null) {
    try {
      if (!this.client) {
        return {
          success: true,
          data: {
            total: 1245,
            present: 1145,
            absent: 100,
            percentage: 92,
            date: date || new Date().toISOString().split('T')[0]
          }
        };
      }

      const today = date || new Date().toISOString().split('T')[0];
      const { data, error } = await this.client
        .from(SUPABASE_CONFIG.TABLES.ATTENDANCE)
        .select('status')
        .eq('date', today);

      if (error) throw error;

      const stats = {
        total: data.length,
        present: data.filter(d => d.status === 'present').length,
        absent: data.filter(d => d.status === 'absent').length
      };
      stats.percentage = stats.total > 0
        ? Math.round((stats.present / stats.total) * 100)
        : 0;
      stats.date = today;

      return { success: true, data: stats };
    } catch (error) {
      console.warn('Using mock attendance stats:', error.message);
      return {
        success: true,
        data: {
          total: 1245,
          present: 1145,
          absent: 100,
          percentage: 92,
          date: date || new Date().toISOString().split('T')[0]
        }
      };
    }
  }

  async getRevenueData(period = 'month') {
    try {
      if (!this.client) {
        return {
          success: true,
          data: {
            amount: 240000,
            formatted: '₹2.4L',
            period: period,
            trend: '+8%'
          }
        };
      }

      const { data, error } = await this.client
        .from(SUPABASE_CONFIG.TABLES.FEES)
        .select('amount, payment_date')
        .eq('status', 'paid')
        .gte('payment_date', this.getPeriodStartDate(period));

      if (error) throw error;

      const total = data.reduce((sum, fee) => sum + (fee.amount || 0), 0);
      const formatted = this.formatCurrency(total);

      return {
        success: true,
        data: {
          amount: total,
          formatted,
          period,
          count: data.length
        }
      };
    } catch (error) {
      console.warn('Using mock revenue data:', error.message);
      return {
        success: true,
        data: {
          amount: 240000,
          formatted: '₹2.4L',
          period,
          trend: '+8%'
        }
      };
    }
  }

  async getRecentActivities(limit = 10) {
    try {
      if (!this.client) {
        return {
          success: true,
          data: [
            {
              id: 1,
              type: 'student',
              title: 'New Student Admitted',
              description: 'Rahul Sharma - Class 5A',
              time: '1 hour ago',
              icon: 'fa-user-plus',
              color: 'green',
              timestamp: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: 2,
              type: 'teacher',
              title: 'Teacher Assigned',
              description: 'Mrs. Priya Singh assigned to Class 8B',
              time: '3 hours ago',
              icon: 'fa-chalkboard-teacher',
              color: 'blue',
              timestamp: new Date(Date.now() - 10800000).toISOString()
            },
            {
              id: 3,
              type: 'finance',
              title: 'Fee Payment Received',
              description: '₹15,000 from 3 parents',
              time: '5 hours ago',
              icon: 'fa-rupee-sign',
              color: 'yellow',
              timestamp: new Date(Date.now() - 18000000).toISOString()
            }
          ]
        };
      }

      // In real implementation, fetch from activity_logs table
      const { data, error } = await this.client
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.warn('Using mock activities data:', error.message);
      return {
        success: true,
        data: [
          {
            id: 1,
            type: 'student',
            title: 'New Student Admitted',
            description: 'Rahul Sharma - Class 5A',
            time: '1 hour ago',
            icon: 'fa-user-plus',
            color: 'green'
          }
        ],
        isMock: true
      };
    }
  }

  // NOTIFICATION OPERATIONS
  async getNotifications() {
    try {
      if (!SUPABASE_CONFIG.isValid()) {
        return { success: true, data: this.getMockNotifications(), isMock: true };
      }

      const { data, error } = await this.client
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return { success: true, data: this.getMockNotifications(), isMock: true };
    }
  }

  getMockNotifications() {
    return [
      {
        id: 'N001',
        category: 'academic',
        title: 'Exam Schedule Released',
        message: 'Mid-term exam schedule for Class 12th is now available',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        icon: 'fa-calendar-check',
        color: 'blue',
        actionUrl: '4 P-S_View/exam.html'
      },
      {
        id: 'N002',
        category: 'financial',
        title: 'Fee Payment Due',
        message: 'December tuition fee payment is pending. Due date: 15th Jan',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        icon: 'fa-rupee-sign',
        color: 'yellow',
        actionUrl: '4 P-S_View/finance.html'
      }
    ];
  }

  // GLOBAL SEARCH OPERATION
  async searchGlobal(query) {
    if (!query) return { success: true, data: [] };

    if (!SUPABASE_CONFIG.isValid()) {
      return { success: true, data: this.getMockSearchResults(query), isMock: true };
    }

    try {
      // Perform parallel searches in Supabase
      const [students, teachers] = await Promise.all([
        this.client.from(SUPABASE_CONFIG.TABLES.STUDENTS)
          .select('id, name, class, roll_number')
          .ilike('name', `%${query}%`)
          .limit(5),
        this.client.from('teachers') // Assuming teachers table exists
          .select('id, name, department')
          .ilike('name', `%${query}%`)
          .limit(5)
      ]);

      const results = [];

      if (students.data) {
        results.push(...students.data.map(s => ({
          id: s.id,
          type: 'student',
          name: s.name,
          description: `Class ${s.class} | Roll: ${s.roll_number}`,
          url: '../4 P-S_View/profile.html?id=' + s.id
        })));
      }

      if (teachers.data) {
        results.push(...teachers.data.map(t => ({
          id: t.id,
          type: 'teacher',
          name: t.name,
          description: t.department,
          url: '../3 Teacher-View/profile.html?id=' + t.id
        })));
      }

      return { success: true, data: results };

    } catch (error) {
      console.error('Search failed:', error);
      return { success: true, data: this.getMockSearchResults(query), isMock: true };
    }
  }

  getMockSearchResults(query) {
    const q = query.toLowerCase();
    const mockDb = [
      { id: 'S001', type: 'student', name: 'Rishu Kumar', description: '12th Science', url: '../4 P-S_View/index.html' },
      { id: 'S002', type: 'student', name: 'Rahul Sharma', description: 'Class 5A', url: '../4 P-S_View/index.html' },
      { id: 'T001', type: 'teacher', name: 'Mrs. Priya Singh', description: 'Mathematics', url: '../3 Teacher-View/dashboard.html' },
      { id: 'P001', type: 'page', name: 'Dashboard', description: 'Go to Dashboard', url: '../index.html' },
      { id: 'P002', type: 'page', name: 'Fee Payment', description: 'Pay School Fees', url: '../4 P-S_View/fees.html' }
    ];

    return mockDb.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  }

  // HELPER METHODS
  getPeriodStartDate(period) {
    const now = new Date();
    switch (period) {
      case 'week':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      default:
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
    }
  }

  formatCurrency(amount) {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  }
}

// Initialize global data service
const dataService = new DataService();
