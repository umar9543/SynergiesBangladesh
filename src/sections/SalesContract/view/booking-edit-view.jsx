import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import BookingEdit from 'src/sections/BookingOrder/BookingOrders/BookingEdit';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SalesContractEdit from '../SalesPages/SalesContractEdit';
// import BookingEditForm from '../booking-edit';


// ----------------------------------------------------------------------

export default function SalesContractEditView({ urlData }) {

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [styles, setStyles] = useState([])
    console.log(urlData)
    useEffect(() => {
        axios.get(`https://ssblapi.m5groupe.online:6449/api/SalesContract/${urlData?.id}`)
            .then(response => {
                const formatedData = {
                    ...response.data,
                    ApplyDate: new Date(response.data.applyDate),
                    expectedLCDate: new Date(response.data.expectedLCDate),
                    IssuingDate: response.data.salesContractDate==="1970-01-01T00:00:00"? null : new Date(response.data.salesContractDate),
                }
                console.log('format',response.data)
                setSelectedBooking(formatedData)
            })
            .catch(error => console.error("Error fetching customers:", error));

    }, [urlData?.id]);

    useEffect(() => {
        axios.get(`https://ssblapi.m5groupe.online:6449/api/SalesContract/get-detail/${urlData?.id}`)
            .then(response =>
                setStyles(response.data)
            )
            .catch(error => console.error("Error fetching data:", error));
    }, [urlData?.id])
    console.log(selectedBooking)
    const settings = useSettingsContext();
    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Sales Contract Information"
                links={[
                    { name: "Home", href: paths.dashboard.root },
                    { name: "Sales Contract", href: paths.dashboard.SalesContract.root },
                    { name: "Edit", },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />



            {(selectedBooking !== null && styles.length > 0) && <SalesContractEdit selectedBooking={selectedBooking} currentStyles={styles} urlData={urlData} />}

        </Container>
    );
}

SalesContractEditView.propTypes = {
    urlData: PropTypes.any,
}