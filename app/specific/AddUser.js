//Variable initialization
var AddUser_loadingDataTry = 0;
var AddUser_loadingDataTryMax = 5;
var AddUser_loadingDataTimeout = 3500;
var AddUser_UsernameArray = [];
var AddUser_Username = null;
var AddUser_loadingData = false;
var AddUser_keyBoardOn = false;
//Variable initialization end

function AddUser_init() {
    Main_values.Main_Go = Main_addUser;
    Main_AddClass('top_bar_user', 'icon_center_focus');
    Main_HideWarningDialog();
    Main_AddUserInput.placeholder = STR_PLACEHOLDER_USER;
    Main_ShowElement('add_user_scroll');
    AddUser_inputFocus();
}

function AddUser_exit() {
    AddUser_RemoveinputFocus(false);
    document.body.removeEventListener("keydown", AddUser_handleKeyDown);
    document.body.removeEventListener("keydown", AddUser_KeyboardEvent);
    Main_RemoveClass('top_bar_user', 'icon_center_focus');
    Main_HideElement('add_user_scroll');
}

function AddUser_handleKeyDown(event) {
    if (AddUser_loadingData || AddUser_keyBoardOn || Main_values.Main_Go !== Main_addUser) return;
    switch (event.keyCode) {
        case KEY_RETURN:
            if (Main_isAboutDialogShown()) Main_HideAboutDialog();
            else if (Main_isControlsDialogShown()) Main_HideControlsDialog();
            else {
                if (AddUser_UsernameArray.length > 0 && Main_values.Main_Go !== Main_Users) Main_values.Main_Go = Main_values.Main_Before;
                else Main_values.Main_Go = Main_Live;
                AddUser_exit();
                Main_SwitchScreen();
            }
            break;
        case KEY_PLAY:
        case KEY_PAUSE:
        case KEY_PLAYPAUSE:
        case KEY_ENTER:
            AddUser_inputFocus();
            break;
        default:
            break;
    }
}

function AddUser_inputFocus() {
    document.body.removeEventListener("keydown", AddUser_handleKeyDown);
    document.body.addEventListener("keydown", AddUser_KeyboardEvent, false);
    Main_AddUserInput.placeholder = STR_PLACEHOLDER_USER;

    Main_AddUserInput.focus();
    AddUser_keyBoardOn = true;
}

function AddUser_removeEventListener() {
    if (Main_AddUserInput !== null) {
        var elClone = Main_AddUserInput.cloneNode(true);
        Main_AddUserInput.parentNode.replaceChild(elClone, Main_AddUserInput);
        Main_AddUserInput = document.getElementById("user_input");
    }
}

function AddUser_RemoveinputFocus(EnaKeydown) {
    Main_AddUserInput.blur();
    AddUser_removeEventListener();
    document.body.removeEventListener("keydown", AddUser_KeyboardEvent);
    Main_AddUserInput.placeholder = STR_PLACEHOLDER_PRESS + STR_PLACEHOLDER_USER;

    if (EnaKeydown) document.body.addEventListener("keydown", AddUser_handleKeyDown, false);
    AddUser_keyBoardOn = false;
}

function AddUser_KeyboardEvent(event) {
    if (AddUser_loadingData || Main_values.Main_Go !== Main_addUser) return;

    switch (event.keyCode) {
        case KEY_RETURN:
            if (Main_isAboutDialogShown()) Main_HideAboutDialog();
            else if (Main_isControlsDialogShown()) Main_HideControlsDialog();
            else {
                if (AddUser_UsernameArray.length > 0 && Main_values.Main_Go !== Main_Users) Main_values.Main_Go = Main_values.Main_Before;
                else Main_values.Main_Go = Main_Live;
                AddUser_exit();
                Main_SwitchScreen();
            }
            break;
        case KEY_KEYBOARD_DELETE_ALL:
            Main_AddUserInput.value = '';
            break;
        case KEY_KEYBOARD_DONE:
        case KEY_DOWN:
            if (Main_AddUserInput.value !== '' && Main_AddUserInput.value !== null) {

                AddUser_Username = Main_AddUserInput.value;

                if (!AddUser_UserCodeExist(AddUser_Username)) {
                    AddUser_loadingDataTry = 0;
                    AddUser_loadingDataTimeout = 3500;
                    AddUser_loadingData = true;
                    Main_HideElement('add_user_scroll');
                    Main_showLoadDialog();
                    AddUser_loadDataRequest();
                } else {
                    Main_HideLoadDialog();
                    Main_showWarningDialog(STR_USER + AddUser_Username + STR_USER_SET);
                    window.setTimeout(function() {
                        Main_HideWarningDialog();
                        AddUser_inputFocus();
                    }, 1500);
                }
            } else AddUser_inputFocus();
            break;
        case KEY_KEYBOARD_BACKSPACE:
            Main_AddUserInput.value = Main_AddUserInput.value.slice(0, -1);
            break;
        case KEY_KEYBOARD_SPACE:
            Main_AddUserInput.value += ' ';
            break;
        default:
            break;
    }
}

function AddUser_loadDataRequest() {
    var theUrl = 'https://api.twitch.tv/kraken/users?login=' + encodeURIComponent(AddUser_Username);

    BasehttpGet(theUrl, AddUser_loadingDataTimeout, 2, null, AddUser_loadDataRequestSuccess, AddUser_loadDataError);
}

function AddUser_loadDataRequestSuccess(response) {
    if (JSON.parse(response)._total) {
        Main_AddUserInput.value = '';
        document.body.removeEventListener("keydown", AddUser_handleKeyDown);
        AddUser_SaveNewUser(response);
    } else AddUser_loadDataNoUser();
}

function AddUser_loadDataError() {
    AddUser_loadingDataTry++;
    if (AddUser_loadingDataTry < AddUser_loadingDataTryMax) {
        AddUser_loadingDataTimeout += 500;
        AddUser_loadDataRequest();
    } else AddUser_loadDataNoUser();
}

function AddUser_loadDataNoUser() {
    AddUser_Username = null;
    Main_HideLoadDialog();
    Main_showWarningDialog(STR_USER_ERROR);
    window.setTimeout(function() {
        AddUser_init();
    }, 1000);
    AddUser_loadingData = false;
}

function AddUser_RestoreUsers() {
    AddUser_UsernameArray = Main_getItemJson('AddUser_UsernameArray', []);
    if (AddUser_UsernameArray.length > 0) {
        //Check and refresh all tokens at start
        for (var i = 0; i < AddUser_UsernameArray.length; i++)
            if (AddUser_UsernameArray[i].access_token) AddCode_CheckTokenStart(i);
    }
}

function AddUser_UserIsSet() {
    return AddUser_UsernameArray.length > 0;
}

function AddUser_SaveNewUser(responseText) {
    AddUser_Username = JSON.parse(responseText).users[0];
    AddUser_UsernameArray.push({
        'name': AddUser_Username.name,
        'id': AddUser_Username._id,
        'access_token': 0,
        'refresh_token': 0
    });

    AddUser_SaveUserArray();
    Users_status = false;
    AddUser_exit();
    Users_init();
    AddUser_loadingData = false;
}

function AddUser_removeUser(Position) {

    // remove the user
    var index = AddUser_UsernameArray.indexOf(AddUser_UsernameArray[Position]);
    if (index > -1) AddUser_UsernameArray.splice(index, 1);

    // restart users and smarthub
    if (AddUser_UsernameArray.length > 0) {
        Users_status = false;
        Users_init();
    } else AddUser_init();

    // reset localStorage usernames
    AddUser_SaveUserArray();
}

function AddUser_SaveUserArray() {
    Main_setItem('AddUser_UsernameArray', JSON.stringify(AddUser_UsernameArray));
}

function AddUser_UserMakeOne(Position) {
    AddUser_Username = AddUser_UsernameArray[0];
    AddUser_UsernameArray[0] = AddUser_UsernameArray[Position];
    AddUser_UsernameArray[Position] = AddUser_Username;
    Users_status = false;
    Users_init();
    AddUser_SaveUserArray();
    Main_values.Users_Position = 0;
}

function AddUser_UserCodeExist(user) {
    return AddUser_UsernameArray.indexOf(user) !== -1;
}

function AddUser_IsUserSet() {
    return AddUser_UsernameArray.length > 0;
}