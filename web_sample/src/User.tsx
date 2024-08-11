import {
  fetchUserAttributes,
  fetchAuthSession,
  signOut,
} from "@aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import axios from "axios";

function User() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  const [idToken, setIDToken] = useState("");
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [lastLoginedAt, setLastLoginedAt] = useState("");
  const [enabledMFA, setEnabledMFA] = useState(false);

  const lastLoginedAtText = () => {
    if (lastLoginedAt === "無し") {
      return "無し";
    }
    return new Date(Number(lastLoginedAt) * 1000).toLocaleString();
  };

  useEffect(() => {
    updateAuthSession(authStatus);
  }, [authStatus]);

  const updateAuthSession = async (authStatus: string) => {
    if (authStatus === "authenticated") {
      // NOTE: useAuthenticatorを使うと状態が変化しても自動的に反映してくれない
      const userAttributes = await fetchUserAttributes();
      const authSession = await fetchAuthSession();
      setIDToken(authSession.tokens?.idToken?.toString() ?? "");
      setUsername(userAttributes.sub ?? "無し");
      setUserEmail(userAttributes.email ?? "無し");
      setLastLoginedAt(userAttributes["custom:lastLoginAt"] ?? "無し");
      setEnabledMFA(userAttributes["custom:enabledMFA"] === "true");
    }
  };

  const clickSwitchMFA = async () => {
    const BASE_URL =
      "https://csklsugycc.execute-api.ap-northeast-1.amazonaws.com/v1";
    const response = await axios.patch(
      `${BASE_URL}/user`,
      {
        enabledMFA: !enabledMFA,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    if (response.status === 200) {
      setEnabledMFA(response.data.enabledMFA);
    }
  };

  const clickSignOut = async () => {
    await signOut();
  };

  return (
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
            <b>最終ログイン日時</b>
          </div>
          <div>{lastLoginedAtText()}</div>
        </div>
      </div>
      <div>
        <button onClick={clickSwitchMFA}>
          {`二要素認証を${!enabledMFA ? "有効" : "無効"}にする`}
        </button>
      </div>
      <button onClick={clickSignOut}>ログアウトする</button>
    </>
  );
}

export default User;
