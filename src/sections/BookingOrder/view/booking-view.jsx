import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { useBoolean } from 'src/hooks/use-boolean';
import { Delete, Get } from 'src/api/apibasemethods';

import { LoadingScreen } from 'src/components/loading-screen';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { decrypt, encrypt } from 'src/api/encryption';

import BookingTableRow from '../booking-table-row';
import BookingTableToolbar from '../booking-toolbar';
import BookingTableFiltersResult from '../booking-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'poNo', label: 'Booking Ref.NO', minWidth: 140 },
  { id: 'username', label: 'Merchant', minWidth: 140 },
  { id: 'customer', label: 'Customer', minWidth: 240 },
  { id: 'vendor', label: 'Supplier', minWidth: 140 },
  { id: 'styleNo', label: 'Style No', minWidth: 140 },
  { id: 'placementDate', label: 'Placement Date', minWidth: 140,align: 'center' },
  { id: 'shipmentDate', label: 'Shipment Date', minWidth: 140,align: 'center' },

  { id: 'pOqty', label: 'Booking Quantity', minWidth: 160,align: 'center' },
  { id: 'amount', label: 'Amount', minWidth: 100,align: 'center' },
  { id: 'remainingQty', label: 'Remaining Qty', minWidth: 140,align: 'center' },
  { id: '', label: 'Actions', width: 88, align: 'center' },
];

const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function BookingListView() {
  const navigate = useNavigate();
  const userData = useMemo(() => JSON.parse(localStorage.getItem('UserData')), []);
     const UserID=decrypt(userData.ServiceRes.UserID);
     const RoleID=decrypt(userData.ServiceRes.RoleID);
     const ECPDivistion=decrypt(userData.ServiceRes.ECPDivistion);
 
  
  // Table component Ref
  const tableComponentRef = useRef();

  // Fetching data:
  const [tableData, setTableData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const decryptObjectKeys = (data, keysToExclude = []) => {
    const decryptedData = data.map((item) => {
      const decryptedItem = {};
      Object.keys(item).forEach((key) => {
        if (!keysToExclude.includes(key)) {
          decryptedItem[key] = decrypt(item[key]);
        } else {
          decryptedItem[key] = item[key];
        }
      });
      return decryptedItem;
    });
    return decryptedData;
  };

  const FetchBookingData = useCallback(async () => {
    try {
      const response = await Get(`https://ssblapi.m5groupe.online:6449/api/BookingPurchase/api/booking?userId=${UserID}&division=${ECPDivistion}`);
      // const keysToExclude = ['EmployeeImage'];
      // const decryptedData = decryptObjectKeys(response.data.ServiceRes, keysToExclude);
      setTableData(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [UserID, ECPDivistion]);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([FetchBookingData()]);
      setLoading(false);
    };
    fetchData();
  }, [FetchBookingData]);

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Edit Functions
  const [selectedBooking, setSelectedBooking] = useState(null);
  const moveToEditForm = async(e) => {
    // try {
    //   const response = await fetch(`https://localhost:44347/api/BookingPurchase/${e}`);
    //   const bookingData = await response.json();

    //   if (response.ok) {
    //       setSelectedBooking(bookingData); // Set data for editing
         
          navigate(paths.dashboard.bookingOrder.edit(e)); // Show form on edit click
  //     } else {
  //         console.error("Failed to fetch booking data.");
  //     }
  // } catch (error) {
  //     console.error("Error fetching booking data:", error);
  // }
    
  };

  // const DeleteDetailTableRow = async (id) => {
  //   // const updatedDetails = yarnContractDetails.filter((row) => row !== rowToDelete);
  //   // setYarnContractDetails(updatedDetails);
  //   try {
  //     await Delete(`DeleteBooking?YarnDatabaseID=${id}`);
  //     enqueueSnackbar('Deleted successfully', { variant: 'success' });
  //     FetchBookingData();
  //   } catch (error) {
  //     console.error('Error deleting detail:', error);
  //   }
  // };

  // -------------------------------------

  const renderLoading = (
    <LoadingScreen
      sx={{
        borderRadius: 1.5,
        bgcolor: 'background.default',
      }}
    />
  );

  return (
    <>
      {isLoading ? (
        renderLoading
      ) : (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
          <CustomBreadcrumbs
            heading="Booking Orders"
            links={[{ name: 'Home', href: paths.dashboard.root }, { name: 'Booking Orders' }]}
            action={
              <Button
                component={RouterLink}
                href={paths.dashboard.bookingOrder.add}
                variant="contained"
                startIcon={<Iconify icon="pepicons-pencil:plus" />}
                color="primary"
              >
                Add Booking Order
              </Button>
            }
            sx={{
              mb: { xs: 3, md: 5 },
            }}
          />

          <Card>
            <BookingTableToolbar
              filters={filters}
              onFilters={handleFilters}
              // here is filter dropdown
              tableRef={tableComponentRef.current}
            />

            {canReset && (
              <BookingTableFiltersResult
                filters={filters}
                onFilters={handleFilters}
                //
                onResetFilters={handleResetFilters}
                //
                results={dataFiltered.length}
                sx={{ p: 2.5, pt: 0 }}
              />
            )}

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction dense={table.dense} rowCount={dataFiltered.length} />

              <Scrollbar>
                <Table
                  ref={tableComponentRef}
                  size={table.dense ? 'small' : 'medium'}
                  sx={{ minWidth: 960 }}
                >
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataFiltered.length}
                    onSort={table.onSort}
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <BookingTableRow
                          key={row?.poid}
                          row={row}
                          selected={table.selected.includes(row?.poid)}
                          onEditRow={() => moveToEditForm(row?.poid)}
                          // onDeleteRow={() => DeleteDetailTableRow(row?.YarnDatabaseID)}
                        />
                      ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                    />

                    <TableNoData notFound={notFound} />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={dataFiltered.length}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              //
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />
          </Card>
        </Container>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (yarn) =>
        yarn?.customer.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        yarn?.username.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        yarn?.poNo.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        yarn?.styleNo.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        yarn?.vendor.toLowerCase().indexOf(name.toLowerCase()) !== -1
       
    );
  }

  // if (status !== 'all') {
  //   inputData = inputData.filter((supplier) => supplier.SupplierStatus === status);
  // }

  // if (role.length) {
  //   inputData = inputData.filter((yarn) => role.includes(yarn?.DepartmentName));
  // }

  return inputData;
}
