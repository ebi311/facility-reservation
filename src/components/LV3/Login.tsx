import { Button } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-items: center;
`;

const Login: React.FC = () => {
  return (
    <Container>
      <div>
        <Button variant="outlined">Google でログインする</Button>
      </div>
    </Container>
  );
};

export default Login;
