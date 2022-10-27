import moment from "moment";
import 'moment/locale/ko';
import MobileCalendar from "react-scroll-calendar";
import '../calendar.css';
import '../App.css';

function App(props) {
    return (
      <div className="calendar">
        <ul className="week"><li>일</li><li>월</li><li>화</li><li>수</li><li>목</li><li>금</li><li>토</li></ul>
        <MobileCalendar
          minDate={moment().add(-7, 'd')}
          //selectedDate={moment()}
          maxDate={moment().add(1, 'M')}
          onSelect={date => {props.onClick(date)}}
        />
      </div>
    );
  }
  
  export default App;