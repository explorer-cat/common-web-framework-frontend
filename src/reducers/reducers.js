import { MODAL,TOAST } from "../actions/actions";

// Initial state
const initialState = {
    modal: {
        type : 0,
        visible : false,
        title : '',
        message : '',
        confirmText : '확인',
        cancelText : '취소',
        confirmFunc : null,
        async : false, //비동기 컨펌 사용 유무
        sucessCallback : () => {},
    },

    toast : {
        type : '',
        visible : false,
        title :'',
        message :'',
        description : '',
        time : '',
    }

};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case MODAL:
            return {...state, modal: action.state};
        case TOAST:
            return {...state, toast: action.state};
        default:
            return state;
    }
};

export default rootReducer;
