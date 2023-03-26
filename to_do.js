const listContainer = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')

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

clearCompleteTasksButton.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveAndRender()
})

tasksContainer.addEventListener('click', e => {
    // it is equal to 'input' when we click on the checkbox within the container
    if (e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId)
        // when we create the task we set the checkbox id to euqal the task id, that's why this works
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        // e.taget.checked will be true or false depending on whether the checkbox is checked or not
        selectedTask.complete = e.target.checked
        // don't do a saveAndRender here because the only thing that needs to be rerendered is the count, so just calling its function
        save()
        renderTaskCount(selectedList)
    }
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

newTaskForm.addEventListener('submit', e => {
    // stop page from refreshing because it would delete all the lists and not submit the form
    e.preventDefault()
    const taskName = newTaskInput.value
    if (taskName === null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveAndRender()
})



function createList(name) {
    return {
        id: Date.now().toString(), name: name, tasks: []
    }
}
function createTask(name) {
    return {
        id: Date.now().toString(), name: name, complete: false
    }
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
        renderTaskCount(selectedList)
        clearElement(tasksContainer)
        renderTasks(selectedList)
    }
}
function renderTaskCount(selectedList) {
    // GET THE NUMBER OF UNFINISHED TASKS
    const incompleteTasksCount = selectedList.tasks.filter(task => !task.complete).length
    const taskString = incompleteTasksCount === 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTasksCount} ${taskString} remaining`
}
function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        // without the true, it would only import the first line
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)
    })
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
// https://www.youtube.com/watch?v=W7FaYfuwu70