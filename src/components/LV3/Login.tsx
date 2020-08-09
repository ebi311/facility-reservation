import { Button } from '@material-ui/core';
import React, { useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { auth } from '../../auth';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Login: React.FC<RouteComponentProps> = props => {
  const onGoogleAuthClick = useCallback(() => {
    auth().then(() => window.location.reload());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.history, window.location]);
  return (
    <Container>
      <Button variant="outlined" onClick={onGoogleAuthClick}>
        Google でログインする
      </Button>
    </Container>
  );
};

export default Login;
