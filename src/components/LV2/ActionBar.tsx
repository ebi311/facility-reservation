import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import React from 'react';
import styled from 'styled-components';

type PropsType = {
  onSave: () => void;
  onDelete: () => void;
};

const Actions = styled.div`
  display: flex;
  flex-direction: row;
`;

const ActionLeft = styled.div`
  flex-grow: 1;
`;

const ActionRight = styled.div`
  flex-grow: 0;
`;

const ActionBar: React.FC<PropsType> = props => {
  return (
    <Actions>
      <ActionLeft>
        <Button
          startIcon={<DeleteIcon />}
          color="secondary"
          onClick={props.onDelete}
        >
          削除
        </Button>
      </ActionLeft>
      <ActionRight>
        <Button
          startIcon={<SaveIcon />}
          variant="contained"
          color="primary"
          onClick={() => {
            alert('保存');
          }}
        >
          保存
        </Button>
      </ActionRight>
    </Actions>
  );
};

export default ActionBar;
