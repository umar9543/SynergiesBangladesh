import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { decrypt } from 'src/api/encryption';
import { paths } from 'src/routes/paths';
import SalesContractAdd from 'src/sections/SalesContract/SalesPages/SalesContractAdd';




// ----------------------------------------------------------------------

export default function SalesContractAddPage() {
  const navigate = useNavigate()
  const userData = useMemo(() => JSON.parse(localStorage.getItem('UserData')), []);
  // useEffect(() => {
  //   if (userData.roleID !== '1') {
  //     navigate(paths.page403)
  //   }
  // }, [userData, navigate])
  return (
    <>
      <Helmet>
        <title>Sales Contract</title>
      </Helmet>

      <SalesContractAdd/>
    </>
  );
}
