import routes from "../routes/routes";

const getHash = () => {
  const hash = location.hash.slice(1).toLowerCase();
  
  const isCharacter = hash.startsWith("/character");

  if (isCharacter) {
    const characterId = hash.split("/")[2] || "/";
    return characterId;
  }

  const route = routes.find((route) => route.path === hash);
  if (route) {
    return hash;
  }

  return "/";
};


export default getHash;
