import { useMemo } from 'react';
import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import { decrypt } from 'src/api/encryption';
import { Button } from '@mui/material';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

export default function BookingTableRow({ row, selected, onEditRow, onDeleteRow }) {
  const {
    salesContractNo,
    customerName,
    supplierName,
    salesContractDate,
    expiryDate,
    managerApproval,
    hodApproval,
    managmentApproval,
  } = row;

  const userData = useMemo(() => JSON.parse(localStorage.getItem('UserData')), []);
  const confirm = useBoolean();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{salesContractNo}</TableCell>

        <TableCell>{customerName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{supplierName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{salesContractDate}</TableCell>

        <TableCell sx={{ textAlign: 'center' }}>{expiryDate}</TableCell>

        <TableCell sx={{ textAlign: 'center' }}>{managerApproval}</TableCell>

        <TableCell sx={{ textAlign: 'center' }}>{hodApproval}</TableCell>

        <TableCell sx={{ textAlign: 'center' }}>{managmentApproval}</TableCell>

        <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <>
            <IconButton onClick={() => onEditRow()}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>

            {/* <IconButton
                color="error"
                onClick={() => {
                  confirm.onTrue();
                }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton> */}
          </>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteRow();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

BookingTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
