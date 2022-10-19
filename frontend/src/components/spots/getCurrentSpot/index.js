import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { getCurrentSpot } from '../../../store/spots.js'

const GetCurrentSpot = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const currentUser = useSelector((state) => state.session.user)
    console.log("currentUser", currentUser)

    const currentSpot = useSelector(state => state.spots.allSpots)
    console.log("spots_getCurrent", currentSpot)

    const currentSpotArr = Object.values(currentSpot)
    console.log('currentSpotArr', currentSpotArr)

    if (!currentUser) {
        history.push('/')
    }


    useEffect(() => {
        if (currentUser) {
            dispatch(getCurrentSpot(currentSpotArr))
        }
    }, [dispatch,currentUser]);

    if (currentSpotArr.length == 0) {
        return "Sorry, you do not have any hosting"
    }


    return (
        <div className='currentUser_spot'>
            <h1>All your hosting</h1>
            {currentSpotArr.length > 0 && currentSpotArr.map(spot => (
            <>
                <div className='currentSpot_info' key={spot.id}>
                    <NavLink to={`/spots/${spot.id}`}>
                        <img className='spot_img' src={spot.previewImage} alt={spot.name} />
                    </NavLink>
                    </div>

                    <div className='spot_address'>
                        <p>{spot.address}</p>
                        <p>{spot.city},{spot.state},{spot.country}</p>
                    </div>

                    <div className='spot_price' >
                        {`${spot.price} /night`}
                    </div>
</>
            ))}
        </div>


    )




}
export default GetCurrentSpot;