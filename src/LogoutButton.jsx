import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout } = useAuth0();
  const redirectPath =
    process.env.REACT_APP_AUTH0_REDIRECT_PATH ||
    (typeof import.meta !== 'undefined'
      ? import.meta.env.VITE_AUTH0_REDIRECT_PATH
      : undefined) ||
    '';
  return (
    <button
      onClick={() =>
        logout({
          logoutParams: {
            returnTo: new URL(
              redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`,
              window.location.origin
            ).toString(),
          },
        })
      }
      className="button logout"
    >
      IZIET
    </button>
  );
};

export default LogoutButton;
