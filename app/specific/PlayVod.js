//Variable initialization
var PlayVod_quality = 'Auto';
var PlayVod_qualityPlaying = PlayVod_quality;

var PlayVod_state = 0;

var PlayVod_streamInfoTimerId = null;
var PlayVod_tokenResponse = 0;
var PlayVod_playlistResponse = 0;
var PlayVod_playingTry = 0;

var PlayVod_playingUrl = '';
var PlayVod_qualities = [];
var PlayVod_qualityIndex = 0;

var PlayVod_loadingDataTry = 0;
var PlayVod_loadingDataTryMax = 5;
var PlayVod_isOn = false;
var PlayVod_Buffer = 2000;

var PlayVod_loadingInfoDataTry = 0;
var PlayVod_loadingInfoDataTryMax = 5;
var PlayVod_loadingInfoDataTimeout = 10000;

var PlayVod_PlayerTime = 0;
var PlayVod_streamCheckId = null;
var PlayVod_PlayerCheckCount = 0;
var PlayVod_PlayerCheckQualityChanged = false;
var PlayVod_PlayerCheckCounter = 0;
var PlayVod_PlayerCheckRun = false;

var Play_jumping = false;
var PlayVod_SizeClearID;
var PlayVod_updateStreamInfId;
var PlayVod_addToJump = 0;
var PlayVod_IsJumping = false;
var PlayVod_jumpCount = 0;
var PlayVod_loadingDataTimeout = 2000;
var PlayVod_qualitiesFound = false;
var PlayVod_currentTime = 0;
var PlayVod_VodIds = {};
var PlayVod_VodPositions = 0;
var PlayVod_PanelY = 0;
var PlayVod_ProgressBaroffset = 0;
var PlayVod_StepsCount = 0;
var PlayVod_TimeToJump = 0;
var PlayVod_replay = false;
var PlayVod_jumpTimers = [0, 10, 30, 60, 120, 300, 600, 900, 1200, 1800];

var PlayVod_RefreshProgressBarrID;
var PlayVod_SaveOffsetId;
var PlayVod_WasSubChekd = false;
//Variable initialization end

function PlayVod_Start() {
    Play_showBufferDialog();
    Play_HideEndDialog();
    PlayVod_currentTime = 0;
    Main_textContent("stream_live_time", '');
    Main_textContent("stream_watching_time", '');
    Main_textContent('progress_bar_current_time', Play_timeS(0));
    Chat_title = STR_PAST_BROA + '.';
    Main_innerHTML('pause_button', '<div style="transform: translateY(10%);"><i class="pause_button3d icon-pause"></i> </div>');
    Main_HideElement('progress_pause_holder');
    Main_ShowElement('progress_bar_div');

    //past broadcast
    document.getElementById('controls_' + 3).style.display = 'none';
    Play_CurrentSpeed = 3;

    PlayVod_StepsCount = 0;
    Play_DefaultjumpTimers = PlayVod_jumpTimers;
    PlayVod_jumpSteps(Play_DefaultjumpTimers[1]);
    PlayVod_state = Play_STATE_LOADING_TOKEN;
    PlayClip_HasVOD = true;
    ChannelVod_vodOffset = 0;
    Main_values.Play_isHost = false;
    PlayClip_HideShowNext(0, 0);
    PlayClip_HideShowNext(1, 0);

    if (Main_values.vodOffset) { // this is a vod comming from a clip or from restore playback
        PlayVod_PrepareLoad();
        PlayVod_updateVodInfo();
    } else {
        PlayVod_PrepareLoad();
        PlayVod_updateStreamerInfo();
        Main_textContent("stream_info_name", Main_values.Main_selectedChannelDisplayname);
        Main_innerHTML("stream_info_title", '');
        Main_innerHTML("stream_info_game", ChannelVod_views + ' [' + (ChannelVod_language).toUpperCase() + ']');
        Main_textContent("stream_live_icon", ChannelVod_createdAt);

        Main_replaceClassEmoji('stream_info_game');
    }

    if (PlayVod_VodIds['#' + Main_values.ChannelVod_vodId] && !Main_values.vodOffset) {
        Play_HideBufferDialog();
        Play_showVodDialog();
    } else {
        PlayVod_PosStart();
    }
}

function PlayVod_PosStart() {
    window.setTimeout(function() {
        Main_ShowElement('controls_holder');
        Main_ShowElement('progress_pause_holder');
    }, 1000);
    Main_textContent('progress_bar_duration', Play_timeS(ChannelVod_DurationSeconds));

    Main_values.Play_WasPlaying = 2;
    Main_SaveValues();

    PlayVod_SaveOffsetId = window.setInterval(PlayVod_SaveOffset, 60000);
    new Image().src = Play_IncrementView;

    PlayVod_PlayerCheckCounter = 0;
    PlayVod_PlayerCheckCount = 0;
    window.clearInterval(PlayVod_streamCheckId);
    PlayVod_PlayerCheckRun = false;
    Play_PlayerPanelOffset = -13;
    PlayVod_qualitiesFound = false;
    Play_IsWarning = false;
    PlayVod_jumpCount = 0;
    PlayVod_IsJumping = false;
    PlayVod_tokenResponse = 0;
    PlayVod_playlistResponse = 0;
    PlayVod_playingTry = 0;
    document.addEventListener('visibilitychange', PlayVod_Resume, false);
    Play_jumping = false;
    PlayVod_isOn = true;
    PlayVod_WasSubChekd = false;
    PlayVod_loadData();
    Play_EndSet(2);
    document.body.removeEventListener("keyup", Main_handleKeyUp);
}

function PlayVod_PrepareLoad() {
    PlayVod_loadingInfoDataTry = 0;
    PlayVod_loadingInfoDataTryMax = 5;
    PlayVod_loadingInfoDataTimeout = 10000;
}

function PlayVod_updateStreamerInfo() {
    var theUrl = 'https://api.twitch.tv/kraken/users?login=' + encodeURIComponent(Main_values.Main_selectedChannel);
    BasexmlHttpGet(theUrl, PlayVod_loadingInfoDataTimeout, 2, null, PlayVod_updateStreamerInfoValues, PlayVod_updateStreamerInfoError, false);
}

function PlayVod_updateStreamerInfoValues(musers) {
    musers = JSON.parse(musers).users[0];
    if (musers !== undefined) {
        Main_values.Main_selectedChannelLogo = musers.logo;
        Main_values.Main_selectedChannel_id = musers._id;

        //The chat init will happens after user click on vod dialog
        if (!PlayVod_VodIds['#' + Main_values.ChannelVod_vodId]) Chat_Init();

        if (AddUser_UserIsSet()) {
            AddCode_Channel_id = Main_values.Main_selectedChannel_id;
            AddCode_PlayRequest = true;
            AddCode_CheckFallow();
        } else Play_hideFallow();
    } else {
        Main_values.Main_selectedChannelLogo = IMG_404_LOGO;
        Main_values.Main_selectedChannel_id = '';
    }
    Play_LoadLogo(document.getElementById('stream_info_icon'), Main_values.Main_selectedChannelLogo);

}

function PlayVod_updateStreamerInfoError() {
    PlayVod_loadingInfoDataTry++;
    if (PlayVod_loadingInfoDataTry < PlayVod_loadingInfoDataTryMax) {
        PlayVod_loadingInfoDataTimeout += 500;
        window.setTimeout(function() {
            if (PlayVod_isOn) PlayVod_updateStreamerInfo();
        }, 750);
    } else PlayVod_updateStreamInfId = window.setTimeout(PlayVod_updateStreamerInfo, 2500);
}

function PlayVod_updateVodInfo() {
    var theUrl = 'https://api.twitch.tv/kraken/videos/' + Main_values.ChannelVod_vodId;
    BasexmlHttpGet(theUrl, PlayVod_loadingInfoDataTimeout, 2, null, PlayVod_updateVodInfoPannel, PlayVod_updateVodInfoError, false);
}

function PlayVod_updateVodInfoError() {
    PlayVod_loadingInfoDataTry++;
    if (PlayVod_loadingInfoDataTry < PlayVod_loadingInfoDataTryMax) {
        PlayVod_loadingInfoDataTimeout += 2000;
        PlayVod_updateVodInfo();
    }
}

function PlayVod_updateVodInfoPannel(response) {
    response = JSON.parse(response);

    //TODO add a warning about muted segments
    //if (response.muted_segments) console.log(response.muted_segments);

    Main_innerHTML("stream_info_title", twemoji.parse(response.title, false, true));
    Main_innerHTML("stream_info_game", (response.game !== "" && response.game !== null ? STR_STARTED + STR_PLAYING + response.game : "") +
        ' ' + Main_addCommas(response.views) + STR_VIEWS + ' [' + (response.channel.broadcaster_language).toUpperCase() + ']');
    Main_textContent("stream_live_icon", STR_STREAM_ON + Main_videoCreatedAt(response.created_at));

    ChannelVod_DurationSeconds = parseInt(response.length);
    Main_textContent('progress_bar_duration', Play_timeS(ChannelVod_DurationSeconds));

    PlayVod_currentTime = Main_values.vodOffset * 1000;
    PlayVod_ProgresBarrUpdate(Main_values.vodOffset, ChannelVod_DurationSeconds, true);

    Main_values.Main_selectedChannelDisplayname = response.channel.display_name;
    Main_textContent("stream_info_name", Main_values.Main_selectedChannelDisplayname);

    Main_values.Main_selectedChannelLogo = response.channel.logo;
    Play_LoadLogo(document.getElementById('stream_info_icon'), Main_values.Main_selectedChannelLogo);

    Main_values.Main_selectedChannel_id = response.channel._id;
    Main_values.Main_selectedChannel = response.channel.name;

    if (AddUser_UserIsSet()) {
        AddCode_PlayRequest = true;
        AddCode_Channel_id = Main_values.Main_selectedChannel_id;
        AddCode_CheckFallow();
    } else Play_hideFallow();
    new Image().src = response.increment_view_count_url;
}

function PlayVod_Resume() {
    if (document.hidden) {
        if (Play_isEndDialogVisible()) {
            Play_CleanHideExit();
            Play_hideChat();
            PlayVod_shutdownStream();
        } else {
            PlayVod_SaveOffset();
            PlayVod_SaveVodIds();
            Play_ClearPlayer();
            window.clearInterval(PlayVod_streamCheckId);
            window.clearInterval(PlayVod_SaveOffsetId);
        }
    } else {
        PlayVod_isOn = true;
        Play_clearPause();
        if (PlayVod_isOn) {
            Play_showBufferDialog();
            Play_ResumeAfterOnlineCounter = 0;

            Play_ResumeAfterOnlineCounter = 0;

            //Get the time from android as it can save it more reliably
            try {
                Main_values.vodOffset = Android.getsavedtime() / 1000;
            } catch (e) {}
            if (navigator.onLine) PlayVod_ResumeAfterOnline();

            else Play_ResumeAfterOnlineId = window.setInterval(PlayVod_ResumeAfterOnline, 100);

            Play_EndSet(2);
            PlayVod_SaveOffsetId = window.setInterval(PlayVod_SaveOffset, 60000);
        }
    }
}

function PlayVod_ResumeAfterOnline() {
    if (navigator.onLine || Play_ResumeAfterOnlineCounter > 200) {
        window.clearInterval(Play_ResumeAfterOnlineId);
        PlayVod_state = Play_STATE_LOADING_TOKEN;
        PlayVod_loadData();
    }
    Play_ResumeAfterOnlineCounter++;
}

function PlayVod_SaveOffset() {
    Main_values.vodOffset = Main_Android ? (parseInt(Android.gettime() / 1000)) : 0;
    Main_SaveValues();
    Main_values.vodOffset = 0;
}


function PlayVod_loadData() {
    PlayVod_loadingDataTry = 0;
    PlayVod_loadingDataTimeout = 2000;
    PlayVod_loadDataRequest();
}

function PlayVod_loadDataRequest() {
    var theUrl;

    if (PlayVod_state === Play_STATE_LOADING_TOKEN) {
        theUrl = 'https://api.twitch.tv/api/vods/' + Main_values.ChannelVod_vodId + '/access_token?platform=_' +
            (AddUser_UserIsSet() && AddUser_UsernameArray[Main_values.Users_Position].access_token ? '&oauth_token=' +
                AddUser_UsernameArray[Main_values.Users_Position].access_token : '');
    } else {
        theUrl = 'https://usher.ttvnw.net/vod/' + Main_values.ChannelVod_vodId +
            '.m3u8?&nauth=' + encodeURIComponent(PlayVod_tokenResponse.token) + '&nauthsig=' + PlayVod_tokenResponse.sig +
            '&playlist_include_framerate=true&reassignments_supported=true&allow_source=true' +
            (Main_vp9supported ? '&preferred_codecs=vp09' : '');
        if (Main_Android) {
            try {
                Android.SetAuto(theUrl);
            } catch (e) {}
        }
    }

    BasehttpGet(theUrl, Play_loadingDataTimeout, 1, null, PlayVod_loadDataSuccess, PlayVod_loadDataError, false);
}

function PlayVod_loadDataError() {
    if (PlayVod_isOn) {
        var mjson;
        if (PlayVod_tokenResponse.token) mjson = JSON.parse(PlayVod_tokenResponse.token);
        if (mjson) {
            if (JSON.parse(PlayVod_tokenResponse.token).chansub.restricted_bitrates.length !== 0) {
                PlayVod_loadDataCheckSub();
                return;
            }
        }

        PlayVod_loadingDataTry++;
        if (PlayVod_loadingDataTry < PlayVod_loadingDataTryMax) {
            PlayVod_loadingDataTimeout += 250;
            PlayVod_loadDataRequest();
        } else {
            if (!Main_isBrowser) {
                Play_HideBufferDialog();
                Play_PlayEndStart(2);
            } else PlayVod_loadDataSuccessFake();
        }
    }
}

//Browsers crash trying to get the streams link
function PlayVod_loadDataSuccessFake() {
    PlayVod_qualities = [{
        'id': '1080p60(Source)',
        'band': '(10.00Mbps)',
        'url': 'http://fake'
    }];
    PlayVod_state = Play_STATE_PLAYING;
    if (PlayVod_isOn) PlayVod_qualityChanged();
}

function PlayVod_loadDataSuccess(responseText) {
    if (PlayVod_state === Play_STATE_LOADING_TOKEN) {
        PlayVod_tokenResponse = JSON.parse(responseText);
        PlayVod_state = Play_STATE_LOADING_PLAYLIST;
        PlayVod_loadData();
    } else if (PlayVod_state === Play_STATE_LOADING_PLAYLIST) {
        PlayVod_playlistResponse = responseText;
        PlayVod_qualities = Play_extractQualities(PlayVod_playlistResponse);
        PlayVod_state = Play_STATE_PLAYING;
        if (PlayVod_isOn) PlayVod_qualityChanged();
    }
}

function PlayVod_loadDataCheckSub() {
    if (AddUser_UserIsSet() && AddUser_UsernameArray[Main_values.Users_Position].access_token) {
        AddCode_Channel_id = Main_values.Main_selectedChannel_id;
        AddCode_CheckSub();
    } else {
        Play_HideBufferDialog();
        Play_showWarningDialog(STR_IS_SUB_ONLY + STR_IS_SUB_NOOAUTH);
        window.setTimeout(function() {
            if (PlayVod_isOn) PlayVod_shutdownStream();
        }, 4000);
    }
}

function PlayVod_NotSub() {
    Play_HideBufferDialog();
    Play_showWarningDialog(STR_IS_SUB_ONLY + STR_IS_SUB_NOT_SUB);
    window.setTimeout(function() {
        if (PlayVod_isOn) PlayVod_shutdownStream();
    }, 4000);
}

function PlayVod_isSub() {
    if (!PlayVod_WasSubChekd) {
        // Do one more try before failing, because the access_token may be expired on the first treys
        // the PlayVod_loadData can't check if is expired, but the AddCode_RequestCheckSub can
        // and will refresh the token if it fail, so just to be shore run the PlayVod_loadData one more time
        PlayVod_WasSubChekd = true;
        PlayVod_state = Play_STATE_LOADING_TOKEN;
        PlayVod_loadData();
    } else {
        Play_HideBufferDialog();
        Play_showWarningDialog(STR_IS_SUB_ONLY + STR_IS_SUB_IS_SUB);
        window.setTimeout(function() {
            if (PlayVod_isOn) PlayVod_shutdownStream();
        }, 4000);
    }
}

function PlayVod_qualityChanged() {
    window.clearInterval(PlayVod_streamCheckId);
    PlayVod_qualityIndex = 0;
    PlayVod_playingUrl = PlayVod_qualities[0].url;
    if (PlayVod_quality.indexOf("source") !== -1) PlayVod_quality = "source";
    for (var i = 0; i < PlayVod_getQualitiesCount(); i++) {
        if (PlayVod_qualities[i].id === PlayVod_quality) {
            PlayVod_qualityIndex = i;
            PlayVod_playingUrl = PlayVod_qualities[i].url;
            break;
        } else if (PlayVod_qualities[i].id.indexOf(PlayVod_quality) !== -1) { //make shore to set a value before break out
            PlayVod_qualityIndex = i;
            PlayVod_playingUrl = PlayVod_qualities[i].url;
        }
    }

    PlayVod_qualityPlaying = PlayVod_quality;
    PlayVod_SetHtmlQuality('stream_quality', true);
    PlayVod_onPlayer();
}

function PlayVod_onPlayer() {
    if (Main_isDebug) console.log('PlayVod_onPlayer:', '\n' + '\n"' + PlayVod_playingUrl + '"\n');

    if (Main_Android) {
        if (Main_values.vodOffset) {
            Chat_offset = Main_values.vodOffset;
            Chat_Init();
            PlayVod_onPlayerStartPlay(Main_values.vodOffset * 1000);
            Main_values.vodOffset = 0;
        } else {
            PlayVod_onPlayerStartPlay(Android.gettime());
        }
    }

    PlayVod_replay = false;
    if (Play_ChatEnable && !Play_isChatShown()) Play_showChat();
    Play_SetFullScreen(Play_isFullScreen);

    if (Main_Android) {
        PlayVod_PlayerCheckCount = 0;
        Play_PlayerCheckTimer = 3 + ((PlayVod_Buffer / 1000) * 2);
        PlayVod_PlayerCheckQualityChanged = false;
        window.clearInterval(PlayVod_streamCheckId);
        PlayVod_streamCheckId = window.setInterval(PlayVod_PlayerCheck, Play_PlayerCheckInterval);
    }
}

function PlayVod_onPlayerStartPlay(time) {
    if (PlayVod_isOn) {
        if (PlayVod_quality.indexOf("Auto") !== -1) {
            try {
                Android.StartAuto(2, PlayVod_replay ? -1 : time);
            } catch (e) {
                Android.startVideoOffset(PlayVod_playingUrl, 2, PlayVod_replay ? -1 : time);
            }

        } else
            Android.startVideoOffset(PlayVod_playingUrl, 2, PlayVod_replay ? -1 : time);
    }
}

function PlayVod_UpdateDuration(duration) {
    ChannelVod_DurationSeconds = duration / 1000;
    Main_textContent('progress_bar_duration', Play_timeS(ChannelVod_DurationSeconds));
    PlayVod_RefreshProgressBarr();
}

function PlayVod_PlayerCheck() {
    if (Main_Android) PlayVod_currentTime = Android.gettime();

    //The player can bug and not stop playing when it ends after a video has be pause
    if ((PlayVod_currentTime / 1000) > ChannelVod_DurationSeconds) {
        //Make sure playWhenReady is false to avoid false calls on java onPlayerStateChanged
        if (Main_Android) Android.play(false);
        Play_PannelEndStart(2);
    }

    if (PlayVod_isOn && PlayVod_PlayerTime === PlayVod_currentTime && !Play_isNotplaying()) {
        PlayVod_PlayerCheckCount++;
        if (PlayVod_PlayerCheckCount > Play_PlayerCheckTimer) {

            //Don't change the first time only retry, and don't change if in Auto mode
            if (PlayVod_PlayerCheckQualityChanged && PlayVod_PlayerCheckRun &&
                (PlayVod_qualityIndex < PlayVod_getQualitiesCount() - 1) && (PlayVod_quality.indexOf("Auto") === -1))
                PlayVod_qualityIndex++;
            else if (!PlayVod_PlayerCheckQualityChanged && PlayVod_PlayerCheckRun) PlayVod_PlayerCheckCounter++;

            if (!navigator.onLine) Play_EndStart(false, 2);
            else if (PlayVod_PlayerCheckCounter > 1) Play_CheckConnection(PlayVod_PlayerCheckCounter, 2, PlayVod_DropOneQuality);
            else {
                PlayVod_qualityDisplay();
                PlayVod_qualityChanged();
                PlayVod_PlayerCheckRun = true;
            }

        } // else we try for too long let the listener onerror catch it
    } else {
        PlayVod_PlayerCheckCounter = 0;
        PlayVod_PlayerCheckCount = 0;
        PlayVod_PlayerCheckRun = false;
    }

    PlayVod_PlayerTime = PlayVod_currentTime;
}

function PlayVod_DropOneQuality(ConnectionDrop) {
    if (!ConnectionDrop) {
        if (PlayVod_qualityIndex < PlayVod_getQualitiesCount() - 1) PlayVod_qualityIndex++;
        else {
            Play_EndStart(false, 2);
            return;
        }
    }

    PlayVod_PlayerCheckCounter = 0;
    PlayVod_qualityDisplay();
    PlayVod_qualityChanged();
    PlayVod_PlayerCheckRun = true;
}

function PlayVod_shutdownStream() {
    if (PlayVod_isOn) {
        PlayVod_qualities = [];
        Play_qualitiesAuto = [];
        PlayVod_PreshutdownStream(true);
        Play_exitMain();
    }
}

function PlayVod_PreshutdownStream(saveOffset) {
    if (saveOffset) PlayVod_SaveVodIds();
    if (Main_Android) Android.stopVideo(2);
    PlayVod_isOn = false;
    window.clearInterval(PlayVod_SaveOffsetId);
    window.clearInterval(PlayVod_updateStreamInfId);
    Main_values.Play_WasPlaying = 0;
    Chat_Clear();
    UserLiveFeed_Hide();
    Play_ClearPlayer();
    PlayVod_ClearVod();
}

function PlayVod_ClearVod() {
    document.body.removeEventListener("keydown", PlayVod_handleKeyDown);
    document.removeEventListener('visibilitychange', PlayVod_Resume);
    Main_values.vodOffset = 0;
    window.clearInterval(PlayVod_streamInfoTimerId);
    window.clearInterval(PlayVod_streamCheckId);
    ChannelVod_DurationSeconds = 0;
}

function PlayVod_hidePanel() {
    PlayVod_jumpCount = 0;
    PlayVod_IsJumping = false;
    PlayVod_addToJump = 0;
    Play_clearHidePanel();
    document.getElementById("scene_channel_panel").style.opacity = "0";
    if (Main_Android) PlayVod_ProgresBarrUpdate((Android.gettime() / 1000), ChannelVod_DurationSeconds, true);
    Main_innerHTML('progress_bar_jump_to', STR_SPACE);
    document.getElementById('progress_bar_steps').style.display = 'none';
    PlayVod_quality = PlayVod_qualityPlaying;
    window.clearInterval(PlayVod_RefreshProgressBarrID);
}

function PlayVod_showPanel(autoHide) {
    PlayVod_RefreshProgressBarr(autoHide);
    Play_clock();
    Play_CleanHideExit();
    window.clearInterval(PlayVod_RefreshProgressBarrID);
    PlayVod_RefreshProgressBarrID = window.setInterval(PlayVod_RefreshProgressBarr, 1000);
    if (autoHide) {
        PlayVod_IconsBottonResetFocus();
        PlayVod_qualityIndexReset();
        PlayVod_qualityDisplay();
        if (PlayVod_qualityPlaying.indexOf("Auto") === -1) PlayVod_SetHtmlQuality('stream_quality', true);
        Play_clearHidePanel();
        Play_ResetSpeed();
        PlayVod_setHidePanel();
    }
    document.getElementById("scene_channel_panel").style.opacity = "1";
}

function PlayVod_RefreshProgressBarr(show) {
    if (Main_Android) PlayVod_ProgresBarrUpdate((Android.gettime() / 1000), ChannelVod_DurationSeconds, !PlayVod_IsJumping);

    if (PlayVod_qualityPlaying.indexOf("Auto") !== -1 && show) {
        try {
            var value = null;
            try {
                value = Android.getVideoQuality();
            } catch (e) {}
            if (value !== null) Play_getVideoQuality(value);
            else PlayVod_SetHtmlQuality('stream_quality', true);
        } catch (e) {
            PlayVod_SetHtmlQuality('stream_quality', true);

        }
    }
}

function PlayVod_IconsBottonResetFocus() {
    PlayVod_PanelY = 1;
    PlayClip_EnterPos = 0;
    PlayVod_IconsBottonFocus();
}

function PlayVod_IconsBottonFocus() {
    if (PlayVod_PanelY < 0) {
        PlayVod_PanelY = 0;
        return;
    }
    Main_RemoveClass('pause_button', 'progress_bar_div_focus');
    Main_RemoveClass('next_button', 'progress_bar_div_focus');
    Main_RemoveClass('back_button', 'progress_bar_div_focus');
    Main_RemoveClass('progress_bar_div', 'progress_bar_div_focus');

    if (!PlayVod_PanelY) { //progress_bar
        Main_AddClass('progress_bar_div', 'progress_bar_div_focus');
        Play_IconsRemoveFocus();
        if (PlayVod_addToJump) {
            PlayVod_jumpTime();
            document.getElementById('progress_bar_steps').style.display = 'inline-block';
        }
    } else if (PlayVod_PanelY === 1) { //pause/next/back buttons
        if (!PlayClip_EnterPos) { //pause
            Main_AddClass('pause_button', 'progress_bar_div_focus');
        } else if (PlayClip_EnterPos === 1) { //next
            Main_AddClass('next_button', 'progress_bar_div_focus');
        } else if (PlayClip_EnterPos === -1) { //back
            Main_AddClass('back_button', 'progress_bar_div_focus');
        }

        Play_IconsRemoveFocus();
        Main_innerHTML('progress_bar_jump_to', STR_SPACE);
        document.getElementById('progress_bar_steps').style.display = 'none';
    } else if (PlayVod_PanelY === 2) { //botton icons
        Play_IconsAddFocus();
        Main_innerHTML('progress_bar_jump_to', STR_SPACE);
        document.getElementById('progress_bar_steps').style.display = 'none';
    }
}

function PlayVod_setHidePanel() {
    Play_PanelHideID = window.setTimeout(PlayVod_hidePanel, 5000 + PlayVod_ProgressBaroffset); // time in ms
}

function PlayVod_qualityIndexReset() {
    PlayVod_qualityIndex = 0;
    for (var i = 0; i < PlayVod_getQualitiesCount(); i++) {
        if (PlayVod_qualities[i].id === PlayVod_quality) {
            PlayVod_qualityIndex = i;
            break;
        } else if (PlayVod_qualities[i].id.indexOf(PlayVod_quality) !== -1) { //make shore to set a value before break out
            PlayVod_qualityIndex = i;
        }
    }
}

function PlayVod_qualityDisplay() {
    if (PlayVod_getQualitiesCount() === 1) {
        document.getElementById("control_arrow_up_" + 6).style.opacity = "0";
        document.getElementById("control_arrow_down" + 6).style.opacity = "0";
    } else if (!PlayVod_qualityIndex) {
        document.getElementById("control_arrow_up_" + 6).style.opacity = "0.2";
        document.getElementById("control_arrow_down" + 6).style.opacity = "1";
    } else if (PlayVod_qualityIndex === PlayVod_getQualitiesCount() - 1) {
        document.getElementById("control_arrow_up_" + 6).style.opacity = "1";
        document.getElementById("control_arrow_down" + 6).style.opacity = "0.2";
    } else {
        document.getElementById("control_arrow_up_" + 6).style.opacity = "1";
        document.getElementById("control_arrow_down" + 6).style.opacity = "1";
    }

    PlayVod_SetHtmlQuality('controls_name_' + 6);
}

function PlayVod_SetHtmlQuality(element) {
    if (!PlayVod_qualities[PlayVod_qualityIndex].hasOwnProperty('id')) return;

    PlayVod_quality = PlayVod_qualities[PlayVod_qualityIndex].id;

    var quality_string = '';
    if (PlayVod_quality.indexOf('source') !== -1) quality_string = PlayVod_quality.replace("source", STR_SOURCE);
    else quality_string = PlayVod_quality;

    quality_string += PlayVod_quality.indexOf('Auto') === -1 ? PlayVod_qualities[PlayVod_qualityIndex].band + PlayVod_qualities[PlayVod_qualityIndex].codec : "";

    Main_textContent(element, quality_string);
}

function PlayVod_getQualitiesCount() {
    return PlayVod_qualities.length;
}

function PlayVod_ProgresBarrUpdate(current_time_seconds, duration_seconds, update_bar) {
    Main_textContent('progress_bar_current_time', Play_timeS(current_time_seconds));
    if (update_bar) Play_ProgresBarrElm.style.width = ((current_time_seconds / duration_seconds) * 100) + '%';
}

function PlayVod_jump() {
    Play_clearPause();
    if (!Play_isEndDialogVisible()) {

        PlayVod_PlayerCheckQualityChanged = false;
        PlayClip_PlayerCheckQualityChanged = false;

        if (PlayVod_isOn) {
            if (Main_Android) {
                if (PlayVod_quality.indexOf("Auto") !== -1) {
                    try {
                        Android.StartAuto(2,
                            (PlayVod_TimeToJump > 0) ? (PlayVod_TimeToJump * 1000) : -1);
                    } catch (e) {
                        Android.startVideoOffset(PlayVod_playingUrl, 2,
                            (PlayVod_TimeToJump > 0) ? (PlayVod_TimeToJump * 1000) : -1);
                    }
                } else Android.startVideoOffset(PlayVod_playingUrl, 2,
                    (PlayVod_TimeToJump > 0) ? (PlayVod_TimeToJump * 1000) : -1);
                Chat_offset = PlayVod_TimeToJump;
            }

        } else {
            Chat_offset = ChannelVod_vodOffset;
            if (Main_Android) Android.startVideoOffset(PlayClip_playingUrl, 3,
                (PlayVod_TimeToJump > 0) ? (PlayVod_TimeToJump * 1000) : -1);
        }

        if (PlayClip_HasVOD) Chat_Init();
    }
    Main_innerHTML('progress_bar_jump_to', STR_SPACE);
    document.getElementById('progress_bar_steps').style.display = 'none';
    Main_innerHTML('pause_button', '<div style="transform: translateY(10%);"><i class="pause_button3d icon-pause"></i> </div>');
    PlayVod_jumpCount = 0;
    PlayVod_IsJumping = false;
    PlayVod_addToJump = 0;
    PlayVod_TimeToJump = 0;
}

function PlayVod_SizeClear() {
    PlayVod_jumpCount = 0;
    PlayVod_StepsCount = 0;
    PlayVod_jumpSteps(Play_DefaultjumpTimers[1]);
}

function PlayVod_jumpSteps(duration_seconds) {
    if (PlayVod_addToJump && !PlayVod_PanelY) document.getElementById('progress_bar_steps').style.display = 'inline-block';
    if (Math.abs(duration_seconds) > 60)
        Main_textContent('progress_bar_steps', STR_JUMPING_STEP + (duration_seconds / 60) + STR_MINUTES);
    else if (duration_seconds)
        Main_textContent('progress_bar_steps', STR_JUMPING_STEP + duration_seconds + STR_SECONDS);
    else
        Main_textContent('progress_bar_steps', STR_JUMPING_STEP + Play_DefaultjumpTimers[1] + STR_SECONDS);
}

function PlayVod_jumpTime() {
    Main_textContent('progress_bar_jump_to', STR_JUMP_TIME + ' (' + (PlayVod_addToJump < 0 ? '-' : '') + Play_timeS(Math.abs(PlayVod_addToJump)) + ')' + STR_JUMP_T0 + Play_timeS(PlayVod_TimeToJump));
}

function PlayVod_jumpStart(multiplier, duration_seconds) {
    var currentTime = Main_Android ? (Android.gettime() / 1000) : 0;

    window.clearTimeout(PlayVod_SizeClearID);
    PlayVod_IsJumping = true;

    if (PlayVod_jumpCount < (Play_DefaultjumpTimers.length - 1) && (PlayVod_StepsCount++ % 6) === 0) PlayVod_jumpCount++;

    PlayVod_addToJump += Play_DefaultjumpTimers[PlayVod_jumpCount] * multiplier;
    PlayVod_TimeToJump = currentTime + PlayVod_addToJump;

    //hls jump/seek time in avplay is "10 base", jump/seek to 1:53:53 will jump to 1:53:50, round to show then
    if (PlayVod_isOn) PlayVod_TimeToJump = Math.floor(PlayVod_TimeToJump / 10) * 10;

    if (PlayVod_TimeToJump > duration_seconds) {
        PlayVod_addToJump = duration_seconds - currentTime - Play_DefaultjumpTimers[1];
        PlayVod_TimeToJump = currentTime + PlayVod_addToJump;
        PlayVod_jumpCount = 0;
        PlayVod_StepsCount = 0;
    } else if (PlayVod_TimeToJump < 0) {
        PlayVod_addToJump = 0 - currentTime;
        PlayVod_jumpCount = 0;
        PlayVod_StepsCount = 0;
        PlayVod_TimeToJump = 0;
    }

    PlayVod_jumpTime();
    Play_ProgresBarrElm.style.width = ((PlayVod_TimeToJump / duration_seconds) * 100) + '%';
    PlayVod_jumpSteps(Play_DefaultjumpTimers[PlayVod_jumpCount] * multiplier);

    PlayVod_SizeClearID = window.setTimeout(PlayVod_SizeClear, 1000);
}

function PlayVod_SaveVodIds() {
    var time = Main_Android ? (parseInt(Android.gettime() / 1000)) : 0;

    var vod_id = '#' + Main_values.ChannelVod_vodId; // prevent only numeric key, that makes the obj be shorted

    if (time > 300 && time < (ChannelVod_DurationSeconds - 300)) { //time too small don't save

        //delete before save to add this to the end, and prevent loose it in restorevodids
        if (PlayVod_VodIds[vod_id]) delete PlayVod_VodIds[vod_id];

        PlayVod_VodIds[vod_id] = time;
        Main_setItem('PlayVod_VodIds', JSON.stringify(PlayVod_VodIds));

    } else if (time > (ChannelVod_DurationSeconds - 300) && PlayVod_VodIds[vod_id]) {

        //if ended or almost delete
        delete PlayVod_VodIds[vod_id];

        Main_setItem('PlayVod_VodIds', JSON.stringify(PlayVod_VodIds));
    }
}

function PlayVod_RestoreVodIds() {
    PlayVod_VodIds = Main_getItemJson('PlayVod_VodIds', {});

    //Prevent too big obj in storage
    var size = PlayVod_VodIdsSize();
    if (size > 250) PlayVod_CleanVodIds(size - 250);
}

function PlayVod_VodIdsSize() {
    var size = 0;
    for (var key in PlayVod_VodIds) {
        if (PlayVod_VodIds.hasOwnProperty(key)) size++;
    }
    return size;
}

function PlayVod_CleanVodIds(quantity) {
    var position = 0;
    for (var key in PlayVod_VodIds) {
        if (position < quantity) delete PlayVod_VodIds[key];
        else break;
        position++;
    }
    Main_setItem('PlayVod_VodIds', JSON.stringify(PlayVod_VodIds));
}

function Play_showVodDialog() {
    Main_HideElement('controls_holder');
    PlayVod_showPanel(false);
    Main_textContent('stream_quality', '');
    Main_innerHTML("dialog_vod_saved_text", STR_FROM + Play_timeMs(PlayVod_VodIds['#' + Main_values.ChannelVod_vodId] * 1000));
    Main_ShowElement('dialog_vod_start');
}

function Play_HideVodDialog() {
    PlayVod_hidePanel();
    Main_HideElement('dialog_vod_start');
    PlayVod_IconsResetFocus();
    window.setTimeout(function() {
        Main_ShowElement('controls_holder');
    }, 1000);
}

function Play_isVodDialogShown() {
    return Main_isElementShowing('dialog_vod_start');
}

function PlayVod_IconsResetFocus() {
    PlayVod_IconsRemoveFocus();
    PlayVod_VodPositions = 0;
    PlayVod_IconsAddFocus();
}

function PlayVod_IconsAddFocus() {
    Main_AddClass('dialog_vod_' + PlayVod_VodPositions, 'dialog_end_icons_focus');
}

function PlayVod_IconsRemoveFocus() {
    Main_RemoveClass('dialog_vod_' + PlayVod_VodPositions, 'dialog_end_icons_focus');
}

function PlayVod_DialogPressed(fromStart) {
    Play_HideVodDialog();
    Play_showBufferDialog();
    Main_ready(function() {
        if (!fromStart) {
            Main_values.vodOffset = PlayVod_VodIds['#' + Main_values.ChannelVod_vodId];
            PlayVod_currentTime = Main_values.vodOffset * 1000;
            PlayVod_ProgresBarrUpdate(Main_values.vodOffset, ChannelVod_DurationSeconds, true);
            PlayVod_PosStart();
        } else {
            delete PlayVod_VodIds['#' + Main_values.ChannelVod_vodId];
            Main_values.vodOffset = 0;
            PlayVod_Start();
        }
    });
}

function PlayVod_handleKeyDown(e) {
    if (PlayVod_state !== Play_STATE_PLAYING && !Play_isVodDialogShown()) {
        switch (e.keyCode) {
            case KEY_RETURN:
                if (Play_ExitDialogVisible()) {
                    Play_CleanHideExit();
                    PlayVod_shutdownStream();
                } else {
                    Play_showExitDialog();
                }
                break;
            default:
                break;
        }
    } else {
        switch (e.keyCode) {
            case KEY_LEFT:
                if (UserLiveFeed_isFeedShow()) {
                    if (Play_FeedPos && !UserLiveFeed_loadingData) {
                        UserLiveFeed_FeedRemoveFocus();
                        Play_FeedPos--;
                        UserLiveFeed_FeedAddFocus();
                    }
                } else if (Play_isFullScreen && !Play_isPanelShown() && Play_isChatShown()) {
                    Play_ChatPositions++;
                    Play_ChatPosition();
                    Play_controls[Play_controlsChatPos].defaultValue = Play_ChatPositions;
                    Play_controls[Play_controlsChatPos].setLable();
                } else if (Play_isPanelShown() && !Play_isVodDialogShown()) {
                    Play_clearHidePanel();
                    if (PlayVod_PanelY === 2) Play_BottomLeftRigt(2, -1);
                    else if (!PlayVod_PanelY) {
                        PlayVod_jumpStart(-1, ChannelVod_DurationSeconds);
                        PlayVod_ProgressBaroffset = 2500;
                    }
                    PlayVod_setHidePanel();
                } else if (Play_isVodDialogShown()) {
                    PlayVod_IconsRemoveFocus();
                    if (PlayVod_VodPositions) PlayVod_VodPositions--;
                    else PlayVod_VodPositions++;
                    PlayVod_IconsAddFocus();
                } else if (Play_isEndDialogVisible()) {
                    Play_EndTextClear();
                    Play_EndIconsRemoveFocus();
                    Play_Endcounter--;
                    if (Play_Endcounter < 0) Play_Endcounter = 3;
                    if (Play_Endcounter === 1) Play_Endcounter = 0;
                    Play_EndIconsAddFocus();
                } else if (!Play_isVodDialogShown()) PlayVod_showPanel(true);
                break;
            case KEY_RIGHT:
                if (UserLiveFeed_isFeedShow()) {
                    if (Play_FeedPos < (UserLiveFeed_GetSize() - 1) && !UserLiveFeed_loadingData) {
                        UserLiveFeed_FeedRemoveFocus();
                        Play_FeedPos++;
                        UserLiveFeed_FeedAddFocus();
                    }
                } else if (Play_isFullScreen && !Play_isPanelShown() && !Play_isEndDialogVisible()) {
                    if (!Play_isChatShown() && !Play_isEndDialogVisible()) {
                        Play_showChat();
                        Play_ChatEnable = true;
                    } else {
                        Play_hideChat();
                        Play_ChatEnable = false;
                    }
                    Main_setItem('ChatEnable', Play_ChatEnable ? 'true' : 'false');
                } else if (Play_isPanelShown() && !Play_isVodDialogShown()) {
                    Play_clearHidePanel();
                    if (PlayVod_PanelY === 2) Play_BottomLeftRigt(2, 1);
                    else if (!PlayVod_PanelY) {
                        PlayVod_jumpStart(1, ChannelVod_DurationSeconds);
                        PlayVod_ProgressBaroffset = 2500;
                    }
                    PlayVod_setHidePanel();
                } else if (Play_isVodDialogShown()) {
                    PlayVod_IconsRemoveFocus();
                    if (PlayVod_VodPositions) PlayVod_VodPositions--;
                    else PlayVod_VodPositions++;
                    PlayVod_IconsAddFocus();
                } else if (Play_isEndDialogVisible()) {
                    Play_EndTextClear();
                    Play_EndIconsRemoveFocus();
                    Play_Endcounter++;
                    if (Play_Endcounter > 3) Play_Endcounter = 0;
                    if (Play_Endcounter === 1) Play_Endcounter = 2;
                    Play_EndIconsAddFocus();
                } else if (!Play_isVodDialogShown()) PlayVod_showPanel(true);
                break;
            case KEY_UP:
                if (Play_isEndDialogVisible()) Play_EndTextClear();
                else if (Play_isPanelShown() && !Play_isVodDialogShown()) {
                    Play_clearHidePanel();
                    if (PlayVod_PanelY < 2) {
                        PlayVod_PanelY--;
                        PlayVod_IconsBottonFocus();
                    } else Play_BottomUpDown(2, 1);
                    PlayVod_setHidePanel();
                } else if (!UserLiveFeed_isFeedShow()) UserLiveFeed_ShowFeed();
                else if (UserLiveFeed_isFeedShow()) UserLiveFeed_FeedRefreshFocus();
                else if (!Play_isVodDialogShown()) PlayVod_showPanel(true);
                break;
            case KEY_DOWN:
                if (Play_isEndDialogVisible()) Play_EndTextClear();
                else if (Play_isPanelShown() && !Play_isVodDialogShown()) {
                    Play_clearHidePanel();
                    if (PlayVod_PanelY < 2) {
                        PlayVod_PanelY++;
                        PlayVod_IconsBottonFocus();
                    } else Play_BottomUpDown(2, -1);
                    PlayVod_setHidePanel();
                } else if (UserLiveFeed_isFeedShow()) UserLiveFeed_Hide();
                else if (Play_isFullScreen && Play_isChatShown()) {
                    Play_ChatSizeValue++;
                    if (Play_ChatSizeValue > 3) {
                        Play_ChatSizeValue = 0;
                        Play_ChatPositionConvert(false);
                    } else if (Play_ChatSizeValue === 3) Play_ChatPositionConvert(true);
                    Play_ChatSize(true);
                    Play_controls[Play_controlsChatSize].defaultValue = Play_ChatSizeValue;
                    Play_controls[Play_controlsChatSize].bottomArrows();
                    Play_controls[Play_controlsChatSize].setLable();
                } else if (!Play_isVodDialogShown()) PlayVod_showPanel(true);
                break;
            case KEY_ENTER:
                if (Play_isVodDialogShown()) PlayVod_DialogPressed(PlayVod_VodPositions);
                else if (Play_isEndDialogVisible()) Play_EndDialogPressed(2);
                else if (Play_isPanelShown()) {
                    Play_clearHidePanel();
                    if (!PlayVod_PanelY) {
                        if (PlayVod_addToJump) PlayVod_jump();
                    } else if (PlayVod_PanelY === 1) {
                        if (Main_values.Play_ChatForceDisable) {
                            if (Play_isNotplaying()) Chat_Play(Chat_Id);
                            else Chat_Pause();
                        }
                        if (!Play_isEndDialogVisible()) Play_KeyPause(2);
                    } else Play_BottomOptionsPressed(2);
                    PlayVod_setHidePanel();
                } else if (UserLiveFeed_isFeedShow()) {
                    PlayVod_PreshutdownStream(true);
                    Main_OpenLiveStream(Play_FeedPos, UserLiveFeed_ids, Play_handleKeyDown);
                } else PlayVod_showPanel(true);
                break;
            case KEY_RETURN:
                Play_KeyReturn(true);
                break;
            case KEY_PLAY:
            case KEY_PAUSE:
            case KEY_PLAYPAUSE:
                if (Main_values.Play_ChatForceDisable) {
                    if (Play_isNotplaying()) Chat_Play(Chat_Id);
                    else Chat_Pause();
                }
                if (!Play_isEndDialogVisible()) Play_KeyPause(2);
                break;
            default:
                break;
        }
    }
}