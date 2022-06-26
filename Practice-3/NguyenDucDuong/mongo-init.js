db.createUser(
    {
        user: 'apiuser',
        pwd: 'apipassword',
        roles: [
            {
                role: 'readWrite',
                db: 'student-db'
            }]
    })

db.createCollection('student');

db.student.insertMany([
  {
    sid: parseInt(1),
    full_name: "Võ Minh Thiên Long",
    year_of_birth: 2000,
    university: "Đại học Tổng hợp ITMO",
    major: "Kỹ thuật phần mềm"
  },
  {
    sid: 2,
    full_name: "Nguyễn Văn Hải",
    year_of_birth: 2001,
    university: "ĐH Công nghệ - ĐH Quốc gia Hà Nội",
    major: "Khoa học máy tính"
  },
  {
    sid: 3,
    full_name: "Trần Thu Thủy",
    year_of_birth: 2000,
    university: "ĐH Bách khoa Hà Nội",
    major: "Khoa học máy tính"
  },
  {
    sid: 4,
    full_name: "Hồ Nguyên Khang",
    year_of_birth: 2002,
    university: "ĐH Bách khoa Hà Nội",
    major: "ĐTVT"
  },
  {
    sid: 5,
    full_name: "Phan Đức Anh",
    year_of_birth: 2001,
    university: "ĐH Bách khoa Hà Nội",
    major: "Khoa học máy tính"
  },
  {
    sid: 6,
    full_name: "Nguyễn Đức Dương",
    year_of_birth: 2000,
    university: "ĐH Công nghệ - ĐH Quốc gia Hà Nội",
    major: "Khoa học máy tính"
  },
  {
    sid: 7,
    full_name: "Tạ Hữu Bình",
    year_of_birth: 2001,
    university: "ĐH Bách khoa Hà Nội",
    major: "Khoa học máy tính"
  },
  {
    sid: 8,
    full_name: "Nguyễn Nhật Trường",
    year_of_birth: 2001,
    university: "ĐH Công nghệ - ĐH Quốc gia Hà Nội",
    major: "Truyền thông và mạng máy tính"
  },
  {
    sid: 9,
    full_name: "Đinh Thị Hường",
    year_of_birth: 2000,
    university: "ĐH Bách khoa Hà Nội",
    major: "Khoa học máy tính"
  },
  {
    sid: 10,
    full_name: "Trần Quang Hải",
    year_of_birth: 2001,
    university: "ĐH Bách khoa Hà Nội",
    major: "Công nghệ thông tin Global ICT"
  },
  {
    sid: 11,
    full_name: "Nguyễn Tuấn Hiệp",
    year_of_birth: 2001,
    university: "HV CNBCVT",
    major: "Kỹ thuật viễn thông"
  },
  {
    sid: 12,
    full_name: "Nguyễn Xuân Khang",
    year_of_birth: 2001,
    university: "ĐH Công nghệ - ĐH Quốc gia Hà Nội",
    major: "Hệ thống thông tin"
  },
  {
    sid: 13,
    full_name: "Trịnh Hồng Phượng",
    year_of_birth: 2001,
    university: "ĐH Bách khoa Hà Nội",
    major: "Khoa học máy tính"
  },
  {
    sid: 14,
    full_name: "Đỗ Triệu Hải",
    year_of_birth: 2000,
    university: "ĐH Bách khoa Hà Nội",
    major: "Kỹ thuật Cơ điện tử"
  },
  {
    sid: 15,
    full_name: "Bùi Doãn Đang",
    year_of_birth: 2000,
    university: "ĐH Bách khoa Hà Nội",
    major: "Hệ thống thông tin quản lý"
  },
  {
    sid: 16,
    full_name: "Nguyễn Thị Hương",
    year_of_birth: 2000,
    university: "ĐH Bách khoa Hà Nội",
    major: "ĐTVT"
  },
  {
    sid: 17,
    full_name: "Trần Thanh Hiền",
    year_of_birth: 2001,
    university: "Học viện Kỹ thuật Mật mã",
    major: "ATTT"
  },
  {
    sid: 18,
    full_name: "Đỗ Hoàng Sơn",
    year_of_birth: 2000,
    university: "HV CNBCVT",
    major: "ATTT"
  },
  {
    sid: 19,
    full_name: "Vũ Thị Huyền",
    year_of_birth: 2001,
    university: "ĐH Công nghệ - ĐH Quốc gia Hà Nội",
    major: "Mạng máy tính và truyền thông dữ liệu"
  },
  {
    sid: 20,
    full_name: "Phùng Hoàng Long",
    year_of_birth: 2000,
    university: "HV CNBCVT",
    major: "Hệ thống thông tin"
  },
  {
    sid: 21,
    full_name: "Phạm Đình Phú",
    year_of_birth: 2000,
    university: "ĐH GTVT",
    major: "Kỹ thuật thông tin và truyền thông"
  },
  {
    sid: 22,
    full_name: "Kiều Sơn Tùng",
    year_of_birth: 2001,
    university: "ĐH Kinh tế Quốc dân",
    major: "Khoa học dữ liệu trong kinh tế và kinh doanh"
  },
  {
    sid: 23,
    full_name: "Hoàng Thị Vân Anh",
    year_of_birth: 2001,
    university: "Học viện Kỹ thuật Mật mã",
    major: "ATTT"
  },
  {
    sid: 24,
    full_name: "Nguyễn Tấn Huy",
    year_of_birth: 2001,
    university: "ĐH Công nghệ - ĐH Quốc gia Hà Nội",
    major: "Điện"
  }
]);    