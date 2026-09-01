/* =========================
   COMPTE À REBOURS
========================= */

const target = new Date(
  "2026-10-01T00:00:00-04:00"
);

const els = {
  d: document.getElementById("days"),
  h: document.getElementById("hours"),
  m: document.getElementById("minutes")
};

function updateCountdown() {

  const diff =
    target - new Date();

  if (diff <= 0) {

    els.d.textContent = "00";
    els.h.textContent = "00";
    els.m.textContent = "00";

    return;
  }

  const days =
    Math.floor(
      diff / 86400000
    );

  const hours =
    Math.floor(
      (diff % 86400000) /
      3600000
    );

  const mins =
    Math.floor(
      (diff % 3600000) /
      60000
    );

  els.d.textContent =
    String(days).padStart(2, "0");

  els.h.textContent =
    String(hours).padStart(2, "0");

  els.m.textContent =
    String(mins).padStart(2, "0");
}

updateCountdown();

setInterval(
  updateCountdown,
  30000
);


/* =========================
   PORTAIL 18+
========================= */

const ageGate =
  document.getElementById(
    "ageGate"
  );

if (
  localStorage.getItem(
    "locktober18"
  ) !== "yes"
) {

  ageGate.classList.add(
    "show"
  );

  ageGate.setAttribute(
    "aria-hidden",
    "false"
  );
}

document
  .getElementById(
    "confirmAge"
  )
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
  .querySelectorAll(
    "[data-plan]"
  )
  .forEach(
    btn => {

      btn.addEventListener(
        "click",
        () => {

          const plan =
            btn.dataset.plan;

          const select =
            document.getElementById(
              "planSelect"
            );

          [
            ...select.options
          ].forEach(
            option => {

              if (
                option.textContent
                  .startsWith(plan)
              ) {

                select.value =
                  option.value;
              }
            }
          );
        }
      );
    }
  );


/* =========================
   GOOGLE FORMS
========================= */

const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSdeItWSArP_weYXEFbKhUtXagi4IwuEA3N7pAQQK2t7BaJ_Dw/formResponse";


const responsibilityText =
  "Je comprends que le choix, l’achat, l’ajustement, l’utilisation, l’entretien, les tests et le bon fonctionnement de mon matériel sont entièrement sous ma responsabilité.";


const safetyText =
  "Je comprends que je dois être en mesure de retirer ou d’interrompre immédiatement l’utilisation de mon dispositif en cas de douleur, engourdissement, blessure, problème de circulation ou toute autre préoccupation liée à ma sécurité.";


/* =========================
   CORRESPONDANCE DES FORFAITS
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
   CORRESPONDANCE DU MATÉRIEL
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


interestForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();


    const status =
      document.getElementById(
        "formStatus"
      );


    const submitButton =
      interestForm.querySelector(
        'button[type="submit"]'
      );


    const data =
      new FormData(
        interestForm
      );


    const checkboxes =
      interestForm.querySelectorAll(
        'input[type="checkbox"]'
      );


    /* Vérifie les deux confirmations */

    const allChecked =
      [
        ...checkboxes
      ].every(
        checkbox =>
          checkbox.checked
      );


    if (!allChecked) {

      status.textContent =
        "Veuillez confirmer les deux engagements avant de poursuivre.";

      return;
    }


    /* Préparation des données Google Forms */

    const payload =
      new URLSearchParams();


    payload.append(
      "entry.1082156186",
      data.get("name")
    );


    payload.append(
      "entry.1770294627",
      data.get("email")
    );


    payload.append(
      "entry.534363191",
      planMap[
        data.get("plan")
      ] ||
      data.get("plan")
    );


    payload.append(
      "entry.2091412279",
      equipmentMap[
        data.get("equipment")
      ] ||
      data.get("equipment")
    );


    payload.append(
      "entry.585545714",
      safetyText
    );


    payload.append(
      "entry.37918771",
      responsibilityText
    );


    /* Interface pendant l'envoi */

    submitButton.disabled =
      true;

    submitButton.textContent =
      "Envoi en cours…";

    status.textContent =
      "";


    try {

      await fetch(
        GOOGLE_FORM_ACTION,
        {
          method: "POST",

          mode: "no-cors",

          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded"
          },

          body:
            payload.toString()
        }
      );


      status.textContent =
        "Votre demande d’inscription a été transmise. Merci.";


      interestForm.reset();


    } catch (error) {

      console.error(
        "Erreur lors de l'envoi :",
        error
      );


      status.textContent =
        "L’envoi n’a pas fonctionné. Veuillez réessayer.";

    } finally {

      submitButton.disabled =
        false;

      submitButton.textContent =
        "Demander mon inscription";
    }
  }
);