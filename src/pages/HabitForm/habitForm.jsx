import style from './habitform.module.css'
import { useDispatch } from 'react-redux'
import { useRef, useState } from 'react';
import { addHabitAsync } from '../../features/habit/habitReducer';
export default function Form() {
    let titleInput= useRef(null);
    let timeInput= useRef(null);
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');

    const dispatch = useDispatch();

    function handleSubmit(e) {
        e.preventDefault(); 
        dispatch(addHabitAsync({ title, schedule: time }));
        setTitle('');
        setTime('');
        titleInput.current.value = '';
        timeInput.current.value = '';
        
    }
    return (
        <div className={style.container}>
            <h1>Add a Habit</h1>
            <form className={style.form}>
                <div className={style.title}>
                    <label htmlFor="title">Name</label>
                    <input type="text" id='title' placeholder='Enter Habit' ref={titleInput}  required onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="time">
                    <label htmlFor="time">Schedule Time</label>
                    <input type="time" name="time" id="time" ref={timeInput} required onChange={(e) => setTime(e.target.value)} />
                </div>
                <button onClick={(e) => handleSubmit(e)}>Add</button>

            </form>
        </div>
    )
}