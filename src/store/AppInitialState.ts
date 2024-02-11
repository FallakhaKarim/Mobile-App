import { AppState } from "./AppState";

export const AppInitialState : AppState = {
    loading: {
        show : false
    },

    login: {
        error : null,
        isRecoverdPassword : false,
        isRecoveringPassword : false,
        isLoggedIn : false,
        isLogginIn : false,
    }
}