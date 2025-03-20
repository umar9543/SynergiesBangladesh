import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import {
    Autocomplete, TextField, Grid, Button, Container, Typography, Box, Stepper, Step, StepLabel, Card, FormGroup, FormControlLabel, Checkbox, List,
    ListItem,
    ListItemIcon,
    ListItemText,
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
import PropTypes from "prop-types";
import { decryptObjectKeys } from "src/api/encryption";
import ProductSpecificInfo from "./Purchase";





const BookingOrder = () => {

    const userData = useMemo(() => JSON.parse(localStorage.getItem('UserData')), []);
    const certificationOptions = ["Yes", "No"];
    const [selectedCertification, setSelectedCertification] = useState(null);
    const [certificationValues, setCertificationValues] = useState({
        TC: 0,
        GOTS: 0,
        Others: 0
    });
    const handleCertificationChange = (event, newValue) => {
        console.log('newvalue', newValue)
        const certificationValue = newValue === "Yes" ? 1 : 0;
        setValue("certification", certificationValue);
        setSelectedCertification(certificationValue);

        if (certificationValue === 0) {
            // Reset checkboxes if "No" is selected
            setCertificationValues({ TC: 0, GOTS: 0, Others: 0 });
        }
    };
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCertificationValues((prev) => ({
            ...prev,
            [name]: checked ? 1 : 0, // Set 1 when checked, 0 when unchecked
        }));
    };

    const [toggle, setToggle] = useState(false)
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [cancelQuantity, setCancelQuantity] = useState("");
    const [totalMark, setTotalMark] = useState(0); // Initialize with 0

    // Function to calculate commission


    const userdata = JSON.parse(localStorage.getItem("UserData"))

    const validationSchema = Yup.object().shape({

        RefNO: Yup.string()
            .required("Reference No is required")
            .test("unique-refno", "Reference No already exists", (value) => {
                if (!value) return true;
                return !existingRefNOs.includes(value);
            }),


        placementDates: Yup.date().required("placementDate is required"),
        shipmentDateBuyer: Yup.date()
            .required("Shipment Date (Buyer) is required")
            .min(Yup.ref('placementDates'), "Shipment Date (Buyer) must be after Placement Date"),

        shipmentDateVendor: Yup.date()
            .required("Shipment Date (Vendor) is required")
            .min(Yup.ref('placementDates'), "Shipment Date (Vendor) must be after Placement Date"),
        customer: Yup.object().nullable().required("Customer is required"),
        brandCustomer: Yup.object().nullable().required("Customer Brand is required"),
        supplier: Yup.object().nullable().required("Supplier is required"),
        supplierPC: Yup.object().nullable(),
        merchant: Yup.object().nullable().required("Merchant is required"),
        productPortfolio: Yup.object().nullable().required("Product Portfolio is required"),
        productCategory: Yup.object().nullable().required("Product Category is required"),
        productGroup: Yup.object().nullable(),
        season: Yup.string().required("Season is required"),
        fabricType: Yup.string().required("Fabric Type is required"),
        businessManagers: Yup.object().nullable(),
        Currency: Yup.object().nullable().required("Currency is required"),
        construction: Yup.string().required("Construction is required"),
        design: Yup.string().required("Design is required"),
        transaction: Yup.object().nullable().required("Transaction is required"),
        lcopt: Yup.string().nullable(),
        paymentType: Yup.object(),
        shipmentMode: Yup.object().nullable().required("Shipment Mode is required"),
        paymentMode: Yup.object().nullable().required("Payment Mode is required"),
        certification: Yup.string().required("Certification selection is required"),
        buyerCommissions: Yup.number(),
        vendorCommissions: Yup.number(),
        totalMarkups: Yup.number(),
        comments: Yup.string().nullable(),
        files:  Yup.mixed().nullable().required("File is required"),
      

    });


    const calculateCommission = (commission, totalAmt) => {

        if (!commission || !totalAmt) return 0;
        return Math.round((commission * totalAmt) / 100 * 100) / 100;


    };
    const calculateMark = (commission, totalAmt) => {

        if (!commission || !totalAmt) return 0;
        return Math.round(commission * totalAmt)


    };
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
    const [customerData, setCustomerData] = useState([]);
    const [brandData, setBrandData] = useState([]);
    const [SupplierData, setSupplierData] = useState([]);

    const [MerchantData, setMerchantData] = useState([]);
    const [productPortfolioData, setproductPortfolioData] = useState([]);
    const [productCategoryData, setproductCategoryData] = useState([]);
    const [productGroupData, setproductGroupData] = useState([]);
    const [BusinsessManager, setBusinsessManager] = useState([]);
    const [shipmentModes, setShipmentModes] = useState([]);
    const [paymentModes, setPaymentModes] = useState([]);
    const [currencies, setCurrencies] = useState([]);
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
    const lcOptions = ["SSHK", "SSBD", "Supplier", "__"];
    const supPerCustom = [{ id: 262, name: "Synergies Sourcing BD" },]
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [selectedLCOption, setSelectedLCOption] = useState(null);

    const [formsData, setFormData] = useState({
        RefNO: "",
        placementDate: null,
        shipmentDateBuyer: null,
        shipmentDateVendor: null,
        customer: null,
        brandCustomer: null,
        supplier: null,
        merchant: null,
        productPortfolio: null,
        productCategory: null,
        productGroup: null,
        season: null,
        totalQty: null,
        fabricType: null,
        Construction: null,
        Design: null,
        businessManagers: null,
        Trans: null
    });
    // console.log(formData)
    // file section
    const [comment, setComment] = useState("");
    const [files, setFiles] = useState([]);


    const handleDrop = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            })
        );

        setFiles((prevFiles) => [...prevFiles, ...newFiles]);

        if (files) {
            setValue('files', newFiles, { shouldValidate: true });
          }
        
    }, [setValue,files]);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);

        // Filter files to ensure only PDFs are selected
        const pdfFiles = selectedFiles.filter(file => file.type === "application/pdf");

        if (pdfFiles.length !== selectedFiles.length) {
            enqueueSnackbar("Enter valid Pdf File!", { variant: "error" })// Alert user if any non-PDF file is selected
        }

        setFiles(pdfFiles);  // Store only valid PDF files
    };

    const handleDeleteFile = useCallback((index) => {
        setFiles((prevFiles) => {
            console.log("Before Deletion:", prevFiles);


            const updatedFiles = [...prevFiles];
            updatedFiles.splice(index, 1); // Remove file at index

            console.log("After Deletion:", updatedFiles);
            return updatedFiles;
        });
    }, []);



    useEffect(() => {
        Get("https://localhost:44347/api/customer")
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
        Get("https://localhost:44347/api/Supplier")
            .then(response => {
                const decryptedData = decryptObjectKeys(response.data);
                setSupplierData(decryptedData)
            }
            )
            .catch(error => console.error("Error fetching customers:", error));
    }, []);

    // Fetch customer brand data based on selected customer
    useEffect(() => {
        if (values?.customer?.customerID) {
            setValue('brandCustomer', null)
            Get(`https://localhost:44347/api/customerbrand/${values?.customer?.customerID}`)
                .then(response => {
                    const decryptedData = decryptObjectKeys(response.data);
                    setBrandData(decryptedData)
                }
                )
                .catch(error => console.error("Error fetching customer brands:", error));
        } else {
            setBrandData([]); // Reset brand data when no customer is selected
        }
    }, [values?.customer?.customerID, setValue]);


    useEffect(() => {
        Get(`https://localhost:44347/api/Merchants?userID=${userData.userID}&roleID=${userData.roleID}`)
            .then(response => {
                const decryptedData = decryptObjectKeys(response.data);
                setMerchantData(decryptedData)
            })
            .catch(error => console.error("Error fetching customers:", error));
    }, [userData.userID, userData.roleID]);


    useEffect(() => {
        Get("https://localhost:44347/api/ProductPortfolio")
            .then(response => {
                const decryptedData = decryptObjectKeys(response.data);
                setproductPortfolioData(decryptedData)
            })
            .catch(error => console.error("Error fetching customers:", error));
    }, []);

    useEffect(() => {
        if (values?.productPortfolio?.productPortfolioID) {
            Get(`https://localhost:44347/api/productcategory/${values?.productPortfolio?.productPortfolioID}`)
                .then(response => {
                    const decryptedData = decryptObjectKeys(response.data);
                    setproductCategoryData(decryptedData)
                })
                .catch(error => console.error("Error fetching customer brands:", error));
        } else {
            setproductCategoryData([]); // Reset brand data when no customer is selected
        }
    }, [values?.productPortfolio?.productPortfolioID]);


    useEffect(() => {
        if (values?.productCategory?.productCategoriesID) {
            Get(`https://localhost:44347/api/productgroup/${values?.productCategory?.productCategoriesID}`)
                .then(response => {
                    const decryptedData = decryptObjectKeys(response.data);
                    setproductGroupData(decryptedData)
                })
                .catch(error => console.error("Error fetching customer brands:", error));
        } else {
            setproductGroupData([]); // Reset brand data when no customer is selected
        }
    }, [values?.productCategory?.productCategoriesID]);

    useEffect(() => {
        console.log('hello from ')
        Get(`https://localhost:44347/api/businessmanagers?ecpDivision=${userData.ecpDivistion}`)
            .then(response => {

                setBusinsessManager(response.data)
            })
            .catch(error => console.error("Error fetching customers:", error));
    }, [userData.ecpDivistion]);
    useEffect(() => {
        Get("https://localhost:44347/api/shipmentmode")
            .then(response => {
                const decryptedData = decryptObjectKeys(response.data);
                setShipmentModes(decryptedData)
            })
            .catch(error => console.error("Error fetching shipment modes:", error));
    }, []);

    useEffect(() => {
        Get("https://localhost:44347/api/paymentmode")
            .then(response => {
                const decryptedData = decryptObjectKeys(response.data);
                setPaymentModes(decryptedData)
            })
            .catch(error => console.error("Error fetching payment modes:", error));
    }, []);

    useEffect(() => {
        Get("https://localhost:44347/api/currency")
            .then(response => {
                const decryptedData = decryptObjectKeys(response.data);
                setCurrencies(decryptedData)
            })
            .catch(error => console.error("Error fetching currency:", error));
    }, []);

    const [existingRefNOs, setExistingRefNOs] = useState([]);



    useEffect(() => {
        Get("https://localhost:44347/api/pono") // Use the correct API that fetches only PONO
            .then(response =>
                setExistingRefNOs(response.data))

            .catch(error => console.error("Error fetching PONO values", error));
    }, []);


    function toUTCISOString(date) {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
    }
    const [selectedRows, setSelectedRows] = useState([]);

    const InsertMstData = async (DataToInsert) => {
        const formData = new FormData();

        // Append all fields dynamically
        Object.keys(DataToInsert).forEach((key) => {
            if (DataToInsert[key] !== undefined && DataToInsert[key] !== null) {
                formData.append(key, DataToInsert[key]);
            }
        });

        // ✅ Append files under correct key "File"
        if (files?.length > 0) {
            formData.append("File", files[0]); // ✅ Backend expects `dto.File`
        }



        try {

            const res = await Post(`api/BookingPurchase/create`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.status === 200) {
                const { poid } = res.data;
                if (poid) {
                    return poid; // ✅ Return POID
                }
            }

            enqueueSnackbar('Error: POID missing from response', { variant: 'error' });
            return null; // ✅ Return null on failure
        } catch (error) {
            console.error(`Error creating master data:`, error);
            return null; // ✅ Ensure failure return
        }
    };

    // Function to insert detail data
    const InsertDetailData = async (poid, details) => {
        if (!poid) {
            enqueueSnackbar("Error: Invalid POID", { variant: "error" });
            return false; // ✅ Return false if no POID
        }



        const detailPayload = details.map(row => ({
            poid,
            quantity: row.poQuantity || 0,
            rate: row.itemPrice || 0,
            styleID: row.styleID || 0,
            remarks: row.remarks || "",
            newRate: row.itemPrice || 0,
            vendorRate: row.vendorPrice || 0,
            originalVendorRate: row.vendorPrice || 0,
            styleMarkUpPerPc: row.markupPerPc || 0,
        }));

        try {
            const res = await Post(`api/BookingPurchase/add-details`, detailPayload);
            return res.status === 200; // ✅ Return true if success
        } catch (error) {
            console.error(`Error creating detail data:`, error);
            return false; // ✅ Ensure failure return
        }
    };

    // Form submission
    const onSubmit = handleSubmit(async (data) => {
        if (selectedRows?.length === 0) {
            enqueueSnackbar("Please select atleast one style", { variant: "error" });
            return false; // ✅ Stop if Detail API fails
        }

        try {
            console.log("CERTIFICATE", data);
            console.log("Files to Upload:", files);
            const mstData = {
                PONO: data.RefNO,
                PlacementDate: toUTCISOString(new Date(data.placementDates)),
                ShipmentDate: toUTCISOString(new Date(data.shipmentDateBuyer)),
                Tolerance: toUTCISOString(new Date(data.shipmentDateVendor)),
                CustomerID: data.customer?.customerID,
                CusBrandID: data.brandCustomer?.brandID,
                SupplierID: data.supplier?.venderLibraryID,
                MarchandID: data.merchant?.userID,
                ProductPortfolioID: data.productPortfolio?.productPortfolioID,
                ProductCategoriesID: data?.productCategory?.productCategoriesID,
                ProductGroupID: data?.productGroup?.productGroupID,
                ProductGroup: data?.productGroup?.groupName,
                Season: data.season,
                Quality: data.fabricType,
                BusinessManagerUserID: data.businessManagers?.userID || 0,
                Construction: data.construction,
                Currency: data.Currency.currencyName,
                Design: data.design,
                Transactions: data.transaction.TransName,
                PaymentType: "4",
                PaymentTypeNew: data.paymentType?.name,
                LCTo: selectedLCOption || "--",
                ShipmentMode: data.shipmentMode?.id,
                PaymentMode: data.paymentMode?.id,
                Commission: data.buyerCommissions,
                VendorCommission: data.vendorCommissions,
                TotalAmount: totalAmount || 0,
                PORemarks: data.comments,
                BookingCancelQty: cancelQuantity || 0,
                TotalQty: totalQuantity || 0,
                PreSupplierID: data.supplierPC?.id || 0,
                B_isCertifications: Boolean(parseInt(data.certification, 10) === 1),
                B_TC_Certifications: Boolean(parseInt(certificationValues.TC, 10) === 1),
                B_GOTS_Certifications: Boolean(parseInt(certificationValues.GOTS, 10) === 1),
                B_OTHERS_Certifications: Boolean(parseInt(certificationValues.Others, 10) === 1),
            };

            console.log('mstData', mstData);

            // ✅ First, call Master API to get POID
            const poid = await InsertMstData(mstData, files);

            if (!poid) {
                enqueueSnackbar("Something went wrong", { variant: "error" });
                return false; // ✅ Stop if Master API fails
            }

            // ✅ If POID is received, submit detail data
            const isDetailSuccess = await InsertDetailData(poid, selectedRows);


            if (!isDetailSuccess && selectedRows) {
                enqueueSnackbar("Something went wrong", { variant: "error" });
                return false; // ✅ Stop if Detail API fails
            }

            // ✅ Success message only if both APIs succeed
            enqueueSnackbar("Data Uploaded Successfully", { variant: "success" });
            return true;

        } catch (error) {
            console.error("Error submitting data:", error);
            enqueueSnackbar("Something went wrong", { variant: "error" });
            return false;
        }
    });

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
    return (
        <Container>
            <Box
                display="flex"
                justifyContent="space-between"
            >
                <CustomBreadcrumbs
                    heading="Booking Order Information"
                    links={[
                        { name: "Home", href: paths.dashboard.root },
                        { name: "Booking Order" },
                    ]}
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

            </Box>

            <FormProvider methods={methods} onSubmit={onSubmit}>


                <div>
                    <Card sx={{ mt: 3, p: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Order Booking Input Form
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
                            <RHFTextField name="RefNO" label="Booking Ref. NO" />
                            {/* Placement Date */}
                            <Controller
                                name="placementDates"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Placement Date"
                                        format="dd/MM/yyyy"
                                        value={field.value}
                                        onChange={(newValue) => field.onChange(newValue)}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                )}
                            />

                            <Controller
                                name="shipmentDateVendor"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Shipment Date (Buyer)"
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

                            {/* Customer Brand Selection */}
                            <RHFAutocomplete
                                name="brandCustomer"
                                label="Brand Name"
                                options={brandData}
                                getOptionLabel={(option) => option?.brandName || ""}
                                value={brandData?.find((x) => x.brandName === values?.brandCustomer?.brandName) || null}
                                fullWidth

                            />
                            <RHFAutocomplete
                                name="supplierPC"
                                label="Supplier as per Customer"
                                options={supPerCustom}
                                getOptionLabel={(option) => option?.name || ""}
                                value={supPerCustom?.find((x) => x.id === values?.supplierPC?.id) || 0}

                                fullWidth

                            />
                            <RHFAutocomplete
                                name="supplier"
                                label="Supplier"
                                options={SupplierData}
                                getOptionLabel={(option) => option?.venderName || ""}
                                value={SupplierData?.find((x) => x.venderLibraryID === values?.supplier?.venderLibraryID) || null}

                                fullWidth

                            />

                            <Controller
                                name="shipmentDateBuyer"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Shipment Date (Vendor)"
                                        format="dd/MM/yyyy"
                                        value={field.value}
                                        onChange={(newValue) => field.onChange(newValue)}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                )}
                            />

                            <RHFAutocomplete
                                name="merchant"
                                label="Merchant"
                                options={MerchantData}
                                getOptionLabel={(option) => option?.userName || ""}
                                value={MerchantData?.find((x) => x.userID === values?.merchant?.userID) || null}

                                fullWidth

                            />

                        </Box>
                    </Card>

                </div>
                <div>
                    <Card sx={{ mt: 3, p: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Product Information
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

                            <RHFAutocomplete
                                name="productPortfolio"
                                label="Product Portfolio"
                                options={productPortfolioData}
                                getOptionLabel={(option) => option?.productPortfolioName || ""}
                                value={productPortfolioData?.find((x) => x.productPortfolioID === values?.productPortfolio?.productPortfolioID) || null}

                                fullWidth

                            />


                            <RHFAutocomplete
                                name="productCategory"
                                label="Product Category"
                                options={productCategoryData}
                                getOptionLabel={(option) => option?.productCategory || ""}
                                value={productCategoryData?.find((x) => x.productCategory === values?.productCategory?.productCategory) || null}
                                fullWidth

                            />
                            <RHFAutocomplete
                                name="productGroup"
                                label="Product Group"
                                options={productGroupData}
                                getOptionLabel={(option) => option?.groupName || ""}
                                value={productGroupData?.find((x) => x.groupName === values?.productGroup?.groupName) || null}
                                fullWidth

                            />

                            <RHFTextField name="season" label="Season" fullWidth variant="outlined" />
                            <RHFTextField name="fabricType" label="Fabric Type" fullWidth variant="outlined" />

                            <RHFAutocomplete
                                name="businessManagers"
                                label="Businsess Manager"
                                options={BusinsessManager}
                                getOptionLabel={(option) => option?.username || ""}
                                value={BusinsessManager?.find((x) => x.userID === values?.businessManagers?.userID) || null}

                                fullWidth

                            />


                            <RHFTextField name="construction" label="Construction" fullWidth variant="outlined" />
                            <RHFTextField name="design" label="Design" fullWidth variant="outlined" />

                            <RHFAutocomplete
                                name="transaction"
                                label="Transactions"
                                options={Transactions}
                                getOptionLabel={(option) => option?.TransName || ""}
                                value={Transactions?.find((x) => x.TransID === values?.transaction?.TransID) || null}

                                fullWidth

                            />

                        </Box>
                    </Card>

                </div>
                <Card sx={{ mt: 3, p: 2 }}>

                    <ProductSpecificInfo setTotalAmount={setTotalAmount} totalAmount={totalAmount}
                        totalQuantity={totalQuantity} setTotalQuantity={setTotalQuantity} cancelQuantity={cancelQuantity} setCancelQuantity={setCancelQuantity}
                        selectedRows={selectedRows} setSelectedRows={setSelectedRows} totalMark={totalMark} setTotalMark={setTotalMark}
                    />
                </Card>

                <Card sx={{ mt: 3, p: 2 }}>
                    <div>

                        <Typography variant="h5" gutterBottom>
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

                            <RHFAutocomplete
                                name="paymentType"
                                label="Payment Type"
                                options={paymentType}
                                getOptionLabel={(option) => option.name || ""}
                                value={paymentType?.find((x) => x.id === values?.paymentType?.id) || null}
                                onChange={(event, newValue) => {
                                    setValue("paymentType", newValue)
                                    setSelectedPayment(newValue?.id);
                                    setSelectedLCOption(null); // Reset LC option when payment type changes
                                }}
                                fullWidth

                            />


                            {selectedPayment === 1 && (



                                <RHFAutocomplete
                                    name="lcopt"
                                    label="L/C Type"
                                    options={lcOptions}
                                    getOptionLabel={(option) => option}
                                    value={selectedLCOption} // Ensures controlled component behavior
                                    onChange={(event, newValue) => {
                                        setSelectedLCOption(newValue || "--"); // Update local state
                                        methods.setValue("lcopt", newValue || "--"); // Update form value
                                    }}
                                    isOptionEqualToValue={(option, value) => option === value}
                                    fullWidth
                                />

                            )}

                            <RHFAutocomplete
                                name="shipmentMode"
                                label="Shipment Mode"
                                options={shipmentModes}
                                getOptionLabel={(option) => option?.name || ""}

                                value={shipmentModes?.find((x) => x.id === values?.shipmentMode?.id) || null}
                                fullWidth

                            />
                            <RHFAutocomplete
                                name="paymentMode"
                                label="Payment Mode"
                                options={paymentModes}
                                getOptionLabel={(option) => option?.name || ""}

                                value={paymentModes?.find((x) => x.id === values?.paymentMode?.id) || null}
                                fullWidth

                            />


                            <Box sx={{ width: "100%" }}>
                                {/* Certification Dropdown */}

                                <RHFAutocomplete
                                    name="certification"
                                    label="Certification"
                                    options={["Yes", "No"]}
                                    onChange={handleCertificationChange}
                                    fullWidth
                                />


                                {/* Display Checkboxes directly beneath the dropdown */}
                                {selectedCertification === 1 && (
                                    <Box sx={{ mt: 2 }}>
                                        <FormGroup sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                                            <FormControlLabel
                                                control={<Checkbox checked={certificationValues.TC === 1} onChange={handleCheckboxChange} name="TC" />}
                                                label="TC"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox checked={certificationValues.GOTS === 1} onChange={handleCheckboxChange} name="GOTS" />}
                                                label="GOTS"
                                            />
                                            <FormControlLabel
                                                control={<Checkbox checked={certificationValues.Others === 1} onChange={handleCheckboxChange} name="Others" />}
                                                label="Others"
                                            />
                                        </FormGroup>
                                    </Box>
                                )}
                            </Box>

                            <RHFAutocomplete
                                name="Currency"
                                label="Currency"
                                options={currencies}
                                getOptionLabel={(option) => option?.currencyName || ""}

                                value={currencies?.find((x) => x.currencyID === values?.Currency?.currencyID) || null}
                                fullWidth

                            />

                        </Box>
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            {/* Buyer Commission */}
                            <Box sx={{ flex: 1 }}>

                                <RHFTextField name="buyerCommissions" label="Buyer Commission (%)" fullWidth variant="outlined" />


                                <TextField
                                    variant="outlined"

                                    sx={{ mt: 1 }}
                                    value={calculateCommission(values.buyerCommissions, totalAmount)}
                                    InputProps={{ readOnly: true }}
                                />
                            </Box>

                            {/* Vendor Commission */}
                            <Box sx={{ flex: 1 }}>
                                <RHFTextField name="vendorCommissions" label="Vendor Commission (%)" fullWidth variant="outlined" />


                                <TextField
                                    variant="outlined"

                                    sx={{ mt: 1 }}
                                    value={calculateCommission(values.vendorCommissions, totalAmount)}
                                    InputProps={{ readOnly: true }}
                                />
                            </Box>

                            {/* Total Markup */}
                            <Box sx={{ flex: 1 }}>
                                <TextField label="Total Markup (%)" fullWidth variant="outlined" InputProps={{ readOnly: true }} />


                                <TextField
                                    variant="outlined"
                                    name="totalMarkups"
                                    sx={{ mt: 1 }}
                                    value={calculateMark(totalQuantity, totalMark)}
                                    InputProps={{ readOnly: true }}
                                />
                            </Box>
                        </Box>

                    </div>

                </Card>


                <Card sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Reference & Attachment
                    </Typography>

                    {/* Comment Field */}
                    <RHFTextField name="comments" label="Add a comment" fullWidth variant="outlined" multiline sx={{ mb: 2 }} rows={3} />

                    <RHFUpload
                        name="files"
                        files={files}
                        accept={{ 'application/pdf': ['.pdf'] }}
                        onDrop={handleDrop}
                        onRemove={handleDeleteFile}
                        sx={{ mt: 2 }}
                        multiple
                    />


                </Card>
                <Button

                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3 }}
                >
                    Submit
                </Button>
            </FormProvider>

        </Container >
    );
};

export default BookingOrder;



