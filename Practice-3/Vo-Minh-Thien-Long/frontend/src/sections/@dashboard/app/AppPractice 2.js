import {useEffect, useState} from "react";
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { useTheme } from '@mui/material/styles';
import {Box, Card, CardHeader} from '@mui/material';
// components
import {BaseOptionChart} from '../../../components/chart';

// ----------------------------------------------------------------------

export default function AppPractice({...other}) {
  const theme = useTheme();

  const [chartLabels, setChartLabels] = useState([]);
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    const fetchPractice = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/practices`);
      return response.json();
    }
    const init = async () => {
      const practices = (await fetchPractice())?.practices;
      console.log(practices.map(({ submissions }) => submissions.filter(submission => submission.status === 'late').length));
      const labels = practices.map(practice => practice.name);
      const series = [
          {
            name: "Đã nộp",
            data: practices.map(({ submissions }) => submissions.filter(submission => submission.status === 'on time').length)
          },
        {
          name: "Nộp muộn",
          data: practices.map(({ submissions }) => submissions.filter(submission => submission.status === 'late').length)
        }
      ];
      setChartLabels([...labels]);
      setChartSeries([...series]);
    }
    if (!chartLabels.length || !chartSeries.length) init().then();
    console.log('run');
  }, [chartLabels.length, chartSeries.length, setChartLabels, setChartSeries]);


  const chartOptions = merge(BaseOptionChart(), {
    chart: {
      type: 'bar',
      stacked: true
    },
    colors: [
      theme.palette.secondary.main,
      theme.palette.chart.red[0]
    ],
    tooltip: {
      marker: {show: false},
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y} người`;
          }
          return y;
        },
        title: {
          formatter: (seriesName) => `${seriesName}: `
        }
      },
    },
    plotOptions: {
      bar: {horizontal: true, barHeight: '28%', borderRadius: 2},
      legend: {show: false}
    },
    xaxis: {
      categories: chartLabels,
      labels: {
        show: false
      }
    },
  });

  if (!chartSeries.length) return <></>;
  return (
      <Card {...other}>
        <CardHeader title={"Bài tập thực hành"} subheader={`gồm ${chartLabels.length} bài tập thực hành`}/>

        <Box sx={{mx: 3}} dir="ltr">
          <ReactApexChart type="bar" series={chartSeries} options={chartOptions} height={364}/>
        </Box>
      </Card>
  );
}
