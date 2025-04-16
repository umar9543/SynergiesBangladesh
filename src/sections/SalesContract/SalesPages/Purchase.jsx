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
    Stack
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


    const rowsPerPage = 10;

    // Open/Close Dialog
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);

        setDataList([]);
    };

    // Handle Style No Input
    const handleStyleNoChange = (e) => setStyleNo(e.target.value);



    // Fetch Data (All or Specific)
    const handleGetData = async () => {
        setLoading(true);
        try {
            let apiUrl;

            if (styleNo?.trim()) {
                apiUrl = `https://localhost:44347/api/poreport?customerId=118&supplierId=197`;

            }
            else {
                apiUrl = "https://localhost:44347/api/poreport?customerId=118&supplierId=197";

            }

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();
            console.log(data)
            setDataList(data); // Handle single object response
        } catch (error) {
            console.error("Error fetching data:", error);
            setDataList([]); // Clear data on error
        }
        setLoading(false);
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

    // Handle Pagination
    const handlePageChange = (event, value) => setCurrentPage(value);

    // Paginate Data
    const paginatedData = dataList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);


    useEffect(() => {
        const updatedRows = selectedRows.map((row) => ({
            ...row,
            markupPerPc: row.itemPrice ? (Number(row.itemPrice) - Number(row.vendorPrice || row.itemPrice)) : 0,
            contractValue: row.poQuantity ? (Number(row.poQuantity) * Number(row.itemPrice || 0)) : 0,
        }));
        console.log("markup", updatedRows)
        // Only update if the new state is different from the current state
        setSelectedRows(prevRows => {
            const isSame = JSON.stringify(prevRows) === JSON.stringify(updatedRows);
            return isSame ? prevRows : updatedRows;
        });
        // eslint-disable-next-line 
    }, [selectedRows]);

    useEffect(() => {
        const totalQty = selectedRows.reduce((sum, row) => sum + (row.quantity || 0), 0);
        const totalVal = selectedRows.reduce((sum, row) => sum + (row.totalAmount || 0), 0).toFixed(2);

        setTotalQuantity(totalQty);
        setTotalAmount(totalVal);
        // eslint-disable-next-line 
    }, [selectedRows])




    // Calculate all values when clicking the button
    const handleCalculate = () => {
        const totalQty = selectedRows.reduce((sum, row) => sum + (row.poQuantity || row.quantity || 0), 0);
        const totalVal = selectedRows.reduce((sum, row) => sum + (row.contractValue || 0), 0);

        setTotalQuantity(totalQty);
        setTotalAmount(totalVal);
    };
    return (
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
                        label="Style No (Leave empty to get all data)"
                        fullWidth
                        value={styleNo}
                        onChange={handleStyleNoChange}
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
                                            <TableCell sx={{ minWidth: 100 }}>PONO</TableCell>

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
                                                    <TableCell>{row.markUpPerPc}</TableCell>

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
                                    <TableCell sx={{ minWidth: 100 }}>PONO</TableCell>

                                    <TableCell sx={{ minWidth: 100 }}>Shipment Date</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>Quantity</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>Unit Price</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>Total Amount</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>Currency</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>Customer FOB</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>Buyer Commission (%)</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>Vendor Commission (%)</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>Mark-Up Per Pc.</TableCell>
                                    <TableCell  >Remove</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedRows.map((row, index) => (
                                    <TableRow key={index}>

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
                                        <TableCell>{row.markUpPerPc}</TableCell>
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


                    <Box sx={{ display: "flex", gap: 5, mt: 2, p: 2 }}>
                        {/* Total Quantity (Non-editable) */}
                        <TextField
                            label="Total Quantity"
                            type="number"
                            value={totalQuantity}
                            sx={{ width: 400 }}
                            disabled
                        />

                        {/* Total Value (Non-editable) */}
                        <TextField
                            label="Total Value"
                            type="number"
                            value={totalAmount}
                            sx={{ width: 400 }}
                            disabled
                        />

                        <TextField
                            label="Total Value"
                            type="number"
                            value={totalAmount}
                            sx={{ width: 400 }}
                            disabled
                        />
                        <TextField
                            label="Total Value"
                            type="number"
                            value={totalAmount}
                            sx={{ width: 400 }}
                            disabled
                        />

                    </Box>
                   
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

