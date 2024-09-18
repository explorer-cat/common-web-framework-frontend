// Action Types
export const action = {
    modal : {},
    adminPage : {},
    toast : {},
};
export const MODAL = 'MODAL';
export const TOAST = 'TOAST';

// Action Creators
action.modal.setModal = (state) => {
    console.log("state",state)
    return {
        type: MODAL,
        state : state
    };
};

action.toast.setToast = (state) => {
    return {
        type : TOAST,
        state : state,
    }
}


