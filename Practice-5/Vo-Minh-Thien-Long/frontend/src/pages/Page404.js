import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container } from '@mui/material';
// components
import Page from '../components/Page';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <Page title="Không tìm thấy trang">
      <Container>
        <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography fontSize={160} color="primary" fontWeight={700}>
            404
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Trang bạn tìm kiếm không tồn tại
          </Typography>

          <Typography sx={{ color: 'text.secondary' }} mb={4}>
            Có thể URL bị hỏng hoặc đã bị Admin xóa bỏ
          </Typography>

          <Button to="/" size="large" variant="contained" component={RouterLink}>
            Quay về trang chủ
          </Button>
        </ContentStyle>
      </Container>
    </Page>
  );
}
