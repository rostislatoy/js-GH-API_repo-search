

const formSearch = document.querySelector('.search__box')
const input = formSearch.querySelector('.search__box input')
const autocomplite = formSearch.querySelector('.autocomplete')
const repoCollection = formSearch.querySelector('.repo-collection')


class Component {
    constructor(obj){
        this.name = obj.name
        this.owner = obj.owner.login
        this.stars = obj.stargazers_count
    }
    toScreen(array){
        const fragment = document.createDocumentFragment()
        const lastIndex = [array[array.length - 1]]
        
        lastIndex.forEach(item => {
            const card = document.createElement('div')
            const cardInfos = document.createElement('div')
            const cardDelete = document.createElement('div')
            const cardName = document.createElement('p')
            const cardOwner = document.createElement('p')
            const cardStars = document.createElement('p')
            const cardBtnDelete = document.createElement('button')
            
            cardName.textContent = `Name: ${item.name}`
            cardOwner.textContent =`Owner: ${item.owner.login}`
            cardStars.textContent = `Stars: ${item.stargazers_count}`

            cardBtnDelete.addEventListener('click',() =>{card.remove()})
            cardInfos.appendChild(cardName)
            cardInfos.appendChild(cardOwner)
            cardInfos.appendChild(cardStars)
            cardDelete.appendChild(cardBtnDelete)
            cardInfos.classList.add('card-flexbox-start')
            cardDelete.classList.add('card-flexbox-end')

            card.appendChild(cardInfos)
            card.appendChild(cardDelete)
            card.classList.add('choose-card')
            fragment.appendChild(card)
    
        })
        formSearch.appendChild(fragment)
    }
}

async function getRepo(repoName){
    try{
     const data = await fetch(`https://api.github.com/search/repositories?q=${repoName}`)
     const response = await data.json()
     const firstFiveRepos = response.items.slice(0,5)
     return Promise.resolve(firstFiveRepos)
    }catch{
        throw new Error('error')
    }
}
const debounce = (fn, delay) => {
    let timer
    return function (...args){
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        },delay)
    }
};

const screenCollection = []
function showResults(...arr){
    autocomplite.innerHTML = ''
    autocomplite.style.display = 'block'
    arr.forEach(repo => {  
        repo.forEach(el => {
            const repoInfo = document.createElement('div')
            repoInfo.textContent = el.name
            repoInfo.classList.add('show-results')
            autocomplite.appendChild(repoInfo)
            repoInfo.addEventListener('click', (e) => {
                screenCollection.push(el)
                    el = new Component(el)
                    el.toScreen(screenCollection)
                    input.value = ''
                    autocomplite.style.display = 'none'
            })
        })
    })
}


input.addEventListener('input', debounce(async (e) => {
    const query = e.target.value
    if(query){
        const repos = await getRepo(query)
        showResults(repos)
    }else{
        autocomplite.innerHTML = ''
    }
},400))
