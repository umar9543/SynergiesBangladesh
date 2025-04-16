

import PropTypes from 'prop-types';

import { styled, useTheme } from '@mui/material/styles';

import Chart, { useChart } from 'src/components/chart';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 200;

const StyledChart = styled(Chart)(({ theme }) => ({
    height: CHART_HEIGHT,
    '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
        height: `100% !important`,
    },
}));

// ----------------------------------------------------------------------

export default function KPITestRadar({ title, subheader, chart, ...other }) {
    const theme = useTheme();

    const { series, colors, categories, options } = chart;

    const chartOptions = useChart({
        colors,
        stroke: {
            width: 2,
        },
        fill: {
            opacity: 0.48,
        },
        legend: {
            show: false,
        },
        xaxis: {
            categories,
            labels: {
                style: {
                    colors: [...Array(6)].map(() => theme.palette.text.secondary),
                },
            },
        },
        ...options,
    });

    return (
        <>
            <div style={{ maxHeight: 220, overflow: 'hidden' }}>
                <StyledChart
                    dir="ltr"
                    type="radar"
                    series={series}
                    options={chartOptions}
                    width="100%"
                    height={260}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 0.5 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    {subheader}
                </Typography>

                <Typography variant="h6" sx={{ mb: 0.2 }}>
                    {title}
                </Typography>
            </div>
        </>
    );
}

KPITestRadar.propTypes = {
    chart: PropTypes.object,
    subheader: PropTypes.string,
    title: PropTypes.string,
};