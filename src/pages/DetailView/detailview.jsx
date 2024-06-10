import style from './detailview.module.css'
import DetailCard from "../../components/Detail Card/detailCard"
import { habitSelector } from "../../features/habit/habitReducer"
import { useSelector,useDispatch} from "react-redux";
import { useEffect } from 'react';
import { fetchAndUpdateAllHabits } from '../../features/habit/habitReducer';
import Loader from '../../loader/loader'
export default function Detailview({setCurrentPage}) {
    const dispatch=useDispatch();
    const { habits, loading } = useSelector(habitSelector);
    useEffect(()=>{
        dispatch(fetchAndUpdateAllHabits());
    },[dispatch])

    useEffect(()=>{
        setCurrentPage('Detail View')
                
    },[])


    
    return (
        loading ?<div className={style.loadingContainer}><Loader /> </div> : <div className={style.habitList}>
            {habits.map((habit,index) => (
                <DetailCard habit={habit} key={index} />
            ))}
        </div>
    )
}