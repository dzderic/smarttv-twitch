//Variable initialization
var AddCode_loadingDataTry = 0;
var AddCode_loadingDataTryMax = 5;
var AddCode_loadingDataTimeout = 10000;
var AddCode_Code = 0;
var AddCode_IsFallowing = false;
var AddCode_IsSub = false;
var AddCode_PlayRequest = false;
var AddCode_Channel_id = '';

var AddCode_redirect_uri = 'https://fgl27.github.io/SmartTwitchTV/release/index.min.html';
var AddCode_client_secret = "elsu5d09k0xomu7cggx3qg5ybdwu7g";
var AddCode_UrlToken = 'https://id.twitch.tv/oauth2/token?';
//Variable initialization end

function AddCode_CheckNewCode(code) {
    Main_values.Users_Position = Main_values.Users_AddcodePosition;
    AddCode_Code = code;
    AddCode_TimeoutReset10();
    Main_showLoadDialog();
    AddCode_requestTokens();
}

function AddCode_refreshTokens(position, tryes, callbackFunc, callbackFuncNOK) {
    var xmlHttp = new XMLHttpRequest();

    var url = AddCode_UrlToken + 'grant_type=refresh_token&client_id=' +
        encodeURIComponent(Main_clientId) + '&client_secret=' + encodeURIComponent(AddCode_client_secret) +
        '&refresh_token=' + encodeURIComponent(AddUser_UsernameArray[position].refresh_token) +
        '&redirect_uri=' + AddCode_redirect_uri;

    xmlHttp.open("POST", url, true);
    xmlHttp.timeout = AddCode_loadingDataTimeout;
    xmlHttp.ontimeout = function() {};

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                AddCode_refreshTokensSucess(xmlHttp.responseText, position, callbackFunc);
            } else {
                if (JSON.parse(xmlHttp.responseText).message.indexOf('Invalid refresh token') !== -1) {
                    AddCode_requestTokensFailRunning();
                    if (callbackFuncNOK) callbackFuncNOK();
                } else AddCode_refreshTokensError(position, tryes, callbackFunc, callbackFuncNOK);
            }
        }
    };

    xmlHttp.send(null);
}

function AddCode_refreshTokensError(position, tryes, callbackFuncOK, callbackFuncNOK) {
    tryes++;
    if (tryes < 5) AddCode_refreshTokens(position, tryes, callbackFuncOK, callbackFuncNOK);
    else if (callbackFuncNOK) callbackFuncNOK();
}

function AddCode_refreshTokensSucess(responseText, position, callbackFunc) {
    var response = JSON.parse(responseText);

    if (AddCode_TokensCheckScope(response.scope)) {
        AddUser_UsernameArray[position].access_token = response.access_token;
        AddUser_UsernameArray[position].refresh_token = response.refresh_token;

        AddUser_SaveUserArray();
    } else AddCode_requestTokensFailRunning();

    if (callbackFunc) callbackFunc();
}

//Check if has all scopes, in canse they change
function AddCode_TokensCheckScope(scope) {
    if (scope.indexOf("user_read") === -1) return false;
    if (scope.indexOf("user_follows_edit") === -1) return false;
    if (scope.indexOf("user_subscriptions") === -1) return false;

    return true;
}

function AddCode_requestTokens() {

    var theUrl = AddCode_UrlToken + 'grant_type=authorization_code&client_id=' +
        encodeURIComponent(Main_clientId) + '&client_secret=' + encodeURIComponent(AddCode_client_secret) +
        '&code=' + encodeURIComponent(AddCode_Code) + '&redirect_uri=' + AddCode_redirect_uri;

    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open("POST", theUrl, true);
    xmlHttp.timeout = AddCode_loadingDataTimeout;
    xmlHttp.ontimeout = function() {};

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
                AddCode_requestTokensSucess(xmlHttp.responseText);
            } else AddCode_requestTokensError();
            return;
        }
    };

    xmlHttp.send(null);

    //BasehttpPost(theUrl, AddCode_loadingDataTimeout, 0, null, AddCode_requestTokensSucess, AddCode_requestTokensError, false);
}

function AddCode_requestTokensError() {
    AddCode_loadingDataTry++;
    if (AddCode_loadingDataTry < AddCode_loadingDataTryMax) {
        AddCode_requestTokens();
    } else AddCode_requestTokensFail();

}

function AddCode_requestTokensFail() {
    Main_HideLoadDialog();
    Main_showWarningDialog(STR_OAUTH_FAIL);
    window.setTimeout(function() {
        Main_HideWarningDialog();
        Main_newUsercode = 0;
        Main_SaveValues();
        Main_values.Main_Go = Main_Users;
        window.location = AddCode_redirect_uri;
    }, 4000);
    AddUser_UsernameArray[Main_values.Users_Position].access_token = 0;
    AddUser_UsernameArray[Main_values.Users_Position].refresh_token = 0;
    AddUser_SaveUserArray();
}

function AddCode_requestTokensFailRunning() {
    //Token fail remove it and warn
    Users_status = false;
    Main_HideLoadDialog();
    Main_showWarningDialog(STR_OAUTH_FAIL);
    AddUser_UsernameArray[Main_values.Users_Position].access_token = 0;
    AddUser_UsernameArray[Main_values.Users_Position].refresh_token = 0;
    AddUser_SaveUserArray();
    Main_SaveValues();
    window.setTimeout(Main_HideWarningDialog, 4000);
}

function AddCode_requestTokensSucess(responseText) {
    var response = JSON.parse(responseText);
    AddUser_UsernameArray[Main_values.Users_Position].access_token = response.access_token;
    AddUser_UsernameArray[Main_values.Users_Position].refresh_token = response.refresh_token;
    AddCode_TimeoutReset10();
    AddCode_CheckOauthToken();
}

function AddCode_CheckOauthToken() {

    var theUrl = 'https://api.twitch.tv/kraken?oauth_token=' +
        AddUser_UsernameArray[Main_values.Users_Position].access_token;

    BasehttpGet(theUrl, AddCode_loadingDataTimeout, 0, null, AddCode_CheckOauthTokenSucess, AddCode_CheckOauthTokenError);
}

function AddCode_CheckOauthTokenSucess(response) {
    var token = JSON.parse(response).token;
    if (token.user_name &&
        token.user_name.indexOf(AddUser_UsernameArray[Main_values.Users_Position].name) !== -1) {
        AddUser_SaveUserArray();
        Main_newUsercode = 0;
        Main_HideLoadDialog();
        Users_status = false;
        Main_values.Main_Go = Main_Users;
        Main_SaveValues();
        Main_showWarningDialog(STR_USER_CODE_OK);
        if (Main_Android) {
            //TODO remove the try after android app update has be releaased for some time
            try {
                Android.clearCookie();
            } catch (e) {}
        }
        window.setTimeout(function() {
            window.location = AddCode_redirect_uri;
        }, 3000);
    } else {
        AddUser_UsernameArray[Main_values.Users_Position].access_token = 0;
        AddUser_UsernameArray[Main_values.Users_Position].refresh_token = 0;
        Main_showWarningDialog(STR_OAUTH_FAIL_USER + AddUser_UsernameArray[Main_values.Users_Position].name);
        window.setTimeout(function() {
            Main_HideWarningDialog();
            Main_newUsercode = 0;
            Main_SaveValues();
            Main_values.Main_Go = Main_Users;
            window.location = AddCode_redirect_uri;
        }, 4000);
    }
    return;
}

function AddCode_CheckOauthTokenError() {
    AddCode_loadingDataTry++;
    if (AddCode_loadingDataTry < AddCode_loadingDataTryMax) {
        AddCode_loadingDataTimeout += 500;
        AddCode_CheckOauthToken();
    } else AddCode_requestTokensFail();
}

function AddCode_CheckFallow() {
    AddCode_TimeoutReset10();
    AddCode_IsFallowing = false;
    AddCode_RequestCheckFallow();
}

function AddCode_RequestCheckFallow() {
    var theUrl = 'https://api.twitch.tv/kraken/users/' + AddUser_UsernameArray[Main_values.Users_Position].id + '/follows/channels/' + AddCode_Channel_id;
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open("GET", theUrl, true);
    xmlHttp.timeout = AddCode_loadingDataTimeout;
    xmlHttp.setRequestHeader(Main_clientIdHeader, Main_clientId);
    xmlHttp.setRequestHeader(Main_AcceptHeader, Main_TwithcV5Json);
    xmlHttp.ontimeout = function() {};

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) { //yes
                AddCode_RequestCheckFallowOK();
            } else if (xmlHttp.status === 404) { //no
                AddCode_RequestCheckFallowNOK(xmlHttp.responseText);
            } else { // internet error
                AddCode_RequestCheckFallowError();
            }
        }
    };

    xmlHttp.send(null);
}

function AddCode_RequestCheckFallowOK() {
    AddCode_IsFallowing = true;
    if (AddCode_PlayRequest) Play_setFallow();
    else ChannelContent_setFallow();
}

function AddCode_RequestCheckFallowNOK(response) {
    if ((JSON.parse(response).error + '').indexOf('Not Found') !== -1) {
        AddCode_IsFallowing = false;
        if (AddCode_PlayRequest) Play_setFallow();
        else ChannelContent_setFallow();
    } else AddCode_RequestCheckFallowError();
}

function AddCode_RequestCheckFallowError() {
    AddCode_loadingDataTry++;
    if (AddCode_loadingDataTry < AddCode_loadingDataTryMax) {
        AddCode_loadingDataTimeout += 500;
        AddCode_RequestCheckFallow();
    } else {
        if (AddCode_PlayRequest) Play_setFallow();
        else ChannelContent_setFallow();
    }
}

function AddCode_Fallow() {
    AddCode_TimeoutReset10();
    AddCode_FallowRequest();
}

function AddCode_FallowRequest() {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open("PUT", 'https://api.twitch.tv/kraken/users/' + AddUser_UsernameArray[Main_values.Users_Position].id + '/follows/channels/' + AddCode_Channel_id, true);
    xmlHttp.timeout = AddCode_loadingDataTimeout;
    xmlHttp.setRequestHeader(Main_clientIdHeader, Main_clientId);
    xmlHttp.setRequestHeader(Main_AcceptHeader, Main_TwithcV5Json);
    xmlHttp.setRequestHeader('Authorization', 'OAuth ' + AddUser_UsernameArray[Main_values.Users_Position].access_token);
    xmlHttp.ontimeout = function() {};

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) { //success user now is fallowing the channel
                AddCode_IsFallowing = true;
                if (AddCode_PlayRequest) Play_setFallow();
                else ChannelContent_setFallow();
                return;
            } else if (xmlHttp.status === 401 || xmlHttp.status === 403) { //token expired
                AddCode_refreshTokens(Main_values.Users_Position, 0, AddCode_Fallow, null);
            } else {
                AddCode_FallowRequestError();
            }
        }
    };

    xmlHttp.send(null);
}

function AddCode_FallowRequestError() {
    AddCode_loadingDataTry++;
    if (AddCode_loadingDataTry < AddCode_loadingDataTryMax) {
        AddCode_loadingDataTimeout += 500;
        AddCode_FallowRequest();
    }
}

function AddCode_UnFallow() {
    AddCode_TimeoutReset10();
    AddCode_UnFallowRequest();
}

function AddCode_UnFallowRequest() {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open("DELETE", 'https://api.twitch.tv/kraken/users/' + AddUser_UsernameArray[Main_values.Users_Position].id + '/follows/channels/' + AddCode_Channel_id, true);
    xmlHttp.timeout = AddCode_loadingDataTimeout;
    xmlHttp.setRequestHeader(Main_clientIdHeader, Main_clientId);
    xmlHttp.setRequestHeader(Main_AcceptHeader, Main_TwithcV5Json);
    xmlHttp.setRequestHeader('Authorization', 'OAuth ' + AddUser_UsernameArray[Main_values.Users_Position].access_token);
    xmlHttp.ontimeout = function() {};

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 204) { //success user is now not fallowing the channel
                AddCode_IsFallowing = false;
                if (AddCode_PlayRequest) Play_setFallow();
                else ChannelContent_setFallow();
                return;
            } else if (xmlHttp.status === 401 || xmlHttp.status === 403) { //token expired
                AddCode_refreshTokens(Main_values.Users_Position, 0, AddCode_UnFallow, null);
            } else {
                AddCode_UnFallowRequestError();
            }
        }
    };

    xmlHttp.send(null);
}

function AddCode_UnFallowRequestError() {
    AddCode_loadingDataTry++;
    if (AddCode_loadingDataTry < AddCode_loadingDataTryMax) {
        AddCode_loadingDataTimeout += 500;
        AddCode_UnFallowRequest();
    }
}

function AddCode_CheckSub() {
    AddCode_TimeoutReset10();
    AddCode_IsSub = false;
    AddCode_RequestCheckSub();
}

function AddCode_TimeoutReset10() {
    AddCode_loadingDataTry = 0;
    AddCode_loadingDataTimeout = 10000;
}

function AddCode_RequestCheckSub() {
    var theUrl = 'https://api.twitch.tv/kraken/users/' + AddUser_UsernameArray[Main_values.Users_Position].id + '/subscriptions/' + AddCode_Channel_id;
    var xmlHttp;
    if (Main_Android) {

        xmlHttp = Android.mreadUrl(theUrl, AddCode_loadingDataTimeout, 3, AddUser_UsernameArray[Main_values.Users_Position].access_token);

        if (xmlHttp) xmlHttp = JSON.parse(xmlHttp);
        else {
            AddCode_RequestCheckSubError();
            return;
        }

        if (xmlHttp.status === 200) {
            AddCode_IsSub = true;
            PlayVod_isSub();
        } else if (xmlHttp.status === 422) {
            AddCode_IsSub = false;
            PlayVod_NotSub();
        } else if (xmlHttp.status === 404) {
            if ((JSON.parse(xmlHttp.responseText).error + '').indexOf('Not Found') !== -1) {
                AddCode_IsSub = false;
                PlayVod_NotSub();
                return;
            } else AddCode_RequestCheckSubError();
        } else if (xmlHttp.status === 401 || xmlHttp.status === 403) {
            AddCode_refreshTokens(Main_values.Users_Position, 0, AddCode_CheckSub, AddCode_RequestCheckSubfail);
        } else {
            AddCode_RequestCheckSubError();
        }

    } else {

        xmlHttp = new XMLHttpRequest();

        xmlHttp.open("GET", theUrl, true);
        xmlHttp.timeout = AddCode_loadingDataTimeout;
        xmlHttp.setRequestHeader(Main_clientIdHeader, Main_clientId);
        xmlHttp.setRequestHeader(Main_AcceptHeader, Main_TwithcV5Json);
        xmlHttp.setRequestHeader('Authorization', 'OAuth ' + AddUser_UsernameArray[Main_values.Users_Position].access_token);
        xmlHttp.ontimeout = function() {};

        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState === 4) {
                if (xmlHttp.status === 200) { //success yes user is a SUB
                    AddCode_IsSub = true;
                    PlayVod_isSub();
                } else if (xmlHttp.status === 422) { //channel does not have a subscription program
                    AddCode_IsSub = false;
                    PlayVod_NotSub();
                } else if (xmlHttp.status === 404) { //success no user is not a sub
                    if ((JSON.parse(xmlHttp.responseText).error + '').indexOf('Not Found') !== -1) {
                        AddCode_IsSub = false;
                        PlayVod_NotSub();
                        return;
                    } else AddCode_RequestCheckSubError();
                } else if (xmlHttp.status === 401 || xmlHttp.status === 403) { //token expired
                    AddCode_refreshTokens(Main_values.Users_Position, 0, AddCode_CheckSub, AddCode_RequestCheckSubfail);
                } else { // internet error
                    AddCode_RequestCheckSubError();
                }
            }
        };

        xmlHttp.send(null);
    }
}

function AddCode_RequestCheckSubError() {
    AddCode_loadingDataTry++;
    if (AddCode_loadingDataTry < AddCode_loadingDataTryMax) {
        AddCode_loadingDataTimeout += 500;
        AddCode_RequestCheckSub();
    } else AddCode_RequestCheckSubfail();
}

function AddCode_RequestCheckSubfail() {
    AddCode_IsSub = false;
    PlayVod_NotSub();
}

function AddCode_CheckTokenStart(position) {
    AddCode_TimeoutReset10();
    AddCode_CheckToken(position, 0);
}

function AddCode_CheckToken(position, tryes) {
    var theUrl = 'https://api.twitch.tv/kraken?oauth_token=' +
        AddUser_UsernameArray[position].access_token;

    var xmlHttp;

    if (Main_Android) {

        xmlHttp = Android.mreadUrl(theUrl, 3500, 0, null);

        if (xmlHttp) xmlHttp = JSON.parse(xmlHttp);
        else {
            AddCode_CheckTokenError(position, tryes);
            return;
        }

        if (xmlHttp.status === 200) {
            AddCode_CheckTokenSuccess(xmlHttp.responseText, position);
        } else if (xmlHttp.status === 400) { //token expired
            AddCode_TimeoutReset10();
            AddCode_refreshTokens(position, 0, null, null);
        } else {
            AddCode_CheckTokenError(position, tryes);
        }

    } else {

        xmlHttp = new XMLHttpRequest();

        xmlHttp.open("GET", theUrl, true);
        xmlHttp.timeout = 10000;
        xmlHttp.ontimeout = function() {};

        xmlHttp.onreadystatechange = function() {
            if (xmlHttp.readyState === 4) {
                if (xmlHttp.status === 200) {
                    AddCode_CheckTokenSuccess(xmlHttp.responseText, position);
                } else if (xmlHttp.status === 400) { //token expired
                    AddCode_TimeoutReset10();
                    AddCode_refreshTokens(position, 0, null, null);
                } else {
                    AddCode_CheckTokenError(position, tryes);
                }
            }
        };

        xmlHttp.send(null);
    }
}

function AddCode_CheckTokenSuccess(responseText, position) {
    var token = JSON.parse(responseText);
    if (!token.token.valid) {
        AddCode_TimeoutReset10();
        AddCode_refreshTokens(position, 0, null, null);
    } else {
        if (!AddCode_TokensCheckScope(token.token.authorization.scopes)) AddCode_requestTokensFailRunning();
    }
}

function AddCode_CheckTokenError(position, tryes) {
    tryes++;
    if (tryes < AddCode_loadingDataTryMax) AddCode_CheckToken(position, tryes);
}

function AddCode_FallowGame() {
    AddCode_TimeoutReset10();
    AddCode_RequestFallowGame();
}

function AddCode_RequestFallowGame() {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open("PUT", 'https://api.twitch.tv/api/users/' + AddUser_UsernameArray[Main_values.Users_Position].name +
        '/follows/games/' + encodeURIComponent(Main_values.Main_gameSelected) +
        '?oauth_token=' + AddUser_UsernameArray[Main_values.Users_Position].access_token, true);
    xmlHttp.timeout = 10000;
    xmlHttp.setRequestHeader(Main_clientIdHeader, Main_clientId);
    xmlHttp.ontimeout = function() {};

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) { //success we now fallow the game
                AGame_fallowing = true;
                AGame_setFallow();
                return;
            } else if (xmlHttp.status === 401 || xmlHttp.status === 403) { //token expired
                AddCode_refreshTokens(Main_values.Users_Position, 0, AddCode_FallowGame, null);
            } else { // internet error
                AddCode_FallowGameRequestError();
            }
        }
    };

    xmlHttp.send(null);
}

function AddCode_FallowGameRequestError() {
    AddCode_loadingDataTry++;
    if (AddCode_loadingDataTry < AddCode_loadingDataTryMax) {
        AddCode_loadingDataTimeout += 500;
        AddCode_RequestFallowGame();
    }
}

function AddCode_UnFallowGame() {
    AddCode_TimeoutReset10();
    AddCode_RequestUnFallowGame();
}

function AddCode_RequestUnFallowGame() {
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open("DELETE", 'https://api.twitch.tv/api/users/' + AddUser_UsernameArray[Main_values.Users_Position].name +
        '/follows/games/' + encodeURIComponent(Main_values.Main_gameSelected) + '?oauth_token=' +
        AddUser_UsernameArray[Main_values.Users_Position].access_token, true);
    xmlHttp.timeout = 10000;
    xmlHttp.setRequestHeader(Main_clientIdHeader, Main_clientId);
    xmlHttp.ontimeout = function() {};

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 204) { // success we now unfallow the game
                AGame_fallowing = false;
                AGame_setFallow();
                return;
            } else if (xmlHttp.status === 401 || xmlHttp.status === 403) { //token expired
                AddCode_refreshTokens(Main_values.Users_Position, 0, AddCode_UnFallowGame, null);
            } else { // internet error
                AddCode_UnFallowGameRequestError();
            }
        }
    };

    xmlHttp.send(null);
}

function AddCode_UnFallowGameRequestError() {
    AddCode_loadingDataTry++;
    if (AddCode_loadingDataTry < AddCode_loadingDataTryMax) {
        AddCode_loadingDataTimeout += 500;
        AddCode_RequestUnFallowGame();
    }
}

function AddCode_CheckFallowGame() {
    AddCode_TimeoutReset10();
    AddCode_RequestCheckFallowGame();
}

function AddCode_RequestCheckFallowGame() {
    var theUrl = 'https://api.twitch.tv/api/users/' + AddUser_UsernameArray[Main_values.Users_Position].name + '/follows/games/' + encodeURIComponent(Main_values.Main_gameSelected);
    var xmlHttp;
    xmlHttp = new XMLHttpRequest();

    xmlHttp.open("GET", theUrl, true);
    xmlHttp.timeout = 10000;
    xmlHttp.setRequestHeader(Main_clientIdHeader, Main_clientId);
    xmlHttp.ontimeout = function() {};

    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) { //success yes user fallows
                AGame_fallowing = true;
                AGame_setFallow();
                return;
            } else if (xmlHttp.status === 404) { //success no user doesnot fallows
                AGame_fallowing = false;
                AGame_setFallow();
                return;
            } else { // internet error
                AddCode_CheckFallowGameError();
                return;
            }
        }
    };

    xmlHttp.send(null);
}

function AddCode_CheckFallowGameError() {
    AddCode_loadingDataTry++;
    if (AddCode_loadingDataTry < AddCode_loadingDataTryMax) {
        AddCode_loadingDataTimeout += 500;
        AddCode_RequestCheckFallowGame();
    } else {
        AGame_fallowing = false;
        AGame_setFallow();
    }
}