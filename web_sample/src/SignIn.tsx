import { useState } from "react";
import styled from "styled-components";
import { confirmSignIn } from "@aws-amplify/auth";

import IPass from "./IPass";

function SignIn() {
  const [code, setCode] = useState("");
  const [shouldShowConfirm, setShouldShowConfirm] = useState(false);

  const clickConfirmLogin = async () => {
    confirmSignIn({
      challengeResponse: code,
    });
  };

  return (
    <SigninContainer>
      {!shouldShowConfirm ? (
        <IPass onClick={setShouldShowConfirm} />
      ) : (
        <ChallengeContainer>
          <ChallengeTitleContainer>
            <ChallengeTitle className="challenge-title">
              ちゃれんじする
            </ChallengeTitle>
          </ChallengeTitleContainer>
          <ChallengeInput
            className="challenge-input"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <ChallengeButton
            className="challenge-button"
            type="button"
            onClick={clickConfirmLogin}
          >
            ログイン時のコード確認
          </ChallengeButton>
        </ChallengeContainer>
      )}
    </SigninContainer>
  );
}

export default SignIn;

const SigninContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ChallengeContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #074df7;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ChallengeTitleContainer = styled.div`
  width: 100%;
`;

const ChallengeTitle = styled.h1`
  font-size: 120px;
  text-align: center;
  text-align: justify;
  text-align-last: justify;
  text-justify: inter-character;
  font-family: NRMJ_Sakon;
`;

const ChallengeInput = styled.input`
  width: 80%;
  height: 100px;
  font-size: 60px;
  text-align: center;
  color: #1eb1fa;
  background-color: rgba(1, 1, 1, 0);
  border: 1px solid #1eb1fa;
`;

const ChallengeButton = styled.button`
  width: 80%;
  height: 100px;
  font-size: 40px;
  font-family: NagomiGokubosoGothic;
  color: #1eb1fa;
  background-color: rgba(1, 1, 1, 0);
  border: none;
`;
