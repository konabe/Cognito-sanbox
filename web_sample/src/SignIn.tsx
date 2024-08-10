import { useState } from "react";
import styled from "styled-components";

import IPass from "./IPass";
import Code from "./Code";

function SignIn() {
  const [shouldShowConfirm, setShouldShowConfirm] = useState(false);

  return (
    <SigninContainer>
      {shouldShowConfirm ? (
        <Code />
      ) : (
        <IPass onClickLogin={setShouldShowConfirm} />
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
  height: 100vh;
`;
