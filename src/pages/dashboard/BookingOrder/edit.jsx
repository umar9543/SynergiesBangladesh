import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';
import { decrypt, decryptObjectKeys } from 'src/api/encryption';
import { paths } from 'src/routes/paths';
import { BookingEditView } from 'src/sections/BookingOrder/view';
// import BookingOrder from 'src/sections/BookingOrders/BookingOrder';



// ----------------------------------------------------------------------

export default function BookingOrderEditPage() {
  const navigate = useNavigate()
  const param = useParams();
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

      <BookingEditView urlData={param}/>
    </>
  );
}
