var editor = new EditorJS({
    placeholder: `Start Writing or [TAB] to see options...`,
    readOnly: false,
    holder: 'editorjs',
    onReady: () => {
        new DragDrop(editor);
    },
    tools: {
        math: MathTool,
        header: {
            class: Header,
            config: {
                placeholder: 'Header'
            },
            shortcut: 'CMD+SHIFT+H'
        },
        image: SimpleImage,
        warning: Warning,
        alert: {
            class: Alert,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+A',
            config: {
                defaultType: 'primary',
                messagePlaceholder: 'Write an alert...',
            },
        },

        list: {
            class: NestedList,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+L',
            config: {
                defaultStyle: 'ordered'
            },
        },

        checklist: {
            class: Checklist,
            inlineToolbar: true,
        },

        underline: Underline,
        Marker: Marker,

        callout: CalloutTool,

        delimiter: Delimiter,

        inlineCode: {
            class: InlineCode,
            shortcut: 'CMD+SHIFT+C'
        },

        embed: {
            class: Embed,
            inlineToolbar: true,
        },

        table: {
            class: Table,
            inlineToolbar: true,
            shortcut: 'CMD+ALT+T'
        },

    },
});

cat = document.getElementById("cat")
catContainer = document.getElementById("catContainer")
catClear = document.getElementById("clearCat")
catClear.addEventListener('click', function () {
    catContainer.innerHTML = ""
});
cat.addEventListener('keypress', function (e) {
    if (e.key === "Enter") {
        if (cat.value != "") {
            catContainer.innerHTML = catContainer.innerHTML + `<div class="card m-1 p-1 rounded-2" style="display: inline-block;">` + "#" + cat.value.trim() + `</div>`
            cat.value = ""
        }
    }
});

imageURL = document.getElementById("imageURL");
imageHandler = document.getElementById("imageHandler");
imageURL.addEventListener("input", function () {
    if (imageURL != "") {
        imageHandler.setAttribute('src', imageURL.value)
    }
})

fontStyleSansSerif = document.getElementById("sans-serif")
fontStyleSansSerif.addEventListener("input", function () {
    if (fontStyleSansSerif.checked) {
        document.getElementById("content").setAttribute("style", "font-family:'Segoe UI Variable Display', sans-serif")
    }
})
fontStyleSerif = document.getElementById("serif")
fontStyleSerif.addEventListener("input", function () {
    if (fontStyleSerif.checked) {
        document.getElementById("content").setAttribute("style", "font-family:serif")
    }
})
fontStyleMonospace = document.getElementById("monospace")
fontStyleMonospace.addEventListener("input", function () {
    if (fontStyleMonospace.checked) {
        document.getElementById("content").setAttribute("style", "font-family:monospace")
    }
})

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.setAttribute("data-bs-theme", "dark")
    themeToggle.checked = true
}
themeToggle = document.getElementById("themeToggle")
themeToggle.addEventListener('input', function () {
    if (themeToggle.checked) {
        document.body.setAttribute("data-bs-theme", "dark")
    } else {
        document.body.setAttribute("data-bs-theme", "light")
    }
})

document.getElementById("printBtn").addEventListener('click', ()=>{
    document.body.setAttribute("data-bs-theme", "light")
    window.print();
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.setAttribute("data-bs-theme", "dark")
        themeToggle.checked = true
    }
})