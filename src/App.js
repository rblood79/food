//import logo from './logo.svg';
import './App.css';
import 'remixicon/fonts/remixicon.css'
import classNames from 'classnames';

import Sign from './page/sign';
import Admin from './page/admin';
import Calendar from './page/calendar';
import Serving from './page/serving';
import { useEffect, useState } from 'react';

//import { doc, setDoc, query, where, getDocs } from 'firebase/firestore';

function App(props) {

  const [user, setUser] = useState(null);
  const [date, setDate] = useState();

  //const [data, setData] = useState(null);

  const sign = (item) => {
    setUser(item)
  }

  const setDay = (item) => {
    //setDate(moment(item).format("YYYY년MM월DD일"))
    setDate(item)
  }

  const reset = (item) => {
    setDate(null)
  }

  useEffect(() => {
    //onLoad()
  }, [])

  return (
    <div className="App">
      {user ? user.userType === 'admin' ? <Admin serving={props.serving} /> :
        <>
          <header className="App-header">
            <button className="button back" onClick={event => { setUser(null) }}><i className="ri-arrow-left-line"></i></button>
            <div className='user'>
              {user && user.userNum}님 취식일정
            </div>
            <button className='button menu' onClick={event => { alert('시험버전에서 제공하지 않습니다') }}><i className="ri-menu-fill"></i></button>
          </header>
          <Calendar onClick={setDay} />
          <div className={classNames('background', date && 'backgroundActive')} />
          <Serving date={date} user={user} serving={props.serving} reset={reset} />
        </>
        :
        <Sign serving={props.serving} sign={sign}/>
      }

    </div>
  );
}

export default App;
