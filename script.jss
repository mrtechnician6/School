const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwteftRrWcI6wWHPaEXXNM_ZKcc3cuE1GnPyWWDkXL-6xmB636mMyDlCIHcjkM7uc1jdg/exec";
let records = JSON.parse(localStorage.getItem('shree_kinder_data')) || [];

// Wait for the page to be fully ready
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('form-overlay');
    const openBtn = document.getElementById('open-form-btn');
    const closeBtn = document.getElementById('close-form-btn');
    const form = document.getElementById('record-form');

    // --- BUTTON TRIGGER LOGIC ---
    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.add('active');
            console.log("Registration Panel Opened");
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
        });
    }

    // --- DATA SUBMISSION LOGIC ---
    form.onsubmit = async (e) => {
        e.preventDefault();
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.innerHTML = '<i class="fa-solid fa-sync fa-spin"></i> Saving to Cloud...';
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
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(student)
            });

            records.unshift(student);
            localStorage.setItem('shree_kinder_data', JSON.stringify(records));
            
            alert("✅ Registered Successfully at Shree Kinder Garden Academy!");
            
            renderCards();
            form.reset();
            overlay.classList.remove('active');
        } catch (err) {
            alert("Error: Check your internet connection.");
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

    if (data.length === 0) {
        grid.innerHTML = '<p style="text-align:center; width:100%; color:#94a3b8; margin-top:50px;">No students registered yet.</p>';
        return;
    }

    data.forEach(r => {
        const card = document.createElement('div');
        card.className = 'student-card';
        card.innerHTML = `
            <div class="card-name">${r.name}</div>
            <div class="card-info"><i class="fa-solid fa-user-graduate"></i> Grade: ${r.grade}</div>
            <div class="card-info"><i class="fa-solid fa-phone"></i> ${r.gPhone}</div>
            <div class="card-tag">Guardian: ${r.gName}</div>
        `;
        grid.appendChild(card);
    });
}
