console.log("Escrow demo app loaded");

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const createDealForm = document.getElementById("create-deal-form");

  // Demo login/register
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Demo login: in the real app, we will authenticate you here.");
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Demo register: in the real app, we will create your account here.");
    });
  }

  // Escrow deal demo state
  let currentDeal = null;
  const dealIdEl = document.getElementById("deal-id");
  const dealStatusEl = document.getElementById("deal-status");
  const dealBuyerEl = document.getElementById("deal-buyer");
  const dealAccountEl = document.getElementById("deal-account");
  const dealAmountEl = document.getElementById("deal-amount");
  const dealNoteEl = document.getElementById("deal-note");

  const btnConfirmPayment = document.getElementById("btn-confirm-payment");
  const btnSendAccount = document.getElementById("btn-send-account");
  const btnConfirmOk = document.getElementById("btn-confirm-ok");
  const btnDispute = document.getElementById("btn-dispute");

  function updateDealUI() {
    if (!currentDeal) {
      dealIdEl.textContent = "No deal created yet";
      dealStatusEl.textContent = "–";
      dealBuyerEl.textContent = "–";
      dealAccountEl.textContent = "–";
      dealAmountEl.textContent = "–";
      dealNoteEl.textContent = "Create a deal to begin the demo flow.";
      return;
    }

    dealIdEl.textContent = `Deal #${currentDeal.id}`;
    dealBuyerEl.textContent = currentDeal.buyer;
    dealAccountEl.textContent = `${currentDeal.accountType} • demo account`;
    dealAmountEl.textContent = `$${currentDeal.price}`;
    dealStatusEl.textContent = currentDeal.status;

    // Set note based on status
    switch (currentDeal.status) {
      case "Awaiting Payment":
        dealNoteEl.textContent =
          "Buyer: confirm payment sent once you have paid into escrow.";
        break;
      case "Payment Confirmed":
        dealNoteEl.textContent =
          "Seller: send the account details to the buyer.";
        break;
      case "Account Sent":
        dealNoteEl.textContent =
          "Buyer: inspect the account (2 hours in real app), then confirm OK or raise dispute.";
        break;
      case "Completed":
        dealNoteEl.textContent = "Deal completed – funds released to seller (demo).";
        break;
      case "Disputed":
        dealNoteEl.textContent =
          "Deal is in dispute – in the real app, admin would review evidence.";
        break;
      default:
        dealNoteEl.textContent = "";
    }
  }

  if (createDealForm) {
    createDealForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(createDealForm);
      const accountType = formData.get("accountType");
      const price = formData.get("price");
      const buyer = formData.get("buyer");

      currentDeal = {
        id: Math.floor(Math.random() * 90000) + 10000,
        accountType,
        price,
        buyer,
        status: "Awaiting Payment",
      };

      updateDealUI();
      alert("Demo: deal created locally. No real payment is happening.");
    });
  }

  // State transitions
  if (btnConfirmPayment) {
    btnConfirmPayment.addEventListener("click", () => {
      if (!currentDeal) return alert("Create a deal first.");
      if (currentDeal.status !== "Awaiting Payment")
        return alert("Payment can only be confirmed once.");

      currentDeal.status = "Payment Confirmed";
      updateDealUI();
    });
  }

  if (btnSendAccount) {
    btnSendAccount.addEventListener("click", () => {
      if (!currentDeal) return alert("Create a deal first.");
      if (currentDeal.status !== "Payment Confirmed")
        return alert("Account should be sent after payment is confirmed.");

      currentDeal.status = "Account Sent";
      updateDealUI();
    });
  }

  if (btnConfirmOk) {
    btnConfirmOk.addEventListener("click", () => {
      if (!currentDeal) return alert("Create a deal first.");
      if (currentDeal.status !== "Account Sent")
        return alert("Buyer can confirm only after account is sent.");

      currentDeal.status = "Completed";
      updateDealUI();
    });
  }

  if (btnDispute) {
    btnDispute.addEventListener("click", () => {
      if (!currentDeal) return alert("Create a deal first.");
      if (currentDeal.status !== "Account Sent")
        return alert("Disputes can be raised after account is sent.");

      currentDeal.status = "Disputed";
      updateDealUI();
    });
  }

  // Initialize UI
  updateDealUI();
});
