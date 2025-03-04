function de_DELang() {
    // This is a false/true var change if in yours language day comes first eg (27/12/2010) day 27 month 12 year 2010
    Main_IsDayFirst = true;

    // this is the size of side pannel a ajust may be needed here so it can fit all words in the horizontal axis
    document.getElementById("side_panel").style.width = "21.5%";

    //Bellow are variable to translate
    STR_REFRESH = "Aktualisieren";
    STR_REFRESH_FEED = "Aktualisieren (hoch)";
    STR_SEARCH = "Suchen";
    STR_SETTINGS = "Einstellungen";
    STR_CONTROLS = "Steuerung";
    STR_ABOUT = "Über";
    STR_HIDE = "Ausblenden";
    STR_SEARCH_EMPTY = "Eingabe darf nicht leer sein.";
    STR_SEARCH_RESULT_EMPTY = "Die Suche ergab keine Treffer";
    STR_SWITCH = "Kategorie wechseln";
    STR_SWITCH_USER = "Benutzer wechseln";
    STR_SWITCH_VOD = "Frühere Übertragungen / Highlight";
    STR_SWITCH_CLIP = "Filter (24 Stunden, 7 Tage, 30 Tage, Alle)";
    STR_GO_TO = "Gehe zu ";
    STR_USER = "Benutzer ";
    STR_LIVE = "Live";
    STR_GAMES = "Spiele";
    STR_PLAYING = "Spielt ";
    STR_FOR = " für ";
    STR_WATCHING = "Dabei seit ";
    STR_SINCE = "Dauer ";
    STR_AGAME = "Spiel";
    STR_PLACEHOLDER_SEARCH = "Suchbegriff eingeben";
    STR_PLACEHOLDER_OAUTH = "Auth-Key eingeben";
    STR_PLACEHOLDER_USER = "Benutzernamen eingeben";
    STR_PLACEHOLDER_PRESS = "(Enter) drücken, ";
    STR_CHANNELS = "Kanäle";
    STR_CHANNEL = "Kanal";
    STR_GOBACK = "Zurück (Return)";
    STR_IS_OFFLINE = " wurde beendet";
    STR_IS_SUB_ONLY = "Dieses Video steht nur Abonnenten zur Verfügung.";
    STR_REFRESH_PROBLEM = "Fehler beim Laden, mit (Guide/Info) erneut versuchen.";
    STR_NO = "Nein";
    STR_FOR_THIS = " for this ";
    STR_PLAYER_PROBLEM = "Video konnte nicht geladen werden";
    STR_PAST_BROA = " Frühere Übertragungen";
    STR_PAST_HIGHL = " Highlight";
    STR_CLIPS = " Clips";
    STR_CONTENT = " Content";
    STR_STREAM_ON = "Gestreamt am ";
    STR_DURATION = "Länge ";
    STR_VIEWS = " Aufrufe";
    STR_VIEWER = " Zuschauer";
    STR_EXIT_AGAIN = "Zum Verlassen erneut (Return) drücken";
    STR_EXIT_MESSAGE = "Twitch beenden?";
    STR_EXIT = "Verlassen";
    STR_CLOSE = "Schließen";
    STR_MINIMIZE = "Minimieren";
    STR_CANCEL = "Abbrechen";
    STR_NOT_LIVE = "Not Live | ";
    STR_LIVE_CHANNELS = " Live Kanäle";
    STR_LIVE_HOSTS = " Hosts";
    STR_LIVE_GAMES = " Spiele";
    STR_USER_CHANNEL = " Gefolgte Kanäle";
    STR_USER_ADD = " Benutzer hinzufügen";
    STR_USER_REMOVE = " Benutzer entfernen";
    STR_USER_ERROR = "Benutzer nicht vorhanden";
    STR_USER_HOSTING = " hostet ";
    STR_USER_SET = " bereits als Hauptbenutzer festgelegt";
    STR_USER_MAKE_ONE = "Als Hauptbenutzer festlegen";
    STR_USER_NUMBER_ONE = " (Hauptbenutzer: Inhalt wird in der SmartHub-Vorschau angezeigt)";
    STR_ADD_USER_SH = "Benutzer hinzufügen um gefolgte Kanäle anzuzeigen";
    STR_CLIP_DAY = " (24 Stunden)";
    STR_CLIP_WEEK = " (7 Tage)";
    STR_CLIP_MONTH = " (30 Tage)";
    STR_CLIP_ALL = " (Alle)";
    STR_JUMP_TIME = "Springen";
    STR_JUMP_T0 = " zu ";
    STR_JUMP_CANCEL = "Springen abgebrochen";
    STR_JUMP_TIME_BIG = " , Zeitpunkt liegt über der Videolänge";
    STR_SEC = " Sek";
    STR_MIN = " Min";
    STR_HR = " Std";
    STR_SOURCE = "Quelle";
    STR_VERSION = "Version: ";
    STR_TWITCH_TV = "SmartTV Twitch";
    STR_CLOSE_THIS = "(Return) zum schließen";
    STR_PLAYER = "Player:";
    STR_CHAT = "Chat:";
    STR_GENERAL = "Allgemein:";
    STR_UPDATE = 'Update';
    STR_CURRENT_VERSION = "Installierte Version ";
    STR_LATEST_VERSION = " Neueste Version ";
    STR_CONTROLS_MAIN_1 = "Allgemeine Steuerung";
    STR_CONTROLS_MAIN_2 = "Navigation: (hoch/runter/links/rechts)";
    STR_CONTROLS_MAIN_3 = "Wiedergabe: (Enter/Play/Pause)";
    STR_CONTROLS_MAIN_4 = "Ansicht aktualisieren: (Guide/Info)";
    STR_CONTROLS_MAIN_5 = "Anwendung beenden: (Return)";
    STR_CONTROLS_MAIN_6 = "Anwendung beenden (erzwungen): (Return) gedrückt halten";
    STR_CONTROLS_MAIN_8 = "Kategorie wechseln: (Kanal auf) nach rechts, (Kanal ab) nach links";
    STR_CONTROLS_MAIN_9 = "Zurück zur Übersicht: (Grüne Taste [B])";
    STR_CONTROLS_MAIN_10 = "Anwendung neu laden: In der Übersicht (Grüne Taste [B])";
    STR_CONTROLS_MAIN_12 = "Suchen: (Blaue Taste [D]) oder über die Menüleiste";
    STR_CONTROLS_MAIN_13 = "Steuerung: (Gelbe Taste [C]) oder über die Menüleiste";
    STR_CONTROLS_MAIN_14 = "Menüleiste: (Rote Taste [A])";
    STR_CONTROLS_PLAY_1 = "Playerleiste anzeigen: (Enter)";
    STR_CONTROLS_PLAY_2 = "Wiedergabe beenden: Zwei Mal (Return)";
    STR_CONTROLS_PLAY_3 = "Play/Pause: (Play/Pause)";
    STR_CONTROLS_PLAY_4 = "Springe zu: (rechts/links) zum Suchen und mit (Enter) bestätigen";
    STR_CONTROLS_PLAY_5 = "Videoqualität: Einstellung in der Playerleiste markieren, mit (hoch/runter) die Qualität auswählen und mit (Enter) bestätigen";
    STR_CONTROLS_PLAY_6 = "Aktualisieren: Zwei Mal (Enter)";
    STR_CONTROLS_PLAY_7 = "Chatoverlay anzeigen/verbergen: (Guide/Info)";
    STR_CONTROLS_PLAY_8 = "Chatoverlay verschieben: (Kanal auf/Kanal ab)";
    STR_CONTROLS_PLAY_9 = "Chatoverlay Größe ändern: (runter)";
    STR_CONTROLS_PLAY_10 = "Chatoverlay Transparenz: (links/rechts)";
    STR_CONTROLS_PLAY_11 = "Chatoverlay aktualisieren: Zwei Mal (Enter)";
    STR_CONTROLS_PLAY_12 = "Suchen: (Blaue Taste [D]) oder über die Playerleiste";
    STR_CONTROLS_PLAY_13 = "Kanal oder Spiel öffnen: über die Playerleiste";
    STR_CONTROLS_PLAY_14 = "Video und Chat getrennt anzeigen: (Rote Taste [A])";
    STR_CONTROLS_PLAY_15 = "Chat deaktivieren: (Grüne Taste [B])";
    STR_UPDATE_AVAILABLE = "Update verfügbar, auf github prüfen ";
    STR_UPDATE_MAIN_0 = "ACHTUNG: Bei der Neuinstallation gehen alle gespeicherten Benutzer, Auth-Keys und Einstellungen verloren";
    STR_UPDATE_MAIN_1 = "Update verfügbar, die Anwendung kann dieses Update nicht automatisch durchführen ";
    STR_UPDATE_MAIN_2 = "Änderungen:";
    STR_UPDATE_MAIN_3 = "Verbesserung der Anwendungsstabilität";
    STR_OAUTH_IN = "Auth-Key hinzufügen ermöglicht: Folgen, Entfolgen, Anzeige früherer Übertragungen welche nur für Abonnenten abrufbar sind (Substatus notwendig). Auth-Key hinzufügen für: ";
    STR_OAUTH_EXPLAIN1 = " Anleitung:";
    STR_OAUTH_EXPLAIN2 = "Den Link link_link am PC oder Smartphone aufrufen";
    STR_OAUTH_EXPLAIN3 = "Auf \"Authorize\" klicken, Du wirst auf die Autorisierungsseite von Twitch.tv weitergeleitet";
    STR_OAUTH_EXPLAIN4 = "Bei twitch.tv anmelden";
    STR_OAUTH_EXPLAIN5 = "Autorisierung auf durchführen";
    STR_OAUTH_EXPLAIN6 = "Nach erfolgreicher Autorisierung wird der Auth-Key angezeigt";
    STR_USER_CODE = " Auth-Key hinzufügen";
    STR_USER_CODE_OK = "Auth-Key hinzugefügt [OK]";
    STR_KEY_BAD = "Auth-Key Test fehlgeschlagen, neue Autorisierung erforderlich";
    STR_KEY_OK = "Auth-Key Test [OK]";
    STR_OAUTH_WRONG = "Du versuchst einen Auth-Key für folgenden Benutzer einzugeben: ";
    STR_OAUTH_WRONG2 = " Jedoch ist der Key für den Benutzer: ";
    STR_FALLOWING = " Following";
    STR_FALLOW = " Folgen";
    STR_IS_SUB_NOOAUTH = " Kein Benutzer/Auth-Key angegeben.";
    STR_IS_SUB_NOT_SUB = " Du bist kein Abonnent dieses Kanals";
    STR_IS_SUB_IS_SUB = " Du bist Abonnent dieses Kanals, jedoch erkennt dies die Anwendung nicht? Bitte kontaktiere den Entwickler. Infos in der Menüleiste unter \"Über\" ";
    STR_OAUTH_FAIL = "Fehler: Der eingegebene Auth-Key stimmt nicht überein. Bitte überprüfen und erneut eingeben";
    STR_OAUTH_FAIL_USER = "Der eingegebene Auth-Key gehört nicht zu ";
    STR_NOKEY = "nicht angemeldet";
    STR_NOKEY_WARN = "Benutzer und Auth-Key eingeben um folgen/entfolgen zu können ";
    STR_RESET = "Neustarten";
    STR_CLIP = " Clip";
    STR_CHANNEL_CONT = "Kanal öffnen";
    STR_NET_DOWN = "Verbindungsproblem, die Anwendung benötigt eine Verbindung zum Internet.";
    STR_NET_UP = "Verbindung wieder hergestellt ";
    STR_FALLOWERS = " Followers";
    STR_CANT_FALLOW = ", nicht angemeldet (Folgen/Entfolgen nicht möglich)";
    STR_GAME_CONT = "Spielübersicht öffnen";
    STR_YES = "Ja";
    STR_REMOVE_USER = "Benutzer wirklich löschen? ";
    STR_PLACEHOLDER_PRESS_UP = "(hoch) für ";
    STR_FALLOW_GAMES = "Gefolgte Spiele";
    STR_USER_GAMES_CHANGE = "Wechseln zwischen";
    STR_GUIDE = " (Guide/Info)";
    STR_MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    STR_DAYS = ["Sonntag,", "Montag,", "Dienstag,", "Mittwoch,", "Donnerstag,", "Freitag,", "Samstag,"];
    STR_KEY_UP_DOWN = " (Kanal auf/Kanal ab)";
    STR_VIDEOS = "Videos";
    STR_VIDEO = " Video";
    STR_REPLAY = "Wiederholen";
    STR_STREAM_END = "Verlassen in ";
    STR_STREAM_END_EXIT = '(Return) zum Verlassen';
    STR_FEATURED = 'Featured';
    STR_CREATED_AT = "Erstellt am ";
    STR_OPEN_BROADCAST = "Übertragung wiedergeben";
    STR_NO_BROADCAST = "Keine Übertragung";
    STR_NO_BROADCAST_WARNING = "Keine frühere Übertragung zum Clip verfügbar. ";
    STR_NO_CHAT = "And because of that no chat";
    STR_IS_NOW = " is now";
    STR_OPEN_HOST = "Host wiedergeben";
    STR_SETTINGS_PLAYER = "Player";
    STR_SETTINGS_BUFFER_SIZE = "Buffergröße:";
    STR_SETTINGS_BUFFER_SIZE_SUMMARY = "Bei einem niedrigeren Wert wird das Video schneller gestartet, was jedoch erneutes Buffern verursachen kann.";
    STR_SETTINGS_BUFFER_LIVE = "Livestream";
    STR_SETTINGS_BUFFER_VOD = "Videos (Frühere Übertragungen / Highlights) ";
    STR_SETTINGS_BUFFER_CLIP = "Clips ";
    STR_SETTINGS_GENERAL = "Allgemein";
    STR_SETTINGS_LANG = "Sprache";
    STR_LOADING_CHAT = "Chat: Verbindung zum Server wird hergestellt" + STR_BR + "Chat: Verbunden" + STR_BR + "Chat: Kanal beigetreten ";
    STR_VOD_HISTORY = "Wiedergabezeitpunkt auswählen";
    STR_FROM = "Fortsetzen:" + STR_BR;
    STR_FROM_START = STR_FROM + "Von vorne";
    STR_CHAT_END = "Chat beendet";
    STR_TIME = ": Neueste";
    STR_VIWES = ": Aufrufe";
    STR_NOKEY_VIDEO_WARN = "Benutzer/Auth-Key benötigt um gefolgte Videos zu sehen";
    STR_SWITCH_TYPE = "Wechseln: Neueste/Aufrufe";
    STR_ENABLE = "Aktiviert";
    STR_DISABLE = "Deaktiviert";
    STR_RESTORE_PLAYBACK_WARN = "Die Anwendung wurde während der Wiedergabe geschlossen, Wiedergabe wird fortgesetzt";
    STR_RESTORE_PLAYBACK = "Wiedergabe fortsetzen";
    STR_RESTORE_PLAYBACK_SUMARRY = "Beim Start der Anwendung die Wiedergabe fortsetzen?";
    STR_CHAT_FONT = "Schriftgröße Chat";
    STR_CHAT_FONT_SUMARRY = "Wirkt sich auf die Textgröße und Emotes im Chat aus";
    STR_VIDEOS_ANIMATION = "Vorschaubildanimation bei Videos";
    STR_SIDE_PANEL = "Menüleiste";
    STR_SIZE = "Größe ";
    STR_BRIGHTNESS = "Transparenz ";
    STR_FORBIDDEN = "Eingeschränkter Inhalt. Diese Übertragung ist nur für Prime-Mitglieder oder über die offizielle Twitch-App sowie Webseite verfügbar.";
    STR_JUMPING_STEP = "Sprunggröße";
    STR_SECONDS = " Sekunden";
    STR_MINUTES = " Minuten";
    STR_CLOCK_OFFSET = "Zeitversatz";
    STR_APP_LANG = "Anwendungssprache";
    STR_CONTENT_LANG = "Contentsprache";
    STR_LANG_ALL = "Alle";
    STR_NO_GAME = "Kein Spiel";
    STR_JUMP_BUFFER_WARNING = "Springen während des Bufferns nicht möglich";
    STR_CHAT_DISABLE = "Chat ist deaktiviert, (Grüne Taste [B]) zum Aktivieren ";
    STR_CONTENT_LANG_SUMARRY = "Mit (Enter) ändern ";
    //STR_CONTROLS_MAIN_7 = "";
    //STR_CONTROLS_MAIN_11 = "";
    //STR_CONTROLS_PLAY_16 = "";
    //STR_STARTED = "";
}