import moment from 'moment';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import MoveDay from '../Lv1/MoveDayLink';

const DyaRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: baseline;
`;

const PrevDay = styled.div`
  margin-right: 1em;
`;

const Day = styled.div`
  font-size: 200%;
`;

const AfterDay = styled.div`
  margin-left: 1em;
`;

const WeekDay = styled.div`
  text-align: center;
`;

type PropsType = {
  date: Date;
};

const DayHeader: React.FC<PropsType> = props => {
  const [dateString, weekday] = useMemo(() => {
    const m = moment(props.date);
    return [m.format('YYYY-MM-DD'), m.format('dddd')];
  }, [props.date]);

  return (
    <DyaRow>
      <PrevDay>
        <MoveDay direction="前" />
      </PrevDay>
      <div>
        <Day>{dateString}</Day>
        <WeekDay>{weekday}</WeekDay>
      </div>
      <AfterDay>
        <MoveDay direction="後" />
      </AfterDay>
    </DyaRow>
  );
};

export default DayHeader;
