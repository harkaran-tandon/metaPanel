import { Navigate, RouteObject } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import SignInPage from '../features/Signin';
import SignUpPage from '../features/Signup';
import DashboardLayout from '../layout/DashboardLayout';
import FormBuilderPage from '../features/FormBuilderPage';
import BuilderPage from '../features/BuilderPage';
import Unauthorized from '../components/Unauthorised';
import ProtectedRoute from '../routes/ProtectedRoute';
import LandingRedirect from '../features/LandingRedirect';

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <SignedIn>
        <LandingRedirect />
      </SignedIn>
    ),
  },
  {
    path: '/sign-in/*',
    element: (
      <>
      <SignedOut>
        <SignInPage />
      </SignedOut>
      <SignedIn>
      <Navigate to="/" replace />
    </SignedIn>
    </>
    )
  },
  {
    path: '/sign-up/*',
    element: (
      <>
      <SignedOut>
        <SignUpPage />
      </SignedOut>
      <SignedIn>
      <Navigate to="/" replace />
    </SignedIn>
    </>
    )
  },
  {
    path: '/dashboard',
    element: (
      <>
        <SignedIn>
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <DashboardLayout />
          </ProtectedRoute>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    ),
  },
  {
    path: '/form-builder',
    element: (
      <>
        <SignedIn>
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <FormBuilderPage />
          </ProtectedRoute>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    )
  },
  {
    path: '/builder/:id',
    element: (
      <>
        <SignedIn>
          <ProtectedRoute allowedRoles={["admin", "editor"]}>
            <BuilderPage />
          </ProtectedRoute>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </>
    )
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />
  }
];

export default routes;
