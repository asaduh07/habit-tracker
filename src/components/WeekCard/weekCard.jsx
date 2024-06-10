import style from './weekcard.module.css'
import DateCard from '../dateCard/datecard'
export default function WeekCard({ habit }) {
    
    
    return (
        <div className={style.card}>
            <div className={style.top}>
                <h3 className={style.title}>{habit.title}</h3>
                <div className="schedule">{habit.schedule}</div>
            </div>
            <div className={style.days}>
                {habit.statuses.map((day) => (
                    <DateCard day={day}  habit={habit}/>
                ))}
            </div>
        </div>
    )
}