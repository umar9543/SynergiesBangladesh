import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import axios from 'axios';
import {
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Pagination,
    Checkbox,
    Box,
    Typography,
    Autocomplete,
    Card,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { enqueueSnackbar } from "notistack";
import Scrollbar from "src/components/scrollbar";
import { decryptObjectKeys } from "src/api/encryption";

const ProductSpecificInfo = ({ setTotalAmount, totalAmount, totalQuantity, setTotalQuantity, cancelQuantity,
    setCancelQuantity, selectedRows, setSelectedRows, totalMark, setTotalMark }) => {
    const [open, setOpen] = useState(false);
    const [styleNo, setStyleNo] = useState(null);
    const [dataList, setDataList] = useState([]);


    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showAddStyleForm, setShowAddStyleForm] = useState(false);
    const [sizeRangeData, setSizeRangeData] = useState([]);


    const [selectedCurrency, setSelectedCurrency] = useState(null);

    // const [totalAmount, settotalAmount] = useState(0);
    // Fetch Currencies from API


    const [newStyle, setNewStyle] = useState({
        styleNo: "",
        itemDescription: "",
        article: "",
        colorway: "",
        size: "",
        itemPrice: "",
        breakupType: "",
        styleFabrication: ""
    });

    const rowsPerPage = 10;

    // Open/Close Dialog
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setShowAddStyleForm(false);
        setDataList([]);
    };

    // Handle Style No Input
    const handleStyleNoChange = (e) => setStyleNo(e.target.value);

    const handleCancelQuantityChange = (event) => {
        let value = parseInt(event.target.value, 10) || 0;

        // Ensure cancelQuantity does not exceed totalQuantity
        if (value > totalQuantity) {
            enqueueSnackbar("values not be greater than total quantity!", { variant: "error" })
            value = totalQuantity;
        }

        setCancelQuantity(value);
    };

    // Fetch Data (All or Specific)
    const handleGetData = async () => {
        setLoading(true);
        try {
            let apiUrl;

            if (styleNo?.trim()) {
                apiUrl = `https://localhost:44347/api/Booking_Style/${styleNo}`;

            }
            else {
                apiUrl = "https://localhost:44347/api/Booking_Style";

            }

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();
            console.log(data)
            setDataList(decryptObjectKeys(data)); // Handle single object response
        } catch (error) {
            console.error("Error fetching data:", error);
            setDataList([]); // Clear data on error
        }
        setLoading(false);
    };

    // Handle Add Style Form Visibility
    const handleShowAddStyleForm = () => setShowAddStyleForm(true);

    // Handle Input Change for New Style
    const handleNewStyleChange = (e) => {
        const { name, value } = e.target;

        setNewStyle((prev) => ({
            ...prev,
            [name]: name === "itemPrice" ? parseFloat(value) || 0 : value, // Convert itemPrice to a number
        }));
    };


    const getRowId = (row) => `${row.styleNo}-${row.article}-${row.colorway}-${row.size}`;
    const handleSelectRow = (row) => {
        const rowId = getRowId(row);
        const isSelected = selectedRows.some(selected => getRowId(selected) === rowId);

        if (isSelected) {
            setSelectedRows(selectedRows.filter(selected => getRowId(selected) !== rowId));
        } else {
            setSelectedRows([...selectedRows, row]);
        }
    };


    // Submit New Style Data
    const handleSubmitNewStyle = async () => {
        console.log("Sending Data:", newStyle); // ✅ Log newStyle before sending

        try {
            const response = await fetch("https://localhost:44347/api/Booking_Style/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newStyle),
            });

            const responseText = await response.text(); // ✅ Get response as text
            console.log("Raw API Response:", responseText);

            if (!response.ok) {
                enqueueSnackbar("Something went wrong!", { variant: "error" })
                throw new Error(`Failed: ${responseText}`)
            };
            enqueueSnackbar("Style added successfully!")
            handleGetData();
            setShowAddStyleForm(false);
            setNewStyle({
                styleNo: "",
                itemDescription: "",
                article: "",
                colorway: "",
                size: "",
                itemPrice: 0, // Ensure itemPrice is set as a number
                breakupType: "",
                styleFabrication: ""
            });
        } catch (error) {
            console.error("Error adding style:", error);
            alert(`Failed to add style: ${error.message}`);
        }
    };


    // Handle Pagination
    const handlePageChange = (event, value) => setCurrentPage(value);

    // Paginate Data
    const paginatedData = dataList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    useEffect(() => {
        axios.get("https://localhost:44347/api/SizeRange")
            .then(response =>{
                const decryptedData = decryptObjectKeys(response.data);
                   setSizeRangeData(decryptedData)
            })
            
            .catch(error => console.error("Error fetching sizes:", error));
    }, []);

    useEffect(() => {
        const updatedRows = selectedRows.map((row) => ({
            ...row,
            markupPerPc: row.itemPrice ? (Number(row.itemPrice) - Number(row.vendorPrice || row.itemPrice)) : 0,
            contractValue: row.poQuantity ? (Number(row.poQuantity) * Number(row.itemPrice || 0)) : 0,
        }));
        console.log("markup",updatedRows)
        // Only update if the new state is different from the current state
        setSelectedRows(prevRows => {
            const isSame = JSON.stringify(prevRows) === JSON.stringify(updatedRows);
            return isSame ? prevRows : updatedRows;
        });
        // eslint-disable-next-line 
    }, [selectedRows]);

    useEffect(() => {
        const totalQty = selectedRows.reduce((sum, row) => sum + (row.poQuantity || row.quantity || 0), 0);
        const totalVal = selectedRows.reduce((sum, row) => sum + (row.contractValue || 0), 0).toFixed(2);

        setTotalQuantity(totalQty);
        setTotalAmount(totalVal);
        // eslint-disable-next-line 
    }, [selectedRows])

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...selectedRows];
        updatedRows[index][field] = Number(value); // Ensure numeric input

        // Calculate dependent fields
        if (field === "vendorPrice") {
            updatedRows[index].markupPerPc = (updatedRows[index].itemPrice || 0) - updatedRows[index].vendorPrice;
        }

        if (field === "poQuantity") {
            updatedRows[index].contractValue = Number(updatedRows[index].poQuantity || 0) * Number(updatedRows[index].itemPrice || 0);
        }


        setSelectedRows(updatedRows);
    };


    // Calculate all values when clicking the button
    const handleCalculate = () => {
        const totalQty = selectedRows.reduce((sum, row) => sum + (row.poQuantity || row.quantity || 0), 0);
        const totalVal = selectedRows.reduce((sum, row) => sum + (row.contractValue || 0), 0);

        setTotalQuantity(totalQty);
        setTotalAmount(totalVal);
    };
    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Product Specific Information
            </Typography>

            {/* Add Item Details Button */}
            <Box
                rowGap={3}
                columnGap={2}
                display="flex"
                flexWrap="wrap"
                justifyContent="space-between"
                sx={{
                    mb: 3,
                }}
            >



                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Add Item Details
                </Button>
            </Box>


            {/* Popup Dialog */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
                <DialogTitle>Select Item Details</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Style No (Leave empty to get all data)"
                        fullWidth
                        value={styleNo}
                        onChange={handleStyleNoChange}
                        margin="dense"
                    />
                    <LoadingButton
                        variant="contained"
                        onClick={handleGetData}
                        loading={loading}
                        sx={{ mt: 2 }}
                    >
                        Get Data
                    </LoadingButton>
                    <LoadingButton
                        variant="contained"
                        onClick={handleShowAddStyleForm}
                        sx={{ mt: 2, ml: 2 }}
                    >
                        Add Style
                    </LoadingButton>

                    {showAddStyleForm && (
                        <>

                            <Card sx={{ mt: 3, p: 2 }}>
                                <Box
                                    rowGap={3}
                                    columnGap={2}
                                    display="grid"
                                    gridTemplateColumns={{
                                        xs: "repeat(1, 1fr)",
                                        sm: "repeat(1, 1fr)",
                                        md: "repeat(3, 1fr)", // 3 items per row
                                    }}
                                >


                                    {/* Style No */}
                                    <TextField
                                        label="Style No"
                                        fullWidth
                                        name="styleNo"
                                        value={newStyle.styleNo}
                                        onChange={handleNewStyleChange}

                                    />

                                    {/* Item Description */}
                                    <TextField
                                        label="Item Description"
                                        fullWidth
                                        name="itemDescription"
                                        value={newStyle.itemDescription}
                                        onChange={handleNewStyleChange}

                                    />

                                    {/* Article */}
                                    <TextField
                                        label="Article"
                                        fullWidth
                                        name="article"
                                        value={newStyle.article}
                                        onChange={handleNewStyleChange}

                                    />

                                    {/* Colorway */}
                                    <TextField
                                        label="Colorway"
                                        fullWidth
                                        name="colorway"
                                        value={newStyle.colorway}
                                        onChange={handleNewStyleChange}

                                    />

                                    {/* Size Dropdown (Fetched from API) */}
                                    <Autocomplete
                                        options={sizeRangeData} // Replace with actual state variable holding API data
                                        getOptionLabel={(option) => option?.sizeRange || ""}
                                        fullWidth
                                        renderInput={(params) => <TextField {...params} label="Size Range" variant="outlined" fullWidth />}
                                        onChange={(event, newValue) => setNewStyle({ ...newStyle, size: newValue?.sizeRange || "" })}
                                    />

                                    {/* Item Price */}
                                    <TextField
                                        label="Item Price"
                                        fullWidth
                                        name="itemPrice"
                                        type="number"
                                        value={newStyle.itemPrice}
                                        onChange={handleNewStyleChange}

                                    />

                                    {/* Breakup Type Dropdown (Static Values) */}
                                    <Autocomplete
                                        options={["Ratio", "Fixed"]}
                                        renderInput={(params) => <TextField {...params} label="Breakup Type" variant="outlined" fullWidth />}
                                        onChange={(event, newValue) => setNewStyle({ ...newStyle, breakupType: newValue })}
                                    />

                                    {/* Fabrication */}
                                    <TextField
                                        label="Fabrication"
                                        fullWidth
                                        name="styleFabrication"
                                        value={newStyle.styleFabrication}
                                        onChange={handleNewStyleChange}

                                    />

                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: "end", mt: 2 }}>
                                    <LoadingButton
                                        variant="contained"
                                        onClick={handleSubmitNewStyle}
                                    >
                                        Add Style
                                    </LoadingButton>
                                </Box>
                            </Card>
                        </>
                    )}

                    {/* Data Table Inside Dialog */}
                    {dataList.length > 0 && (
                        <TableContainer component={Paper} sx={{ mt: 3, maxHeight: 400 }}>
                            <Scrollbar>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell >Select</TableCell>
                                            <TableCell>Style No</TableCell>
                                            <TableCell>Item Description</TableCell>
                                            <TableCell>Article</TableCell>
                                            <TableCell>Color</TableCell>
                                            <TableCell>Size</TableCell>
                                            <TableCell>Price</TableCell>
                                            <TableCell>Breakup Type</TableCell>
                                            <TableCell>Fabrication</TableCell>
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
                                                    <TableCell>{row.itemDescription}</TableCell>
                                                    <TableCell>{row.article}</TableCell>
                                                    <TableCell>{row.colorway}</TableCell>
                                                    <TableCell>{row.size}</TableCell>
                                                    <TableCell>{row.itemPrice}</TableCell>
                                                    <TableCell>{row.breakupType}</TableCell>
                                                    <TableCell>{row.styleFabrication}</TableCell>
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
                                    <TableCell sx={{ minWidth: 150 }}>Item Description</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>Article</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>Color</TableCell>
                                    <TableCell sx={{ minWidth: 80 }}>Size</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>Fabrication</TableCell>
                                    <TableCell sx={{ minWidth: 150 }}>PO Quantity</TableCell>
                                    <TableCell sx={{ minWidth: 150 }}>Buyer Price</TableCell>
                                    <TableCell sx={{ minWidth: 150 }}>Contract Value</TableCell>
                                    <TableCell sx={{ minWidth: 150 }}>Vendor Price</TableCell>
                                    <TableCell sx={{ minWidth: 150 }}>Markup Per Pc</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedRows.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell >{row.styleNo}</TableCell>
                                        <TableCell>{row.itemDescription}</TableCell>
                                        <TableCell>{row.article}</TableCell>
                                        <TableCell>{row.colorway}</TableCell>
                                        <TableCell>{row.size}</TableCell>
                                        <TableCell sx={{ minWidth: 150 }}>{row.styleFabrication}</TableCell>

                                        {/* PO Quantity - Editable */}
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={row.poQuantity || 0}
                                                onChange={(e) => handleInputChange(index, "poQuantity", Number(e.target.value))}
                                                fullWidth
                                            />
                                        </TableCell>

                                        {/* Buyer Price - NOT Editable, Pre-filled */}
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={row.itemPrice}
                                                fullWidth
                                                disabled
                                            />
                                        </TableCell>

                                        {/* Contract Value = PO Quantity * Buyer Price (Not Editable) */}
                                        <TableCell>
                                            <TextField type="number" value={Number(row.contractValue).toFixed(3) || 0} fullWidth
                                            />
                                        </TableCell>

                                        {/* Vendor Price - Editable, Default to Item Price */}
                                        <TableCell>
                                            <TextField
                                                type="number"
                                                value={row.vendorPrice || row.itemPrice || 0}
                                                onChange={(e) => handleInputChange(index, "vendorPrice", Number(e.target.value))}
                                                fullWidth
                                            />
                                        </TableCell>

                                        {/* Markup Per Pc = Buyer Price - Vendor Price (Not Editable) */}
                                        <TableCell>
                                            <TextField type="number" value={Number(row?.markupPerPc).toFixed(2) || 0} fullWidth disabled />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Scrollbar>

                    </Table>


                    <Box sx={{ display: "flex", gap: 5, mt: 2, p: 2 }}>
                        {/* Total Quantity (Non-editable) */}
                        <TextField
                            label="Total Quantity"
                            type="number"
                            value={totalQuantity}
                            sx={{ width: 400 }}
                            disabled
                        />
                        <TextField
                            label="Cancel Quantity"
                            type="number"
                            value={cancelQuantity || 0}
                            onChange={handleCancelQuantityChange}
                            sx={{ width: 400 }}
                            error={cancelQuantity > totalQuantity}
                            helperText={cancelQuantity > totalQuantity ? "Cannot exceed Total Quantity" : ""}
                        />
                        {/* Total Value (Non-editable) */}
                        <TextField
                            label="Total Value"
                            type="number"
                            value={totalAmount}
                            sx={{ width: 400 }}
                            disabled
                        />

                        {/* <TextField
                            label="Markup"
                            type="number"
                            value={totalMark}
                            sx={{ width: 400 }}
                            disabled
                        /> */}


                    </Box>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={handleCalculate} color='primary'>
                        Calculate
                    </Button>
                </TableContainer>
            )}
        </Box>
    );
};


ProductSpecificInfo.propTypes = {

    setTotalAmount: PropTypes.func,
    totalAmount: PropTypes.number,
    totalQuantity: PropTypes.number,
    setTotalQuantity: PropTypes.func,
    cancelQuantity: PropTypes.number,
    setCancelQuantity: PropTypes.func,
    selectedRows: PropTypes.object,
    setSelectedRows: PropTypes.func,
    totalMark: PropTypes.number,
    setTotalMark: PropTypes.func
}
export default ProductSpecificInfo;

