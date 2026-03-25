/* ═══════════════════════════════════════════════════════
   MeetRoom — Application Logic
   Handles booking, viewing, deleting & toast notifications
   ═══════════════════════════════════════════════════════ */

const API_BASE = '/api';

// ── State ──────────────────────────────────────────────
let selectedRoom = 'A';
let viewRoom = 'A';
let deleteTargetId = null;

// ── DOM References ─────────────────────────────────────
const navTabs = document.querySelectorAll('.nav-tab');
const sections = document.querySelectorAll('.section');
const roomCards = document.querySelectorAll('.room-card');
const bookingForm = document.getElementById('bookingForm');
const bookBtn = document.getElementById('bookBtn');
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
const toastContainer = document.getElementById('toastContainer');
const filterTabs = document.querySelectorAll('.filter-tab');
const bookingsContent = document.getElementById('bookingsContent');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');
const deleteModal = document.getElementById('deleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// ── Initialize ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    setDefaultTimes();
    bindEvents();
});

// ── Background Particles ───────────────────────────────
function initParticles() {
    const container = document.getElementById('bgParticles');
    const colors = ['#818cf8', '#a78bfa', '#c084fc', '#6366f1', '#7c3aed'];
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            background: ${color};
            animation-duration: ${Math.random() * 15 + 10}s;
            animation-delay: ${Math.random() * 10}s;
        `;
        
        container.appendChild(particle);
    }
}

// ── Set Default Times ──────────────────────────────────
function setDefaultTimes() {
    const now = new Date();
    now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0);
    
    const later = new Date(now);
    later.setHours(later.getHours() + 1);
    
    startTimeInput.value = toLocalISOString(now);
    endTimeInput.value = toLocalISOString(later);
}

function toLocalISOString(date) {
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
}

// ── Event Bindings ─────────────────────────────────────
function bindEvents() {
    // Navigation
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Room selection (booking)
    roomCards.forEach(card => {
        card.addEventListener('click', () => selectRoom(card.dataset.room));
    });

    // Booking form
    bookingForm.addEventListener('submit', handleBooking);

    // Room filter (view)
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => switchViewRoom(tab.dataset.room));
    });

    // Delete modal
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    confirmDeleteBtn.addEventListener('click', handleDelete);
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeDeleteModal();
    });
}

// ── Tab Navigation ─────────────────────────────────────
function switchTab(tab) {
    navTabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`.nav-tab[data-tab="${tab}"]`).classList.add('active');

    sections.forEach(s => s.classList.remove('active'));
    document.getElementById(tab === 'book' ? 'sectionBook' : 'sectionView').classList.add('active');

    if (tab === 'view') {
        loadBookings(viewRoom);
    }
}

// ── Room Selection ─────────────────────────────────────
function selectRoom(room) {
    selectedRoom = room;
    roomCards.forEach(card => card.classList.remove('selected'));
    document.querySelector(`.room-card[data-room="${room}"]`).classList.add('selected');
}

// ── View Room Filter ───────────────────────────────────
function switchViewRoom(room) {
    viewRoom = room;
    filterTabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`.filter-tab[data-room="${room}"]`).classList.add('active');
    loadBookings(room);
}

// ── Book a Room ────────────────────────────────────────
async function handleBooking(e) {
    e.preventDefault();

    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;

    if (!startTime || !endTime) {
        showToast('error', 'Missing Fields', 'Please select both start and end times.');
        return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
        showToast('error', 'Invalid Time Range', 'End time must be after start time.');
        return;
    }

    setLoading(true);

    try {
        const response = await fetch(`${API_BASE}/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roomId: selectedRoom,
                startTime: startTime + ':00',
                endTime: endTime + ':00'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showToast('error', 'Booking Failed', data.message || 'Something went wrong.');
            return;
        }

        if (data.status === 'conflict') {
            const sugStart = formatDateTime(data.suggestedStart);
            const sugEnd = formatDateTime(data.suggestedEnd);
            showToast(
                'conflict',
                'Time Slot Unavailable',
                data.message,
                `Suggested: ${sugStart} — ${sugEnd}`
            );
        } else {
            showToast('success', 'Booking Confirmed!', `Room ${selectedRoom} has been reserved.`);
            setDefaultTimes();
        }
    } catch (err) {
        showToast('error', 'Connection Error', 'Could not reach the server. Is the backend running?');
    } finally {
        setLoading(false);
    }
}

function setLoading(isLoading) {
    bookBtn.classList.toggle('loading', isLoading);
    bookBtn.innerHTML = isLoading
        ? `<div class="spinner" style="width:20px;height:20px;border-width:2px;"></div> Booking...`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Book Now`;
}

// ── Load Bookings ──────────────────────────────────────
async function loadBookings(roomId) {
    loadingState.classList.remove('hidden');
    emptyState.classList.add('hidden');
    bookingsContent.innerHTML = '';

    try {
        const response = await fetch(`${API_BASE}/bookings/${roomId}`);
        const bookings = await response.json();

        loadingState.classList.add('hidden');

        if (!bookings || bookings.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        bookings.forEach((booking, index) => {
            const item = createBookingItem(booking, index);
            bookingsContent.appendChild(item);
        });
    } catch (err) {
        loadingState.classList.add('hidden');
        bookingsContent.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.3">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h3>Connection Error</h3>
                <p>Could not reach the server. Make sure the backend is running on port 8080.</p>
            </div>
        `;
    }
}

function createBookingItem(booking, index) {
    const div = document.createElement('div');
    div.className = 'booking-item';
    div.style.animationDelay = `${index * 0.06}s`;

    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    div.innerHTML = `
        <div class="booking-info">
            <div class="booking-time-badge">
                <span class="month">${monthNames[start.getMonth()]}</span>
                <span class="day">${start.getDate()}</span>
            </div>
            <div class="booking-details">
                <h4>${formatTime(start)} — ${formatTime(end)}</h4>
                <p>${formatDate(start)}</p>
                <div class="booking-id">ID: ${booking.id.substring(0, 8)}…</div>
            </div>
        </div>
        <button class="btn-delete" title="Cancel booking" data-id="${booking.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
        </button>
    `;

    const deleteBtn = div.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => openDeleteModal(booking.id));

    return div;
}

// ── Delete Booking ─────────────────────────────────────
function openDeleteModal(id) {
    deleteTargetId = id;
    deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
    deleteModal.classList.add('hidden');
    deleteTargetId = null;
}

async function handleDelete() {
    if (!deleteTargetId) return;

    confirmDeleteBtn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;"></div>';
    confirmDeleteBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE}/booking/${deleteTargetId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
            showToast('error', 'Delete Failed', data.message || 'Could not delete booking.');
        } else {
            showToast('success', 'Booking Cancelled', 'The time slot is now available.');
            loadBookings(viewRoom);
        }
    } catch (err) {
        showToast('error', 'Connection Error', 'Could not reach the server.');
    } finally {
        closeDeleteModal();
        confirmDeleteBtn.innerHTML = 'Yes, Cancel';
        confirmDeleteBtn.disabled = false;
    }
}

// ── Toast Notifications ────────────────────────────────
function showToast(type, title, message, suggestion = null) {
    const icons = {
        success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        conflict: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let content = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-body">
            <h4>${title}</h4>
            <p>${message}</p>
            ${suggestion ? `<div class="suggestion">${suggestion}</div>` : ''}
        </div>
    `;

    toast.innerHTML = content;
    toastContainer.appendChild(toast);

    // Auto-remove after 5s
    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// ── Date/Time Formatting ───────────────────────────────
function formatDateTime(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    return `${formatDate(d)} ${formatTime(d)}`;
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}
