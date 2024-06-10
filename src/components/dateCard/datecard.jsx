import { useState } from 'react';
import style from './datecard.module.css'
import { changeStatusAsync } from '../../features/habit/habitReducer'
import { useDispatch } from 'react-redux'
import Loader from '../../loader/loader'
export default function DateCard({habit, day}) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    async function handlechange(date, currentStatus) {
        setLoading(true);
        const newStatus = currentStatus === 'done' ? 'notDone' : 'done';
        try {
            await dispatch(changeStatusAsync({ habitId: habit.id, status: newStatus, date: date }));
        } catch (error) {
            console.error("Failed to change status:", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        loading ? <Loader /> : <div className={`
                    ${day.status === 'done' ? style.done : day.status === 'notDone' ? style.notDone : ''}
                    ${style.day} `} onClick={() => handlechange(day.date, day.status)}>
            <div>{day.day}</div>
            <div >{day.date.split('-')[2]}</div>
        </div>
    )
}