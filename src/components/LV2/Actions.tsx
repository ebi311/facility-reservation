import React from 'react';
import { Button } from '@material-ui/core';
import styled from 'styled-components';

const Row = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

type PropsType = {
  className?: string;
};

const ActionsRow: React.FC<PropsType> = props => {
  return (
    <Row className={props.className}>
      <Button variant="contained" color="primary">
        設備の登録
      </Button>
    </Row>
  );
};

export default ActionsRow;
