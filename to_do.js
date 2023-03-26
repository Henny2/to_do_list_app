const listContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')


// using local storage to store the information in the user's browser
const LOCAL_STORAGE_LIST_KEY = 'task.list' // making a namespace, so that our local storage won't be overwritten
// get list from local storage, if not exist give me an empty array
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedListId' //saving info on selected list in localStorage
// get from localstorage if possible
let selectedListId = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY))
// we dynamically add lists, so adding event listeners for the onClick is more complicated
// our solution: we add a listener to the whole container that they are in 
listContainer.addEventListener('click', e => {
    console.log(e)
    if (e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId
        saveAndRender()
    }
})

deleteListButton.addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedListId)
    selectedListId = null
    saveAndRender()
})

newListForm.addEventListener('submit', e => {
    // stop page from refreshing because it would delete all the lists and not submit the form
    e.preventDefault()
    const listName = newListInput.value
    if (listName === null || listName === '') return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndRender()
    console.log('Submit list')

})

function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }

}

function saveAndRender() {
    save()
    render()
}

// save list of lists to local storage
function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, JSON.stringify(selectedListId))
}

function render() {
    clearElement(listContainer)
    renderLists()
    const selectedList = lists.find(list => list.id === selectedListId)
    // check whether and what tasks to display
    if (selectedListId == null) {
        listDisplayContainer.style.display = 'none'
    }
    else {
        listDisplayContainer.style.display = ''
        listTitleElement.innerText = selectedList.name
    }
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add('list-name')
        listElement.innerText = list.name
        // if the list is the selected ID, show that by adding the needed css class
        if (list.id === selectedListId) {
            listElement.classList.add('active-list')
        }
        listContainer.appendChild(listElement)
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}



render()
// stopped tutorial at 21:30
// next up: render tasks