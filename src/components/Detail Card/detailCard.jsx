import style from './detailCard.module.css'
import { useEffect, useState } from 'react'
import { updateFavoriteAsync } from '../../features/habit/habitReducer';
import { useDispatch } from 'react-redux';
export default function DetailCard({ habit }) {
    const dispatch = useDispatch();
    const [favorite, setFavorite] = useState(habit.fav);

    const handleFavoriteToggle = async() => {
        try {
            // Invert the value of `fav`
            const updatedFav = !habit.fav;
            // Dispatch an action to update the state in Redux
            await dispatch(updateFavoriteAsync({ id: habit.id, fav: updatedFav }));
            setFavorite(updatedFav);
        } catch (error) {
            console.error("Error updating favorite:", error);
        }
    };

    return (
        <div className={style.card}>
            <div className={style.top}>
                <h3 className={style.title}>{habit.title}</h3>
                <div className="schedule">{habit.schedule}</div>
            </div>
            <div className={style.options}>

                <img src={favorite ? 'https://cdn-icons-png.flaticon.com/128/1828/1828884.png' : 'https://cdn-icons-png.flaticon.com/128/1828/1828970.png'} alt="favourite" onClick={handleFavoriteToggle} />


            </div>
            <div className={style.details}>
                <span>{habit.currentStreak} Day(s) streak</span>
                <span>{habit.bestStreak} best</span>
                <span>{habit.totalDays}/{habit.statuses.length} days</span>

            </div>

        </div>
    )
}