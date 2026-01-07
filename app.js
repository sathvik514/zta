function goHome() {
  window.location.href = "dashboard.html";
}

function goToTransfer() {
  window.location.href = "transfer.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "/";
}

window.onload = () => {
  const bal = localStorage.getItem("balance");
  if (bal && document.getElementById("balance")) {
    document.getElementById("balance").innerText = "₹ " + bal;
  }
};

async function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: user, password: pass })
  });

  if (!res.ok) {
    alert("Login failed");
    return;
  }

  const data = await res.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("balance", data.balance);
  window.location.href = "dashboard.html";
}

async function transferMoney() {
  const amount = document.getElementById("amount").value;
  const token = localStorage.getItem("token");

  const res = await fetch("/transfer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ amount: Number(amount) })
  });

  if (!res.ok) {
    alert("Blocked by Zero Trust");
    return;
  }

  const data = await res.json();
  localStorage.setItem("balance", data.balance);
  alert("Transfer successful");
  window.location.href = "dashboard.html";
}
