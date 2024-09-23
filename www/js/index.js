
document.addEventListener('deviceready', onDeviceReady, false);

let listaPizzasCadastradas = [];

function onDeviceReady() {
    cordova.plugin.http.setDataSerializer('json');
    carregarPizzas();
}

document.getElementById('btnNovo').onclick = function () {
    document.getElementById('applista').style.display = 'none';
    document.getElementById('appcadastro').style.display = 'flex';
    document.getElementById('imagem').style.backgroundImage = '';
    document.getElementById('pizza').value = '';
    document.getElementById('preco').value = '';
};

document.getElementById('btnCancelar').onclick = function () {
    document.getElementById('applista').style.display = 'flex';
    document.getElementById('appcadastro').style.display = 'none';
};

document.getElementById('btnFoto').onclick = function () {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 300,
        targetHeight: 300
    });

    function onSuccess(imageData) {
        const imageElement = document.getElementById('imagem');
        imageElement.style.backgroundImage = `url(data:image/jpeg;base64,${imageData})`;
    }

    function onFail(message) {
        alert('Erro devido: ' + message);
    }
};

document.getElementById('btnSalvar').onclick = function () {
    const PIZZARIA_ID = 'pizzaria_do_gmacedo';
    let imagem = document.getElementById('imagem').style.backgroundImage;
    
    if (!imagem || imagem === 'none') {
        imagem = '';
    }

    const novaPizza = {
        pizzaria: PIZZARIA_ID,
        pizza: document.getElementById('pizza').value,
        preco: document.getElementById('preco').value,
        imagem: imagem
    };
    cordova.plugin.http.post('https://pedidos-pizzaria.glitch.me/admin/pizza/', novaPizza, {}, function(response) {
        carregarPizzas();
        document.getElementById('applista').style.display = 'flex';
        document.getElementById('appcadastro').style.display = 'none';
    }, function(error) {
        console.error(error);
    });
};


document.getElementById('btnExcluir').onclick = function () {
    const PIZZARIA_ID = 'pizzaria_do_gmacedo';
    const pizzaNome = document.getElementById('pizza').value;
    cordova.plugin.http.delete('https://pedidos-pizzaria.glitch.me/admin/pizza/' + PIZZARIA_ID + '/' + pizzaNome, {}, {}, function(response) {
        carregarPizzas();
        document.getElementById('applista').style.display = 'flex';
        document.getElementById('appcadastro').style.display = 'none';
    }, function(error) {
        console.error(error);
    });
};

function carregarPizzas() {
    const PIZZARIA_ID = 'pizzaria_do_gmacedo';
    cordova.plugin.http.get('https://pedidos-pizzaria.glitch.me/admin/pizzas/' + PIZZARIA_ID, {}, {}, function(response) {
        if (response.data !== "") {
            listaPizzasCadastradas = JSON.parse(response.data);
            const listaPizzas = document.getElementById('listaPizzas');
            listaPizzas.innerHTML = '';
            
            listaPizzasCadastradas.forEach((item, idx) => {
                const novo = document.createElement('div');
                novo.classList.add('linha');

                const randomizePizzaImage = () => {
                    const images = ["img/pizza1.jpeg", "img/pizza2.jpeg", "img/pizza3.jpeg", "img/pizza4.jpg"];
                    const randomIndex = Math.floor(Math.random() * images.length);
                    return images[randomIndex];
                };

                const imageSrc = item.imagem && item.imagem !== "none" 
                    ? randomizePizzaImage() 
                    : "img/pressF.jpeg"; 
                const imagem = `<img src="${imageSrc}" alt="${item.pizza}" class="pizza-imagem" />`;

                novo.innerHTML = `${imagem}<span class="pizza-nome">${item.pizza}</span> - <span class="pizza-preco">R$ ${item.preco}</span>`;
                novo.id = idx;
                novo.onclick = function () {
                    carregarDadosPizza(novo.id);
                };
                listaPizzas.appendChild(novo);
            });
        }
    }, function(error) {
        console.error(error);
    });
}



function carregarDadosPizza(id) {
    document.getElementById('applista').style.display = 'none';
    document.getElementById('appcadastro').style.display = 'flex';

    const pizza = listaPizzasCadastradas[id];
    document.getElementById('imagem').style.backgroundImage = pizza.imagem;
    document.getElementById('pizza').value = pizza.pizza;
    document.getElementById('preco').value = pizza.preco;

    document.getElementById('btnSalvar').onclick = function () {
        const PIZZARIA_ID = 'pizzaria_do_gmacedo';
        const pizzaAtualizada = {
            pizzaid: pizza._id,
            pizzaria: PIZZARIA_ID,
            pizza: document.getElementById('pizza').value,
            preco: document.getElementById('preco').value,
            imagem: document.getElementById('imagem').style.backgroundImage
        };
        cordova.plugin.http.put('https://pedidos-pizzaria.glitch.me/admin/pizza/', pizzaAtualizada, {}, function(response) {
            carregarPizzas();
            document.getElementById('applista').style.display = 'flex';
            document.getElementById('appcadastro').style.display = 'none';
        }, function(error) {
            console.error(error);
        });
    };
}
