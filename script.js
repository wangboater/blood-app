const STORAGE_KEY = 'pulsenote-blood-pressure-records';
const THEME_STORAGE_KEY = 'pulsenote-theme';
const THEME_META_COLOR = {
  light: '#f2f4ef',
  dark: '#152521'
};

const form = document.querySelector('#reading-form');
const systolicInput = document.querySelector('#systolic');
const diastolicInput = document.querySelector('#diastolic');
const pulseInput = document.querySelector('#pulse');
const medicationInput = document.querySelector('#medication');
const notesInput = document.querySelector('#notes');
const formFeedback = document.querySelector('#form-feedback');
const recordsList = document.querySelector('#records-list');
const emptyState = document.querySelector('#empty-state');
const clearRecordsButton = document.querySelector('#clear-records');
const liveTime = document.querySelector('#live-time');
const averagePressure = document.querySelector('#average-pressure');
const averagePulse = document.querySelector('#average-pulse');
const recordCount = document.querySelector('#record-count');
const themeToggle = document.querySelector('#theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');

const medicationLabels = {
  none: '無',
  taken: '已服藥',
  missed: '未服藥'
};

let records = loadRecords();

function getStoredTheme() {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === 'dark' ? 'dark' : 'light';
  } catch (error) {
    return 'light';
  }
}

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute('aria-label', isDark ? '切換至淺色主題' : '切換至深色主題');
  themeToggle.setAttribute('title', isDark ? '切換至淺色主題' : '切換至深色主題');
  themeToggle.querySelector('.theme-icon--sun').hidden = !isDark;
  themeToggle.querySelector('.theme-icon--moon').hidden = isDark;
  themeMeta.setAttribute('content', THEME_META_COLOR[theme]);
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // The current UI theme still applies when storage is unavailable.
  }
}

function loadRecords() {
  try {
    const storedRecords = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(storedRecords) ? storedRecords : [];
  } catch (error) {
    return [];
  }
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function createRecordId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('zh-TW', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short'
  }).format(new Date(dateString));
}

function formatTime(dateString) {
  return new Intl.DateTimeFormat('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(dateString));
}

function updateLiveTime() {
  liveTime.textContent = new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date());
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderRecords() {
  recordsList.innerHTML = '';
  emptyState.hidden = records.length > 0;
  clearRecordsButton.disabled = records.length === 0;

  records.forEach((record) => {
    const medication = medicationLabels[record.medication] || medicationLabels.none;
    const note = record.notes ? escapeHtml(record.notes) : '未填寫備註';
    const item = document.createElement('article');
    item.className = 'record-item';
    item.dataset.id = record.id;
    item.innerHTML = `
      <div class="record-date">
        <span class="record-day">${formatDate(record.recordedAt)}</span>
        <span class="record-time">${formatTime(record.recordedAt)}</span>
      </div>
      <div class="record-reading" aria-label="血壓 ${record.systolic}／${record.diastolic} mmHg">
        <strong>${record.systolic}/${record.diastolic}</strong>
        <span>mmHg</span>
      </div>
      <div class="record-pulse" aria-label="脈搏 ${record.pulse} bpm">
        <span>脈搏</span>
        <strong>${record.pulse}</strong>
        <span>bpm</span>
      </div>
      <div class="record-medication">
        <span class="medication-dot medication-dot--${record.medication}" aria-hidden="true"></span>
        ${medication}
      </div>
      <div class="record-note" title="${note}">${note}</div>
      <button class="delete-record" type="button" data-action="delete" aria-label="刪除 ${formatDate(record.recordedAt)} ${formatTime(record.recordedAt)} 的紀錄" title="刪除這筆紀錄">×</button>
    `;
    recordsList.append(item);
  });

  updateSummary();
}

function updateSummary() {
  recordCount.textContent = records.length;

  if (records.length === 0) {
    averagePressure.textContent = '—';
    averagePulse.textContent = '—';
    return;
  }

  const totalSystolic = records.reduce((sum, record) => sum + record.systolic, 0);
  const totalDiastolic = records.reduce((sum, record) => sum + record.diastolic, 0);
  const totalPulse = records.reduce((sum, record) => sum + record.pulse, 0);
  const count = records.length;

  averagePressure.textContent = `${Math.round(totalSystolic / count)}/${Math.round(totalDiastolic / count)}`;
  averagePulse.textContent = Math.round(totalPulse / count);
}

function setFeedback(message, type = '') {
  formFeedback.textContent = message;
  formFeedback.className = `form-feedback${type ? ` is-${type}` : ''}`;
}

function clearInvalidState() {
  document.querySelectorAll('.field.is-invalid').forEach((field) => {
    field.classList.remove('is-invalid');
  });
}

function markInvalid(input) {
  input.closest('.field').classList.add('is-invalid');
}

function getFormValues() {
  return {
    systolic: Number(systolicInput.value),
    diastolic: Number(diastolicInput.value),
    pulse: Number(pulseInput.value),
    medication: medicationInput.value,
    notes: notesInput.value.trim()
  };
}

function validateValues(values) {
  clearInvalidState();

  const checks = [
    {
      input: systolicInput,
      valid: Number.isInteger(values.systolic) && values.systolic >= 60 && values.systolic <= 260,
      message: '請輸入 60–260 之間的整數收縮壓。'
    },
    {
      input: diastolicInput,
      valid: Number.isInteger(values.diastolic) && values.diastolic >= 30 && values.diastolic <= 160,
      message: '請輸入 30–160 之間的整數舒張壓。'
    },
    {
      input: pulseInput,
      valid: Number.isInteger(values.pulse) && values.pulse >= 30 && values.pulse <= 220,
      message: '請輸入 30–220 之間的整數脈搏。'
    }
  ];

  const invalidCheck = checks.find((check) => !check.valid);

  if (invalidCheck) {
    markInvalid(invalidCheck.input);
    return invalidCheck;
  }

  if (values.diastolic >= values.systolic) {
    markInvalid(diastolicInput);
    return {
      input: diastolicInput,
      message: '舒張壓通常應低於收縮壓，請檢查輸入數值。'
    };
  }

  return null;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const values = getFormValues();
  const invalidCheck = validateValues(values);

  if (invalidCheck) {
    setFeedback(invalidCheck.message, 'error');
    invalidCheck.input.focus();
    return;
  }

  records.unshift({
    id: createRecordId(),
    ...values,
    recordedAt: new Date().toISOString()
  });
  saveRecords();
  renderRecords();
  form.reset();
  clearInvalidState();
  setFeedback('已儲存，時間已自動記錄。', 'success');
  systolicInput.focus();
});

form.addEventListener('input', (event) => {
  const field = event.target.closest('.field');
  if (field) {
    field.classList.remove('is-invalid');
  }

  if (formFeedback.classList.contains('is-error')) {
    setFeedback('');
  }
});

form.addEventListener('reset', () => {
  clearInvalidState();
  setFeedback('');
});

recordsList.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('[data-action="delete"]');
  if (!deleteButton) {
    return;
  }

  const item = deleteButton.closest('.record-item');
  const record = records.find((entry) => entry.id === item.dataset.id);
  if (!record) {
    return;
  }

  const shouldDelete = window.confirm(`確定要刪除 ${formatDate(record.recordedAt)} ${formatTime(record.recordedAt)} 的紀錄嗎？`);
  if (!shouldDelete) {
    return;
  }

  records = records.filter((entry) => entry.id !== record.id);
  saveRecords();
  renderRecords();
});

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  saveTheme(nextTheme);
});

clearRecordsButton.addEventListener('click', () => {
  if (records.length === 0) {
    return;
  }

  const shouldClear = window.confirm('確定要清除全部血壓紀錄嗎？此動作無法復原。');
  if (!shouldClear) {
    return;
  }

  records = [];
  saveRecords();
  renderRecords();
});

applyTheme(getStoredTheme());
updateLiveTime();
window.setInterval(updateLiveTime, 30000);
renderRecords();
