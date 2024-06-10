import { Outlet } from "react-router-dom";
import style from "./navbar.module.css";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Navbar({ currentPage }) {
    const navigate = useNavigate();
       

    return (
        <>
            <nav >
                <div className={style.navcontainer}>
                    <div className={style.hamburger}>
                        <img src="https://cdn-icons-png.flaticon.com/128/7710/7710488.png" alt="" />
                        <h3>{ currentPage }</h3>
                    </div>
                    <div className={style.sort}>
                        {currentPage==='Week View'?<img src="https://cdn-icons-png.flaticon.com/128/1150/1150643.png" alt=""  onClick={() => navigate('/')}/>:<img src="https://cdn-icons-png.flaticon.com/128/747/747310.png" alt=""  onClick={() => navigate('/week')}/>}
                        <button onClick={() => navigate('/add')}>Add Habit</button>
                        <img src="https://cdn-icons-png.flaticon.com/128/4024/4024609.png" alt="" />

                    </div>

                </div>
            </nav>
            <Outlet/>
        </>
    )
}