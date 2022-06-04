import {useEffect, useState} from "react";
// @mui
import PropTypes from 'prop-types';
import {Card, CardContent, CardHeader, Typography} from '@mui/material';
import {Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator} from '@mui/lab';
// utils
import {fDateTime} from '../../../utils/formatTime';

// ----------------------------------------------------------------------

export default function AppLectureNext({...other}) {
    const [list, setList] = useState([]);

    useEffect(() => {
        const fetchLectures = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/lectures`,);
            return response.json();
        }
        const init = async () => {
            const nextLectures = (await fetchLectures())?.lectures
                .filter(lecture => new Date(lecture.started_at) > Date.now());
            setList(nextLectures.slice(0, 5).map((lecture, i) => ({
                title: lecture.name,
                type: `lecture${i + 1}`,
                time: new Date(lecture.started_at).toLocaleString('en-US', {timeZone: 'Asia/Ho_Chi_Minh'})
            })));
        }
        init().then();
    }, []);

    return (
        <Card {...other}>
            <CardHeader title={"Các buổi học tiếp theo"}/>

            <CardContent
                sx={{
                    '& .MuiTimelineItem-missingOppositeContent:before': {
                        display: 'none',
                    },
                }}
            >
                <Timeline>
                    {list.map((item, index) => (
                        <OrderItem key={item.type} item={item} isLast={index === list.length - 1} />
                    ))}
                </Timeline>
            </CardContent>
        </Card>
    );
}

// ----------------------------------------------------------------------

OrderItem.propTypes = {
    isLast: PropTypes.bool,
    item: PropTypes.shape({
        time: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.string,
    }),
};

function OrderItem({ item, isLast }) {
    const { type, title, time } = item;
    return (
        <TimelineItem>
            <TimelineSeparator>
                <TimelineDot
                    color={
                        (type === 'lecture1' && 'secondary') ||
                        (type === 'lecture2' && 'success') ||
                        (type === 'lecture3' && 'info') ||
                        (type === 'lecture4' && 'warning') ||
                        'error'
                    }
                />
                {isLast ? null : <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
                <Typography variant="subtitle2">{title}</Typography>

                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {fDateTime(time)}
                </Typography>
            </TimelineContent>
        </TimelineItem>
    );
}
