import { TextField } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import IFacility from '../../status/IFacility';

type PropsType = {
  facility: IFacility;
};

const Paragraph = styled.div`
  margin: 1em;
`;
const FacilityForm: React.FC<PropsType> = props => {
  const { errors, control, reset } = useForm<IFacility>({
    defaultValues: props.facility,
    mode: 'onBlur',
  });

  useEffect(() => {
    reset(props.facility);
  }, [props.facility]);

  return (
    <>
      <Paragraph>
        <Controller
          as={
            <TextField
              label="設備名"
              fullWidth
              error={!!errors.name}
              helperText={!!errors.name ? '必須です' : ''}
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

export default FacilityForm;
