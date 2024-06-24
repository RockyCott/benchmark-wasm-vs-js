import axios from "axios";

const API = "https://rickandmortyapi.com/api/character/";

const getData = async (id) => {
  const apiURL = id ? `${API}${id}` : API;
  try {
    const response = await axios.get(apiURL);
    return response.data;
  } catch (error) {
    console.error("Fetch Error", error);
  }
};

export default getData;