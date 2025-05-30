import { useMemo } from 'react';
import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import { decrypt } from 'src/api/encryption';
import { Button, Tooltip } from '@mui/material';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function BookingTableRow({ row, selected, onEditRow, onDeleteRow, onViewRow }) {
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
  const UserID = decrypt(userData.UserID);
  const RoleID = decrypt(userData.RoleID);
  const ECPDivistion = decrypt(userData.ECPDivistion);
  const confirm = useBoolean();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
  };
  const getStatusColor = (stID) => {
    switch (stID) {
      case 'Y':
        return 'success';
      case 'N':
        return 'error';
      case 'R':
        return 'error';
      //   case 'Uploaded':
      //     return 'info';
      default:
        return 'default';
    }
  };
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell >{salesContractNo}</TableCell>

        <TableCell  >{customerName}</TableCell>

        <TableCell >{supplierName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{salesContractDate}</TableCell>

        <TableCell sx={{ textAlign: 'center' }}>{expiryDate}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          <Label color={getStatusColor(managerApproval)}>
            {/* eslint-disable-next-line */}
            {managerApproval === 'Y' ? 'Approved' : 'Not Approved'}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          <Label color={getStatusColor(hodApproval)}>
            {/* eslint-disable-next-line */}
            {hodApproval === 'Y' ? 'Approved' : 'Not Approved'}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
          <Label color={getStatusColor(managmentApproval)}>
            {/* eslint-disable-next-line */}
            {managmentApproval === 'Y' ? 'Approved' : 'Not Approved'}
          </Label>
        </TableCell>


        <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <>
            <IconButton onClick={() => onEditRow()}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
            <IconButton onClick={() => onViewRow()}>
              <Iconify icon="mdi:file-pdf-box" />
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
        {/* <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="View PDF">
           
          </Tooltip>
        </TableCell> */}
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
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
