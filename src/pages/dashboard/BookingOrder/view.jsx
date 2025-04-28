import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { decrypt, decryptObjectKeys } from 'src/api/encryption';
import { paths } from 'src/routes/paths';
import { BookingListView } from 'src/sections/BookingOrder/view';



// ----------------------------------------------------------------------

export default function BookingOrderViewPage() {
  const navigate = useNavigate()
 const userData = useMemo(() => {
    const parsedData = JSON.parse(localStorage.getItem('UserData'));
    return decryptObjectKeys(
      Array.isArray(parsedData) ? parsedData : [parsedData]  // Ensure it's wrapped in an array if it's not already
    );
  }, []);

  // useEffect(() => {
  //   if (userData.roleID !== '1') {
  //     navigate(paths.page403)
  //   }
  // }, [userData, navigate])
  return (
    <>
      <Helmet>
        <title>Booking Order</title>
      </Helmet>

      <BookingListView/>
    </>
  );
}
