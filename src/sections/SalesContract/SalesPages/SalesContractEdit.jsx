import React, { useState, useEffect, useMemo, useCallback } from "react";
import { addDays } from 'date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import Scrollbar from "src/components/scrollbar";
import {
    Autocomplete, TextField, Grid, Button, Container, Typography, Box, Stepper, Step, StepLabel, Card, FormGroup, FormControlLabel, Checkbox, List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton
} from "@mui/material";
import { Upload } from "src/components/upload";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from '@mui/lab';
import Stack from '@mui/material/Stack';
import Iconify from "src/components/iconify";
import { paths } from 'src/routes/paths';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// import UploadFileIcon from "@mui/icons-material/UploadFile";
// import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker } from "@mui/x-date-pickers";
import { Get, Post } from "src/api/apibasemethods";
import FormProvider, {
    RHFSwitch,
    RHFTextField,
    RHFUpload,
    RHFUploadAvatar,
    RHFAutocomplete,
} from 'src/components/hook-form';
import axios from "axios";
import PropTypes from "prop-types";
import { decryptObjectKeys } from "src/api/encryption";
import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";





const SalesContractEdit = ({ selectedBooking, currentStyles, urlData }) => {



    const userData = useMemo(() => {
        const parsedData = JSON.parse(localStorage.getItem('UserData'));
        return decryptObjectKeys(
            Array.isArray(parsedData) ? parsedData : [parsedData]  // Ensure it's wrapped in an array if it's not already
        );
    }, []);
    const certificationOptions = ["Yes", "No"];
    const [selectedCertification, setSelectedCertification] = useState(null);
    const [certificationValues, setCertificationValues] = useState({
        TC: 0,
        GOTS: 0,
        Others: 0
    });
    const [paymentData, setPaymentData] = useState({
        PaymentMode: '',
        PaymentType: '',
        ToleranceInDays: 0,
    });
    const parseDate = (dateStr) => {
        const [day, month, year] = dateStr.split('/').map(Number);
        return new Date(year, month - 1, day);
    };


    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCertificationValues((prev) => ({
            ...prev,
            [name]: checked ? 1 : 0, // Set 1 when checked, 0 when unchecked
        }));
    };
    const [showBank, setShowBank] = useState(false);
    const [toggle, setToggle] = useState(false)
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalcomm, settotalcomm] = useState(0);
    const [totalcommpc, settotalcommpc] = useState(0);
    const [cancelQuantity, setCancelQuantity] = useState("");
    const [totalMark, setTotalMark] = useState(0); // Initialize with 0

    // Function to calculate commission


    const userdata = JSON.parse(localStorage.getItem("UserData"))

    const validationSchema = Yup.object().shape({

        // SalesContractNo: Yup.string()
        //     .required("Reference No is required"),


        // IssuingDate: Yup.date().required("placementDate is required"),
        // shipmentDateBuyer: Yup.date()
        //     .required("Shipment Date (Buyer) is required")
        //     .min(Yup.ref('IssuingDate'), "Shipment Date (Buyer) must be after Placement Date"),

        // ApplyDate: Yup.date()
        //     .required("Shipment Date (Vendor) is required")
        //     .min(Yup.ref('IssuingDate'), "Shipment Date (Vendor) must be after Placement Date"),
        // customer: Yup.object().nullable().required("Customer is required"),

        // supplier: Yup.object().nullable().required("Supplier is required"),


        // Currency: Yup.object().nullable().required("Currency is required"),

        // certification: Yup.string().required("Certification selection is required"),
        // buyerCommissions: Yup.number(),
        // vendorCommissions: Yup.number(),
        // totalMarkups: Yup.number(),
        // comments: Yup.string().nullable(),


    });

    const [customerData, setCustomerData] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [SupplierData, setSupplierData] = useState([]);
    const fbsrc = ["Local", "Imported"]
    const salesType = ["SC-SSBL", "SC-SHKL", "SC-KIK", "SC-SOK"];
    const [selectedLCOption, setSelectedLCOption] = useState(selectedBooking?.salesContractType || null);
    const [Fbsrc, setFbsrc] = useState(selectedBooking?.fabricSource || null);

    const defaultValues = useMemo(
        () => ({
            SalesContractNo: selectedBooking?.salesContractNo || '',
            ApplyDate: selectedBooking?.ApplyDate || "",
            IssuingDate: selectedBooking?.IssuingDate || null,
            ExpectedLCDate: selectedBooking?.expectedLCDate || '',

            customer: selectedBooking?.customerID
                ? customerData?.find((x) => x.customerID === selectedBooking.customerID)
                : null,

            supplier: selectedBooking?.supplierID
                ? SupplierData.find((x) => x.venderLibraryID === selectedBooking.supplierID)
                : null,
            ApplicantBankID: selectedBooking?.bankID
                ? currencies.find((x) => x.bankID === selectedBooking.bankID.toString())
                : null,

            PaymentMode: paymentData.PaymentMode,
            PaymentType: paymentData.PaymentType,
            ToleranceInDays: paymentData.ToleranceInDays,
            Items: selectedBooking?.items,
            buyerCommissions: selectedBooking?.commission || 0,
            vendorCommissions: selectedBooking?.vendorCommission || 0,
            PortOfDestination: selectedBooking?.portOfDestination || '',
            ReasonOfDelayInLC: selectedBooking?.reasonOfDelayInLC || '',
            LogisticComments: selectedBooking?.logisticComments || '',
            MerComm: selectedBooking?.merchandiserComments || '',
            SalesContractType: selectedBooking?.salesContractType && salesType.includes(selectedBooking.salesContractType)
                ? selectedBooking.salesContractType
                : null,
            FabricSource: selectedBooking?.fabricSource && fbsrc.includes(selectedBooking.fabricSource)
                ? selectedBooking.fabricSource
                : null,

            ExpiryDate: selectedBooking?.expiryDate
                ? new Date(selectedBooking.expiryDate)
                : null,
            ItemDes: selectedBooking?.itemDescription || '',
            totalAmount: selectedBooking?.totalValue || 0,
            totalQuantity: selectedBooking?.totalSalesOrderQty || 0,
            totalcomm: selectedBooking?.synergiesTotalCommission || 0,
            totalcommpc: selectedBooking?.commissionInPercent || 0,

        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            selectedBooking,
            customerData,
            paymentData,
            SupplierData,
            currencies
        ]
    );



    const methods = useForm({
        resolver: yupResolver(validationSchema),

    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();
    const selectedLCOptions = watch("lcopt");
    // Sample data for dropdowns



    const [totalMarkup, setTotalMarkup] = useState("0");
    const Transactions = [
        { TransID: 1, TransName: "Services" },
        { TransID: 2, TransName: "Trade" }];
    const paymentType = [
        { id: 1, name: "L/C" },
        { id: 2, name: "TT" },
        { id: 3, name: "Contractual" },
        { id: 4, name: "DP" },
        { id: 5, name: "DA" }
    ];

    const supPerCustom = [{ id: 262, name: "Synergies Sourcing BD" },]
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [SalesContractTypes, setSalesContractType] = useState(null);

    function toUTCISOString(date) {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
    }
    function parseDateFromDDMMYYYY(dateStr) {
        const [day, month, year] = dateStr.split("/").map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    }
    function formatDateToDDMMYYYY(dateStr) {
        const date = new Date(dateStr);
        if (Number.isNaN(date)) return ''; // Invalid date

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    const settings = useSettingsContext();
    useEffect(() => {

        Get("https://ssblapi.m5groupe.online:6449/api/customer")
            .then(response => {
                const decryptedData = decryptObjectKeys(response.data);

                // ✅ Convert decrypted customerID to number
                const formattedData = decryptedData.map(item => ({
                    customerID: Number(item.customerID), // Convert to number
                    customerName: item.customerName,
                }));

                setCustomerData(formattedData);
            })
            .catch(error => console.error("Error fetching customers:", error));
    }, []);




    useEffect(() => {
        Get("https://ssblapi.m5groupe.online:6449/api/Supplier")
            .then(response => {
                const decryptedData = decryptObjectKeys(response.data);

                // ✅ Convert supplierID to number
                const formattedData = decryptedData.map(item => ({
                    venderLibraryID: Number(item.venderLibraryID), // Convert to number
                    venderName: item.venderName,
                }));

                setSupplierData(formattedData);
            })
            .catch(error => console.error("Error fetching suppliers:", error));
    }, []);


    useEffect(() => {
        Get("https://ssblapi.m5groupe.online:6449/api/Bank")
            .then(response => {
                const decryptedData = decryptObjectKeys(response.data);

                // ✅ Convert supplierID to number
                const formattedData = decryptedData.map(item => ({
                    bankID: Number(item.bankID), // Convert to number
                    bankName: item.bankName,
                }));
                setCurrencies(decryptedData)
            })
            .catch(error => console.error("Error fetching currency:", error));
    }, []);


    const [selectedRows, setSelectedRows] = useState([]);
    useEffect(() => {
        if (currentStyles.length > 0) {
            setSelectedRows(currentStyles);
        }
    }, [currentStyles]);

    const InsertMstData = async (DataToInsert) => {
        try {
            let res;

            if (selectedBooking) {
                // ✅ Send JSON for UPDATE API (PUT)
                res = await axios.put(`https://ssblapi.m5groupe.online:6449/api/SalesContract/edit-master/${urlData?.id}`, DataToInsert, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                return res.status === 200;
            }
            // eslint-disable-next-line
            else {


                res = await Post(`https://ssblapi.m5groupe.online:6449/api/SalesContract/add-master`, DataToInsert);

                if (res.status === 200) {
                    const { contractID } = res.data;
                    if (contractID) {
                        return contractID; // ✅ Return ContractID
                    }
                }
                enqueueSnackbar('Error: SalesID missing from response', { variant: 'error' });
                return null;
            }
        } catch (error) {
            console.error(`Error creating master data:`, error);
            return null; // ✅ Ensure failure return
        }
    };



    const InsertDetailData = async (contractID, details) => {
        if (!contractID) {
            enqueueSnackbar("Error: Invalid ContractID", { variant: "error" });
            return false; // ✅ Return false if no ContractID
        }

        const detailPayload = details.map(row => ({
            salesContractID: contractID,
            poid: row.poid || 0,
            styleNo: row.styleNo || "",
            article: row.article || "",
            pono: row.pono || "",
            cusShipDate: parseDateFromDDMMYYYY(row.cusShipDate).toISOString() || null,
            quantity: row.quantity || 0,
            rate: row.rate || 0,
            totalAmount: totalAmount || 0,
            currency: row.currency || "USD",
            newRate: row.newRate || 0,
            commission: row.commission || 0,
            vendorCommission: row.vendorCommission || 0,
            markUpPerPc: row.styleMarkUpPerPc || 0,
        }));

        try {
            const res = await Post(`https://ssblapi.m5groupe.online:6449/api/SalesContract/add-detail`, detailPayload);
            return res.status === 200; // ✅ Return true if success
        } catch (error) {
            console.error(`Error creating detail data:`, error);
            return false; // ✅ Ensure failure return
        }
    };

    const onSubmit = handleSubmit(async (data) => {
        if (selectedRows?.length === 0) {
            enqueueSnackbar("Please select at least one style", { variant: "error" });
            return false; // ✅ Stop if Detail API fails
        }

        try {
            const mstData = {
                SalesContractNo: data.SalesContractNo || "",
                CustomerID: data.customer?.customerID,
                SupplierID: data.supplier?.venderLibraryID,
                ApplyDate: data.ApplyDate ? toUTCISOString(new Date(data.ApplyDate)) : null,
                BankID: data.ApplicantBankID.bankID || 0,
                SalesContractDate: data.IssuingDate ? toUTCISOString(new Date(data.IssuingDate)) : null,
                ExpiryDate: toUTCISOString(data?.ExpiryDate),
                Payment: data.PaymentMode,
                PaymentType: data.PaymentType,
                ToleranceInDays: data.ToleranceInDays,
                Items: data.Items,
                FabricSource: data.FabricSource,
                ExpectedLCDate: toUTCISOString(new Date(data.ExpectedLCDate)),
                PortOfDestination: data.PortOfDestination || "",
                ReasonOfDelayInLC: data.ReasonOfDelayInLC || "",
                ItemDescription: data.ItemDes,
                SalesContractType: data.SalesContractType,
                LogisticComments: data.LogisticComments || "",
                MerchandiserComments: data.MerComm || "",
                ApplicantBankRequired: data?.ApplicantBankRequired,
                ApprovalByHOD: data.ApprovalByHOD,
                ApprovalByManagment: data.ApprovalByManagment,
                ApprovalByGM: data.ApprovalByGM,
                totalValue: data.totalAmount,
                synergiesCommission: 0.000,
                synergiesTotalCommission: totalcomm,
                commissionInPercent: totalcommpc,
                totalSalesOrderQty: totalQuantity,
                salesPaymentMode: data.PaymentMode,
                salesTolerance: data.ToleranceInDays,

            };

            console.log('mstData', mstData);

            // ✅ First, call Master API to get ContractID
            const contractID = await InsertMstData(mstData);

            if (!contractID) {
                enqueueSnackbar("Something went wrong", { variant: "error" });
                return false;
            }

            // ✅ If ContractID is received, submit detail data
            const isDetailSuccess = await InsertDetailData(contractID, selectedRows);

            if (!isDetailSuccess || !selectedRows) {
                enqueueSnackbar("Something went wrong", { variant: "error" });
                return false;
            }

            enqueueSnackbar("Data Uploaded Successfully", { variant: "success" });
            return true;

        } catch (error) {
            console.error("Error submitting data:", error);
            enqueueSnackbar("Something went wrong", { variant: "error" });
            console.log(toUTCISOString(new Date(data.ApplyDate)))
            // console.log(toUTCISOString(new Date(data.IssuingDate)))
            console.log(data.ExpiryDate, 'exp');
            // console.log(toUTCISOString(new Date(data.ExpectedLCDate)))
            return false;
        }
    });
    // console.log(values, "cutomer")
    useEffect(() => {
        if (selectedRows.length > 0) {
            const total = selectedRows.reduce((sum, row) => sum + (row?.markupPerPc || 0), 0);
            const average = total / selectedRows.length;
            setTotalMark(average);
            console.log("tt", average)
        }
        // setTotalMark(0); // Default if no data
        // eslint-disable-next-line 
    }, [selectedRows]);



    const [open, setOpen] = useState(false);
    const [styleNo, setStyleNo] = useState(null);
    const [PONO, setPONO] = useState('');
    const [dataList, setDataList] = useState([]);


    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);


    const rowsPerPage = 10;

    // Open/Close Dialog
    const handleOpen = () => setOpen(true);
    const handleClose = async () => {

        setOpen(false);

        setDataList([]);
    };
    const handleGetData = async () => {

        if (!values?.customer?.customerID || !values?.supplier?.venderLibraryID) {
            console.warn("Customer or Supplier not selected");
            return;
        }

        setLoading(true);

        try {
            const customerId = values.customer.customerID;
            const supplierId = values.supplier.venderLibraryID;

            let apiUrl = `https://ssblapi.m5groupe.online:6449/api/poreport?customerId=${customerId}&supplierId=${supplierId}`;

            if (PONO?.trim()) {
                apiUrl += `&pono=${encodeURIComponent(PONO.trim())}`;
            }

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();
            console.log(data);
            setDataList(data);




        } catch (error) {
            console.error("Error fetching data:", error);
            setDataList([]);
        }

        setLoading(false);
    };


    const getRowId = (row) => `${row.styleNo}_${row.article}_${row.pono}_${row.cusShipDate}_${row.quantity}_${row.rate}_${row.totalAmount}`;

    const handleSelectRow = (row) => {
        const rowId = getRowId(row);
        const isSelected = selectedRows.some(selected => getRowId(selected) === rowId);

        let updatedSelectedRows;
        if (isSelected) {
            updatedSelectedRows = selectedRows.filter(selected => getRowId(selected) !== rowId);
        } else {
            updatedSelectedRows = [...selectedRows, row];
        }

        setSelectedRows(updatedSelectedRows);
    };

    // import { useCallback, useEffect } from "react";

    const fetchPOData = useCallback(async () => {
        if (!selectedRows || selectedRows.length === 0) return;

        const poids = selectedRows.map((item) => item.poid).join(',');

        try {
            // Fetch item descriptions
            const descriptionResponse = await fetch(`https://ssblapi.m5groupe.online:6449/api/SalesContract/description-by-poid?poids=${poids}`);
            if (!descriptionResponse.ok) throw new Error("Failed to fetch item description");
            const descriptionData = await descriptionResponse.json();

            // Fetch brand data
            const brandResponse = await fetch(`https://ssblapi.m5groupe.online:6449/api/SalesContract/brands-by-poids?poids=${poids}`);
            if (!brandResponse.ok) throw new Error("Failed to fetch brand data");
            const brandData = await brandResponse.json();

            // Format and set form values
            const formattedBrand = Array.isArray(brandData)
                ? brandData.join(", ")
                : brandData || "";

            setValue("ItemDes", Array.isArray(descriptionData) ? descriptionData.join(", ") : " ");
            setValue("Brand", formattedBrand);

        } catch (error) {
            console.error("Error during fetch:", error.message);
        }
    }, [selectedRows, setValue]);

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchPOData()]);
            setLoading(false);
        };
        fetchData();
    }, [fetchPOData]);


    useEffect(() => {

        let latestRow = null;
        let latestDate = new Date(0);

        selectedRows.forEach(row => {
            const rowDate = new Date(row.cusShipDate);
            console.log("Row Date:", rowDate);
            if (rowDate > latestDate) {
                latestDate = rowDate;
                latestRow = row;
            }
        });

        console.log("Latest Row:", latestRow);

        if (latestRow) {
            console.log("Latest Row:", latestRow);
            const newExpiryDate = addDays(latestDate, 15);
            setValue("ExpiryDate", newExpiryDate);
            if (latestRow.poid) {
                console.log("Poid:", latestRow.poid);
                fetch(`https://ssblapi.m5groupe.online:6449/api/SalesContract/payment-by-poid?poid=${latestRow.poid}`)
                    .then(res => res.json())
                    .then(res => {
                        console.log(res);
                        if (Array.isArray(res) && res.length > 0) {
                            const { paymentModeName, paymentTypeName, toleranceindays } = res[0];
                            setPaymentData({
                                PaymentMode: paymentModeName,
                                PaymentType: paymentTypeName,
                                ToleranceInDays: toleranceindays,
                            });
                        } else {
                            setPaymentData({
                                PaymentMode: latestRow.paymentModeName || '',
                                PaymentType: latestRow.paymentTypeName || '',
                                ToleranceInDays: latestRow.toleranceindays || 0,
                            });
                        }
                    })
                    .catch(err => console.error("Failed to fetch payment info", err));
            }

        }
    }, [selectedRows, setValue]);

    useEffect(() => {
        console.log("selectedRows updated:", selectedRows);
    }, [selectedRows]);

    // Handle Pagination
    const handlePageChange = (event, value) => setCurrentPage(value);

    // Paginate Data
    const paginatedData = dataList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);


    // useEffect(() => {
    //     const updatedRows = selectedRows.map((row) => ({
    //         ...row,
    //         markupPerPc: row.itemPrice ? (Number(row.itemPrice) - Number(row.vendorPrice || row.itemPrice)) : 0,
    //         contractValue: row.poQuantity ? (Number(row.poQuantity) * Number(row.itemPrice || 0)) : 0,
    //     }));
    //     console.log("markup", updatedRows)
    //     // Only update if the new state is different from the current state
    //     setSelectedRows(prevRows => {
    //         const isSame = JSON.stringify(prevRows) === JSON.stringify(updatedRows);
    //         return isSame ? prevRows : updatedRows;
    //     });
    //     // eslint-disable-next-line 
    // }, [selectedRows]);

    console.log("selectedRows", selectedRows)

    useEffect(() => {
        const totalQty = selectedRows.reduce((sum, row) => sum + (row.quantity || 0), 0);
        const totalVal = selectedRows.reduce((sum, row) => sum + (row.totalAmount || 0), 0).toFixed(2);
        // Buyer Commission Calculation
        const Commission = selectedRows.reduce((sum, row) => {
            const qty = Number(row.quantity);
            const rate = Number(row.newRate); // Buyer FOB
            const commission = row.commission;
            console.log(row.commission, 'add')
            const commValue = (commission * rate * qty) / 100;
            return sum + Number(commValue.toFixed(2));
        }, 0);

        // Vendor Commission Calculation
        const VendorCommission = selectedRows.reduce((sum, row) => {
            const qty = Number(row.quantity || 0);
            const rate = Number(row.rate || 0); // Vendor Price
            const vendorComm = Number(row.vendorCommission || 0);
            const vendorCommValue = (vendorComm * rate * qty) / 100;
            return sum + Number(vendorCommValue.toFixed(2));
        }, 0);

        // MarkUp Per Pc Calculation
        const MarkUpPerPc = selectedRows.reduce((sum, row) => {
            const qty = Number(row.quantity || 0);
            const markup = Number(row.styleMarkUpPerPc || 0);
            const markupValue = markup * qty;
            return sum + Number(markupValue.toFixed(2));
        }, 0);

        // Total Buyer Amount (New Rate × Qty)
        const TotalAmount_Buyer = selectedRows.reduce((sum, row) => {
            const qty = Number(row.quantity !== 0 ? row.quantity : 1);
            const rate = Number(row.newRate !== 0 ? row.newRate : 1);
            const amount = rate * qty;
            return sum + Number(amount.toFixed(2));
        }, 0);

        console.log("TotalAmount_Buyer", TotalAmount_Buyer)

        // Final Totals
        const totalAll = Number((Commission + VendorCommission + MarkUpPerPc).toFixed(2));
        const CommissionInPercent = TotalAmount_Buyer > 0
            ? Number(((totalAll / TotalAmount_Buyer) * 100).toFixed(2))
            : 0;
        console.log("totalAll", totalAll)
        console.log("CommissionInPercent", CommissionInPercent)

        console.log(Commission, VendorCommission, MarkUpPerPc, "dfdf")

        settotalcomm(totalAll);

        settotalcommpc(CommissionInPercent);
        setTotalQuantity(totalQty);
        setTotalAmount(totalVal);
        // eslint-disable-next-line 
    }, [selectedRows])
    useEffect(() => {
        if (selectedBooking) {
            setTotalAmount(selectedBooking.totalValue || 0);
            setTotalQuantity(selectedBooking.totalSalesOrderQty || 0);
            settotalcomm(selectedBooking.synergiesTotalCommission || 0);
            settotalcommpc(selectedBooking.commissionInPercent || 0);
        }
    }, [selectedBooking]);
    useEffect(() => {
        if (selectedBooking) {
            //  setLoading(true); // Enable loader
            setTimeout(() => {
                methods.reset(defaultValues); // Reset form with fetched values
                setLoading(false); // Disable loader when data is ready
            }, 3000); // Simulating API delay (replace with actual API call)
        }
    }, [selectedBooking, defaultValues, methods]);
    // console.log(currencies.find((x) => x.bankID === JSON.stringify(selectedBooking.bankID)))
    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            {loading ? (
                // Show Loader while data is being fetched
                <LoadingScreen sx={{ height: { xs: 200, md: 300 } }} />
            ) :
                <FormProvider methods={methods} onSubmit={onSubmit}>


                    <div>
                        <Card sx={{ mt: 3, p: 2 }}>
                            <Typography variant="h5" sx={{ mb: 3 }}>

                                Sales Contract Information
                            </Typography>
                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: "repeat(1, 1fr)",
                                    sm: "repeat(1, 1fr)",
                                    md: "repeat(3, 1fr)", // 3 items per row
                                }}
                                sx={{ mb: 3 }}
                            >
                                {/* Booking Reference No */}
                                <RHFTextField
                                    name="SalesContractNo"
                                    label="Sales Contract No"
                                    InputLabelProps={{ shrink: true }}
                                    disabled={!([1, 24, 4].includes(userData[0].roleID))}
                                />

                                <Controller
                                    name="IssuingDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Issuing Date"
                                            format="dd/MM/yyyy"
                                            value={field.value ? field.value : ""}
                                            onChange={(newValue) => field.onChange(newValue)}
                                            disabled={!([1, 24, 4].includes(userData[0].roleID))}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    )}
                                />



                                <Controller
                                    name="ApplyDate"
                                    control={control}

                                    render={({ field }) => (
                                        <DatePicker
                                            label="Apply Date"
                                            format="dd/MM/yyyy"
                                            value={field.value}
                                            onChange={(newValue) => field.onChange(newValue)}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    )}
                                />
                                <RHFAutocomplete
                                    name="customer"
                                    label="Customer Name"
                                    options={customerData}
                                    getOptionLabel={(option) => option?.customerName || ""}
                                    fullWidth
                                    value={customerData?.find((x) => x.customerID === values?.customer?.customerID) || null}

                                />



                                <RHFAutocomplete
                                    name="supplier"
                                    label="Supplier"
                                    options={SupplierData}
                                    getOptionLabel={(option) => option?.venderName || ""}
                                    value={SupplierData?.find((x) => x.venderLibraryID === values?.supplier?.venderLibraryID) || null}

                                    fullWidth

                                />


                            </Box>
                        </Card>

                    </div>

                    <Card sx={{ mt: 3, p: 2 }}>

                        <Box>
                            <Box
                                display="flex"
                                flexWrap="wrap"
                                justifyContent="space-between"
                            >
                                <Typography variant="h5" sx={{ mb: 1 }}>
                                    Product Specific Information
                                </Typography>

                                {/* Add Item Details Button */}
                                <Box
                                    rowGap={3}
                                    columnGap={2}
                                    display="flex"
                                    flexWrap="wrap"
                                    justifyContent="space-between"

                                >

                                    <Button variant="contained" color="primary" onClick={handleOpen}>
                                        Add Item Details
                                    </Button>
                                </Box>
                            </Box>


                            {/* Popup Dialog */}
                            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
                                <DialogTitle>Select Item Details</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        label="PO No (optional)"
                                        fullWidth
                                        value={PONO}
                                        onChange={(e) => setPONO(e.target.value)}
                                        margin="dense"
                                    />

                                    <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
                                        <LoadingButton
                                            variant="contained"
                                            color="primary"
                                            onClick={handleGetData}
                                            loading={loading}
                                            sx={{ mt: 2 }}
                                        >
                                            Get Data
                                        </LoadingButton>

                                    </Stack>


                                    {/* Data Table Inside Dialog */}
                                    {dataList.length > 0 && (
                                        <TableContainer component={Paper} sx={{ mt: 3, maxHeight: 400 }}>
                                            <Scrollbar>
                                                <Table stickyHeader>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell sx={{ minWidth: 100 }} >Select</TableCell>
                                                            <TableCell sx={{ minWidth: 100 }}>Style No</TableCell>
                                                            <TableCell sx={{ minWidth: 100 }}>Article</TableCell>
                                                            <TableCell sx={{ minWidth: 100 }}>PO. No</TableCell>

                                                            <TableCell sx={{ minWidth: 100 }}>Shipment Date</TableCell>
                                                            <TableCell sx={{ minWidth: 100 }}>Quantity</TableCell>
                                                            <TableCell sx={{ minWidth: 100 }}>Unit Price</TableCell>
                                                            <TableCell sx={{ minWidth: 100 }}>Total Amount</TableCell>
                                                            <TableCell sx={{ minWidth: 100 }}>Currency</TableCell>
                                                            <TableCell sx={{ minWidth: 100 }}>Customer FOB</TableCell>
                                                            <TableCell sx={{ minWidth: 100 }}>Buyer Commission (%)</TableCell>
                                                            <TableCell sx={{ minWidth: 100 }}>Vendor Commission (%)</TableCell>
                                                            <TableCell sx={{ minWidth: 100 }}>Mark-Up Per Pc.</TableCell>
                                                            <TableCell sx={{ minWidth: 100 }}>Style Description</TableCell>
                                                            <TableCell sx={{ minWidth: 100 }}>Certifications</TableCell>

                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {paginatedData.map((row, index) => {
                                                            const rowId = getRowId(row);
                                                            return (
                                                                <TableRow key={index}>
                                                                    <TableCell>
                                                                        <Checkbox
                                                                            checked={selectedRows.some(selected => getRowId(selected) === rowId)}
                                                                            onChange={() => handleSelectRow(row)}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>{row.styleNo}</TableCell>
                                                                    <TableCell>{row.article}</TableCell>
                                                                    <TableCell>{row.pono}</TableCell>
                                                                    <TableCell>{row.cusShipDate}</TableCell>
                                                                    <TableCell>{row.quantity}</TableCell>
                                                                    <TableCell>{row.rate}</TableCell>
                                                                    <TableCell>{row.totalAmount}</TableCell>
                                                                    <TableCell>{row.currency}</TableCell>

                                                                    <TableCell>{row.newRate}</TableCell>
                                                                    <TableCell>{row.commission}</TableCell>

                                                                    <TableCell>{row.vendorCommission}</TableCell>
                                                                    <TableCell>{row.styleMarkUpPerPc}</TableCell>

                                                                    <TableCell>{row.styleDescription}</TableCell>
                                                                    <TableCell>{row.certifications}</TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </Scrollbar>
                                        </TableContainer>
                                    )}

                                    {/* Pagination */}
                                    {dataList.length > rowsPerPage && (
                                        <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                                            <Pagination
                                                count={Math.ceil(dataList.length / rowsPerPage)}
                                                page={currentPage}
                                                onChange={handlePageChange}
                                                color="primary"
                                            />
                                        </Box>
                                    )}
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} >
                                        Close
                                    </Button>
                                </DialogActions>
                            </Dialog>


                            {/* Selected Items Displayed Outside */}
                            {selectedRows.length > 0 && (
                                <TableContainer component={Paper} sx={{ mt: 3 }}>
                                    <Typography variant="h6" sx={{ p: 2 }}>
                                        Selected Items
                                    </Typography>

                                    <Table>
                                        <Scrollbar>
                                            <TableHead>
                                                <TableRow>


                                                    <TableCell sx={{ minWidth: 100 }}>Style No</TableCell>
                                                    <TableCell sx={{ minWidth: 100 }}>Article</TableCell>
                                                    <TableCell sx={{ minWidth: 100 }}>PO. No</TableCell>

                                                    <TableCell sx={{ minWidth: 100 }}>Shipment Date</TableCell>
                                                    <TableCell sx={{ minWidth: 100 }}>Quantity</TableCell>
                                                    <TableCell sx={{ minWidth: 80 }}>Unit Price</TableCell>
                                                    <TableCell sx={{ minWidth: 100 }}>Total Amount</TableCell>
                                                    <TableCell sx={{ minWidth: 100 }}>Currency</TableCell>
                                                    <TableCell sx={{ minWidth: 100 }}>Customer FOB</TableCell>
                                                    <TableCell sx={{ minWidth: 100 }}>Buyer Commission (%)</TableCell>
                                                    <TableCell sx={{ minWidth: 100 }}>Vendor Commission (%)</TableCell>
                                                    <TableCell sx={{ minWidth: 100 }}>Mark-Up Per Pc.</TableCell>
                                                    <TableCell sx={{ minWidth: 100 }} >Remove</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedRows.map((row, index) => (
                                                    <TableRow key={index}>

                                                        <TableCell>{row.styleNo}</TableCell>
                                                        <TableCell>{row.article}</TableCell>
                                                        <TableCell>{row.pono}</TableCell>
                                                        <TableCell>
                                                            {row.cusShipDate?.includes("T")
                                                                ? formatDateToDDMMYYYY(row.cusShipDate)
                                                                : row.cusShipDate}
                                                        </TableCell>
                                                        <TableCell>{row.quantity}</TableCell>
                                                        <TableCell>{row.rate}</TableCell>
                                                        <TableCell>{row.totalAmount}</TableCell>
                                                        <TableCell>{row.currency}</TableCell>

                                                        <TableCell>{row.newRate}</TableCell>
                                                        <TableCell>{row.commission}</TableCell>

                                                        <TableCell>{row.vendorCommission}</TableCell>
                                                        <TableCell>{row.styleMarkUpPerPc || row.markUpPerPc}</TableCell>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedRows.some(selected => getRowId(selected) === row)}
                                                                onChange={() => handleSelectRow(row)}
                                                            />
                                                        </TableCell>
                                                    </TableRow>

                                                ))}
                                            </TableBody>
                                        </Scrollbar>

                                    </Table>

                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "repeat(1, 1fr)",  // 2 columns on extra small screens
                                                sm: "repeat(2, 1fr)",  // 3 columns on small screens
                                                md: "repeat(3, 1fr)",  // 4 columns on medium and up
                                            },
                                            gap: 3,
                                            mt: 2,
                                            p: 2,
                                        }}
                                    >
                                        <TextField
                                            label="Total Quantity"
                                            type="number"
                                            value={totalQuantity}
                                            disabled
                                        />
                                        <TextField
                                            label="Total Value"
                                            type="number"
                                            value={totalAmount}
                                            disabled
                                        />
                                        <TextField
                                            label="Synergies Total Commission"
                                            type="number"
                                            value={selectedBooking.synergiesTotalCommission || totalcomm}
                                            disabled
                                        />
                                        <TextField
                                            label="Total Commission / Pc"
                                            type="number"
                                            value={selectedBooking.commissionInPercent || totalcommpc}
                                            disabled
                                        />

                                        <Controller
                                            name="ExpiryDate"
                                            control={control}

                                            render={({ field }) => (
                                                <DatePicker
                                                    label="Expiry Date"
                                                    format="dd/MM/yyyy"
                                                    value={field.value}
                                                    onChange={(newValue) => field.onChange(newValue)}
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            )}
                                        />

                                        <RHFTextField name="Brand" label="Brands" InputLabelProps={{ shrink: true }} multiline sx={{ mb: 2 }} rows={3} disabled />
                                    </Box>

                                </TableContainer>
                            )}
                        </Box>


                    </Card>

                    <Card sx={{ mt: 3, p: 2 }}>
                        <div>

                            <Typography variant="h5" sx={{ mb: 3 }}>
                                Commerical Section
                            </Typography>
                            <Box
                                rowGap={3}
                                columnGap={2}
                                display="grid"
                                gridTemplateColumns={{
                                    xs: 'repeat(1, 1fr)',  // Single column on extra small screens
                                    sm: 'repeat(1, 1fr)',  // Single column on small screens
                                    md: 'repeat(3, 1fr)',  // Three columns on medium screens and above
                                }}
                                sx={{
                                    mb: 3,
                                }}
                            >

                                <RHFTextField name="TermOfSales" label="Term of Sales" defaultValue="FOB BANGLADESH" disabled />
                                <RHFTextField name="GoodsOrigin" label="Goods Origin" defaultValue="BANGLADESH" disabled />
                                <RHFTextField name="TransShipment" label="Trans Shipment" defaultValue="ALLOWED" disabled />
                                <RHFTextField name="PartShipment" label="Part Shipment" defaultValue="ALLOWED" disabled />
                                <RHFTextField name="PaymentType" label="Payment type" defaultValue="" disabled />
                                <RHFTextField name="PaymentMode" label=" Payment mode" defaultValue="" disabled />
                                <RHFTextField name="CertificateOfOrigin" label="Certificate of Origin / GSP Form A" defaultValue="WILL BE PROVIDED" disabled />
                                <RHFTextField name="ToleranceInDays" label="Tolerance [%]" defaultValue="" disabled />
                                <RHFTextField name="Packing" label="Packing" defaultValue="EXPORT STANDARD" disabled />
                                <RHFTextField name="ShipmentFrom" label="Shipment From" defaultValue="ANY PORT OF BANGLADESH" InputLabelProps={{ shrink: true }} disabled />
                                <RHFTextField name="Items" label="Items" InputLabelProps={{ shrink: true }} disabled />
                                <RHFAutocomplete
                                    name="FabricSource"
                                    label="FabricSource"
                                    options={fbsrc}
                                    getOptionLabel={(option) => option}
                                    onChange={(event, newValue) => setFbsrc(newValue)}
                                    value={fbsrc?.find((x) => x === Fbsrc) || null}
                                    fullWidth
                                />
                                <Controller
                                    name="ExpectedLCDate"
                                    control={control}
                                    render={({ field, fieldState: { error } }) => (
                                        <DatePicker
                                            label="Expected Date"
                                            format="dd/MM/yyyy"
                                            value={field.value}
                                            onChange={(newValue) => field.onChange(newValue)}
                                            renderInput={(params) => <TextField {...params} />}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!error,
                                                    helperText: error?.message,
                                                },
                                            }}
                                        />
                                    )}
                                />
                                <RHFTextField name="PortOfDestination" label="Port of Destination" InputLabelProps={{ shrink: true }} disabled={!([1, 24, 4].includes(userData[0].roleID))} />
                                <RHFTextField name="ReasonOfDelayInLC" label="Reason Of Delay in LC" InputLabelProps={{ shrink: true }} />

                                <RHFAutocomplete
                                    name="SalesContractType"
                                    label="Sales contract type"
                                    options={salesType}
                                    getOptionLabel={(option) => option}

                                    value={salesType?.find((x) => x === selectedLCOption) || null}
                                    fullWidth
                                />

                                <RHFAutocomplete
                                    name="ApplicantBankID"
                                    label="Bank"
                                    options={currencies}
                                    getOptionLabel={(option) => option?.bankName || ""}
                                    value={currencies?.find((x) => x.bankID === values?.ApplicantBankID?.bankID) || null}
                                    onChange={(_, newValue) => {
                                        setValue("ApplicantBankID", newValue?.bankID || 0, { shouldValidate: true });
                                        setValue("ApplicantBankRequired", newValue?.bankID !== 0, { shouldValidate: true }); // 👈 sets boolean
                                    }}
                                    fullWidth
                                />

                                <Controller
                                    name="ApplicantBankRequired"
                                    control={control}
                                    defaultValue={false}
                                    render={({ field }) => <input type="hidden" {...field} />}
                                />

                                <RHFTextField name="ItemDes" label="Item description" InputLabelProps={{ shrink: true }} multiline sx={{ mb: 2 }} rows={3} disabled />
                                <RHFTextField name="LogisticComments" label="Logistics Comments" InputLabelProps={{ shrink: true }} multiline sx={{ mb: 2 }} rows={3} disabled={!([1, 24, 4].includes(userData[0].roleID))} />
                                <RHFTextField name="MerComm" label="Merchandiser Comments" InputLabelProps={{ shrink: true }} multiline sx={{ mb: 2 }} rows={3} />

                            </Box>

                        </div>

                    </Card>



                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </Box>

                </FormProvider>
            }
        </Container >
    );
};
SalesContractEdit.propTypes = {
    selectedBooking: PropTypes.object,
    currentStyles: PropTypes.array,
    urlData: PropTypes.any,

}
export default SalesContractEdit;



