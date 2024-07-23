import { LoremIpsum } from 'https://cdn.jsdelivr.net/npm/lorem-ipsum@2.0.8/+esm';
// const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});

const delay = ms => new Promise(res => setTimeout(res, ms));

const imgLorem = function() {
    return "https://picsum.photos/200";
}

// Create an empty library array
let myLibrary = [];

// Book constructor
function Book(
        name, 
        author, 
        publicationYear, 
        pagesNb, 
        cover = "",  
        synopsis = lorem.generateSentences(4)
    ) {
    this.id = 'id' + (new Date()).getTime();
    this.name = name,
    this.author = author,
    this.publicationYear = publicationYear,
    this.cover = cover,
    this.synopsis = synopsis,
    this.pagesNb = pagesNb,
    this.isRead = false
}

function addBookToLibrary(newBook) {
    myLibrary.push(newBook);
}

// Create variables that capture HTML elements
const emptyState = document.querySelector(".empty-state");
const addBtn = document.querySelector("#addBookButton");
const cancelDialog = document.querySelector("#button-cancel");
const submitBtn = document.querySelector('#button-submit');
const dialog = document.querySelector(".form-dialog");
const bookForm = document.querySelector("form");
const cards = document.querySelector(".row");

function submitNewBook(e, displayMyLibrarySection) {
    // prevent the form from submitting
    e.preventDefault();
    console.log("Submitting entry...");

    // show the form values
    const formData = new FormData(bookForm);
    formData.forEach((v, k) => console.log(`${k} : ${v}`));
    
    // read the selected file and display it as the card cover image
    const coverFile = formData.get("cover");
    if (coverFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newBook = new Book(
                formData.get("title"),
                formData.get("author"),
                formData.get("publicationYear"),
                formData.get("pagesNb"),
                e.target.result, // use the data URL of the selected file as the card cover image
                formData.get("synopsis")
            );
            addBookToLibrary(newBook);
            cancelDialog.click();
            displayMyLibrarySection();
        };
        reader.readAsDataURL(coverFile);
    } else {
        // use a default image if no file is selected
        const newBook = new Book(
            formData.get("title"),
            formData.get("author"),
            formData.get("publicationYear"),
            formData.get("pagesNb"),
            imgLorem(), // use a default image if no file is selected
            formData.get("synopsis")
        );
        addBookToLibrary(newBook);
        cancelDialog.click();
        displayMyLibrarySection();
    }
}

function displayBookForm() {
    dialog.showModal();
}

function hideBookForm() {
    dialog.close();
}

function deleteBookFromLibrary(label) {
    console.log(`Deleting book with id: ${label.id}`);
    myLibrary = myLibrary.filter(book => book.id !== label.id);
    displayMyLibrarySection();
}

function createBookcard(book) {
    
    let currBook = document.createElement("label");
    currBook.setAttribute("id", book.id);
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    let card = document.createElement("div");
    let cardHeader = document.createElement("div");
    cardHeader.classList.add("buttons-header");

    let trashBtn = document.createElement("button");
    let trashIcon = document.createElement("i");
    trashIcon.classList.add("trash-button", "fa", "fa-trash");
    trashBtn.appendChild(trashIcon);
    trashBtn.addEventListener("click", (e) => deleteBookFromLibrary(e.currentTarget.parentElement.parentElement.parentElement));

    cardHeader.appendChild(trashBtn);

    let front = document.createElement("div");
    let back = document.createElement("div");
    front.classList.add("front");
    back.classList.add("back");
    card.classList.add("card");

    let img = document.createElement("img");
    img.src = book.cover;
    front.appendChild(img);

    let cardContent = document.createElement("div");
    cardContent.classList.add("card-content")

    let title = document.createElement("h3");
    title.textContent = book.name;
    cardContent.appendChild(title);

    let author = document.createElement("p");
    author.textContent = `By ${book.author}`;
    cardContent.appendChild(author);

    let more = document.createElement("p");
    more.textContent = "Click to flip book";
    more.classList.add("more");
    cardContent.append(more);

    let synopsis = document.createElement("p");
    synopsis.classList.add("synopsis");
    synopsis.textContent = book.synopsis;
    back.appendChild(synopsis);
    
    front.appendChild(cardContent);
    
    currBook.appendChild(checkbox);
    card.appendChild(cardHeader);
    card.appendChild(front);
    card.append(back);
    currBook.appendChild(card);
    cards.appendChild(currBook);

}


// Function to display the myLibrary section
function displayMyLibrarySection() {
    // Check if the myLibrary array is empty
    if (myLibrary.length === 0) {
        // If the array is empty, show the empty state section
        emptyState.classList.remove("hidden");
        cards.classList.add("hidden");
    } else {
        // If the array is not empty, hide the empty state section
        emptyState.classList.add("hidden");
        cards.classList.remove("hidden");

        // Display the books in cards
        cards.innerHTML = "";
        myLibrary.forEach((book) => createBookcard(book));
    }
}

submitBtn.addEventListener("click", (e) => submitNewBook(e, displayMyLibrarySection));
addBtn.addEventListener("click", displayBookForm);
cancelDialog.addEventListener("click", hideBookForm);


addBookToLibrary(new Book("Romeo and Juliet", "Shakespeare", 1500, 3000, imgLorem()));
await delay(20);
addBookToLibrary(new Book("Romeo and Juliet", "Shakespeare", 1500, 3000, imgLorem()));
await delay(20);
addBookToLibrary(new Book("Romeo and Juliet", "Shakespeare", 1500, 3000, imgLorem()));
await delay(20);
addBookToLibrary(new Book("Romeo and Juliet", "Shakespeare", 1500, 3000, imgLorem()));
displayMyLibrarySection();

// // Call the displayMyLibrarySection function to initially display the myLibrary section
// displayMyLibrarySection();