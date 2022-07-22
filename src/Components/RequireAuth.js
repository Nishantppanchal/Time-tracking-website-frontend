// Imports React components
import { Navigate } from 'react-router-dom';

function RequireAuth({ children }) {
  // If the access token is present, render the children
  return localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token') ? (
    // Renders the children
    children
  ) : (
    // Otherwise, if the user is not logged in, redirect to the login page
    <Navigate to='/login' replace={true} />
  );
}

// Exports RequireAuth component
export default RequireAuth;
