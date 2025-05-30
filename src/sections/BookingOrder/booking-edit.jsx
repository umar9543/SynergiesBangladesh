// import * as Yup from 'yup';
// import PropTypes from 'prop-types';
// import { useMemo, useCallback, useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';

// import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Stack from '@mui/material/Stack';
// import Grid from '@mui/material/Unstable_Grid2';
// import LoadingButton from '@mui/lab/LoadingButton';
// import { IconButton, InputAdornment } from '@mui/material';

// import { LoadingScreen } from 'src/components/loading-screen';

// import Iconify from 'src/components/iconify';
// import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hooks';

// import { useSnackbar } from 'src/components/snackbar';
// import FormProvider, {
//   RHFTextField,
//   RHFAutocomplete,
// } from 'src/components/hook-form';

// import { Get, Post, Put } from 'src/api/apibasemethods';
// import { decrypt, encrypt } from 'src/api/encryption';

// // ----------------------------------------------------------------------

// export default function BookingEditForm({ urlData }) {
//   const router = useRouter();
//   const { enqueueSnackbar } = useSnackbar();

//   const userData = useMemo(() => JSON.parse(localStorage.getItem('UserData')), []);
  

//   // Date In SQL format
//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');

//     return `${year}-${month}-${day}`;
//   };

//   const decryptObjectKeys = (data) => {
//     const decryptedData = data.map((item) => {
//       const decryptedItem = {};
//       Object.keys(item).forEach((key) => {
//         decryptedItem[key] = decrypt(item[key]);
//       });
//       return decryptedItem;
//     });
//     return decryptedData;
//   };

//   const [bookingModel, setBookingModel] = useState({
//     UserID: decrypt(userData.UserId),
//     YarnOriginID: '',
//     NickName: '',
//     CompositionID: '',
//     YarnCountID: '',
//     YarnCode: '',
//     OpeningBag: '0',
//     OpeningWeight: '0',
//     OpeningCarton: '0',
//     Composition: '',
//     UnitID: '',
//     ColorID: '',
//     VenderLibraryID: '1',
//   });
//   const [currentData, setCurrentData] = useState({});
//   const [yarnCount, setYarnCount] = useState([]);
//   const [yarnOrigin, setYarnOrigin] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [units, setUnits] = useState([]);
//   const [composition, setComposition] = useState([]);
//   const [isLoading, setLoading] = useState(true);
//   // ---------------------- XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX ------------------------

//   const NewBookingSchema = Yup.object().shape({
//     YarnCount: Yup.object().required('Yarn Count is required'),
//     YarnOrigin: Yup.object().required('Yarn Origin is required'),
//     Color: Yup.object().required('Color is required'),
//     Unit: Yup.object().required('Unit is required'),
//     Composition: Yup.string().when([], {
//       is: () => !bookingModel?.Composition,
//       then: (schema) => schema.required('Composition is required'),
//       otherwise: (schema) => schema.notRequired(),
//     }),
//     NickName: Yup.string().required('Nick Name is required'),
//   });

//   const defaultValues = useMemo(
//     () => ({
//       YarnCode: currentData?.YarnCode || '',
//       YarnCount: currentData?.YarnCountID
//         ? yarnCount.find((obj) => obj.value === currentData?.YarnCountID)
//         : '',
//       YarnOrigin: currentData?.YarnOriginID
//         ? yarnOrigin.find((obj) => obj.value === currentData?.YarnOriginID)
//         : '',
//       Color: currentData?.ColorID ? colors.find((obj) => obj.value === currentData?.ColorID) : '',
//       Unit: currentData?.UnitID ? units.find((obj) => obj.UnitID === currentData?.UnitID) : '',
//       Composition: currentData?.Composition || '',
//       NickName: currentData?.NickName || '',
      
//     }),
//     [currentData, yarnCount, yarnOrigin, colors, units]
//   );

//   const methods = useForm({
//     resolver: yupResolver(NewBookingSchema),
//   });

//   const {
//     reset,
//     watch,
//     control,
//     setValue,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;

//   const values = watch();

//   useEffect(() => {
//     if (!isLoading) {
//       methods.reset(defaultValues);
//     }
//   }, [isLoading, defaultValues, methods]);

//   // ------------------------------------
//   const GetBookingData = useCallback(async () => {
//     try {
//       const res = await Get(`GetBookingByID?YarnDatabaseID=${urlData.bookingID}`);
//       const decryptedMasterData = decryptObjectKeys(res.data.ServiceRes);

//       setBookingModel({
//         ...decryptedMasterData[0],
//         OpeningBag: '0',
//         OpeningWeight: '0',
//         OpeningCarton: '0',
//       });
//       setCurrentData(decryptedMasterData[0]);
//     } catch (error) {
//       console.log(error);
//     }
//   }, [urlData]);

//   const GetYarnCountData = useCallback(async () => {
//     try {
//       const response = await Get(`GetYarnCount?VendorLibraryID=1`);
//       const decryptedData = decryptObjectKeys(response.data.ServiceRes);
//       const formattedData = decryptedData?.map((item) => ({
//         value: item?.YarnCountID,
//         label: item?.YarnCount,
//       }));

//       setYarnCount(formattedData);
//     } catch (error) {
//       console.log(error);
//     }
//   }, []);

//   const GetYarnOriginData = useCallback(async () => {
//     try {
//       const response = await Get(`GetYarnOrigin`);
//       const decryptedData = decryptObjectKeys(response.data.ServiceRes);
//       const formattedData = decryptedData?.map((item) => ({
//         value: item?.YarnOriginID,
//         label: item?.OriginName,
//       }));

//       setYarnOrigin(formattedData);
//     } catch (error) {
//       console.log(error);
//     }
//   }, []);

//   const GetColorsData = useCallback(async () => {
//     try {
//       const response = await Get(`GetColor?VendorLibraryID=1`);
//       const decryptedData = decryptObjectKeys(response.data.ServiceRes);
//       const formattedData = decryptedData?.map((item) => ({
//         value: item?.ColorID,
//         label: item?.ColorName,
//       }));

//       setColors(formattedData);
//     } catch (error) {
//       console.log(error);
//     }
//   }, []);

//   const GetUnitsData = useCallback(async () => {
//     try {
//       const response = await Get(`GetUnit?VendorLibraryID=1`);
//       const decryptedData = decryptObjectKeys(response.data.ServiceRes);
//       setUnits(decryptedData);
//     } catch (error) {
//       console.log(error);
//     }
//   }, []);

//   const GetCompositionData = useCallback(async () => {
//     try {
//       const response = await Get(`GetComposition`);
//       const decryptedData = decryptObjectKeys(response.data.ServiceRes);
//       setComposition(decryptedData);
//     } catch (error) {
//       console.log(error);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       await Promise.all([
//         GetYarnCountData(),
//         GetYarnOriginData(),
//         GetColorsData(),
//         GetUnitsData(),
//         GetCompositionData(),
//         GetBookingData(),
//       ]);
//       setLoading(false);
//     };
//     fetchData();
//   }, [
//     GetYarnCountData,
//     GetYarnOriginData,
//     GetColorsData,
//     GetUnitsData,
//     GetCompositionData,
//     GetBookingData,
//   ]);

//   const PostYarnCount = async (newOption) => {
//     try {
//       const encryptedData = Object.assign(
//         {},
//         ...Object.keys({
//           YarnCount: newOption,
//           UserID: decrypt(userData[0]?.UserId),
//           VendorLibraryID: '1',
//         }).map((key) => ({
//           [key]: encrypt(
//             { YarnCount: newOption, UserID: decrypt(userData[0]?.UserId), VendorLibraryID: '1' }[
//               key
//             ]
//           ),
//         }))
//       );
//       await Post('InsertYarnCountData', encryptedData).then(async (res) => {
//         if (res.data.ResponseCode === '100') {
//           enqueueSnackbar('Yarn Count Added!');
//           await GetYarnCountData();
//         }
//       });
//     } catch (error) {
//       console.log(error);
//       enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
//     }
//   };

//   const PostYarnOrigin = async (newOption) => {
//     try {
//       const encryptedData = Object.assign(
//         {},
//         ...Object.keys({
//           OriginName: newOption,
//           UserID: decrypt(userData[0]?.UserId),
//           VendorLibraryID: '1',
//         }).map((key) => ({
//           [key]: encrypt(
//             { OriginName: newOption, UserID: decrypt(userData[0]?.UserId), VendorLibraryID: '1' }[
//               key
//             ]
//           ),
//         }))
//       );
//       await Post('InsertYarnOriginData', encryptedData).then(async (res) => {
//         if (res.data.ResponseCode === '100') {
//           enqueueSnackbar('Yarn Origin Added!');
//           await GetYarnOriginData();
//         }
//       });
//     } catch (error) {
//       console.log(error);
//       enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
//     }
//   };

//   const PostColors = async (newOption) => {
//     try {
//       const encryptedData = Object.assign(
//         {},
//         ...Object.keys({
//           ColorName: newOption,
//           UserID: decrypt(userData[0]?.UserId),
//           VenderLibraryID: '1',
//         }).map((key) => ({
//           [key]: encrypt(
//             { ColorName: newOption, UserID: decrypt(userData[0]?.UserId), VenderLibraryID: '1' }[
//               key
//             ]
//           ),
//         }))
//       );
//       await Post('InsertColorData', encryptedData).then(async (res) => {
//         if (res.data.ResponseCode === '100') {
//           enqueueSnackbar('Color Added!');
//           await GetColorsData();
//         }
//       });
//     } catch (error) {
//       console.log(error);
//       enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
//     }
//   };

//   const UpdateBookingData = async () => {
//     try {
//       const encryptedData = Object.assign(
//         {},
//         ...Object.keys(bookingModel).map((key) => ({
//           [key]: encrypt(bookingModel[key]),
//         }))
//       );
//       await Put('UpdateYarnDatabase', encryptedData).then(async (res) => {
//         enqueueSnackbar('Updated Successfully!');
//         router.push(paths.dashboard.bookingOrder.root);
//       });
//     } catch (error) {
//       console.log(error);
//       enqueueSnackbar('Something Went Wrong!', { variant: 'error' });
//     }
//   };

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       await UpdateBookingData();
//       reset();
//     } catch (error) {
//       console.error(error);
//     }
//   });

//   // dialog functions
//   const [dialogOpen, setDialogOpen] = useState(false);

//   const handleDialogOpen = () => {
//     setDialogOpen(true);
//   };

//   const handleDialogClose = () => {
//     setDialogOpen(false);
//   };

//   const renderLoading = (
//     <LoadingScreen
//       sx={{
//         borderRadius: 1.5,
//         bgcolor: 'background.default',
//       }}
//     />
//   );

//   const handleCompositionSentence = (sentence, mstID) => {
//     setBookingModel({
//       ...bookingModel,
//       Composition: sentence,
//       CompositionID: mstID,
//       NickName: `${
//         yarnCount?.find((count) => count?.value === bookingModel?.YarnCountID)?.label || ''
//       } ${colors?.find((color) => color?.value === bookingModel?.ColorID)?.label || ''} ${
//         bookingModel?.Composition
//       } - ${
//         yarnOrigin?.find((count) => count?.value === bookingModel?.YarnOriginID)?.label || ''
//       }`,
//     });
//   };

//   useEffect(() => {
//     setBookingModel({
//       ...bookingModel,
//       NickName: `${
//         yarnCount?.find((count) => count?.value === bookingModel?.YarnCountID)?.label || ''
//       } ${colors?.find((color) => color?.value === bookingModel?.ColorID)?.label || ''} ${
//         bookingModel?.Composition
//       } - ${
//         yarnOrigin?.find((count) => count?.value === bookingModel?.YarnOriginID)?.label || ''
//       }`,
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     bookingModel?.YarnCountID,
//     bookingModel?.YarnOriginID,
//     bookingModel?.Composition,
//     bookingModel?.ColorID,
//   ]);

//   return isLoading ? (
//     renderLoading
//   ) : (
//     <>
//       <FormProvider methods={methods} onSubmit={onSubmit}>
//         <Grid container spacing={3}>
//           <Grid xs={12} md={12}>
//             <Card sx={{ p: 3 }}>
//               <h3>Yarn Setup Details:</h3>
//               <Box
//                 rowGap={3}
//                 columnGap={2}
//                 display="grid"
//                 gridTemplateColumns={{
//                   xs: 'repeat(1, 1fr)',
//                   sm: 'repeat(2, 1fr)',
//                 }}
//               >
//                 <RHFAutocomplete
//                   name="YarnCount"
//                   label="Yarn Count"
//                   placeholder="Select or type to add a yarn count"
//                   value={yarnCount.find((obj) => obj.value === currentData?.YarnCountID)}
//                   options={yarnCount}
//                   onAddOption={PostYarnCount}
//                   onchange={(value) =>
//                     setBookingModel({
//                       ...bookingModel,
//                       YarnCountID: value?.value,
//                       NickName: `${value?.label} ${
//                         yarnOrigin?.find((count) => count?.value === bookingModel?.YarnOriginID)
//                           ?.label || ''
//                       } ${bookingModel?.Composition}`,
//                     })
//                   }
//                 />

//                 <RHFAutocomplete
//                   name="YarnOrigin"
//                   label="Yarn Origin"
//                   placeholder="Select or type to add a yarn origin"
//                   value={yarnOrigin.find((obj) => obj.value === currentData?.YarnOriginID)}
//                   options={yarnOrigin}
//                   onAddOption={PostYarnOrigin}
//                   onchange={(value) =>
//                     setBookingModel({
//                       ...bookingModel,
//                       YarnOriginID: value?.value,
//                       NickName: `${
//                         yarnCount?.find((count) => count?.value === bookingModel?.YarnCountID)
//                           ?.label || ''
//                       } ${value?.label} ${bookingModel?.Composition}`,
//                     })
//                   }
//                 />

//                 <RHFAutocomplete
//                   name="Color"
//                   label="Color"
//                   placeholder="Select or type to add a color"
//                   value={colors.find((obj) => obj.value === currentData?.ColorID)}
//                   options={colors}
//                   onAddOption={PostColors}
//                   onchange={(value) =>
//                     setBookingModel({ ...bookingModel, ColorID: value?.value })
//                   }
//                 />

//                 <Grid container spacing={1}>
//                   <Grid item xs={10} sm={11}>
//                     <RHFTextField
//                       disabled
//                       InputLabelProps={{ shrink: true }}
//                       value={bookingModel?.Composition}
//                       name="Composition"
//                       label="Composition"
//                     />
//                   </Grid>
//                   <Grid
//                     item
//                     xs={2}
//                     sm={1}
//                     sx={{ display: 'flex', justifyContent: 'center' }}
//                   >
//                     <IconButton onClick={() => handleDialogOpen()} color="primary">
//                       <Iconify icon="lets-icons:add-duotone" width={32} />
//                     </IconButton>

//                     {/* <CompositionDialog
//                       uploadClose={handleDialogClose}
//                       uploadOpen={dialogOpen}
//                       compositions={composition}
//                       compositionValue={handleCompositionSentence}
//                     /> */}
//                   </Grid>
//                 </Grid>

//                 <RHFAutocomplete
//                   name="Unit"
//                   type="Unit"
//                   label="Unit"
//                   placeholder="Choose an option"
//                   defaultValue={units.find((obj) => obj.UnitID === currentData?.UnitID)}
//                   fullWidth
//                   options={units}
//                   getOptionLabel={(option) => option?.UnitName}
//                   onchange={(value) =>
//                     setBookingModel({ ...bookingModel, UnitID: value?.UnitID })
//                   }
//                 />

//                 <RHFTextField
//                   name="NickName"
//                   label="Name"
//                   value={bookingModel?.NickName}
//                   onchange={(e) =>
//                     setBookingModel({ ...bookingModel, NickName: e.target.value })
//                   }
//                 />

//                 {/* <RHFTextField name="Bag" label="Bag (1 Bag = 100 Lbs)" onchange={(e) => setBookingModel({ ...bookingModel, Model: e.target.value })} />

//                                     <RHFTextField name="Carton" label="Carton" onchange={(e) => setBookingModel({ ...bookingModel, Model: e.target.value })} />

//                                     <RHFTextField
//                                         name="Weight"
//                                         label="Weight"
//                                         onchange={(e) => setBookingModel({ ...bookingModel, Model: e.target.value })}
//                                         InputProps={{
//                                             readOnly: true,
//                                             endAdornment: (
//                                                 <InputAdornment position="end">
//                                                     kgs
//                                                 </InputAdornment>
//                                             ),
//                                         }}
//                                     /> */}
//               </Box>
//             </Card>

//             <Stack alignItems="flex-end" sx={{ mt: 3 }}>
//               <LoadingButton
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 loading={isSubmitting}
//               >
//                 Update
//               </LoadingButton>
//             </Stack>
//           </Grid>
//         </Grid>
//       </FormProvider>
//     </>
//   );
// }

// BookingEditForm.propTypes = {
//   urlData: PropTypes.any,
// };
