import {useEffect, useState} from "react";
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import {styled, useTheme} from '@mui/material/styles';
import {Card, CardHeader} from '@mui/material';
// utils
import {fNumber} from '../../../utils/formatNumber';
// components
import {BaseOptionChart} from '../../../components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

export default function AppInternGender({...other}) {
  const theme = useTheme();

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchInterns = async (gender) => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/interns/by_gender?gender=${gender}`,);
      return response.text();
    }
    const init = async () => {
      const genders = ['nam', 'nữ'];
      const data = await Promise.all(genders.map(async (gender) => ({
        label: gender,
        value: parseInt(await fetchInterns(gender), 10)
      })));
      setChartData(data);
    }
    init().then();
  }, [setChartData]);

  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.primary.main,
      theme.palette.info.main
    ],
    labels: chartLabels,
    stroke: {colors: [theme.palette.background.paper]},
    legend: {floating: true, horizontalAlign: 'center'},
    dataLabels: {enabled: true, dropShadow: {enabled: false}},
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `${seriesName.charAt(0).toUpperCase() + seriesName.slice(1).toLowerCase()}: `,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={"Phân bố theo giới tính"}/>
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type="donut" series={chartSeries} options={chartOptions} height={280}/>
      </ChartWrapperStyle>
    </Card>
  );
}
