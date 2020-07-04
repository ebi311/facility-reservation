import { MenuItem, Select, TextField } from '@material-ui/core';
import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import IFacility from '../../status/IFacility';
import IReservation from '../../status/IReservation';

type PropsType = {
  reservation: IReservation;
  facilities: IFacility[];
};

const Paragraph = styled.div`
  margin: 1em;
`;
const ReservationForm: React.FC<PropsType> = props => {
  const { errors, control, reset } = useForm<IReservation>({
    defaultValues: props.reservation,
    mode: 'onBlur',
  });

  useEffect(() => {
    reset(props.reservation);
  }, [props.reservation]);

  const facilitySelect = useMemo(() => {
    const menuItems = props.facilities.map(fa => (
      <MenuItem key={fa.id} value={fa.id}>
        {fa.name}
      </MenuItem>
    ));
    return <Select label="設備">{menuItems}</Select>;
  }, [props.facilities]);

  return (
    <>
      <Paragraph>
        <>
          {/* <InputLabel>設備</InputLabel> */}
          <Controller
            as={facilitySelect}
            name="facilityId"
            rules={{ required: true }}
            control={control}
          />
        </>
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
          name="name"
          control={control}
          rules={{ required: true }}
        />
      </Paragraph>
      <Paragraph>
        <Controller
          as={<TextField multiline rows={3} label="詳細" fullWidth />}
          name="description"
          control={control}
          rules={{ required: true }}
        />
      </Paragraph>
    </>
  );
};

export default ReservationForm;
