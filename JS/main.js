import { apiKey, imageBaseUrl, placeholder } from "./config.js";

const input = document.getElementById("input");
const enter = document.getElementById("enter");
const messageParent = document.getElementById("message-parent");

const loader = document.getElementById("loader-parent");

input.addEventListener("keydown", handleKey);
function handleKey(e) {
    if (e.key === "Enter" && input.value.trim() !== "") {
        e.preventDefault();
        main();
    }
}

enter.addEventListener("click", main);

async function main() {
    const query = input.value.trim();
    const invalidChars = /[^a-zA-Z0-9\s]/;
    const maxlength = 100;

    if (query === "") {
        showMessage("Search field couldn't be empty!");
        return;
    }

    if (query.length > maxlength) {
        showMessage(
            `Search query is too long , keep it under ${maxlength} characters`
        );
        return;
    }
    if (invalidChars.test(query)) {
        showMessage("Please avoid using special characters");
        return;
    }
    if (query.length < 3) {
        showMessage("Search term couldn't be less than '3' characters");

        return;
    }

    showLoader(true);
    input.disabled = true;
    try {
        const url = await fetch(
            `https://api.themoviedb.org/3/search/movie?include_adult=false&api_key=${apiKey}&query=${encodeURIComponent(
                query
            )}`
        );

        if (!url.ok) {
            throw new Error("Error fetching data");
        }

        const data = await url.json();

        displayRes(data);
    } catch (error) {
        console.log("Something went wrong");
        showMessage("Something went wrong");
        return;
    } finally {
        input.disabled = false;
        showLoader(false);
    }
}
function displayRes(data) {
    const result = document.getElementById("results-container");

    const placeholderImage = `${placeholder}`;

    while (result.firstChild) {
        result.removeChild(result.firstChild);
    }
    while (messageParent.firstChild) {
        messageParent.removeChild(messageParent.firstChild);
    }

    if (data.results.length === 0) {
        showMessage("No Results");
        return;
    }

    const fragment = document.createDocumentFragment();

    data.results.forEach(item => {
        const itemDiv = document.createElement("div");

        itemDiv.classList.add("poster-parent");

        const img = document.createElement("img");

        img.classList.add("poster");
        img.src = item.poster_path
            ? imageBaseUrl + item.poster_path
            : placeholderImage;
        img.alt = item.title;

        itemDiv.appendChild(img);
        fragment.appendChild(itemDiv);
    });
    result.appendChild(fragment);
}

function showMessage(msg) {
    while (messageParent.firstChild) {
        messageParent.removeChild(messageParent.firstChild);
    }

    const messageItem = document.createElement("p");
    messageItem.classList.add("message");
    messageItem.textContent = msg;
    messageParent.appendChild(messageItem);
}

function showLoader(show) {
    loader.style.display = show ? "block" : "none";
}