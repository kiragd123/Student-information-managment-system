import { Container, Grid, Paper, Box, Typography } from '@mui/material'
import SeeNotice from '../../components/SeeNotice';
import CountUp from 'react-countup';
import Students from "../../assets/img1.png";
import Lessons from "../../assets/subjects.svg";
import Tests from "../../assets/assignment.svg";
import Time from "../../assets/time.svg";
import { getClassStudents, getSubjectDetails } from '../../redux/sclassRelated/sclassHandle';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

const TeacherHomePage = () => {
    const dispatch = useDispatch();

    const { currentUser } = useSelector((state) => state.user);
    const { subjectDetails, sclassStudents } = useSelector((state) => state.sclass);

    const classID = currentUser.teachSclass?._id
    const subjectID = currentUser.teachSubject?._id

    useEffect(() => {
        dispatch(getSubjectDetails(subjectID, "Subject"));
        dispatch(getClassStudents(classID));
    }, [dispatch, subjectID, classID]);

    const numberOfStudents = sclassStudents && sclassStudents.length;
    const numberOfSessions = subjectDetails && subjectDetails.sessions

    const testsTaken = numberOfSessions;
    const totalMinutes = numberOfSessions * 40;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const paperSx = {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        height: '200px',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center'
    };

    const titleSx = {
        fontSize: '1.25rem'
    };

    const countUpSx = {
        fontSize: 'calc(1.3rem + .6vw)',
        color: 'green'
    };

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3} lg={3}>
                        <Paper sx={paperSx}>
                            <img src={Students} alt="Students" />
                            <Typography component="p" sx={titleSx}>
                               Students
                            </Typography>
                            <CountUp
                                start={0}
                                end={numberOfStudents}
                                duration={2.5}
                            >
                                {({ countUpRef }) => (
                                    <Typography
                                        component="span"
                                        ref={countUpRef}
                                        sx={countUpSx}
                                    />
                                )}
                            </CountUp>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <Paper sx={paperSx}>
                            <img src={Lessons} alt="Lessons" />
                            <Typography component="p" sx={titleSx}>
                                Total Lessons
                            </Typography>
                            <CountUp
                                start={0}
                                end={numberOfSessions}
                                duration={5}
                            >
                                {({ countUpRef }) => (
                                    <Typography
                                        component="span"
                                        ref={countUpRef}
                                        sx={countUpSx}
                                    />
                                )}
                            </CountUp>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <Paper sx={paperSx}>
                            <img src={Tests} alt="Tests" />
                            <Typography component="p" sx={titleSx}>
                                Tests Taken
                            </Typography>
                            <CountUp
                                start={0}
                                end={testsTaken}
                                duration={4}
                            >
                                {({ countUpRef }) => (
                                    <Typography
                                        component="span"
                                        ref={countUpRef}
                                        sx={countUpSx}
                                    />
                                )}
                            </CountUp>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <Paper sx={paperSx}>
                            <img src={Time} alt="Time" />
                            <Typography component="p" sx={titleSx}>
                                Total Hours
                            </Typography>
                            <Typography component="span" sx={countUpSx}>
                                {hours} hrs {minutes > 0 ? `${minutes} mins` : ""}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <SeeNotice />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default TeacherHomePage