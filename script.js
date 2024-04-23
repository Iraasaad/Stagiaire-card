let testPersons = [
  {
    identite: { nom: "Test", prenom: "Test", genre: "Homme" },
    profil: "Stagiaire",
    specialite: "Developpement Digital",
    classe: "DD102",
    notes: { M101: 12, M102: 14, M103: 17 },
  },
];

let persons = JSON.parse(localStorage.getItem("persons")) || testPersons;

function updateLocalStorage() {
  // Store the persons array in localStorage
  localStorage.setItem("persons", JSON.stringify(persons));
}

function addPerson() {
  // Get the values from the input fields
  let nom = document.getElementById("nom").value;
  let prenom = document.getElementById("prenom").value;
  let genre = document.getElementById("genre").value;
  let specialite = document.getElementById("specialite").value;
  let classe = document.getElementById("class").value;
  let note1 = document.getElementById("note1").value;
  let note2 = document.getElementById("note2").value;
  let note3 = document.getElementById("note3").value;

  // Create a new person object
  let newStagaire = {
    identite: { nom, prenom, genre: genre },
    profil: "Stagiaire",
    specialite: specialite,
    classe,
    notes: { M101: note1, M102: note2, M103: note3 },
  };

  // Check if the person already exists in the persons array
  let index = persons.findIndex(
    (person) => person.identite.nom === nom && person.identite.prenom === prenom
  );

  if (index !== -1) {
    // The person exists, update it
    persons[index] = newStagaire;
  } else {
    // The person does not exist, add it
    persons.push(newStagaire);
  }

  // Re-render the persons
  renderPersons(persons);
  showCard();
}

function cancelAdd() {
  document.getElementById("formulaire").style.display = "none";
  showCard();
}

function showCard() {
  document.getElementById("card").style.display = "block";
  document.getElementById("ccontainer").style.display = "flex";
  document.getElementById("formulaire").style.display = "none";
  document.getElementById("h1").style.display = "flex";
}

const calculateMoyenne = (person) => {
  return (
    (Number(person.notes.M101) +
      Number(person.notes.M102) +
      Number(person.notes.M103)) /
    3
  );
};

function hideCard() {
  document.getElementById("card").style.display = "none";
  document.getElementById("h1").style.display = "none";
  document.getElementById("title").style.marginTop = "-185px";
  document.getElementById("ccontainer").style.display = "none";
}

function afficherFormulaire() {
  if (persons.length) {
    document.getElementById("card").style.display = "none";
  }
  document.getElementById("h1").style.display = "none";
  document.getElementById("title").style.marginTop = "-185px";
  document.getElementById("ccontainer").style.display = "none";
  document.getElementById("formulaire").style.display = "block";
}

function showEditForm(index) {
  // Get the person to edit
  let personToEdit = persons[index];

  // Fill the input fields with the person's details
  document.getElementById("nom").value = personToEdit.identite.nom;
  document.getElementById("prenom").value = personToEdit.identite.prenom;
  document.getElementById("genre").value = personToEdit.identite.genre;
  document.getElementById("specialite").value = personToEdit.specialite;
  document.getElementById("class").value = personToEdit.classe;
  document.getElementById("note1").value = personToEdit.notes.M101;
  document.getElementById("note2").value = personToEdit.notes.M102;
  document.getElementById("note3").value = personToEdit.notes.M103;
  document.getElementById("ajouterlestagiaire").innerText = "Modifier";

  afficherFormulaire();
  // Show the "formulaire" div
  document.getElementById("formulaire").style.display = "block";
}

function cancelDelete() {
  document.getElementById("warning").style.display = "none";
  showCard();
}

function showWarning(index) {
  // Get the person to delete
  let personToDelete = persons[index];

  const img =
    personToDelete.identite.genre === "Homme"
      ? "./assets/cara3.png"
      : "./assets/cara4.png";

  let warningHtml = `
  <div class="danger">
    <img src="${img}" alt="" width="120px" height="120px">
  </div>
  <div id="sure">
    <h1>
      Voulez vous vraiment supprimer le stagiaire <span>${personToDelete.identite.nom} ${personToDelete.identite.prenom}</span>
    </h1>
  </div>
  <button id="annuler" onclick='cancelDelete()'>Annuler</button>
  <button id="supp" class="delete-btn" onclick="deletePerson()">
    Supprimer
  </button>
`;

  const warningContainer = document.querySelector("#warning");
  warningContainer.innerHTML = warningHtml;

  hideCard();
  // Show the "warning" div
  warningContainer.style.display = "block";

  // Save the index of the person to delete
  editingIndex = index;
}

function deletePerson() {
  // Delete the person at the saved index
  persons.splice(editingIndex, 1);

  // Re-render the persons
  renderPersons(persons);

  // Hide the "warning" div
  document.getElementById("warning").style.display = "none";
  showCard();
}

// Function to create a card for a person
function createCard(person, index) {
  return `<div class="card" id="card" style="background-color: ${
    person.identite.genre === "Homme" ? "#BDD7EE" : "#f8cbad"
  };">
             <div class="filter">
            <button id="delete"  onclick="showWarning(${index})">-</button>
            <button id="change" onclick="showEditForm(${index})">+</button>
        </div>
            <div class="image">
              <img src="${
                person.identite.genre == "Homme"
                  ? "./assets/cara3.png"
                  : "./assets/cara4.png"
              }" alt="" width="120px" height="120px">
            </div>
            <div class="information">
                <p class="p1">${person.identite.nom} ${
    person.identite.prenom
  } </p>
                <p class="p2">${person.specialite} - ${person.classe}</p>
            </div>
            <div class="moyenne">
                <p><span id='rank'>#${getRankBySpecialite(
                  person
                )}</span> Moyenne : ${calculateMoyenne(person).toFixed(2)}</p>
            </div>
        </div>
  `;
}

function getRankBySpecialite(person) {
  // Get the specialite of the person
  let specialite = person.specialite;

  // Filter the persons array by the specialite
  let personsBySpecialite = persons.filter((p) => p.specialite === specialite);

  // Sort the persons by their average note
  personsBySpecialite.sort((a, b) => {
    let avgNoteA = calculateMoyenne(a);
    let avgNoteB = calculateMoyenne(b);
    return avgNoteB - avgNoteA;
  });

  // Get the rank of the person
  let rank =
    personsBySpecialite.findIndex(
      (p) =>
        p.identite.nom === person.identite.nom &&
        p.identite.prenom === person.identite.prenom
    ) + 1;

  return rank;
}

const renderPersons = (persons) => {
  updateLocalStorage();
  // Generate cards for all persons
  let cards = persons.map(createCard).join("");

  // Select the container div
  let container = document.querySelector("#ccontainer");

  // Append the cards to the container div
  container.innerHTML = cards;
};

// Initial render
renderPersons(persons);

function filterPersons(event) {
  // Get the specialite to filter by
  let specialite = event.target.innerText;

  // Filter the persons array
  let filteredPersons = persons.filter(
    (person) => person.specialite == specialite
  );

  // Re-render the persons with the filtered array
  renderPersons(filteredPersons);
}

// Get all the divs inside the 'h1' div
let divs = document.getElementById("h1").getElementsByTagName("div");

// Add the event listener to each div
for (const div of divs) {
  div.addEventListener("click", filterPersons);
}
