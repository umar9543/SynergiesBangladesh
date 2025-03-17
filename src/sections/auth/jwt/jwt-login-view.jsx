import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Get, Post } from 'src/api/apibasemethods';
import { encrypt } from 'src/api/encryption';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  const { login } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [loginInfo, setLoginInfo] = useState({
    Agency: 'Progression'
  });

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginUser = async () => {

  }

  const LoginSchema = Yup.object().shape({
    userCode: Yup.string().required('User Code is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    userCode: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async () => {
    try {
      const encryptedUserCode = encodeURIComponent(encrypt(loginInfo.UserCode));
      const encryptedPassword = encodeURIComponent(encrypt(loginInfo.Password));
      // const encryptedAgencyName = encodeURIComponent(encrypt(loginInfo.Agency));

      const response = await Post(`api/Login`, {
        userCode: loginInfo.UserCode,
        password: loginInfo.Password
      });

      if (response.status === 200) {
        const loginTime = new Date().getTime();
        localStorage.setItem('UserData', JSON.stringify(response.data));
        localStorage.setItem('loginTime', loginTime);
        router.push(returnTo || PATH_AFTER_LOGIN);
      } else {
        setErrorMsg('Incorrect or Password');
      }
    } catch (error) {
      setErrorMsg('An error occurred. Please try again.');
      console.log(error);
      reset();
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Sign in to Synergies Bangladesh</Typography>

      {/* <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New user?</Typography>

        <Link component={RouterLink} href={paths.auth.jwt.register} variant="subtitle2">
          Create an account
        </Link>
      </Stack> */}
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <RHFTextField InputLabelProps={{
        shrink: true,
      }} name="userCode" label="User Code" onchange={(e) => setLoginInfo({ ...loginInfo, UserCode: e.target.value })} />

      <RHFTextField
        name="password"
        label="Password"
        InputLabelProps={{
          shrink: true,
        }}
        type={password.value ? 'text' : 'password'}
        onchange={(e) => setLoginInfo({ ...loginInfo, Password: e.target.value })}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* <Link variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        Forgot password?
      </Link> */}

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  );
}
