const url = "http://localhost:3000"

async function getTeam() {
    try {
        const response = await fetch(`${url}/team`, {
            method: 'GET',
            dataType: 'json',
        });
        const result = await response.json();
        let pokeTeam = document.getElementById('pokeTeam');
        pokeTeam.innerHTML = "";
        for (let i = 0; i < result.length; i++) {
            // Cria um novo elemento de imagem
            let img = document.createElement('img');
            img.src = result[i].img;
            img.alt = `foto ${result[i].nome}`;
            img.title = result[i].nome;
            img.height = 60;
            
            // Adiciona a imagem dentro da div pokeTeam
            pokeTeam.appendChild(img);
        };
        return result;
    } catch (error) {
        console.error('Error:', error.message); //Não está retornando o erro não sei o pq
    }
}

async function postPokemon() {
    let team = await getTeam();
    let pokemon = document.getElementById('pkInput').value
    if (pokemon != "" && team.length < 6) {
        pokemon = pokemon.toLowerCase();
        try{
            const response = await fetch(`${url}/api/${pokemon}`, {
                method: 'POST',
            });
            document.getElementById('pkInput').value = "";
            getTeam();
        } catch (error) {
            console.error(error); //Não está retornando o erro não sei o pq 
        }
    }else if(pokemon == ""){
        alert("Digite o Nome ou Numero da Pokedex do pokemon")
    }else if(team.length == 6){
        alert("o time não pode conter mais que 6 pokemon")
    }
}