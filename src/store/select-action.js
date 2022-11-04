import { selectActions } from "./select-slice";

export const setBrushedIndexArr = (arr) => {
	return async (dispatch) => {
        console.log(arr)
		dispatch(selectActions.setBrushedIndexArr(arr));
	}
}


export const setBrushedData = (data) => {
	return async (dispatch) => {
        console.log(data)
		dispatch(selectActions.setBrushedData(data));
	}
}