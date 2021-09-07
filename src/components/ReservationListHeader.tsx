import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { DoubleArrow } from '@material-ui/icons';
import { DatePicker } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import React, { useCallback, useContext } from 'react';
import { CurrentDateContext } from './ReservationList';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startIcon: {
    transform: 'rotate(180deg)',
  },
  date: {
    '& input': { fontSize: '2rem', margin: 0, textAlign: 'center' },
  },
  weekday: {
    margin: 0,
    textAlign: 'center',
  },
  actions: {
    textAlign: 'right',
    position: 'relative',
    top: '-2em',
    marginBottom: '-1.5em',
  },
}));

export const ReservationListHeader: React.FC = () => {
  const styles = useStyles();
  const { currentDate, dispatch } = useContext(CurrentDateContext);
  const changeDate = useCallback(
    (date: MaterialUiPickersDate) => {
      if (!date) return;
      dispatch({ payload: date, type: 'ChangeDate' });
    },
    [dispatch],
  );
  const prevDate = useCallback(() => {
    dispatch({ type: 'PrevDay' });
  }, []);
  const nextDate = useCallback(() => {
    dispatch({ type: 'NextDay' });
  }, []);
  return (
    <div>
      <div className={styles.header}>
        <div>
          <Button
            startIcon={<DoubleArrow className={styles.startIcon} />}
            onClick={prevDate}
          >
            1日前
          </Button>
        </div>
        <div>
          <DatePicker
            value={currentDate}
            className={styles.date}
            format="YYYY-MM-DD"
            onChange={changeDate}
          />
          <p className={styles.weekday}>{currentDate.format('dddd')}</p>
        </div>
        <div>
          <Button endIcon={<DoubleArrow />} onClick={nextDate}>
            1日後
          </Button>
        </div>
      </div>
      <div className={styles.actions}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/facility/"
        >
          設備の登録
        </Button>
      </div>
    </div>
  );
};
