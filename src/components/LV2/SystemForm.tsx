import InputLabel from '@material-ui/core/InputLabel';
import React from 'react';
import styled from 'styled-components';
import ISystem from '../../status/ISystem';
import UserBadge from '../Lv1/UserBadge';

const Paragraph = styled.div`
  padding-top: 1em;
`;

const RowParagraph = styled.div`
  display: flex;
`;

const UserBadgeBox = styled(UserBadge)`
  margin-top: 1em;
`;

const SystemForm: React.FC<ISystem> = props => {
  if (props.createDate.unix() === 0) return null;
  return (
    <>
      <RowParagraph>
        <Paragraph>
          <InputLabel>作成者</InputLabel>
          <UserBadgeBox {...props.createUser} />
        </Paragraph>
        <Paragraph>
          <InputLabel>作成日時</InputLabel>
          <p>{props.createDate.format('YYYY-MM-DD HH:mm')}</p>
        </Paragraph>
      </RowParagraph>
      <RowParagraph>
        <Paragraph>
          <InputLabel>更新者</InputLabel>
          <UserBadgeBox {...props.lastUpdateUser} />
        </Paragraph>
        <Paragraph>
          <InputLabel>更新日時</InputLabel>
          <p>{props.lastUpdate.format('YYYY-MM-DD HH:mm')}</p>
        </Paragraph>
      </RowParagraph>
    </>
  );
};

export default SystemForm;
