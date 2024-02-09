import { FormBuilder } from "@angular/forms";
import { LoginPageForm } from "./login.page.form"

describe('LoginPageForm', () => {

    it('should create login from empty', () => {
        const loginPageForm = new LoginPageForm(new FormBuilder());
        const form = loginPageForm.createForm();

        expect(form).not.toBeNull();
        expect(form.get('email')).not.toBeNull();
        expect(form.get('email')?.value).toEqual("");
        expect(form.get('email')?.valid).toBeFalsy();
        expect(form.get('password')).not.toBeNull();
        expect(form.get('password')?.value).toEqual("");
        expect(form.get('password')?.valid).toBeFalsy();

    });
});