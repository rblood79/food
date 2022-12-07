import { useEffect, useState, useRef } from "react";

import classNames from 'classnames';

import moment from "moment";
import 'moment/locale/ko';

import { doc, setDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

function App(props) {
  const bodyRef = useRef(null);

  const [flag, setFlag] = useState(false);

  const [br, setBr] = useState(false);
  const [lu, setLu] = useState(false);
  const [di, setDi] = useState(false);

  const [menu, setMenu] = useState(null);
  const [foods] = useState(
    [
      {
        'image': '0.png',
        'main': '돈까스',
        'side': ['떡햄버그', '소불고기', '김치'],
        'kal': [396, 257, 80, 70],
      },
      {
        'image': '1.png',
        'main': '돈까스',
        'side': ['찹쌀탕수육', '제육볶음', '김치'],
        'kal': [396, 300, 180, 70],
      },
      {
        'image': '2.png',
        'main': '바삭한치킨',
        'side': ['새우튀김', '소불고기', '김치'],
        'kal': [380, 250, 50, 70],
      },
      {
        'image': '3.png',
        'main': '김치찌게',
        'side': ['제육뽁음', '견과류멸치', '김치'],
        'kal': [480, 180, 50, 70],
      },
      {
        'image': '4.png',
        'main': '부대찌게',
        'side': ['제육뽁음', '견과류멸치', '김치'],
        'kal': [490, 180, 50, 70],
      },
      {
        'image': '5.png',
        'main': '돈치스팸',
        'side': ['김치부대찌게', '견과류멸치', '김치'],
        'kal': [430, 380, 50, 70],
      },
      {
        'image': '6.png',
        'main': '고등어구어',
        'side': ['간장불고기', '새우튀김', '갓김치'],
        'kal': [338, 190, 160, 70],
      },
      {
        'image': '7.png',
        'main': '고추장불고기',
        'side': ['고등어구어', '새우튀김', '김치'],
        'kal': [358, 190, 160, 70],
      },
      {
        'image': '8.png',
        'main': '북경오리구이',
        'side': ['샐러드', '새우튀김', '김치'],
        'kal': [358, 190, 160, 70],
      },
      {
        'image': '9.png',
        'main': '훈제족발',
        'side': ['샐러드', '무말랭이', '백김치'],
        'kal': [358, 190, 160, 70],
      }
    ]
  )

  const save = async () => {
    const dateRef = doc(props.serving, moment(props.date).format("YYYYMMDD"));
    setDoc(dateRef, {
      조식: !br ? arrayRemove(props.user.userNum) : arrayUnion(props.user.userNum),
      중식: !lu ? arrayRemove(props.user.userNum) : arrayUnion(props.user.userNum),
      석식: !di ? arrayRemove(props.user.userNum) : arrayUnion(props.user.userNum),
    }, { merge: true });
    setFlag(true);
  }

  const end = (e) => {
    props.reset(e);
  }

  const items = () => {
    //const sat = moment(props.date).day() === 6 ? true : false;

    const result = [];
    for (let i = 0; i < 3; i++) {
      const dd = i === 0 ? br : i === 1 ? lu : di;
      result.push(
        <div key={'item' + i} className="item" style={{ background: `linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.2) 62%), url(${process.env.PUBLIC_URL + "/foods/" + menu[i].image})` }}>
          <div className="wrap">
            <div className="title"><span className="sub">{i === 0 ? '든든한' : i === 1 ? '특별한' : '맛있는'}</span>{i === 0 ? '조식' : i === 1 ? '중식' : '석식'}</div>
            <div className="contents">
              <div className="foodItem">
                <span>{menu[i].main}</span><span>{menu[i].kal[0]}kal</span>
              </div>
              <div className="foodItem">
                <span>{menu[i].side[0]}</span><span>{menu[i].kal[1]}kal</span>
              </div>
              <div className="foodItem">
                <span>{menu[i].side[1]}</span><span>{menu[i].kal[2]}kal</span>
              </div>
              <div className="foodItem">
                <span>{menu[i].side[2]}</span><span>{menu[i].kal[3]}kal</span>
              </div>
              <div className="foodItem total">
                <span>Total</span><span>{menu[i].kal.reduce((a, b) => a + b, 0)}kal</span>
              </div>
            </div>
          </div>
          <div className="checkbox">
            <label htmlFor={"chk" + i}>{i === 0 ? '조식' : i === 1 ? '중식' : '석식'} {dd ? '먹어요' : '안먹어요'}</label>
            <input type='checkbox' id={"chk" + i} checked={dd}
            onChange={
              event => {
                i === 0 ? setBr(event.target.checked) : i === 1 ? setLu(event.target.checked) : setDi(event.target.checked)
              }
            } /></div>
        </div>
      )
    }
    return result;
  }

  const onLoad = async () => {
    //console.log('//', props)
    const docRef = doc(props.serving, moment(props.date).format("YYYYMMDD"));
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      //console.log(data)
      //console.log(props.user.userNum, data['조식'].indexOf(props.user.userNum))
      setBr(data['조식'].indexOf(props.user.userNum) > -1 ? true : false);
      setLu(data['중식'].indexOf(props.user.userNum) > -1 ? true : false);
      setDi(data['석식'].indexOf(props.user.userNum) > -1 ? true : false);
    } else {
      //console.log('not result')
    };
  }

  useEffect(() => {
    bodyRef.current.scrollTop = 0;

    const temp = foods.slice();
    setMenu(temp.sort(() => Math.random() - 0.5))

    setFlag(false);
    setBr(false);
    setLu(false);
    setDi(false);

    onLoad();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.date])

  return (
    <div className={classNames('sheet', props.date && 'sheetActive')}>
      {!flag ? <>
        <div className="head">
          <div className="title">{props.date ? moment(props.date).format("YYYY년 MM월 DD일") : '취식일을 선택하세요'}</div>
          {props.date && <button className="close" onClick={() => { end(false) }}><i className="ri-close-circle-fill"></i></button>}
        </div>
        <div className="body" ref={bodyRef}>
          <div className="itemComment">
            <span>{props.user.comment}</span>
          </div>
          {menu && items()}
        </div>
        <button className="button save" onClick={save}>신청</button>
      </> : <>
        <div className="body comp" ref={bodyRef}>
          <div>
            <i className="ri-checkbox-circle-fill"></i>
            
          </div>
          <span>신청이 완료 되었습니다</span>
        </div>
        <div className="comment">다른 취식일자를 신청하시려면 "계속" 버튼을, 그만하기를 원하시면 "종료" 버튼을 눌러주세요. </div>
        <div className="buttonGroup">
          <button className="button" onClick={() => { end(true) }}>종료</button>
          <button className="button" onClick={() => { end(false) }}>계속</button>
        </div>
      </>}


    </div>
  );


}

export default App;