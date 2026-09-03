/* ==================================================
   LOCKTOBER 2026
   PORTAIL PARTICIPANT — VERSION CONNECTÉE
================================================== */

const API_URL =
  "https://script.google.com/macros/s/AKfycbyhhlRxw3miDYY2BF2hC3-Rdf1GQiD8VmMqSwN5dNK91U7o0D4KoL2OfIvYaw8NkHbc/exec";


/* ==================================================
   CONSIGNES DE GROUPE
================================================== */

const dailyInstructions = [

  "Aujourd’hui marque le début de votre engagement. Prenez connaissance du protocole et préparez votre mois.",
  "La constance commence maintenant. Complétez votre journée et votre validation.",
  "Maintenez votre engagement et prenez quelques minutes pour observer votre discipline.",
  "Votre participation repose aujourd’hui sur la régularité.",
  "Première phase presque terminée. Maintenez votre engagement.",

  "La phase Discipline commence. Le défi devient maintenant la constance.",
  "Respectez votre routine et complétez votre validation.",
  "Une journée simple, mais importante : ne laissez pas votre discipline diminuer.",
  "Maintenez le protocole que vous avez accepté.",
  "Dixième journée. Prenez conscience du chemin déjà parcouru.",

  "Poursuivez sans chercher à accélérer le parcours.",
  "La régularité vaut davantage que l’intensité.",
  "Votre validation demeure attendue aujourd’hui.",
  "Maintenez votre engagement.",
  "Vous atteignez le milieu du mois. Continuez.",

  "La phase Contrôle commence aujourd’hui.",
  "Prenez votre progression au sérieux.",
  "Le protocole reste en place.",
  "Votre engagement se mesure désormais dans la durée.",
  "Vingtième journée. La constance devient votre principal défi.",

  "Continuez votre parcours.",
  "Votre validation quotidienne reste essentielle.",
  "Maintenez votre discipline.",
  "Ne relâchez pas votre engagement maintenant.",
  "Dernière journée de la phase Contrôle.",

  "La dernière ligne droite commence.",
  "Cinq jours restent à compléter.",
  "Maintenez votre parcours jusqu’au bout.",
  "Votre Locktober approche de sa conclusion.",
  "Avant-dernière journée. Complétez votre protocole.",

  "31 octobre. Votre Locktober arrive à son terme."

];


/* ==================================================
   VARIABLES
================================================== */

let currentParticipant = null;
let currentCode = null;


/* ==================================================
   ÉLÉMENTS
================================================== */

const loginScreen =
  document.getElementById("loginScreen");

const portal =
  document.getElementById("portal");

const loginForm =
  document.getElementById("loginForm");

const loginMessage =
  document.getElementById("loginMessage");

const accessCode =
  document.getElementById("accessCode");

const validationModal =
  document.getElementById("validationModal");


/* ==================================================
   AJOUT DU CHAMP COURRIEL
================================================== */

const loginButton =
  loginForm.querySelector(
    'button[type="submit"]'
  );

const emailLabel =
  document.createElement("label");

emailLabel.htmlFor =
  "accessEmail";

emailLabel.textContent =
  "Courriel utilisé lors de l’inscription";

const accessEmail =
  document.createElement("input");

accessEmail.id =
  "accessEmail";

accessEmail.type =
  "email";

accessEmail.placeholder =
  "votre@courriel.com";

accessEmail.autocomplete =
  "email";

accessEmail.required =
  true;

loginForm.insertBefore(
  emailLabel,
  loginButton
);

loginForm.insertBefore(
  accessEmail,
  loginButton
);


/* ==================================================
   DATE LOCKTOBER
================================================== */

function getLocktoberDay() {

  const now =
    new Date();

  const start =
    new Date(
      "2026-10-01T00:00:00-04:00"
    );

  const end =
    new Date(
      "2026-10-31T23:59:59-04:00"
    );

  if (now < start) {
    return 1;
  }

  if (now > end) {
    return 31;
  }

  const diff =
    now - start;

  const day =
    Math.floor(
      diff / 86400000
    ) + 1;

  return Math.min(
    Math.max(day, 1),
    31
  );
}


/* ==================================================
   PHASE
================================================== */

function getPhase(day) {

  if (day <= 5) {
    return "Engagement";
  }

  if (day <= 15) {
    return "Discipline";
  }

  if (day <= 25) {
    return "Contrôle";
  }

  return "Dernière ligne droite";
}


/* ==================================================
   NIVEAU DU FORFAIT
================================================== */

function getLevel(plan) {

  const value =
    String(plan || "")
      .toLowerCase();

  if (
    value.includes("engagement")
  ) {
    return "vip";
  }

  if (
    value.includes("sous contrôle")
  ) {
    return "personal";
  }

  return "group";
}


/* ==================================================
   STOCKAGE LOCAL VALIDATIONS
================================================== */

function getValidationKey() {

  return (
    "locktober-validations-" +
    currentCode
  );
}


function getValidations() {

  const raw =
    localStorage.getItem(
      getValidationKey()
    );

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  }

  catch {
    return {};
  }
}


function saveValidations(
  validations
) {

  localStorage.setItem(
    getValidationKey(),
    JSON.stringify(
      validations
    )
  );
}


/* ==================================================
   CONNEXION API
================================================== */

async function authenticateParticipant(
  code,
  email
) {

  const params =
    new URLSearchParams({
      code: code,
      email: email
    });

  const response =
    await fetch(
      API_URL +
      "?" +
      params.toString(),
      {
        method: "GET",
        cache: "no-store"
      }
    );

  if (!response.ok) {

    throw new Error(
      "Réponse serveur invalide."
    );
  }

  return await response.json();
}


/* ==================================================
   LOGIN
================================================== */

loginForm.addEventListener(
  "submit",
  async event => {

    event.preventDefault();

    const code =
      accessCode.value
        .trim()
        .toUpperCase();

    const email =
      accessEmail.value
        .trim()
        .toLowerCase();

    if (!code || !email) {

      loginMessage.textContent =
        "Veuillez entrer votre code et votre courriel.";

      return;
    }

    loginButton.disabled =
      true;

    loginButton.textContent =
      "Vérification…";

    loginMessage.textContent =
      "Vérification de votre accès…";

    try {

      const result =
        await authenticateParticipant(
          code,
          email
        );

      if (!result.ok) {

        loginMessage.textContent =
          result.error ||
          "Accès refusé.";

        return;
      }

      const p =
        result.participant;

      currentCode =
        code;

      currentParticipant = {

        id:
          p.id,

        pseudo:
          p.pseudo,

        plan:
          p.forfait,

        level:
          getLevel(
            p.forfait
          ),

        equipment:
          p.materiel,

        preparation:
          p.preparation,

        objective:
          p.objectifs || null,

        privateInstruction:
          null,

        privateMessage:
          null,

        vipTime:
          p.rencontreVip || null,

        lastValidation:
          p.derniereValidation || null
      };

      sessionStorage.setItem(
        "locktober-session",
        JSON.stringify({
          code: code,
          email: email
        })
      );

      loginMessage.textContent =
        "";

      openPortal();

    }

    catch (error) {

      console.error(error);

      loginMessage.textContent =
        "Connexion au portail impossible. Veuillez réessayer.";

    }

    finally {

      loginButton.disabled =
        false;

      loginButton.textContent =
        "Accéder au portail";
    }

  }
);


/* ==================================================
   OUVRIR PORTAIL
================================================== */

function openPortal() {

  loginScreen.classList.add(
    "hidden"
  );

  portal.classList.remove(
    "hidden"
  );

  renderParticipant();
}


/* ==================================================
   RENDER PARTICIPANT
================================================== */

function renderParticipant() {

  const participant =
    currentParticipant;

  const day =
    getLocktoberDay();

  const phase =
    getPhase(day);


  document.getElementById(
    "participantName"
  ).textContent =
    participant.pseudo;


  document.getElementById(
    "headerPlan"
  ).textContent =
    participant.plan;


  document.getElementById(
    "planName"
  ).textContent =
    participant.plan;


  document.getElementById(
    "equipmentName"
  ).textContent =
    participant.equipment;


  document.getElementById(
    "currentDay"
  ).textContent =
    day;


  document.getElementById(
    "currentPhase"
  ).textContent =
    phase;


  document.getElementById(
    "dailyInstruction"
  ).textContent =
    dailyInstructions[
      day - 1
    ];


  const progress =
    Math.round(
      (day / 31) * 100
    );


  document.getElementById(
    "progressFill"
  ).style.width =
    progress + "%";


  document.getElementById(
    "todayDate"
  ).textContent =
    new Intl.DateTimeFormat(
      "fr-CA",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    ).format(
      new Date()
    );


  /* CACHE TOUT D’ABORD */

  document
    .getElementById(
      "privateInstructionBlock"
    )
    .classList.add(
      "hidden"
    );

  document
    .getElementById(
      "privateMessageCard"
    )
    .classList.add(
      "hidden"
    );

  document
    .getElementById(
      "objectiveCard"
    )
    .classList.add(
      "hidden"
    );

  document
    .getElementById(
      "vipCard"
    )
    .classList.add(
      "hidden"
    );


  /* OBJECTIF PERSONNALISÉ */

  if (
    participant.level ===
      "personal" ||
    participant.level ===
      "vip"
  ) {

    if (
      participant.objective
    ) {

      document
        .getElementById(
          "objectiveCard"
        )
        .classList.remove(
          "hidden"
        );

      document.getElementById(
        "personalObjective"
      ).textContent =
        participant.objective;
    }
  }


  /* VIP */

  if (
    participant.level ===
    "vip"
  ) {

    document
      .getElementById(
        "vipCard"
      )
      .classList.remove(
        "hidden"
      );

    document.getElementById(
      "vipTime"
    ).textContent =
      participant.vipTime ||
      "À confirmer";
  }

  /* MODE PRÉPARATION AVANT LE 1er OCTOBRE */

  const locktoberStart =
    new Date("2026-10-01T00:00:00-04:00");

  if (new Date() < locktoberStart) {

    document.getElementById(
      "currentDay"
    ).textContent = "—";

    document.getElementById(
      "currentPhase"
    ).textContent = "Préparation";

    document.getElementById(
      "dailyInstruction"
    ).textContent =
      "Votre inscription est confirmée. Profitez de cette période pour préparer et tester votre matériel. Le parcours officiel commencera automatiquement le 1er octobre.";

    document.getElementById(
      "progressFill"
    ).style.width = "0%";

    const validateBtn =
      document.getElementById(
        "validateBtn"
      );

    validateBtn.disabled = true;

    validateBtn.textContent =
      "Validation disponible le 1er octobre";
  }
  updateValidationDisplay();
}


/* ==================================================
   VALIDATIONS
================================================== */

function updateValidationDisplay() {

  const validations =
    getValidations();

  const completedDays =
    Object.keys(
      validations
    ).length;

  document.getElementById(
    "completedDays"
  ).textContent =
    completedDays;


  document.getElementById(
    "currentStreak"
  ).textContent =
    calculateStreak(
      validations
    );


  const days =
    Object.keys(
      validations
    )
      .map(Number)
      .sort(
        (a, b) =>
          b - a
      );


  if (days.length) {

    document.getElementById(
      "lastValidation"
    ).textContent =
      "Jour " +
      days[0];

  }

  else {

    document.getElementById(
      "lastValidation"
    ).textContent =
      "Aucune";
  }


  renderHistory(
    validations
  );
}


/* ==================================================
   SÉRIE
================================================== */

function calculateStreak(
  validations
) {

  const currentDay =
    getLocktoberDay();

  let streak =
    0;

  for (
    let day = currentDay;
    day >= 1;
    day--
  ) {

    if (
      validations[day]
    ) {

      streak++;

    }

    else {

      break;
    }
  }

  return streak;
}


/* ==================================================
   HISTORIQUE
================================================== */

function renderHistory(
  validations
) {

  const grid =
    document.getElementById(
      "historyGrid"
    );

  grid.innerHTML =
    "";

  const today =
    getLocktoberDay();


  for (
    let day = 1;
    day <= 31;
    day++
  ) {

    const div =
      document.createElement(
        "div"
      );

    div.className =
      "history-day";

    div.textContent =
      day;

    if (
      validations[day]
    ) {

      div.classList.add(
        "completed"
      );
    }

    if (
      day === today
    ) {

      div.classList.add(
        "today"
      );
    }

    grid.appendChild(
      div
    );
  }
}


/* ==================================================
   MODALE VALIDATION
================================================== */

document
  .getElementById(
    "validateBtn"
  )
  .addEventListener(
    "click",
    () => {

      validationModal
        .classList
        .remove(
          "hidden"
        );

      document.getElementById(
        "validationDate"
      ).textContent =
        new Intl.DateTimeFormat(
          "fr-CA",
          {
            dateStyle:
              "long"
          }
        ).format(
          new Date()
        );
    }
  );


document
  .getElementById(
    "closeModal"
  )
  .addEventListener(
    "click",
    () => {

      validationModal
        .classList
        .add(
          "hidden"
        );
    }
  );


/* ==================================================
   ENVOI VALIDATION
   Pour l'instant local seulement
================================================== */

document
  .getElementById(
    "validationForm"
  )
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();

      const status =
        document.querySelector(
          'input[name="status"]:checked'
        );

      if (!status) {
        return;
      }

      const day =
        getLocktoberDay();

      const comment =
        document.getElementById(
          "validationComment"
        ).value.trim();

      const validations =
        getValidations();


      validations[day] = {

        status:
          status.value,

        comment:
          comment,

        timestamp:
          new Date()
            .toISOString()
      };


      saveValidations(
        validations
      );


      document.getElementById(
        "validationMessage"
      ).textContent =
        "Votre journée a été validée.";


      updateValidationDisplay();


      setTimeout(
        () => {

          validationModal
            .classList
            .add(
              "hidden"
            );

          document
            .getElementById(
              "validationForm"
            )
            .reset();

          document.getElementById(
            "validationMessage"
          ).textContent =
            "";

        },
        1000
      );
    }
  );


/* ==================================================
   DÉCONNEXION
================================================== */

document
  .getElementById(
    "logoutBtn"
  )
  .addEventListener(
    "click",
    () => {

      sessionStorage.removeItem(
        "locktober-session"
      );

      location.reload();
    }
  );


/* ==================================================
   RESTAURATION SESSION
================================================== */

async function restoreSession() {

  const raw =
    sessionStorage.getItem(
      "locktober-session"
    );

  if (!raw) {
    return;
  }

  try {

    const saved =
      JSON.parse(raw);

    if (
      !saved.code ||
      !saved.email
    ) {

      return;
    }

    const result =
      await authenticateParticipant(
        saved.code,
        saved.email
      );

    if (!result.ok) {

      sessionStorage.removeItem(
        "locktober-session"
      );

      return;
    }

    const p =
      result.participant;

    currentCode =
      saved.code;

    currentParticipant = {

      id:
        p.id,

      pseudo:
        p.pseudo,

      plan:
        p.forfait,

      level:
        getLevel(
          p.forfait
        ),

      equipment:
        p.materiel,

      preparation:
        p.preparation,

      objective:
        p.objectifs || null,

      privateInstruction:
        null,

      privateMessage:
        null,

      vipTime:
        p.rencontreVip || null,

      lastValidation:
        p.derniereValidation || null
    };

    openPortal();

  }

  catch (error) {

    console.error(
      "Restauration de session impossible :",
      error
    );

    sessionStorage.removeItem(
      "locktober-session"
    );
  }
}


restoreSession();
