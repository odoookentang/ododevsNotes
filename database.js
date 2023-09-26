// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZaZsZw-4MIdsoaUJkWLzzvNOXRQwC7B4",
    authDomain: "ododevsnotes.firebaseapp.com",
    databaseURL: "https://ododevsnotes-default-rtdb.firebaseio.com",
    projectId: "ododevsnotes",
    storageBucket: "ododevsnotes.appspot.com",
    messagingSenderId: "423383404271",
    appId: "1:423383404271:web:c19f6271f0b0feee70d51a"
};

// Initiate Firebase
const app = initializeApp(firebaseConfig);
console.log("firebase initiated :D")

// Elements or Variables Lists
var userIDHandle = document.getElementById("userID")
var userName = document.getElementById("userName")
var newNoteBtn = document.getElementById("addNote")
var logOut = document.getElementById("logOut")
var noteName = document.getElementById("noteName")
var Name = document.getElementById("boardName")
var tags = document.getElementById("catContainer")
var content = document.getElementById("content")
var welcome = document.getElementById("welcome")
var fontStyles = document.getElementById("fontStyles")
var notes = document.getElementById("notes")
var noteID = ""
var imageURL = document.getElementById("imageURL")
var statusSaved = document.getElementById("status-saved")
var statusPrep = document.getElementById("status-prep")
var imageHandler = document.getElementById("imageHandler")
var noteNotFound = document.getElementById("noteNotFound")
var refreshBtn = document.getElementById("refreshBtn")
var deleteBtn = document.getElementById("deleteBtn")
var notFound = false

// Authentication Functions --------------------------------
// Get Firebase Authentication
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js"
console.log("imported firebase auth :D");
const auth = getAuth(app);
onAuthStateChanged(auth, (user) => {
    if (user) {
        userIDHandle.innerHTML = user.uid
        userName.innerHTML = user.email
        FetchAllDataOnce()
        Open(user.uid)
        statusSaved.setAttribute("style", "display: none")
        statusPrep.setAttribute("style", "display: none")
    } else {
        window.location.replace("https://ododevsnotes.web.app/auth");
    }
})

logOut.addEventListener('click', function () {
    signOut(auth)
        .then(() => {
            window.location.replace("https://ododevsnotes.web.app/auth");
        }).catch((error) => {

        })
})

// Database Functions ---------------------------------------
// Get Firebase Database
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js"
console.log("Imported Firebase Database")
var db = getDatabase();


// Fetch All Data Once
var dbref = ref(db)

function FetchAllDataOnce() {
    notes.innerHTML = `<div class="card p-2"><i class="text-muted bi-pencil-square"></i><p class="placeholder-wave"><span class="placeholder col-11 rounded-3"></span><span class="placeholder col-7 rounded-3"></span></p></div>`
    console.log("Fetch Triggered!")
    console.log("Users/" + userIDHandle.innerHTML + "/Note/NoteMetadata/")
    get(child(dbref, "Users/" + userIDHandle.innerHTML + "/Note/NoteMetadata/"))
        .then((snapshot) => {
            var notesList = [];
            snapshot.forEach(childSnapshot => {
                notesList.push(childSnapshot.val());
            });
            notes.innerHTML = "";
            AddItemsToTable(notesList);
        })
}

refreshBtn.addEventListener('click', reFetchAllData)
function reFetchAllData() {
    notes.innerHTML = `<div class="card p-2"><i class="text-muted bi-pencil-square"></i><p class="placeholder-wave"><span class="placeholder col-11 rounded-3"></span><span class="placeholder col-7 rounded-3"></span></p></div>`
    console.log("Fetch Triggered!")
    console.log("Users/" + userIDHandle.innerHTML + "/Note/NoteMetadata/")
    get(child(dbref, "Users/" + userIDHandle.innerHTML + "/Note/NoteMetadata/"))
        .then((snapshot) => {
            var notesList = [];
            snapshot.forEach(childSnapshot => {
                notesList.push(childSnapshot.val());
            });
            notes.innerHTML = "";
            AddItemsToTable(notesList);
        })
}

function AddItemsToTable(notes) {
    notes.forEach(element => {
        AddItemToTable(element.Name, element.Tags, element.HeaderImage, element.ID);
    });

}

function AddItemToTable(name, tag, himage, id) {
    let opt = document.createElement("div");
    opt.innerHTML = `
    <a style="text-decoration: none" href="?n=` + id + `">
    <div class="mb-2 card">
    <img class="card-img-top" height="40px" style="object-fit: cover; background-repeat: no-repeat" src="`+ himage + `"/><h4 class="m-2">` + name + `</h4></img>
    <div class="p-1">`+ tag + `</div>
    </div></a>
    `;
    notes.appendChild(opt)
}

function Open(uid) {
    // Get the note ID
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    noteID = params.n;
    console.log(noteID)
    if (noteID != null) {
        const dbRef = ref(db);
        // Get the note metadata
        get(child(dbRef, "Users/" + uid + "/Note/NoteMetadata/" + noteID)).then((snapshot) => {
            if (snapshot.exists()) {
                console.info("Note Metadata found! Opening...")
                document.title = snapshot.val().Name
                noteName.innerHTML = snapshot.val().Name
                tags.innerHTML = snapshot.val().Tags
                imageURL.value = snapshot.val().HeaderImage
                imageHandler.setAttribute('src', snapshot.val().HeaderImage)
                console.info("Opening Done!")
            } else {
                console.warn("Note not found. Cancelling...")
                fontStyles.setAttribute("style", "display: none")
                content.setAttribute("style", "display: none")
                welcome.setAttribute("style", "display: none")
                noteNotFound.setAttribute("style", "")
            }
        }).catch((error) => {
            alert("Firebase error is: " + error)
        });

        // Get the note itself second
        get(child(dbRef, "Users/" + uid + "/Note/Notes/" + noteID)).then((snapshot) => {
            if (snapshot.exists()) {
                console.info("Note found! Opening...")
                if (snapshot.val().Note != "") {
                    editor.render(JSON.parse(snapshot.val().Note))
                }
                console.info("Opening Done!")
            } else {
                console.warn("Note not found. Cancelling...")
                notFound = true
            }
        }).catch((error) => {
            alert("Firebase error is: " + error)
        });
        fontStyles.setAttribute("style", "")
        content.setAttribute("style", "")
        welcome.setAttribute("style", "display: none")
        noteNotFound.setAttribute("style", "display: none")
        inactivityTime();
        console.log('Waiting for idle to save...');
    }

}

// Autosaving for opened notes
let inactivityTime = function () {
    let time;
    window.onload = resetTimer;
    document.onkeypress = resetTimer;
    function SaveNote() {
        if (noteID != null) {
            if (notFound) {

            } else {
                editor.save().then((outputData) => {
                    set(ref(db, "Users/" + userIDHandle.textContent + "/Note/NoteMetadata/" + noteID), {
                        Name: noteName.innerHTML,
                        Tags: tags.innerHTML,
                        ID: noteID,
                        HeaderImage: imageURL.value
                    }).then(() => {
                        console.log('saved successfully!');
                        statusPrep.setAttribute("style", "display: none")
                        statusSaved.setAttribute("style", "")
                    })
                        .catch((error) => {
                            alert("Firebase Error is: " + error);
                        });
                    set(ref(db, "Users/" + userIDHandle.textContent + "/Note/Notes/" + noteID), {
                        Note: JSON.stringify(outputData)
                    }).then(() => {
                        console.log('saved successfully!');
                    })
                        .catch((error) => {
                            alert("Firebase Error is: " + error);
                        });
                })
            }


        }
    }
    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(SaveNote, 5000)
        statusSaved.setAttribute("style", "display: none")
        statusPrep.setAttribute("style", "")
    }
};

// Create a new note
newNoteBtn.addEventListener("click", newNote)
function newNote() {
    if (Name.value != "" || Name.value != null) {
        var newID = crypto.randomUUID()
        set(ref(db, "Users/" + userIDHandle.textContent + "/Note/NoteMetadata/" + newID), {
            Name: Name.value,
            Tags: "",
            HeaderImage: "https://lh3.googleusercontent.com/4ixo00BDJowWndZUO-r-lOeLGVdAUOkKrPlQlxZHaf7Kbh-gfJ0S6HK1_t_lbmf7g60cANV2NVXzXTCSVKZ_s-n2OhWfU72m2xd_zeQ9348Dd3zd348H=w2400-rj",
            ID: newID,
        }).then(() => {
            console.log('created successfully!');
            reFetchAllData()
        })
            .catch((error) => {
                alert("Firebase Error is: " + error);
            });

        set(ref(db, "Users/" + userIDHandle.textContent + "/Note/Notes/" + newID), {
            Note: ""
        }).then(() => {
            console.log('created successfully!');
        })
            .catch((error) => {
                alert("Firebase Error is: " + error);
            });
    }
}

deleteBtn.addEventListener("click", Delete)
function Delete() {
    remove(ref(db, "Users/" + userIDHandle.textContent + "/Note/Notes/" + noteID))
        .then(() => {
        })
        .catch((error) => {
            alert("Firebase error is " + error)
        })

    remove(ref(db, "Users/" + userIDHandle.textContent + "/Note/NoteMetadata/" + noteID))
        .then(() => {
            window.location.replace("https://ododevsnotes.web.app");
        })
        .catch((error) => {
            alert("Firebase error is " + error)
        })
};