import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import {
  confirmSignIn,
  confirmSignUp,
  fetchUserAttributes,
  signIn,
  signOut,
  signUp,
} from "@aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";

import "./App.css";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [nextStep, setNextStep] = useState("");
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  const clickSignOut = async () => {
    await signOut();
  };

  const updateAuthSession = async (authStatus: string) => {
    if (authStatus === "authenticated") {
      // NOTE: useAuthenticatorを使うと状態が変化しても自動的に反映してくれない
      const userAttributes = await fetchUserAttributes();
      setUsername(userAttributes.sub ?? "無し");
      setUserEmail(userAttributes.email ?? "無し");
    }
  };

  useEffect(() => {
    updateAuthSession(authStatus);
  }, [authStatus]);

  const clickLogin = async () => {
    const result = await signIn({
      username: email,
      password: password,
      options: {
        authFlowType: "CUSTOM_WITH_SRP",
      },
    });
    setNextStep(JSON.stringify(result.nextStep));
  };
  const clickSignup = async () => {
    await signUp({
      username: email,
      password: password,
    });
  };
  const clickConfirm = async () => {
    await confirmSignUp({
      username: email,
      confirmationCode: code,
    });
  };
  const clickConfirmLogin = async () => {
    await confirmSignIn({
      challengeResponse: code,
    });
  };

  return authStatus === "authenticated" ? (
    <>
      <h1>ユーザー画面</h1>
      <div>
        <div>
          <div>
            <b>username</b>
          </div>
          <div>{username}</div>
        </div>
        <div>
          <div>
            <b>email</b>
          </div>
          <div>{userEmail}</div>
        </div>
        <div>
          <div>
            <b>nextStep</b>
          </div>
          <div>{nextStep}</div>
        </div>
      </div>
      <button onClick={clickSignOut}>ログアウトする</button>
    </>
  ) : (
    <>
      <div>
        <h1>ログインする</h1>
        <form>
          <label>
            メールアドレス
            <input
              type="text"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            パスワード
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="button" onClick={clickLogin}>
            ログイン
          </button>
          <button type="button" onClick={clickSignup}>
            新規作成
          </button>
        </form>
        <h1>チャレンジする</h1>
        <form>
          <label>
            コード
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
          <button type="button" onClick={clickConfirmLogin}>
            ログイン時のコード確認
          </button>
          <button type="button" onClick={clickConfirm}>
            作成時のコード確認
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
