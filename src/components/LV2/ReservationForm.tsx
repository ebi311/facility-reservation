import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import moment, { Moment } from 'moment';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FieldError } from 'react-hook-form/dist/types/form';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Dispatch } from 'redux';
import styled from 'styled-components';
import {
  addReservation,
  deleteReservation,
  updateReservation,
} from '../../actions/reservationDetailActions';
import { isVacant } from '../../controllers/reservationController';
import IFacility from '../../status/IFacility';
import IReservation from '../../status/IReservation';
import ActionBar from './ActionBar';

type PropsType = {
  reservation: IReservation;
  facilities: IFacility[];
};

const DateRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Kara = styled.div`
  margin: 0 1em;
`;

const Paragraph = styled.div`
  padding-top: 1em;
`;

const checkVacant = async (reservation: IReservation) => {
  const { id, startDate, endDate, facilityId } = reservation;
  // 最小時間は15分
  if (endDate.diff(startDate, 'minutes') < 15)
    return '終了日は開始日の15分以降にしてください。';
  // 終了日は、次の日の00:00まで
  const limit = moment(startDate).add(1, 'day').startOf('day');
  if (endDate > limit) return '終了日は日をまたぐことはできません。';
  if (!facilityId) return false;
  const result = await isVacant(startDate, endDate, facilityId, id);
  return result ? true : '日付が重複しています。';
};

const save = async (
  inputData: Partial<IReservation>,
  defaultValue: IReservation,
  dispatch: Dispatch,
) => {
  // react hook form では、フォームに割り当てた項目しか保持しない
  // そのため、プロパティで渡された値(=初期値)とマージする
  const data: IReservation = {
    ...defaultValue,
    ...inputData,
  };
  if (!defaultValue.id) {
    return await addReservation(data, dispatch);
  } else {
    return await updateReservation(data, dispatch);
  }
};

type MomentErrorType = Moment & FieldError;

const ReservationForm: React.FC<PropsType> = props => {
  const { errors, control, reset, getValues, trigger } = useForm<IReservation>({
    defaultValues: props.reservation,
    mode: 'onBlur',
  });
  const dispatch = useDispatch();
  const history = useHistory();
  const startDate = getValues('startDate') as Moment;

  const { reservation } = props;
  useEffect(() => {
    reset(props.reservation);
  }, [props.reservation, reset]);

  const dateValidate = useCallback(async () => {
    const inputReservation = getValues() as IReservation;
    const newReservation: IReservation = {
      ...reservation,
      ...inputReservation,
    };
    return await checkVacant(newReservation);
  }, [getValues, reservation]);

  const onSave = useCallback(async () => {
    const checkResult = await trigger();
    if (!checkResult) return;
    const inputData = getValues() as Partial<IReservation>;
    const saveResult = await save(inputData, reservation, dispatch);
    if (saveResult) history.push('/?date=' + startDate.format('YYYY-MM-DD'));
  }, [dispatch, getValues, history, reservation, startDate, trigger]);

  const onDelete = useCallback(() => {
    if (!confirm('削除して良いですか？')) return;
    deleteReservation(reservation.id, dispatch);
    history.goBack();
  }, [dispatch, history, reservation.id]);

  const menuItems = useMemo(() => {
    return props.facilities.map(fa => (
      // 予約データには facilities/{id} とある
      <MenuItem key={fa.id} value={`facilities/${fa.id}`}>
        {fa.name}
      </MenuItem>
    ));
  }, [props.facilities]);

  const dateError = useMemo(() => !!errors.startDate || !!errors.endDate, [
    errors.endDate,
    errors.startDate,
  ]);

  const maxMinDay = useMemo(() => {
    return moment(startDate).startOf('day');
  }, [startDate]);

  return (
    <>
      <Paragraph>
        <FormControl fullWidth>
          <InputLabel id="facility-label" error={!!errors.facilityId}>
            設備
          </InputLabel>
          <Controller
            as={
              <Select
                label="設備"
                labelId="facility-label"
                error={!!errors.facilityId}
                fullWidth
              >
                {menuItems}
              </Select>
            }
            name="facilityId"
            control={control}
            rules={{
              required: '必須です',
            }}
          />
        </FormControl>
      </Paragraph>
      <Paragraph>
        <DateRow>
          <Controller
            as={
              <KeyboardDateTimePicker
                label="開始日時"
                ampm={false}
                format="YYYY-MM-DD HH:mm"
                onChange={() => {
                  /** react-hook-form で定義されるが必須のため、空関数とする */
                }}
                value=""
                error={dateError}
                helperText={
                  dateError
                    ? ((errors.startDate as unknown) as MomentErrorType)
                        ?.message
                    : ''
                }
              />
            }
            name="startDate"
            control={control}
            rules={{
              validate: dateValidate,
            }}
          />
          <Kara>～</Kara>
          <Controller
            as={
              <KeyboardDateTimePicker
                label="終了日時"
                ampm={false}
                format="YYYY-MM-DD HH:mm"
                onChange={() => {
                  /** react-hook-form で定義されるが必須のため、空関数とする */
                }}
                value=""
                error={dateError}
                maxDate={maxMinDay}
                minDate={maxMinDay}
              />
            }
            name="endDate"
            control={control}
            rules={{
              validate: dateValidate,
            }}
          />
        </DateRow>
        {}
      </Paragraph>
      <Paragraph>
        <Controller
          as={
            <TextField
              label="目的"
              fullWidth
              error={!!errors.subject}
              helperText={!!errors.subject ? errors.subject?.message : ''}
            />
          }
          name="subject"
          control={control}
          rules={{ required: '必須です' }}
        />
      </Paragraph>
      <Paragraph>
        <Controller
          as={<TextField multiline label="詳細" fullWidth />}
          name="description"
          control={control}
        />
      </Paragraph>
      <Paragraph>
        <ActionBar
          onSave={onSave}
          onDelete={onDelete}
          showDelete={!!props.reservation.id}
        />
      </Paragraph>
    </>
  );
};

export default ReservationForm;
