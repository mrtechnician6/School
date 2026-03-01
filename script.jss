    const recordForm = document.getElementById('record-form');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const emailInput = document.getElementById('email');
const recordList = document.getElementById('record-list');
const editIndexInput = document.getElementById('edit-index');
const studentCount = document.getElementById('student-count');

let records = JSON.parse(localStorage.getItem('records')) || [];

// Function to Render Records
function displayRecords(data = records) {
    recordList.innerHTML = '';
    studentCount.innerText = records.length;

    if (data.length === 0) {
        recordList.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px; color: #94a3b8;">No records found.</td></tr>`;
        return;
    }

    data.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${index + 1}</td>
            <td style="font-weight:600">${record.name}</td>
            <td>${record.age}</td>
            <td>${record.email}</td>
            <td style="text-align: center;">
                <i class="fa-solid fa-pen-to-square btn-edit" onclick="editRecord(${index})"></i>
                <i class="fa-solid fa-trash btn-delete" onclick="deleteRecord(${index})"></i>
            </td>
        `;
        recordList.appendChild(row);
    });
}

// Add or Update Logic
recordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value;
    const age = ageInput.value;
    const email = emailInput.value;
    const editIndex = parseInt(editIndexInput.value);

    // Duplicate Check (Exclude current record if editing)
    const isDuplicate = records.some((r, i) => r.email === email && i !== editIndex);
    if (isDuplicate) {
        alert("This email is already registered!");
        return;
    }

    if (editIndex === -1) {
        records.push({ name, age, email });
    } else {
        records[editIndex] = { name, age, email };
        editIndexInput.value = -1;
        document.getElementById('submit-btn').innerHTML = `<i class="fa-solid fa-user-plus"></i> Register Student`;
    }

    saveAndRefresh();
    recordForm.reset();
});

// Search Functionality
function searchRecords() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filtered = records.filter(r => 
        r.name.toLowerCase().includes(searchTerm) || 
        r.email.toLowerCase().includes(searchTerm)
    );
    displayRecords(filtered);
}

function editRecord(index) {
    const r = records[index];
    nameInput.value = r.name;
    ageInput.value = r.age;
    emailInput.value = r.email;
    editIndexInput.value = index;
    document.getElementById('submit-btn').innerHTML = `<i class="fa-solid fa-check"></i> Update Record`;
}

function deleteRecord(index) {
    if(confirm("Are you sure you want to remove this student?")) {
        records.splice(index, 1);
        saveAndRefresh();
    }
}

function saveAndRefresh() {
    localStorage.setItem('records', JSON.stringify(records));
    displayRecords();
}

// Initial Load
displayRecords();
