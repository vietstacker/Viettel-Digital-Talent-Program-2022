import datetime
import random

import pytz

from common.model import Status
from intern.model import Intern
from lecture.model import Participating, Lecture
from mentor.model import Mentor
from practice.model import Submission, Practice
from university.model import University


def generate_participating():
    interns_list = Intern.objects.all()
    participatings = []
    for intern in interns_list:
        participating = Participating.objects.create(intern=intern, status=random.choice(list(Status)))
        participating.save()
        participatings.append(participating)
    return participatings


def generate_submission():
    interns_list = Intern.objects.all()
    submissions = []
    for intern in interns_list:
        submission = Submission.objects.create(intern=intern, grade=random.randint(0, 10),
                                               status=random.choice(list(Status)))
        submission.save()
        submissions.append(submission)
    return submissions


def ref_from_universities(name):
    return University.objects(name=name).first().to_dbref()


def ref_from_mentors_list(mentors):
    if len(mentors) == 0:
        return [mentor.to_dbref() for mentor in Mentor.objects.all()]
    return [Mentor.objects(name=mentor).first().to_dbref() for mentor in mentors]


def init():
    University.objects.delete({})
    Intern.objects.delete({})
    Mentor.objects.delete({})
    Lecture.objects.delete({})

    University.objects.insert([
        University(name="ĐH Bách khoa Hà Nội"),
        University(name="ĐH Công nghệ - ĐH Quốc gia Hà Nội"),
        University(name="ĐH GTVT"),
        University(name="ĐH Kinh tế Quốc dân"),
        University(name="Học viện Kỹ thuật Mật mã"),
        University(name="HV CNBCVT"),
        University(name="Đại học Tổng hợp ITMO"),
    ])

    Intern.objects.insert([
        Intern(order=1, name="Võ Minh Thiên Long", year_of_birth=2000,
               university=ref_from_universities("Đại học Tổng hợp ITMO"),
               major="Kỹ thuật phần mềm", gender="nam"),

        Intern(order=2, name="Nguyễn Văn Hải", year_of_birth=2001,
               university=ref_from_universities("ĐH Công nghệ - ĐH Quốc gia Hà Nội"),
               major="Khoa học máy tính", gender="nam"),

        Intern(order=3, name="Trần Thu Thủy", year_of_birth=2000,
               university=ref_from_universities("ĐH Bách khoa Hà Nội"),
               major="Khoa học máy tính", gender="nữ"),

        Intern(order=4, name="Hồ Nguyên Khang", year_of_birth=2002,
               university=ref_from_universities("ĐH Bách khoa Hà Nội"),
               major="ĐTVT", gender="nam"),

        Intern(order=5, name="Phan Đức Anh", year_of_birth=2001,
               university=ref_from_universities("ĐH Bách khoa Hà Nội"),
               major="Khoa học máy tính", gender="nam"),

        Intern(order=6, name="Nguyễn Đức Dương", year_of_birth=2000,
               university=ref_from_universities("ĐH Công nghệ - ĐH Quốc gia Hà Nội"),
               major="Khoa học máy tính", gender="nam"),

        Intern(order=7, name="Tạ Hữu Bình", year_of_birth=2001,
               university=ref_from_universities("ĐH Bách khoa Hà Nội"),
               major="Khoa học máy tín", gender="nam"),

        Intern(order=8, name="Nguyễn Nhật Trường", year_of_birth=2001,
               university=ref_from_universities("ĐH Công nghệ - ĐH Quốc gia Hà Nội"),
               major="Truyền thông và mạng máy tính", gender="nam"),

        Intern(order=9, name="Đinh Thị Hường", year_of_birth=2000,
               university=ref_from_universities("ĐH Bách khoa Hà Nội"),
               major="Khoa học máy tính", gender="nữ"),

        Intern(order=10, name="Trần Quang Hải", year_of_birth=2001,
               university=ref_from_universities("ĐH Bách khoa Hà Nội"),
               major="Công nghệ thông tin Global ICT", gender="nam"),

        Intern(order=11, name="Nguyễn Tuấn Hiệp", year_of_birth=2001,
               university=ref_from_universities("HV CNBCVT"),
               major="Kỹ thuật viễn thông", gender="nam"),

        Intern(order=12, name="Nguyễn Xuân Khang", year_of_birth=2001,
               university=ref_from_universities("ĐH Công nghệ - ĐH Quốc gia Hà Nội"),
               major="Hệ thống thông tin", gender="nam"),

        Intern(order=13, name="Trịnh Hồng Phượng", year_of_birth=2001,
               university=ref_from_universities("ĐH Bách khoa Hà Nội"),
               major="Khoa học máy tính", gender="nữ"),

        Intern(order=14, name="Đỗ Triệu Hải", year_of_birth=2000,
               university=ref_from_universities("ĐH Bách khoa Hà Nội"),
               major="Kỹ thuật Cơ điện tử", gender="nam"),

        Intern(order=15, name="Bùi Doãn Đang", year_of_birth=2000,
               university=ref_from_universities("ĐH Bách khoa Hà Nội"),
               major="Hệ thống thông tin quản lý", gender="nam"),

        Intern(order=16, name="Nguyễn Thị Hương", year_of_birth=2000,
               university=ref_from_universities("ĐH Bách khoa Hà Nội"),
               major="ĐTVT", gender="nữ"),

        Intern(order=17, name="Trần Thanh Hiền", year_of_birth=2001,
               university=ref_from_universities("Học viện Kỹ thuật Mật mã"),
               major="ATTT", gender="nữ"),

        Intern(order=18, name="Đỗ Hoàng Sơn", year_of_birth=2000,
               university=ref_from_universities("HV CNBCVT"),
               major="ATTT", gender="nam"),

        Intern(order=19, name="Vũ Thị Huyền", year_of_birth=2001,
               university=ref_from_universities("ĐH Công nghệ - ĐH Quốc gia Hà Nội"),
               major="Mạng máy tính và truyền thông dữ liệu", gender="nữ"),

        Intern(order=20, name="Phùng Hoàng Long", year_of_birth=2000,
               university=ref_from_universities("HV CNBCVT"),
               major="Hệ thống thông tin", gender="nam"),

        Intern(order=21, name="Phạm Đình Phú", year_of_birth=2000,
               university=ref_from_universities("ĐH GTVT"),
               major="Kỹ thuật thông tin và truyền thông", gender="nam"),

        Intern(order=22, name="Kiều Sơn Tùng", year_of_birth=2001,
               university=ref_from_universities("ĐH Kinh tế Quốc dân"),
               major="Khoa học dữ liệu trong kinh tế và kinh doanh", gender="nam"),

        Intern(order=23, name="Hoàng Thị Vân Anh", year_of_birth=2001,
               university=ref_from_universities("Học viện Kỹ thuật Mật mã"),
               major="ATTT", gender="nữ"),

        Intern(order=24, name="Nguyễn Tấn Huy", year_of_birth=2001,
               university=ref_from_universities("ĐH Công nghệ - ĐH Quốc gia Hà Nội"),
               major="Điện", gender="nam"),
    ])

    Mentor.objects.insert([
        Mentor(name="vinhnt44"),
        Mentor(name="ducnc7"),
        Mentor(name="datlq3"),
        Mentor(name="hieulq2"),
        Mentor(name="daidv3"),
        Mentor(name="donghm"),
        Mentor(name="conghm1"),
        Mentor(name="chienpt2"),
        Mentor(name="datvt18"),
        Mentor(name="tupm4"),
        Mentor(name="ducnv41"),
        Mentor(name="manhvd7"),
        Mentor(name="dungnm10"),
        Mentor(name="KOL Thuỷ Đặng"),
        Mentor(name="KOL Nguyễn Hoài Nam"),
        Mentor(name="KOL Tô Thành Công"),
        Mentor(name="KOL Trình Nguyễn"),
    ])

    Lecture.objects.insert([
        Lecture(order=1, name="Getting started, Course Overview, Cloud Overview",
                mentors=ref_from_mentors_list(["vinhnt44", "hieulq2", "ducnc7"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 4, 24, 8, 30)),
                participatings=generate_participating()),
        Lecture(order=2, name="Virtualization",
                mentors=ref_from_mentors_list(["daidv3", "donghm", "datlq3"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 4, 24, 13, 30)),
                participatings=generate_participating()),
        Lecture(order=3, name="IaaS, OpenStack",
                mentors=ref_from_mentors_list(["daidv3", "donghm"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 5, 7, 8, 30)),
                participatings=generate_participating()),
        Lecture(order=4, name="Converged 5G-Cloud Infrastructure for Autonomous Driving",
                mentors=ref_from_mentors_list(["KOL Thuỷ Đặng"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 5, 7, 13, 30)),
                participatings=generate_participating()),
        Lecture(order=5, name="DevSecOps P1: Giới thiệu DevSecOps",
                mentors=ref_from_mentors_list(["conghm1", "chienpt2", "datvt18"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 5, 14, 8, 30)),
                participatings=generate_participating()),
        Lecture(order=6, name="DevSecOps P2: Git + Gitlab",
                mentors=ref_from_mentors_list(["datvt18", "chienpt2"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 5, 14, 13, 30)),
                participatings=generate_participating()),
        Lecture(order=7, name="DevSecOps P3: DevSecOps case study thực tế",
                mentors=ref_from_mentors_list(["KOL Nguyễn Hoài Nam"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 5, 21, 8, 30)),
                participatings=generate_participating()),
        Lecture(order=8, name="DevSecOps P4: Ansible",
                mentors=ref_from_mentors_list(["donghm", "ducnv41", "daidv3"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 5, 21, 13, 30)),
                participatings=generate_participating()),
        Lecture(order=9, name="DevSecOps P5:Docker + docker-compose",
                mentors=ref_from_mentors_list(["tupm4", "ducnv41", "manhvd7"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 5, 28, 8, 30)),
                participatings=generate_participating()),
        Lecture(order=10, name="DevSecOps P6: CI/CD",
                mentors=ref_from_mentors_list(["conghm1", "datvt18"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 5, 28, 13, 30)),
                participatings=generate_participating()),
        Lecture(order=11, name="Cloud & Open Source & Community", mentors=ref_from_mentors_list(["KOL Tô Thành Công"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 6, 4, 8, 30)),
                participatings=generate_participating()),
        Lecture(order=12, name="DevSecOps P7: Monitoring, Logging, Tracing - Buổi 1",
                mentors=ref_from_mentors_list(["ducnv41", "datvt18"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 6, 4, 13, 30)),
                participatings=generate_participating()),
        Lecture(order=13, name="DevSecOps P7: Monitoring, Logging, Tracing - Buổi 2",
                mentors=ref_from_mentors_list(["ducnv41", "datvt18"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 6, 5, 8, 30)),
                participatings=generate_participating()),
        Lecture(order=14, name="DevSecOps P8: Security", mentors=ref_from_mentors_list(["dungnm10", "daidv3"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 6, 5, 13, 30)),
                participatings=generate_participating()),
        Lecture(order=15, name="PaaS, Kubernetes",
                mentors=ref_from_mentors_list(["conghm1", "chienpt2"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 6, 18, 8, 30)),
                participatings=generate_participating()),
        Lecture(order=16, name="Microservice & Cloud-native app",
                mentors=ref_from_mentors_list(["conghm1", "chienpt2"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 6, 18, 13, 30)),
                participatings=generate_participating()),
        Lecture(order=17, name="IaC is your best tool to eliminate infrastructure drifts",
                mentors=ref_from_mentors_list(["KOL Trình Nguyễn"]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 6, 25, 8, 30)),
                participatings=generate_participating()),
        Lecture(order=18, name="Giao lưu, chia sẻ, Hỏi đáp, Kết thúc khoá học",
                mentors=ref_from_mentors_list([]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 6, 25, 13, 30)),
                participatings=generate_participating()),
        Lecture(order=19, name="Bế giảng theo lịch của Tập đoàn",
                mentors=ref_from_mentors_list([]),
                started_at=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 7, 2, 8, 30)),
                participatings=generate_participating())
    ])

    Practice.objects.insert([
        Practice(name="Install OpenStack",
                 deadline=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 4, 24, 8, 30)),
                 submissions=generate_submission()),
        Practice(name="Use Ansible",
                 deadline=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 4, 24, 8, 30)),
                 submissions=generate_submission()),
        Practice(name="Use Docker",
                 deadline=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 4, 24, 8, 30)),
                 submissions=generate_submission()),
        Practice(name="Practice 4",
                 deadline=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 4, 24, 8, 30)),
                 submissions=generate_submission()),
        Practice(name="Practice 5",
                 deadline=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 4, 24, 8, 30)),
                 submissions=generate_submission()),
        Practice(name="Practice 6",
                 deadline=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 4, 24, 8, 30)),
                 submissions=generate_submission()),
        Practice(name="Practice 7",
                 deadline=pytz.timezone('Asia/Ho_Chi_Minh').localize(datetime.datetime(2022, 4, 24, 8, 30)),
                 submissions=generate_submission()),
    ])

    return ""
