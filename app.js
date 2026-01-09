console.log("Alien Safe Escrow demo app loaded");

document.addEventListener("DOMContentLoaded", () => {
  // Mobile header menu
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileNav = document.getElementById("mobile-nav");

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener("click", () => {
      const isOpen = mobileNav.style.display === "flex";
      mobileNav.style.display = isOpen ? "none" : "flex";
    });

    // Close menu when a link is clicked
    mobileNav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        mobileNav.style.display = "none";
      }
    });
  }

  // Simple SPA-style navigation between app screens
  const navLinks = document.querySelectorAll(".app-nav-link");
  const screens = document.querySelectorAll(".app-screen");

  function showScreen(screenId) {
    screens.forEach((s) => {
      if (s.id === screenId) {
        s.classList.add("active");
      } else {
        s.classList.remove("active");
      }
    });

    navLinks.forEach((btn) => {
      if (btn.dataset.screen === screenId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Scroll to app section when changing screens
    const appMain = document.getElementById("app-main");
    if (appMain) {
      appMain.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  navLinks.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.screen;
      if (target) showScreen(target);
    });
  });

  // Buttons/links with data-screen-jump (from landing, hero, auth links)
  document.querySelectorAll("[data-screen-jump]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const target = el.getAttribute("data-screen-jump");
      if (target) {
        e.preventDefault();
        showScreen(target);
      }
    });
  });

  // Landing "Get started" button
  const landingGetStarted = document.getElementById("landing-get-started");
  if (landingGetStarted) {
    landingGetStarted.addEventListener("click", () => {
      showScreen("login");
    });
  }

  // Default screen when page loads
  showScreen("create-deal");

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const createDealForm = document.getElementById("create-deal-form");
  const loginGuestBtn = document.getElementById("login-guest");

  // Demo login/register
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Demo login: in the real app, we will authenticate you here.");
      showScreen("create-deal");
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Demo register: in the real app, we will create your account here.");
      showScreen("create-deal");
    });
  }

  if (loginGuestBtn) {
    loginGuestBtn.addEventListener("click", () => {
      alert("Demo: continuing as guest.");
      showScreen("create-deal");
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
      if (dealIdEl) dealIdEl.textContent = "No deal created yet";
      if (dealStatusEl) dealStatusEl.textContent = "–";
      if (dealBuyerEl) dealBuyerEl.textContent = "–";
      if (dealAccountEl) dealAccountEl.textContent = "–";
      if (dealAmountInitialEl) dealAmountInitialEl.textContent = "–";
      if (dealAmountEl) dealAmountEl.textContent = "–";
      if (dealNoteEl)
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
    if (dealIdEl) dealIdEl.textContent = `Deal #${currentDeal.id}`;
    if (dealBuyerEl) dealBuyerEl.textContent = currentDeal.buyer;
    if (dealAccountEl)
      dealAccountEl.textContent = `${currentDeal.accountType} • demo account`;
    if (dealAmountInitialEl)
      dealAmountInitialEl.textContent = currentDeal.priceInitial
        ? `$${currentDeal.priceInitial}`
        : "–";
    if (dealAmountEl)
      dealAmountEl.textContent = currentDeal.priceAgreed
        ? `$${currentDeal.priceAgreed}`
        : "–";
    if (dealStatusEl) dealStatusEl.textContent = currentDeal.status;

    if (dealNoteEl) {
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
      showScreen("create-deal");
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
      showScreen("admin-panel");
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
      alert(`Demo: set final agreed price to ${value} based on this message.`);
    });
  }

  // Initialize UI
  updateDealUI();
});
