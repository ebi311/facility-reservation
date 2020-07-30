import { Button } from '@material-ui/core';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { requireAuth } from '../../requireAuth';
import firebase from 'firebase';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-items: center;
`;

const Login: React.FC = () => {
  const onGoogleAuthClick = useCallback(e => {
    requireAuth();
  }, []);
  return (
    <Container>
      <div>
        <Button variant="outlined" onClick={onGoogleAuthClick}>
          Google でログインする
        </Button>
        <Button
          onClick={() => {
            firebase
              .functions()
              .httpsCallable('/fn/api/reservations/?date=2020-08-01');
          }}
        >
          テスト
        </Button>
      </div>
    </Container>
  );
};

export default Login;
