let box = document.querySelector(".box");
let EditModal = document.querySelector(".EditModal");
let formEdit = document.querySelector(".formEdit");
let AddModal = document.querySelector(".AddModal");
let formAdd = document.querySelector(".formAdd");
let btnAdd = document.querySelector(".btnAdd");
let search = document.querySelector(".search");
let addCancel = document.querySelector(".addCancel");
let editCancel = document.querySelector(".editCancel");
let SelectStatus = document.querySelector(".SelectStatus");
let InfoModal = document.querySelector(".InfoModal");
let infoCancel = document.querySelector(".infoCancel");
let InfoAva = document.querySelector(".InfoAva");
let InfoName = document.querySelector(".InfoName");
let InfoTitle = document.querySelector(".InfoTitle");
let InfoDesc = document.querySelector(".InfoDesc");
let InfoStatus = document.querySelector(".InfoStatus");
let idx = null;

const API = "http://localhost:3000/data";

async function get() {
  try {
    let { data } = await axios.get(API);
    getData(data);
  } catch (error) {
    console.error(error);
  }
}

async function delFunc(id) {
  try {
    await axios.delete(`${API}/${id}`);
    get();
  } catch (error) {
    console.error(error);
  }
}

addCancel.onclick = () => {
  AddModal.close();
};

editCancel.onclick = () => {
  EditModal.close();
};

async function checkFunc(e) {
  try {
    let user = { ...e, status: !e.status };
    await axios.put(`${API}/${e.id}`, user);
    get();
  } catch (error) {
    console.error(error);
  }
}

infoCancel.onclick = () => {
  InfoModal.close();
};

formEdit.onsubmit = async (event) => {
  event.preventDefault();
  let editUser = {
    ava: event.target["EditAva"].value,
    name: event.target["EditName"].value,
    title: event.target["EditTitle"].value,
    desc: event.target["EditDesc"].value,
    status: event.target["EditStatus"].value == "true" ? true : false,
  };
  try {
    await axios.put(`${API}/${idx}`, editUser);
    get();
  } catch (error) {
    console.error(error);
  }
};

SelectStatus.onchange = async () => {
  if (SelectStatus.value != "all") {
    try {
      let { data } = await axios.get(
        `${API}?status=${SelectStatus.value == "true" ? true : false}`
      );
      getData(data);
    } catch (error) {
      console.error(error);
    }
  } else {
    get();
  }
};

btnAdd.onclick = () => {
  AddModal.showModal();
};

async function infoFunc(e) {
  try {
    let { data } = await axios.get(`${API}/${e.id}`);
    InfoAva.src = data.ava;
    InfoName.innerHTML = data.name;
    InfoTitle.innerHTML = data.title;
    InfoDesc.innerHTML = data.desc;
    InfoStatus.value = data.status;
  } catch (error) {
    console.error(error);
  }
}

search.oninput = async () => {
  try {
    let { data } = await axios.get(`${API}?name=${search.value}`);
    getData(data);
  } catch (error) {
    console.error(error);
  }
};

formAdd.onsubmit = async (event) => {
  event.preventDefault();
  let newUser = {
    ava: event.target["AddAva"].value,
    name: event.target["AddName"].value,
    title: event.target["AddTitle"].value,
    desc: event.target["AddDesc"].value,
    status: event.target["AddStatus"].value == "true" ? true : false,
  };
  try {
    await axios.post(API, newUser);
    get();
  } catch (error) {
    console.error(error);
  }
  AddModal.close();
};

function getData(data) {
  box.innerHTML = "";
  data.forEach((e) => {
    let container = document.createElement("div");
    let Name = document.createElement("h1");
    let Title = document.createElement("p");
    let Desc = document.createElement("p");
    let Ava = document.createElement("img");
    let Status = document.createElement("p");
    let del = document.createElement("button");
    let edit = document.createElement("button");
    let check = document.createElement("button");
    let info = document.createElement("button");
    let action = document.createElement("div");

    if (e.status) Status.style.backgroundColor = "green";
    else Status.style.backgroundColor = "red";

    Ava.src = e.ava;
    Ava.style.borderRadius = "200px";
    Ava.style.width = "300px";
    action.style.marginTop = "10px";
    Status.style.border = "none";
    Status.style.width = "100px";
    Status.style.color = "white";
    Status.style.margin = "auto";
    Status.style.borderRadius = "10px";
    edit.classList.add("btnEdit");
    del.classList.add("btndel");
    check.classList.add("btnCheck");
    info.classList.add("btnCheck");
    container.classList.add("container");
    Desc.style.height = "150px";
    Desc.style.wordBreak = "break-word";
    info.innerHTML = "info";

    del.onclick = () => {
      delFunc(e.id);
    };

    check.onclick = () => {
      checkFunc(e);
    };

    info.onclick = () => {
      infoFunc(e);
      InfoModal.showModal();
    };

    edit.onclick = () => {
      EditModal.showModal();
      formEdit["EditAva"].value = e.ava;
      formEdit["EditName"].value = e.name;
      formEdit["EditTitle"].value = e.title;
      formEdit["EditDesc"].value = e.desc;
      formEdit["EditStatus"].value = e.status == true ? "true" : "false";
      idx = e.id;
    };

    Title.innerHTML = e.title;
    Desc.innerHTML = e.desc;
    Name.innerHTML = e.name;
    edit.innerHTML = "Edit";
    del.innerHTML = "Delete";
    check.innerHTML = "Check";
    Status.innerHTML = e.status == true ? "Active" : "Inactive";

    action.classList.add("actions");
    action.append(edit, " ", check, " ", del, " ", info);
    container.append(Ava, Name, Title, Desc, Status, action);
    box.append(container);
  });
}

get();
