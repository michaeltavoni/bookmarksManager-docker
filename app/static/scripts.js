// init ///////////////////////////////////
const bookmarksTable = document.getElementById('linkTable');
let bookmarks = null;
let urlNumber = 0;

// event listener ////////////////////////
document.addEventListener('DOMContentLoaded', pageInit);

// functions ////////////////////////////
// init
async function pageInit() {
    await getBookmarks();
    paginateBookmarks();
};

// get bookmarks
async function getBookmarks() {
    const response = await fetch('/getBookmarks');
    const data = await response.json();
    bookmarks = data;
};

// paginate table
function paginateBookmarks() {
    const bookmarksData = bookmarks.data;

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
                urlNumber = 0;
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
    urlA.href = c.url;

    urlUl.appendChild(urlLi);
    urlLi.appendChild(urlA);

    urlNumber += 1;
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
        console.log(subContent)
        if (subContent.type === 'url') {
            paginateUrls(subContent, subSectionDiv);
        }
    })
    urlNumber = 0;
};