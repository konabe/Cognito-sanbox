import { Amplify } from "aws-amplify";

import "./App.css";
import User from "./User";
import SignIn from "./SignIn";
import { useAuthenticator } from "@aws-amplify/ui-react";

// ref. https://docs.amplify.aws/react/build-a-backend/auth/use-existing-cognito-resources/#use-auth-resources-without-an-amplify-backend
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
      identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID,
    },
  },
});

function App() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  return authStatus === "authenticated" ? <User /> : <SignIn />;
}

export default App;
