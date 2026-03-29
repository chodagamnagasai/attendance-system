function login() {
    let role = document.getElementById("role").value;
    let user = document.getElementById("username").value;

    if (!user) {
        alert("Enter name");
        return;
    }

    localStorage.setItem("user", user);
    localStorage.setItem("role", role);

    window.location.href =
        role === "faculty"
            ? "faculty-dashboard.html"
            : "student-dashboard.html";
}

function logout() {
    localStorage.clear();
}

let qrInterval;

function generateQR() {

    if (qrInterval) clearInterval(qrInterval);

    function refresh() {
        let code = "CLASS-" + Math.floor(Math.random() * 10000);
        document.getElementById("qr").innerText = code;

        localStorage.setItem("activeQR", code);
        localStorage.setItem("qrTime", Date.now());
    }

    refresh();
    qrInterval = setInterval(refresh, 10000);
}

function validateQR(scanned) {

    let activeQR = localStorage.getItem("activeQR");
    let time = localStorage.getItem("qrTime");

    if (!activeQR) {
        alert("No session");
        return;
    }

    if (Date.now() - time > 10000) {
        alert("QR expired");
        return;
    }

    if (scanned !== activeQR) {
        alert("Invalid QR");
        return;
    }

    let records = JSON.parse(localStorage.getItem("attendance") || "[]");
    let today = new Date().toLocaleDateString();

    if (records.find(r => r.date === today)) {
        alert("Already marked");
        return;
    }

    records.push({
        date:   today,
        status: "Present",
        name:   localStorage.getItem("user") || "Student",
        time:   new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    });
    localStorage.setItem("attendance", JSON.stringify(records));

    alert("Attendance marked ✅");
}

function scanRealQR(text) {
    validateQR(text);
}

function loadHistory() {
    let records = JSON.parse(localStorage.getItem("attendance") || "[]");
    let table = document.getElementById("historyTable");

    table.innerHTML = "";

    if (records.length === 0) {
        table.innerHTML = `<tr><td colspan="2" class="no-records">No attendance records yet.</td></tr>`;
        return;
    }

    records.forEach(r => {
        table.innerHTML += `<tr>
            <td>${r.date}</td>
            <td><span class="badge badge-green">${r.status}</span></td>
        </tr>`;
    });
}

function loadPercentage() {
    let records = JSON.parse(localStorage.getItem("attendance") || "[]");
    let percent = Math.min((records.length / 30) * 100, 100);
    document.getElementById("percent").innerText = percent.toFixed(1) + "%";
    const bar = document.getElementById("percentBar");
    if (bar) bar.style.width = percent + "%";
}