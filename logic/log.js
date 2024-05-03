// Define variables
const url_api = "https://tarmeezacademy.com/api/v1";
const btn_login = document.getElementById("btn-login");
const un_inp_log = document.getElementById("username-inp-log");
const pass_inp_log = document.getElementById("pass-inp-log");
const eye = document.querySelector(".eye-cs");
const incorrect = document.querySelectorAll(".incorrect-log");
const create_img_inp = document.getElementById("profile-img-c");
const btn_req = document.getElementById("btn-req");
const create_btn = document.getElementById("btn-new-acc");

const create_name_inp = document.getElementById("name-c");
const create_username_inp = document.getElementById("username-c");
const create_pass_inp = document.getElementById("pass-c");
const create_email_inp = document.getElementById("email-c");

// Automatic login function
logauto();

// Add listener for showing/hiding password
eye.addEventListener("click", () => {
  if (pass_inp_log.type == "password") {
    pass_inp_log.type = "text";
    eye.className = "bi bi-eye input-group-text eye-cs";
  } else if (pass_inp_log.type == "text") {
    pass_inp_log.type = "password";
    eye.className = "bi bi-eye-slash input-group-text eye-cs";
  }
});

// Add listener for login
btn_login.addEventListener("click", () => {
  if (un_inp_log.value.trim() && pass_inp_log.value.length > 0) {
    load(); // Show loading indicator
    log(un_inp_log.value, pass_inp_log.value); // Call login function
  }
});

// Add listener for image upload and preview
create_img_inp.addEventListener("change", () => {
  const imagePreview = document.getElementById("imagePreview");

  imagePreview.innerHTML = "";

  const file = create_img_inp.files[0];
  const imgHTML = `<img src="${URL.createObjectURL(
    file
  )}" alt="image" class="rounded">`;
  const btnDelCreate = `<i class="bi bi-trash bg-danger rounded-circle text-white position-absolute" style="left: 10px; top: 10px; padding: 3px 7px; cursor: pointer;"></i>`;
  const divHTML = `<div class="position-relative">${imgHTML}${btnDelCreate}</div>`;

  imagePreview.innerHTML = divHTML; // Show image preview

  const btnDel = document.querySelector(".bi-trash");
  btnDel.addEventListener("click", () => {
    imagePreview.innerHTML = ""; // Remove image preview
    create_img_inp.value = ""; // Clear input value
  });
});

// Add listener for registration request
btn_req.addEventListener("click", () => {
  // Add listener for create button
  create_btn.addEventListener("click", () => {
    const inputs = [create_name_inp, create_username_inp, create_pass_inp];
    inputs.forEach((input) => {
      if (input.value.trim()) {
        input.nextElementSibling.classList.add("d-none");
      } else {
        input.nextElementSibling.classList.remove("d-none");
      }
    });
    const create_error_msg = document.querySelectorAll(".error-msg-c");
    if (
      create_error_msg[0].classList.contains("d-none") &&
      create_error_msg[1].classList.contains("d-none") &&
      create_error_msg[2].classList.contains("d-none")
    ) {
      load(); // Show loading indicator
      createNewUser(); // Call registration function
    }
  });
});

// Function for automatic login
function logauto() {
  if (localStorage.getItem("t") !== null) {
    window.location.replace("../home.html"); // Redirect to home page
  }
}

// Function for login
function log(e, p) {
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  const raw = JSON.stringify({
    username: e,
    password: p,
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  fetch(`${url_api}/login?username=${e}&password=${p}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result !== undefined) {
        if (result.hasOwnProperty("token")) {
          localStorage.setItem("t", result.token); // Save token to local storage
          localStorage.setItem("u", JSON.stringify(result.user)); // Save user data to local storage
          window.location.replace("../home.html"); // Redirect to home page
          incorrect[0].classList.add("d-none"); // Hide username error
          incorrect[1].classList.add("d-none"); // Hide password error
          stopLoad(); // Hide loading indicator
        } else {
          stopLoad(); // Hide loading indicator
          if (result.errors.hasOwnProperty("email")) {
            incorrect[0].textContent = result.errors.email[0];
            incorrect[0].classList.remove("d-none"); // Show email error
          }
          if (result.errors.hasOwnProperty("password")) {
            incorrect[1].textContent = result.errors.password[0];
            incorrect[1].classList.remove("d-none"); // Show password error
          } else {
            incorrect[1].textContent = result.errors.email[0];
            incorrect[1].classList.remove("d-none"); // Show email error
          }
        }
      }
    });
}

// Function for creating new user
function createNewUser() {
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");

  const formdata = new FormData();
  formdata.append("name", create_name_inp.value);
  formdata.append("username", create_username_inp.value);
  formdata.append("password", create_pass_inp.value);
  if (create_email_inp.value.length > 0) {
    formdata.append("email", create_email_inp.value);
  }
  if (create_img_inp.files.length > 0) {
    formdata.append("image", create_img_inp.files[0]);
  }

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };
  fetch(`${url_api}/register`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.errors) {
        stopLoad();
        if (result.errors.email) {
          create_email_inp.nextElementSibling.textContent = result.errors.email[0];
          create_email_inp.nextElementSibling.classList.remove("d-none"); // Show email error
        }
        if (result.errors.password) {
          create_pass_inp.nextElementSibling.textContent =
            result.errors.password[0];
          create_pass_inp.nextElementSibling.classList.remove("d-none"); // Show password error
        }
        if (result.errors.username) {
          create_username_inp.nextElementSibling.textContent =
            result.errors.username[0];
          create_username_inp.nextElementSibling.classList.remove("d-none"); // Show username error
        }
      } else {
        localStorage.setItem("t", result.token); // Save token to local storage
        localStorage.setItem("u", JSON.stringify(result.user)); // Save user data to local storage
        log(result.user.username, create_pass_inp.value); // Call login function
        stopLoad(); // Hide loading indicator
      }
    });
}