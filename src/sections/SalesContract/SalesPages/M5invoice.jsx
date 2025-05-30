import { View, Text, Page, Font, Document, PDFViewer, StyleSheet } from '@react-pdf/renderer'
import React from 'react'
import PropTypes from 'prop-types';
import numberToWords from 'number-to-words';

const TableHeader = ({ columnWidths, styles }) => (
    <View style={styles.tableHeader} wrap={false}>
        {[
            { label: 'SL#', fontSize: 9 },
            { label: 'DESCRIPTION OF GOODS', fontSize: 8.5 },
            { label: 'ORDER NO', fontSize: 9 },
            { label: 'STYLE NO', fontSize: 9 },
            { label: 'REF. NO', fontSize: 9 },
            { label: 'HS CODE', fontSize: 9 },
            { label: 'PCS QTY', fontSize: 9 },
            { label: 'UNIT PRICE', fontSize: 9 },
            { label: 'UNIT PRICE AED DIRHAM', fontSize: 9 },
            { label: 'TOTAL AMOUNT AED DIRHAM', fontSize: 9 },
        ].map((col, i) => (
            <View
                key={col.label}
                style={{
                    ...styles.cell,
                    width: columnWidths[i],
                    borderLeft: 1,
                    borderRight: i === 9 ? 1 : 0,
                }}
            >
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: col.fontSize,
                        fontWeight: 'bold',
                        marginVertical: 'auto',
                    }}
                >
                    {col.label}
                </Text>
            </View>
        ))}
    </View>
);
const M5invoice = () => {
    const styles = StyleSheet.create({
        page: {
            paddingTop: 20,
            paddingBottom: 10, // reserve space for footer
            paddingHorizontal: 30,
            fontSize: 10,
            fontFamily: 'Century Gothic',
        },

        title: {
            textDecoration: 'underline',
            fontSize: 15,
            textAlign: 'center',
            marginBottom: 10,
            textTransform: 'uppercase',
            fontFamily: 'Roboto-Bold',
        },
        tableHeader: {
            borderTop: 1,
            flexDirection: 'row',
            backgroundColor: '#eee',
            fontWeight: 'bold',
            fontSize: 7,
            fontFamily: 'Roboto-Bold',
        },
        tableRow: {
            flexDirection: 'row',
        },
        cell: {
            padding: 3,
            fontSize: 9,
            textAlign: 'center',
            borderBottom: 1,
            borderLeft: 1,
            borderColor: '#000',
        },
        pageNumber: {
            position: 'absolute',
            fontSize: 8,
            bottom: -50,
            left: 0,
            right: 0,
            textAlign: 'right',
            color: 'black',
        },
    });

    const columnWidths = ['5%', '25%', '13%', '10%', '12%', '12%', '10%', '10%', '10%', '10%'];



    const items = [
        {
            sl: '1', // SL#
            descriptionOfGoods: 'KNITTED BOYS', // DESCRIPTION OF GOODS
            orderNo: '2077286', // ORDER NO
            styleNo: '2077286 01', // STYLE NO
            refNo: '-', // REF. NO (placeholder)
            hsCode: '-', // HS CODE (placeholder)
            pcsQty: '14,130', // PCS QTY
            unitPrice: '4.35', // UNIT PRICE
            unitPriceAed: '-', // UNIT PRICE AED DIRHAM (placeholder)
            totalAmountAed: '61,465.50', // TOTAL AMOUNT AED DIRHAM
        },
    ];

    const firstPageLimit = 25;
    const otherPagesLimit = 35;

    const splitRows = (rows) => {
        const chunks = [];

        if (rows.length <= firstPageLimit) {
            chunks.push(rows);
        } else {
            chunks.push(rows.slice(0, firstPageLimit));
            let remaining = rows.slice(firstPageLimit);

            while (remaining.length > 0) {
                chunks.push(remaining.slice(0, otherPagesLimit));
                remaining = remaining.slice(otherPagesLimit);
            }
        }

        return chunks;
    };

    const chunkedItems = splitRows(items);

    const totalQuantity = items.reduce(
        (acc, item) => acc + parseInt(item.pcsQty.replace(/,/g, ''), 10),
        0,
    );
    const totalAmount = items.reduce(
        (acc, item) => acc + parseFloat(item.totalAmountAed.replace(/,/g, '')),
        0,
    );

    const convertAmountToWords = (amount) => {
        const [whole, decimal] = amount.toFixed(2).split('.');
        const wholeWords = numberToWords.toWords(Number(whole)).toUpperCase();
        const decimalWords = numberToWords.toWords(Number(decimal)).toUpperCase();
        return `IN WORDS AED: ${wholeWords} DOLLARS AND ${decimalWords} CENTS ONLY`;
    };

    return (
        <PDFViewer style={{ width: '100%', height: '800px' }}>
            <Document>
                <Page size="A3" orientation='landscape' style={styles.page}>
                    <View>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'book-antiqua-bold' }}>M5 DESIGN & SUPPLY CHAIN FZ LLC</Text>
                            <Text style={{ fontFamily: 'Roboto-Bold', marginTop: 3 }}>Building 1B, Office 701, Dubai Design District, Dubai - UAE</Text>

                        </View>

                        <Text style={styles.title}>COMMERCIAL  INVOICE</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', gap: 40, fontSize: 11, border: 1, borderRadius: 5, padding: 5, marginBottom: 5 }}>
                            <View style={{ width: '33%' }}>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>1ST BENEFICIARY: </Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>M5 DESIGN & SUPPLY CHAIN FZ LLC</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>Building 1B, Office 701, Dubai Design District, </Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>Dubai - UAE  </Text>
                            </View>


                            <View style={{ width: '37%' }}>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>INVOICE NO :  <Text style={{ fontFamily: 'Century Gothic', }}>CTL-141/1150/2024</Text></Text>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>L/C NO          :  <Text style={{ fontFamily: 'Century Gothic', }}>032LU3C242420003</Text></Text>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>EXP NO         :  <Text style={{ fontFamily: 'Century Gothic', }}>1221-000492-2024</Text></Text>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>HBL NO         :  <Text style={{ fontFamily: 'Century Gothic', }}>SKYDHAKA24250782</Text></Text>
                                {/* <Text style={{ fontFamily: 'Roboto-Bold', }}>TRANSFERRING BANK'S REFERENCE NO :  <Text style={{ fontFamily: 'Century Gothic', }}>091IEUT243660501</Text></Text> */}
                            </View>
                            <View style={{ width: '30%' }}>

                                <Text style={{ fontFamily: 'Roboto-Bold', }}>DATED : <Text style={{ fontFamily: 'Century Gothic', }}>15/4/2025</Text></Text>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>DATED : <Text style={{ fontFamily: 'Century Gothic', }}>15/4/2025</Text></Text>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>DATED : <Text style={{ fontFamily: 'Century Gothic', }}>15/4/2025</Text></Text>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>DATED : <Text style={{ fontFamily: 'Century Gothic', }}>15/4/2025</Text></Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', gap: 40, fontSize: 11, border: 1, borderRadius: 5, padding: 5, marginBottom: 5 }}>
                            <View style={{ width: '33%' }}>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>For Account & Risk of :</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>R-MIXED FZCO DUBAI BRANCH </Text>
                                <Text style={{ fontFamily: 'Century Gothic', width: '50%' }}>UBORA TOWER 49TH FLOOR MARASI DRIVE, BUSINESS BAY,</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>Dubai - UAE  </Text>
                            </View>


                            <View style={{ width: '37%' }}>

                                <Text style={{ fontFamily: 'Roboto-Bold', }}>Export L/C Issuing /Reimbursing Bank.:</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>MASHREQ BANK PSC.</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}> (FOREIGN TRADE CENTRE) </Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>DUBAI AE UNITED ARAB EMIRATES </Text>
                            </View>

                            <View style={{ width: '30%' }}>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>MANUFACTURER : NAME AND ADDRESS</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>CONFIDENCE TEXWEAR LTD  </Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>SHIRIR CHALA, VOBANIPUR, GAZIPUR</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}> SADAR, GAZIPUR-1700, BANGLADESH.</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', gap: 40, fontSize: 11, border: 1, borderRadius: 5, padding: 5, marginBottom: 5 }}>
                            <View style={{ width: '33%' }}>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>Applicant:</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>R-MIXED FZCO DUBAI BRANCH </Text>
                                <Text style={{ fontFamily: 'Century Gothic', width: '50%' }}>UBORA TOWER 49TH FLOOR MARASI DRIVE, BUSINESS BAY,</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>Dubai - UAE  </Text>
                            </View>


                            <View style={{ width: '37%' }}>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 82 }}>Beneficiary :</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>M5 DESIGN & SUPPLY CHAIN FZ LLC</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 82 }}>Bank :</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>MASHREQ BANK PSC.</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 100 }}>Banks Address :</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>
                                        FOREIGN TRADE CENTRE-FTC 3RD FLOOR, INJAZ MASHREQ BUILDING PHASE I (NEXT TO TECOM/DU CALL CENTRE)
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 105 }} />
                                    <Text style={{ fontFamily: 'Century Gothic' }}>
                                        P.O.BOX 9271 DUBAI OUTSOURCE ZONE (DOZ) AL AWEER (NEAR INTERNATIONAL CITY) DUBAI, UAE
                                    </Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 82 }}>IBAN NO :</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>AE960330000019120115985</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 82 }}>SWIFT CODE :</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>BOMLAEAD</Text>
                                </View>


                            </View>

                            <View style={{ width: '30%' }}>
                                {/* <Text style={{ fontFamily: 'Roboto-Bold', }}>MANUFACTURER : NAME AND ADDRESS</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>CONFIDENCE TEXWEAR LTD SHIRIR CHALA, VOBANIPUR, GAZIPUR SADAR, GAZIPUR-1700, BANGLADESH. </Text>
                                {/* <Text style={{ fontFamily: 'Century Gothic', }}>Building 1B, Office 701, Dubai Design District, </Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>Dubai - UAE  </Text> */}
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', gap: 40, fontSize: 11, border: 1, borderRadius: 5, padding: 5, marginBottom: 5 }}>
                            <View style={{ width: '33%' }}>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>Notify:</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>R-MIXED FZCO DUBAI BRANCH </Text>
                                <Text style={{ fontFamily: 'Century Gothic', width: '50%' }}>UBORA TOWER 49TH FLOOR MARASI DRIVE, BUSINESS BAY,</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>Dubai - UAE  </Text>
                            </View>



                            <View style={{ width: '37%' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>MEANS OF TRANSPORT :</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>BY SEA</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>PORT OF LOADING :</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>CHITTAGONG, BANGLADESH.</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>PORT OF DISCHARGE :</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>JEBEL ALI, DUBAI, UAE</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>FREIGHT TERMS :</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>FOB</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>PAYMENT TERMS :</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>90 DAYS FROM THE DATE OF BL/AWB</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>ERC # :</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>260326210247519</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>VAT. NO. :</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>001108817-0103</Text>
                                </View>

                                {/* Uncomment if needed */}

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>FINAL DESTINATION :</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>RUSSIA</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>VESSEL NO.:</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }} />
                                </View>

                            </View>

                            <View style={{ width: '30%' }}>
                                {/* <Text style={{ fontFamily: 'Roboto-Bold', }}>MANUFACTURER : NAME AND ADDRESS</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>CONFIDENCE TEXWEAR LTD SHIRIR CHALA, VOBANIPUR, GAZIPUR SADAR, GAZIPUR-1700, BANGLADESH. </Text>
                                {/* <Text style={{ fontFamily: 'Century Gothic', }}>Building 1B, Office 701, Dubai Design District, </Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>Dubai - UAE  </Text> */}
                            </View>
                        </View>

                        <View>
                            {chunkedItems.map((chunk, chunkIndex) => (
                                <View key={chunkIndex} wrap={false}>
                                    <TableHeader columnWidths={columnWidths} styles={styles} />

                                    {chunk.map((item, idx) => (
                                        <View key={idx} style={styles.tableRow} wrap={false}>
                                            {[
                                                item.sl,
                                                item.descriptionOfGoods,
                                                item.orderNo,
                                                item.styleNo,
                                                item.refNo,
                                                item.hsCode,
                                               `${item.pcsQty}PCS`,
                                                item.unitPrice,
                                                item.unitPriceAed,
                                                item.totalAmountAed
                                            ].map((val, i) => (
                                                <Text
                                                    key={i}
                                                    style={{
                                                        ...styles.cell,
                                                        width: columnWidths[i],
                                                        borderLeft: 1,
                                                        borderRight: i === 9 ? 1 : 0,
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
                                '', '', '', 'Category No : 4 ', 'Total', '',
                                `${totalQuantity.toLocaleString()}PCS`
                                , '', '',`AED${totalAmount.toFixed(2)}`,
                            ].map((val, i) => (
                                <Text
                                    key={i}
                                    style={{
                                        ...styles.cell,
                                        width: columnWidths[i],
                                        borderLeft: i === 4 || i === 0 || i === 5 || i === 7 || i === 6 || i === 8 || i === 9 ? 1 : 0,
                                        borderRight: i === 9 ? 1 : 0,
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

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 10 }}>
                            <View
                                style={{
                                    border: 1,
                                    borderColor: '#000',
                                    fontSize: 10,
                                    width: '50%',
                                }}
                            >
                                {/* Header Row */}
                                <View style={{ flexDirection: 'row', borderBottom: 1, borderColor: '#000' }}>
                                    <Text style={{ flex: 1, textAlign: 'center', fontFamily: 'Roboto-Bold', padding: 2 }}>
                                        SUMMARY
                                    </Text>
                                </View>

                                {/* Data Rows */}
                                {[
                                    ['TOTAL PCS QUANTITY', '6,483', 'PCS'],
                                    ['TOTAL CARTONS', '129', 'CTN'],
                                    ['TOTAL GROSS WEIGHT', '2,316.370', 'KGS'],
                                    ['TOTAL NET WEIGHT', '2,109.97', 'KGS'],
                                    ['CTN MEASUREMENT 60X40X41', '12.320', 'CBM'],
                                ].map(([label, value, unit], idx) => (
                                    <View
                                        key={idx}
                                        style={{
                                            flexDirection: 'row',
                                            borderTop: 1,
                                            borderColor: '#000',
                                        }}
                                    >
                                        <Text style={{ flex: 1.5, padding: 2 }}>{label}</Text>
                                        <Text style={{ flex: 1, padding: 2, textAlign: 'right' }}>{value}</Text>
                                        <Text style={{ flex: 0.5, padding: 2 }}>{unit}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 25 }}>
                            <Text style={{ borderTop: 1, fontFamily: 'Roboto-Bold' }}>Authorized Signature</Text>
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
}

Font.register({ family: 'book-antiqua-bold', src: '/fonts/book-antiqua-bold.ttf' });
Font.register({ family: 'Century Gothic', src: '/fonts/Century Gothic.ttf' });
Font.register({ family: 'Roboto-Bold', src: '/fonts/Roboto-Bold.ttf' });
Font.register({ family: 'Roboto-Medium', src: '/fonts/Roboto-Medium.ttf' });
Font.register({
    family: 'Century Gothic',
    src: '/fonts/Century Gothic.ttf'
});

export default M5invoice
TableHeader.propTypes = {
    columnWidths: PropTypes.arrayOf(PropTypes.string).isRequired,
    styles: PropTypes.object.isRequired,
};