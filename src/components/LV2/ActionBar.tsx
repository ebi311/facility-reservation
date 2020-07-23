import { Button, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import React from 'react';
import styled from 'styled-components';

type PropsType = {
  onSave: () => void;
  onDelete: () => void;
  showDelete: boolean;
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

const dangerTheme = createMuiTheme({ palette: { primary: red } });

const ActionBar: React.FC<PropsType> = props => {
  return (
    <Actions>
      <ActionLeft>
        {props.showDelete ? (
          <MuiThemeProvider theme={dangerTheme}>
            <Button
              startIcon={<DeleteIcon />}
              color="primary"
              onClick={props.onDelete}
            >
              削除
            </Button>
          </MuiThemeProvider>
        ) : null}
      </ActionLeft>
      <ActionRight>
        <Button
          startIcon={<SaveIcon />}
          variant="contained"
          color="primary"
          onClick={props.onSave}
        >
          保存
        </Button>
      </ActionRight>
    </Actions>
  );
};

export default ActionBar;
