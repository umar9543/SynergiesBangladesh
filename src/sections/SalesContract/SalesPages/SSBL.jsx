import React, { useState, useEffect, useMemo } from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer,
    Font,
} from '@react-pdf/renderer';
import numberToWords from 'number-to-words';
import { decrypt } from "src/api/encryption";


const convertAmountToWords = (amount) => {
    const [whole, decimal] = amount.toFixed(2).split('.');
    const wholeWords = numberToWords.toWords(Number(whole)).toUpperCase();
    const decimalWords = numberToWords.toWords(Number(decimal)).toUpperCase();
    return `SAY US DOLLAR: ${wholeWords} DOLLARS AND ${decimalWords} CENTS ONLY`;
};
// Styles
const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingBottom: 60, // reserve space for footer
        paddingHorizontal: 30,
        fontSize: 10,
        fontFamily: 'Century Gothic',
    },
    title: {
        textDecoration: 'underline',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 10,
        textTransform: 'uppercase',
        fontFamily: 'Roboto-Bold',
    },
    section: {
        marginTop: 10,
        marginBottom: 5,
        gap: 5,
        fontFamily: 'Century Gothic',
        fontSize: 9
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bold: {
        fontFamily: 'Roboto-Bold',
    },
    tableHeader: {
        borderTop: '1px solid black',
        flexDirection: 'row',
        backgroundColor: '#eee',
        fontWeight: 'bold',
        fontSize: 7,
        fontFamily: 'Roboto-Bold'
    },
    tableRow: {
        flexDirection: 'row',

    },
    cell: {
        padding: 3,
        fontSize: 9,
        textAlign: 'center',
        borderBottom: '1px solid black',
        borderLeft: '1px solid black',
        borderColor: '#000',
    },

    fullText: {
        marginTop: 5,
        marginBottom: 5,
        fontFamily: 'Century Gothic',
        fontSize: 9
    },
    signatureBlock: {
        marginTop: 5,
        borderTop: '1px solid black',
        paddingTop: 5,
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 7,
        bottom: -30,
        left: 0,
        right: 0,
        textAlign: 'right',
        color: 'black',
    },
});



// const items = [
//     {
//         sl: '1',
//         commGarments: ' KNITTED BOYS ',
//         poNo: '2077286',
//         styleNo: '2077286 01',
//         shipmentDate: '9/8/2025',
//         quantity: '14,130',
//         unitPrice: '4.35',
//         totalAmount: '61,465.50',
//     },
//     {
//         sl: '2',
//         commGarments: ' KNITTED BOYS ',
//         poNo: '2077286',
//         styleNo: '2077286 00',
//         shipmentDate: '9/8/2025',
//         quantity: '18,390',
//         unitPrice: '4.35',
//         totalAmount: '79,996.50',
//     },
   
   
 
// ];
const columnWidths = ['5%', '25%', '10%', '11%', '15%', '12%', '10%', '12%'];

// const totalQuantity = items.reduce(
//     (acc, item) => acc + parseInt(item.quantity.replace(/,/g, '')), 0
// );
// const totalAmount = items.reduce(
//     (acc, item) => acc + parseFloat(item.totalAmount.replace(/,/g, '')), 0
// );
const TableHeader = ({ columnWidths, styles }) => (
    <View style={styles.tableHeader} wrap={false}>
        {[
            { label: 'Sl#', fontSize: 9 },
            { label: 'COMMODITY READY MADE GARMENTS', fontSize: 8.5 },
            { label: 'PO NO.', fontSize: 9 },
            { label: 'STYLE NO', fontSize: 9 },
            { label: 'SHIPMENT DATE', fontSize: 9 },
            { label: 'QUANTITY / PCS', fontSize: 9 },
            { label: 'UNIT PRICE', fontSize: 9 },
            { label: 'TOTAL AMOUNT', fontSize: 9 },
        ].map((col, i) => (
            <View
                key={i}
                style={{
                    ...styles.cell,
                    width: columnWidths[i],
                    borderLeft:'1px solid black',
                    borderRight: i === 7 ? '1px solid black' : 0,
                }}
            >
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: col.fontSize,
                        fontWeight: 'bold',
                    }}
                >
                    {col.label}
                </Text>
            </View>
        ))}
    </View>
);

const firstPageLimit = 70;
const otherPagesLimit = 120;

const splitRows = (items) => {
  const chunks = [];

  if (items.length <= firstPageLimit) {
    chunks.push(items);
  } else {
    chunks.push(items.slice(0, firstPageLimit));
    let remaining = items.slice(firstPageLimit);

    while (remaining.length > 0) {
      chunks.push(remaining.slice(0, otherPagesLimit));
      remaining = remaining.slice(otherPagesLimit);
    }
  }

  return chunks;
};
// Component
const SalesContractTakkoPDF = ({ selectedBooking, currentStyles, urlData }) => {
   
    const [loading, setLoading] = useState(true);

const userData = useMemo(() => JSON.parse(localStorage.getItem('UserData')), []);
  const UserName = decrypt(userData.UserName);
  const RoleName = decrypt(userData.RoleName);
  const EmailAddress = decrypt(userData.EmailAddress);
  const MobilePhoneNumber = decrypt(userData.MobilePhoneNumber);
   
    if (!selectedBooking || currentStyles.length === 0) return <div>No data available</div>;
  
    const chunkedItems = splitRows(currentStyles);
    const totalQty = currentStyles.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0);
    const totalAmount = currentStyles.reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0);
    function formatToDDMMYY(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = String(date.getFullYear()).slice(-2); // Get last 2 digits
  return `${day}-${month}-${year}`;
}
// const firstPageLimit = 25;
// const otherPagesLimit = 35;

// const splitRows = (items) => {
//     const chunks = [];

//     if (items.length <= firstPageLimit) {
//         chunks.push(items);
//     } else {
//         chunks.push(items.slice(0, firstPageLimit));
//         let remaining = items.slice(firstPageLimit);

//         while (remaining.length > 0) {
//             chunks.push(remaining.slice(0, otherPagesLimit));
//             remaining = remaining.slice(otherPagesLimit);
//         }
//     }

//     return chunks;
// };
// const chunkedItems = splitRows(items);
    return(
        <PDFViewer style={{ width: '100%', height: '100vh' }}>
        <Document>
            <Page size="A3" style={styles.page}>
                <View>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'book-antiqua-bold' }}>SYNERGIES SOURCING BD. LTD.</Text>
                        <Text style={{ fontFamily: 'Roboto-Bold', marginTop: 3 }}>HOUSE # 122/2, ROAD # 01 (WEST SIDE), DOHS, BARIDHARA, DHAKA-1206</Text>
                        <Text style={{ fontFamily: 'Roboto-Bold' }}>Tel :(+88-02) 8419646, 8410983, 8418774, Fax : (+88-02) 8414211</Text>
                    </View>

                    <Text style={styles.title}>SALES CONTRACT</Text>

                    <View style={{ flexDirection: 'row', gap: 60, marginBottom: 5, fontSize: 9 }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ fontFamily: 'Roboto-Bold', }}>BENIFICIARY / VENDOR / SUPPLIER: </Text>
                            <Text style={{ fontFamily: 'Century Gothic', }}>{selectedBooking.venderNames}</Text>
                            <Text style={{ fontFamily: 'Century Gothic', }}>{selectedBooking.venderAddress}</Text>
                        </View>


                        <View style={{ width: '50%' }}>
                            <Text style={{ fontFamily: 'Roboto-Bold', }}>SC #: <Text style={{ fontFamily: 'Century Gothic', }}>{selectedBooking.salesContractNo}</Text></Text>
                            <Text style={{ fontFamily: 'Roboto-Bold', }}>DATE: <Text style={{ fontFamily: 'Century Gothic', }}>{selectedBooking.salesContractDate}</Text></Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 60, marginBottom: 5, fontSize: 9 }}>
                        <View style={{ width: '50%' }}>
                            <Text style={{ fontFamily: 'Roboto-Bold', }}>APPLICANT: </Text>
                            <Text style={{ fontFamily: 'Century Gothic', }}>{selectedBooking.customerName}</Text>
                            <Text style={{ fontFamily: 'Century Gothic', }}>{selectedBooking.address}
                            </Text>
                        </View>


                        <View style={{ width: '50%' }}>
                            <Text style={{ fontFamily: 'Roboto-Bold', }}>Applicant Bank </Text>
                            <Text style={{ fontFamily: 'Century Gothic', }}>{selectedBooking.applicantBank}</Text>
                            <Text style={{ fontFamily: 'Century Gothic', }}>
                              {selectedBooking.bankBranch}
                                </Text>
                        </View>
                    </View>

                    <Text style={styles.fullText}>We are pleased to offer the under-mentioned article(s) as per condition and details described below :</Text>


                    {/* <View style={styles.tableHeader}>
                    <View style={{ ...styles.cell, width: columnWidths[0], borderLeft: 1 }}>
                        <Text style={{ textAlign: 'center', fontSize: 9, fontWeight: 'bold', marginVertical: 'auto' }}>Sl#</Text>
                    </View>
                    <View style={{ ...styles.cell, width: columnWidths[1], borderLeft: 1 }}>
                        <Text style={{ textAlign: 'center', fontSize: 8.5, fontWeight: 'bold', marginVertical: 'auto' }}>COMMODITY READY MADE GARMENTS</Text>
                    </View>
                    <View style={{ ...styles.cell, width: columnWidths[2], borderLeft: 1 }}>
                        <Text style={{ textAlign: 'center', fontSize: 9, fontWeight: 'bold', marginVertical: 'auto' }}>PO NO.</Text>
                    </View>
                    <View style={{ ...styles.cell, width: columnWidths[3], borderLeft: 1 }}>
                        <Text style={{ textAlign: 'center', fontSize: 9, fontWeight: 'bold', marginVertical: 'auto' }}>STYLE NO</Text>
                    </View>
                    <View style={{ ...styles.cell, width: columnWidths[4], borderLeft: 1 }}>
                        <Text style={{ textAlign: 'center', fontSize: 9, fontWeight: 'bold', marginVertical: 'auto' }}>SHIPMENT DATE</Text>
                    </View>
                    <View style={{ ...styles.cell, width: columnWidths[5], borderLeft: 1 }}>
                        <Text style={{ textAlign: 'center', fontSize: 9, fontWeight: 'bold', marginVertical: 'auto' }}>QUANTITY / PCS</Text>
                    </View>
                    <View style={{ ...styles.cell, width: columnWidths[6], borderLeft: 1 }}>
                        <Text style={{ textAlign: 'center', fontSize: 9, fontWeight: 'bold' }}>UNIT PRICE</Text>
                    </View>
                    <View style={{ ...styles.cell, width: columnWidths[7], borderLeft: 1, borderRight: 1 }}>
                        <Text style={{ textAlign: 'center', fontSize: 9, fontWeight: 'bold' }}>TOTAL AMOUNT</Text>
                    </View>
                </View> */}
                    <View>
                        {chunkedItems.map((chunk, chunkIndex) => (
                            <View key={chunkIndex} wrap={false}>
                                <TableHeader columnWidths={columnWidths} styles={styles} />

                                {chunk.map((item, idx) => (
                                    <View key={idx} style={styles.tableRow} wrap={false}>
                                        {[
                                            chunkIndex * chunk.length + idx + 1,
                                            item.styleDescription,
                                            item.pono,
                                            item.styleNo,
                                            formatToDDMMYY(item.cusShipDate),
                                            item.quantity,
                                            item.rate,
                                            item.totalAmount,
                                        ].map((val, i) => (
                                            <Text
                                                key={i}
                                                style={{
                                                    ...styles.cell,
                                                    width: columnWidths[i],
                                                    borderLeft:'1px solid black',
                                                    borderRight: i === 7 ?'1px solid black' : 0,
                                                }}
                                            >
                                                {val}
                                            </Text>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>


                    {/* Total row */}
                    <View style={styles.tableRow}>
                        {[
                            '', '', '', '', 'Total',
                            totalQty.toLocaleString() + 'PCS', '', '$' + totalAmount.toFixed(2),
                        ].map((val, i) => (
                            <Text
                                key={i}
                                style={{
                                    ...styles.cell,
                                    width: columnWidths[i],
                                    borderLeft: i === 4 || i === 0 || i === 5 || i === 7 || i === 6 ?'1px solid black' : 0,
                                    borderRight: i === 7 ? '1px solid black' : 0,
                                    fontWeight: i === 4 || i === 5 || i === 7 ? 'bold' : 'normal',
                                }}
                            >
                                {val}
                            </Text>
                        ))}
                    </View>




                    <View style={{ marginTop: 5, flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 8, fontFamily: 'Roboto-Bold' }}>
                            {convertAmountToWords(totalAmount)}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        {/* Left Column */}
                        <View style={{ width: '48%' }}>
                            <Text><Text style={styles.bold}>EXPIRY :</Text> {formatToDDMMYY(selectedBooking.expiryDate)}</Text>
                            <Text><Text style={styles.bold}>TERMS OF SALES :</Text> FOB BANGLADESH</Text>
                            <Text><Text style={styles.bold}>ADVISE THROUGH :</Text> {selectedBooking.adviceThrough}</Text>
                            <Text><Text style={styles.bold}>SWIFT NO :</Text> {selectedBooking.swiftNo}</Text>
                            <Text><Text style={styles.bold}>ACCOUNT NO :</Text> {selectedBooking.accountNo}</Text>
                            <Text><Text style={styles.bold}>GOODS ORIGIN :</Text> BANGLADESH</Text>
                            <Text><Text style={styles.bold}>TRANS SHIPMENT :</Text> ALLOWED</Text>
                        </View>

                        {/* Right Column */}
                        <View style={{ width: '48%' }}>
                            <Text><Text style={styles.bold}>CERTIFICATE OF ORIGIN :</Text> WILL BE PROVIDED</Text>
                            <Text><Text style={styles.bold}>TOLERANCE :</Text> {selectedBooking.salesTolerance}%</Text>
                            <Text><Text style={styles.bold}>PACKING :</Text> EXPORT STANDARD</Text>
                            <Text><Text style={styles.bold}>SHIPMENT FROM :</Text> ANY PORT OF BANGLADESH</Text>
                            <Text><Text style={styles.bold}>PORT OF DESTINATION :</Text> {selectedBooking.portOfDestination}</Text>
                            <Text><Text style={styles.bold}>PART SHIPMENT :</Text> ALLOWED</Text>
                            <Text><Text style={styles.bold}>PAYMENT :</Text> {selectedBooking.salesTolerance}</Text>
                        </View>
                    </View>

                    <Text style={{ fontFamily: 'Century Gothic', fontSize: 9, marginTop: 5 }}>INSPECTION CERTIFICATE ISSUED BY SYNERGIES SOURCING BD. LTD</Text>
                    <Text style={styles.fullText}>
                        {selectedBooking.logisticComments}
                    </Text>

                    <View style={styles.signatureBlock}>
                        <Text><Text style={styles.bold}>FOR SYNERGIES SOURCING BD. LTD.</Text></Text>
                        <Text>{selectedBooking.username}</Text>
                        <Text>{selectedBooking.designation}</Text>
                        <Text>Email: {selectedBooking.emailAddress}</Text>
                        <Text>M:{selectedBooking.mobilePhoneNumber}</Text>
                    </View>

                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                    <Text style={[styles.pageNumber, { textAlign: 'center' }]} render={({ pageNumber, totalPages }) => (
                        'Powered by : Interactive Technologies Gateway'
                    )} fixed />
                </View>
            </Page>
        </Document>
    </PDFViewer>
    )
};

Font.register({ family: 'book-antiqua-bold', src: '/fonts/book-antiqua-bold.ttf' });
Font.register({ family: 'Century Gothic', src: '/fonts/Century Gothic.ttf' });
Font.register({ family: 'Roboto-Bold', src: '/fonts/Roboto-Bold.ttf' });
Font.register({ family: 'Roboto-Medium', src: '/fonts/Roboto-Medium.ttf' });
Font.register({
    family: 'Century Gothic',
    src: '/fonts/Century Gothic.ttf'
});
export default SalesContractTakkoPDF;
