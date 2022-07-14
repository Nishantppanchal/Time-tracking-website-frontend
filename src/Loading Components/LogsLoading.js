import { CssBaseline } from "@mui/material";
import Header from "../Components/Header";
import LogListerLoading from "./LogListerLoading";

function LogsLoading() {
  return (
    <div>
      <CssBaseline />
      <Header page='logs' />
      <LogListerLoading />
    </div>
  );
}

export default LogsLoading;