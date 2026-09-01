/* ==================================================
   LOCKTOBER 2026
   PORTAIL PARTICIPANT — VERSION TEST
================================================== */


/* ==================================================
   PARTICIPANTS TEST

   Pour l'instant, les profils sont ici.
   On les remplacera ensuite par Google Sheets
   ou une vraie base de données.
================================================== */

const participants = {

  "DE-1047": {

    pseudo: "Soumis47",

    plan: "Sous contrôle",

    level: "personal",

    equipment:
      "Cage connectée",

    objective:
      "Maintenir une participation constante et compléter les validations quotidiennes.",

    privateInstruction:
      "Aujourd’hui, concentrez-vous sur la constance de votre protocole et complétez votre validation avant la fin de la journée.",

    privateMessage:
      "Votre progression est satisfaisante. La discipline repose maintenant sur votre constance.",

    vipTime: null

  },


  "DE-3821": {

    pseudo: "Alpha",

    plan: "L’Engagement VIP",

    level: "vip",

    equipment:
      "Cage traditionnelle + coffre à clé connecté",

    objective:
      "Maintenir le protocole établi jusqu’à la préparation finale de votre rencontre.",

    privateInstruction:
      "Votre consigne personnelle du jour est active. Respectez votre protocole et complétez votre validation.",

    privateMessage:
      "Vous êtes maintenant engagé dans la partie la plus personnelle de votre parcours.",

    vipTime:
      "14 h"

  },


  "DE-7719": {

    pseudo: "S73",

    plan: "Le Registre",

    level: "group",

    equipment:
      "Cage traditionnelle",

    objective: null,

    privateInstruction: null,

    privateMessage: null,

    vipTime: null

  }

};


/* ==================================================
   CONSIGNES DE GROUPE

   Elles peuvent être modifiées facilement.
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
  document.getElementById(
    "loginScreen"
  );


const portal =
  document.getElementById(
    "portal"
  );


const loginForm =
  document.getElementById(
    "loginForm"
  );


const loginMessage =
  document.getElementById(
    "loginMessage"
  );


const accessCode =
  document.getElementById(
    "accessCode"
  );


const validationModal =
  document.getElementById(
    "validationModal"
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
    Math.max(
      day,
      1
    ),
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
   STOCKAGE LOCAL DES VALIDATIONS
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
   LOGIN
================================================== */

loginForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const code =
      accessCode.value
        .trim()
        .toUpperCase();


    if (!participants[code]) {

      loginMessage.textContent =
        "Code non reconnu.";

      return;

    }


    loginMessage.textContent =
      "";


    currentCode =
      code;


    currentParticipant =
      participants[code];


    sessionStorage.setItem(
      "locktober-access",
      code
    );


    openPortal();

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
      (
        day /
        31
      ) *
      100
    );


  document.getElementById(
    "progressFill"
  ).style.width =
    progress +
    "%";


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


  /* PERSONNALISÉ */

  if (
    participant.level ===
    "personal" ||
    participant.level ===
    "vip"
  ) {

    document
      .getElementById(
        "privateInstructionBlock"
      )
      .classList.remove(
        "hidden"
      );


    document
      .getElementById(
        "privateMessageCard"
      )
      .classList.remove(
        "hidden"
      );


    document
      .getElementById(
        "objectiveCard"
      )
      .classList.remove(
        "hidden"
      );


    document.getElementById(
      "privateInstruction"
    ).textContent =
      participant.privateInstruction;


    document.getElementById(
      "privateMessage"
    ).textContent =
      participant.privateMessage;


    document.getElementById(
      "personalObjective"
    ).textContent =
      participant.objective;

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


  if (
    days.length
  ) {

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
   STREAK
================================================== */

function calculateStreak(
  validations
) {

  const currentDay =
    getLocktoberDay();


  let streak =
    0;


  for (
    let day =
      currentDay;

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
   MODALE
================================================== */

document
  .getElementById(
    "validateBtn"
  )
  .addEventListener(
    "click",
    () => {

      validationModal.classList.remove(
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

      validationModal.classList.add(
        "hidden"
      );

    }
  );


/* ==================================================
   ENVOI VALIDATION
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

          validationModal.classList.add(
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
   LOGOUT
================================================== */

document
  .getElementById(
    "logoutBtn"
  )
  .addEventListener(
    "click",
    () => {

      sessionStorage.removeItem(
        "locktober-access"
      );


      location.reload();

    }
  );


/* ==================================================
   SESSION EXISTANTE
================================================== */

const savedCode =
  sessionStorage.getItem(
    "locktober-access"
  );


if (
  savedCode &&
  participants[savedCode]
) {

  currentCode =
    savedCode;


  currentParticipant =
    participants[
      savedCode
    ];


  openPortal();

}
