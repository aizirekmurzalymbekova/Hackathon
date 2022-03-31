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
