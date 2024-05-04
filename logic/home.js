const url_api = "https://tarmeezacademy.com/api/v1";
const gett = localStorage.getItem("t");
const getun = localStorage.getItem("u");
const title = document.getElementById("c-title-p");
const body = document.getElementById("c-body-p");
const img = document.getElementById("c-img-p");
const my_img_nav = document.querySelectorAll(".my-img");
const btn_new_post = document.getElementById("btn-new-post");

let currentPage = 1;
let lastPage = 1;
let requestExecuted = false;

if (gett) {
  img_nav();

  const posts_container = document.querySelector(".posts-cs");

  function getPostsFromApi(removeHTML = true, page = 1) {
    fetch(`${url_api}/posts?limit=6&page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        if (removeHTML) {
          posts_container.innerHTML = "";
        }
        lastPage = data.meta.last_page;
        addPostsToHomePage(data.data);
        showProfile();
      });
  }
  getPostsFromApi();

  function addPostsToHomePage(posts) {
    if (posts.length > 0) {
      let postsHTML = "";
      for (const post of posts) {
        postsHTML += `
          <div class="card card-cs border-0">
            <div class="card-header card-header-cs d-flex gap-1 align-items-center">
              <div class="img-user rounded-circle overflow-hidden border-2">
                <img class="w-100 h-100 img-user-profile cursor-pointer object-fit-cover" id="${
                  post.author.id
                }" alt="user image" src="${
          typeof post.author.profile_image == "object"
            ? "../img/user avatar.png"
            : post.author.profile_image
        }" alt="image-user">
              </div>
              <b class="m-0 user-name-cs cursor-pointer" id="${
                post.author.id
              }">@${post.author.username}</b>
            </div>
              <div class="img-post text-center ">
              ${
                typeof post.image == "string"
                  ? `<div class=" img-body-box position-relative ">
                      <img loading="lazy" class="w-50 h-50 align-self-center card-img img-main" alt="post image"  src="${post.image}">
                      <img loading="lazy" class="w-100 h-100 position-absolute object-fit-cover img-overlay" alt="post image" src="${post.image}" >
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
              ${
                post.body != null ? `<p class="card-text">${post.body}</p>` : ""
              }
              </div>
              <div class="card-footer bg-transparent d-flex justify-content-between align-items-center">
                <p class="m-0 comment cursor-pointer" id="${
                  post.id
                }"><i class="bi bi-pen"></i> (${
          post.comments_count
        }) Comment</p>
                <p class="m-0">${post.created_at}</p>
              </div>
              <div class="input-group mt-2">
              <input type="text" class="form-control" id="inp-comment" placeholder="add your comment.." aria-describedby="add-comment">
              <button class="btn btn-primary" type="button" data-postid="${post.id}" id="add-comment">Add</button>
          </div>
            </div>
          </div>`;
      }
      posts_container.innerHTML += postsHTML;
      showComments();
      showProfile();
      handleAddComment()
      requestExecuted = false;
    } else {
      posts_container.innerHTML = `<h2 class="text-center">There Are No Publications.</h2>`;
    }
  }

  imagePreview();

  function createNewPost() {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Authorization", `Bearer ${gett}`);

    const formdata = new FormData();
    formdata.append("body", body.value);
    formdata.append("title", title.value);
    if (img.files.length > 0) {
      formdata.append("image", img.files[0]);
    }

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch(`${url_api}/posts`, requestOptions).then(() => {
      stopLoad();
      window.location.reload();
    });
  }

  btn_new_post.onclick = () => {
    if (title.value.trim() && body.value.trim()) {
      load();
      createNewPost();
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

  window.addEventListener("scroll", () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (
      !requestExecuted &&
      scrollTop + clientHeight + 700 >= scrollHeight &&
      currentPage < lastPage
    ) {
      requestExecuted = true;
      currentPage += 1;
      getPostsFromApi(false, currentPage);
      showComments();
    }
  });

  showComments();

  function showProfile() {
    const img_user_profile = document.querySelectorAll(".img-user-profile");
    const user_name_profile = document.querySelectorAll(".user-name-cs");

    my_img_nav.forEach((img) => {
      img.addEventListener("click", () => {
        window.location.href = `../profile.html?id=${img.id}`;
      });
    });

    img_user_profile.forEach((img) => {
      img.addEventListener("click", () => {
        window.location.href = `../profile.html?id=${img.id}`;
      });
    });

    user_name_profile.forEach((name) => {
      name.addEventListener("click", () => {
        window.location.href = `../profile.html?id=${name.id}`;
      });
    });
  }

  showProfile();
} else {
  window.location.replace("../index.html");
}
