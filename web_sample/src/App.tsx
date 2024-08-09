import "./App.css";
import User from "./User";
import SignIn from "./SignIn";
import { useAuthenticator } from "@aws-amplify/ui-react";

function App() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  return authStatus === "authenticated" ? <User /> : <SignIn />;
}

export default App;
