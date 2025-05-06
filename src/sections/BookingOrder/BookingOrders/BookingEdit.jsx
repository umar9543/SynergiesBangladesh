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
    RHFUploadAvatar,
    RHFAutocomplete,
} from 'src/components/hook-form';
import { useSettingsContext } from "src/components/settings";
import { decrypt } from "src/api/encryption";
import PropTypes from "prop-types";
import { LoadingScreen } from "src/components/loading-screen";
import ProductSpecificInfo from "./Purchase";


const BookingEdit = ({ selectedBooking, currentStyles, urlData }) => {

    function formatDate(isoString) {
        const date = new Date(isoString);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        return `${dd}/${mm}/${yy}`;
    }

    // Example usage


  const decryptObjectKeys = (data) => {
    const decryptedData = data.map((item) => {
      const decryptedItem = {};
      Object.keys(item).forEach((key) => {
        decryptedItem[key] = decrypt(item[key]);
      });
      return decryptedItem;
    });
    return decryptedData;
  };

 
   const userData = useMemo(() => JSON.parse(localStorage.getItem('UserData')), []);
   const UserID=decrypt(userData.ServiceRes.UserID);
   const RoleID=decrypt(userData.ServiceRes.RoleID);
   const ECPDivistion=decrypt(userData.ServiceRes.ECPDivistion);
    const certificationOptions = ["Yes", "No"];
    const [selectedCertification, setSelectedCertification] = useState(selectedBooking?.b_isCertifications ? 1 : 0 || null);
    const [certificationValues, setCertificationValues] = useState({
        TC: 0,
        GOTS: 0,
        Others: 0
    });
    const handleCertificationChange = (event, newValue) => {
        console.log('newvalue', newValue?.id)
        // const certificationValue = newValue === "Yes" ? 1 : 0;
        setValue("certification", newValue?.id);
        setSelectedCertification(newValue?.id);

        if (newValue?.id === 0) {
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
    const [totalMark, setTotalMark] = useState(0); // Initialize with 0



    const [cancelQuantity, setCancelQuantity] = useState(selectedBooking.bookingCancelQty || "");
    // Function to calculate commission


    const userdata = JSON.parse(localStorage.getItem("UserData"))

    const validationSchema = Yup.object().shape({
        // RefNO: Yup.string().required("Reference No is required"),
        // placementDates: Yup.date().required("placementDate is required"),
        // shipmentDateBuyer: Yup.date()
        //     .required("Shipment Date (Buyer) is required")
        //     .min(Yup.ref('placementDates'), "Shipment Date (Buyer) must be after Placement Date"),

        // shipmentDateVendor: Yup.date()
        //     .required("Shipment Date (Vendor) is required")
        //     .min(Yup.ref('placementDates'), "Shipment Date (Vendor) must be after Placement Date"),
        // customer: Yup.object().nullable().required("Customer is required"),
        // brandCustomer: Yup.object().nullable().required("Customer Brand is required"),
        // supplier: Yup.object().nullable().required("Supplier is required"),

        // merchant: Yup.object().nullable().required("Merchant is required"),
        // productPortfolio: Yup.object().nullable().required("Product Portfolio is required"),
        // productCategory: Yup.object().nullable().required("Product Category is required"),
        // productGroup: Yup.object().nullable().required("Product Group is required"),
        // season: Yup.string().required("Season is required"),
        // fabricType: Yup.string().required("Fabric Type is required"),
        // businessManagers: Yup.object().nullable(),
        // Currency: Yup.object().nullable().required("Currency is required"),
        // construction: Yup.string().required("Construction is required"),
        // design: Yup.string().required("Design is required"),
        // transaction: Yup.object().nullable().required("Transaction is required"),
        // lcopt: Yup.object().nullable(),
        // paymentType: Yup.object(),
        // shipmentMode: Yup.object().nullable().required("Shipment Mode is required"),
        // paymentMode: Yup.object().nullable().required("Payment Mode is required"),
        // certification: Yup.string().required("Certification selection is required"),
        // buyerCommissions: Yup.number(),
        // vendorCommissions: Yup.number(),
        // totalMarkups: Yup.number(),
        // comments: Yup.string().nullable(),
        // files: Yup.array().of(
        //     Yup.mixed().test("fileType", "Only PDF files are allowed", file => file?.type === "application/pdf")
        // )
        //     .nullable(),
    });


    const calculateCommission = (commission, totalAmt) => {

        if (!commission || !totalAmt) return 0;
        return ((Math.round((commission * totalAmt) / 100 * 100) / 100).toFixed(2))


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
    const cerOpt = [{
        id: 1,
        name: "Yes"
    }, {
        id: 0,
        name: "No"
    }]
    const supPerCustom = [{ id: 262, name: "Synergies Sourcing BD" },]
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState(paymentType.find((x) => x.name === selectedBooking?.paymentTypeNew)?.id || null);
    const [selectedLCOption, setSelectedLCOption] = useState(selectedBooking?.lcTo || null);

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
    }, []);
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

    // Fetch customer brand data based on selected customer
    useEffect(() => {
        if (values?.customer?.customerID) {
            setValue('brandCustomer', null);

            Get(`https://ssblapi.m5groupe.online:6449/api/customerbrand/${values?.customer?.customerID}`)
                .then(response => {
                    const decryptedData = decryptObjectKeys(response.data);

                    // ✅ Convert brandID to number
                    const formattedData = decryptedData.map(item => ({
                        brandID: Number(item.brandID), // Convert to number
                        brandName: item.brandName,
                    }));

                    setBrandData(formattedData);
                })
                .catch(error => console.error("Error fetching customer brands:", error));
        } else {
            setBrandData([]); // Reset brand data when no customer is selected
        }
    }, [values?.customer?.customerID, setValue]);


    useEffect(() => {
        Get(`https://ssblapi.m5groupe.online:6449/api/Merchants?userID=${UserID}&roleID=${RoleID}`)
            .then(response => {
                const decryptedData = decryptObjectKeys(response.data);

                // ✅ Ensure merchantID is a number
                const formattedData = decryptedData.map(item => ({
                    userID: Number(item.userID),
                    userName: item.userName,
                }));

                setMerchantData(formattedData);
            })
            .catch(error => console.error("Error fetching merchants:", error));
    }, [UserID, RoleID]);
    console.log(MerchantData);

    useEffect(() => {
        Get("https://ssblapi.m5groupe.online:6449/api/ProductPortfolio")
            .then(response => {
                const decryptedData = decryptObjectKeys(response.data);

                // ✅ Ensure productID is a number
                const formattedData = decryptedData.map(item => ({
                    productPortfolioID: Number(item.productPortfolioID), // Convert to number
                    productPortfolioName: item.productPortfolioName,
                }));

                setproductPortfolioData(formattedData);
            })
            .catch(error => console.error("Error fetching product portfolio:", error));
    }, []);

    useEffect(() => {
        if (values?.productPortfolio?.productPortfolioID) {
            Get(`https://ssblapi.m5groupe.online:6449/api/productcategory/${values.productPortfolio.productPortfolioID}`)
                .then(response => {
                    const decryptedData = decryptObjectKeys(response.data);

                    // ✅ Convert productCategoriesID to number
                    const formattedData = decryptedData.map(item => ({
                        productCategoriesID: Number(item.productCategoriesID), // Convert to number
                        productCategory: item.productCategory,
                    }));

                    setproductCategoryData(formattedData);
                })
                .catch(error => console.error("Error fetching product categories:", error));
        } else {
            setproductCategoryData([]); // Reset category data when no product portfolio is selected
        }
    }, [values?.productPortfolio?.productPortfolioID]);

    useEffect(() => {
        if (values?.productCategory?.productCategoriesID) {
            Get(`https://ssblapi.m5groupe.online:6449/api/productgroup/${values.productCategory.productCategoriesID}`)
                .then(response => {
                    const decryptedData = decryptObjectKeys(response.data);

                    // ✅ Convert productGroupID to number
                    const formattedData = decryptedData.map(item => ({
                        productGroupID: Number(item.productGroupID), // Convert to number
                        groupName: item.groupName,
                    }));

                    setproductGroupData(formattedData);
                })
                .catch(error => console.error("Error fetching product groups:", error));
        } else {
            setproductGroupData([]); // Reset product group data when no category is selected
        }
    }, [values?.productCategory?.productCategoriesID]);


    useEffect(() => {

        Get(`https://ssblapi.m5groupe.online:6449/api/businessmanagers?ecpDivision=${ECPDivistion}`)
            .then(response => {

                setBusinsessManager(response.data)
            })
            .catch(error => console.error("Error fetching customers:", error));
    }, [ECPDivistion]);
    useEffect(() => {
        Get("https://ssblapi.m5groupe.online:6449/api/shipmentmode")
            .then(response => {
                const decryptedData = decryptObjectKeys(response.data);

                // ✅ Ensure shipmentModeID is a number
                const formattedData = decryptedData.map(item => ({
                    id: Number(item.id), // Convert to number
                    name: item.name,
                }));

                setShipmentModes(formattedData);
            })
            .catch(error => console.error("Error fetching shipment modes:", error));
    }, []);

    useEffect(() => {
        Get("https://ssblapi.m5groupe.online:6449/api/paymentmode")
            .then(response => {
                const decryptedData = decryptObjectKeys(response.data);

                // ✅ Ensure paymentModeID is a number
                const formattedData = decryptedData.map(item => ({
                    id: Number(item.id), // Convert to number
                    name: item.name,
                }));

                setPaymentModes(formattedData);
            })
            .catch(error => console.error("Error fetching payment modes:", error));
    }, []);

    useEffect(() => {
        Get("https://ssblapi.m5groupe.online:6449/api/currency")
            .then(response => {
                const decryptedData = decryptObjectKeys(response.data);
                setCurrencies(decryptedData)
            })
            .catch(error => console.error("Error fetching currency:", error));
    }, []);
    const [selectedRows, setSelectedRows] = useState(currentStyles || []);

    const defaultValues = useMemo(
        () => ({
            RefNO: selectedBooking?.pono || '',
            placementDates: selectedBooking?.placementDate || null,
            shipmentDateBuyer: selectedBooking?.shipmentDate || null,
            customer: selectedBooking?.customerID
                ? customerData?.find((x) => x.customerID === selectedBooking.customerID)
                : null,
            // brandCustomer: selectedBooking?.cusBrandID
            //     ? brandData.find((x) => x.brandID === selectedBooking.cusBrandID)
            //     : null,
            supplier: selectedBooking?.supplierID
                ? SupplierData.find((x) => x.venderLibraryID === selectedBooking.supplierID)
                : null,

            shipmentDateVendor: selectedBooking?.tolerance || null,
            merchant: selectedBooking?.marchandID
                ? MerchantData.find((x) => x.userID === selectedBooking.marchandID)
                : null,
            supplierPC: selectedBooking?.preSupplierID
                ? supPerCustom.find((x) => x.id === selectedBooking.preSupplierID)
                : null,
            // Product Information
            productPortfolio: selectedBooking?.productPortfolioID
                ? productPortfolioData.find((x) => x.productPortfolioID === selectedBooking.productPortfolioID)
                : null,

            // productGroup: selectedBooking?.productGroupID
            //     ? productGroupData.find((x) => x.productGroupID === selectedBooking.productGroupID)
            //     : null,
            season: selectedBooking?.season || '',
            fabricType: selectedBooking?.quality || '',
            businessManagers: selectedBooking?.businessManagerUserID
                ? BusinsessManager.find((x) => x.userID === selectedBooking.businessManagerUserID)
                : null,
            construction: selectedBooking?.construction || '',
            design: selectedBooking?.design || '',
            transaction: selectedBooking?.transactions
                ? Transactions.find((x) => x.TransName === selectedBooking.transactions)
                : null,

            // Commercial Section
            paymentType: selectedBooking?.paymentTypeNew
                ? paymentType.find((x) => x.name === selectedBooking?.paymentTypeNew)
                : null,
            lcopt: selectedBooking?.lcTo && lcOptions.includes(selectedBooking.lcTo)
                ? selectedBooking.lcTo
                : null,
            shipmentMode: Number(selectedBooking?.shipmentMode)
                ? shipmentModes.find((x) => x.id === Number(selectedBooking?.shipmentMode))
                : null,
            paymentMode: Number(selectedBooking?.paymentMode)
                ? paymentModes.find((x) => x.id === Number(selectedBooking?.paymentMode))
                : null,
            certification: selectedBooking?.b_isCertifications !== undefined
                ? cerOpt.find((x) => x.id === (selectedBooking.b_isCertifications ? 1 : 0))
                : null,
            Currency: selectedBooking?.currency
                ? currencies.find((x) => x.currencyName === selectedBooking.currency)
                : null,
            buyerCommissions: selectedBooking?.commission || 0,
            vendorCommissions: selectedBooking?.vendorCommission || 0,
            totalMarkups: selectedBooking?.totalMarkups || 0,

            // Reference & Attachment
            comments: selectedBooking?.poRemarks || '',
            // files: selectedBooking?.files || [],
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            selectedBooking,
            customerData,
            // brandData,

            SupplierData,
            MerchantData,
            productPortfolioData,
            // productCategoryData,
            // productGroupData,
            BusinsessManager,
            //   Transactions,
            //   paymentType,
            shipmentModes,
            paymentModes,
            currencies
        ]
    );
    console.log(selectedBooking?.preSupplierID)
    useEffect(() => {
        if (selectedBooking?.fileUrls) {
            const formattedFiles = selectedBooking.fileUrls.map((file) => ({
                name: file.originalFileName, // Extract original filename
                preview: file.fileUrl, // Use the URL for preview
            }));
            setFiles(formattedFiles);
        }
    }, [selectedBooking]);


    useEffect(() => {
        setValue("brandCustomer", selectedBooking?.cusBrandID
            ? brandData.find((x) => x.brandID === selectedBooking.cusBrandID)
            : null,)
    }, [brandData, selectedBooking, setValue])

    useEffect(() => {
        setValue("productCategory", selectedBooking?.productCategoriesID
            ? productCategoryData.find((x) => x.productCategoriesID === selectedBooking.productCategoriesID)
            : null,)
    }, [productCategoryData, selectedBooking, setValue])

    useEffect(() => {
        setValue("productGroup", selectedBooking?.productGroupID
            ? productGroupData.find((x) => x.productGroupID === selectedBooking.productGroupID)
            : null,)
    }, [productGroupData, selectedBooking, setValue])

    useEffect(() => {
        if (selectedBooking) {
            setLoading(true); // Enable loader
            setTimeout(() => {
                methods.reset(defaultValues); // Reset form with fetched values
                setLoading(false); // Disable loader when data is ready
            }, 2000); // Simulating API delay (replace with actual API call)
        }
    }, [selectedBooking, defaultValues, methods]);

    // console.log("ids", selectedBooking)
    const InsertMstData = async (DataToInsert) => {

        const cleanDataToInsert = {
            ...DataToInsert,
            lcTo: typeof DataToInsert.lcTo === "object" ? DataToInsert.lcTo.value || DataToInsert.lcTo : "__",
            paymentType: DataToInsert.paymentType?.id || DataToInsert.paymentType, // Extract only the ID
            paymentTypeNew: DataToInsert.paymentType?.name || DataToInsert.paymentType, // Extract only the ID
        };
        try {
            const formData = new FormData();
            Object.keys(DataToInsert).forEach((key) => {
                if (DataToInsert[key] !== undefined && DataToInsert[key] !== null) {
                    formData.append(key, DataToInsert[key]);
                }
            });

            // ✅ Append files under correct key "File"
            if (files?.length > 0) {
                formData.append("File", files[0]); // ✅ Backend expects `dto.File`
            }
            let res;

            if (selectedBooking) {
                // ✅ Send JSON for UPDATE API (PUT)
                res = await axios.put(`https://ssblapi.m5groupe.online:6449/api/BookingPurchase/${urlData?.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }, // Ensure JSON format
                });

                return res.status === 200;
            }
            // eslint-disable-next-line
            else {


                res = await axios.post(`https://ssblapi.m5groupe.online:6449/api/BookingPurchase/create`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (res.status === 200) {
                    const { poid } = res.data;
                    if (poid) {
                        return poid; // ✅ Return POID if success
                    }
                }

                enqueueSnackbar('Error: POID missing from response', { variant: 'error' });
                return null;
            }
        } catch (error) {
            console.error(`Error creating/updating master data:`, error);
            return null;
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
            const res = await Post(`https://ssblapi.m5groupe.online:6449/api/BookingPurchase/add-details`, detailPayload);
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
            const mstData = {
                PONO: data.RefNO,
                PlacementDate: new Date(data.placementDates).toISOString(),
                ShipmentDate: new Date(data.shipmentDateBuyer).toISOString(),
                Tolerance: new Date(data.shipmentDateVendor).toISOString(),
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
                PaymentType: data.paymentType?.id.toString(),
                PaymentTypeNew: data.paymentType?.name,
                LCTo: data.lcOptions || "--",
                ShipmentMode: data.shipmentMode?.id.toString(),
                PaymentMode: data.paymentMode?.id.toString(),
                Commission: data.buyerCommissions,
                VendorCommission: data.vendorCommissions,
                TotalAmount: totalAmount || 0,
                PORemarks: data.comments,
                BookingCancelQty: cancelQuantity || 0,
                PreSupplierID: data.supplierPC?.id || 0,
                TotalQty: totalQuantity || 0,
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
            if (selectedBooking) {
                enqueueSnackbar(" Data Updated Successfully", { variant: "success" });
                return true;
            }
            // ✅ If POID is received, submit detail data
            const isDetailSuccess = await InsertDetailData(poid, selectedRows);


            if (!isDetailSuccess && selectedRows) {
                enqueueSnackbar("Something went wrong", { variant: "error" });
                return false; // ✅ Stop if Detail API fails
            }

            // ✅ Success message only if both APIs succeed
            enqueueSnackbar(" Data Uploaded Successfully", { variant: "success" });
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
    const settings = useSettingsContext();
    // console.log("ghfg",customerData?.find((x) => x.customerID === values?.customer?.customerID))
    // console.log("custiemr",values.customer)
    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            {loading ? (
                // Show Loader while data is being fetched
                <LoadingScreen sx={{ height: { xs: 200, md: 300 } }} />
            ) : (

                <FormProvider methods={methods} onSubmit={onSubmit}>


                    <div>
                        <Card sx={{ mt: 3, p: 2 }}>
                            <Typography variant="h5" sx={{ mb: 3 }}>
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
                                <RHFTextField name="RefNO"
                                    InputLabelProps={{ shrink: true }}
                                    value={values?.RefNO} label="Booking Ref. NO" />
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

                                // onchange={(newValue) => setValue("customer", newValue)}
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
                            <Typography variant="h5" sx={{ mb: 3 }}>
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
                                        onChange={(event, newValue) => setSelectedLCOption(newValue)}
                                        value={lcOptions?.find((x) => x === selectedLCOption) || null}
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
                                        options={cerOpt}
                                        getOptionLabel={(option) => option?.name || ""}
                                        onChange={handleCertificationChange}
                                        value={cerOpt.find((x) => x.id === (values?.certification?.id ?? -1)) || null} // Ensure valid default
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
                                <Box sx={{ flex: 1, display: "flex", flexDirection: "row", height: "100%", gap: 1 }}>
                                    <RHFTextField
                                        name="buyerCommissions"
                                        label="Buyer Commission (%)"
                                        type="number"
                                        fullWidth
                                        variant="outlined"
                                    />

                                    <TextField
                                        variant="outlined"
                                        sx={{ mt: "auto", alignSelf: "flex-end" }} // Ensures it stays at the bottom
                                        value={calculateCommission(values.buyerCommissions, totalAmount)}
                                        InputProps={{ readOnly: true }}
                                    />
                                </Box>

                                {/* Vendor Commission */}
                                <Box sx={{ flex: 1, display: "flex", flexDirection: "row", height: "100%", gap: 1 }}>
                                    <RHFTextField name="vendorCommissions" label="Vendor Commission (%)" type="number" fullWidth variant="outlined" />


                                    <TextField
                                        variant="outlined"

                                        sx={{ mt: "auto", alignSelf: "flex-end" }}
                                        value={calculateCommission(values.vendorCommissions, totalAmount)}
                                        InputProps={{ readOnly: true }}
                                    />
                                </Box>

                                {/* Total Markup */}
                                <Box sx={{ flex: 1, display: "flex", flexDirection: "row", height: "100%", gap: 1 }}>
                                    <TextField label="Total Markup (%)" fullWidth variant="outlined" InputProps={{ readOnly: true }} />


                                    <TextField
                                        variant="outlined"
                                        name="totalMarkups"
                                        sx={{ mt: "auto", alignSelf: "flex-end", textAlign: "right" }}
                                        value={calculateMark(totalQuantity, totalMark)}
                                        InputProps={{ readOnly: true }}

                                    />
                                </Box>
                            </Box>

                        </div>

                    </Card>


                    <Card sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h5" sx={{ mb: 3 }}>
                            Reference & Attachment
                        </Typography>

                        {/* Comment Field */}
                        <RHFTextField name="comments" label="Add a comment" fullWidth variant="outlined" multiline sx={{ mb: 2 }} rows={3} />

                        <Upload

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
            )}
        </Container >
    );
};
BookingEdit.propTypes = {
    selectedBooking: PropTypes.object,
    currentStyles: PropTypes.array,
    urlData: PropTypes.any,

}
export default BookingEdit;



