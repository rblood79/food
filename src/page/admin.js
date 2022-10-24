import { useEffect, useState } from "react";
import { isMobile } from 'react-device-detect';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import { ko } from "date-fns/esm/locale";
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";
import 'moment/locale/ko';
import '../admin.css';

import mnd from '../assets/logo.svg';

import { doc, getDoc, setDoc, query, getDocs, documentId, where, deleteDoc } from 'firebase/firestore';

function App(props) {

  const [data, setData] = useState(null);

  const [startDate, setStartDate] = useState(moment().startOf('week').format('YYYYMMDD'));
  const [endDate, setEndDate] = useState(moment().endOf('week').format('YYYYMMDD'));
  const [days, setDays] = useState();
  const [user, setUser] = useState(0);
  const [cost, setCost] = useState(0);

  const [comment, setComment] = useState('');

  const [brSum, setBrSum] = useState(0);
  const [luSum, setLuSum] = useState(0);
  const [diSum, setDiSum] = useState(0);
  const [totalSum, setTotalSum] = useState(0);

  const [admin, setAdmin] = useState();

  const docRef = doc(props.serving, "ini");
  const q = query(props.serving, where(documentId(), ">=", startDate), where(documentId(), "<=", moment(endDate).format("YYYYMMDD")));

  const clear = async () => {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteItem(doc.id)
    });
    onLoad();
  }

  const deleteItem = async (nameId) => {
    const docRef = doc(props.serving, nameId);
    deleteDoc(docRef)
      .then(() => {
        //console.log("Entire Document has been deleted successfully.")
      })
  }

  const ini = async () => {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUser(docSnap.data().user);
      setCost(docSnap.data().cost);
      setAdmin(props.user.userNum);
      setComment(docSnap.data().comment);
    } else {
      setUser(1000);
      setCost(3666);
      setComment('시험버전은 통계확인을 위한 용도이며 실제 취사유무에는 반영되지 않으며 메뉴는 랜덤으로 보여지게 됩니다.');
    };
  }

  const onLoad = async () => {
    //console.log('load');
    const tempDoc = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      tempDoc.push({ time: moment(doc.id).unix(), date: doc.id, ...doc.data() })
    });
    setData(tempDoc);
    //
    let br = 0;
    _.filter(tempDoc, function (o) {
      if (o.조식.length > 0 && o.date >= startDate && o.date <= endDate) {
        br += o.조식.length;
      }
    })

    let lu = 0;
    _.filter(tempDoc, function (o) {
      if (o.중식.length > 0 && o.date >= startDate && o.date <= endDate) {
        lu += o.중식.length;
      }
    })

    let di = 0;
    _.filter(tempDoc, function (o) {
      if (o.석식.length > 0 && o.date >= startDate && o.date <= endDate) {
        di += o.석식.length;
      }
    })
    setBrSum(br);
    setLuSum(lu);
    setDiSum(di);
    setTotalSum(br + lu + di);

    calendar();
  }

  const calendar = () => {
    const now = moment(startDate), dates = [];
    while (now.isSameOrBefore(moment(endDate))) {
      dates.push(now.format('YYYYMMDD'));
      now.add(1, 'days');
    }
    setDays(dates);
  }

  const items = () => {
    const result = [];
    for (let i = 0; i < days.length; i++) {
      const tempDay = moment(days[i]).format("YYYYMMDD");
      const findDay = data && _.find(data, ['date', tempDay]);

      const brUser = findDay ? findDay.조식.length : 0;
      const luUser = findDay ? findDay.중식.length : 0;
      const diUser = findDay ? findDay.석식.length : 0;
      const total = brUser + luUser + diUser;

      result.push(
        <tr key={days[i]}>
          {i === 0 && <><td rowSpan={days.length}>oo부대</td></>}
          <td>{moment(days[i]).format("MM월 DD일 (dd)")}</td>
          {
            !isMobile ? <>
              <td>{user} ({brUser} / {user - brUser})</td>
              <td>{user} ({luUser} / {user - luUser})</td>
              <td>{user} ({diUser} / {user - diUser})</td>
              <td>{user * 3} ({total} / {(user * 3) - total})</td>
            </> :
              <td>
                <div className="tdm">
                  <span>조식: {user} ({brUser} / {user - brUser})</span>
                  <span>중식: {user} ({luUser} / {user - luUser})</span>
                  <span>석식: {user} ({diUser} / {user - diUser})</span>
                  <span className="totalm">합계: {user * 3} ({total} / {(user * 3) - total})</span>
                </div>
              </td>
          }



        </tr>
      )
    }
    //setBrSum(temp)
    return result;
  }

  useEffect(() => {
    onLoad();
  }, [startDate, endDate])

  useEffect(() => {
    ini();
  }, [])

  return (
    <div className="admin">
      <header className='header'>
        <div className='headerWrap'>
          <div className="headTitle"><img src={mnd} alt="MND" /> 장병 급식 신청 관리</div>
          <nav className="nav">
            <button className="navButton active" ><i className="ri-pie-chart-2-fill"></i>현황</button>
            <button className="navButton" onClick={() => { alert('시험버전에서 제공하지 않습니다') }}><i className="ri-user-add-line"></i>인원</button>
            <button className="navButton" onClick={() => { alert('시험버전에서 제공하지 않습니다') }}><i className="ri-shopping-cart-2-line"></i>자재</button>
            <button className="navButton" onClick={() => { alert('시험버전에서 제공하지 않습니다') }}><i className="ri-database-2-line"></i>DB</button>
          </nav>
          {!isMobile && <div className="spaceButton">{admin} 관리자님 환영합니다</div>}
        </div>
      </header>
      <main className='main'>
        <section className='section result'>
          <div className="resultHead">
            <h2 className="title">종합현황</h2>
            <div className="buttonGroup">
              <button onClick={() => { onLoad() }}><i className="ri-refresh-line"></i>재조회</button>
              {admin === 'rblood' && <button onClick={() => {
                window.confirm('선택한 기간의 데이터를 삭제 합니다 삭제시 복구 할수 없습니다. 다시 한번 확인하세요.') && clear();
              }}><i className="ri-delete-bin-2-line"></i>데이터삭제</button>}
              {!isMobile &&
                <div className="wrap">
                  <button disabled><i className="ri-folder-upload-line"></i>취식인원 업로드</button>
                  <button disabled><i className="ri-folder-download-line"></i>현황 다운로드</button>
                  <button disabled><i className="ri-printer-line"></i>화면인쇄</button>
                </div>
              }
            </div>
          </div>
          {!isMobile &&
            <div className="comments">
              <label htmlFor="com">신청 상단 메모</label>
              <input type='textarea' id="com" placeholder="참여 인원수를 넣으세요" value={comment || ''} onChange={({ target: { value } }) => {
                setComment(value);
                setDoc(docRef, { comment: value }, { merge: true });
              }} />
            </div>
          }

          <div className="setting">
            <div>
              <label htmlFor="man">인원(명)</label>
              <input type='text' id="man" placeholder="참여 인원수를 넣으세요" value={user || ''} onChange={({ target: { value } }) => {
                setUser(value);
                setDoc(docRef, { user: value }, { merge: true });
              }} />
            </div>
            <div>
              <label htmlFor="cost">1회 비용(원)</label>
              <input type='text' id="cost" placeholder="1회 식사비용을 넣으세요" value={cost || ''} onChange={({ target: { value } }) => {
                setCost(value);
                setDoc(docRef, { cost: value }, { merge: true });
              }} />
            </div>
            <div className="picker">
              <label >시작일</label>
              <DatePicker
                withPortal
                disabledKeyboardNavigation
                locale={ko}
                dateFormat="yyyy년 MM월 dd일"
                className="datepicker"
                //minDate={new Date()}
                //closeOnScroll={true}
                selected={moment(startDate).toDate()}
                onChange={(date) => setStartDate(moment(date).format("YYYYMMDD"))}
              />
            </div>
            <div className="picker">
              <label >종료일</label>
              <DatePicker
                withPortal
                disabledKeyboardNavigation
                locale={ko}
                dateFormat="yyyy년 MM월 dd일"
                className="datepicker"
                minDate={moment(startDate).toDate()}
                //closeOnScroll={true}
                selected={moment(endDate).toDate()}
                onChange={(date) => setEndDate(moment(date).format("YYYYMMDD"))}
              />
            </div>
            <div className="months">
              <label>간편조회</label>
              <div className="buttonWrap">
                <button onClick={() => {
                  setStartDate(moment().startOf('week').format('YYYYMMDD'))
                  setEndDate(moment().endOf('week').format('YYYYMMDD'))
                }}>이번주</button>

                <button onClick={() => {
                  setStartDate(moment().startOf('month').format("YYYYMMDD"))
                  setEndDate(moment().endOf('month').format('YYYYMMDD'))
                }}>이번달</button>

                <button onClick={() => {
                  setStartDate(moment().month(moment().month() - 1).startOf('month').format("YYYYMMDD"))
                  setEndDate(moment().month(moment().month() - 1).endOf('month').format('YYYYMMDD'))
                }}>지난달</button>

                <button onClick={() => {
                  setStartDate(moment().month(moment().month() + 1).startOf('month').format("YYYYMMDD"))
                  setEndDate(moment().month(moment().month() + 1).endOf('month').format('YYYYMMDD'))
                }}>다음달</button>

              </div>
            </div>
          </div>
          {
            user > brSum && user > luSum && user > diSum
            && cost > 0 &&
            <div className='tableContents'>
              <table className='table'>
                <caption>{days && '기간 (' + moment(startDate).format("YYYY년 MM월 DD dddd") + '~' + moment(endDate).format("YYYY년 MM월 DD dddd") + ')'}</caption>
                <colgroup>
                  <col width={isMobile ? 62 : 124} />
                  <col width="110" />
                </colgroup>
                <thead>
                  <tr>
                    <th rowSpan={isMobile ? 1 : 2}>소속</th>
                    <th rowSpan={isMobile ? 1 : 2}>월/일/요일</th>
                    <th colSpan={isMobile ? 1 : 4}>
                      <span>전체 (취식 / 미취식)</span>
                    </th>

                  </tr>
                  {
                    !isMobile &&
                    <tr>
                      <th>
                        <span>조식인원</span>
                      </th>
                      <th>
                        <span>중식인원</span>
                      </th>
                      <th>
                        <span>석식인원</span>
                      </th>
                      <th>
                        <span>계</span>
                      </th>
                    </tr>}
                </thead>

                <tbody>
                  {days && items()}
                </tbody>

                <tfoot>
                  {days &&
                    <>
                      <tr>
                        <th colSpan="2">{days.length + '일간 통계'}</th>
                        {
                          !isMobile ? <>
                            <th>
                              <span>{days.length * user} ({brSum} / {(days.length * user) - brSum})</span>
                            </th>
                            <th>
                              <span>{days.length * user} ({luSum} / {(days.length * user) - luSum})</span>
                            </th>
                            <th>
                              <span>{days.length * user} ({diSum} / {(days.length * user) - diSum})</span>
                            </th>
                            <th>
                              <span>{days.length * (user * 3)} ({totalSum} / {(days.length * (user * 3)) - totalSum})</span>
                            </th>
                          </> :
                            <th>
                              <div className="tdm">
                                <span>조식: {days.length * user} ({brSum} / {(days.length * user) - brSum})</span>
                                <span>중식: {days.length * user} ({luSum} / {(days.length * user) - luSum})</span>
                                <span>석식: {days.length * user} ({diSum} / {(days.length * user) - diSum})</span>
                                <span className="totalm">합계: {days.length * (user * 3)} ({totalSum} / {(days.length * (user * 3)) - totalSum})</span>
                              </div>
                            </th>
                        }

                      </tr>
                      <tr>
                        <th colSpan="2">
                          <span className="total">취사계획비용</span>
                          <span className="end">실제사용비용</span>
                          <span className="minus">절감비용</span>
                          <span className="fix">.</span>
                        </th>
                        {
                          !isMobile && <>
                            <th className="pay">
                              <span className="total">{(days.length * user * cost).toLocaleString('ko-KR')} 원</span>
                              <span className="end">{(brSum * cost).toLocaleString('ko-KR')} 원</span>
                              <span className="minus">{brSum > 0 && '-'}{((days.length * user - brSum) * cost).toLocaleString('ko-KR')} 원</span>
                              <span className="fix">.{/*((brSum / (days.length * user)) * 100).toFixed(6)*/}</span>
                            </th>
                            <th className="pay">
                              <span className="total">{(days.length * user * cost).toLocaleString('ko-KR')} 원</span>
                              <span className="end">{(luSum * cost).toLocaleString('ko-KR')} 원</span>
                              <span className="minus">{luSum > 0 && '-'}{((days.length * user - luSum) * cost).toLocaleString('ko-KR')} 원</span>
                              <span className="fix">.{/*((luSum / (days.length * user)) * 100).toFixed(6)*/}</span>
                            </th>
                            <th className="pay">
                              <span className="total">{(days.length * user * cost).toLocaleString('ko-KR')} 원</span>
                              <span className="end">{(diSum * cost).toLocaleString('ko-KR')} 원</span>
                              <span className="minus">{diSum > 0 && '-'}{((days.length * user - diSum) * cost).toLocaleString('ko-KR')} 원</span>
                              <span className="fix">.{/*((diSum / (days.length * user)) * 100).toFixed(6)*/}</span>
                            </th>
                          </>
                        }
                        <th className="pay">
                          <span className="total">{(days.length * (user * 3) * cost).toLocaleString('ko-KR')} 원 계획</span>
                          <span className="end">{(totalSum * cost).toLocaleString('ko-KR')} 원 사용</span>
                          <span className="minus">{totalSum > 0 && '-'} {(((days.length * user * 3) - totalSum) * cost).toLocaleString('ko-KR')} 원 절감</span>
                          <span>{(((days.length * user * 3) - totalSum) / (days.length * user * 3) * 100).toFixed(2)}% 절감</span>
                        </th>
                      </tr>
                    </>
                  }
                </tfoot>
              </table>
            </div>
          }

        </section>
      </main>
      <footer className='footer'>
        ministry of national defense
      </footer>
    </div>
  );
}

export default App;