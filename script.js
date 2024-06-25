// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2404-FTB-MT-WEB-PT";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

const state = {
  players: [],
  player:null,
};

const addForm = document.querySelector("#new-player-form");
// or pull it from main
const playerContainer = document.getElementsByTagName("main")[0];
/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    // TODO
    const response = await fetch(API_URL);
    const result = await response.json();
    console.log('Fetched players:', result);
    const data = result.data;
    const players = data.players;

    // saving to state to use later
    // state.players = players;
    // returning to use as a variable later
    return players;

  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    // TODO
    const response = await fetch(`${API_URL}/${playerId}`);
    const result = await response.json();
    const data = result.data;
    const player = data.player;
    console.log(result, "fetched a single player", data);

    // saving to state to use later
    // state.player = player;
    // returning to use as a variable later
    return player;

  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    // TODO
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {'Content-Type': 'application/json'  
      },
      body:JSON.stringify(playerObj)
    });
    const result = await response.json();
    // state.artists.push(response.data);
    console.log("New player added:", result);

    const players = await fetchAllPlayers();
    renderAllPlayers(players);

  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    // TODO
    const response = await fetch(`${API_URL}/${playerId}`, {
      method: "DELETE"
    }); 
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  // TODO
  console.log("in render function, from parameters", playerList)
  console.log("in render function, from state", state.players)
  // creating an empty array for all of our holders
  const holders = [];

  for (let i = 0; i < playerList.length; i++) {
    const playerHolder = document.createElement("div");

    const namePlayer = document.createElement("h2");
    const imgPlayer = document.createElement("img");
    const viewButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    viewButton.textContent = "Player Details";
    deleteButton.textContent = "Remove Player";
    namePlayer.textContent = playerList[i].name;
    imgPlayer.setAttribute("src", playerList[i].imageUrl)
    imgPlayer.setAttribute("alt", "This is a picture of " + playerList[i].name);
    
    viewButton.addEventListener("click",async () => {
      console.log(playerList[i].id)
      const singlePuppy = await fetchSinglePlayer(playerList[i].id);
      console.log(singlePuppy)
      renderSinglePlayer(singlePuppy);

    });
    deleteButton.addEventListener("click", async () => {
      removePlayer(playerList[i].id);
    })
  playerHolder.append(namePlayer, imgPlayer, viewButton, deleteButton);
  holders.push(playerHolder);
  };
  playerContainer.replaceChildren(...holders);
};
/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (singlePuppy) => {
  // TODO
      const popUpHolder = document.createElement("div");
      popUpHolder.setAttribute("id", "popUp")
      const singleHolder = document.createElement("div");
      popUpHolder.append(singleHolder);
      singleHolder.setAttribute("id", "singleHolder");
      console.log(singlePuppy)
      const singleName = document.createElement("h2");
      const singleBreed = document.createElement("p");
      const singleStatus = document.createElement("p");
      const singleDescrip = document.createElement("p");
      const singleImg = document.createElement("img");
      const removeButton = document.createElement("button");
      removeButton.textContent = "remove";
      removeButton.addEventListener("click", () => {
        popUpHolder.remove()
      });
    
      singleName.textContent = singlePuppy.name;
      singleBreed.textContent = singlePuppy.breed;
      singleStatus.textContent = singlePuppy.status;
      singleImg.setAttribute("src", singlePuppy.imageUrl);
      singleImg.setAttribute("alt", "This is a picture of " + singlePuppy.name);
      singleDescrip.textContent = singlePuppy.description;
      
      singleHolder.append(singleName, singleBreed, singleStatus, singleImg, singleDescrip, removeButton);
      const body = document.getElementsByTagName("body") [0];
      body.append(popUpHolder);
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    // TODO
    const form = document.createElement("form");

    const nameLabel = document.createElement("label");
    const nameInput = document.createElement("input");
    const breedLabel = document.createElement("label");
    const breedInput = document.createElement("input");
    const imgLabel = document.createElement("label");
    const imgInput = document.createElement("input");
    const submitButton = document.createElement("button");

    nameLabel.textContent = "Name:";
    breedLabel.textContent = "Breed:";
    imgLabel.textContent = "Image:";
    submitButton.textContent = "Submit";

    submitButton.addEventListener("click", (event) => {
      event.preventDefault();

      addNewPlayer({name: nameInput.value, breed: breedInput.value, img: imgInput});
    });

    form.append(nameLabel, nameInput, breedLabel, breedInput, imgLabel, imgInput ,submitButton);
    addForm.append(form);

  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
