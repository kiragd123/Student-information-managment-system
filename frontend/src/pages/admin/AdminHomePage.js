import { Container, Grid, Paper } from '@mui/material'
import SeeNotice from '../../components/SeeNotice';
import Students from "../../assets/img1.png";
import Classes from "../../assets/img2.png";
import Teachers from "../../assets/img3.png";
import Fees from "../../assets/img4.png";
import styled from 'styled-components';
import CountUp from 'react-countup';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAllSclasses } from '../../redux/sclassRelated/sclassHandle';
import { getAllStudents } from '../../redux/studentRelated/studentHandle';
import { getAllTeachers } from '../../redux/teacherRelated/teacherHandle';
import { fetchDepartmentList } from '../../redux/departmentRelated/departmentHandle';
import Departments from "../../assets/dep.webp";

const AdminHomePage = () => {
    const dispatch = useDispatch();
    const { studentsList } = useSelector((state) => state.student);
    const { sclassesList } = useSelector((state) => state.sclass);
    const { teachersList } = useSelector((state) => state.teacher);
    const { departmentList } = useSelector((state) => state.department);

    const { currentUser } = useSelector(state => state.user)

    const adminID = currentUser._id

    useEffect(() => {
        dispatch(getAllStudents(adminID));
        dispatch(getAllSclasses(adminID, "Sclass"));
        dispatch(getAllTeachers(adminID));
        dispatch(fetchDepartmentList(adminID));
    }, [adminID, dispatch]);

    const numberOfStudents = studentsList && studentsList.length;
    const numberOfClasses = sclassesList && sclassesList.length;
    const numberOfTeachers = teachersList && teachersList.length;
    const numberOfDepartments = departmentList && departmentList.length;

    return (
        <>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <Image src={Students} alt="Students" />
                            <Title>Total Students</Title>
                            <DataWrapper><CountUp end={numberOfStudents} duration={2.5} /></DataWrapper>
                        </StyledPaper>
                    </Grid>

                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <Image src={Classes} alt="Classes" />
                            <Title>Total Classes</Title>
                            <DataWrapper><CountUp end={numberOfClasses} duration={2.5} /></DataWrapper>
                        </StyledPaper>
                    </Grid>

                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <Image src={Teachers} alt="Teachers" />
                            <Title>Total Teachers</Title>
                            <DataWrapper><CountUp end={numberOfTeachers} duration={2.5} /></DataWrapper>
                        </StyledPaper>
                    </Grid>

                    <Grid item xs={12} md={3} lg={3}>
                        <StyledPaper>
                            <DepartmentImageWrapper>
                                <DepartmentImage src={Departments} alt="Departments" />
                            </DepartmentImageWrapper>
                            <Title>Total Departments</Title>
                            <DataWrapper><CountUp end={numberOfDepartments} duration={2.5} /></DataWrapper>
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <SeeNotice />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};


const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const Image = styled.img`
  width: 70px;
  height: 70px;
  object-fit: contain;
`;

const DepartmentImageWrapper = styled.div`
  width: 70px;
  height: 70px;
  overflow: hidden;
  border-radius: 50%;
`;

const DepartmentImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Title = styled.p`
  font-size: 1.25rem;
  font-weight: 500;
  margin: 8px 0;
`;

const DataWrapper = styled.div`
  font-size: calc(1.3rem + .6vw);
  color: green;
  font-weight: 600;
`;


export default AdminHomePage