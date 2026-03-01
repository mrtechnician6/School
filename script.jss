 // DOM Elements
const recordForm = document.getElementById('record-form');
const recordList = document.getElementById('record-list');
const studentCountDisplay = document.getElementById('student-count');
const sidebar = document.getElementById('sidebar');

// Mobile Menu Listeners
document.getElementById('menu-open').addEventListener('click', () => sidebar.classList.add('active'));
document.getElementById('menu-close').addEventListener('click', () => sidebar.classList.remove('active'));

let records = JSON.parse(localStorage.getItem('student_records')) || [];

function displayRecords(data = records) {
    recordList.innerHTML = '';
    studentCountDisplay.innerText = records.length;

    if (data.length === 0) {
        recordList.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 50px; color: #94a3b8;">
            <i class="fa-solid fa-folder-open" style="font-size: 2rem; display:block; margin-bottom:10px;"></i>
            No students matching your criteria.
        </td></tr>`;
        return;
    }

    data.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="student-meta">
                    <div>${record.name}</div>
                    <span>${record.email}</span>
                </div>
            </td>
            <td><span style="background:#f1f5f9; padding:4px 8px; border-radius:4px;">${record.grade}</span></td>
            <td>${record.gName}</td>
            <td>${record.gPhone}</td>
            <td class="actions">
                <i class="fa-solid fa-pen btn-icon edit" onclick="editRecord(${index})"></i>
                <i class="fa-solid fa-trash btn-icon delete" onclick="deleteRecord(${index})"></i>
            </td>
        `;
        recordList.appendChild(row);
    });
}

recordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const studentData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        grade: document.getElementById('grade').value,
        address: document.getElementById('address').value,
        gName: document.getElementById('g-name').value,
        gPhone: document.getElementById('g-phone').value,
        email: document.getElementById('email').value
    };

    const editIndex = parseInt(document.getElementById('edit-index').value);

    // Duplicate Check
    const exists = records.some((r, i) => r.email === studentData.email && i !== editIndex);
    if (exists) return alert("Email already exists in system!");

    if (editIndex === -1) {
        records.push(studentData);
    } else {
        records[editIndex] = studentData;
        document.getElementById('edit-index').value = -1;
        document.getElementById('submit-btn').innerHTML = `<i class="fa-solid fa-user-plus"></i> Register Student`;
    }

    localStorage.setItem('student_records', JSON.stringify(records));
    recordForm.reset();
    displayRecords();
    if(window.innerWidth < 900) sidebar.classList.remove('active');
});

function searchRecords() {
    const term = document.getElementById('search-input').value.toLowerCase();
    const filtered = records.filter(r => 
        r.name.toLowerCase().includes(term) || 
        r.email.toLowerCase().includes(term) ||
        r.grade.toLowerCase().includes(term)
    );
    displayRecords(filtered);
}

function editRecord(index) {
    const r = records[index];
    document.getElementById('name').value = r.name;
    document.getElementById('age').value = r.age;
    document.getElementById('grade').value = r.grade;
    document.getElementById('address').value = r.address;
    document.getElementById('g-name').value = r.gName;
    document.getElementById('g-phone').value = r.gPhone;
    document.getElementById('email').value = r.email;
    document.getElementById('edit-index').value = index;
    
    document.getElementById('submit-btn').innerHTML = `<i class="fa-solid fa-check"></i> Save Changes`;
    if(window.innerWidth < 900) sidebar.classList.add('active');
}

function deleteRecord(index) {
    if(confirm("Permanently delete this student record?")) {
        records.splice(index, 1);
        localStorage.setItem('student_records', JSON.stringify(records));
        displayRecords();
    }
}

// Start
displayRecords();
