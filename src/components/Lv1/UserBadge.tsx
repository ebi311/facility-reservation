import Avatar from '@material-ui/core/Avatar';
import Face from '@material-ui/icons/Face';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import IUser from '../../status/IUser';
import { theme } from '../globalStyle';

const Container = styled.div`
  border-radius: 0.8em;
  height: 1.6em;
  background-color: ${theme.palette.secondary.light};
  display: flex;
  align-items: center;
  width: fit-content;
`;

const Name = styled.div`
  margin: 0 1em;
  font-size: 80%;
`;

type IPropsType = IUser & { className?: string };

const UserBadge: React.FC<IPropsType> = props => {
  const { displayName, faceUrl } = props;
  const avatar = useMemo(() => {
    if (!faceUrl) {
      return (
        <Avatar>
          <Face />
        </Avatar>
      );
    } else {
      return <Avatar src={faceUrl} />;
    }
  }, []);
  return (
    <Container className={props.className}>
      {avatar}
      <Name>{displayName || '(名前無し)'}</Name>
    </Container>
  );
};

export default UserBadge;
