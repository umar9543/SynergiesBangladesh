import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import BookingEdit from 'src/sections/BookingOrders/BookingEdit';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useEffect, useState } from 'react';
import axios from 'axios';
// import BookingEditForm from '../booking-edit';


// ----------------------------------------------------------------------

export default function BookingEditView({ urlData }) {

    const [selectedBooking, setSelectedBooking] = useState(null);
    const [styles, setStyles] = useState([])

    useEffect(() => {
        axios.get(`https://localhost:44347/api/BookingPurchase/${urlData?.id}`)
            .then(response => {
                const formatedData = {
                    ...response.data,
                    placementDate: new Date(response.data.placementDate),
                    shipmentDate: new Date(response.data.shipmentDate),
                    tolerance: new Date(response.data.tolerance),
                }
                setSelectedBooking(formatedData)
            })
            .catch(error => console.error("Error fetching customers:", error));
       
    }, [urlData?.id]);

    useEffect(()=>{
        axios.get(`https://localhost:44347/api/BookingPurchase/get-details/${urlData?.id}`)
        .then(response => {
            const updated = response.data.map(item => ({
                ...item,
                vendorPrice: item.vendorRate,
                itemPrice: item.newRate,
                poQuantity: item.quantity,
            }))

            setStyles(updated)
        }
        )
        .catch(error => console.error("Error fetching customers:", error));
    },[urlData?.id])

    const settings = useSettingsContext();
    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Booking Order Information"
                links={[
                    { name: "Home", href: paths.dashboard.root },
                    { name: "Booking Order", href: paths.dashboard.bookingOrder.root },
                    { name: "Edit", },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />



            {(selectedBooking !== null && styles.length > 0) && <BookingEdit selectedBooking={selectedBooking} currentStyles={styles} urlData={urlData} />}

        </Container>
    );
}

BookingEditView.propTypes = {
    urlData: PropTypes.any,
}