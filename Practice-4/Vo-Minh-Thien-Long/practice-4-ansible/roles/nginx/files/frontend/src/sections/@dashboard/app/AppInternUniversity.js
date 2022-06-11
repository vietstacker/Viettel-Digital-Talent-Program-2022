import {useEffect, useState} from "react";
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import {Box, Card, CardHeader} from '@mui/material';
// components
import {BaseOptionChart} from '../../../components/chart';

// ----------------------------------------------------------------------

export default function AppInternUniversity({...other}) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchUniversity = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/universities`);
      return response.json();
    }
    const fetchInterns = async (university) => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/interns/by_university?university=${university}`,);
      return response.text();
    }
    const init = async () => {
      const universities = (await fetchUniversity())?.universities;
      const data = await Promise.all(universities.map(async ({name}) => ({
        label: name,
        value: await fetchInterns(name)
      })));
      setChartData(data);
    }
    init().then();
  }, [setChartData]);

  const chartLabels = chartData.map((i) => i.label);

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = merge(BaseOptionChart(), {
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
          formatter: () => `Số lượng: `
        }
      },
    },
    plotOptions: {
      bar: {horizontal: true, barHeight: '28%', borderRadius: 2},
      legend: {show: false}
    },
    xaxis: {
      categories: chartLabels.map(label => label.split('-')[0]),
      labels: {
        show: false
      }
    },
  });

  return (
      <Card {...other}>
        <CardHeader title={"Phân bố theo trường"} subheader={`các TTS đến từ ${chartData.length} trường ĐH khác nhau`}/>

        <Box sx={{mx: 3}} dir="ltr">
          <ReactApexChart type="bar" series={[{data: chartSeries}]} options={chartOptions} height={364}/>
        </Box>
      </Card>
  );
}
