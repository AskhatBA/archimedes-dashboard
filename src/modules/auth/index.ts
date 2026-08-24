// Public surface of the auth module: the sign-in form for the sign-in screen and
// the session probe the router guards on. A plain `.ts` barrel (not `.tsx`)
// because it re-exports a hook alongside the component.
export { SignInForm } from './components/sign-in-form';
export { useAdminSession } from './hooks';
