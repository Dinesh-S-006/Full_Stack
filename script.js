const STORAGE_KEY = 'nec_certificate_portal_data_v1';

// --- Load and Save ---
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let data = loadData();

// --- Utility ---
function safeId(dept, year) {
  return (dept || '').replace(/\W+/g, '_').toLowerCase() + '_' + year;
}

// --- Department Selection ---
function selectDept(dept) {
  const yearsDiv = document.getElementById('years');
  yearsDiv.innerHTML = `
    <h3 class="section-title">${dept} - Select Year</h3>
    <div>
      <button class="year-btn" onclick="showLeaderboard('${dept}',1)">1st Year</button>
      <button class="year-btn" onclick="showLeaderboard('${dept}',2)">2nd Year</button>
      <button class="year-btn" onclick="showLeaderboard('${dept}',3)">3rd Year</button>
      <button class="year-btn" onclick="showLeaderboard('${dept}',4)">4th Year</button>
    </div>`;
  document.getElementById('leaderboard').innerHTML = '';
  setTimeout(() => window.scrollTo({ top: yearsDiv.offsetTop - 20, behavior: 'smooth' }), 100);
}

// --- Leaderboard View ---
function showLeaderboard(dept, year) {
  if (!data[dept]) data[dept] = {};
  if (!data[dept][year]) data[dept][year] = [];

  const students = data[dept][year].slice().sort((a, b) => (b.points || 0) - (a.points || 0));
  let tableRows = students.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(s.name)}</td>
      <td>${escapeHtml(s.reg)}</td>
      <td>${s.points || 0}</td>
      <td>${s.cert ? `<img src="${s.cert}" class="cert-img">` : 'No Certificate'}</td>
    </tr>`).join('');

  if (!tableRows) tableRows = `<tr><td colspan="5">No records yet</td></tr>`;

  const sid = safeId(dept, year);
  document.getElementById('leaderboard').innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Rank</th><th>Name</th><th>Register No</th><th>Points</th><th>Certificate</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>

    <div class="form-card">
      <form onsubmit="addStudent(event,'${dept}',${year})">
        <label style="font-weight:700">Enter Student Details</label>
        <input type="text" id="name_${sid}" placeholder="Full Name" required>
        <input type="text" id="reg_${sid}" placeholder="Register Number" required>
        <select id="type_${sid}">
          <option value="1">Participant (1 Point)</option>
          <option value="2">Runner-Up (2 Points)</option>
          <option value="3">Winner (3 Points)</option>
        </select>
        <input type="file" id="cert_${sid}" accept="image/*">
        <button class="submit-btn" type="submit">Add / Validate</button>
      </form>
    </div>`;

  setTimeout(() => window.scrollTo({ top: document.getElementById('leaderboard').offsetTop - 20, behavior: 'smooth' }), 80);
}

// --- Add Student ---
function addStudent(e, dept, year) {
  e.preventDefault();
  const sid = safeId(dept, year);
  const name = document.getElementById(`name_${sid}`).value.trim();
  const reg = document.getElementById(`reg_${sid}`).value.trim();
  const type = parseInt(document.getElementById(`type_${sid}`).value) || 1;
  const certFile = document.getElementById(`cert_${sid}`).files[0] || null;

  if (!data[dept]) data[dept] = {};
  if (!data[dept][year]) data[dept][year] = [];

  const students = data[dept][year];
  let existing = students.find(s => s.reg === reg);

  function finish(certURL) {
    if (existing) {
      existing.points = (existing.points || 0) + type;
      if (certURL) existing.cert = certURL;
      alert(`${existing.name}'s record updated!`);
    } else {
      students.push({ name, reg, points: type, cert: certURL || null });
      alert(`New student added: ${name}`);
    }
    saveData(data);
    showLeaderboard(dept, year);
  }

  if (certFile) {
    const reader = new FileReader();
    reader.onload = e => finish(e.target.result);
    reader.onerror = () => finish(null);
    reader.readAsDataURL(certFile);
  } else {
    finish(null);
  }
}

// --- HTML Escaping ---
function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str).replace(/[&<>"'`=\/]/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;'
  }[s]));
}



