
import { GithubUser } from "./GithubUser.js"

//classe que vai conter a lógica dos dados
//como os dados serão estruturados

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
        GithubUser.search('maikbrito')
    }


    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

    }


    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }


    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)


            if(userExists){
                throw new Error('usuário já cadastrado')
            }
            

            const user = await GithubUser.search(username)
            if(user.login === undefined) {
                throw new Error('Usuário não encontrado')
            }


            this.entries = [user, ...this.user]
            this.update()
            this.save()
        } catch (error) {
            alert(error.message)
        }
    }


    delete(user) {
        const filteredEntries = this.entries.filter(entry =>
        entry.login !== user.login)


        this.entries = filteredEntries
        this.update()
        this.save()
    }
}


//classe que vai criar a visualização e eventos do HTML

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
            console.log(value)
        }


    }


    update() {
        this.removeAllTr()
        
       
       this.entries.forEach((user) => {
            const row = this.createRow()
            row.querySelector('td img').src = `https://github.com/${user.login}.png`
            row.querySelector('td h1').textContent = user.name
            row.querySelector('td a').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            row.querySelector('.remove').textContent = 'Remover'
            row.querySelector('.remove').onclick = () => {
                if(confirm('tem certeza que deseja deleter essa linha?')){
                    this.delete(user)
                }
            }

            
            this.tbody.append(row)
       })
    }


    createRow() {
        const tr = document.createElement('tr')

        

        tr.innerHTML =  `
        <td>
            <img></img>
            <div>
                <h1> </h1>
                <a></a>
            </div>
        </td>
        <td class="repositories"></td>
        <td class="followers"></td>
        <td class="remove"></td>
    `
        return tr
    }
    
    
    
    removeAllTr() {
        
        
    
    
        this.tbody.querySelectorAll('tr')
            .forEach((tr) => {
                tr.remove()
            })
    }
}