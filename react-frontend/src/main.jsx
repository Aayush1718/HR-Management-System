import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ChooseType from './components/ChooseType.jsx';
import EmpLogin from './components/EmpLogin.jsx';
import EmpFrontend from './components/EmpFrontend.jsx';
import HrmLogin from './components/HrmLogin.jsx';
import HrFrontend from './components/HrFrontend.jsx';
import HolidayCalender from './components/HolidayCalender.jsx';
import EmpLogout from './components/EmpLogout.jsx';
import HrmLogout from './components/HrmLogout.jsx';
import LeavePortal from './components/LeavePortal.jsx';
import { EmpContextProvider } from './contexts/EmpContext.jsx';
import HrLeavePortal from './components/HrLeavePortal.jsx';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ChooseType />,
  },
  {
    path: "/emp-Login",
    element: <EmpLogin />
  },
  {
    path: "/emp-Details",
    element: <EmpLogout><EmpFrontend /></EmpLogout>
  },
  {
    path: "/hrm-Login",
    element: <HrmLogin />
  },
  {
    path: "/register-Emp",
    element: <HrmLogout><HrFrontend /></HrmLogout>
  },
  {
    path: "/displayPendingLeavesToHr",
    element: <HrmLogout><HrLeavePortal/></HrmLogout>
  },
  {
    path: "/emp-Calender",
    element: <EmpLogout><HolidayCalender /></EmpLogout>
  },
  {
    path: "/emp-LeavePortal",
    element: <EmpLogout><LeavePortal /></EmpLogout>
  }
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EmpContextProvider>
      <RouterProvider router={router} />
    </EmpContextProvider>
  </StrictMode>
);