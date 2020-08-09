import { TextField } from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { deleteFacility, saveFacility } from '../../actions/facilityActions';
import IFacility from '../../status/IFacility';
import ActionBar from './ActionBar';
import SystemForm from './SystemForm';

type PropsType = {
  facility: IFacility;
};

const Paragraph = styled.div`
  margin: 1em;
`;
const FacilityForm: React.FC<PropsType> = props => {
  const { errors, control, reset, getValues, trigger } = useForm<IFacility>({
    defaultValues: props.facility,
    mode: 'onBlur',
  });
  const history = useHistory();
  useEffect(() => {
    reset(props.facility);
  }, [props.facility, reset]);

  const dispatch = useDispatch();
  const onSave = useCallback(async () => {
    const checkResult = await trigger();
    if (!checkResult) return;
    const formData = getValues();
    const saveData = {
      ...props.facility,
      ...formData,
    };
    const saveResult = await saveFacility(saveData as IFacility, dispatch);
    if (saveResult) history.push('/');
  }, [trigger, getValues, props.facility, dispatch, history]);

  const onDelete = useCallback(() => {
    if (!confirm('削除して良いですか？')) return;
    const result = deleteFacility(props.facility.id, dispatch);
    if (result) history.goBack();
  }, [dispatch, history, props.facility.id]);

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
          as={<TextField multiline label="詳細" fullWidth />}
          name="description"
          control={control}
        />
      </Paragraph>
      <SystemForm {...props.facility.system} />
      <ActionBar
        onSave={onSave}
        onDelete={onDelete}
        showDelete={!!props.facility.id}
      />
    </>
  );
};

export default FacilityForm;
