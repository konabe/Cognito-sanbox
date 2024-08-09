import { useState } from "react";
import { signIn, signUp } from "@aws-amplify/auth";

import styled from "styled-components";
import aImage from "./assets/images/A.jpg";
import bImage from "./assets/images/B.jpg";
import cImage from "./assets/images/C.jpg";
import dImage from "./assets/images/D.jpg";

function IPass({ onClick }: { onClick: (result: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const clickLogin = async () => {
    const result = await signIn({
      username: email,
      password: password,
      options: {
        authFlowType: "CUSTOM_WITH_SRP",
      },
    });
    onClick(
      result.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE"
    );
  };
  const clickSignup = async () => {
    await signUp({
      username: email,
      password: password,
    });
  };
  return (
    <LoginContainer>
      <LoginBackground>
        <LoginBackgroundImage src={aImage} />
        <LoginBackgroundImage src={bImage} />
        <LoginBackgroundImage src={cImage} />
        <LoginBackgroundImage src={dImage} />
      </LoginBackground>
      <LoginContents>
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
      </LoginContents>
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
    </LoginContainer>
  );
}

export default IPass;

const LoginContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  z-index: 20;
`;

const LoginContents = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  z-index: 50;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoginBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 10;

  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const LoginBackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: fill;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
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
