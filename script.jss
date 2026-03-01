const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwteftRrWcI6wWHPaEXXNM_ZKcc3cuE1GnPyWWDkXL-6xmB636mMyDlCIHcjkM7uc1jdg/exec";
let records = JSON.parse(localStorage.getItem('shree_kinder_data')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('form-overlay');
    const openBtn = document.getElementById('open-form-btn');
    const closeBtn = document.getElementById('close-form-btn');
    const form = document.getElementById('record-form');

    // 1. Toggle Form Logic
    openBtn.addEventListener('click', () => overlay.classList.add('active'));
    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if(e.target === overlay) overlay.classList.remove('active');
    });

    // 2. Form Submission logic
    form.onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Securing Data...';
        submitBtn.disabled = true;

        const student = {
            name: document.getElementById('name').value,
            age: document.getElementById('age').value,
            grade: document.getElementById('grade').value,
            gName: document.getElementById('g-name').value,
            gPhone: document.getElementById('g-phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value
        };

        try {
            // Push to Google Sheets Lifetime Database
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(student)
            });

            // Update Local View
            records.unshift(student);
            localStorage.setItem('shree_kinder_data', JSON.stringify(records));
            
            alert("✅ Registered Successfully at Shree Kinder Garden Academy!");
            
            renderCards();
            form.reset();
            overlay.classList.remove('active');
        } catch (err) {
            alert("Connection Error. Please try again.");
        } finally {
            submitBtn.innerHTML = "Complete Registration";
            submitBtn.disabled = false;
        }
    };

    renderCards();
});

function renderCards(data = records) {
    const grid = document.getElementById('record-grid');
    document.getElementById('student-count').innerText = records.length;
    grid.innerHTML = '';

    data.forEach(r => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <div class="card-name">${r.name}</div>
            <div class="card-info"><i class="fa-solid fa-user-shield"></i> ${r.gName}</div>
            <div class="card-info"><i class="fa-solid fa-phone"></i> ${r.gPhone}</div>
            <div class="card-info"><i class="fa-solid fa-location-dot"></i> ${r.address}</div>
            <div class="card-tag">Grade: ${r.grade}</div>
        `;
        grid.appendChild(card);
    });
}

function searchRecords() {
    const term = document.getElementById('search-input').value.toLowerCase();
    const filtered = records.filter(r => r.name.toLowerCase().includes(term) || r.grade.toLowerCase().includes(term));
    renderCards(filtered);
}
