import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth/auth.service';
import {KeyboardResize, Plugins} from '@capacitor/core';
import {Router} from '@angular/router';
import {AppRoutes} from '../../constants/constants';
import {forkJoin, of} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    @ViewChild('loginFormCard', {static: true}) loginCard: HTMLElement;

    private loginCardAnimation: any;

    showPassword = false;

    private loginForm: FormGroup = new FormGroup({
        email: new FormControl('test1@gmail.com', [Validators.required, Validators.email]),
        password: new FormControl('hello123', [Validators.required, Validators.min(8)])
    });

    constructor(
        private authService: AuthService,
        private router: Router,
    ) {
        Plugins.Device.getInfo().then((deviceInfo) => {
            if (deviceInfo.platform !== 'web') {
                Plugins.Keyboard.setResizeMode({mode: KeyboardResize.None});
                Plugins.Keyboard.addListener('keyboardWillShow', () => {
                    console.log('Keyboard Event');
                });
            }
        });

    }

    doLogin(): void {
        this.authService.loginWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password)
            .pipe(
                map((userCredential) => {
                    if (userCredential === null) {
                        return false;
                    }
                    this.authService.setUserCredentials(userCredential);
                    this.authService.setActiveUserStatus(true);
                }),
            )
            .subscribe({
                next: () => {
                    this.router.navigateByUrl(AppRoutes.TABS);
                },
                error: (err) => {
                    console.error(err);
                }
            });
    }

    togglePasswordFieldType(): void {
        this.showPassword = !this.showPassword;
    }

    ngOnInit(): void {
    }
}
