import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthGuard } from 'src/auth/guard';
import DashboardLayout from 'src/layouts/dashboard';

import { LoadingScreen, SplashScreen } from 'src/components/loading-screen';
import useUserData from 'src/routes/hooks/useUserData';
import SalesContractViewPageHod from 'src/pages/dashboard/Approvals/viewHod';
import SalesContractViewPageManagement from 'src/pages/dashboard/Approvals/viewManagement';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));

// User
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));

// Reports
// const BusinessSummaryOWReportPage = lazy(() => import('src/pages/dashboard/reports/business-summary-ow-report'));
// const BusinessSummaryReportPage = lazy(() => import('src/pages/dashboard/reports/business-summary-report'));
// const CommissionDueReportPage = lazy(() => import('src/pages/dashboard/reports/commission-due-report'));
// const FactoryWIPReportPage = lazy(() => import('src/pages/dashboard/reports/factory-wip-report'));
// const OrderReportPage = lazy(() => import('src/pages/dashboard/reports/order-report'));
// const ShipmentDelayReportPage = lazy(() => import('src/pages/dashboard/reports/shipment-delay-report'));
// const ShipmentHistoryReportPage = lazy(() => import('src/pages/dashboard/reports/shipment-history-report'));
// const ShipmentUpdateReportPage = lazy(() => import('src/pages/dashboard/reports/shipment-update-report'));
// const ShipmentTrackingReportPage = lazy(() => import('src/pages/dashboard/reports/shipment&tracking-report'));
// const WIPReportPage = lazy(() => import('src/pages/dashboard/reports/wip-report'));
// const YearlyCommissionReportPage = lazy(() => import('src/pages/dashboard/reports/yearly-commission-report'));
const PurchaseOrderPage=lazy(() => import('src/pages/dashboard/reports/Booking-Order'));

const BookingViewPage = lazy(() => import('src/pages/dashboard/BookingOrder/view'));
const BookingAddPage = lazy(() => import('src/pages/dashboard/BookingOrder/add'));
const BookingEditPage = lazy(() => import('src/pages/dashboard/BookingOrder/edit'));

const SalesContractPage = lazy(() => import('src/pages/dashboard/SalesContract/view'));
const SalesContractAddPage = lazy(() => import('src/pages/dashboard/SalesContract/add'));
const SalesContractEditPage = lazy(() => import('src/pages/dashboard/SalesContract/edit'));   
const SalesContractPDFPage = lazy(() => import('src/pages/dashboard/SalesContract/pdf'));   
const SalesContractViewPageManager = lazy(() => import('src/pages/dashboard/Approvals/viewManager'));
// ----------------------------------------------------------------------




export const dashboardRoutes = [
  {
    path: 'app',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      {
        path: 'user',
        children: [
          { element: <UserAccountPage />, index: true },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'reports',
        children: [
          // { element: <BusinessSummaryOWReportPage />, index: true },
          // {
          //   path: 'business-summary-order-wise-report',
          //   children: [
          //     { element: <BusinessSummaryOWReportPage />, index: true },
          //   ]
          // },
          // {
          //   path: 'business-summary-report',
          //   children: [
          //     { element: <BusinessSummaryReportPage />, index: true },
          //   ]
          // },
          // {
          //   path: 'commission-due-report',
          //   children: [
          //     { element: <CommissionDueReportPage />, index: true },
          //   ]
          // },
          // {
          //   path: 'factory-wip-report',
          //   children: [
          //     { element: <FactoryWIPReportPage />, index: true },
          //   ]
          // },
          // {
          //   path: 'order-report',
          //   children: [
          //     { element: <OrderReportPage />, index: true },
          //   ]
          // },
          // {
          //   path: 'shipment-delay-report',
          //   children: [
          //     { element: <ShipmentDelayReportPage />, index: true },
          //   ]
          // },
          // {
          //   path: 'shipment-history-report',
          //   children: [
          //     { element: <ShipmentHistoryReportPage />, index: true },
          //   ]
          // },
          // {
          //   path: 'shipment-update-report',
          //   children: [
          //     { element: <ShipmentUpdateReportPage />, index: true },
          //   ]
          // },
          // {
          //   path: 'shipment-tracking-report',
          //   children: [
          //     { element: <ShipmentTrackingReportPage />, index: true },
          //   ]
          // },

          // {
          //   path: 'wip-report',
          //   children: [
          //     { element: <WIPReportPage />, index: true },
          //   ]
          // },
          // {
          //   path: 'yearly-commission-report',
          //   children: [
          //     { element: <YearlyCommissionReportPage />, index: true },
          //   ]
          // },
          {
            path: 'Booking-Order',
            children: [
              { element: <PurchaseOrderPage />, index: true },
            ]
          },
        ],
      },
      {
        path: 'BookingOrder',
        children: [
          { element: <BookingViewPage />, index: true },
          // { path: 'view', element: <BookingViewPage /> },
          { path: 'add', element: <BookingAddPage /> },
          { path: 'edit/:id', element: <BookingEditPage /> },
        ],
      },
      {
        path: 'SalesContract',
        children: [
          { element: <SalesContractPage />, index: true },
          // { path: 'view', element: <BookingViewPage /> },
          { path: 'add', element: <SalesContractAddPage /> },
          { path: 'edit/:id', element: <SalesContractEditPage /> },
           { path: 'pdf/:id', element: <SalesContractPDFPage /> },
        ],
      },
       {
        path: 'Approvals',
        children: [
        
          // { path: 'view', element: <BookingViewPage /> },
          { path: 'viewManager', element: <SalesContractViewPageManager /> },
          { path: 'viewHod', element: <SalesContractViewPageHod/> },
           { path: 'viewManagement', element: <SalesContractViewPageManagement /> },
        ],
      }
    ],
  },
];