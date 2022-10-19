import { csrfFetch } from "./csrf";

// todo:define types
const LOAD = "spots/LOAD";
const LOAD_ONE = "spots/LOAD_ONE";
const LOAD_CURRENT = "spots/LOAD_CURRENT";
const CREATE = "spots/CREATE";
//const ADDIMG ='spot/ADD_IMG'
const UPDATE = "spots/UPDATE";
const REMOVE = "spots/REMOVE";

// todo:define action creators

const actionLoad = (all) => ({
  type: LOAD,
  all,
});

const actionLoadSingle = (one) => ({
  type: LOAD_ONE,
  one,
});

const actionCurrentSpot = (userSpot) => ({
  type: LOAD_CURRENT,
  userSpot,
});

const actioCreate = (newSpot) => ({
  type: CREATE,
  newSpot,
});



const actionUpdate = () => ({
  type: UPDATE,
});

const actionRemove = (id) => ({
  type: REMOVE,
  id,
});

// todo:thunks section
export const getAllSpots = () => async (dispatch) => {
  const res = await csrfFetch("api/spots");

  if (res.ok) {
    const list = await res.json();
    // console.log("list-thunk",list)
    dispatch(actionLoad(list));
  }
};

export const getSpotsDetail = (spotId) => async (dispatch) => {
  // console.log("spotId-thunk:",spotId)
  const res = await csrfFetch(`/api/spots/${spotId}`);

  if (res.ok) {
    const singleSpot = await res.json();
    //console.log('singleSpot',singleSpot)
    dispatch(actionLoadSingle(singleSpot));
  }
};

export const getCurrentSpot = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");

  if (res.ok) {
    const currentSpot = await res.json();
    // console.log('current_thunk',currentSpot)
    dispatch(actionCurrentSpot(currentSpot));
  }
};

export const createSpot = (spot,img) => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spot),
  });
  if (res.ok) {
    const newSpot = await res.json();
    // dispatch(actioCreate(newSpot));
    // return newSpot;
    //console.log("createSpot",createSpot)
    const resImg = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(img)

    })
    if (resImg.ok) {
        const newImg = await resImg.json()
     //   newSpot.previewImage = newImg.url
        dispatch(actioCreate(newSpot))
        return newSpot

    }
  }
};

// todo: reduce stuff
const initialState = { allSpots: {}, singleSpot: {} };

const spotReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case LOAD:
      newState = { ...state };
      let allSpots = {};
      action.all.Spots.forEach((spot) => (allSpots[spot.id] = spot));
      newState.allSpots = allSpots;
      //  console.log('newstate:', newState)
      return newState;

    case LOAD_ONE:
      newState = { ...state };
      const singleSpot = action.one;
      newState.singleSpot = singleSpot;
      return newState;

    case LOAD_CURRENT:
      let current = {};
      action.userSpot.Spots.forEach((spot) => (current[spot.id] = spot));
      return { allSpots: current };

    case CREATE:
      // let newCreate = { ...state }
      let newCreate = {};
      newCreate[action.newSpot.id] = action.newSpot;
      return newCreate;

    default:
      return state;
  }
};

export default spotReducer;