import { AppInitialState } from "../AppInitialState";
import { LoginState } from "./LoginState"
import { recoverPassword, recoverPasswordFail, recoverPasswordSuccess } from "./login.actions"
import { loginReducer } from "./login.reducers"

describe("Login store", () => {

    it("recoverPassword"), () => {
        const initialState: LoginState = AppInitialState.login;
        
        const newState = loginReducer(initialState, recoverPassword());
        expect(newState).toEqual({
            ...initialState,
            error : null,
            isRecoverdPassword: false,
            isRecoveringPassword: true,
        });
    };

    it("recoverPasswordSuccess"), () => {
        const initialState: LoginState = AppInitialState.login;
        
        const newState = loginReducer(initialState, recoverPasswordSuccess());
        expect(newState).toEqual({
            ...initialState,
            error : null,
            isRecoverdPassword: false,
            isRecoveringPassword: true,
        })
    }

    it("recoverPasswordSuccessFail"), () => {
        const initialState: LoginState = AppInitialState.login;
        
        const error = {error : "error"};
        const newState = loginReducer(initialState, recoverPasswordFail({error}));
        expect(newState).toEqual({
            ...initialState,
            error : null,
            isRecoverdPassword: false,
            isRecoveringPassword: false,
        })
    }
})