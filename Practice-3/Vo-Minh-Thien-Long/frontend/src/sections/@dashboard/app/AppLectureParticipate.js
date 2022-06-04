import {useEffect, useState} from "react";
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import {Box, Card, CardHeader} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// components
import {BaseOptionChart} from '../../../components/chart';

// ----------------------------------------------------------------------

export default function AppLectureParticipate({...other}) {
  const theme = useTheme();

  const [chartLabels, setChartLabels] = useState([]);
  const [chartData, setChartData] = useState([]);

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.secondary.main,
      theme.palette.chart.yellow[0],
      theme.palette.primary.main
    ],
    plotOptions: {bar: {columnWidth: '16%'}},
    fill: {type: chartData.map((i) => i.fill)},
    labels: chartLabels,
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y} người`;
          }
          return y;
        },
      },
    },
  });

  useEffect(() => {
    const fetchLectures = async () => {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/lectures`,);
      return response.json();
    }
    const init = async () => {
      const pastLectures = (await fetchLectures())?.lectures
          .filter(lecture => new Date(lecture.started_at) < Date.now());
      setChartData([
        {
          name: 'Đúng giờ',
          type: 'column',
          fill: 'solid',
          data: pastLectures.map(lecture => lecture.participatings.filter(status => status === 'on time').length),
        },
        {
          name: 'Đến muộn',
          type: 'line',
          fill: 'solid',
          data: pastLectures.map(lecture => lecture.participatings.filter(status => status === 'late').length),
        },
        {
          name: 'Vắng mặt',
          type: 'area',
          fill: 'gradient',
          data: pastLectures.map(lecture => lecture.participatings.filter(status => status === 'missing').length),
        },
      ]);
      setChartLabels(pastLectures.map((lecture, i) => `Buổi ${i + 1}`));
    }
    init().then();
  }, []);

  return (
      <Card {...other}>
        <CardHeader title={"Điểm danh các buổi học"} subheader={`đã hoàn thành ${chartData[0]?.data?.length} buổi học`}/>

        <Box sx={{p: 3, pb: 1}} dir="ltr">
          <ReactApexChart type="line" series={chartData} options={chartOptions} height={364}/>
        </Box>
      </Card>
  );
}
