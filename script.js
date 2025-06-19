const pokedex = document.getElementById("pokedex");
const campoBusca = document.getElementById("busca");

let todosPokemons = [];

const getPokemons = async () => {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=151`; // 1ª geração
  const res = await fetch(url);
  const data = await res.json();
  const pokemons = data.results;

  const promises = pokemons.map(async (pokemon) => {
    const res = await fetch(pokemon.url);
    return await res.json();
  });

  todosPokemons = await Promise.all(promises);
  mostrarPokemons(todosPokemons);
};

const mostrarPokemons = (lista) => {
  pokedex.innerHTML = "";
  lista.forEach((pokemon) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const tipos = pokemon.types.map((t) => t.type.name).join(", ");

    card.innerHTML = `
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
      <h3>${pokemon.name.toUpperCase()}</h3>
      <p><strong>Tipo:</strong> ${tipos}</p>
    `;

    card.addEventListener("click", () => abrirModal(pokemon));

    pokedex.appendChild(card);
  });
};

function filtrarPokemons() {
  const termo = campoBusca.value.toLowerCase();
  const filtrados = todosPokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(termo)
  );
  mostrarPokemons(filtrados);
}

function abrirModal(pokemon) {
  const modal = document.getElementById("modal");
  const detalhes = document.getElementById("detalhesPokemon");

  const tipos = pokemon.types.map((t) => t.type.name).join(", ");
  const habilidades = pokemon.abilities.map((a) => a.ability.name).join(", ");
  const stats = pokemon.stats
    .map((s) => `<li>${s.stat.name}: ${s.base_stat}</li>`)
    .join("");

  detalhes.innerHTML = `
    <h2>${pokemon.name.toUpperCase()}</h2>
    <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" width="200" />
    <p><strong>Tipo:</strong> ${tipos}</p>
    <p><strong>Habilidades:</strong> ${habilidades}</p>
    <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
    <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
    <h4>Status base</h4>
    <ul style="list-style: none; padding: 0;">${stats}</ul>
  `;

  modal.style.display = "block";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

// Fecha o modal ao clicar fora da área de conteúdo
window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target === modal) {
    fecharModal();
  }
};

getPokemons();

