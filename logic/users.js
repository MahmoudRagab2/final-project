const url_api = "https://tarmeezacademy.com/api/v1";
const users_container = document.querySelector(".users");
const getun = localStorage.getItem("u");
const my_img_nav = document.querySelectorAll(".my-img");
let requestExecuted = false;
let currentPage = 1;
let randomPage = 1;

const gett = localStorage.getItem("t");
if(!gett){
  window.location.replace("../index.html");
}


img_nav()

async function getUsers(claer = true) {
  let reqUsers = await fetch(`${url_api}/users`, { method: "GET" });
  let dataUsers = await reqUsers.json();

  randomPage = Math.floor(Math.random() * dataUsers.meta.last_page);

  let req = await fetch(`${url_api}/users?limit=18&page=${randomPage}`, {
    method: "GET",
  });
  let data = await req.json();

  if (data.data.length > 0) {
    if (claer) {
      users_container.innerHTML = "";
    }
    renderUsers(data.data);
  }
}

getUsers(true, 1);

function renderUsers(users) {
  let userHTML = "";

  for (const user of users) {
    userHTML += `
      
      <div class="user d-flex flex-column justify-content-between p-2 rounded ">
      <div class="d-flex gap-3 align-items-center  ">
      ${
        typeof user.profile_image == "string"
          ? `<img class="rounded-circle border-2 user-img object-fit-cover" src="${user.profile_image}">`
          : `<img class="rounded-circle border-2 user-img object-fit-cover" src="../img/user avatar.png">`
      }
        <div class="flex-grow-1">
          <h2 class="p-0 m-0 ">${user.name}</h2>
          <div class="w-100 my-1 d-flex flex-wrap justify-content-between">
            <p class=" m-0 ">${user.username}</p>
            <small class="fs-6 ">(${user.posts_count} posts)</small>
          </div>
        </div>
      </div>
      <button id="${
        user.id
      }" class="btn btn-outline-primary btn-profile cursor-pointer">Show Profile</button>
    </div>
      `;
  }
  users_container.innerHTML += userHTML;
  showProfile();
  requestExecuted = false;
}

window.addEventListener("scroll", () => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (!requestExecuted && scrollTop + clientHeight + 500 >= scrollHeight) {
    requestExecuted = true;
    currentPage += 1;
    getUsers(false);
    showProfile();
  }
});

function showProfile() {
  let profile = document.querySelectorAll(".btn-profile");
  profile.forEach((profile) => {
    profile.addEventListener("click", () => {
      window.location.href = `../profile.html?id=${profile.id}`;
    });
  });
}
