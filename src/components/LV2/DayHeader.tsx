import { DatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import dayjs from 'dayjs';
import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import MoveDay from '../Lv1/MoveDayLink';

const DyaRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const PrevDay = styled.div`
  margin-right: 1em;
`;

const AfterDay = styled.div`
  margin-left: 1em;
`;

const Date = styled(DatePicker)`
  width: 15em;
  & input {
    font-size: 200%;
    text-align: center;
    cursor: pointer;
  }
`;

const WeekDay = styled.div`
  text-align: center;
`;

type PropsType = {
  date: Date;
};

const DayHeader: React.FC<PropsType> = props => {
  const [date, weekday, nextDay, prevDay] = useMemo(() => {
    const ret = [];
    const m = dayjs(props.date);
    const fm = dayjs(props.date);
    ret.push(m);
    ret.push(m.format('dddd'));
    ret.push(fm.add(1, 'day').format('YYYY-MM-DD'));
    ret.push(fm.add(-1, 'day').format('YYYY-MM-DD'));
    return ret;
  }, [props.date]);

  const history = useHistory();
  const onDayChange = useCallback(
    (value: MaterialUiPickersDate) => {
      if (!value) return;
      history.push('./?date=' + value.format('YYYY-MM-DD'));
    },
    [history],
  );
  return (
    <DyaRow>
      <PrevDay>
        <MoveDay direction="前" to={'./?date=' + prevDay} />
      </PrevDay>
      <div>
        <Date onChange={onDayChange} format="YYYY-MM-DD" value={date} />
        <WeekDay>{weekday}</WeekDay>
      </div>
      <AfterDay>
        <MoveDay direction="後" to={'./?date=' + nextDay} />
      </AfterDay>
    </DyaRow>
  );
};

export default DayHeader;
