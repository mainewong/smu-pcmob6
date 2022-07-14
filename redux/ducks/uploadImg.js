export const ADD_PIC = "add_pic";

const initialState = {
    isDark: false,
    image: null,
}

export function uploadImgAction() {
    return {
      type: ADD_PIC
    }
}

export default function uploadImgReducer(state = initialState, action) {
    switch (action.type) {
    case ADD_PIC: 
      return { ...state, image: action.payload };
    default: 
      return state;
  }
}