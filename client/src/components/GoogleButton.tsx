import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { GoogleLogin, GoogleLogout, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { AuthService } from './../services/AuthService';

interface IGoogleBtnProps {
    clientId: string;
}

interface IGoogleBtnState {
    isLoggedIn: boolean;
    accessToken: string;
}


export class GoogleBtn extends React.Component<IGoogleBtnProps, IGoogleBtnState> {
    constructor(props : IGoogleBtnProps) {
        super(props);

        this.state = {
            isLoggedIn: false,
            accessToken: ''
        };

        this.login = this.login.bind(this);
        this.handleLoginFailure = this.handleLoginFailure.bind(this);
        this.logout = this.logout.bind(this);
        this.handleLogoutFailure = this.handleLogoutFailure.bind(this);
    }

    private isOnlineReponse(object: any): object is GoogleLoginResponse {
        return 'accessToken' in object;
    }

    private async login (response : GoogleLoginResponse | GoogleLoginResponseOffline) : Promise<void>{

        console.log(JSON.stringify(response));
        if (!this.isOnlineReponse(response)) {
            return;
        }

        if (response.accessToken) {

            await new AuthService().login(response.tokenId);

            this.setState(state => ({
                isLoggedIn: true,
                accessToken: response.accessToken
            }));

        } else {
            console.log('no access token?')
        }
    }

  private logout () : void {
    this.setState(state => ({
        isLoggedIn: false,
      accessToken: ''
    }));
  }

    private handleLoginFailure (response : any) : void {
        alert('Failed to log in')
    }

    private handleLogoutFailure () : void {
        alert('Failed to log out')
    }

    render() {
        return (
        <div>
            { this.state.isLoggedIn ?
            <GoogleLogout
                clientId={ this.props.clientId }
                buttonText='Logout'
                onLogoutSuccess={ this.logout }
                onFailure={ this.handleLogoutFailure }
            >
            </GoogleLogout>: <GoogleLogin
                clientId={ this.props.clientId }
                buttonText='Login'
                onSuccess={ this.login }
                onFailure={ this.handleLoginFailure }
                cookiePolicy={ 'single_host_origin' }
                responseType='code,token'
            />
            }
        </div>
        )
    }
}