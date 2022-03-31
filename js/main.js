const API = "http://localhost:8000/posts";
let searchValue = "";

let form = $(".form-post");
let inpPost = $(".inp-post");
let inpImage = $(".inp-image");
let btn = $(".inp-btn");
let tweetList = $(".tweet");

// ! CREATE
form.on("submit", async (event) => {
  event.preventDefault();
  let post = inpPost.val().trim();
  let image = inpImage.val().trim();
  let newPost = {
    post: post,
    image: image,
    likes: Math.ceil(Math.random() * 100),
    comments: Math.ceil(Math.random() * 100),
    views: Math.ceil(Math.random() * 100),
  };

  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });
  inpPost.val("");
  inpImage.val("");
  render();
});

// ! READ
async function render() {
  const response = await fetch(`${API}?q=${searchValue}`);
  const data = await response.json();

  // ! pagination start
  let first = currentPage * postsPerPage - postsPerPage;
  let last = currentPage * postsPerPage;
  const currentPosts = data.slice(first, last);
  lastPage = Math.ceil(data.length / postsPerPage) || 1;
  // ! делаем визуально нерабочими кнопки
  if (currentPage === 1) {
    prevBtn.addClass("disabled");
  } else {
    prevBtn.removeClass("disabled");
  }

  if (currentPage === lastPage) {
    nextBtn.addClass("disabled");
  } else {
    nextBtn.removeClass("disabled");
  }

  // ! pagination end

  tweetList.html("");
  currentPosts.forEach((item) => {
    tweetList.prepend(`
    <div class = "tweet-list">
        <img src = "./images/twitteravatar.jpg" class = "avatar"> <span><i>shared a tweet</i></span>
        <p class = "tweet-post">${item.post}</p>
        <img src="${item.image}" class = "post-image">
        <button id = "${item.id}" class = "btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal"><img src="./icons/pen.png"></button>
        <button id = "${item.id}" class = "btn-delete"><img src="./icons/delete.png"></button>
        <button id = "${item.id}" class = "btn-likes"><img class = "img-like" src="./icons/heart.png"><span>${item.likes}</span></button>
        <button id = "${item.id}" class = "btn-comments"><img src="./icons/comment.png"><span>${item.comments}</span></button>
        <button id = "${item.id}" class = "btn-views"><img src="./icons/view.png"><span>${item.views}</span></button>
        <div>
      `);
  });
}
render();

// ! Delete

$(document).on("click", ".btn-delete", async (event) => {
  let id = event.currentTarget.id;
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  render();
});

// ! Update
let editInpPost = $(".edit-inp-post");
let editInpImage = $(".edit-inp-image");
let editForm = $(".edit-form");
let editModal = $(".modal");

$(document).on("click", ".btn-edit", async (event) => {
  let id = event.currentTarget.id;
  editForm.attr("id", id);
  const response = await fetch(`${API}/${id}`);
  const data = await response.json();
  editInpPost.val(data.post);
  editInpImage.val(data.image);
  editForm.on("submit", async (event) => {
    event.preventDefault();
    let post = editInpPost.val().trim();
    let image = editInpImage.val().trim();
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: post, image: image }),
    });
    render();
    editModal.modal("hide");
  });
});

//! Pagination
let prevBtn = $(".prev-btn");
let nextBtn = $(".next-btn");

let postsPerPage = 5;
let currentPage = 1;
let lastPage = 1;

nextBtn.on("click", () => {
  if (currentPage === lastPage) {
    return;
  }
  currentPage++;
  render();
  window.scrollTo(0, 0);
});

prevBtn.on("click", () => {
  if (currentPage === 1) {
    return;
  }
  currentPage--;
  render();
  window.scrollTo(0, 0);
});

// ! Live search функционал
let searchInp = $(".inp-search");

searchInp.on("input", (event) => {
  searchValue = event.target.value;
  currentPage = 1;
  render();
});

async function getLikes() {
  $(document).on("click", ".btn-likes", async (event) => {
    let id = event.currentTarget.id;
    const response = await fetch(`${API}/${id}`);
    const data = await response.json();
    let sum = data.likes;
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: sum + 1 }),
    });
    render();
  });
}
getLikes();
