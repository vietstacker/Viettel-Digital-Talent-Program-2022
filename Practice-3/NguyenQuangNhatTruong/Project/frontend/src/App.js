import { useState, useLayoutEffect } from 'react';
import './App.css';

function App() {

  const [users, setUsers] = useState([])


  useLayoutEffect(() => {
    ;
    (function getUsers(){
      fetch(`http://localhost:5000/get_all`,  {
        method: 'GET',
        mode: "cors",
        headers: {
          Accept: 'application/json',
        }}) 
      .then(response => response.json())
      .then(data =>{ 
        setUsers(data)
    })
    })()
  }, [])

  return (
    <div className="container">
      <div className="user-list">
            <li className="user">
              <span className="user-stt">STT</span>
              <span className="user-ten">Ho ten</span>
              <span className="user-namsinh">Nam sinh</span>
              <span className="user-truong">Truong</span>
              <span className="user-nganh">Nganh</span>

            </li>
      </div>
      <div className="user-list">
        {users.map((user) => (
            <li key={user.stt} className="user">
              <span className="user-stt">{user.stt}</span>
              <span className="user-ten">{user.ten}</span>
              <span className="user-namsinh">{user.namsinh}</span>
              <span className="user-truong">{user.truong}</span>
              <span className="user-nganh">{user.nganh}</span>

            </li>
          ))
        }
      </div>
    </div>
  );
}

export default App;
