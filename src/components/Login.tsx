import Button from '@material-ui/core/Button';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { auth } from '../auth';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Login: React.FC = () => {
  const onGoogleAuthClick = useCallback(() => {
    auth().then(() => window.location.reload());
  }, []);
  return (
    <Container>
      <Button variant="outlined" onClick={onGoogleAuthClick}>
        Google でログインする
      </Button>
    </Container>
  );
};
