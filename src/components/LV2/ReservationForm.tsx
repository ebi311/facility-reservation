import {
  MenuItem,
  Select,
  TextField,
  InputLabel,
  FormControl,
} from '@material-ui/core';
import { KeyboardDateTimePicker } from '@material-ui/pickers';
import React, { useEffect, useMemo, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
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
  const { errors, control, reset, getValues, trigger, setError } = useForm<
    IReservation
  >({
    defaultValues: props.reservation,
    // mode: 'onBlur',
  });

  useEffect(() => {
    reset(props.reservation);
  }, [props.reservation, reset]);

  const onSave = useCallback(async () => {
    const data = getValues();
    await trigger();
    if (data.facilityId === '') {
      setError('facilityId', { type: 'required' });
    }
    console.log(data);
  }, [getValues, setError, trigger]);

  const onDelete = useCallback(() => {
    confirm('削除して良いですか？');
  }, []);

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
          rules={{ required: true }}
        />
      </Paragraph>
      <Paragraph>
        <ActionBar onSave={onSave} onDelete={onDelete} />
      </Paragraph>
    </>
  );
};

export default ReservationForm;
