// LOGIN
function login() {
    let role = document.getElementById("role").value;
    let user = document.getElementById("username").value;

    localStorage.setItem("user", user);
    localStorage.setItem("role", role);

    if (role === "faculty") {
        window.location.href = "faculty-dashboard.html";
    } else {
        window.location.href = "student-dashboard.html";
    }
}

// =========================
// FACULTY - QR GENERATION
// =========================

let currentQR = "";

function generateQR() {
    setInterval(() => {
        currentQR = "CLASS-" + Math.floor(Math.random() * 10000);
        document.getElementById("qr").innerText = currentQR;

        // Save active QR + time
        localStorage.setItem("activeQR", currentQR);
        localStorage.setItem("qrTime", Date.now());

    }, 10000);
}

// =========================
// STUDENT - SCAN QR
// =========================

function scanQR() {

    let scanned = document.getElementById("qrInput").value;
    let activeQR = localStorage.getItem("activeQR");
    let time = localStorage.getItem("qrTime");

    let now = Date.now();

    // 10 sec validity
    if (now - time > 10000) {
        alert("QR Expired ❌");
        return;
    }

    if (scanned !== activeQR) {
        alert("Invalid QR ❌");
        return;
    }

    // Prevent duplicate
    let records = JSON.parse(localStorage.getItem("attendance") || "[]");
    let today = new Date().toLocaleDateString();

    let already = records.find(r => r.date === today);

    if (already) {
        alert("Already Marked ❌");
        return;
    }

    // Save attendance
    records.push({ date: today, status: "Present" });
    localStorage.setItem("attendance", JSON.stringify(records));

    alert("Attendance Marked ✅");
}

// =========================
// HISTORY
// =========================

function loadHistory() {

    let records = JSON.parse(localStorage.getItem("attendance") || "[]");

    let table = document.getElementById("table");

    records.forEach(r => {
        table.innerHTML += `<tr>
<td>${r.date}</td>
<td>${r.status}</td>
</tr>`;
    });
}

// =========================
// PERCENTAGE
// =========================

function loadPercentage() {

    let records = JSON.parse(localStorage.getItem("attendance") || "[]");

    let total = 30; // assumed classes
    let present = records.length;

    let percent = (present / total) * 100;

    document.getElementById("percent").innerText =
        percent.toFixed(2) + "%";
}
function scanRealQR(scanned) {

    let activeQR = localStorage.getItem("activeQR");
    let time = localStorage.getItem("qrTime");

    let now = Date.now();

    // Expiry check
    if (now - time > 10000) {
        alert("QR Expired ❌");
        return;
    }

    // Match QR
    if (scanned !== activeQR) {
        alert("Invalid QR ❌");
        return;
    }

    // Duplicate check
    let records = JSON.parse(localStorage.getItem("attendance") || "[]");
    let today = new Date().toLocaleDateString();

    if (records.find(r => r.date === today)) {
        alert("Already Marked ❌");
        return;
    }

    // Save
    records.push({ date: today, status: "Present" });
    localStorage.setItem("attendance", JSON.stringify(records));

    alert("Attendance Marked ✅");
}
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 50; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        p.y += 0.5;
        if (p.y > canvas.height) p.y = 0;
    });

    requestAnimationFrame(animate);
}

animate();
