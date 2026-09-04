/* =========================
   COUNTDOWN
========================= */

const target = new Date("2026-10-01T00:00:00-04:00");

const els = {
  d: document.getElementById("days"),
  h: document.getElementById("hours"),
  m: document.getElementById("minutes")
};

function updateCountdown() {
  const diff = target - new Date();

  if (diff <= 0) {
    els.d.textContent = "00";
    els.h.textContent = "00";
    els.m.textContent = "00";
    return;
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);

  els.d.textContent = String(days).padStart(2, "0");
  els.h.textContent = String(hours).padStart(2, "0");
  els.m.textContent = String(mins).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 30000);


/* =========================
   18+ AGE GATE
========================= */

const ageGate = document.getElementById("ageGate");

if (localStorage.getItem("locktober18") !== "yes") {
  ageGate.classList.add("show");
  ageGate.setAttribute("aria-hidden", "false");
}

document
  .getElementById("confirmAge")
  .addEventListener("click", () => {
    localStorage.setItem("locktober18", "yes");
    ageGate.classList.remove("show");
    ageGate.setAttribute("aria-hidden", "true");
  });


/* =========================
   PLAN SELECTION
========================= */

document
  .querySelectorAll("[data-plan]")
  .forEach(btn => {

    btn.addEventListener("click", () => {

      const plan = btn.dataset.plan;
      const select = document.getElementById("planSelect");

      [...select.options].forEach(option => {
        if (option.value === plan) {
          select.value = option.value;
        }
      });

    });

  });


/* =========================
   GOOGLE FORM
========================= */

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSdeItWSArP_weYXEFbKhUtXagi4IwuEA3N7pAQQK2t7BaJ_Dw/formResponse";


/* Exact French values expected
   by the existing Google Form */

const responsibilityText =
  "Je comprends que le choix, l’achat, l’ajustement, l’utilisation, l’entretien, les tests et le bon fonctionnement de mon matériel sont entièrement sous ma responsabilité.";

const safetyText =
  "Je comprends que je dois être en mesure de retirer ou d’interrompre immédiatement l’utilisation de mon dispositif en cas de douleur, engourdissement, blessure, problème de circulation ou toute autre préoccupation liée à ma sécurité.";


/* =========================
   PLAN MAP
========================= */

const planMap = {

  "Le Registre — Gratuit":
    "Le Registre — Gratuit",

  "Sous contrôle — 129 $":
    "Sous contrôle — 129 $",

  "L’Engagement VIP — 449 $":
    "L’Engagement — 449 $"

};


/* =========================
   EQUIPMENT MAP
========================= */

const equipmentMap = {

  "Cage connectée":
    "Cage connectée",

  "Cage traditionnelle + coffre à clé connecté":
    "Cage traditionnelle + coffre à clé connecté",

  "Cage traditionnelle":
    "Cage traditionnelle",

  "À déterminer":
    "Je n’ai pas encore choisi"

};


/* =========================
   REGISTRATION FORM
========================= */

const interestForm =
  document.getElementById("interestForm");

const formStatus =
  document.getElementById("formStatus");


interestForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    const data =
      new FormData(interestForm);

    const checkboxes =
      interestForm.querySelectorAll(
        'input[type="checkbox"]'
      );

    const allChecked =
      [...checkboxes].every(
        checkbox => checkbox.checked
      );

    if (!allChecked) {

      formStatus.textContent =
        "Please confirm both statements before continuing.";

      return;
    }


    const submitButton =
      interestForm.querySelector(
        'button[type="submit"]'
      );


    /* =========================
       HIDDEN IFRAME
    ========================= */

    let iframe =
      document.getElementById(
        "googleFormFrame"
      );

    if (!iframe) {

      iframe =
        document.createElement(
          "iframe"
        );

      iframe.name =
        "googleFormFrame";

      iframe.id =
        "googleFormFrame";

      iframe.style.display =
        "none";

      document.body.appendChild(
        iframe
      );
    }


    /* =========================
       HIDDEN GOOGLE FORM
    ========================= */

    const googleForm =
      document.createElement(
        "form"
      );

    googleForm.method =
      "POST";

    googleForm.action =
      GOOGLE_FORM_ACTION;

    googleForm.target =
      "googleFormFrame";

    googleForm.style.display =
      "none";


    function addField(name, value) {

      const input =
        document.createElement(
          "input"
        );

      input.type =
        "hidden";

      input.name =
        name;

      input.value =
        value || "";

      googleForm.appendChild(
        input
      );
    }


    /* NAME / NICKNAME */

    addField(
      "entry.1082156186",
      data.get("name")
    );


    /* EMAIL */

    addField(
      "entry.1770294627",
      data.get("email")
    );


    /* PLAN */

    const selectedPlan =
      data.get("plan");

    const googlePlan =
      planMap[selectedPlan]
      || selectedPlan;

    addField(
      "entry.534363191",
      googlePlan
    );


    /* EQUIPMENT */

    const selectedEquipment =
      data.get("equipment");

    const googleEquipment =
      equipmentMap[
        selectedEquipment
      ]
      || selectedEquipment;

    addField(
      "entry.2091412279",
      googleEquipment
    );


    /* SAFETY */

    addField(
      "entry.585545714",
      safetyText
    );


    /* RESPONSIBILITY */

    addField(
      "entry.37918771",
      responsibilityText
    );


    document.body.appendChild(
      googleForm
    );


    /* =========================
       INTERFACE
    ========================= */

    submitButton.disabled =
      true;

    submitButton.textContent =
      "Sending…";

    formStatus.textContent =
      "Submitting your registration…";


    /* =========================
       SEND TO GOOGLE
    ========================= */

    googleForm.submit();


    /* =========================
       CONFIRMATION
    ========================= */

    setTimeout(
      () => {

        formStatus.textContent =
          "Your registration request has been submitted. Thank you.";

        interestForm.reset();

        submitButton.disabled =
          false;

        submitButton.textContent =
          "Request registration";

        googleForm.remove();

      },
      1500
    );

  }
);
