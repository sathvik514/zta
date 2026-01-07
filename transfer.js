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
