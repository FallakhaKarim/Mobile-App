import { Action, createReducer, on } from "@ngrx/store";
import { LoginState } from "./LoginState";
import { recoverPassword, recoverPasswordFail, recoverPasswordSuccess } from "./login.actions";
import { AppInitialState } from "../AppInitialState";

const initialState: LoginState = AppInitialState.login;

const reducer =createReducer(initialState,
    on(recoverPassword, currentstate => {
        return{
            ...currentstate,
            error : null,
            isRecoverdPassword : false,
            isRecoveringPassword : true
        };
    }),

    on(recoverPasswordSuccess, currentstate => {
        return{
            ...currentstate,
            error : null,
            isRecoverdPassword: true ,
            isRecoveringPassword: false ,
        };
    }),

    on(recoverPasswordFail, (currentstate, action) => {
        return {
            ...currentstate,
            error : action.error,
            isRecoverdPassword: false,
            isRecoveringPassword: false,
        };
    })
)

export function loginReducer(state: LoginState, action: Action) {
    return reducer(state, action)
}