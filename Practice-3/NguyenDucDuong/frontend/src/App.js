import React, { useState, useEffect } from 'react';
import {
  Container,
  Table
} from 'react-bootstrap'
import './App.css';

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const getStudents = async () => {

      const students = await fetchStudents()
      console.log(students)
      setStudents(students)
    }

    getStudents();
  }, [])

  const fetchStudents = async () => {
    const res = await fetch("http://localhost:80/api/students")
    const data = await res.json()

    return data
  }

  return (


    <Container>
      <h3 className="p-3 text-center">Danh sách sinh viên</h3>
      <Table striped bordered hover >
        <thead>
          <tr>
            <th className= "sid">Số thứ tự</th>
            <th>Họ và tên</th>
            <th>Năm sinh</th>
            <th>Trường đại học</th>
            <th>Chuyên ngành</th>
          </tr>
        </thead>
        <tbody>
          {students && students.map((student, key) =>
            <tr key={student.sid}>
              <td>{student.sid}</td>
              <td>{student.full_name}</td>
              <td>{student.year_of_birth}</td>
              <td>{student.university}</td>
              <td>{student.major}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default App;
