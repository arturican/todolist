import { Main } from '@/app/Main';
import { Login } from '@/features/auth/ui/Login/Login';
import { Route, Routes } from 'react-router';
import { PageNotFound } from '@/common/components/PageNotFound';
import { ProtectedRouter } from '@/common/components/ProtectedRoute/ProtectedRouter.tsx';
import { useAppSelector } from '@/common/hooks/useAppSelector.ts';
import { selectIsLoggedIn } from '@/features/auth/model/auth-slice.ts';

export const Path = {
  Main: '/',
  Login: '/login',
  NotFound: '*',
  Faq: '/faq',
};

export const Routing = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <Routes>
      <Route element={<ProtectedRouter isAllowed={isLoggedIn} />}>
        <Route path={Path.Main} element={<Main />} />
        <Route path={Path.Faq} element={<h2>Faq</h2>} />
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
  );
};
