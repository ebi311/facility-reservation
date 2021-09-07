import Avatar from '@material-ui/core/Avatar/Avatar';
import Button from '@material-ui/core/Button/Button';
import Chip from '@material-ui/core/Chip/Chip';
import Container from '@material-ui/core/Container/Container';
import Grid from '@material-ui/core/Grid/Grid';
import InputLabel from '@material-ui/core/InputLabel/InputLabel';
import Paper from '@material-ui/core/Paper/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { getCurrentUser } from '../auth';
import {
  getFacility,
  postFacility,
  putFacility,
} from '../controllers/facilityController';
import { IFacility } from '../models/IFacility';

const initFacility = (): IFacility => {
  const user = getCurrentUser();
  return {
    id: '',
    name: '',
    note: '',
    system: {
      createDate: new Date(),
      createUser: {
        displayName: user?.displayName || '',
        email: user?.email || '',
        face: user?.photoURL || '',
      },
      lastUpdateUser: {
        displayName: user?.displayName || '',
        email: user?.email || '',
        face: user?.photoURL || '',
      },
      lastUpdate: new Date(),
    },
  };
};

const useStyle = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(1),
  },
  rightActions: {
    textAlign: 'right',
  },
  cancelButton: {
    color: theme.palette.error.main,
  },
}));

export const Facility: React.FC = () => {
  const style = useStyle();
  const { id } = useParams<{ id: string }>();
  const [facility, setFacility] = useState(initFacility());
  const { system } = facility;
  const { errors, control, reset, trigger, getValues } = useForm({
    defaultValues: facility,
    mode: 'onBlur',
  });
  useEffect(() => {
    if (!id) return;
    getFacility(id).then((result) => {
      setFacility(result);
      reset(result);
    });
  }, [id]);

  const history = useHistory();
  const onSave = useCallback(async () => {
    const result = await trigger();
    if (!result) return;
    const inputValue = { ...facility, ...getValues() };
    if (!id) {
      // 新規作成
      const id = await postFacility(inputValue);
      history.replace('/facility/' + id);
    } else {
      // 更新
      await putFacility(inputValue);
      window.location.reload();
    }
  }, [id, facility, trigger, getValues]);

  return (
    <Container maxWidth="sm" className={style.root}>
      <Paper className={style.paper}>
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          as={
            <TextField
              label="設備名"
              fullWidth
              error={!!errors.name}
              helperText={errors.name ? '必須です' : ''}
            />
          }
        />
        <Controller
          control={control}
          name="note"
          as={<TextField label="詳細" fullWidth multiline value="" />}
        />
        <InputLabel shrink>登録者</InputLabel>
        <p>
          <Chip
            label={system.createUser.displayName}
            avatar={<Avatar src={system.createUser.face} />}
          />
          {dayjs(system.createDate).format('YYYY-MM-DD HH:mm')}
        </p>
        <InputLabel shrink>更新者</InputLabel>
        <p>
          <Chip
            label={system.lastUpdateUser.displayName}
            avatar={<Avatar src={system.lastUpdateUser.face} />}
          />
          {dayjs(system.lastUpdate).format('YYYY-MM-DD HH:mm')}
        </p>
        <Grid container>
          <Grid item xs={6}>
            <Button className={style.cancelButton} startIcon={<DeleteIcon />}>
              削除
            </Button>
          </Grid>
          <Grid item xs={6} className={style.rightActions}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DoneIcon />}
              onClick={onSave}
            >
              保存
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};
