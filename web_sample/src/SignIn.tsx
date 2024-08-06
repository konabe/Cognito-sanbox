import { useState } from "react";
import {
  confirmSignIn,
  confirmSignUp,
  signIn,
  signUp,
} from "@aws-amplify/auth";

import "./SignIn.css";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [code, setCode] = useState("");
  const [shouldShowConfirm, setShouldShowConfirm] = useState(false);

  const clickLogin = async () => {
    const result = await signIn({
      username: email,
      password: password,
      options: {
        authFlowType: "CUSTOM_WITH_SRP",
      },
    });
    setShouldShowConfirm(
      result.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE"
    );
  };
  const clickConfirmLogin = async () => {
    confirmSignIn({
      challengeResponse: code,
    });
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

  return (
    <div className="signin-container">
      {!shouldShowConfirm ? (
        <div className="login-container">
          <h1>ログインする</h1>
          <form className="login-form">
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
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default SignIn;
