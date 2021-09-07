import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import { DateTimePicker } from '@material-ui/pickers';
import dayjs, { Dayjs } from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { getFacilities } from '../controllers/facilityController';
import {
  getReservation,
  postReservation,
  putReservation,
} from '../controllers/reservationController';
import { IFacility } from '../models/IFacility';
import { IReservation } from '../models/IReservation';
import { getCurrentUser } from '../auth';

const initReservation = (day: Dayjs): IReservation => {
  const user = getCurrentUser();
  return {
    id: '',
    facilityId: '',
    subject: '',
    description: '',
    startDate: day.startOf('hour'),
    endDate: day.add(1, 'hour').startOf('hour'),
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
  paper: {
    padding: theme.spacing(1),
    '& > div': {
      marginBottom: theme.spacing(2),
    },
  },
  rightActions: {
    textAlign: 'right',
  },
  cancelButton: {
    color: theme.palette.error.main,
  },
}));

export const Reservation: React.FC = () => {
  const style = useStyle();
  const hour = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return dayjs(params.get('date') || undefined);
  }, [window.location.search]);
  const { id } = useParams<{ id: string }>();
  const [reservation, setReservation] = useState(initReservation(hour));
  const [facilities, setFacilities] = useState<IFacility[]>([]);
  const { system } = reservation;
  const { errors, control, reset, trigger, getValues } = useForm<IReservation>({
    defaultValues: reservation,
    mode: 'onBlur',
  });
  useEffect(() => {
    getFacilities().then((result) => {
      setFacilities(result);
    });
    if (!id) return;
    getReservation(id).then((result) => {
      setReservation(result);
      reset(result);
    });
  }, [id]);
  const facilityMenuItems = useMemo(() => {
    return facilities.map((f) => (
      <MenuItem key={f.id} value={f.id}>
        {f.name}
      </MenuItem>
    ));
  }, [facilities]);

  const history = useHistory();
  const onSave = useCallback(async () => {
    const result = await trigger();
    if (!result) return;
    const inputValue = { ...reservation, ...getValues() };
    if (!id) {
      // 新規作成
      const id = await postReservation(inputValue);
      history.replace('/reservation/' + id);
    } else {
      // 更新
      await putReservation(inputValue);
      window.location.reload();
    }
  }, [id, reservation, trigger, getValues]);
  return (
    <Container maxWidth="sm">
      <Paper className={style.paper}>
        <FormControl>
          <InputLabel id="facility-label">設備</InputLabel>
          <Controller
            name="facilityId"
            control={control}
            rules={{ required: true }}
            render={({ value, onChange }) => (
              <Select
                labelId="facility-label"
                value={value}
                onChange={onChange}
              >
                {facilityMenuItems}
              </Select>
            )}
          />
        </FormControl>
        <div style={{ display: 'flex' }}>
          <Controller
            control={control}
            name="startDate"
            render={(data) => {
              return (
                <DateTimePicker
                  value={data.value}
                  onChange={data.onChange}
                  onBlur={data.onBlur}
                  label="開始日時"
                  format="YYYY/MM/DD HH:mm"
                  ampm={false}
                  minutesStep={15}
                />
              );
            }}
          />
          <p>～</p>
          <Controller
            control={control}
            name="endDate"
            render={(data) => {
              return (
                <DateTimePicker
                  value={data.value}
                  onChange={data.onChange}
                  onBlur={data.onBlur}
                  label="終了日時"
                  format="YYYY/MM/DD HH:mm"
                  ampm={false}
                  minutesStep={15}
                />
              );
            }}
          />
        </div>
        <Controller
          control={control}
          name="subject"
          rules={{ required: true }}
          as={
            <TextField
              label="目的"
              fullWidth
              error={!!errors.subject}
              helperText={errors.subject ? '必須です' : ''}
            />
          }
        />
        <Controller
          control={control}
          name="description"
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
