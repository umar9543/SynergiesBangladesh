import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { decrypt } from 'src/api/encryption';
import { paths } from 'src/routes/paths';
import ManagerApprovals from 'src/sections/Approvals/view/booking-view';
import { BookingListView } from 'src/sections/SalesContract/view';



// ----------------------------------------------------------------------

export default function SalesContractViewPageManager() {
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

      <ManagerApprovals/>
    </>
  );
}
