const data = {};

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

function showLeaderboard(dept, year) {
    if (!data[dept]) data[dept] = {};
    if (!data[dept][year]) data[dept][year] = [];

    const students = data[dept][year];
    students.sort((a, b) => b.points - a.points);

    let tableRows = students.map(
        (s, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${s.name}</td>
            <td>${s.reg}</td>
            <td>${s.points}</td>
            <td>${s.cert ? `<img src="${s.cert}" class="cert-img">` : 'No Certificate'}</td>
        </tr>`
    ).join('');

    if (!tableRows) tableRows = `<tr><td colspan="5">No records yet</td></tr>`;

    document.getElementById('leaderboard').innerHTML = `
        <h3>${dept} - Year ${year} Leaderboard</h3>
        <table>
            <tr><th>Rank</th><th>Name</th><th>Register No</th><th>Points</th><th>Certificate</th></tr>
            ${tableRows}
        </table>

        <form onsubmit="addStudent(event,'${dept}',${year})">
            <input id="name" placeholder="Enter Full Name" required><br><br>
            <input id="reg" placeholder="Register Number" required><br><br>
            <select id="type">
                <option value="1">Participant (1 Point)</option>
                <option value="2">Runner-Up (2 Points)</option>
                <option value="3">Winner (3 Points)</option>
            </select><br><br>
            <input type="file" id="cert" accept="image/*"><br><br>
            <button type="submit">Add Student & Certificate</button>
        </form>
    `;
}

function addStudent(e, dept, year) {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const reg = document.getElementById('reg').value.trim();
    const type = parseInt(document.getElementById('type').value);
    const certFile = document.getElementById('cert').files[0];

    const students = data[dept][year];
    let existing = students.find(s => s.reg === reg);

    const reader = new FileReader();
    reader.onload = function (event) {
        const certURL = event.target.result;

        if (existing) {
            existing.points += type;
            if (certFile) existing.cert = certURL;
            alert(`${existing.name}'s points updated!`);
        } else {
            if (students.length >= 60) {
                alert("Maximum of 60 students reached for this department-year!");
                return;
            }
            students.push({ name, reg, points: type, cert: certFile ? certURL : null });
            alert(`New student added: ${name}`);
        }
        showLeaderboard(dept, year);
    };

    if (certFile) {
        reader.readAsDataURL(certFile);
    } else {
        if (existing) {
            existing.points += type;
            alert(`${existing.name}'s points updated!`);
        } else {
            if (students.length >= 60) {
                alert("Maximum of 60 students reached for this department-year!");
                return;
            }
            students.push({ name, reg, points: type, cert: null });
            alert(`New student added: ${name}`);
        }
        showLeaderboard(dept, year);
    }
}
