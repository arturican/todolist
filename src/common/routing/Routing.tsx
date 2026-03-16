import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { CircularProgress } from '@mui/material';
import { ProtectedRouter } from '@/common/components/ProtectedRoute/ProtectedRouter.tsx';
import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import { selectIsLoggedIn } from '@/features/auth/model/auth-slice.ts';

const Main = lazy(async () => {
  const module = await import('@/app/Main');
  return { default: module.Main };
});

const Login = lazy(async () => {
  const module = await import('@/features/auth/ui/Login/Login');
  return { default: module.Login };
});

const PageNotFound = lazy(async () => {
  const module = await import('@/common/components/PageNotFound');
  return { default: module.PageNotFound };
});

const FaqPage = lazy(async () => {
  return {
    default: () => <h2>Faq</h2>,
  };
});

const RouteLoader = () => (
  <div className="circularProgressContainer">
    <CircularProgress size={64} thickness={4} />
  </div>
);

export const Path = {
  Main: '/',
  Login: '/login',
  NotFound: '*',
  Faq: '/faq',
};

export const Routing = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route element={<ProtectedRouter isAllowed={isLoggedIn} />}>
          <Route path={Path.Main} element={<Main />} />
          <Route path={Path.Faq} element={<FaqPage />} />
        </Route>
        <Route
          element={
            <ProtectedRouter isAllowed={!isLoggedIn} redirectPath={Path.Main} />
          }
        >
          <Route path={Path.Login} element={<Login />} />
        </Route>
        <Route path={Path.NotFound} element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};
