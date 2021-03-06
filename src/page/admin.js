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

  const [brSum, setBrSum] = useState(0);
  const [luSum, setLuSum] = useState(0);
  const [diSum, setDiSum] = useState(0);
  const [totalSum, setTotalSum] = useState(0);

  const [admin, setAdmin] = useState();

  const docRef = doc(props.serving, "ini");
  const q = query(props.serving, where(documentId(), ">=", startDate), where(documentId(), "<=", moment(endDate).format("YYYYMMDD")));

  //const qa = query(props.test, where(documentId(), ">=", startDate), where(documentId(), "<=", moment(endDate).format("YYYYMMDD")));

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
    } else {
      setUser(1000);
      setCost(3666);
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
      if (o.??????.length > 0 && o.date >= startDate && o.date <= endDate) {
        br += o.??????.length;
      }
    })

    let lu = 0;
    _.filter(tempDoc, function (o) {
      if (o.??????.length > 0 && o.date >= startDate && o.date <= endDate) {
        lu += o.??????.length;
      }
    })

    let di = 0;
    _.filter(tempDoc, function (o) {
      if (o.??????.length > 0 && o.date >= startDate && o.date <= endDate) {
        di += o.??????.length;
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

      const brUser = findDay ? findDay.??????.length : 0;
      const luUser = findDay ? findDay.??????.length : 0;
      const diUser = findDay ? findDay.??????.length : 0;
      const total = brUser + luUser + diUser;

      result.push(
        <tr key={days[i]}>
          {i === 0 && <><td rowSpan={days.length}>oo??????</td></>}
          <td>{moment(days[i]).format("MM??? DD??? (dd)")}</td>
          {
            !isMobile ? <>
              <td>{user} ({user - brUser} / {brUser})</td>
              <td>{user} ({user - luUser} / {luUser})</td>
              <td>{user} ({user - diUser} / {diUser})</td>
              <td>{user * 3} ({(user * 3) - total} / {total})</td>
            </> :
              <td>
                <div className="tdm">
                  <span>??????: {user} ({user - brUser} / {brUser})</span>
                  <span>??????: {user} ({user - luUser} / {luUser})</span>
                  <span>??????: {user} ({user - diUser} / {diUser})</span>
                  <span className="totalm">??????: {user * 3} ({(user * 3) - total} / {total})</span>
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
          <div className="headTitle"><img src={mnd} alt="MND" /> ?????? ?????? ?????? ??????</div>
          <nav className="nav">
            <button className="navButton active" ><i className="ri-pie-chart-2-fill"></i>??????</button>
            <button className="navButton" onClick={() => { alert('?????????????????? ???????????? ????????????') }}><i className="ri-user-add-line"></i>??????</button>
            <button className="navButton" onClick={() => { alert('?????????????????? ???????????? ????????????') }}><i className="ri-shopping-cart-2-line"></i>??????</button>
            <button className="navButton" onClick={() => { alert('?????????????????? ???????????? ????????????') }}><i className="ri-database-2-line"></i>DB</button>
          </nav>
          {!isMobile && <div className="spaceButton">{admin} ???????????? ???????????????</div>}
        </div>
      </header>
      <main className='main'>
        <section className='section result'>
          <div className="resultHead">
            <h2 className="title">????????????</h2>
            <div className="buttonGroup">
              <button onClick={() => { onLoad() }}><i className="ri-refresh-line"></i>?????????</button>
              {admin === 'rblood' && <button onClick={() => {
                window.confirm('????????? ?????? ?????? ????????????. ?????? ?????? ???????????????.') && clear();
              }}><i className="ri-delete-bin-2-line"></i>?????????????????????</button>}
              {!isMobile &&
                <div className="wrap">
                  <button disabled><i className="ri-folder-upload-line"></i>???????????? ?????????</button>
                  <button disabled><i className="ri-folder-download-line"></i>?????? ????????????</button>
                  <button disabled><i className="ri-printer-line"></i>????????????</button>
                </div>
              }
            </div>
          </div>

          <div className="setting">
            <div>
              <label htmlFor="man">??????(???)</label>
              <input type='text' id="man" placeholder="?????? ???????????? ????????????" value={user || ''} onChange={({ target: { value } }) => {
                setUser(value);
                setDoc(docRef, { user: value }, { merge: true });
              }} />
            </div>
            <div>
              <label htmlFor="cost">1??? ??????(???)</label>
              <input type='text' id="cost" placeholder="1??? ??????????????? ????????????" value={cost || ''} onChange={({ target: { value } }) => {
                setCost(value);
                setDoc(docRef, { cost: value }, { merge: true });
              }} />
            </div>
            <div className="picker">
              <label >?????????</label>
              <DatePicker
                withPortal
                disabledKeyboardNavigation
                locale={ko}
                dateFormat="yyyy??? MM??? dd???"
                className="datepicker"
                //minDate={new Date()}
                closeOnScroll={true}
                selected={moment(startDate).toDate()}
                onChange={(date) => setStartDate(moment(date).format("YYYYMMDD"))}
              />
            </div>
            <div className="picker">
              <label >?????????</label>
              <DatePicker
                withPortal
                disabledKeyboardNavigation
                locale={ko}
                dateFormat="yyyy??? MM??? dd???"
                className="datepicker"
                minDate={moment(startDate).toDate()}
                closeOnScroll={true}
                selected={moment(endDate).toDate()}
                onChange={(date) => setEndDate(moment(date).format("YYYYMMDD"))}
              />
            </div>
            <div className="months">
              <label>????????????</label>
              <div className="buttonWrap">
                <button onClick={() => {
                  setStartDate(moment().startOf('week').format('YYYYMMDD'))
                  setEndDate(moment().endOf('week').format('YYYYMMDD'))
                }}>?????????</button>

                <button onClick={() => {
                  setStartDate(moment().startOf('month').format("YYYYMMDD"))
                  setEndDate(moment().endOf('month').format('YYYYMMDD'))
                }}>?????????</button>

                <button onClick={() => {
                  setStartDate(moment().month(moment().month() - 1).startOf('month').format("YYYYMMDD"))
                  setEndDate(moment().month(moment().month() - 1).endOf('month').format('YYYYMMDD'))
                }}>?????????</button>

                <button onClick={() => {
                  setStartDate(moment().month(moment().month() + 1).startOf('month').format("YYYYMMDD"))
                  setEndDate(moment().month(moment().month() + 1).endOf('month').format('YYYYMMDD'))
                }}>?????????</button>

              </div>
            </div>
          </div>
          {
            user > brSum && user > luSum && user > diSum
            && cost > 0 &&
            <div className='tableContents'>
              <table className='table'>
                <caption>{days && '?????? (' + moment(startDate).format("YYYY??? MM??? DD dddd") + '~' + moment(endDate).format("YYYY??? MM??? DD dddd") + ')'}</caption>
                <colgroup>
                  <col width={isMobile ? 62 : 124} />
                  <col width="110" />
                </colgroup>
                <thead>
                  <tr>
                    <th rowSpan={isMobile ? 1 : 2}>??????</th>
                    <th rowSpan={isMobile ? 1 : 2}>???/???/??????</th>
                    <th colSpan={isMobile ? 1 : 4}>
                      <span>?????? (?????? / ?????????)</span>
                    </th>

                  </tr>
                  {
                    !isMobile &&
                    <tr>
                      <th>
                        <span>????????????</span>
                      </th>
                      <th>
                        <span>????????????</span>
                      </th>
                      <th>
                        <span>????????????</span>
                      </th>
                      <th>
                        <span>???</span>
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
                        <th colSpan="2">{days.length + '?????? ??????'}</th>
                        {
                          !isMobile ? <>
                            <th>
                              <span>{days.length * user} ({(days.length * user) - brSum} / {brSum})</span>
                            </th>
                            <th>
                              <span>{days.length * user} ({(days.length * user) - luSum} / {luSum})</span>
                            </th>
                            <th>
                              <span>{days.length * user} ({(days.length * user) - diSum} / {diSum})</span>
                            </th>
                            <th>
                              <span>{days.length * (user * 3)} ({(days.length * (user * 3)) - totalSum} / {totalSum})</span>
                            </th>
                          </> :
                            <th>
                              <div className="tdm">
                                <span>??????: {days.length * user} ({(days.length * user) - brSum} / {brSum})</span>
                                <span>??????: {days.length * user} ({(days.length * user) - luSum} / {luSum})</span>
                                <span>??????: {days.length * user} ({(days.length * user) - diSum} / {diSum})</span>
                                <span className="totalm">??????: {days.length * (user * 3)} ({(days.length * (user * 3)) - totalSum} / {totalSum})</span>
                              </div>
                            </th>
                        }

                      </tr>
                      <tr>
                        <th colSpan="2">
                          <span className="total">??????????????????</span>
                          <span className="end">??????????????????</span>
                          <span className="minus">????????????</span>
                          <span className="fix">.</span>
                        </th>
                        {
                          !isMobile && <>
                            <th className="pay">
                              <span className="total">{(days.length * user * cost).toLocaleString('ko-KR')} ???</span>
                              <span className="end">{(((days.length * user) - brSum) * cost).toLocaleString('ko-KR')} ???</span>
                              <span className="minus">{brSum > 0 && '-'}{(brSum * cost).toLocaleString('ko-KR')} ???</span>
                              <span className="fix">.{/*((brSum / (days.length * user)) * 100).toFixed(6)*/}</span>
                            </th>
                            <th className="pay">
                              <span className="total">{(days.length * user * cost).toLocaleString('ko-KR')} ???</span>
                              <span className="end">{(((days.length * user) - luSum) * cost).toLocaleString('ko-KR')} ???</span>
                              <span className="minus">{luSum > 0 && '-'}{(luSum * cost).toLocaleString('ko-KR')} ???</span>
                              <span className="fix">.{/*((luSum / (days.length * user)) * 100).toFixed(6)*/}</span>
                            </th>
                            <th className="pay">
                              <span className="total">{(days.length * user * cost).toLocaleString('ko-KR')} ???</span>
                              <span className="end">{(((days.length * user) - diSum) * cost).toLocaleString('ko-KR')} ???</span>
                              <span className="minus">{diSum > 0 && '-'}{(diSum * cost).toLocaleString('ko-KR')} ???</span>
                              <span className="fix">.{/*((diSum / (days.length * user)) * 100).toFixed(6)*/}</span>
                            </th>
                          </>
                        }
                        <th className="pay">
                          <span className="total">{(days.length * (user * 3) * cost).toLocaleString('ko-KR')} ??? ??????</span>
                          <span className="end">{(((days.length * (user * 3)) - totalSum) * cost).toLocaleString('ko-KR')} ??? ??????</span>
                          <span className="minus">{totalSum > 0 && '-'}{(totalSum * cost).toLocaleString('ko-KR')} ??? ??????</span>
                          <span>{((totalSum / (days.length * (user * 3))) * 100).toFixed(2)}% ??????</span>
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