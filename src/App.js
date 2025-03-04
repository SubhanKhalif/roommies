import './input.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home.js';
import Service from './pages/Service.js';
import Login, { action as loginAction } from './pages/Login.js';
import Signup, { action as signupAction } from './pages/Signup.js';
import HomeChat from './pages/HomeChat.js';
import Info from './pages/Info.js';
import Settings from './pages/Settings.js';
import NotFoundPage from './pages/404Page.js';
import LandingPage from './pages/LandingPage.js';
import Root, { loader as loadingAction } from './pages/Root.js';
import Search from './pages/Search.js';
import CreatePost from './pages/CreatePost.js';
import { UserProfile } from './pages/UserProfile.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: 'service',
    element: <Service />,
  },
  {
    path: 'login',
    element: <Login />,
    action: loginAction,
  },
  {
    path: 'signup',
    element: <Signup />,
    action: signupAction,
  },
  {
    path: 'home',
    element: <Root />,
    loader: loadingAction,
    children: [
      {
        path: 'message',
        element: <HomeChat />,
      },
      {
        path: 'dashboard',
        element: <Info />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'landing',
        element: <LandingPage />,
      },
      {
        path: 'search',
        element: <Search />,
      },
      {
        path: 'create-post',
        element: <CreatePost />,
      },
      {
        path: ':userId',
        element: <UserProfile />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;

// TODO:
// - Messages not incoming when ad is shown
// - Responsiveness
// - Loading spinner