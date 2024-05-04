function load() {
  let divHTML1 = document.createElement("div");
  divHTML1.classList.add("load");
  divHTML1.classList.add("show");
  let divHTML2 = document.createElement("div");
  divHTML2.classList.add("progress-cs");
  divHTML2.classList.add("show");

  divHTML1.appendChild(divHTML2);
  document.body.appendChild(divHTML1);
}

function stopLoad() {
  document.querySelector(".load").remove();
}

function imagePreview() {
  const create_img_inp = document.getElementById("c-img-p");
  
  create_img_inp.addEventListener("change", () => {
    const imagePreview = document.getElementById("imagePreview");
    imagePreview.innerHTML = "";
    const file = create_img_inp.files[0];
    const imgHTML = `<img alt="image" src="${URL.createObjectURL(file)}" class="rounded">`;
    const btnDelCreate = `<i class="bi bi-trash bg-danger rounded-circle text-white position-absolute" style="left: 10px; top: 10px; padding: 3px 7px; cursor: pointer;"></i>`;
    const divHTML = `<div class="position-relative">${imgHTML}${btnDelCreate}</div>`;

    imagePreview.innerHTML = divHTML;

    const btnDel = document.querySelector(".bi-trash");
    btnDel.addEventListener("click", () => {
      imagePreview.innerHTML = "";
      create_img_inp.value = "";
    });
  });
}

function img_nav() {
  my_img_nav.forEach((img) => {
    if (typeof JSON.parse(getun).profile_image === "string") {
      const get_my_img_profile = JSON.parse(getun).profile_image;
      img.src = get_my_img_profile;
    }
    img.id = JSON.parse(getun).id;

    img.addEventListener("click", () => {
      window.location.href = `../profile.html?id=${img.id}`;
    });
  });
}

function showComments() {
  let comment = document.querySelectorAll(".comment");
  comment.forEach((com) => {
    com.addEventListener("click", () => {
      window.location.href = `../comment.html?id=${com.id}`;
    });
  });
}

function showProfile() {
  const user_name_comment = document.querySelectorAll(".name-user");
  const img_name_comment = document.querySelectorAll(".img-user-comment");
  const user_name_profile = document.querySelector(".user-name-cs");
  const img_user_profile = document.querySelector(".img-user-profile");
  const profile = document.querySelectorAll(".btn-profile");

    profile.forEach((profile) => {
      profile.addEventListener("click", () => {
        window.location.href = `../profile.html?id=${profile.id}`;
      });
    });
  

    user_name_comment.forEach((name) => {
      name.addEventListener("click", () => {
        window.location.href = `../profile.html?id=${name.id}`;
      });
    });

    img_name_comment.forEach((img) => {
      img.addEventListener("click", () => {
        window.location.href = `../profile.html?id=${img.id}`;
      });
    });

    img_user_profile.addEventListener("click", () => {
      window.location.href = `../profile.html?id=${img_user_profile.id}`;
    });

    user_name_profile.addEventListener("click", () => {
      window.location.href = `../profile.html?id=${user_name_profile.id}`;
    });
  
}


function addComment(text, id) {
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${gett}`);

  const raw = JSON.stringify({ body: text });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`${url_api}/posts/${id}/comments?`, requestOptions).then(() => {
    stopLoad();
    window.location.reload();
  });
}

function handleAddComment() {
  const btnComment = document.querySelectorAll("#add-comment");

  btnComment.forEach((btn) => {
    btn.addEventListener("click", () => {
      // console.log(btn.dataset.postid);
      if (btn.previousElementSibling.value.trim()) {
        load();
        addComment(btn.previousElementSibling.value , btn.dataset.postid);
      }
    });
  })
}

