alert('hi')
const listContainer = document.querySelector('[data-lists]')
let lists = ['name', 'todo']



function render() {
    clearElement(listContainer)
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.classList.add('list-name')
        listElement.innerText = list
        listContainer.appendChild(listElement)
    })
}

function clearElement(element) {
    while (element.firstChild) {
        element.remmoveChild(element.firstChild)
    }
}

render()
alert('test')