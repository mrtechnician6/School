const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwteftRrWcI6wWHPaEXXNM_ZKcc3cuE1GnPyWWDkXL-6xmB636mMyDlCIHcjkM7uc1jdg/exec"; // Put your URL here

recordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Show a "Processing..." state on the button
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registering...';
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

    // Send data to Google Sheets
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Needed for Apps Script
        body: JSON.stringify(studentData)
    })
    .then(() => {
        // SUCCESS ACTIONS
        alert("✅ Registered Successfully! Data saved to Master Database.");
        
        // Save locally as a backup
        records.push(studentData);
        localStorage.setItem('student_records', JSON.stringify(records));
        
        displayRecords();
        recordForm.reset();
        
        // Reset button
        submitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Register Student';
        submitBtn.disabled = false;
        if(window.innerWidth < 900) sidebar.classList.remove('active');
    })
    .catch(error => {
        alert("Error saving data. Please check your internet connection.");
        submitBtn.disabled = false;
    });
});
