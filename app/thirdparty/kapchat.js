// The bellow are some function or adptations of function from
// https://www.nightdev.com/kapchat/
function extraEmoticonize(message, emote) {
    return message.replace(emote.code, extraEmoteTemplate(emote));
}

function extraEmoteTemplate(emote) {
    return '<img class="emoticon" alt="" src="' + emote['3x'] + '"/>';
}

function emoteTemplate(id) {
    return '<img class="emoticon" alt="" src="https://static-cdn.jtvnw.net/emoticons/v1/' + id + '/3.0"/>';
}


function mescape(message) {
    return message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function extraMessageTokenize(message) {
    var tokenizedString = message.split(' ');

    for (var i = 0; i < tokenizedString.length; i++) {
        message = tokenizedString[i];

        var test = message.replace(/(^[~!@#$%\^&\*\(\)]+|[~!@#$%\^&\*\(\)]+$)/g, '');
        var emote = extraEmotes[test] || extraEmotes[message];

        if (emote) {
            message = extraEmoticonize(message, emote);
        } else {
            message = mescape(message);
        }

        tokenizedString[i] = message;
    }

    return tokenizedString.join(' ');
}

function emoticonize(message, emotes) {
    if (!emotes) return [message];

    var tokenizedMessage = [];

    var emotesList = Object.keys(emotes);

    var replacements = [];

    emotesList.forEach(function(id) {
        var emote = emotes[id];

        for (var i = emote.length - 1; i >= 0; i--) {
            replacements.push({
                id: id,
                first: emote[i][0],
                last: emote[i][1]
            });
        }
    });

    replacements.sort(function(a, b) {
        return b.first - a.first;
    });

    // Tokenizes each character into an array
    // punycode deals with unicode symbols on surrogate pairs
    // punycode is used in the replacements loop below as well
    message = punycode.ucs2.decode(message);

    replacements.forEach(function(replacement) {
        // Unshift the end of the message (that doesn't contain the emote)
        tokenizedMessage.unshift(punycode.ucs2.encode(message.slice(replacement.last + 1)));

        // Unshift the emote HTML (but not as a string to allow us to process links and escape html still)
        tokenizedMessage.unshift([emoteTemplate(replacement.id)]);

        // Splice the unparsed piece of the message
        message = message.slice(0, replacement.first);
    });

    // Unshift the remaining part of the message (that contains no emotes)
    tokenizedMessage.unshift(punycode.ucs2.encode(message));

    return tokenizedMessage;
}

function transformBadges(sets) {
    return Object.keys(sets).map(function(b) {
        var badge = sets[b];
        badge.type = b;
        badge.versions = Object.keys(sets[b].versions).map(function(v) {
            var version = sets[b].versions[v];
            version.type = v;
            return version;
        });
        return badge;
    });
}

function tagCSS(type, version, url, doc) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.' + type + '-' + version + ' { background-image: url("' + url.replace('http:', 'https:') + '"); }';
    if (doc) doc.appendChild(style);
    else document.head.appendChild(style);
}