import { reducerWithInitialState } from 'typescript-fsa-reducers';
import ITaskListPage from '../status/IReservationListPage';

const init: ITaskListPage = {
  loading: false,
  reservationList: [],
};

const taskListReducer = reducerWithInitialState<ITaskListPage>(init).build();

export default taskListReducer;
