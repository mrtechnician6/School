    <script>
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwteftRrWcI6wWHPaEXXNM_ZKcc3cuE1GnPyWWDkXL-6xmB636mMyDlCIHcjkM7uc1jdg/exec";
        
        // NK Digital Universal Sync: This ensures data persists across all platforms
        let records = []; 

        const searchInput = document.getElementById('search-input');
        const overlay = document.getElementById('overlay');
        const openBtn = document.getElementById('open-btn');
        const form = document.getElementById('reg-form');
        const countEl = document.getElementById('student-count');
        const syncIcon = document.getElementById('sync-icon');

        // --- 1. THE UNIVERSAL FETCH ENGINE ---
        // This is the "Truth" that syncs Messenger, Instagram, and Chrome
        async function syncWithCloud() {
            if(syncIcon) syncIcon.classList.add('spinning');
            countEl.innerText = "...";
            
            try {
                // Force a fresh fetch from the Google Sheet every time
                const response = await fetch(SCRIPT_URL);
                const cloudData = await response.json();
                
                if (cloudData && Array.isArray(cloudData)) {
                    // Filter and reverse so newest entries stay at the top
                    records = cloudData.filter(item => item.name).reverse();
                    // Keep a local backup just in case of no internet
                    localStorage.setItem('shree_universal_sync', JSON.stringify(records));
                    render();
                }
            } catch (err) {
                console.error("Cloud Sync Error:", err);
                // Fallback to local backup if the cloud fails
                records = JSON.parse(localStorage.getItem('shree_universal_sync')) || [];
                render();
            } finally {
                if(syncIcon) syncIcon.classList.remove('spinning');
            }
        }

        // --- 2. SEARCH (Starts-With Logic) ---
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            const filtered = records.filter(r => 
                (r.name && r.name.toLowerCase().startsWith(term)) || 
                (r.grade && r.grade.toString().toLowerCase().startsWith(term))
            );
            render(filtered, term);
        });

        // --- 3. UI CONTROLS ---
        const toggle = (e) => { if(e) e.preventDefault(); overlay.classList.toggle('active'); };
        openBtn.onclick = toggle;
        overlay.onclick = (e) => { if(e.target === overlay) toggle(); };

        // --- 4. RENDER ENGINE ---
        function render(dataToDisplay = records, searchTerm = "") {
            const grid = document.getElementById('record-grid');
            countEl.innerText = dataToDisplay.length;
            grid.innerHTML = '';
            
            if (dataToDisplay.length === 0) {
                grid.innerHTML = `
                    <div style="text-align: center; padding: 50px 20px;">
                        <i class="fa-solid fa-cloud-arrow-down" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 15px;"></i>
                        <h3 style="color: #0f172a;">${searchTerm ? 'No matches found' : 'Fetching Cloud Data...'}</h3>
                    </div>`;
                return;
            }

            dataToDisplay.forEach(r => {
                const card = document.createElement('div');
                card.className = 'student-card';
                card.onclick = () => card.classList.toggle('expanded');
                
                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <h3 style="color:#0f172a; margin-bottom:4px;">${r.name}</h3>
                            <p style="font-size:0.8rem; color:#64748b;">Grade: ${r.grade} • <span style="color:var(--brand)">Details</span></p>
                        </div>
                        <i class="fa-solid fa-chevron-down" style="color:#cbd5e1; font-size:0.8rem;"></i>
                    </div>
                    <div class="student-details">
                        <div class="detail-item"><i class="fa-solid fa-calendar-day"></i> <strong>Age:</strong> ${r.age}</div>
                        <div class="detail-item"><i class="fa-solid fa-user-shield"></i> <strong>Guardian:</strong> ${r.gName || r.gname}</div>
                        <div class="detail-item"><i class="fa-solid fa-phone"></i> <strong>Contact:</strong> ${r.gPhone || r.gphone}</div>
                        <div class="detail-item"><i class="fa-solid fa-map-location-dot"></i> <strong>Address:</strong> ${r.address || r.addr}</div>
                    </div>`;
                grid.appendChild(card);
            });
        }

        // --- 5. REGISTRATION (Auto-Syncs Cloud after Submit) ---
        form.onsubmit = async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            btn.innerText = "Syncing with Cloud...";
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
                form.reset();
                toggle();
                alert("✅ Registered! Visible on all platforms now.");
                // Immediately refresh the cloud data
                await syncWithCloud();
            } catch (err) { 
                alert("Error connecting to cloud."); 
            } finally { 
                btn.innerText = "Complete Registration"; 
                btn.disabled = false; 
            }
        };

        // STARTUP: The core of the fix. Always start by fetching from the cloud.
        syncWithCloud();
    </script>
