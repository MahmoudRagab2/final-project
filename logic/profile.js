const url_api = "https://tarmeezacademy.com/api/v1";
const getun = localStorage.getItem("u");
const my_img_nav = document.querySelectorAll(".my-img");
const data_box = document.querySelector(".data-box");
const posts_box = document.querySelector(".posts-cs");
const btn_new_post = document.getElementById("btn-new-post");
const title = document.getElementById("c-title-p");
const body = document.getElementById("c-body-p");
const img = document.getElementById("c-img-p");
const gett = localStorage.getItem("t");
const form = document.querySelector("#form-post");
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("id");

if (!gett) {
  window.location.replace("../index.html");
}

img_nav()

function getData() {
  fetch(`${url_api}/users/${userId}`)
    .then((response) => response.json())
    .then((data) => {
      addDataToPage(data.data);
      addPostsToProfile();

      if (JSON.parse(getun).id == data.data.id) {
        var div = document.createElement("div");

        div.setAttribute("data-bs-toggle", "modal");
        div.setAttribute("data-bs-target", "#form-post");
        div.classList.add(
          "add-post-btn",
          "cursor-pointer",
          "position-fixed",
          "rounded-circle"
        );

        let icon = document.createElement("i");
        icon.classList.add("bi", "bi-plus-lg", "text-white");
        div.appendChild(icon);
        document.body.appendChild(div);

        document.querySelector(".add-post-btn").onclick = function () {
          title.value = "";
          body.value = "";

          document.querySelector(".modal-title").textContent =
            "Create New Post";
          document.querySelector("#btn-new-post").textContent =
            "Create New Post";
          document.querySelector(".modal-dialog").style.maxWidth = "900px";
          document.querySelector(".row-cs").style.width = "calc(50% - 8px)";
          img.parentElement.style.display = "block";
        };

        imagePreview();
      }
    });
}

function addDataToPage(data) {
  data_box.innerHTML = `
  
  <div class="data-profile rounded d-flex gap-2 flex-column p-2">
  <div class="d-flex align-items-center justify-content-between flex-wrap " >
  <h1 class="name">${data.name}</h1>
  ${
    JSON.parse(getun).id == data.id
      ? `<button class="btn btn-outline-danger" onclick="confirmLogout()"><i class="bi bi-box-arrow-left"></i> Logout</button>`
      : ``
  }
  </div>
  <div class="d-flex gap-2 gap-md-4 flex-column flex-md-row text-center text-md-center align-items-center align-items-md-start ">
    <div
      class="profile-img d-flex gap-2 flex-md-column align-items-center w-md-100  align-items-md-stretch justify-content-between w100-cs">
      <img src="${
        typeof data.profile_image == "string"
          ? data.profile_image
          : "../img/user avatar.png"
      }" class="rounded-circle object-fit-cover" alt="user img" >
    </div>
    <div
      class="flex-grow-1 d-block d-md-flex justify-content-between w-md-100 align-items-center flex-column flex-md-row">
      <div class="mb-md-0 mb-3 text-md-start ">
      ${
        data.email == null
          ? ""
          : `<h3 class="email pb-1 pb-md-3">${data.email}</h3>`
      }
        
        <h3 class="username fs-4 m-0">@${data.username}</h3>
      </div>
      <div class="d-md-block d-flex justify-content-between  flex-wrap ">
        <h4><span class="posts-count fs-1">${data.posts_count}</span>Posts</h4>
        <h4><span class="comments-count fs-1">${
          data.comments_count
        }</span>Comments</h4>
      </div>
    </div>
  </div>

  </div>
  `;
}

function addPostsToProfile() {
  fetch(`${url_api}/users/${userId}/posts`)
    .then((response) => response.json())
    .then((posts) => {
      if (posts.data.length > 0) {
        const reversedPosts = posts.data.reverse();
        for (const post of reversedPosts) {
          posts_box.innerHTML += `
          <div class="card card-cs border-0">
          <div class="card-header card-header-cs d-flex py-2 px-1  gap-1 align-items-center justify-content-between ">
            <div class="d-flex align-items-center gap-2 ">
              <div class="img-user rounded-circle overflow-hidden border-2">
                <img class="w-100 h-100 cursor-pointer object-fit-cover" alt="user image" src="${
                  typeof post.author.profile_image == "object"
                    ? "../img/user avatar.png"
                    : post.author.profile_image
                }"
                  alt="image-user">
              </div>
              <b class="m-0 user-name-cs cursor-pointer">@${
                post.author.username
              }</b>
            </div>
            ${
              JSON.parse(getun).id == post.author.id
                ? `
                <div class="d-flex flex-wrap justify-content-end gap-1">
                <button class="btn btn-secondary edit-post-btn" id='${
                  post.author.id
                }' onclick="editPost('${encodeURIComponent(
                    JSON.stringify(post)
                  )}')"><i class="bi bi-pencil-square"></i></button>
                <button type="button" class="btn btn-danger" onclick="confirmDelete('${encodeURIComponent(
                  JSON.stringify(post)
                )}')" ><i class="bi bi-trash"></i></button>
                </div>
                `
                : ``
            }
          </div>
    
          <div class="img-post text-center ">
          ${
            typeof post.image == "string"
              ? `<div class=" img-body-box position-relative ">
                  <img class="w-50 h-50 align-self-center card-img img-main" alt="post image"  src="${post.image}">
                  <img class="w-100 h-100 position-absolute object-fit-cover img-overlay" alt="post image" src="${post.image}" >
                </div>`
              : ""
          }
          </div>
          <div class="card-body p-0 d-flex flex-column">
            <div class="p-2">
            ${
              post.title != null
                ? `<h2 class="card-title mb-1">${post.title}</h2>`
                : ""
            }
            ${post.body != null ? `<p class="card-text">${post.body}</p>` : ""}
            </div>
            <div class="card-footer bg-transparent d-flex justify-content-between align-items-center">
              <p class="m-0 comment cursor-pointer" id="${
                post.id
              }"><i class="bi bi-pen"></i> (${post.comments_count}) Comment</p>
              <p class="m-0">${post.created_at}</p>
            </div>
          </div>
        </div>
          `;
        }
        showComments();
      } else {
        posts_box.innerHTML =
          '<h3 class="text-center p-2 " style="background-color: var(--card-color);">There Are No Publications.</h3>';
      }
    });
}

showComments()

function createNewPost(req, titleValue, bodyValue, id) {
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  if (req == "PUT") {
    myHeaders.append("Content-Type", "application/json");
  }
  myHeaders.append("Authorization", `Bearer ${gett}`);

  const formdata = new FormData();
  formdata.append("title", titleValue);
  formdata.append("body", bodyValue);
  if (img.files.length > 0) {
    formdata.append("image", img.files[0]);
  }

  const raw = JSON.stringify({
    title: titleValue,
    body: bodyValue,
  });

  const requestOptions = {
    method: req,
    headers: myHeaders,
    body: req == "PUT" ? raw : formdata,
    redirect: "follow",
  };

  fetch(`${url_api}/posts${req == "PUT" ? `/${id}` : ""}`, requestOptions).then(
    () => {
      stopLoad();
      window.location.reload();
    }
  );
}

btn_new_post.onclick = () => {
  if (title.value.trim() && body.value.trim()) {
    load();
    createNewPost("POST", title.value, body.value);
  } else {
    if (!title.value.trim()) {
      title.nextElementSibling.classList.remove("d-none");
    } else {
      title.nextElementSibling.classList.add("d-none");
    }
    if (!body.value.trim()) {
      body.nextElementSibling.classList.remove("d-none");
    } else {
      body.nextElementSibling.classList.add("d-none");
    }
  }
};

function editPost(postId) {
  let post = JSON.parse(decodeURIComponent(postId));

  title.value = post.title;
  body.value = post.body;

  document.querySelector(".modal-title").textContent = "Edit Post";
  document.querySelector("#btn-new-post").textContent = "Edit Post";
  document.querySelector(".modal-dialog").style.maxWidth = "500px";
  document.querySelector(".row-cs").style.width = "100%";
  img.parentElement.style.display = "none";

  const form_edit_post = new bootstrap.Modal(
    document.getElementById("form-post"),
    {}
  );
  form_edit_post.toggle();

  btn_new_post.onclick = () => {
    if (title.value.trim() && body.value.trim()) {
      load();
      createNewPost("PUT", title.value, body.value, post.id);
    } else {
      if (!title.value.trim()) {
        title.nextElementSibling.classList.remove("d-none");
      } else {
        title.nextElementSibling.classList.add("d-none");
      }
      if (!body.value.trim()) {
        body.nextElementSibling.classList.remove("d-none");
      } else {
        body.nextElementSibling.classList.add("d-none");
      }
    }
  };
}

function delPost(postId) {
  load();
  let post = JSON.parse(decodeURIComponent(postId));

  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", `Bearer ${gett}`);

  const raw = "";

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${url_api}/posts/${post.id}`, requestOptions).then(() => {
    stopLoad();
    window.location.reload();
  });
}

function confirmAction(message, action) {
  const confirmationModal = new bootstrap.Modal(
    document.getElementById("confirmationModal")
  );
  const confirmationText = document.querySelector(".textModel");
  confirmationText.innerText = message;
  confirmationModal.show();

  document
    .getElementById("confirmationBtn")
    .addEventListener("click", function () {
      action();
      confirmationModal.hide();
    });
}

function confirmDelete(postId) {
  const message = "Are you sure you want to delete this post?";
  confirmAction(message, function () {
    delPost(postId);
  });
}

function confirmLogout() {
  const message = "Are you sure you want to log out?";
  confirmAction(message, function () {
    logout();
  });
}

function logout() {
  window.localStorage.clear();
  window.location.replace("../index.html");
}

getData();
