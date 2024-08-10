import { useState } from "react";
import styled from "styled-components";
import { AuthError, signIn, signUp } from "@aws-amplify/auth";

import topLeftImage from "./assets/images/A.jpg";
import topRightImage from "./assets/images/B.jpg";
import bottomLeftImage from "./assets/images/C.jpg";
import bottomRightImage from "./assets/images/D.jpg";

function IPass({ onClickLogin }: { onClickLogin: (result: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const clickLogin = async () => {
    try {
      const result = await signIn({
        username: email,
        password,
        options: {
          authFlowType: "CUSTOM_WITH_SRP",
        },
      });
      const isSuccessful =
        result.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE";
      // TODO: 一発で通るユーザーもいるのでその制御が必要。
      onClickLogin(isSuccessful);
    } catch (e) {
      if (e instanceof AuthError) {
        alert(e.message);
      }
    }
  };
  const clickSignup = async () => {
    await signUp({
      username: email,
      password,
    });
  };
  return (
    <LoginFrame>
      <BackgroundLayer>
        <BackgroundImage src={topLeftImage} />
        <BackgroundImage src={topRightImage} />
        <BackgroundImage src={bottomLeftImage} />
        <BackgroundImage src={bottomRightImage} />
      </BackgroundLayer>
      <ContentsLayer>
        <LoginForm>
          <MailLabelContainer>
            <MailLabel>mail</MailLabel>
          </MailLabelContainer>
          <MailInput
            type="text"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PassLabelContainer>
            <PassLabel>password</PassLabel>
          </PassLabelContainer>
        </LoginForm>
      </ContentsLayer>
      <SubmitButtonContainer>
        <SubmitButton type="button" onClick={clickLogin}>
          送信
        </SubmitButton>
      </SubmitButtonContainer>
      <SwitchContainer>
        <SwitchButton type="button" onClick={clickLogin}>
          ろぐいん
        </SwitchButton>
        <SwitchButton type="button" onClick={clickSignup}>
          新規作成
        </SwitchButton>
      </SwitchContainer>
    </LoginFrame>
  );
}

export default IPass;

const LoginFrame = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const BackgroundLayer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 0;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const BackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  max-height: 50vh; // object-fit=fillの場合、これで押さえつけないと上段の画像が勝手に大きくなってしまう。
  object-fit: fill;
`;

const ContentsLayer = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoginForm = styled.form`
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
`;

const MailInput = styled.input`
  width: 100%;
  height: 50px;
  background-color: rgba(255, 255, 255, 0);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-bottom: none;
`;

const MailLabelContainer = styled.div`
  display: flex;
  justify-content: start;
  width: 100%;
`;

const MailLabel = styled.label`
  color: rgba(255, 255, 255, 0.2);
  font-size: 36px;
  font-family: NagomiGokubosoGothic;
`;

const PasswordInput = styled.input`
  width: 100%;
  height: 50px;
  background-color: rgba(255, 255, 255, 0);
  border: 2px solid rgba(255, 255, 255, 0.2);
`;

const PassLabel = styled.label`
  color: #176d77;
  font-size: 36px;
  font-family: NagomiGokubosoGothic;
`;

const PassLabelContainer = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
`;

const SubmitButtonContainer = styled.div`
  position: absolute;
  top: calc(100% / 2 + 50px);
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 60;
`;

const SubmitButton = styled.button`
  width: fit-content;
  height: 50px;
  color: #1d8f9c;
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
  font-size: 24px;
`;

const SwitchContainer = styled.div`
  position: absolute;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 40;
`;

const SwitchButton = styled.button`
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 80px;
  background-color: rgba(255, 255, 255, 0);
`;
