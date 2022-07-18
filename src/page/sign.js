import { useState } from "react";
import { isMobile } from 'react-device-detect';
import { doc, getDoc } from 'firebase/firestore';
import classNames from 'classnames';

import mnd from '../assets/logo.svg';

function App(props) {
  let reg_num = /^[0-9]{6,10}$/; // 전화번호 숫자만

  const [type, setType] = useState(null);
  const [num, setNum] = useState(null);
  const [pw, setPw] = useState(null);

  const click = async () => {
    const docRef = doc(props.serving, "ini");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      !isMobile && num === docSnap.data().adminId && pw === docSnap.data().adminPw ? props.sign({ 'userType': 'admin', 'userNum': num }) :
        !reg_num.test(num) ? setNum(null) : num !== pw ? setPw(null) : props.sign({ 'userType': type, 'userNum': num });
    } else {
      setNum('접속이 원활하지 않습니다')
    };
  }

  return (
    <div className={classNames('sign', type === 'army' ? 'sign0' : type === 'air' ? 'sign1' : type === 'navy' && 'sign2')}>
      <div className='preLoad'><span className='sign0' /><span className='sign1' /><span className='sign2' /><i className="ri-arrow-left-line"/></div>
      <div className="visual">
        <div className="visualText">
          <div className="textGroup">
            <div className="textWrap"><span className="big">소중한</span><span>장병에게</span></div>
            <div className="textWrap"><span className="big">건강한</span></div>
            <div className="textWrap"><span className="big">한끼를</span><span>드립니다</span></div>
            {/*<span>사</span>
            <span>병</span>
            <span>취</span>
            <span>식</span>
            <span>일</span>
            <span>자</span>
            <span>신</span>
  <span>청</span>*/}
          </div>
          <img className='visualLogo' src={mnd} alt={'logo'} />
          <span className="visualTitle"></span>
        </div>
      </div>
      <div className="form">
        {
          type ?
            <>
              <button className="back" onClick={event => { setType(null) }}><i className="ri-arrow-left-line"></i><span>뒤로</span></button>
              <div className="inputWrap"><input className="input id" type='text' placeholder="군번을 입력하세요" value={num || ''} onChange={({ target: { value } }) => {
                setNum(value)
              }} /></div>
              <div className="inputWrap"><input className="input pw" type='password' placeholder="비밀번호를 입력하세요" value={pw || ''} onChange={({ target: { value } }) => {
                setPw(value)
              }} autoComplete="off" /></div>
              <span className="comment">아이디와 비밀번호는 군번이며 - 를 제외하고 입력하세요</span>
              <button className="button" onClick={click}>로그인</button>
            </>
            :
            <>
              {/*<span className="select">소속군을 선택하세요<i className="ri-arrow-down-s-line"></i></span>*/}
              <div className="typeGroup">
                <div className="buttonWrap army"><button className="button army" onClick={event => { setType('army') }}>육군</button></div>
                <div className="buttonWrap air"><button className="button air" onClick={event => { setType('air') }}>공군</button></div>
                <div className="buttonWrap navy"><button className="button navy" onClick={event => { setType('navy') }}>해군</button></div>
              </div>
            </>
        }
        <span className="copy">Ministry of National Defense</span>

      </div>
    </div>
  );
}

export default App;