import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/common/hooks/useAppDispatch.ts';
import { type LoginInputs, loginSchema } from '@/features/auth/lib';
import { loginTC } from '@/features/auth/model/auth-slice.ts';
import styles from './Login.module.css';

export const Login = () => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '', rememberMe: false },
  });

  const onSubmit: SubmitHandler<LoginInputs> = data => {
    dispatch(loginTC(data));
  };

  return (
    <section className={`pageContainer ${styles.page}`}>
      <form className={styles.wrapper} onSubmit={handleSubmit(onSubmit)}>
        <FormControl fullWidth>
          <FormLabel>
            <p className={styles.info}>Use the demo account to sign in:</p>
            <div className={styles.credentials}>
              <div>
                <b>Username:</b> admin
              </div>
              <div>
                <b>Password:</b> admin
              </div>
            </div>
          </FormLabel>
          <FormGroup>
            <TextField
              label="Username"
              margin="normal"
              error={!!errors.username}
              autoComplete="username"
              {...register('username')}
            />
            {errors.username && (
              <span className={styles.errorMessage}>
                {errors.username.message}
              </span>
            )}
            <TextField
              type="password"
              label="Password"
              margin="normal"
              error={!!errors.password}
              autoComplete="current-password"
              {...register('password')}
            />
            {errors.password && (
              <span className={styles.errorMessage}>
                {errors.password.message}
              </span>
            )}
            <FormControlLabel
              label="Remember me"
              control={
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field: { value, ...rest } }) => (
                    <Checkbox {...rest} checked={value} />
                  )}
                />
              }
            />
            <Button
              className={styles.submit}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Sign in
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </section>
  );
};
