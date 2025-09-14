// init ///////////////////////////////////
let bookmarksTable = null;
let username = localStorage.getItem('bookmarks-username');
console.log(`Utente: ${username}`);
const usernameInput = document.getElementById('username');
const pageIndex = document.body.id
let bookmarksJson = null;

// event listener ////////////////////////
document.addEventListener('DOMContentLoaded', pageInit);

// functions ////////////////////////////
// ALL - init pages
async function pageInit() {
    if (pageIndex === 'index') {
        bookmarksTable = document.getElementById('linkTable');
        defualtUser();
        await getBookmarks();
        paginateBookmarks();
    } else if (pageIndex === 'settings') {
        await getBookmarks();
        defualtUser();
        usernameInput.value = username;
    } else if (pageIndex === 'db-connection') {
        defualtUser();
        await getBookmarks();
        paginateDbConnection();
    }
};

// SETTINGS - get user
function defualtUser() {
    if (!username) {
        username = 'UTENTE';
        localStorage.setItem('bookmarks-username', username);
    };
}

// SETTINGS - set user
function changeUsername() {
    if (usernameInput.value!=username) {
        console.log(`Cambiato username da: ${username} a ${usernameInput.value}`)
        username = usernameInput.value;
        localStorage.setItem('bookmarks-username', username);
        pageInit()
    }
}

// SETTINGS - remove user
function removeUsername() {
    username = null;
    localStorage.removeItem('bookmarks-username');
    pageInit();
}

// ALL - get bookmarks.json
async function getBookmarks() {
    const response = await fetch('/getBookmarks');
    const data = await response.json();
    bookmarksJson = data;
};

// BOOKMARKS - paginate bookmarks (section)
function paginateBookmarks() {
    const bookmarksData = bookmarksJson.bookmarks;

    if(bookmarksData) {
        bookmarksData.forEach(sectionData => {
            let searchPattern = null;
            if(sectionData.type === 'section') {
                const sectionTr = document.createElement('tr');
                const sectionTd = document.createElement('td');
                const sectionDiv = document.createElement('div');
                const titleDiv = document.createElement('div');
                const titleH3 = document.createElement('h3');

                sectionDiv.classList.add('bookmarks-section');
                titleDiv.classList.add('title');

                titleH3.textContent = sectionData.label;
                titleH3.id = sectionData.id;
                idSearch = stripText(sectionData.id);
                labelSearch = stripText(sectionData.label);


                bookmarksTable.appendChild(sectionTr);
                sectionTr.appendChild(sectionTd);
                sectionTd.appendChild(sectionDiv);
                sectionDiv.appendChild(titleDiv);
                titleDiv.appendChild(titleH3);

                const contentsData = sectionData.contents;
                contentsData.forEach(content => {
                    if(content.type === 'url') {
                        paginateUrls(content, sectionDiv, idSearch, labelSearch);
                    } else if(content.type === 'subsection') {
                        paginateSubsection(content, sectionDiv, idSearch, labelSearch);
                    } 
                });
            }
        })
    }
};

// ALL - strip text
function stripText(t) {
    return t.toLowerCase().replace(/\s+/g, "");
};

// BOOKMARKS - paginate bookmarks (url)
function paginateUrls(c, s, idS, labS) {
    let urlLi = document.createElement('li');
    let urlA = document.createElement('a');
    let urlUl = s.querySelector('ul');

    if(!urlUl) {
        const itemDiv = document.createElement('div');
        urlUl = document.createElement('ul');

        itemDiv.classList.add('item');

        s.appendChild(itemDiv);
        itemDiv.appendChild(urlUl);
    }
    idS = idS+'-'+stripText(c.id);
    labS = labS+'-'+stripText(c.label);
    urlA.setAttribute('search-pattern', idS+'-'+labS);
    urlA.id = idS;
    urlA.textContent = c.label;
    urlA.target = '_blank';
    urlA.href = c.url.replace('{username}', username);

    urlUl.appendChild(urlLi);
    urlLi.appendChild(urlA);
};

// BOOKMARKS - paginate bookmarks (subsection)
function paginateSubsection(c, s, idS, labS) {
    const subSectionDiv = document.createElement('div');
    const titleH4Div = document.createElement('div');
    const titleH4 = document.createElement('h4');

    subSectionDiv.classList.add('bookmarks-subsection');
    titleH4Div.classList.add('title');

    idS = idS+'-'+stripText(c.id);
    labS = labS+'-'+stripText(c.label);
    titleH4.textContent = c.label;
    titleH4.id = idS;

    s.appendChild(subSectionDiv);
    subSectionDiv.appendChild(titleH4Div);
    titleH4Div.appendChild(titleH4);

    const subSectionData = c.contents
    subSectionData.forEach(subContent => {
        if (subContent.type === 'url') {
            paginateUrls(subContent, subSectionDiv, idS, labS);
        }
    })
};

// DB CONNECTION - paginate table
function paginateDbConnection () {
    const dbConnectionS = bookmarksJson['database-connection'];
    const tbodyDb = document.getElementById('dbconnection-table-body');

    dbConnectionS.forEach(dbConnection => {
        let idSearch = stripText(dbConnection['customer']+'-'+dbConnection['environment']);

        if (dbConnection['notes']) {
            idSearch = idSearch+'-'+stripText(dbConnection['notes']);
        }

        const tdOrder = {
            0: 'customer',
            1: 'environment',
            2: 'username',
            3: 'password',
            4: 'url',
            5: 'notes'
        }
        const trDb = document.createElement('tr');
        tbodyDb.appendChild(trDb);

        for (let i = 0; i <= 5; i++) {
            let tdDb = document.createElement('td');
            tdDb.textContent = dbConnection[tdOrder[i]];
            tdDb.id = tdOrder[i];
            trDb.appendChild(tdDb);
        }
        trDb.setAttribute('search-pattern', idSearch);
    });
};

// ALL - menubar
function openSettings() {
    menuBarDiv = document.getElementsByClassName('menu')[0];

    if (menuBarDiv.style.display === 'flex') {
        menuBarDiv.style.display = 'none';
    } else {
        menuBarDiv.style.display = 'flex';
    }
};

// BOOKMARKS - search function
function searchFunctionIndex () {
    const urlList = document.querySelectorAll('a');
    const text = document.getElementById('searchText');
    const textToSearch = stripText(text.value);

    urlList.forEach(url => {
        let link = url.getAttribute('search-pattern');
        let linkButton = url.closest('li');
        const sections = document.querySelectorAll('#linkTable .bookmarks-section, #linkTable .bookmarks-subsection');

        if (link) {
            if (link.includes(textToSearch)) {
                linkButton.style.display = '';
            } else {
                linkButton.style.display = 'none';
            }
        }

        sections.forEach(section => {
            const visibleLinks = section.querySelectorAll("li:not([style*='display: none'])");
            section.style.display = visibleLinks.length > 0 ? "" : "none";
        })
    })
}

// DB-CONNECTION - search function
function searchFunctionDbConnection() {
    let trElements = document.querySelectorAll('tr');
    let text = document.getElementById('searchText');
    let textToSearch = stripText(text.value);

    trElements.forEach(trElement => {
        let searchPattern = trElement.getAttribute('search-pattern');
        if (searchPattern) {
            if (searchPattern.includes(textToSearch)) {
                trElement.style.display = '';
            } else {
                trElement.style.display = 'none';
            }
        }
    })
    
};

// SETTINGS - export bookmarks
function exportBookmarks() {
    let data = bookmarksJson;
    
    function buildContents(items) {
        let html = "";
        items.forEach(item => {
            if (item.type === "section" || item.type === "subsection") {
                html += `
                <DT><H3 ADD_DATE="1650000000" LAST_MODIFIED="1650000000">${item.label}</H3>
                <DL><p>
                ${buildContents(item.contents || [])}
                </DL><p>
                `;
            } else if (item.type === "url") {
                html += `
                <DT><A HREF="${item.url}" ADD_DATE="1650000100">${item.label}</A>
                `;
            }
        });
        return html;
    }

    let contents = buildContents(data.bookmarks);

    let exportTemplate = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
        <TITLE>Bookmarks</TITLE>
        <H1>Bookmarks</H1>

        <DL><p>
        ${contents}
        </DL><p>`;

    let blob = new Blob([exportTemplate], { type: "text/html" });
    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = "bookmarks.html";
    a.click();

    URL.revokeObjectURL(url);
}
