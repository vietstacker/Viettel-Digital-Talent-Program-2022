import { useState, useLayoutEffect } from 'react';

function App() {

  const [attendees, setAttendees] = useState([])

  const url = `http://localhost:5000/get_all`

  useLayoutEffect(() => {
    ;
    (function getAttendees(){
      fetch(url,  {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        }}) // fetch data từ api ve
      .then(response => response.json())
      .then(data =>{ 
        setAttendees(data)
    })
    })()
  }, [])


  return (
    <div className="App">
      <h3>
      Danh sách sinh viên thực tập VDT-2022
      </h3>
      
      <div>
              <table>
                <tr>
                  <th>STT</th>
                  <th>Họ và tên</th>
                  <th>Năm sinh</th>
                  <th>Trường</th>
                  <th>Chuyên ngành</th>
                </tr>
                {
                  attendees.map((attendee) => (
                    <tr key={attendee.stt}>
                      <td >{attendee.stt}</td>
                      <td >{attendee.name}</td>
                      <td >{attendee.yob}</td>
                      <td >{attendee.school}</td>
                      <td >{attendee.major}</td>
                    </tr>
                    ))
                }
                </table>
      </div>
    </div>
  );
}

export default App;
