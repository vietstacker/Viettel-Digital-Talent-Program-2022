// @mui
import {Container, Grid, Typography} from '@mui/material';
// components
import Page from '../components/Page';
// sections
import {
    AppInternGender,
    AppInternUniversity,
    AppInternYearOfBirth,
    AppLectureNext,
    AppLectureParticipate, AppPractice,
    AppWidgetSummary,
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  return (
    <Page title="Thống kê">
      <Container maxWidth="xl">
          <Typography variant="h4" sx={{mb: 5}}>
              App thống kê Thực tập sinh lĩnh vực Cloud
          </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Thực tập sinh" type="interns" icon={'mdi:account'}/>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
              <AppWidgetSummary title="Mentors" type="mentors" color="info" icon={'mdi:human-male-board'}/>
          </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary title="Bài giảng" type="lectures" color="secondary" icon={'mdi:book-education'}/>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
                <AppWidgetSummary title="Bài tập thực hành" type="practices" color="warning" icon={'mdi:list-status'}/>
            </Grid>

            <Grid item xs={12} md={12} lg={6}>
                <AppInternUniversity/>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
                <AppInternYearOfBirth/>
            </Grid>

            <Grid item xs={12} md={6} lg={3}>
                <AppInternGender/>
            </Grid>

            <Grid item xs={12} md={8}>
                <AppLectureParticipate/>
            </Grid>

            <Grid item xs={12} md={4}>
                <AppLectureNext/>
            </Grid>

            <Grid item xs={12}>
                <AppPractice/>
            </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
