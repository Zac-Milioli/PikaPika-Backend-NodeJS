import React, { useState, useEffect } from 'react';
import './App.css';

const url = "http://localhost:3300";

function App() {
  const [pokemonInput, setPokemonInput] = useState('pikachu'); // Variavel para o input do Pokemon
  const [pokemonData, setPokemonData] = useState(null); // Variavel para os dados do Pokemon
  const [team, setTeam] = useState([]); // Variavel para o time

  useEffect(() => {
    getTeam();
  }, []);

  const getTeam = async () => {
    try {
      const response = await fetch(`${url}/team`, {
        method: 'GET',
      });
      const result = await response.json();
      setTeam(result); // Atualiza o time
    } catch (error) {
      console.error('Error fetching team:', error.message);
    }
  };

  const getPokemon = async (pokemon) => {
    pokemon = pokemon.toLowerCase();
    try {
      const response = await fetch(`${url}/api/${pokemon}`, {
        method: 'GET',
      });
      const result = await response.json();
      setPokemonData({
        name: result.pokemonNome,
        id: result.pokemonPokedex,
        image: result.pokemonImg,
        cardImage: result.cardImg,
        types: result.pokemonTipo,
      }); // Atualiza os dados do Pokemon selecionado
      setPokemonInput(''); // Limpa o campo de entrada
    } catch (error) {
      console.error('Error fetching pokemon:', error.message);
    }
  };

  const postPokemon = async () => {
    // Caso o pokemon não foi preenchido
    if (!pokemonData) {
      alert("Digite o Nome ou Numero da Pokedex do pokemon");
      return;
    }

    // Caso já tenham 6 pokemons no time
    if (team.length >= 6) {
      alert("O time não pode conter mais que 6 pokémon");
      return;
    }

    try {
      const response = await fetch(`${url}/api/${pokemonData.name.toLowerCase()}`, {
        method: 'POST',
      });
      await getTeam(); // Atualiza o time
    } catch (error) {
      console.error('Error adding pokemon:', error.message);
    }
  };

  const deletePokemon = async (pokemon) => {
    try {
      const response = await fetch(`${url}/team/${pokemon}`, {
        method: 'DELETE',
      });
      await getTeam(); // Atualiza o time
    } catch (error) {
      console.error('Error deleting pokemon:', error.message);
    }
  };

  return (
    <div className="App p-3" onload="getTeam(), getPokemon(document.getElementById('pokemonInput').value)">
      <header className="container caixa">
        <h1>Pika Pika</h1>
      </header>
      <main className="container p-5">
        <h4>Seu Time Pokemon:</h4>
        <div id="pokeTeam" className="pokeTeam">
          {team.map((poke, index) => (
            <a href="#" key={index} onClick={() => deletePokemon(poke.nome)}>
              <img
                src={poke.img}
                alt={`foto ${poke.nome}`}
                id={poke.nome}
                title={poke.nome}
                height="60"
              />
            </a>
          ))}
        </div>

        <h4 className='mt-2'>Buscar Pokemon:</h4>
        <div className="container row">
          <div className="col-10">
            <input
              type="text"
              id="pokemonInput"
              className="form-control"
              placeholder="Digite o Nome do Pokemon ou Número da Pokedex:"
              value={pokemonInput}
              onChange={(e) => setPokemonInput(e.target.value)}
            />
          </div>
          <button className="col btn btn-warning" onClick={() => getPokemon(pokemonInput)}>
            Buscar
          </button>
        </div>

        {pokemonData && (
          <div id="pokemonSearched" className="container mx-auto pokemonSearched mt-5">
            <img
              id="pokemonImage"
              className="mx-auto"
              src={pokemonData.image}
              alt={pokemonData.name}
              height="300px"
            />
            <img
              id="cardImage"
              className="mx-auto"
              src={pokemonData.cardImage}
              alt={pokemonData.name}
              height="300px"
            />
            <div className="pokemonInfo align-self-center mx-auto">
              <p>
                <strong>Número da Pokedex: </strong>
                <span id="pokedexNumber">{pokemonData.id}</span>
              </p>
              <p>
                <strong>Nome do Pokemon: </strong>
                <span id="pokemonName">{pokemonData.name}</span>
              </p>
              <div className="d-flex">
                <strong>Tipagens: </strong>
                <div id="pokemonTypes" className="types d-flex justify-content-between">
                  {pokemonData.types.map((type, index) => (
                    <div key={index} className={`ms-1 ${type}`}>
                      {type}
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary" onClick={postPokemon}>
                Adicionar
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
