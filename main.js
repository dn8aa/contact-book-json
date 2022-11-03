const API = "http://localhost:8000/products";
//? variables for inputs
let name = document.querySelector("#name");
let lastName = document.querySelector("#last-name");
let number = document.querySelector("#number");
let image = document.querySelector("#image");

let btnAdd = document.querySelector("#btnAdd");

//? переменные для карточек
let book = document.querySelector(".book");
//?переменные для эдита

let editName = document.querySelector("#edit-name");
let editLastName = document.querySelector("#edit-last-name");
let editNumber = document.querySelector("#edit-number");
let editImage = document.querySelector("#edit-image");

let editSaveBtn = document.querySelector(".editBtn");
let closeBtn = document.querySelector(".closeBtn");

let modal = document.querySelector(".note-edit");

//? show hide modal variables

let save = document.querySelector(".note");
let newContact = document.querySelector(".newContact");
let editContact = document.querySelector(".editContact");

//? search variables
let searchInp = document.querySelector("#search");
let searchValue = "";

//!--------------------------7-------------------
//?закидываем данные на сервер

btnAdd.addEventListener("click", async function () {
  let obj = {
    name: name.value,
    lastName: lastName.value,
    number: number.value,
    image: image.value,
  };
  if (!obj.name.trim() || !obj.lastName.trim() || !obj.number.trim()) {
    alert("заполните поле");
  }

  if (
    obj.image.trim()[0] != "h" &&
    obj.image.trim()[1] != "t" &&
    obj.image.trim()[2] != "t" &&
    obj.image.trim()[3] != "p"
  ) {
    obj.image =
      "https://i.pinimg.com/236x/86/8f/e0/868fe0981546b91df095c9c766f6239f.jpg";
  }
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  name.value = "";
  lastName.value = "";
  number.value = "";
  image.value = "";

  render();
});

//? отображаем карточки на странице

async function render() {
  let contacts = await fetch(`${API}?q=${searchValue}`)
    .then((res) => res.json())
    .catch((err) => console.log(err));
  book.innerHTML = "";
  contacts.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.id = element.id;
    newElem.innerHTML = `<div class="card">
        <img src="${element.image}" alt="">
        <div class="info">
            <div class="name">
                <span>${element.name}</span> <span>${element.lastName}</span>
            </div>
            <div class="number">${element.number}</div>
            <div class="btns">
                <button id="${element.id}" class="btnEdit btn-edit">edit</button>
                <button id="${element.id}" 
                onclick="deleteProduct(${element.id})" 
                class="btnDelete btn-delete" >delete</button>
            </div>
        </div>
    </div>`;
    book.append(newElem);
  });
}
render();

//! delete--------------------

function deleteProduct(id) {
  //   console.log(id);
  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => render());
}

///!1--------------------edit
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit")) {
    save.style.display = "none";
    modal.style.display = "flex";
    newContact.style.display = "none";
    editContact.style.display = "block";
    let id = e.target.id;
    //object response
    //promise
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editName.value = data.name;
        editLastName.value = data.lastName;
        editNumber.value = data.number;
        editImage.value = data.image;
        editSaveBtn.setAttribute("id", data.id);
      });
  }
});

//! созранение изменений товара
editSaveBtn.addEventListener("click", function () {
  let id = this.id; // вытаскиваем из кнопки id и ложим ее в переменную
  let name = editName.value;
  let lastName = editLastName.value;
  let number = editNumber.value;
  let image = editImage.value;

  if (!name || !lastName || !number || !image) return; // проверка на заполненность полей в модальном окне
  // if (image == "") {
  //   obj.image =
  //     "https://i.pinimg.com/236x/86/8f/e0/868fe0981546b91df095c9c766f6239f.jpg";
  // }
  let editedContact = {
    name: name,
    lastName: lastName,
    number: number,
    image: image,
  };

  saveEdit(editedContact, id);
});

function saveEdit(editedContact, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedContact),
  }).then(() => {
    render();
  });
  save.style.display = "flex";
  modal.style.display = "none";
  newContact.style.display = "block";
  editContact.style.display = "none";
}

closeBtn.addEventListener("click", () => {
  save.style.display = "flex";
  modal.style.display = "none";
  newContact.style.display = "block";
  editContact.style.display = "none";
});

searchInp.addEventListener("input", () => {
  searchValue = searchInp.value; //Записывает значение из поисковика в переменную searchVal
  render();
});
