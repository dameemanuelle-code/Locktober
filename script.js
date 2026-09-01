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
      (diff % 86400000)
      / 3600000
    );


  const mins =
    Math.floor(
      (diff % 3600000)
      / 60000
    );


  els.d.textContent =
    String(days)
      .padStart(2, "0");


  els.h.textContent =
    String(hours)
      .padStart(2, "0");


  els.m.textContent =
    String(mins)
      .padStart(2, "0");

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
   FORMULAIRE
========================= */

document
  .getElementById(
    "interestForm"
  )
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const status =
        document.getElementById(
          "formStatus"
        );


      status.textContent =
        "Formulaire prêt. Il reste à le relier à votre système d’inscription définitif.";

    }
  );
