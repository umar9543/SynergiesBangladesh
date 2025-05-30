import { Document, Font, Image, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'
import PropTypes from 'prop-types';
import numberToWords from 'number-to-words';


const TableHeader = ({ columnWidths, styles }) => (
    <View style={styles.tableHeader} wrap={false}>
        {[
            { label: 'ORDER NO.', fontSize: 10 },
            { label: 'STYLE NO', fontSize: 10 },
            { label: 'COLOR', fontSize: 10 },
            { label: 'DESCRIPTION', fontSize: 10 },
            { label: 'QUANTITY(PCS)', fontSize: 10 },
            { label: 'UNIT PRICE FOB', fontSize: 10 },
            { label: 'HS code', fontSize: 10 },
            { label: 'AMOUNT', fontSize: 10 },

        ].map((col, i) => (
            <View
                key={col.label}
                style={{
                    ...styles.cell,
                    width: columnWidths[i],
                    borderLeft: 1,
                    borderRight: i === 7 ? 1 : 0,
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
const ComInvoice = () => {
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
    const columnWidths = ['10%', '10%', '10%', '20%', '13%', '13%', '13%', '11%'];
    const items = [
        {
            ORDERNO: '2077286',
            STYLES: [
                {
                    STYLENO: '2077286 01',
                    COLORS: [
                        {
                            COLOR: 'RED',
                            DESCRIPTION: 'KNITTED BOYS',
                            QUANTITY: '10',
                            UNITPRICE: '4.35',
                            hs: '1',
                            AMOUNT: '43.50',
                        },
                        {
                            COLOR: 'BLUE',
                            DESCRIPTION: 'KNITTED BOYS',
                            QUANTITY: '16',
                            UNITPRICE: '4.35',
                            hs: '1',
                            AMOUNT: '69.60',
                        },
                    ],
                },
                {
                    STYLENO: '2077286 0123',
                    COLORS: [
                        {
                            COLOR: 'RED',
                            DESCRIPTION: 'KNITTED BOYS',
                            QUANTITY: '10',
                            UNITPRICE: '4.35',
                            hs: '1',
                            AMOUNT: '43.50',
                        },
                        {
                            COLOR: 'BLUE',
                            DESCRIPTION: 'KNITTED BOYS',
                            QUANTITY: '16',
                            UNITPRICE: '4.35',
                            hs: '1',
                            AMOUNT: '69.60',
                        },
                    ],
                },
            ],
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
    const inv = {
        "ImporterPhoneNumber": "2122879027",
        "ImporterCompanyName": "N.E. BRANDS LLC",
        "ImporterLegalAddress": "275 MADISON AVE 3RD Floor, NEW YORK NY 10016",
        "VenderLibraryID": "287",
        "SupplierStatus": "Active",
        "VenderCode": "",
        "VenderName": "MAGIC WORKS LIMITED",
        "VenderCategoryID": "1",
        "VenderAddress": "JHALPAZA,10,HOBIRBARI UNION PARISHAD,\r\nP.S.BHALUKA-2240,DIST:MYMENSINGH,BANGLADESH \r\n CELL. 88-02-01318 563844,88-02-01318 563847\r\n\r\n",
        "Town": "",
        "Street": "",
        "City": "62",
        "ContactPerson": "Md. Saiful Alam",
        "Designation": "ED",
        "FaxNo": "",
        "PhoneNumberPrincipal": "+8801755658331",
        "PhoneNumberOthers": "",
        "CellNumber": "+8801755658331",
        "Email": "saiful.alam@odell.com.bd",
        "IsActive": "True",
        "LongitudeandLatitude": "",
        "InvoiceNo": "123456",
        "InvoiceDate": "2025-05-01",
        "SCNo": "sdf",
        "SCDate": "2025-05-16",
        "EXPNo": "12345678",
        "ShipMode": "BY TRUCK",
        "PaymentTerms": "DA 90 Days",
        "BillOfLoadingNo": "1",
        "PortOfDestination": "dsd",
        "PortOfDischarge": "sf",
        "PortOflLoading": "sfd",
        "EXPDate": "2025-05-13",
        "ETD": "2025-05-22",
        "DetailList": [
            {
                "PONumber": "6380",
                "StyleNumber": "XMP-91159 A ",
                "Colorway": "7",
                "SizeRange": "32X32 - 40X32",
                "Sizes": "32X32",
                "POID": "24904",
                "Description": "Men's stretch twill colored pants",
                "HsCode": "1234567",
                "SizeQty": "600",
                "Currency": "taka",
                "POQuantity": "4140",
                "ShippedQty": "0",
                "TotalQuantity": 600,
                "UnitPrice": "7.80",
                "TotalAmount": 4680
            },
            {
                "PONumber": "6380",
                "StyleNumber": "XMP-91159 A ",
                "Colorway": "7",
                "SizeRange": "32X32 - 40X32",
                "Sizes": "34X32",
                "POID": "24904",
                "Description": "Men's stretch twill colored pants",
                "HsCode": "1234567",
                "SizeQty": "600",
                "Currency": "taka",
                "POQuantity": "4140",
                "ShippedQty": "0",
                "TotalQuantity": 600,
                "UnitPrice": "7.80",
                "TotalAmount": 4680
            },
            {
                "PONumber": "6380",
                "StyleNumber": "XMP-91159 A ",
                "Colorway": "7",
                "SizeRange": "32X32 - 40X32",
                "Sizes": "36X32",
                "POID": "24904",
                "Description": "Men's stretch twill colored pants",
                "HsCode": "1234567",
                "SizeQty": "1200",
                "Currency": "taka",
                "POQuantity": "4140",
                "ShippedQty": "0",
                "TotalQuantity": 1200,
                "UnitPrice": "7.80",
                "TotalAmount": 9360
            },
            {
                "PONumber": "6380",
                "StyleNumber": "XMP-91159 A ",
                "Colorway": "7",
                "SizeRange": "32X32 - 40X32",
                "Sizes": "38X32",
                "POID": "24904",
                "Description": "Men's stretch twill colored pants",
                "HsCode": "1234567",
                "SizeQty": "1200",
                "Currency": "taka",
                "POQuantity": "4140",
                "ShippedQty": "0",
                "TotalQuantity": 1200,
                "UnitPrice": "7.80",
                "TotalAmount": 9360
            },
            {
                "PONumber": "6380",
                "StyleNumber": "XMP-91159 A ",
                "Colorway": "7",
                "SizeRange": "32X32 - 40X32",
                "Sizes": "40X32",
                "POID": "24904",
                "Description": "Men's stretch twill colored pants",
                "HsCode": "1234567",
                "SizeQty": "600",
                "Currency": "taka",
                "POQuantity": "4140",
                "ShippedQty": "0",
                "TotalQuantity": 600,
                "UnitPrice": "7.80",
                "TotalAmount": 4680
            },
            {
                "PONumber": "11055",
                "StyleNumber": "XMP - 93393",
                "Colorway": "DARK BLUE ",
                "SizeRange": "28 - 38",
                "Sizes": "28",
                "POID": "38710",
                "Description": "MENS LONG DENIM ",
                "HsCode": "7654321",
                "SizeQty": "100",
                "Currency": "Dollar",
                "POQuantity": "3600",
                "ShippedQty": "0",
                "TotalQuantity": 100,
                "UnitPrice": "4.23",
                "TotalAmount": 423.00000000000006
            },
            {
                "PONumber": "11055",
                "StyleNumber": "XMP - 93393",
                "Colorway": "DARK BLUE ",
                "SizeRange": "28 - 38",
                "Sizes": "30",
                "POID": "38710",
                "Description": "MENS LONG DENIM ",
                "HsCode": "7654321",
                "SizeQty": "150",
                "Currency": "Dollar",
                "POQuantity": "3600",
                "ShippedQty": "0",
                "TotalQuantity": 150,
                "UnitPrice": "4.23",
                "TotalAmount": 634.5000000000001
            },
            {
                "PONumber": "11055",
                "StyleNumber": "XMP - 93393",
                "Colorway": "DARK BLUE ",
                "SizeRange": "28 - 38",
                "Sizes": "32",
                "POID": "38710",
                "Description": "MENS LONG DENIM ",
                "HsCode": "7654321",
                "SizeQty": "200",
                "Currency": "Dollar",
                "POQuantity": "3600",
                "ShippedQty": "0",
                "TotalQuantity": 200,
                "UnitPrice": "4.23",
                "TotalAmount": 846.0000000000001
            },
            {
                "PONumber": "11055",
                "StyleNumber": "XMP - 93393",
                "Colorway": "DARK BLUE ",
                "SizeRange": "28 - 38",
                "Sizes": "34",
                "POID": "38710",
                "Description": "MENS LONG DENIM ",
                "HsCode": "7654321",
                "SizeQty": "250",
                "Currency": "Dollar",
                "POQuantity": "3600",
                "ShippedQty": "0",
                "TotalQuantity": 250,
                "UnitPrice": "4.23",
                "TotalAmount": 1057.5
            },
            {
                "PONumber": "11055",
                "StyleNumber": "XMP - 93393",
                "Colorway": "DARK BLUE ",
                "SizeRange": "28 - 38",
                "Sizes": "36",
                "POID": "38710",
                "Description": "MENS LONG DENIM ",
                "HsCode": "7654321",
                "SizeQty": "300",
                "Currency": "Dollar",
                "POQuantity": "3600",
                "ShippedQty": "0",
                "TotalQuantity": 300,
                "UnitPrice": "4.23",
                "TotalAmount": 1269.0000000000002
            },
            {
                "PONumber": "11055",
                "StyleNumber": "XMP - 93393",
                "Colorway": "DARK BLUE ",
                "SizeRange": "28 - 38",
                "Sizes": "38",
                "POID": "38710",
                "Description": "MENS LONG DENIM ",
                "HsCode": "7654321",
                "SizeQty": "350",
                "Currency": "Dollar",
                "POQuantity": "3600",
                "ShippedQty": "0",
                "TotalQuantity": 350,
                "UnitPrice": "4.23",
                "TotalAmount": 1480.5000000000002
            }
        ],
        "PackingList": [
            {
                "PONO": "6380",
                "LabelCode": "MOD016-ABA",
                "DetailData": [
                    {
                        "CtnRange": "1-150",
                        "TotalCtn": "150",
                        "StyleNo": "XMP-91159 A ",
                        "Color": "7",
                        "SizeRange": [
                            "32X32",
                            "34X32",
                            "36X32",
                            "38X32",
                            "40X32"
                        ],
                        "Size1Qty": "600",
                        "Size2Qty": "600",
                        "Size3Qty": "1200",
                        "Size4Qty": "1200",
                        "Size5Qty": "600",
                        "Size6Qty": "0",
                        "Size7Qty": "0",
                        "Size8Qty": "0",
                        "PcsPerCtn": "24",
                        "NetWeight": "4.80",
                        "GrossWeight": "5.50",
                        "CartonDimensions": "14 X 12 X 9 INCH"
                    }
                ]
            },
            {
                "PONO": "11055",
                "LabelCode": "MOD016-123",
                "DetailData": [
                    {
                        "CtnRange": "1-300",
                        "TotalCtn": "300",
                        "StyleNo": "XMP - 93393",
                        "Color": "DARK BLUE ",
                        "SizeRange": [
                            "28",
                            "30",
                            "32",
                            "34",
                            "36",
                            "38"
                        ],
                        "Size1Qty": "100",
                        "Size2Qty": "150",
                        "Size3Qty": "200",
                        "Size4Qty": "250",
                        "Size5Qty": "300",
                        "Size6Qty": "350",
                        "Size7Qty": "0",
                        "Size8Qty": "0",
                        "PcsPerCtn": "16",
                        "NetWeight": "3.60",
                        "GrossWeight": "4.50",
                        "CartonDimensions": "14 X 12 X 9 INCH"
                    }
                ]
            }
        ]
    }


    const getCurrencySymbol = (currency) => {
        switch ((currency || '').toLowerCase()) {
            case 'euro': return '€';
            case 'taka': return '৳';
            case 'dollar':
            default: return '$';
        }
    };
   const flattenItems = (invs) => {
    if (!invs || !Array.isArray(inv.DetailList)) return [];

   
    return inv.DetailList.map(item => {
        const symbol = getCurrencySymbol(item.Currency);
        return {
            ORDERNO: item.PONumber || '',
            STYLENO: item.StyleNumber || '',
            COLOR: item.Colorway || '',
            DESCRIPTION: item.Description || '',
            QUANTITY: parseFloat(item.TotalQuantity || 0),
            UNITPRICE: `${symbol}  ${parseFloat(item.UnitPrice || 0).toFixed(2)}`,
            hs: item.HsCode || '',
            AMOUNT: `${symbol}${parseFloat(item.TotalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            Currency: item.Currency || 'Dollar',
        };
    });
};


const groupAndSumItems = (itemss) => {
    const grouped = {};

    itemss.forEach(item => {
        const key = `${item.ORDERNO}|${item.STYLENO}|${item.UNITPRICE}|${item.COLOR}`;
        if (!grouped[key]) {
            grouped[key] = { ...item };
        } else {
            grouped[key].QUANTITY += parseFloat(item.QUANTITY || 0);

            const amount = parseFloat((item.AMOUNT || '0').replace(/[^0-9.]/g, ''));
            const existingAmount = parseFloat((grouped[key].AMOUNT || '0').replace(/[^0-9.]/g, ''));
            const symbol = item.UNITPRICE.match(/^[^\d]+/)?.[0] || '$';

            grouped[key].AMOUNT = `${symbol}${(existingAmount + amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        }
    });

    return Object.values(grouped);
};


    const flattenedItems = flattenItems(inv);
    const groupedItems = groupAndSumItems(flattenedItems);
    const chunkedItems = splitRows(groupedItems);

    return (
        <PDFViewer style={{ width: '100vw', height: '100vh' }}>
            <Document>
                <Page size="A3" style={styles.page}>
                    <View>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', fontFamily: 'book-antiqua-bold' }}>{inv.VenderName}</Text>
                            <Text style={{ fontFamily: 'Roboto-Bold', marginTop: 3, textAlign: 'center' }}>{inv.VenderAddress}</Text>

                        </View>

                        <Text style={styles.title}>COMMERCIAL INVOICE</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', gap: 40,  fontSize: 11, border: 1, borderRadius: 5, padding: 5, marginBottom: 5 }}>
                            <View style={{ width: '33%' }}>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>Applicant:</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>{inv.ImporterCompanyName}</Text>
                                <Text style={{ fontFamily: 'Century Gothic', width: '60%' }}>{inv.ImporterLegalAddress}</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>TEL.{inv.ImporterPhoneNumber}  FAX:212-594-5551</Text>
                            </View>


                            <View style={{ width: '37%' }}>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>INVOICE NO :  <Text style={{ fontFamily: 'Century Gothic', }}>{inv.InvoiceNo}</Text></Text>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>Date               : <Text style={{ fontFamily: 'Century Gothic', }}>{inv.InvoiceDate}</Text></Text>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>S/C NO          :  <Text style={{ fontFamily: 'Century Gothic', }}>{inv.SCNo}</Text></Text>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>Date               : <Text style={{ fontFamily: 'Century Gothic', }}>{inv.SCDate}</Text></Text>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>EXP NO         :  <Text style={{ fontFamily: 'Century Gothic', }}>{inv.EXPNo}</Text></Text>
                                {/* <Text style={{ fontFamily: 'Roboto-Bold', }}>HBL NO         :  <Text style={{ fontFamily: 'Century Gothic', }}>SKYDHAKA24250782</Text></Text> */}
                                {/* <Text style={{ fontFamily: 'Roboto-Bold', }}>TRANSFERRING BANK'S REFERENCE NO :  <Text style={{ fontFamily: 'Century Gothic', }}>091IEUT243660501</Text></Text> */}
                            </View>

                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', gap: 40, fontSize: 11, border: 1, borderRadius: 5, padding: 5, marginBottom: 5 }}>
                            <View style={{ width: '33%' }}>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>Notify:</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>{inv.ImporterCompanyName}</Text>
                                <Text style={{ fontFamily: 'Century Gothic', width: '60%' }}>{inv.ImporterLegalAddress}</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>TEL.{inv.ImporterPhoneNumber}  FAX:212-594-5551</Text>
                            </View>



                            <View style={{ width: '37%' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>Date :</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>{inv.ETD}</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>ETD/ETA :</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>{inv.ETD}</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>BY :</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>{inv.ShipMode}</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>PAYMENT TERMS:</Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>{inv.PaymentTerms}</Text>
                                </View>


                            </View>


                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', gap: 40,  fontSize: 11, border: 1, borderRadius: 5, padding: 5, marginBottom: 5 }}>
                            <View style={{ width: '33%' }}>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>ALSO NOTIFY PARTY: </Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>ATLANTIC FREIGHT BROKER,</Text>
                                <Text style={{ fontFamily: 'Century Gothic', width: '50%' }}>BROOKLYN NAVY YARD, BLDG. 292,SUITE 322, BROOKLYN, NY 11205,</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>TEL: 718-637-6511, </Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>EMAIL: BROKER@ATLANTICFB.COM</Text>

                            </View>



                            <View style={{ width: '37%' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>PORT OF LOADING : </Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>{inv.PortOflLoading}</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>PORT OF DESTINATION : </Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>{inv.PortOfDestination}</Text>
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>PORT OF DISCHARGE : </Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>{inv.PortOfDischarge}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontFamily: 'Roboto-Bold', width: 130 }}>BILL OF LOADING NO.  : </Text>
                                    <Text style={{ fontFamily: 'Century Gothic' }}>{inv.BillOfLoadingNo}</Text>
                                </View>

                            </View>


                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', gap: 40,  fontSize: 11, border: 1, borderRadius: 5, padding: 5, marginBottom: 5 }}>
                            <View style={{ width: '33%' }}>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>APPLICANT BANK :</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>ISRAEL DISCOUNT BANK OF NEW YORK.</Text>
                                <Text style={{ fontFamily: 'Century Gothic', width: '50%' }}>1114 AVENUE OF THE AMERICAS,NEW YORK, NY 10036</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>ATTN: MARIO TEDESCHI</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>Collection dept. 8th Floor.</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>Swift Code- IDB is IDBYUS33</Text>
                            </View>
                            <View style={{ width: '37%' }}>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>UNTO THE ORDER OF :</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>PUBALI BANK LTD.</Text>
                                <Text style={{ fontFamily: 'Century Gothic', width: '50%' }}>NARAYANGANJ BRANCH,81, B.B. ROAD, NARAYANGANJ,</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>BANGLADESH.</Text>

                                <Text style={{ fontFamily: 'Century Gothic', }}>Swift Code- IDB is IDBYUS33</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>ACCOUNT NAME: P.M. KNITTEX (PVT.) LTD.</Text>
                                <Text style={{ fontFamily: 'Century Gothic', }}>ACCOUNT NO  : 0037901038196</Text>
                            </View>




                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', gap: 40, fontSize: 11, border: 1, borderRadius: 5, padding: 5, marginBottom: 5 }}>
                            <View>
                                <View >
                                    <Text style={{ fontFamily: 'Roboto-Bold', }}>NAME AND ADDRESS OF ACTUAL MANUFACTURER:  </Text>
                                    <Text style={{ fontFamily: 'Roboto-Bold', }}>Manufacturer Add: <Text  style={{ fontFamily: 'Century Gothic', }}> {inv.VenderName}</Text></Text>
                                    <Text style={{ fontFamily: 'Roboto-Bold', }}>Address: <Text style={{ fontFamily: 'Century Gothic', }}>  {inv.VenderAddress}</Text></Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40,  }}>

                                    <Text >From: <Text style={{ fontFamily: 'Roboto-Bold', }}> AS PER PROFORMA INVOICE NO : </Text></Text>
                                    <Text >To: <Text style={{ fontFamily: 'Roboto-Bold', }}>AS PER PROFORMA INVOICE NO : </Text></Text>
                                </View>
                                <View>

                                    <Text >SHIPPING TERMS: <Text style={{ fontFamily: 'Roboto-Bold', }}>FOB CHITTAGONG //BANGLADESH </Text></Text>
                                    {/* <Text style={{ alignSelf: 'center' }}>To: <Text style={{ fontFamily: 'Roboto-Bold', }}>AS PER PROFORMA INVOICE NO : </Text></Text> */}
                                </View>
                            </View>
                            <View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40,}}>

                                    <View>
                                        <Text style={{ alignSelf: 'center' }}>GR.WT: <Text style={{ fontFamily: 'Roboto-Bold', }}> 6900004 KGS</Text></Text>
                                    </View>
                                    <View>
                                        <Text style={{ alignSelf: 'center' }}>NT.WT: <Text style={{ fontFamily: 'Roboto-Bold', }}>6900004 KGS </Text></Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40, }}>

                                    <View>
                                        <Text style={{ alignSelf: 'center' }}>T. CTNS :<Text style={{ fontFamily: 'Roboto-Bold', }}> 1250</Text></Text>
                                    </View>
                                    <View>
                                        <Text style={{ alignSelf: 'center' }}>T.CBM  : <Text style={{ fontFamily: 'Roboto-Bold', }}>31.25</Text></Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View>
                            {chunkedItems.map((chunk, chunkIndex) => {
                                const currency = (chunk[0]?.Currency || 'Dollar').toLowerCase();
                                const symbol = getCurrencySymbol(currency);
                                
                                const totalAmount = chunk.reduce((sum, item) => {
                                    const cleanAmount = (item.AMOUNT || '0').replace(/[^0-9.]/g, '');
                                    return sum + parseFloat(cleanAmount || 0);
                                }, 0);
                                const formattedTotalAmount = `${symbol}   ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
                                const totalQuantity = chunk.reduce((sum, item) => sum + parseFloat(item.QUANTITY || 0), 0);
                              

                                return (
                                    <View key={chunkIndex} wrap={false}>
                                        <TableHeader columnWidths={columnWidths} styles={styles} />

                                        {chunk.map((item, rowIndex) => (
                                            <View key={rowIndex} style={styles.tableRow} wrap={false}>
                                                {[
                                                    item.ORDERNO,
                                                    item.STYLENO,
                                                    item.COLOR,
                                                    item.DESCRIPTION,
                                                    `${item.QUANTITY || 0}PCS`,
                                                    item.UNITPRICE,
                                                    item.hs,
                                                    item.AMOUNT,
                                                ].map((val, colIndex) => (
                                                    <Text
                                                        key={colIndex}
                                                        style={{
                                                            ...styles.cell,
                                                            width: columnWidths[colIndex],
                                                            borderLeft: 1,
                                                            borderRight: colIndex === 7 ? 1 : 0,
                                                        }}
                                                    >
                                                        {val}
                                                    </Text>
                                                ))}
                                            </View>
                                        ))}

                                        {/* Total Row */}
                                        <View style={{ ...styles.tableRow, backgroundColor: '#e6e6e6' }} wrap={false}>
                                            {[
                                                '', // ORDERNO
                                                '', // STYLENO
                                                '', // COLOR
                                                'Total:', // DESCRIPTION
                                                `${totalQuantity}PCS`, // QUANTITY
                                                '', // UNIT PRICE
                                                '', // HS Code
                                                formattedTotalAmount // AMOUNT
                                            ].map((val, colIndex) => (
                                                <Text
                                                    key={colIndex}
                                                    style={{
                                                        ...styles.cell,
                                                        width: columnWidths[colIndex],
                                                        borderLeft: 1,
                                                        borderRight: colIndex === 7 ? 1 : 0,
                                                        fontWeight: colIndex >= 4 ? 'bold' : 'normal',
                                                    }}
                                                >
                                                    {val}
                                                </Text>
                                            ))}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>




                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', gap: 40, fontSize: 11, border: 1, borderRadius: 5, padding: 5, marginBottom: 10, marginTop: 15 }}>
                            <View style={{ width: '33%' }} wrap={false}>
                                <Text style={{ fontFamily: 'Roboto-Bold', }}>( US DOLLAR: .)</Text>
                                <Text >SIDE MARKS: <Text style={{ fontFamily: 'Roboto-Bold', }}> </Text></Text>
                                <Text >DKNY <Text style={{ fontFamily: 'Roboto-Bold', }}> </Text></Text>
                                <Text >P.O. #: <Text style={{ fontFamily: 'Roboto-Bold', }}> </Text></Text>
                                <Text >STYLE #: <Text style={{ fontFamily: 'Roboto-Bold', }}> </Text></Text>
                                <Text >COLOUR: <Text style={{ fontFamily: 'Roboto-Bold', }}> </Text></Text>
                                <Text >DIM/PK : <Text style={{ fontFamily: 'Roboto-Bold', }}> </Text></Text>
                                <Text >QUANTITY: <Text style={{ fontFamily: 'Roboto-Bold', }}> </Text></Text>
                                <Text >CARTON NUMBER : OF: <Text style={{ fontFamily: 'Roboto-Bold', }}> </Text></Text>
                                <Text >MADE IN BANGLADESH. <Text style={{ fontFamily: 'Roboto-Bold', }}> </Text></Text>
                                <Text >GROSS WEIGHT: KGS <Text style={{ fontFamily: 'Roboto-Bold', }}> </Text></Text>
                                <Text >NET WEIGHT: KGS <Text style={{ fontFamily: 'Roboto-Bold', }}> </Text></Text>
                                <Text >RN #: <Text style={{ fontFamily: 'Roboto-Bold', }}> </Text></Text>
                                <Text >DIMS : CMS<Text style={{ fontFamily: 'Roboto-Bold', }}> </Text></Text>

                            </View>

                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 50 }}>
                            <Text style={{ borderTop: 1, fontFamily: 'Roboto-Bold' }}>Authorized Signature</Text>
                        </View>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    )
}
Font.register({ family: 'book-antiqua-bold', src: '/fonts/book-antiqua-bold.ttf' });

Font.register({ family: 'Roboto-Bold', src: '/fonts/Roboto-Bold.ttf' });

Font.register({
    family: 'Century Gothic',
    src: '/fonts/Century Gothic.ttf'
});

export default ComInvoice
TableHeader.propTypes = {
    columnWidths: PropTypes.arrayOf(PropTypes.string).isRequired,
    styles: PropTypes.object.isRequired,
};