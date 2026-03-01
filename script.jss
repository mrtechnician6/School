// 1. UNIQUE KEY - Use a specific key for NK Digital to avoid conflicts
const STORAGE_KEY = 'NK_Digital_Student_Database_v1';

// 2. INITIAL LOAD - Get data immediately
let records = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const recordForm = document.getElementById('record-form');
const recordList = document.getElementById('record-list');
const studentCountDisplay = document.getElementById('student-count');
const sidebar = document.getElementById('sidebar');

// Function to save to "Lifetime" LocalStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        console.log("Data synchronized to local storage successfully.");
    } catch (error) {
        alert("Storage is full or disabled. Data might not be saved.");
    }
}

// Function to Render Records
function displayRecords(data = records) {
    recordList.innerHTML = '';
    studentCountDisplay.innerText = records.length;

    if (data.length === 0) {
        recordList.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 50px; color: #94a3b8;">
            <i class="fa-solid fa-folder-open" style="font-size: 2rem; display:block; margin-bottom:10px;"></i>
            No records found.
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
            <td class="actions" style="text-align:right">
                <i class="fa-solid fa-pen btn-icon edit" onclick="editRecord(${index})"></i>
                <i class="fa-solid fa-trash btn-icon delete" onclick="deleteRecord(${index})"></i>
            </td>
        `;
        recordList.appendChild(row);
    });
}

// Add or Update Logic
recordForm.addEventListener('submit', (e) => {
    e.preventDefault(); // STOPS THE PAGE FROM REFRESHING (Crucial for saving)
    
    const editIndex = parseInt(document.getElementById('edit-index').value);

    const studentData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        grade: document.getElementById('grade').value,
        address: document.getElementById('address').value,
        gName: document.getElementById('g-name').value,
        gPhone: document.getElementById('g-phone').value,
        email: document.getElementById('email').value
    };

    if (editIndex === -1) {
        // Create new
        records.push(studentData);
    } else {
        // Update existing
        records[editIndex] = studentData;
        document.getElementById('edit-index').value = -1;
        document.getElementById('submit-btn').innerHTML = `<i class="fa-solid fa-user-plus"></i> Register Student`;
    }

    // MANDATORY STEPS FOR SAVING
    saveToLocalStorage(); // Write to browser memory
    displayRecords();     // Update UI
    recordForm.reset();   // Clear form
    
    if(window.innerWidth < 900) sidebar.classList.remove('active');
});

// Delete Logic
function deleteRecord(index) {
    if(confirm("Are you sure? This cannot be undone.")) {
        records.splice(index, 1);
        saveToLocalStorage(); // Update memory after delete
        displayRecords();     // Update UI
    }
}

// Edit Logic
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

// Initial display on page load
displayRecords();
