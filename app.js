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
  const dealAmountInitialEl = document.getElementById("deal-amount-initial");
  const dealAmountEl = document.getElementById("deal-amount");
  const dealNoteEl = document.getElementById("deal-note");

  const btnConfirmPayment = document.getElementById("btn-confirm-payment");
  const btnSendAccount = document.getElementById("btn-send-account");
  const btnConfirmOk = document.getElementById("btn-confirm-ok");
  const btnDispute = document.getElementById("btn-dispute");

  // Admin demo elements
  const adminDealStatusEl = document.getElementById("admin-deal-status");
  const adminNoteEl = document.getElementById("admin-note");
  const adminReleaseBtn = document.getElementById("admin-release");
  const adminRefundBtn = document.getElementById("admin-refund");

  function updateDealUI() {
    if (!currentDeal) {
      // User view
      dealIdEl.textContent = "No deal created yet";
      dealStatusEl.textContent = "–";
      dealBuyerEl.textContent = "–";
      dealAccountEl.textContent = "–";
      dealAmountInitialEl.textContent = "–";
      dealAmountEl.textContent = "–";
      dealNoteEl.textContent = "Create a deal to begin the demo flow.";

      // Admin view
      if (adminDealStatusEl && adminNoteEl) {
        adminDealStatusEl.textContent = "No deal";
        adminNoteEl.textContent =
          "Create a deal and progress it to see admin options.";
      }
      return;
    }

    // User view
    dealIdEl.textContent = `Deal #${currentDeal.id}`;
    dealBuyerEl.textContent = currentDeal.buyer;
    dealAccountEl.textContent = `${currentDeal.accountType} • demo account`;
    dealAmountInitialEl.textContent = currentDeal.priceInitial
      ? `$${currentDeal.priceInitial}`
      : "–";
    dealAmountEl.textContent = currentDeal.priceAgreed
      ? `$${currentDeal.priceAgreed}`
      : "–";
    dealStatusEl.textContent = currentDeal.status;

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
        dealNoteEl.textContent =
          "Deal completed – funds released to seller (demo).";
        break;
      case "Disputed":
        dealNoteEl.textContent =
          "Deal is in dispute – in the real app, admin would review evidence.";
        break;
      case "Refunded (demo)":
        dealNoteEl.textContent =
          "Deal refunded to buyer (demo – no real money moved).";
        break;
      default:
        dealNoteEl.textContent = "";
    }

    // Admin view
    if (adminDealStatusEl && adminNoteEl) {
      adminDealStatusEl.textContent = currentDeal.status;

      if (currentDeal.status === "Disputed") {
        adminNoteEl.textContent =
          "Deal is disputed. Admin can review evidence and choose to release or refund.";
      } else if (currentDeal.status === "Completed") {
        adminNoteEl.textContent = "Admin: deal already completed.";
      } else if (currentDeal.status === "Refunded (demo)") {
        adminNoteEl.textContent =
          "Admin: buyer has been refunded in this demo flow.";
      } else {
        adminNoteEl.textContent =
          "Admin actions are demo only. In production, this would be tied to real payments and evidence.";
      }
    }
  }

  if (createDealForm) {
    createDealForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(createDealForm);
      const accountType = formData.get("accountType");
      const priceInitial = formData.get("priceInitial");
      const priceAgreed = formData.get("priceAgreed");
      const buyer = formData.get("buyer");

      currentDeal = {
        id: Math.floor(Math.random() * 90000) + 10000,
        accountType,
        priceInitial,
        priceAgreed,
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

  // Admin actions (demo)
  if (adminReleaseBtn) {
    adminReleaseBtn.addEventListener("click", () => {
      if (!currentDeal) return alert("No deal to manage.");
      if (
        currentDeal.status !== "Disputed" &&
        currentDeal.status !== "Account Sent"
      )
        return alert("Admin typically acts on disputed or pending deals.");
      currentDeal.status = "Completed";
      updateDealUI();
      alert("Demo: admin chose to release funds to seller.");
    });
  }

  if (adminRefundBtn) {
    adminRefundBtn.addEventListener("click", () => {
      if (!currentDeal) return alert("No deal to manage.");
      if (
        currentDeal.status !== "Disputed" &&
        currentDeal.status !== "Account Sent"
      )
        return alert("Admin typically acts on disputed or pending deals.");
      currentDeal.status = "Refunded (demo)";
      updateDealUI();
      alert("Demo: admin chose to refund buyer.");
    });
  }

  // Simple negotiation chat (demo only) + click-to-use price
  const chatForm = document.getElementById("chat-form");
  const chatMessages = document.getElementById("chat-messages");
  const chatSender = document.getElementById("chat-sender");
  const chatText = document.getElementById("chat-text");
  const agreedPriceInput = document.querySelector('input[name="priceAgreed"]');

  if (chatForm && chatMessages && chatSender && chatText) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const sender = chatSender.value;
      const text = chatText.value.trim();
      if (!text) return;

      const div = document.createElement("div");
      div.classList.add("chat-message");
      if (sender === "Buyer") div.classList.add("chat-buyer");
      if (sender === "Seller") div.classList.add("chat-seller");
      div.textContent = `${sender}: ${text}`;
      chatMessages.appendChild(div);

      chatMessages.scrollTop = chatMessages.scrollHeight;
      chatText.value = "";
    });

    // Click a chat message to use its number as agreed price
    chatMessages.addEventListener("click", (e) => {
      const msg = e.target.closest(".chat-message");
      if (!msg || !agreedPriceInput) return;

      const text = msg.textContent || "";
      const match = text.match(/(\d+(\.\d+)?)/);
      if (!match) return;

      const value = match[1];
      agreedPriceInput.value = value;
      alert(
        `Demo: set final agreed price to ${value} based on this message.`
      );
    });
  }

  // Initialize UI
  updateDealUI();
});
