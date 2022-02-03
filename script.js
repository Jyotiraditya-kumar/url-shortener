(function showSavedLinks() {
  const store = localStorage.getItem("short_links");
  if (store !== null) {
    const data = JSON.parse(store);
    data.forEach((link) => createCard(link));
  }
})();

function Fetch(url) {
  var button = document.getElementById("submit");
  button.innerHTML = "Converting!!!";
  const baseUrl = `https://api.shrtco.de/v2/shorten?url=${url}`;

  fetch(baseUrl)
    .then(async (response) => {
      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson ? await response.json() : null;

      // check for error response
      if (!response.ok) {
        // get error message from body or default to response status
        // const error = (data && data.message) || response.statusText;
        const error = { message: data.error };

        return Promise.reject(error);
      }
      return data;

      // element.innerHTML = JSON.stringify(data, null, 4);
    })
    .then((data) => {
      saveToLocalStorage(data);
    })
    .catch((error) => {
      // element.parentElement.innerHTML = `Error: ${error}`;

      const doc = document.getElementsByClassName("error-message")[0];
      doc.innerHTML = error.message;
      doc.style.display = "block";
    })
    .finally(() => {
      button.innerHTML = "Shorten It!";
    });
}

function saveToLocalStorage(data) {
  const obj = {
    org_url: data.result.original_link,
    short_url: data.result.full_short_link,
  };
  localStore = localStorage.getItem("short_links");

  if (localStore === null) {
    localStorage.setItem("short_links", JSON.stringify([obj]));
  } else {
    let links = JSON.parse(localStore);
    links.push(obj);
    localStorage.setItem("short_links", JSON.stringify(links));
  }
  createCard(obj);
}

function createCard(obj) {
  const linkCard = document
    .getElementsByTagName("template")[0]
    .content.cloneNode(true);
  const org = linkCard.querySelector(".org-url");
  org.innerHTML = obj.org_url;
  org.setAttribute("data-url", obj.org_url);
  linkCard.querySelector(".short-url").innerHTML = obj.short_url;
  linkCard.querySelector(".copy-button").addEventListener("click", copyLink);
  const t = document.getElementsByClassName("turned-links")[0];
  t.appendChild(linkCard);
}
function onSubmitHandler(event) {
  event.preventDefault();
  const inputField = event.srcElement[0];

  const url = inputField.value.trim();
  if (url === "") {
    inputField.classList.add("invalid");
    const doc = document.getElementsByClassName("error-message")[0];
    doc.innerHTML = "Please add a link";
    doc.style.display = "block";
  } else {
    inputField.classList.remove("invalid");
    document.getElementsByClassName("error-message")[0].style.display = "none";
    Fetch(url);
  }
}

const Form = document.getElementsByTagName("form")[0];

Form.addEventListener("submit", onSubmitHandler);

function copyLink(event) {
  const parent = event.target.parentNode;
  const sh_link = parent.querySelector(".short-url").innerHTML;
  navigator.clipboard.writeText(sh_link);
  event.target.innerHTML = "Copied!";
  event.target.style.backgroundColor = "#3b3054";
}

function toggleNavbar(event) {
  const navBar = document.getElementsByClassName("header-links")[0];
  navBar.classList.toggle("active");
}
