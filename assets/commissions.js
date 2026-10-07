const form = document.getElementById("commission-form");
const sent = document.getElementById("sent");
const status = form.querySelector(".form__status");
const submitBtn = form.querySelector('button[type="submit"]');
const submitLabel = submitBtn.querySelector(".submit__label");
const notConnected = form.action.includes("YOUR_FORM_ID");

// Show budget for USD/Robux, game potential questions for percentage.
const conditional = form.querySelectorAll("[data-show-for]");
form.querySelectorAll('input[name="payment"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    conditional.forEach((el) => {
      el.hidden = !el.dataset.showFor.split(" ").includes(radio.value);
    });
  });
});

function setError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

function validate() {
  const errors = [];
  const check = (ok, id, message, focusEl) => {
    setError(id, ok ? "" : message);
    if (!ok) errors.push(focusEl);
  };

  const discord = form.discord;
  check(discord.value.trim() !== "", "f-discord-err", "Add your Discord username so I can reply.", discord);

  const email = form.email;
  check(email.value.trim() === "" || email.validity.valid, "f-email-err", "That email doesn't look right.", email);

  const systems = form.querySelectorAll('input[name="systems"]');
  check([...systems].some((c) => c.checked), "f-systems-err", "Pick at least one.", systems[0]);

  const details = form.details;
  check(details.value.trim().length >= 20, "f-details-err", "Give me a bit more detail (at least a sentence or two).", details);

  const payment = form.querySelector('input[name="payment"]:checked');
  const firstPayment = form.querySelector('input[name="payment"]');
  check(payment !== null, "f-payment-err", "Choose how you'd like to pay.", firstPayment);

  const game = form.game_link;
  const gameOk = game.value.trim() === "" || game.validity.valid;
  const gameNeeded = payment && payment.value === "Percentage" && game.value.trim() === "";
  check(gameOk && !gameNeeded, "f-game-err",
    gameNeeded ? "Percentage deals need a game link." : "Use a full link starting with https://", game);

  const agree = form.agreed_to_terms;
  check(agree.checked, "f-agree-err", "You need to agree to the terms first.", agree);

  return errors;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "";
  status.dataset.tone = "";

  const errors = validate();
  if (errors.length) {
    errors[0].focus();
    status.textContent = "Fix the highlighted fields and try again.";
    status.dataset.tone = "error";
    return;
  }

  if (notConnected) {
    status.textContent = "The form isn't connected yet. Message Ruha.luau on Discord instead.";
    status.dataset.tone = "error";
    return;
  }

  submitBtn.disabled = true;
  submitLabel.textContent = "Sending";

  // Fields hidden by the payment choice shouldn't be sent.
  const data = new FormData(form);
  conditional.forEach((el) => {
    if (el.hidden) el.querySelectorAll("[name]").forEach((f) => data.delete(f.name));
  });

  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg = body.errors ? body.errors.map((e) => e.message).join(" ") : "";
      throw new Error(msg);
    }
    form.hidden = true;
    sent.hidden = false;
    sent.focus();
  } catch (err) {
    status.textContent = (err.message ? err.message + " " : "Something went wrong sending that. ")
      + "Try again, or message Ruha.luau on Discord.";
    status.dataset.tone = "error";
    submitBtn.disabled = false;
    submitLabel.textContent = "Send request";
  }
});

// Clear a field's error as soon as it's edited.
form.addEventListener("input", (event) => {
  const field = event.target.closest(".field");
  const err = field && field.querySelector(".field__error");
  if (err) err.textContent = "";
});
