const API_URL = 'http://localhost:8080/api/products'

const edit = document.querySelector('#edit')
const formEdit = document.querySelector('#formEdit')
const form = document.querySelector('#form') 
let productsList = document.querySelector('#products-list') 

//REMOVE UM PRODUTO
function excluirProduto() {
    const botoesExcluir = document.querySelectorAll('.botao-excluir')

    botoesExcluir.forEach(botao => {
        botao.onclick = function(e) {
            e.preventDefault()

            const id = this.dataset.id

            fetch(`${API_URL}/${id}`,{
                method: 'DELETE'
            }).then(response => {
                response.json().then(data => {
                    if(data.messege === 'Success') {
                        ObterList()
                        alert('Produto excluido com sucesso')
                    } else {
                        alert('Algo deu errado')
                    }
                })
            })
        }
    })
}

//EDITA UM PRODUTO
function editarProduto() {
    const botoesEditar = document.querySelectorAll('.botao-editar')
    botoesEditar.forEach(botao => {
        botao.onclick = function(e) {
            e.preventDefault()

            edit.classList.remove('hidden')

            const id = this.dataset.id
            const name = this.dataset.name
            const brand = this.dataset.brand
            const price = this.dataset.price

            document.forms['formEdit'].id.value = id
            document.forms['formEdit'].name.value = name
            document.forms['formEdit'].brand.value = brand
            document.forms['formEdit'].price.value = price
        }
    })
}

//OBTÉM A LISTA DE PRODUTOS
function ObterList() {
    fetch(API_URL).then(response => {
        response.json().then(data => {
            const productsHtml = data.map(products => `
                <li>
                    ${products.name} - ${products.brand} - ${products.price}
                    <a href="#" class="botao-editar" data-id="${products._id}" data-name="${products.name}" data-brand="${products.brand}" data-price="${products.price}">[Editar]</a>
                    <a href="#" class="botao-excluir" data-id="${products._id}">[Excluir]</a>
                </li>
            `).join('')

            productsList.innerHTML = productsHtml

            excluirProduto()
            editarProduto()
        })    
    })
}

ObterList()
//AO CADASTRAR UM PRODUTO
form.onsubmit = function(e) {
    e.preventDefault()

    const name = document.forms['form'].name.value
    const brand = document.forms['form'].brand.value
    const price = document.forms['form'].price.value

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            brand,
            price
        })
    }).then(response => {
        response.json().then(data => {
            if (data.message === 'Success') {
                form.reset()
                ObterList()
                alert('Cadastro realizado com sucesso')
            } else {
                alert('Ops, ocorreu um erro')
            }
        })
    })
} 

//AO EDITAR UM PRODUTO
formEdit.onsubmit = function(e) {
    e.preventDefault()

    const id = document.forms['formEdit'].id.value
    const name = document.forms['formEdit'].name.value
    const brand = document.forms['formEdit'].brand.value
    const price = document.forms['formEdit'].price.value

    fetch(`${API_URL}/${id}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            brand,
            price
        })
    }).then(response => {
        response.json().then(data => {
            if(data.messege === 'Success') {
                formEdit.reset()
                edit.classList.add('hidden')
                ObterList()
                alert('Produto alterado com sucesso')
            } else {
                alert('Algo deu errado')
            }
        })
    })
}