import { IconButton } from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import React from 'react';
import styled from 'styled-components';

type PropsType = {
  onCloseClick: () => void;
};

const Container = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const FormHeader: React.FC<PropsType> = props => {
  return (
    <Container>
      <IconButton onClick={props.onCloseClick}>
        <Close />
      </IconButton>
    </Container>
  );
};

export default FormHeader;
