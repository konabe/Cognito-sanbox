import { fetchUserAttributes, signOut } from "@aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";

function User() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [lastLoginedAt, setLastLoginedAt] = useState("");
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
      console.log(userAttributes);
      setUsername(userAttributes.sub ?? "無し");
      setUserEmail(userAttributes.email ?? "無し");
      setLastLoginedAt(userAttributes["custom:lastLoginAt"] ?? "無し");
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
      <button onClick={clickSignOut}>ログアウトする</button>
    </>
  );
}

export default User;
