import {
  indigo,
  lightBlue,
  lightGreen,
  orange,
  purple,
  red,
  teal,
  yellow,
} from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import dayjs, { Dayjs } from 'dayjs';
import React, {
  createContext,
  Dispatch,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { getFacilities } from '../controllers/facilityController';
import { getReservations } from '../controllers/reservationController';
import { IFacility } from '../models/IFacility';
import { IReservation } from '../models/IReservation';
import { FacilityLane } from './FacilityLane';
import { ReservationListHeader } from './ReservationListHeader';

const useStyles = makeStyles((theme) => ({
  lane: {
    border: `1px solid ${theme.palette.divider}`,
    borderBottom: 'none',
    display: 'flex',
    height: '40px',
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    '&:last-child': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    '& .laneHeader': {
      borderRight: `1px solid ${theme.palette.divider}`,
      width: '100px',
      boxSizing: 'border-box',
      flexGrow: 0,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem',
    },
    '& .timeCell': {
      borderRight: `1px solid ${theme.palette.divider}`,
      flexGrow: 1,
      flexBasis: 0,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      '&:last-child': {
        borderRight: 'none',
      },
    },
  },
}));

const colors = [
  red[500],
  purple[500],
  indigo[500],
  lightBlue[500],
  teal[500],
  lightGreen[500],
  yellow[500],
  orange[500],
];

const getColor = (n: number) => {
  const index = n % 8;
  return colors[index];
};

type ActionType = 'ChangeDate' | 'NextDay' | 'PrevDay';

export type Action = {
  type: ActionType;
  payload?: Dayjs;
};

export type StateType = {
  currentDate: Dayjs;
};

export const reducerProcesses: {
  [type in ActionType]: (s: StateType, a: Action) => StateType;
} = {
  ChangeDate: (s, a) => {
    return a.payload ? { ...s, currentDate: a.payload } : s;
  },
  NextDay: (s) => ({ ...s, currentDate: s.currentDate.add(1, 'day') }),
  PrevDay: (s) => ({ ...s, currentDate: s.currentDate.add(-1, 'day') }),
};

const reducer: Reducer<StateType, Action> = (state, action) => {
  return reducerProcesses[action.type](state, action);
};

type ContextType = {
  currentDate: Dayjs;
  dispatch: Dispatch<Action>;
};

export const CurrentDateContext = createContext<ContextType>({} as ContextType);

export const ReservationList: React.FC = () => {
  const styles = useStyles();
  // Context の設定
  const [state, dispatch] = useReducer(reducer, { currentDate: dayjs() });
  // 設備の一覧
  const [facilities, setFacilities] = useState<IFacility[]>([]);
  // 予約の一覧
  const [reservations, setReservations] = useState<IReservation[]>([]);
  // 初期と日付変更時の設備と予約の読み込み
  useEffect(() => {
    getFacilities()
      .then((result) => {
        setFacilities(result);
        return getReservations(state.currentDate);
      })
      .then((result) => {
        setReservations(result);
      });
  }, [state.currentDate]);
  // セル幅の取得
  const cell = useRef<HTMLDivElement>(null);
  // 初期及びブラウザサイズ変更時に、セルの幅を取得し、保持する
  const [cellWidth, setCellWidth] = useState<number>(0);
  const onResize = useCallback(() => {
    if (!cell?.current) return;
    setCellWidth(cell.current.getBoundingClientRect().width);
  }, [cell]);
  useEffect(() => onResize(), [cell, onResize]);
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      // 画面を離れる時に イベントハンドラを削除する
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);
  const headerCells = useMemo(() => {
    const cells: JSX.Element[] = [];
    cells.push(
      <div key={8} ref={cell} className="timeCell">
        8
      </div>,
    );
    for (let i = 9; i <= 19; i++) {
      cells.push(
        <div key={i} className="timeCell">
          {i}
        </div>,
      );
    }
    return cells;
  }, []);
  const lanes = useMemo(() => {
    return facilities.map((facility, index) => {
      const reservationList = reservations.filter(
        (r) => r.facilityId === facility.id,
      );
      return (
        <FacilityLane
          key={facility.id}
          cellWidth={cellWidth}
          facility={facility}
          reservations={reservationList}
          className={styles.lane}
          backgroundColor={getColor(index)}
          date={state.currentDate}
        />
      );
    });
  }, [facilities, reservations, cellWidth, styles.lane, state.currentDate]);
  return (
    <div>
      <CurrentDateContext.Provider
        value={{ currentDate: state.currentDate, dispatch }}
      >
        <ReservationListHeader />
        <div>
          <div className={styles.lane}>
            <div className="laneHeader"></div>
            {headerCells}
          </div>
          {lanes}
        </div>
      </CurrentDateContext.Provider>
    </div>
  );
};
