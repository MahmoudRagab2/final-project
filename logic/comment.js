// Variable Declarations
const url_api = "https://tarmeezacademy.com/api/v1";
const gett = localStorage.getItem("t");
const getun = localStorage.getItem("u");
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");
const my_img_nav = document.querySelectorAll(".my-img");

if(!gett){
  window.location.replace("../index.html");
}

img_nav()

// Function to Get Post by ID
function getPost(id) {
  fetch(`${url_api}/posts/${id}`)
    .then((response) => response.json())
    .then((data) => {
      getPostAndComments(data.data);
      handleAddComment();
    });
}

// Function to Get Post Details and Comments
function getPostAndComments(data) {
  let commentHTML = ``;

  if (data.comments_count > 0) {
    for (const comment of data.comments) {
      commentHTML += generateCommentHTML(comment);
    }
  } else {
    commentHTML = `There are no comments yet`;
  }

  const cardHtml = generatePostHTML(data, commentHTML);
  document.querySelector(".comment-posts-cs").innerHTML = cardHtml;
  showProfile();
}

// Function to Generate HTML for a Comment
function generateCommentHTML(comment) {
  return `
    <div class="user-comment d-flex gap-2">
      <img src="${
        typeof comment.author.profile_image == "string"
          ? comment.author.profile_image
          : "../img/user avatar.png"
      }" alt="user image" id="${
    comment.author.id
  }" class="img-user-comment rounded-circle cursor-pointer object-fit-cover" style="width: 40px; height: 40px;">
      <div class="body-comment">
        <h2 class="name-user fs-5 my-1 cursor-pointer" id="${
          comment.author.id
        }">${comment.author.name}</h2>
        <p class="m-0 fs-6">${comment.body}</p>
      </div>
    </div>
    <hr style="margin: 10px 0;">
  `;
}

// Function to Generate HTML for a Post
function generatePostHTML(data, commentHTML) {
  return `
    <div class="card card-cs border-0">
      <div class="card-header card-header-cs d-flex gap-1 align-items-center">
        <div class="img-user rounded-circle overflow-hidden border-2">
          <img class="w-100 h-100 img-user-profile cursor-pointer object-fit-cover" id="${
            data.author.id
          }" alt="user image" src="${
    typeof data.author.profile_image == "string"
      ? data.author.profile_image
      : "../img/user avatar.png"
  }">
        </div>
        <b class="m-0 user-name-cs cursor-pointer" id="${data.author.id}">@${
    data.author.username
  }</b>
      </div>
      <div class="img-post text-center">
        ${
          typeof data.image == "string"
            ? `<div class=" img-body-box position-relative">
            <img class="w-50 h-50 align-self-center card-img img-main" alt="post image"  src="${data.image}">
            <img class="w-100 h-100 position-absolute object-fit-cover img-overlay" alt="post image" src="${data.image}" >
          </div>`
            : ""
        }
      </div>
      <div class="card-body p-0 d-flex flex-column">
        <div class="p-2">
        ${
          data.title == null
            ? ``
            : `<h2 class="card-title mb-1">${data.title}</h2>`
        }
        ${data.body == null ? `` : `<p class="card-text">${data.body}</p>`}
        </div>
        <div class="card-footer bg-transparent p-0">
          <div class="d-flex justify-content-between align-items-center p-2">
            <p class="m-0 comment" id="20218"><i class="bi bi-pen"></i> (${
              data.comments_count
            }) Comment</p>
            <p class="m-0">${data.created_at}</p>
          </div>
          <div class="comments p-2">
            ${commentHTML}
          </div>
          <div class="input-group mt-2">
            <input type="text" class="form-control" id="inp-comment" placeholder="add your comment.." aria-describedby="add-comment">
            <button class="btn btn-primary" type="button" data-postid="${data.id}" id="add-comment">Add</button>
          </div>
        </div>
      </div>
    </div>`;
}

// Execute the initial function call
getPost(postId);
