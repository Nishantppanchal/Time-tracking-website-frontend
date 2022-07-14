// Import redux component
import store from "../Store";

function getTheme() {
  const state = store.getState();
  const themeStr = state.theme.value;
  const theme = JSON.parse(themeStr)
  return theme
}

export default getTheme;
