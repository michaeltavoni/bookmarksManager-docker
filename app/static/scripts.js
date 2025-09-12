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
// init
async function pageInit() {
    if (pageIndex === 'index') {
        bookmarksTable = document.getElementById('linkTable');
        defualtUser();
        await getBookmarks();
        paginateBookmarks();
    } else if (pageIndex === 'settings') {
        defualtUser();
        usernameInput.value = username;
    } else if (pageIndex === 'db-connection') {
        defualtUser();
        await getBookmarks();
        paginateDbConnection();
    }
};

// get username
function defualtUser() {
    if (!username) {
        username = 'UTENTE';
        localStorage.setItem('bookmarks-username', username);
    };
}

// set username
function changeUsername() {
    if (usernameInput.value!=username) {
        console.log(`Cambiato username da: ${username} a ${usernameInput.value}`)
        username = usernameInput.value;
        localStorage.setItem('bookmarks-username', username);
        pageInit()
    }
}

// remove username
function removeUsername() {
    username = null;
    localStorage.removeItem('bookmarks-username');
    pageInit();
}

// get bookmarks
async function getBookmarks() {
    const response = await fetch('/getBookmarks');
    const data = await response.json();
    bookmarksJson = data;
};

// paginate table
function paginateBookmarks() {
    const bookmarksData = bookmarksJson.bookmarks;

    if(bookmarksData) {
        bookmarksData.forEach(sectionData => {
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

                bookmarksTable.appendChild(sectionTr);
                sectionTr.appendChild(sectionTd);
                sectionTd.appendChild(sectionDiv);
                sectionDiv.appendChild(titleDiv);
                titleDiv.appendChild(titleH3);

                const contentsData = sectionData.contents;
                contentsData.forEach(content => {
                    if(content.type === 'url') {
                        paginateUrls(content, sectionDiv);
                    } else if(content.type === 'subsection') {
                        paginateSubsection(content, sectionDiv);
                    } 
                });
            }
        })
    }
};

//
function paginateUrls(c, s) {
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

    urlA.id = c.id;
    urlA.textContent = c.label;
    urlA.target = '_blank';
    urlA.href = c.url.replace('{username}', username);

    urlUl.appendChild(urlLi);
    urlLi.appendChild(urlA);
};

//
function paginateSubsection(c, s) {
    const subSectionDiv = document.createElement('div');
    const titleH4Div = document.createElement('div');
    const titleH4 = document.createElement('h4');

    subSectionDiv.classList.add('bookmarks-subsection');
    titleH4Div.classList.add('title');

    titleH4.textContent = c.label;
    titleH4.id = c.id;

    s.appendChild(subSectionDiv);
    subSectionDiv.appendChild(titleH4Div);
    titleH4Div.appendChild(titleH4);

    const subSectionData = c.contents
    subSectionData.forEach(subContent => {
        if (subContent.type === 'url') {
            paginateUrls(subContent, subSectionDiv);
        }
    })
};

// DB CONNECTION - paginate table
function paginateDbConnection () {
    const dbConnectionS = bookmarksJson['database-connection'];
    const tableDb = document.getElementById('dbconnection-table-body');
    const tbodyDb = document.createElement('tbody');
    tableDb.appendChild(tbodyDb);

    dbConnectionS.forEach(dbConnection => {
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
    });
};

// menu-bar
function openSettings() {
    menuBarDiv = document.getElementsByClassName('menu')[0];

    if (menuBarDiv.style.display === 'flex') {
        menuBarDiv.style.display = 'none';
    } else {
        menuBarDiv.style.display = 'flex';
    }
};