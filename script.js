import { fetchData } from "./fetchData.js";
import { formFactory } from "./formFactory.js";
import { putData } from "./putData.js";

const remoteUrl = "https://easy-simple-users-rest-api.onrender.com/users";
const localUrl = "response.json";

// DOM elements
const alert = document.querySelector(".alert");
const spinner = document.querySelector(".spinner-border");

let users = null;

const loadData = async () => {
  spinner.classList.remove("d-none");
  try {
  console.log("Fetching data...");
    const data = await fetchData(localUrl);
    if (data) {
      spinner.classList.add("d-none");
      alert.classList.remove("d-none");
      alert.classList.add("alert-success");
      alert.innerHTML = "Data loaded successfully!";
      users = data.data;
      displayUsers(users);
      addEventListeners();
      console.log("Data loaded successfully:", data);
    }
  } catch (error) {
    console.error("Failed to load data:", error.message);
    spinner.classList.add("d-none");
    alert.classList.remove("d-none");
    alert.classList.add("alert-danger");
    alert.innerHTML = `Failed to load data: ${error.message}`;
  }
};

const displayUsers = (localUsers) => {
  if (!localUsers || localUsers.length === 0) {
    alert.classList.remove("d-none");
    alert.classList.add("alert-danger");
    alert.innerHTML = "No users found.";
    return;
  }

  const usersContainer = document.getElementById("users-container");
  usersContainer.innerHTML = "";

  localUsers.forEach((user) => {
    usersContainer.innerHTML += `
      <article class="card">
        <div class="card-image">
          <img src="${user.avatar_url}" alt="${user.name}" class="card-img-top" />
          <span class="card-title">${user.name}</span>
        </div>
        <div class="card-content">
          <ul class="list-group">
            <li class="list-group-item"><strong>Name:</strong> ${user.name}</li>
            <li class="list-group-item"><strong>Age:</strong> ${user.age}</li>
            <li class="list-group-item"><strong>Gender:</strong> ${user.gender}</li>
          </ul>
          <button data-user-id="${user.id}" data-bs-target="#exampleModal" data-bs-toggle="modal" class="edit-btn btn btn-secondary m-2">Edit</button>
        </div>
      </article>
    `;
  });
};

const addEventListeners = () => {
  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      document.querySelector(".modal-body").innerHTML = "";
      document.querySelector(".modal-body").appendChild(formFactory());
      const foundUser = users.find(
        (user) => user.id === parseInt(e.target.getAttribute("data-user-id"))
      );
      getModalForm(foundUser);
    });
  });
};

const getModalForm = (foundUser) => {
  const modalForm = document.querySelector(".modal-body").querySelector("form");
  modalForm.querySelector("#userName").value = foundUser.name;
  modalForm.querySelector("#userAge").value = foundUser.age;
  modalForm.querySelector("#UserImage").value = foundUser.avatar_url;
  modalForm.querySelector("#UserGender").value = foundUser.gender;

  const submitBtn = document.getElementById("modalSaveBtn");
  submitBtn.setAttribute("data-user-id", foundUser.id);
  submitBtn.addEventListener("click", async () => {
    const dataToSend = {
      id: foundUser.id,
      name: document.querySelector("#userName").value,
      age: document.querySelector("#userAge").value,
      avatar_url: document.querySelector("#UserImage").value,
      gender: document.querySelector("#UserGender").value,
    };

    document.querySelector(".modal-body").innerHTML = `
      <div class="d-flex justify-content-center align-items-center" style="height: 312px;">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;

    try {
      const response = await putData(remoteUrl, dataToSend);

      if (response) {
        document.querySelector(".modal-body").innerHTML = `
          <div class="d-flex justify-content-center align-items-center" style="height: 312px;">
            <div class="alert alert-success" role="alert">
              ${response.message || "User updated successfully!"}
            </div>
          </div>
        `;

        const myModal = document.getElementById("exampleModal");
        const modal = bootstrap.Modal.getInstance(myModal);

        updateCard(dataToSend);

        setTimeout(() => {
          modal.hide();
          addEventListeners();
        }, 800);
      }
    } catch (error) {
      console.error("Failed to update data:", error);
      document.querySelector(".modal-body").innerHTML = `
        <div class="d-flex flex-column justify-content-center align-items-center" style="height: 312px;">
          <div class="alert alert-danger w-100" role="alert">
            ${error.message}
          </div>
          <p class="mark">${error.stack}</p>
        </div>
      `;
    }
  });
};
  
const updateCard = (updatedUser) => {
  const cardToUpdate = document.querySelector(`[data-user-id='${updatedUser.id}']`).closest(".card");
  if (cardToUpdate) {
    cardToUpdate.querySelector(".card-title").textContent = updatedUser.name;
    cardToUpdate.querySelector(".card-img-top").src = updatedUser.avatar_url;
    const listItems = cardToUpdate.querySelectorAll(".list-group-item");
    listItems[0].innerHTML = `<strong>Name:</strong> ${updatedUser.name}`;
    listItems[1].innerHTML = `<strong>Age:</strong> ${updatedUser.age}`;
    listItems[2].innerHTML = `<strong>Gender:</strong> ${updatedUser.gender}`;
  }
};

loadData();