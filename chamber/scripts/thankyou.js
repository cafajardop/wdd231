const params = new URLSearchParams(window.location.search);

const setText = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value && value.trim() ? value : "—";
};

setText("out-fname", params.get("fname"));
setText("out-lname", params.get("lname"));
setText("out-email", params.get("email"));
setText("out-phone", params.get("phone"));
setText("out-org", params.get("org"));

// Timestamp: viene en ISO desde join.js
const ts = params.get("timestamp");
let formatted = ts;

if (ts) {
    const d = new Date(ts);
    if (!Number.isNaN(d.getTime())) {
        formatted = d.toLocaleString();
    }
}

setText("out-timestamp", formatted);


const email = params.get("email") || "";
const emailEl = document.getElementById("out-email");
if (emailEl) {
  emailEl.textContent = email.trim() ? email : "—";
  emailEl.href = email.trim() ? `mailto:${email}` : "";
}

