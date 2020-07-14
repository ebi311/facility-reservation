import { TextField } from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { saveFacility } from '../../actions/facilityActions';
import IFacility from '../../status/IFacility';
import ActionBar from './ActionBar';

type PropsType = {
  facility: IFacility;
};

const Paragraph = styled.div`
  margin: 1em;
`;
const FacilityForm: React.FC<PropsType> = props => {
  const { errors, control, reset, getValues } = useForm<IFacility>({
    defaultValues: props.facility,
    mode: 'onBlur',
  });
  useEffect(() => {
    reset(props.facility);
  }, [props.facility]);

  const dispatch = useDispatch();
  const onSave = useCallback(() => {
    const formData = getValues();
    const saveData = {
      ...props.facility,
      ...formData,
    };
    saveFacility(saveData as IFacility, dispatch);
  }, []);

  const onDelete = useCallback(() => {
    confirm('削除して良いですか？');
  }, []);

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
      <ActionBar onSave={onSave} onDelete={onDelete} />
    </>
  );
};

export default FacilityForm;
