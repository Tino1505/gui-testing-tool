// State
let appointments = [
    { id: 'APT-1001', patient: 'Sarah Connor', doctor: 'Dr. Smith (Cardiology)', datetime: '2026-05-20T10:00', status: 'confirmed' },
    { id: 'APT-1002', patient: 'Bruce Wayne', doctor: 'Dr. Williams (General)', datetime: '2026-05-21T14:30', status: 'pending' },
];

// DOM Elements
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const btnLogin = document.getElementById('btn-login');

const tableBody = document.getElementById('table-body');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');

const btnBookNew = document.getElementById('btn-book-new');
const bookingModal = document.getElementById('booking-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancel = document.getElementById('btn-cancel');
const bookingForm = document.getElementById('booking-form');
const btnConfirmBooking = document.getElementById('btn-confirm-booking');
const modalErrorBanner = document.getElementById('modal-error-banner');

const toastContainer = document.getElementById('toast-container');

// --- Session Management ---
let sessionTimer;

function startSessionTimer() {
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(() => {
        // Auto logout after 5 minutes
        localStorage.removeItem('healthSessionExpiry');
        dashboardView.classList.remove('active');
        loginView.classList.add('active');
        showToast('Session expired. Please log in again.', 'error');
    }, 5 * 60 * 1000);
}

// --- Initialization ---
function init() {
    renderTable();
    
    // Check session
    const expiry = localStorage.getItem('healthSessionExpiry');
    if (expiry && new Date().getTime() < parseInt(expiry)) {
        loginView.classList.remove('active');
        dashboardView.classList.add('active');
        startSessionTimer(); // Restart timer for active session
    } else {
        localStorage.removeItem('healthSessionExpiry');
    }
}

// --- Login Flow ---
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    
    // Simulate Async Auth
    const btnText = btnLogin.querySelector('.btn-text');
    const spinner = btnLogin.querySelector('.spinner');
    
    btnText.classList.add('hidden');
    spinner.classList.remove('hidden');
    btnLogin.disabled = true;

    setTimeout(() => {
        btnText.classList.remove('hidden');
        spinner.classList.add('hidden');
        btnLogin.disabled = false;
        
        if (email && pass) {
            // Set session expiry to 5 minutes
            const expiry = new Date().getTime() + 5 * 60 * 1000;
            localStorage.setItem('healthSessionExpiry', expiry.toString());
            
            loginView.classList.remove('active');
            dashboardView.classList.add('active');
            window.scrollTo(0, 0); // Ensure user starts at the top of the dashboard
            showToast('Logged in successfully', 'success');
            
            startSessionTimer(); // Start auto-logout timer
        } else {
            document.getElementById('username').parentElement.classList.add('error');
            document.getElementById('password').parentElement.classList.add('error');
            showToast('Please enter credentials', 'error');
        }
    }, 1500); // 1.5s network latency simulation
});

document.getElementById('btn-logout').addEventListener('click', () => {
    clearTimeout(sessionTimer);
    localStorage.removeItem('healthSessionExpiry');
    dashboardView.classList.remove('active');
    loginView.classList.add('active');
    window.scrollTo(0, 0); // Ensure user starts at the top of the login view
});

// --- Table Logic ---
function renderTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterVal = statusFilter.value;
    
    const filtered = appointments.filter(apt => {
        const matchesSearch = apt.patient.toLowerCase().includes(searchTerm) || apt.doctor.toLowerCase().includes(searchTerm);
        const matchesStatus = filterVal === 'all' || apt.status === filterVal;
        return matchesSearch && matchesStatus;
    });

    tableBody.innerHTML = '';
    
    if (filtered.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#999;">No appointments found.</td></tr>';
        return;
    }

    filtered.forEach(apt => {
        const dateObj = new Date(apt.datetime);
        const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><b>${apt.id}</b></td>
            <td>${apt.patient}</td>
            <td>${apt.doctor}</td>
            <td>${dateStr}</td>
            <td><span class="status-badge status-${apt.status}">${apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}</span></td>
            <td><button class="btn-secondary" style="padding: 4px 8px; font-size:12px;">View</button></td>
        `;
        tableBody.appendChild(tr);
    });
}

searchInput.addEventListener('input', renderTable);
statusFilter.addEventListener('change', renderTable);


// --- Modal & Booking Flow ---
function openModal() {
    bookingForm.reset();
    clearErrors();
    modalErrorBanner.classList.add('hidden');
    bookingModal.classList.add('active');
}

function closeModal() {
    bookingModal.classList.remove('active');
}

btnBookNew.addEventListener('click', openModal);
btnCloseModal.addEventListener('click', closeModal);
btnCancel.addEventListener('click', closeModal);

function clearErrors() {
    document.querySelectorAll('.validation-msg').forEach(el => el.innerText = '');
    document.querySelectorAll('.input-group').forEach(el => el.classList.remove('error'));
}

function showError(inputId, msgId, message) {
    document.getElementById(inputId).parentElement.classList.add('error');
    document.getElementById(msgId).innerText = message;
}

// --- Dynamic UI Logic ---
const doctorSelect = document.getElementById('doctor-select');
const specialtyInput = document.getElementById('specialty-input');
const apptTimeSelect = document.getElementById('appt-time');
const timeSpinner = document.getElementById('time-spinner');

doctorSelect.addEventListener('change', () => {
    const val = doctorSelect.value;
    if (val === 'Dr. Smith') specialtyInput.value = 'Cardiology';
    else if (val === 'Dr. Johnson') specialtyInput.value = 'Pediatrics';
    else if (val === 'Dr. Williams') specialtyInput.value = 'General Medicine';
    else specialtyInput.value = '';
    
    // Reset time slots if doctor changes
    resetTimeSlots();
});

function resetTimeSlots() {
    apptTimeSelect.innerHTML = '<option value="">-- Select Date First --</option>';
    apptTimeSelect.disabled = true;
}

function loadTimeSlots() {
    // Show spinner
    apptTimeSelect.disabled = true;
    timeSpinner.classList.remove('hidden');
    apptTimeSelect.innerHTML = '<option value="">Loading slots...</option>';
    
    setTimeout(() => {
        timeSpinner.classList.add('hidden');
        apptTimeSelect.disabled = false;
        
        // Mock generating random slots
        apptTimeSelect.innerHTML = `
            <option value="">-- Select a Time Slot --</option>
            <option value="09:00">09:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="14:30">02:30 PM</option>
            <option value="16:00">04:00 PM</option>
        `;
    }, 1000); // 1s async loading
}

// --- Submit Logic ---
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    modalErrorBanner.classList.add('hidden');

    const patient = document.getElementById('patient-name').value.trim();
    const phone = document.getElementById('patient-phone').value.trim();
    const email = document.getElementById('patient-email').value.trim();
    const dob = document.getElementById('patient-dob').value;
    
    const doctor = document.getElementById('doctor-select').value;
    const specialty = document.getElementById('specialty-input').value;
    const date = document.getElementById('appt-date').value;
    const time = document.getElementById('appt-time').value;
    const consent = document.getElementById('consent-check').checked;

    let hasError = false;

    // Validation: Patient name
    if (!patient) {
        showError('patient-name', 'err-patient', 'Name is required');
        hasError = true;
    }

    // Validation: Phone (10 digits)
    if (!phone) {
        showError('patient-phone', 'err-phone', 'Phone is required');
        hasError = true;
    } else if (!/^\d{10}$/.test(phone)) {
        showError('patient-phone', 'err-phone', 'Must be exactly 10 digits');
        hasError = true;
    }

    // Validation: Email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('patient-email', 'err-email', 'Invalid email format');
        hasError = true;
    }

    // Validation: DOB
    if (dob) {
        const dobDate = new Date(dob);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (dobDate > today) {
            showError('patient-dob', 'err-dob', 'DOB cannot be in the future');
            hasError = true;
        }
    }

    // Validation: Doctor
    if (!doctor) {
        showError('doctor-select', 'err-doctor', 'Please select a doctor');
        hasError = true;
    }

    // Validation: Date
    if (!date) {
        showError('appt-date', 'err-date', 'Date is required');
        hasError = true;
    } else {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (selectedDate < today) {
            showError('appt-date', 'err-date', 'Cannot book in the past');
            hasError = true;
        }
    }

    // Validation: Time
    if (!time) {
        showError('appt-time', 'err-time', 'Time is required');
        hasError = true;
    }

    // Validation: Consent
    if (!consent) {
        document.getElementById('err-consent').innerText = 'You must consent to proceed';
        hasError = true;
    }

    if (hasError) return;

    // Simulate Async Booking Submission
    const btnText = btnConfirmBooking.querySelector('.btn-text');
    const spinner = btnConfirmBooking.querySelector('.spinner');
    
    btnText.classList.add('hidden');
    spinner.classList.remove('hidden');
    btnConfirmBooking.disabled = true;

    setTimeout(() => {
        btnText.classList.remove('hidden');
        spinner.classList.add('hidden');
        btnConfirmBooking.disabled = false;

        // Edge Case: Slot already occupied
        if (doctor.includes('Smith') && time === '10:00') {
            modalErrorBanner.innerText = 'Slot is already occupied. Please choose another time or doctor.';
            modalErrorBanner.classList.remove('hidden');
            // Scroll to top of modal to see error
            document.querySelector('.form-scroll-area').scrollTop = 0;
            return;
        }

        // Happy Path Success
        const newApt = {
            id: 'APT-' + Math.floor(Math.random() * 9000 + 1000),
            patient: patient,
            doctor: doctor + ' (' + specialty + ')',
            datetime: `${date}T${time}`,
            status: 'confirmed'
        };

        appointments.unshift(newApt);
        renderTable();
        closeModal();
        showToast(`Appointment booked successfully for ${patient}`, 'success');

    }, 2000); // 2s network latency simulation
});

// --- Toast Notification System ---
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? '✅' : '❌';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- Custom Calendar Logic ---
const customDateDisplay = document.getElementById('custom-date-display');
const calendarWidget = document.getElementById('calendar-widget');
const calMonthYear = document.getElementById('cal-month-year');
const calendarGrid = document.getElementById('calendar-grid');
const apptDateInput = document.getElementById('appt-date');
const selectedDateText = document.getElementById('selected-date-text');

let currentCalDate = new Date(); // Month currently being viewed

customDateDisplay.addEventListener('click', (e) => {
    e.stopPropagation();
    calendarWidget.classList.toggle('show');
    renderCalendar();
});

document.addEventListener('click', (e) => {
    if (!calendarWidget.contains(e.target) && !customDateDisplay.contains(e.target)) {
        calendarWidget.classList.remove('show');
    }
});

document.getElementById('cal-prev').addEventListener('click', (e) => {
    e.stopPropagation();
    currentCalDate.setMonth(currentCalDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('cal-next').addEventListener('click', (e) => {
    e.stopPropagation();
    currentCalDate.setMonth(currentCalDate.getMonth() + 1);
    renderCalendar();
});

function renderCalendar() {
    calendarGrid.innerHTML = '';
    const year = currentCalDate.getFullYear();
    const month = currentCalDate.getMonth();
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    calMonthYear.innerText = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const selectedDateVal = apptDateInput.value ? new Date(apptDateInput.value) : null;
    
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        const div = document.createElement('div');
        calendarGrid.appendChild(div);
    }
    
    // Days
    for (let i = 1; i <= daysInMonth; i++) {
        const dateObj = new Date(year, month, i);
        const dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        const dayDiv = document.createElement('div');
        dayDiv.className = 'cal-day';
        dayDiv.innerText = i;
        dayDiv.dataset.date = dateStr;
        
        if (dateObj < today) {
            dayDiv.classList.add('disabled');
        } else {
            dayDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Remove previous selected
                document.querySelectorAll('.cal-day.selected').forEach(el => el.classList.remove('selected'));
                dayDiv.classList.add('selected');
                
                // Update input & UI
                apptDateInput.value = dateStr;
                selectedDateText.innerText = dateObj.toLocaleDateString();
                selectedDateText.style.color = "var(--text-main)";
                
                // Close calendar
                calendarWidget.classList.remove('show');
                
                // Clear validation if any
                document.getElementById('appt-date').parentElement.classList.remove('error');
                document.getElementById('err-date').innerText = '';
                
                // Trigger async loading of time slots
                loadTimeSlots();
            });
        }
        
        // Compensate for timezone offset issues when checking equality
        if (selectedDateVal && selectedDateVal.getFullYear() === year && selectedDateVal.getMonth() === month && selectedDateVal.getDate() === i) {
            dayDiv.classList.add('selected');
        }
        
        calendarGrid.appendChild(dayDiv);
    }
}

// Start
init();
