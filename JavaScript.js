// Store all department-year data
const data = {};

// Function to display year buttons when a department is selected
function selectDept(dept) {
    document.getElementById('years').innerHTML = `
        <h3>${dept} Department - Select Year</h3>
        <button onclick="showLeaderboard('${dept}',1)">1st Year</button>
        <button onclick="showLeaderboard('${dept}',2)">2nd Year</button>
        <button onclick="showLeaderboard('${dept}',3)">3rd Year</button>
        <button onclick="showLeaderboard('${dept}',4)">4th Year</button>
    `;
    document.getElementById('leaderboard').innerHTML = "";
}

// Function to display leaderboard for a department and year
function showLeaderboard(dept, year) {
    if (!data[dept]) data[dept] = {};
    if (!data[dept][year]) data[dept][year] = [];

    const students = data[dept][year];
    students.sort((a, b) => b.points - a.points);

    // Create leaderboard table
    let tableRows = students
        .map(
            (s, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${s.name}</td>
                <td>${s.reg}</td>
                <td>${s.points}</td>
            </tr>`
        )
        .join('');

    if (!tableRows)
        tableRows = `<tr><td colspan="4">No records yet</td></tr>`;

    document.getElementById('leaderboard').innerHTML = `
        <h3>${dept} - Year ${year} Leaderboard</h3>
        <table>
            <tr><th>Rank</th><th>Name</th><th>Register No</th><th>Points</th></tr>
            ${tableRows}
        </table>

        <form onsubmit="addStudent(event,'${dept}',${year})">
            <input id="name" placeholder="Student Name" required><br><br>
            <input id="reg" placeholder="Register No" required><br><br>
            <select id="type">
                <option value="1">Participant (1 Point)</option>
                <option value="2">Runner (2 Points)</option>
                <option value="3">Winner (3 Points)</option>
            </select><br><br>
            <input type="file" id="cert" accept="image/*"><br><br>
            <button type="submit">Add Certificate</button>
        </form>
    `;
}

// Function to add or update student points
function addStudent(e, dept, year) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const reg = document.getElementById('reg').value.trim();
    const type = parseInt(document.getElementById('type').value);

    const students = data[dept][year];

    // Check if register number already exists
    let existing = students.find(s => s.reg === reg);

    if (existing) {
        // Update existing student's points
        existing.points += type;
        alert(`${existing.name}'s points updated!`);
    } else {
        // Allow only up to 60 students
        if (students.length >= 60) {
            alert("Maximum of 60 students reached for this department-year!");
            return;
        }
        students.push({ name, reg, points: type });
        alert(`New student added: ${name}`);
    }

    // Refresh leaderboard
    showLeaderboard(dept, year);
}
