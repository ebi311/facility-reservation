import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  addReservation,
  deleteReservation,
  updateReservation,
} from '../../actions/reservationDetailActions';
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

const ReservationForm: React.FC<PropsType> = props => {
  const { errors, control, reset, getValues, trigger } = useForm<IReservation>({
    defaultValues: props.reservation,
    mode: 'onBlur',
  });
  const { reservation } = props;
  useEffect(() => {
    reset(props.reservation);
  }, [props.reservation, reset]);
  const dispatch = useDispatch();
  const onSave = useCallback(async () => {
    const result = await trigger();
    if (!result) return;
    const inputData = getValues() as Partial<IReservation>;
    // react hook form では、フォームに割り当てた項目しか保持しない
    // そのため、プロパティで渡された値(=初期値)とマージする
    const data: IReservation = {
      ...reservation,
      ...inputData,
    };
    if (!reservation.id) {
      addReservation(data, dispatch);
    } else {
      updateReservation(data, dispatch);
    }
  }, [dispatch, getValues, reservation, trigger]);

  const onDelete = useCallback(() => {
    if (!confirm('削除して良いですか？')) return;
    deleteReservation(reservation.id, dispatch);
  }, [dispatch, reservation.id]);

  const menuItems = useMemo(() => {
    return props.facilities.map(fa => (
      // 予約データには facilities/{id} とある
      <MenuItem key={fa.id} value={`facilities/${fa.id}`}>
        {fa.name}
      </MenuItem>
    ));
  }, [props.facilities]);

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
              />
            }
            name="startDate"
            control={control}
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
              />
            }
            name="endDate"
            control={control}
          />
        </DateRow>
      </Paragraph>
      <Paragraph>
        <Controller
          as={
            <TextField
              label="目的"
              fullWidth
              error={!!errors.subject}
              helperText={!!errors.subject ? '必須です' : ''}
            />
          }
          name="subject"
          control={control}
          rules={{ required: true }}
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
