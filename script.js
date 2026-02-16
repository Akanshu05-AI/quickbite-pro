const meals = {
    breakfast: { s: 8.0, e: 10.5, n: "Breakfast", img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500", d: "8:00 AM - 10:30 AM" },
    lunch:     { s: 12.5, e: 14.5, n: "Lunch", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500", d: "12:30 PM - 2:30 PM" },
    snacks:    { s: 16.5, e: 17.5, n: "Snacks", img: "https://images.unsplash.com/photo-1601050690597-df056fb04791?w=500", d: "4:30 PM - 5:30 PM" },
    dinner:    { s: 20.0, e: 22.0, n: "Dinner", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500", d: "8:00 PM - 10:00 PM" }
};

let userLogs = JSON.parse(localStorage.getItem('qb_logs')) || [];
let securityLogs = JSON.parse(localStorage.getItem('qb_sec')) || [];
let adminClicks = 0;

function checkAdminTrigger() {
    if (++adminClicks === 3) {
        if (prompt("Secure Management Passcode:") === "admin123") {
            document.getElementById('admin-panel').style.display = 'block';
            updateAdmin();
        }
        adminClicks = 0;
    }
}

function updateApp() {
    const hour = new Date().getHours() + (new Date().getMinutes()/60);
    let selected;
    let greeting = "On the Menu Now";

    // Transition Engine: Always ready for next session
    if (hour < meals.breakfast.e) selected = meals.breakfast;
    else if (hour < meals.lunch.e) selected = meals.lunch;
    else if (hour < meals.snacks.e) selected = meals.snacks;
    else if (hour < meals.dinner.e) selected = meals.dinner;
    else { selected = meals.breakfast; greeting = "Next Day Preview"; }

    document.getElementById('meal-greeting').innerText = greeting;
    document.getElementById('food-name').innerText = selected.n;
    document.getElementById('food-desc').innerText = selected.d;
    document.getElementById('food-img').src = selected.img;

    const isOpen = hour >= (selected.s - 0.5) && hour < selected.e;
    document.getElementById('gen-btn').disabled = !isOpen;
}

function generateToken() {
    const name = document.getElementById('studentName').value;
    const roll = document.getElementById('rollNo').value;
    const year = document.getElementById('studentYear').value;
    if (!name || !roll || !year) return alert("System Error: Mandatory Fields Empty.");

    const hour = new Date().getHours() + (new Date().getMinutes()/60);
    const today = new Date().toLocaleDateString();
    let activeM = "Off-Hours";
    for(let k in meals) if(hour >= (meals[k].s-0.5) && hour < meals[k].e) activeM = meals[k].n;

    // Security Session Guard
    const duplicate = userLogs.some(l => l.roll === roll && l.meal === activeM && l.date === today);
    if (duplicate) {
        securityLogs.push({ roll, meal: activeM, time: new Date().toLocaleTimeString() });
        localStorage.setItem('qb_sec', JSON.stringify(securityLogs));
        updateAdmin();
        return alert("ACCESS DENIED: Session limit exceeded. Violation logged.");
    }

    const logEntry = { name, roll, year, meal: activeM, date: today, time: new Date().toLocaleTimeString() };
    userLogs.push(logEntry);
    localStorage.setItem('qb_logs', JSON.stringify(userLogs));
    
    document.getElementById('ticket').style.display = 'block';
    document.getElementById('displayStudent').innerText = name;
    document.getElementById('qrcode').innerHTML = "";
    new QRCode(document.getElementById("qrcode"), { text: `AUTH|${roll}|${activeM}|${today}`, width: 150, height: 150 });
    updateAdmin();
}

function downloadQR() {
    const img = document.querySelector('#qrcode img');
    if (!img) return alert("Error: No valid pass to save.");
    const link = document.createElement('a');
    link.href = img.src;
    link.download = `MealPass_${Date.now()}.png`;
    link.click();
}

function downloadCSV() {
    if (userLogs.length === 0) return alert("No data available for export.");
    let csv = "Name,Roll,Year,Meal,Time\n" + userLogs.map(l => `${l.name},${l.roll},${l.year},${l.meal},${l.time}`).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `Attendance_Report_${new Date().toLocaleDateString()}.csv`;
    a.click();
}

function updateAdmin() {
    document.getElementById('live-count').innerText = userLogs.length;
    document.getElementById('alert-count').innerText = securityLogs.length;
    
    // Industrial Crowd Analytics simulation
    const density = Math.min((userLogs.length / 40) * 100, 100);
    const fill = document.getElementById('crowd-fill');
    const status = document.getElementById('crowd-status');
    fill.style.width = density + "%";
    
    if (density < 40) { fill.style.background = "#00b894"; status.innerText = "Status: Optimal Service"; }
    else if (density < 80) { fill.style.background = "#fdcb6e"; status.innerText = "Status: Busy (Expect Delays)"; }
    else { fill.style.background = "#ff7675"; status.innerText = "Status: High Congestion (Critical)"; }

    document.getElementById('log-body').innerHTML = userLogs.map(u => `<tr><td>${u.name}</td><td>${u.roll}</td><td>${u.year}</td></tr>`).join('');
    document.getElementById('sec-body').innerHTML = securityLogs.map(s => `<tr><td>${s.roll}</td><td>${s.meal}</td><td>${s.time}</td></tr>`).join('');
}

function clearLogs() {
    if (confirm("DANGER: Wiping daily attendance and security data. Confirm?")) {
        userLogs = []; securityLogs = [];
        localStorage.clear();
        updateAdmin();
        location.reload();
    }
}

function closeAdmin() { document.getElementById('admin-panel').style.display = 'none'; }

setInterval(() => { 
    document.getElementById('live-clock').innerText = new Date().toLocaleTimeString(); 
    updateApp();
}, 1000);
updateApp();