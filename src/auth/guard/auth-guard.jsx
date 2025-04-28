import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SplashScreen } from 'src/components/loading-screen';
import { decryptObjectKeys } from 'src/api/encryption';
import { useAuthContext } from '../hooks';


// ----------------------------------------------------------------------

const loginPaths = {
  jwt: paths.auth.jwt.login,
};

// ----------------------------------------------------------------------

// export default function AuthGuard({ children }) {
//   const { loading } = useAuthContext();

//   return <>{loading ? <SplashScreen /> : <Container> {children}</Container>}</>;
// }

// AuthGuard.propTypes = {
//   children: PropTypes.node,
// };

// ----------------------------------------------------------------------

// function Container({ children }) {
//   const router = useRouter();

//   const { authenticated, method } = useAuthContext();

//   const [checked, setChecked] = useState(false);

//   const check = useCallback(() => {
//     if (!authenticated) {
//       const searchParams = new URLSearchParams({
//         returnTo: window.location.pathname,
//       }).toString();

//       const loginPath = loginPaths[method];

//       const href = `${loginPath}?${searchParams}`;

//       router.replace(href);
//     } else {
//       setChecked(true);
//     }
//   }, [authenticated, method, router]);

//   useEffect(() => {
//     check();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   if (!checked) {
//     return null;
//   }

//   return <>{children}</>;
// }

// Container.propTypes = {
//   children: PropTypes.node,
// };

export default function AuthGuard({ children }) {

  return <><Container>{children}</Container></>;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
};


function Container({ children }) {
  const router = useRouter();
  const { method } = useAuthContext();
  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    const userData = decryptObjectKeys(
      Array.isArray(JSON.parse(localStorage.getItem('UserData')))
        ? JSON.parse(localStorage.getItem('UserData'))
        : [JSON.parse(localStorage.getItem('UserData'))]  // Wrap the object in an array
    );
    
    
    if (!userData) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();
      const loginPath = loginPaths[method];
      const href = `${loginPath}?${searchParams}`;
      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [method, router]);

  useEffect(() => {
    check();
  }, [check]);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}

Container.propTypes = {
  children: PropTypes.node,
};
