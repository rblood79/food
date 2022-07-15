import { useEffect, useState, useRef } from "react";

import classNames from 'classnames';

import moment from "moment";
import 'moment/locale/ko';

import { doc, setDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

function App(props) {
  const bodyRef = useRef(null);

  const [br, setBr] = useState(true);
  const [lu, setLu] = useState(true);
  const [di, setDi] = useState(true);

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
    //console.log(moment(props.date).format("YYYYMMDD"))
    //console.log(props.user, props.date, br, lu, di)
    const dateRef = doc(props.serving, moment(props.date).format("YYYYMMDD"));
    setDoc(dateRef, {
      조식: br ? arrayRemove(props.user.userNum) : arrayUnion(props.user.userNum),
      중식: lu ? arrayRemove(props.user.userNum) : arrayUnion(props.user.userNum),
      석식: di ? arrayRemove(props.user.userNum) : arrayUnion(props.user.userNum),
    }, { merge: true });
    props.reset();
  }

  const items = () => {
    const result = [];
    for (let i = 0; i < 3; i++) {
      const dd = i === 0 ? br : i === 1 ? lu : di;
      result.push(
        <div key={'item' + i} className="item" style={{ background: `linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.2) 62%), url(${process.env.PUBLIC_URL + "foods/" + menu[i].image})` }}>
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
          <div className="checkbox"><label htmlFor={"chk" + i}>{i === 0 ? '조식' : i === 1 ? '중식' : '석식'} {dd ? '먹어요' : '안먹어요'}</label><input type='checkbox' id={"chk" + i} checked={dd}
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
    const docRef = doc(props.serving, moment(props.date).format("YYYYMMDD"));
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setBr(data['조식'].indexOf(props.user.userNum) === -1 ? true : false);
      setLu(data['중식'].indexOf(props.user.userNum) === -1 ? true : false);
      setDi(data['석식'].indexOf(props.user.userNum) === -1 ? true : false);
    } else {
      //console.log('not result')
    };
  }

  useEffect(() => {
    bodyRef.current.scrollTop = 0;

    const temp = foods.slice();
    setMenu(temp.sort(() => Math.random() - 0.5))

    setBr(true);
    setLu(true);
    setDi(true);

    onLoad();
  }, [props.date])

  return (
    <div className={classNames('sheet', props.date && 'sheetActive')}>
      <div className="head">
        <div className="title">{props.date ? moment(props.date).format("YYYY년 MM월 DD일") : '취식일을 선택하세요'}</div>
        {props.date && <button className="close" onClick={props.reset}><span><i className="ri-close-line"></i></span></button>}
      </div>
      <div className="body" ref={bodyRef}>
        <div className="itemComment">
          <span>시험버전은 통계확인을 위한 용도이며 실제 취사유무에는 반영되지 않으며 메뉴는 랜덤으로 보여지게 됩니다.</span>
        </div>
        {menu && items()}
      </div>
      <button className="button save" onClick={save}>저장</button>
    </div>
  );


}

export default App;