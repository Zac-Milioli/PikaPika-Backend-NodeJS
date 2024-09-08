const url = "http://localhost:3000"

async function getTeam() {
    try {
        const response = await fetch(`${url}/team`, {
            method: 'GET',
            dataType: 'json',
        });
        const result = await response.json();
        let pokeTeam = document.getElementById('pokeTeam');
        pokeTeam.innerHTML = ""; //Limpa a div do time para evitar de ficar repetindo
        for (let i = 0; i < result.length; i++) {
    
            let anchor = document.createElement('a');
            anchor.href = "";
            anchor.onclick = function() {
                deletePokemon(img.id); // Passa o id da imagem (nome do pokemon) como parametro para a função deletePokemon
            }; // Deleta o pokemon do time ao clicar

            // Cria um novo elemento de imagem com a sprite do pokemon, texto alternativo, id e titulo contendo o nome do pokemon
            let img = document.createElement('img');
            img.src = result[i].img;
            img.alt = `foto ${result[i].nome}`;
            img.id = result[i].nome;
            img.title = result[i].nome;
            img.height = 60;// Define a altura da imagem para 60 px
            
            anchor.appendChild(img)
            pokeTeam.appendChild(anchor); // Adiciona a imagem dentro da div pokeTeam
        };
        return result;
    } catch (error) {
        console.error('Error:', error.message); // Não está retornando o erro não sei o pq
    }
}

async function getPokemon(pokemon) {
    pokemon = pokemon.toLowerCase()
    try {
        const response = await fetch(`${url}/api/${pokemon}`, {
            method: 'GET',
        });
        const result = await response.json();
        console.log(result.pokemonTipo)
        document.getElementById('pokemonImage').src = result.pokemonImg
        document.getElementById('pokedexNumber').innerHTML = result.pokemonPokedex
        document.getElementById('pokemonName').title = result.pokemonNome
        document.getElementById('pokemonName').innerHTML = result.pokemonNome
        document.getElementById('firstType').innerHTML = result.pokemonTipo[0]
        document.getElementById('firstType').className = `ms-1 ${result.pokemonTipo[0]}`
        document.getElementById('secondType').innerHTML = ""
        document.getElementById('secondType').className = ""
        if (result.pokemonTipo[1]){
            document.getElementById('secondType').innerHTML = result.pokemonTipo[1]
            document.getElementById('secondType').className = result.pokemonTipo[1]
        }
        document.getElementById('pokemonInput').value = ""; // limpa o campo de pesquisa
    } catch (error) {
        console.error('Error:', error.message); // Não está retornando o erro não sei o pq
    }
}

async function postPokemon() {
    let team = await getTeam(); // Armazena a lista de times fornecida pela função getTeam
    let pokemon = document.getElementById('pokemonName').title // Recebe o valor do pokemon preenchido pelo usuário (será alterado pelo nome do pokemon buscado)
    if (pokemon != "" && team.length < 6) {
        pokemon = pokemon.toLowerCase(); // Transforma o nome do pokemon em minúsculo
        try{
            const response = await fetch(`${url}/api/${pokemon}`, {
                method: 'POST',
            });
            
            getTeam();
        } catch (error) {
            console.error(error); // Não está retornando o erro não sei o pq 
        }
    }else if(pokemon == ""){
        alert("Digite o Nome ou Numero da Pokedex do pokemon")
    }else if(team.length == 6){
        alert("o time não pode conter mais que 6 pokemon")
    }
}

async function deletePokemon(pokemon) {
    try {
        const response = await fetch(`${url}/team/${pokemon}`, {
            method: 'DELETE',
        });
        getTeam()
    } catch (error) {
        console.error('Error:', error.message); // Não está retornando o erro não sei o pq
    }

}