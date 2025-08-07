import React, { Suspense} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserRoutes from './routes/user';
import NonUserRoutes from './routes/non-user';


const WelcomePage = React.lazy(() => import('./pages/users/welcome-pg'));
const RegisterPage = React.lazy(() => import('./pages/users/register-pg'));
const LoginPage = React.lazy(() => import('./pages/users/login-pg'));
const ForgetPwdPage = React.lazy(() => import('./pages/users/forget-pwd'));
const ConfirmPage = React.lazy(() => import('./pages/users/confirm-pg'));
const VerifyPage = React.lazy(() => import('./pages/users/verify-pg'));
const Layout = React.lazy(() => import('./pages/layout'));
const Dashboard = React.lazy(() => import('./pages/users/dashboard'));
const UpdateProfile = React.lazy(() => import('./pages/users/update-profile'));
const Setting = React.lazy(() => import('./pages/users/setting'));
const Referral = React.lazy(() => import('./pages/users/referral'));
const SendCoin = React.lazy(() => import('./pages/users/send-sc'));
const NotificationPg = React.lazy(() => import('./pages/users/notification'));
const SelectPkg = React.lazy(() => import('./pages/users/select-pkg'));
const LockPkg = React.lazy(() => import('./pages/users/lock-pkg'));
const FeedPg = React.lazy(() => import('./pages/users/feed-pg'));
const UserFeed = React.lazy(() => import('./pages/users/user-feed'));
const CreatePost = React.lazy(() => import('./pages/users/post'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<i className="fa-solid fa-spinner lazy-page-load-icon"></i>}>
        <Routes>
            <Route element={<UserRoutes />}>
              <Route path='/' element={<Layout />} > 
                  <Route path='dashboard' element={<Dashboard />} />
                  <Route path='update-profile' element={<UpdateProfile />} />
                  <Route path='setting' element={<Setting />} />
                  <Route path='referral' element={<Referral />} />
                  <Route path='send-sc' element={<SendCoin />} /> 
                  <Route path='history' element={<NotificationPg />} />
                  <Route path='select-pkg' element={<SelectPkg />} />
                  <Route path='lock-pkg' element={<LockPkg />} />
                  <Route path='all-post' element={<FeedPg />} />
                  <Route path='post-view' element={< UserFeed />} />
                  <Route path='create-post' element={< CreatePost />} />
                  <Route path='*' element={<Dashboard/>} />
              </Route>
            </Route>
            <Route element={<NonUserRoutes />}>
              <Route path='/welcome' element={<WelcomePage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/verify' element={<VerifyPage />} />
              <Route path='/confirm' element={<ConfirmPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/forget-password' element={<ForgetPwdPage/>} />
              <Route path='*' element={<LoginPage />} /> 
            </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
