/* ==================================================
   LOCKTOBER 2026
   ENGLISH PARTICIPANT PORTAL
================================================== */

const API_URL =
  "https://script.google.com/macros/s/AKfycbyhhlRxw3miDYY2BF2hC3-Rdf1GQiD8VmMqSwN5dNK91U7o0D4KoL2OfIvYaw8NkHbc/exec";


/* ==================================================
   DAILY GROUP INSTRUCTIONS
================================================== */

const dailyInstructions = [

  "Today marks the beginning of your commitment. Review the protocol and prepare yourself for the month ahead.",
  "Consistency starts now. Complete your day and your validation.",
  "Maintain your commitment and take a moment to observe your discipline.",
  "Your participation depends on consistency today.",
  "The first phase is almost complete. Maintain your commitment.",

  "The Discipline phase begins. The challenge now becomes consistency.",
  "Respect your routine and complete your validation.",
  "A simple but important day: do not let your discipline weaken.",
  "Maintain the protocol you accepted.",
  "Day ten. Take a moment to recognize the progress already made.",

  "Continue without trying to rush the journey.",
  "Consistency matters more than intensity.",
  "Your validation is still expected today.",
  "Maintain your commitment.",
  "You have reached the middle of the month. Keep going.",

  "The Control phase begins today.",
  "Take your progression seriously.",
  "The protocol remains in place.",
  "Your commitment is now measured over time.",
  "Day twenty. Consistency becomes your main challenge.",

  "Continue your journey.",
  "Your daily validation remains essential.",
  "Maintain your discipline.",
  "Do not loosen your commitment now.",
  "Final day of the Control phase.",

  "The final stretch begins.",
  "Five days remain.",
  "Maintain your journey until the end.",
  "Your Locktober is approaching its conclusion.",
  "Second-to-last day. Complete your protocol.",

  "October 31. Your Locktober journey reaches its conclusion."

];


/* ==================================================
   VARIABLES
================================================== */

let currentParticipant = null;
let currentCode = null;


/* ==================================================
   ELEMENTS
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
   EMAIL FIELD
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
  "Email used during registration";

const accessEmail =
  document.createElement("input");

accessEmail.id =
  "accessEmail";

accessEmail.type =
  "email";

accessEmail.placeholder =
  "your@email.com";

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
   LOCKTOBER DATE
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
    return "Commitment";
  }

  if (day <= 15) {
    return "Discipline";
  }

  if (day <= 25) {
    return "Control";
  }

  return "Final stretch";
}


/* ==================================================
   PLAN LEVEL
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
   DISPLAY TRANSLATIONS
================================================== */

function translatePlan(plan) {

  const value =
    String(plan || "");

  if (
    value.toLowerCase()
      .includes("sous contrôle")
  ) {
    return "Under Control — $129 CAD";
  }

  if (
    value.toLowerCase()
      .includes("engagement")
  ) {
    return "The Commitment — $449 CAD";
  }

  if (
    value.toLowerCase()
      .includes("registre")
  ) {
    return "The Registry — Free";
  }

  return value;
}


function translateEquipment(equipment) {

  const value =
    String(equipment || "");

  if (
    value === "Cage connectée"
  ) {
    return "Connected chastity cage";
  }

  if (
    value ===
    "Cage traditionnelle + coffre à clé connecté"
  ) {
    return "Traditional cage + connected key lockbox";
  }

  if (
    value ===
    "Cage traditionnelle"
  ) {
    return "Traditional chastity cage";
  }

  if (
    value === "Je n’ai pas encore choisi" ||
    value === "À déterminer"
  ) {
    return "Not chosen yet";
  }

  return value;
}


/* ==================================================
   LOCAL VALIDATION STORAGE
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
   API LOGIN
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
      "Invalid server response."
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
        "Please enter your code and email.";

      return;
    }

    loginButton.disabled =
      true;

    loginButton.textContent =
      "Checking…";

    loginMessage.textContent =
      "Checking your access…";

    try {

      const result =
        await authenticateParticipant(
          code,
          email
        );

      if (!result.ok) {

        loginMessage.textContent =
          result.error ||
          "Access denied.";

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
          p.instructionPrivee || null,

        privateMessage:
          p.messagePrive || null,

        vipTime:
          p.rencontreVip || null,

        lastValidation:
          p.derniereValidation || null
      };

      sessionStorage.setItem(
        "locktober-session-en",
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
        "Unable to connect to the portal. Please try again.";

    }

    finally {

      loginButton.disabled =
        false;

      loginButton.textContent =
        "Access the portal";
    }

  }
);


/* ==================================================
   OPEN PORTAL
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
    translatePlan(
      participant.plan
    );


  document.getElementById(
    "planName"
  ).textContent =
    translatePlan(
      participant.plan
    );


  document.getElementById(
    "equipmentName"
  ).textContent =
    translateEquipment(
      participant.equipment
    );


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
      "en-CA",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    ).format(
      new Date()
    );


  /* HIDE OPTIONAL CARDS FIRST */

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


  /* PERSONAL GOAL */

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


  /* PRIVATE CONTENT */

  if (
    participant.level === "personal" ||
    participant.level === "vip"
  ) {

    if (
      participant.privateInstruction
    ) {

      document
        .getElementById(
          "privateInstructionBlock"
        )
        .classList.remove(
          "hidden"
        );

      document.getElementById(
        "privateInstruction"
      ).textContent =
        participant.privateInstruction;
    }


    if (
      participant.privateMessage
    ) {

      document
        .getElementById(
          "privateMessageCard"
        )
        .classList.remove(
          "hidden"
        );

      document.getElementById(
        "privateMessage"
      ).textContent =
        participant.privateMessage;
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
      "To be confirmed";
  }


  /* PREPARATION MODE BEFORE OCTOBER 1 */

  const locktoberStart =
    new Date(
      "2026-10-01T00:00:00-04:00"
    );

  if (
    new Date() <
    locktoberStart
  ) {

    document.getElementById(
      "currentDay"
    ).textContent =
      "—";

    document.getElementById(
      "currentPhase"
    ).textContent =
      "Preparation";

    document.getElementById(
      "dailyInstruction"
    ).textContent =
      "Your registration is confirmed. Use this preparation period to receive, adjust and test your equipment. The official journey will begin automatically on October 1.";

    document.getElementById(
      "progressFill"
    ).style.width =
      "0%";

    const validateBtn =
      document.getElementById(
        "validateBtn"
      );

    validateBtn.disabled =
      true;

    validateBtn.textContent =
      "Validation available October 1";
  }


  updateValidationDisplay();
}


/* ==================================================
   VALIDATION DISPLAY
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
      "Day " +
      days[0];

  }

  else {

    document.getElementById(
      "lastValidation"
    ).textContent =
      "None";
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
   HISTORY
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
   VALIDATION MODAL
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
          "en-CA",
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
   SAVE VALIDATION
   LOCAL ONLY FOR NOW
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
        "Your day has been validated.";


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
        "locktober-session-en"
      );

      location.reload();
    }
  );


/* ==================================================
   RESTORE SESSION
================================================== */

async function restoreSession() {

  const raw =
    sessionStorage.getItem(
      "locktober-session-en"
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

    if (
      !result.ok
    ) {

      sessionStorage.removeItem(
        "locktober-session-en"
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
        p.instructionPrivee || null,

      privateMessage:
        p.messagePrive || null,

      vipTime:
        p.rencontreVip || null,

      lastValidation:
        p.derniereValidation || null
    };

    openPortal();

  }

  catch (error) {

    console.error(
      "Unable to restore session:",
      error
    );

    sessionStorage.removeItem(
      "locktober-session-en"
    );
  }
}


restoreSession();
