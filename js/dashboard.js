/**
 * ============================================================
 * VerbaBridge Corporate Learning — HR Dashboard Interactive Controller
 * File: js/dashboard.js
 * ============================================================
 */

(function () {
  'use strict';

  // Sample dynamic state store
  const state = {
    activeSection: 'dashboard',
    employees: [
      { id: 'EMP-01', name: 'Arjun Kumar', email: 'arjun.k@techcorp.com', dept: 'Engineering', program: 'Business English', batch: 'BE-2026-A', progress: 78, attendance: 92, status: 'Active', cefr: 'B2 → C1' },
      { id: 'EMP-02', name: 'Lin Mei', email: 'lin.mei@globalfin.com', dept: 'Finance', program: 'Presentation Skills', batch: 'PS-2026-A', progress: 85, attendance: 96, status: 'Active', cefr: 'B2 → C1' },
      { id: 'EMP-03', name: 'Carlos Mendoza', email: 'carlos.m@aeroglobal.com', dept: 'Operations', program: 'Cross-Cultural Communication', batch: 'CC-2026-A', progress: 62, attendance: 84, status: 'Active', cefr: 'B1 → B2' },
      { id: 'EMP-04', name: 'Fatima Rashid', email: 'fatima.r@medtech.com', dept: 'Customer Support', program: 'Business English', batch: 'BE-2026-A', progress: 45, attendance: 68, status: 'At Risk', cefr: 'B1' },
      { id: 'EMP-05', name: 'Samara Petrov', email: 'samara.p@enterprise.com', dept: 'Management', program: 'Leadership Voice', batch: 'LV-2026-A', progress: 100, attendance: 100, status: 'Completed', cefr: 'C1 → C2' },
      { id: 'EMP-06', name: 'James Owusu', email: 'james.o@innovate.org', dept: 'Sales', program: 'Cross-Cultural Communication', batch: 'CC-2026-A', progress: 30, attendance: 88, status: 'Active', cefr: 'B2' },
      { id: 'EMP-07', name: 'Elena Rostova', email: 'elena.r@fintech.io', dept: 'Finance', program: 'Email & Business Writing', batch: 'EW-2026-A', progress: 92, attendance: 95, status: 'Active', cefr: 'B2 → C1' },
      { id: 'EMP-08', name: 'Tariq Al-Mansoor', email: 'tariq.m@supplychain.net', dept: 'Operations', program: 'Business English', batch: 'BE-2026-B', progress: 55, attendance: 90, status: 'Active', cefr: 'B1 → B2' }
    ],
    unreadNotifs: 5
  };

  document.addEventListener('DOMContentLoaded', initDashboard);

  function initDashboard() {
    initNavigation();
    initGlobalSearch();
    initEmployeeFilters();
    initEnrollmentStepper();
    initAttendanceControls();
    initCalendar();
    initReportsGenerator();
    initCertificatesHub();
    initCapacityPlanner();
    initSettingsForm();
    initNotifications();
    initProfileMenu();
    initLogoutConfirmation();

    // Load the requested dashboard page view.
    handlePageNavigation();
  }

  /* ============================================================
     1. SIDEBAR NAVIGATION & ROUTING
  ============================================================ */
  function initNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.dash-section');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    function pageUrl(sectionId) {
      return sectionId === 'dashboard'
        ? 'dashboard.html'
        : `dashboard.html?view=${encodeURIComponent(sectionId)}`;
    }

    function switchSection(sectionId) {
      if (!sectionId) return;

      // Update sidebar links
      sidebarLinks.forEach(link => {
        if (link.getAttribute('data-section') === sectionId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Update section visibility
      sections.forEach(sec => {
        if (sec.id === `section-${sectionId}`) {
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
        }
      });

      state.activeSection = sectionId;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Close mobile sidebar if open
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        closeMobileSidebar();
      }
    }

    // Sidebar links use real URLs so every destination opens as a fresh page view.

    // In-page navigation buttons (e.g. data-section="enrollment")
    document.querySelectorAll('[data-section]').forEach(el => {
      if (!el.classList.contains('sidebar-link')) {
        el.addEventListener('click', (e) => {
          const sec = el.getAttribute('data-section');
          if (sec) {
            e.preventDefault();
            window.location.href = pageUrl(sec);
          }
        });
      }
    });

    function closeMobileSidebar() {
      sidebar?.classList.remove('mobile-open');
      sidebarOverlay?.classList.remove('visible');
      document.body.classList.remove('sidebar-drawer-open');
      sidebarToggle?.setAttribute('aria-expanded', 'false');
    }

    function openMobileSidebar() {
      sidebar?.classList.add('mobile-open');
      sidebarOverlay?.classList.add('visible');
      document.body.classList.add('sidebar-drawer-open');
      sidebarToggle?.setAttribute('aria-expanded', 'true');
    }

    // Mobile Sidebar Drawer Toggle
    sidebarToggle?.setAttribute('aria-expanded', 'false');
    sidebarToggle?.setAttribute('aria-controls', 'sidebar');
    sidebarToggle?.addEventListener('click', () => {
      if (sidebar?.classList.contains('mobile-open')) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    });

    sidebarOverlay?.addEventListener('click', closeMobileSidebar);
    sidebarClose?.addEventListener('click', () => {
      closeMobileSidebar();
      sidebarToggle?.focus();
    });
    sidebarLinks.forEach(link => link.addEventListener('click', closeMobileSidebar));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && sidebar?.classList.contains('mobile-open')) {
        closeMobileSidebar();
        sidebarToggle?.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) closeMobileSidebar();
    });

  }

  function handlePageNavigation() {
    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get('view') || window.location.hash.replace('#', '') || 'dashboard';
    if (requestedView) {
      const targetSec = document.getElementById(`section-${requestedView}`);
      if (targetSec) {
        document.querySelectorAll('.sidebar-link').forEach(l => {
          l.classList.toggle('active', l.getAttribute('data-section') === requestedView);
        });
        document.querySelectorAll('.dash-section').forEach(s => {
          s.classList.toggle('active', s.id === `section-${requestedView}`);
        });
        state.activeSection = requestedView;
      }
    }
  }

  /* ============================================================
     2. GLOBAL TOP SEARCH
  ============================================================ */
  function initGlobalSearch() {
    const searchInput = document.getElementById('dash-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) return;

      // Filter rows in active table if in employees section
      if (state.activeSection === 'employees') {
        filterEmployeeTable(q);
      }
    });

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const q = searchInput.value.toLowerCase().trim();
        if (q) {
          // Switch to employees section and filter
          window.location.hash = 'employees';
          setTimeout(() => filterEmployeeTable(q), 100);
        }
      }
    });
  }

  /* ============================================================
     3. EMPLOYEES DIRECTORY & FILTERING
  ============================================================ */
  function initEmployeeFilters() {
    const filterInput = document.getElementById('emp-search-input');
    const deptSelect = document.getElementById('emp-dept-filter');
    const statusSelect = document.getElementById('emp-status-filter');
    const exportBtn = document.getElementById('btn-export-employees');

    function applyFilters() {
      const q = filterInput ? filterInput.value.toLowerCase().trim() : '';
      const dept = deptSelect ? deptSelect.value : '';
      const status = statusSelect ? statusSelect.value : '';

      const rows = document.querySelectorAll('#emp-table-body tr, .emp-table tbody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const matchesQ = !q || text.includes(q);
        const matchesDept = !dept || text.includes(dept.toLowerCase());
        const matchesStatus = !status || text.includes(status.toLowerCase());

        row.style.display = (matchesQ && matchesDept && matchesStatus) ? '' : 'none';
      });
    }

    filterInput?.addEventListener('input', applyFilters);
    deptSelect?.addEventListener('change', applyFilters);
    statusSelect?.addEventListener('change', applyFilters);

    exportBtn?.addEventListener('click', () => {
      showToast('Exporting employee records to CSV...', 'info');
      setTimeout(() => {
        showToast('Employees CSV export ready for download.', 'success');
      }, 1000);
    });
  }

  function filterEmployeeTable(query) {
    const rows = document.querySelectorAll('#emp-table-body tr, .emp-table tbody tr');
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? '' : 'none';
    });
  }

  /* ============================================================
     4. ENROLLMENT STEPPER & FORM
  ============================================================ */
  function initEnrollmentStepper() {
    const form = document.getElementById('btn-enroll-submit');
    const fname = document.getElementById('enroll-fname');
    const lname = document.getElementById('enroll-lname');
    const email = document.getElementById('enroll-email');
    const dept = document.getElementById('enroll-dept');
    const program = document.getElementById('enroll-program');
    const batch = document.getElementById('enroll-batch');
    const steps = document.querySelectorAll('.enroll-step');
    const dropzone = document.getElementById('csv-dropzone');

    function updateStepIndicator() {
      let currentStep = 1;
      if (fname?.value || lname?.value || email?.value) currentStep = 2;
      if (program?.value) currentStep = 3;
      if (batch?.value) currentStep = 4;

      steps.forEach((step, idx) => {
        const stepNum = idx + 1;
        const numCircle = step.querySelector('.enroll-step-num');
        if (stepNum <= currentStep) {
          step.classList.add('active');
          numCircle?.classList.add('active');
        } else {
          step.classList.remove('active');
          numCircle?.classList.remove('active');
        }
      });
    }

    [fname, lname, email, dept, program, batch].forEach(input => {
      input?.addEventListener('input', updateStepIndicator);
      input?.addEventListener('change', updateStepIndicator);
    });

    // Form submission
    form?.addEventListener('click', (e) => {
      e.preventDefault();

      const fn = fname?.value.trim();
      const ln = lname?.value.trim();
      const em = email?.value.trim();
      const pr = program?.value;
      const ba = batch?.value;

      if (!fn || !ln || !em) {
        showToast('Please enter the employee name and work email.', 'error');
        return;
      }
      if (!em.includes('@')) {
        showToast('Please enter a valid work email.', 'error');
        return;
      }
      if (!pr) {
        showToast('Please select a training program.', 'error');
        return;
      }

      form.disabled = true;
      const originalHtml = form.innerHTML;
      form.innerHTML = '<i class="ri-loader-2-line"></i> Enrolling...';

      setTimeout(() => {
        form.disabled = false;
        form.innerHTML = originalHtml;

        // Update KPI Counter
        const kpi = document.getElementById('kpi-enrolled');
        if (kpi) {
          const count = parseInt(kpi.textContent, 10) || 127;
          kpi.textContent = count + 1;
        }

        showToast(`Successfully enrolled ${fn} ${ln} in ${pr}! Confirmation email sent.`, 'success');

        // Reset form inputs
        if (fname) fname.value = '';
        if (lname) lname.value = '';
        if (email) email.value = '';
        if (dept) dept.value = '';
        if (program) program.value = '';
        if (batch) batch.value = '';
        updateStepIndicator();
      }, 1200);
    });

    // CSV Dropzone Simulation
    if (dropzone) {
      dropzone.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv, .xlsx';
        fileInput.onchange = (e) => {
          const file = e.target.files[0];
          if (file) {
            handleCsvUpload(file.name);
          }
        };
        fileInput.click();
      });

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--teal)';
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = 'var(--border)';
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--border)';
        const file = e.dataTransfer.files[0];
        if (file) {
          handleCsvUpload(file.name);
        }
      });
    }

    function handleCsvUpload(fileName) {
      showToast(`Uploading and validating ${fileName}...`, 'info');
      setTimeout(() => {
        showToast(`Parsed ${fileName}: 18 employee records staged for batch assignment.`, 'success');
      }, 1500);
    }
  }

  /* ============================================================
     5. ATTENDANCE CONTROLS
  ============================================================ */
  function initAttendanceControls() {
    const markAllPresentBtn = document.getElementById('btn-mark-all-present');
    const saveAttendanceBtn = document.getElementById('btn-save-attendance');

    markAllPresentBtn?.addEventListener('click', () => {
      document.querySelectorAll('.attendance-toggle, .attendance-status-btn').forEach(btn => {
        btn.classList.remove('absent', 'late');
        btn.classList.add('present');
      });
      showToast('Marked all enrolled employees as Present.', 'success');
    });

    saveAttendanceBtn?.addEventListener('click', () => {
      saveAttendanceBtn.disabled = true;
      saveAttendanceBtn.innerHTML = '<i class="ri-loader-2-line"></i> Saving...';
      setTimeout(() => {
        saveAttendanceBtn.disabled = false;
        saveAttendanceBtn.innerHTML = '<i class="ri-save-line"></i> Save Attendance';
        showToast('Session attendance records successfully logged.', 'success');
      }, 1000);
    });
  }

  /* ============================================================
     6. TRAINING CALENDAR
  ============================================================ */
  function initCalendar() {
    const prevBtn = document.getElementById('cal-prev');
    const nextBtn = document.getElementById('cal-next');
    const monthLabel = document.getElementById('cal-month-label');
    const grid = document.getElementById('cal-grid');
    const search = document.getElementById('cal-search');
    const filter = document.getElementById('cal-program-filter');
    const agendaList = document.getElementById('cal-agenda-list');
    const agendaDay = document.getElementById('cal-agenda-day');
    const agendaTitle = document.getElementById('cal-agenda-title');
    const agendaCount = document.getElementById('cal-agenda-count');
    const detail = document.getElementById('cal-event-detail');
    const dialog = document.getElementById('cal-session-dialog');
    if (!grid || !monthLabel) return;

    const events = [
      { date:'2026-09-03', time:'10:00', title:'Business English — Batch A', program:'business', mode:'Online', trainer:'Maya Chen', attendees:13 },
      { date:'2026-09-08', time:'14:00', title:'Presentation Skills Workshop', program:'presentation', mode:'In-Person', trainer:'Daniel Brooks', attendees:10 },
      { date:'2026-09-11', time:'11:00', title:'Cross-Cultural Collaboration', program:'cross-cultural', mode:'Hybrid', trainer:'Amina Rahman', attendees:18 },
      { date:'2026-09-15', time:'09:30', title:'Leadership Communication', program:'leadership', mode:'Online', trainer:'Marcus Lee', attendees:8 },
      { date:'2026-09-18', time:'10:00', title:'Business English — Batch B', program:'business', mode:'Online', trainer:'Maya Chen', attendees:7 },
      { date:'2026-09-22', time:'10:00', title:'Business English — Batch A', program:'business', mode:'Online', trainer:'Maya Chen', attendees:13 },
      { date:'2026-09-22', time:'15:00', title:'Executive Presentation Lab', program:'presentation', mode:'In-Person', trainer:'Daniel Brooks', attendees:9 },
      { date:'2026-09-24', time:'14:00', title:'Presentation Skills', program:'presentation', mode:'In-Person', trainer:'Daniel Brooks', attendees:12 },
      { date:'2026-09-26', time:'11:00', title:'Cross-Cultural Communication', program:'cross-cultural', mode:'Hybrid', trainer:'Amina Rahman', attendees:16 },
      { date:'2026-09-29', time:'09:00', title:'Leadership Voice Clinic', program:'leadership', mode:'Online', trainer:'Marcus Lee', attendees:8 },
      { date:'2026-10-02', time:'10:00', title:'Business English — Batch A', program:'business', mode:'Online', trainer:'Maya Chen', attendees:13 },
      { date:'2026-10-06', time:'14:00', title:'Presentation Skills Workshop', program:'presentation', mode:'Hybrid', trainer:'Daniel Brooks', attendees:11 }
    ];
    let viewDate = new Date(2026, 8, 1);
    let selectedDate = '2026-09-22';

    const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    const visibleEvents = () => {
      const query = (search?.value || '').toLowerCase().trim();
      const program = filter?.value || 'all';
      return events.filter(event => (program === 'all' || event.program === program) && (!query || `${event.title} ${event.trainer} ${event.mode}`.toLowerCase().includes(query)));
    };

    function renderAgenda(key) {
      selectedDate = key;
      const date = new Date(`${key}T12:00:00`);
      const dayEvents = visibleEvents().filter(event => event.date === key);
      agendaDay.textContent = date.toLocaleDateString('en-US', { weekday:'long' });
      agendaTitle.textContent = date.toLocaleDateString('en-US', { month:'long', day:'numeric' });
      agendaCount.textContent = `${dayEvents.length} session${dayEvents.length === 1 ? '' : 's'}`;
      agendaList.innerHTML = dayEvents.length ? dayEvents.map((event, index) => `<button class="agenda-session program-${event.program}" data-event-index="${events.indexOf(event)}"><span class="agenda-session-time">${event.time}</span><span><strong>${event.title}</strong><small><i class="ri-map-pin-line"></i> ${event.mode} · ${event.attendees} learners</small></span><i class="ri-arrow-right-s-line"></i></button>`).join('') : '<div class="calendar-empty-state"><i class="ri-calendar-line"></i><span>No sessions scheduled</span></div>';
      detail.innerHTML = '<div class="calendar-empty-state"><i class="ri-cursor-line"></i><span>Select a session to see its details</span></div>';
      document.querySelectorAll('.cal-cell').forEach(cell => cell.classList.toggle('selected', cell.dataset.date === key));
    }

    function renderCalendar() {
      const year = viewDate.getFullYear(), month = viewDate.getMonth();
      monthLabel.textContent = viewDate.toLocaleDateString('en-US', { month:'long', year:'numeric' });
      const first = new Date(year, month, 1), start = new Date(year, month, 1-first.getDay());
      const filteredEvents = visibleEvents();
      grid.innerHTML = Array.from({length:42}, (_, index) => {
        const date = new Date(start); date.setDate(start.getDate()+index);
        const key = dateKey(date), dayEvents = filteredEvents.filter(event => event.date === key);
        const classes = ['cal-cell'];
        if (date.getMonth() !== month) classes.push('other-month');
        if (key === '2026-09-23') classes.push('today');
        if (key === selectedDate) classes.push('selected');
        return `<button class="${classes.join(' ')}" data-date="${key}" aria-label="${date.toLocaleDateString('en-US',{month:'long',day:'numeric'})}, ${dayEvents.length} sessions"><span class="cal-cell-date">${date.getDate()}</span><span class="cal-cell-events">${dayEvents.slice(0,2).map(event => `<span class="cal-event program-${event.program}">${event.time} ${event.title}</span>`).join('')}${dayEvents.length>2?`<span class="cal-more">+${dayEvents.length-2} more</span>`:''}</span></button>`;
      }).join('');
      document.getElementById('cal-session-total').textContent = filteredEvents.filter(event => event.date.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)).length;
      renderAgenda(selectedDate);
    }

    grid.addEventListener('click', event => { const cell = event.target.closest('.cal-cell'); if (cell) renderAgenda(cell.dataset.date); });
    agendaList.addEventListener('click', event => {
      const button = event.target.closest('[data-event-index]'); if (!button) return;
      const item = events[Number(button.dataset.eventIndex)];
      detail.innerHTML = `<div class="event-detail-accent program-${item.program}"></div><h3>${item.title}</h3><p><i class="ri-time-line"></i>${item.time} · 90 minutes</p><p><i class="ri-map-pin-line"></i>${item.mode}</p><p><i class="ri-user-star-line"></i>${item.trainer}</p><p><i class="ri-group-line"></i>${item.attendees} expected learners</p><button class="btn-vb btn-vb-ghost btn-vb-sm">View session details</button>`;
    });
    prevBtn?.addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth()-1); selectedDate=dateKey(new Date(viewDate.getFullYear(),viewDate.getMonth(),1)); renderCalendar(); });
    nextBtn?.addEventListener('click', () => { viewDate.setMonth(viewDate.getMonth()+1); selectedDate=dateKey(new Date(viewDate.getFullYear(),viewDate.getMonth(),1)); renderCalendar(); });
    document.getElementById('cal-today')?.addEventListener('click', () => { viewDate=new Date(2026,8,1); selectedDate='2026-09-23'; renderCalendar(); });
    search?.addEventListener('input', renderCalendar); filter?.addEventListener('change', renderCalendar);
    document.getElementById('cal-add-session')?.addEventListener('click', () => dialog?.showModal());
    document.getElementById('cal-dialog-close')?.addEventListener('click', () => dialog?.close());
    document.getElementById('cal-dialog-cancel')?.addEventListener('click', () => dialog?.close());
    document.getElementById('cal-session-form')?.addEventListener('submit', event => {
      event.preventDefault();
      events.push({ date:document.getElementById('cal-new-date').value, time:document.getElementById('cal-new-time').value, title:document.getElementById('cal-new-title').value, program:document.getElementById('cal-new-program').value, mode:document.getElementById('cal-new-mode').value, trainer:document.getElementById('cal-new-trainer').value || 'Assigned facilitator', attendees:0 });
      selectedDate=document.getElementById('cal-new-date').value; viewDate=new Date(`${selectedDate}T12:00:00`); renderCalendar(); dialog.close(); showToast('Training session added to the calendar.', 'success');
    });
    renderCalendar();
  }

  /* ============================================================
     7. REPORTS GENERATOR
  ============================================================ */
  function initReportsGenerator() {
    const generateBtn = document.getElementById('btn-generate-report');
    const reportType = document.getElementById('report-type-select');
    const reportFormat = document.getElementById('report-format-select');

    generateBtn?.addEventListener('click', () => {
      const type = reportType ? reportType.value : 'Executive Training Summary';
      const format = reportFormat ? reportFormat.value : 'PDF';

      generateBtn.disabled = true;
      const original = generateBtn.innerHTML;
      generateBtn.innerHTML = '<i class="ri-loader-2-line"></i> Compiling Analytics...';

      setTimeout(() => {
        generateBtn.disabled = false;
        generateBtn.innerHTML = original;
        showToast(`${type} generated in ${format} format. Download initiated.`, 'success');
      }, 1500);
    });
  }

  /* ============================================================
     8. CERTIFICATES HUB
  ============================================================ */
  function initCertificatesHub() {
    const certSearch = document.getElementById('cert-search-input');
    const issueNewBtn = document.getElementById('btn-issue-cert');

    certSearch?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.cert-card, .cert-row').forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });

    issueNewBtn?.addEventListener('click', () => {
      showToast('Select an eligible completed employee to issue accredited VerbaBridge Certificate.', 'info');
    });

    document.querySelectorAll('.btn-download-cert').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Downloading high-resolution verified PDF certificate...', 'success');
      });
    });
  }

  /* ============================================================
     9. CAPACITY PLANNER
  ============================================================ */
  function initCapacityPlanner() {
    const capacitySlider = document.getElementById('capacity-seat-slider');
    const capacityDisplay = document.getElementById('capacity-seat-display');

    capacitySlider?.addEventListener('input', (e) => {
      if (capacityDisplay) {
        capacityDisplay.textContent = e.target.value + ' Seats';
      }
    });

    document.getElementById('btn-request-batch')?.addEventListener('click', () => {
      showToast('Dedicated enterprise cohort request submitted to VerbaBridge L&D Coordinator.', 'success');
    });
  }

  /* ============================================================
     10. SETTINGS & PROFILE
  ============================================================ */
  function initSettingsForm() {
    const saveBtn = document.getElementById('btn-save-settings');
    saveBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="ri-loader-2-line"></i> Saving...';

      setTimeout(() => {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="ri-check-line"></i> Save Settings';
        showToast('Organization and HR notification preferences updated.', 'success');
      }, 900);
    });
  }

  /* ============================================================
     11. NOTIFICATIONS
  ============================================================ */
  function initNotifications() {
    const markAllBtn = document.getElementById('btn-mark-all-read');
    const notifBtn = document.getElementById('btn-dash-notif');
    const notifBadge = document.querySelector('[data-section="notifications"] .profile-menu-badge');
    const notifDot = document.querySelector('.notif-dot');

    markAllBtn?.addEventListener('click', () => {
      document.querySelectorAll('#section-notifications .vb-form-card > div > div').forEach(item => {
        item.style.background = 'transparent';
      });
      document.querySelectorAll('#section-notifications .vb-form-card [style*="border-radius:50%"]').forEach(dot => {
        if (dot.style.width === '8px') dot.style.display = 'none';
      });

      if (notifBadge) notifBadge.style.display = 'none';
      if (notifDot) notifDot.style.display = 'none';
      showToast('All notifications marked as read.', 'info');
    });

    notifBtn?.addEventListener('click', () => {
      window.location.href = 'dashboard.html?view=notifications';
    });
  }

  /* ============================================================
     12. TOP-RIGHT PROFILE MENU
  ============================================================ */
  function initProfileMenu() {
    const profile = document.querySelector('.dash-profile');
    const toggle = document.getElementById('dash-profile-toggle');
    const menu = document.getElementById('dash-profile-menu');
    if (!profile || !toggle || !menu) return;

    function setMenu(open) {
      profile.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
    }

    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      setMenu(!profile.classList.contains('open'));
    });

    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('click', (event) => {
      if (!profile.contains(event.target)) setMenu(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  function initLogoutConfirmation() {
    const dialog = document.getElementById('logout-dialog');
    const cancel = document.getElementById('logout-cancel');
    if (!dialog) return;

    document.querySelectorAll('[data-logout-trigger]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        document.querySelector('.dash-profile')?.classList.remove('open');
        dialog.showModal();
      });
    });
    cancel?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
  }

  /* ============================================================
     GLOBAL TOAST HELPER
  ============================================================ */
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `vb-toast vb-toast-${type}`;

    let iconClass = 'ri-checkbox-circle-fill';
    if (type === 'error') iconClass = 'ri-error-warning-fill';
    if (type === 'info') iconClass = 'ri-information-fill';
    if (type === 'warning') iconClass = 'ri-alert-fill';

    toast.innerHTML = `
      <i class="${iconClass} vb-toast-icon"></i>
      <div class="vb-toast-msg">${message}</div>
      <button class="vb-toast-close" aria-label="Close notification">&times;</button>
    `;

    toast.querySelector('.vb-toast-close').addEventListener('click', () => {
      toast.remove();
    });

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Expose showToast globally for other components
  window.vbToast = showToast;

})();
