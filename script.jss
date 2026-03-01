const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwteftRrWcI6wWHPaEXXNM_ZKcc3cuE1GnPyWWDkXL-6xmB636mMyDlCIHcjkM7uc1jdg/exec"; // PASTE YOUR URL HERE
let records = JSON.parse(localStorage.getItem('nk_records')) || [];

function toggleForm() {
    document.getElementById('form-panel').classList.toggle('active');
    document.getElementById('form-overlay').classList.toggle('active');
}

function displayRecords(data = records) {
    const list = document.getElementById('record-list');
    document.getElementById('student-count').innerText = records.length;
    list.innerHTML = '';

    if(data.length === 0) {
        list.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 40px; color:#94a3b8">No Students Found.</td></tr>`;
        return;
    }

    data.forEach((r, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="student-name">${r.name}</div>
                <div class="student-sub">${r.email}</div>
            </td>
            <td><span class="badge">${r.grade}</span></td>
            <td>
                <div class="student-name">${r.gName}</div>
                <div class="student-sub">${r.gPhone}</div>
            </td>
            <td style="text-align:right">
                <i class="fa-solid fa-pen" onclick="editRecord(${i})" style="color:blue; cursor:pointer; margin-right:15px"></i>
                <i class="fa-solid fa-trash" onclick="deleteRecord(${i})" style="color:red; cursor:pointer"></i>
            </td>
        `;
        list.appendChild(tr);
    });
}

document.getElementById('record-form').onsubmit = async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerText = "Processing...";
    submitBtn.disabled = true;

    const studentData = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        grade: document.getElementById('grade').value,
        address: document.getElementById('address').value,
        gName: document.getElementById('g-name').value,
        gPhone: document.getElementById('g-phone').value,
        email: document.getElementById('email').value
    };

    const idx = parseInt(document.getElementById('edit-index').value);

    // Save to Google Sheets
    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(studentData)
        });

        if(idx === -1) records.push(studentData);
        else records[idx] = studentData;

        localStorage.setItem('nk_records', JSON.stringify(records));
        alert("✅ Registered Successfully!");
        
        displayRecords();
        toggleForm();
        document.getElementById('record-form').reset();
    } catch (err) {
        alert("Check Internet Connection!");
    } finally {
        submitBtn.innerText = "Register Student";
        submitBtn.disabled = false;
    }
};

function searchRecords() {
    const term = document.getElementById('search-input').value.toLowerCase();
    const filtered = records.filter(r => r.name.toLowerCase().includes(term) || r.email.toLowerCase().includes(term));
    displayRecords(filtered);
}

// Initial Load
displayRecords();
// Function to Open/Close the Registration Panel
function toggleForm() {
    const panel = document.getElementById('form-panel');
    const overlay = document.getElementById('form-overlay');
    
    // This adds/removes the "active" class which controls visibility
    panel.classList.toggle('active');
    overlay.classList.toggle('active');
    
    console.log("Panel toggled"); // This helps you check if the tap is working
}

// Ensure the button in HTML looks exactly like this:
// <button class="fab" onclick="toggleForm()"> <i class="fa-solid fa-plus"></i> </button>

