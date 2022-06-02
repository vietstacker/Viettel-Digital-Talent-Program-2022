from mentor.model import Mentor


def mentors_count():
    return str(Mentor.objects.count())
