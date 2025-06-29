let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and display toys
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => {
      const toyCollection = document.getElementById("toy-collection");
      toys.forEach((toy) => {
        const card = createToyCard(toy);
        toyCollection.appendChild(card);
      });
    });

  // Handle new toy form submission
  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = e.target.name.value;
    const image = e.target.image.value;
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, image, likes: 0 }),
    })
      .then((response) => response.json())
      .then((toy) => {
        const toyCollection = document.getElementById("toy-collection");
        const card = createToyCard(toy);
        toyCollection.appendChild(card);
      });
    toyForm.reset();
  });

  // Helper to create a toy card with like button event
  function createToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    const likeBtn = card.querySelector(".like-btn");
    const likesP = card.querySelector("p");
    likeBtn.addEventListener("click", function () {
      const newLikes = toy.likes + 1;
      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ likes: newLikes }),
      })
        .then((response) => response.json())
        .then((updatedToy) => {
          toy.likes = updatedToy.likes;
          likesP.textContent = `${updatedToy.likes} Likes`;
        });
    });
    return card;
  }
});
