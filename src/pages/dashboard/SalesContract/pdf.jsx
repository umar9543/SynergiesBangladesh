import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';
import { decrypt } from 'src/api/encryption';
import { paths } from 'src/routes/paths';
import SalesContractEdit from 'src/sections/SalesContract/SalesPages/SalesContractEdit';
import { BookingEditView } from 'src/sections/SalesContract/view';
import SalesContractEditView from 'src/sections/SalesContract/view/booking-edit-view';
import SalesContractPDFView from 'src/sections/SalesContract/view/quotation-pdf-view';




// ----------------------------------------------------------------------

export default function SalesContractPDFPage() {
  const navigate = useNavigate()
  const param = useParams();
  const userData = useMemo(() => JSON.parse(localStorage.getItem('UserData')), []);
console.log(param,'paramas')
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

      <SalesContractPDFView  urlData={param}/>
    </>
  );
}
