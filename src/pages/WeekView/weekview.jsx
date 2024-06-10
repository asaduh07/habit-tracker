import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAndUpdateAllHabits } from "../../features/habit/habitReducer";
import { habitSelector } from "../../features/habit/habitReducer";
import WeekCard from "../../components/WeekCard/weekCard";
import Loader from '../../loader/loader'
import style from './weekview.module.css'
export default function Weekview({ setCurrentPage }) {
    const dispatch = useDispatch();
    const { habits,loading } = useSelector(habitSelector);

    useEffect(() => {
        dispatch(fetchAndUpdateAllHabits());
    }, [dispatch]);
    useEffect(() => {
        setCurrentPage('Week View')

    }, [])


    return (
        loading?<div className={style.loadingContainer}><Loader /> </div>:<div className={style.list}>
            {habits.map((habit,index) => (
                <WeekCard habit={habit} key={index}/>
            ))}
        </div>
    )
}