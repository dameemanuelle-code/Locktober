/* =========================
   COMPTE À REBOURS
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

  const days =
    Math.floor(diff / 86400000);

  const hours =
    Math.floor(
      (diff % 86400000) / 3600000
    );

  const mins =
    Math.floor(
      (diff % 3600000) / 60000
    );

  els.d.textContent =
    String(days).padStart(2, "0");

  els.h.textContent =
    String(hours).padStart(2, "0");

  els.m.textContent =
    String(mins).padStart(2, "0");
}

updateCountdown();

setInterval(updateCountdown, 30000);


/* =========================
   PORTAIL 18+
========================= */

const ageGate =
  document.getElementById("ageGate");

if (
  localStorage.getItem("locktober18")
  !== "yes"
) {

  ageGate.classList.add("show");

  ageGate.setAttribute(
    "aria-hidden",
    "false"
  );
}

document
  .getElementById("confirmAge")
  .addEventListener(
    "click",
    () => {

      localStorage.setItem(
        "locktober18",
        "yes"
      );

      ageGate.classList.remove(
        "show"
      );

      ageGate.setAttribute(
        "aria-hidden",
        "true"
      );
    }
  );


/* =========================
   CHOIX DU FORFAIT
========================= */

document
  .querySelectorAll("[data-plan]")
  .forEach(btn => {

    btn.addEventListener(
      "click",
      () => {

        const plan =
          btn.dataset.plan;

        const select =
          document.getElementById(
            "planSelect"
          );

        [...select.options]
          .forEach(option => {

            if (
              option.textContent
                .startsWith(plan)
            ) {

              select.value =
                option.value;
            }
          });
      }
    );
  });


/* =========================
   GOOGLE FORMS
========================= */

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSdeItWSArP_weYXEFbKhUtXagi4IwuEA3N7pAQQK2t7BaJ_Dw/formResponse";


/* Valeurs EXACTES attendues
   par Google Forms */

const responsibilityText =
  "Je comprends que le choix, l’achat, l’ajustement, l’utilisation, l’entretien, les tests et le bon fonctionnement de mon matériel sont entièrement sous ma responsabilité.";

const safetyText =
  "Je comprends que je dois être en mesure de retirer ou d’interrompre immédiatement l’utilisation de mon dispositif en cas de douleur, engourdissement, blessure, problème de circulation ou toute autre préoccupation liée à ma sécurité.";


/* =========================
   CORRESPONDANCE FORFAITS
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
   CORRESPONDANCE MATÉRIEL
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
   FORMULAIRE D’INSCRIPTION
========================= */

const interestForm =
  document.getElementById(
    "interestForm"
  );

const formStatus =
  document.getElementById(
    "formStatus"
  );


interestForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    /* =========================
       VALIDATION
    ========================= */

    const data =
      new FormData(
        interestForm
      );

    const checkboxes =
      interestForm.querySelectorAll(
        'input[type="checkbox"]'
      );

    const allChecked =
      [...checkboxes].every(
        checkbox =>
          checkbox.checked
      );

    if (!allChecked) {

      formStatus.textContent =
        "Veuillez confirmer les deux engagements avant de poursuivre.";

      return;
    }


    const submitButton =
      interestForm.querySelector(
        'button[type="submit"]'
      );


    /* =========================
       IFRAME INVISIBLE
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
       FORMULAIRE GOOGLE
       INVISIBLE
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


    /* Fonction permettant
       d’ajouter les champs */

    function addField(
      name,
      value
    ) {

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


    /* =========================
       PSEUDO / PRÉNOM
    ========================= */

    addField(
      "entry.1082156186",
      data.get("name")
    );


    /* =========================
       COURRIEL
    ========================= */

    addField(
      "entry.1770294627",
      data.get("email")
    );


    /* =========================
       FORFAIT
    ========================= */

    const selectedPlan =
      data.get("plan");

    const googlePlan =
      planMap[selectedPlan]
      || selectedPlan;

    addField(
      "entry.534363191",
      googlePlan
    );


    /* =========================
       MATÉRIEL
    ========================= */

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


    /* =========================
       SÉCURITÉ
    ========================= */

    addField(
      "entry.585545714",
      safetyText
    );


    /* =========================
       RESPONSABILITÉ
    ========================= */

    addField(
      "entry.37918771",
      responsibilityText
    );


    /* =========================
       AJOUT DU FORMULAIRE
    ========================= */

    document.body.appendChild(
      googleForm
    );


    /* =========================
       INTERFACE
    ========================= */

    submitButton.disabled =
      true;

    submitButton.textContent =
      "Envoi en cours…";

    formStatus.textContent =
      "Transmission de votre inscription…";


    /* =========================
       ENVOI VERS GOOGLE
    ========================= */

    googleForm.submit();


    /* =========================
       CONFIRMATION
    ========================= */

    setTimeout(
      () => {

        formStatus.textContent =
          "Votre demande d’inscription a été transmise. Merci.";

        interestForm.reset();

        submitButton.disabled =
          false;

        submitButton.textContent =
          "Demander mon inscription";

        googleForm.remove();

      },
      1500
    );

  }
);
