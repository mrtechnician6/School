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
    <script>
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwteftRrWcI6wWHPaEXXNM_ZKcc3cuE1GnPyWWDkXL-6xmB636mMyDlCIHcjkM7uc1jdg/exec";
        
        // Start with empty records to avoid showing "old" data from other platforms
        let records = JSON.parse(localStorage.getItem('shree_v3_clean')) || [];

        const searchInput = document.getElementById('search-input');
        const overlay = document.getElementById('overlay');
        const openBtn = document.getElementById('open-btn');
        const form = document.getElementById('reg-form');
        const countDisplay = document.getElementById('student-count');

        // --- 1. UNIVERSAL CLOUD SYNC ---
        // This ensures that whether you open in Messenger, Instagram, or Chrome, 
        // it always fetches the latest data from your Google Sheet.
        async function syncWithCloud() {
            countDisplay.innerText = "Loading..."; // Visual cue that it's fetching data
            try {
                const response = await fetch(SCRIPT_URL);
                const cloudData = await response.json();
                
                if (cloudData && Array.isArray(cloudData)) {
                    // Filter out any empty rows from the sheet
                    records = cloudData.filter(r => r.name).reverse(); 
                    localStorage.setItem('shree_v3_clean', JSON.stringify(records));
                    render();
                }
            } catch (err) {
                console.warn("Cloud Sync Failed. Showing local backup.");
                render(); // Fallback to local if offline
            }
        }

        // --- 2. SEARCH ENGINE (Starts With) ---
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            const filtered = records.filter(r => 
                r.name.toLowerCase().startsWith(term) || 
                r.grade.toString().toLowerCase().startsWith(term)
            );
            render(filtered, term);
        });

        // --- 3. UI LOGIC ---
        const toggle = (e) => { if(e) e.preventDefault(); overlay.classList.toggle('active'); };
        openBtn.addEventListener('click', toggle);
        overlay.onclick = (e) => { if(e.target === overlay) toggle(); };

        // --- 4. THE RENDER ENGINE ---
        function render(dataToDisplay = records, searchTerm = "") {
            const grid = document.getElementById('record-grid');
            countDisplay.innerText = dataToDisplay.length;
            grid.innerHTML = '';
            
            if (dataToDisplay.length === 0 && searchTerm !== "") {
                grid.innerHTML = `<div style="text-align:center;padding:50px;"><i class="fa-solid fa-user-xmark" style="font-size:3rem;color:#cbd5e1;"></i><h3>No Matches</h3></div>`;
                return;
            }

            if (dataToDisplay.length === 0 && !searchTerm) {
                grid.innerHTML = '<p style="text-align:center;color:#94a3b8;margin-top:50px;">Fetching records from cloud...</p>';
                return;
            }

            dataToDisplay.forEach(r => {
                const card = document.createElement('div');
                card.className = 'student-card';
                card.onclick = () => card.classList.toggle('expanded');
                card.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <div>
                            <h3 style="color:#0f172a;">${r.name}</h3>
                            <p style="font-size:0.8rem;color:#64748b;">Grade: ${r.grade} • <span style="color:var(--brand)">Details</span></p>
                        </div>
                        <i class="fa-solid fa-chevron-down" style="color:#cbd5e1;"></i>
                    </div>
                    <div class="student-details">
                        <div class="detail-item"><i class="fa-solid fa-user-shield"></i> <strong>Guardian:</strong> ${r.gName || r.gname}</div>
                        <div class="detail-item"><i class="fa-solid fa-phone"></i> <strong>Contact:</strong> ${r.gPhone || r.gphone}</div>
                        <div class="detail-item"><i class="fa-solid fa-map-location-dot"></i> <strong>Address:</strong> ${r.address || r.addr}</div>
                    </div>`;
                grid.appendChild(card);
            });
        }

        // --- 5. REGISTRATION LOGIC ---
        form.onsubmit = async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const originalText = btn.innerText;
            btn.innerText = "Syncing...";
            btn.disabled = true;

            const data = {
                name: document.getElementById('name').value,
                age: document.getElementById('age').value,
                grade: document.getElementById('grade').value,
                gName: document.getElementById('gname').value,
                gPhone: document.getElementById('gphone').value,
                email: document.getElementById('email').value,
                address: document.getElementById('addr').value
            };

            try {
                await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
                // Optimistically update UI
                records.unshift(data);
                localStorage.setItem('shree_v3_clean', JSON.stringify(records));
                form.reset();
                toggle();
                render();
                alert("✅ Registered in Cloud!");
            } catch (err) { alert("Network Error. Please try again."); }
            finally { btn.innerText = originalText; btn.disabled = false; }
        };

        // RUN ON STARTUP
        render(); // Show local data first
        syncWithCloud(); // Immediately fetch fresh data from the Sheet
    </script>
