import { useState } from "react";
import styled from "styled-components";
import { AuthError, confirmSignIn } from "@aws-amplify/auth";

function Code() {
  const [code, setCode] = useState("");

  const clickConfirmLogin = async () => {
    try {
      confirmSignIn({
        challengeResponse: code,
      });
    } catch (e) {
      if (e instanceof AuthError) {
        alert(e.message);
      }
    }
  };

  return (
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
  );
}

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

export default Code;
