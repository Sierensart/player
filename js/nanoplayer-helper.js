// nanoPlayer Helper Scripts
// (c) 2019 nanocosmos gmbh

/* eslint-disable no-undef, no-console, no-unused-vars */
var _HTTPParams = undefined;
var getHTTPParam = function (paramKey) {
    // if params dont exist, create/read them
    if (!_HTTPParams) {
        _HTTPParams = [];
        var strGET = document.location.search.substr(1, document.location.search.length);
        if (strGET === '' && document.location.href.indexOf('?') !== -1) {
            var pos = document.location.href.indexOf('?') + 1;
            strGET = document.location.href.slice(pos);
        }
        if (strGET !== '') {
            var gArr = strGET.split('&');
            for (var i = 0; i < gArr.length; ++i) {
                var v = '';
                var vArr = gArr[i].split('=');
                var k = vArr[0];
                if (vArr.length > 1) {
                    v = vArr[1];
                }
                _HTTPParams[decodeURIComponent(k)] = decodeURIComponent(v);
            }
        }
    }
    // return requested param, if exists
    try {
        return _HTTPParams[paramKey];
    }
    catch (e) {
        undefined;
    }
};


function getNanoPlayerParameters (config) {
    var doStartPlayer = false;
    var tweaksQ = getHTTPParam('tweaks') || getHTTPParam('tweaks.buffer'),
        typed, i, len;
    if (tweaksQ) {
        var tweaks;
        try {
            tweaks = JSON.parse(tweaksQ);
            config.tweaks = tweaks;
        }
        catch (e) {
            if (tweaksQ.length) {
                config.tweaks = {}, config.tweaks.buffer = {};
                tweaks = tweaksQ.replace(/\s/g, '').replace(/;|:/g, ',').split(',');
                typed = ['min', 'start', 'target', 'limit', 'max'];
                for (i = 0, len = Math.min(tweaks.length, typed.length); i < len; i += 1) {
                    if (!isNaN(tweaks[i])) config.tweaks.buffer[typed[i]] = parseFloat(tweaks[i]);
                }
            }
        }
    }
    else {
        tweaksQ = { 'buffer': {} };
        var min = getHTTPParam('tweaks.buffer.min');
        var start = getHTTPParam('tweaks.buffer.start');
        var target = getHTTPParam('tweaks.buffer.target');
        var limit = getHTTPParam('tweaks.buffer.limit');
        var max = getHTTPParam('tweaks.buffer.max');
        if (min && start && target && limit && max) {
            config.tweaks = { 'buffer': {} };
            config.tweaks.buffer.min = parseFloat(min);
            config.tweaks.buffer.start = parseFloat(start);
            config.tweaks.buffer.max = parseFloat(max);
            config.tweaks.buffer.target = parseFloat(target);
            config.tweaks.buffer.limit = parseFloat(limit);
        }
    }
    var tweaksDQ = getHTTPParam('bufferDynamic') || getHTTPParam('tweaks.bufferDynamic');
    if (tweaksDQ) {
        config.tweaks = config.tweaks || {}, config.tweaks.bufferDynamic = {};
        tweaks = tweaksDQ.replace(/\s/g, '').replace(/;|:/g, ',').split(',');
        typed = ['offsetThreshold', 'offsetStep', 'cooldownTime'];
        for (i = 0, len = Math.min(tweaks.length, typed.length); i < len; i += 1) {
            if (!isNaN(tweaks[i])) config.tweaks.bufferDynamic[typed[i]] = parseFloat(tweaks[i]);
        }
    }
    var reconnect = getHTTPParam('reconnect') || getHTTPParam('playback.reconnect');
    if (reconnect) {
        try {
            reconnect = JSON.parse(reconnect);
            config.playback.reconnect = reconnect;
        }
        catch (e) {
            if (reconnect.length) {
                config.playback.reconnect = {};
                reconnect = reconnect.replace(/\s/g, '').replace(/;|:/g, ',').split(',');
                typed = ['minDelay', 'maxDelay', 'delaySteps', 'maxRetries'];
                for (i = 0, len = Math.min(reconnect.length, typed.length); i < len; i += 1) {
                    if (!isNaN(reconnect[i])) config.playback.reconnect[typed[i]] = parseFloat(reconnect[i]);
                }
            }
        }
    }
    else {
        var minDelay = getHTTPParam('playback.reconnect.minDelay');
        var maxDelay = getHTTPParam('playback.reconnect.maxDelay');
        var delaySteps = getHTTPParam('playback.reconnect.delaySteps');
        var maxRetries = getHTTPParam('playback.reconnect.maxRetries');
        if (minDelay && delaySteps && maxRetries && maxDelay) {
            config.playback.reconnect = {};
            config.playback.reconnect.minDelay = parseFloat(minDelay);
            config.playback.reconnect.maxDelay = parseFloat(maxDelay);
            config.playback.reconnect.delaySteps = parseFloat(delaySteps);
            config.playback.reconnect.maxRetries = parseFloat(maxRetries);
        }
    }
    var timeouts = getHTTPParam('timeouts') || getHTTPParam('playback.timeouts');
    if (timeouts) {
        try {
            timeouts = JSON.parse(timeouts);
            config.playback.timeouts = timeouts;
        }
        catch (e) {
            if (timeouts.length) {
                config.playback.timeouts = {};
                timeouts = timeouts.replace(/\s/g, '').replace(/;|:/g, ',').split(',');
                typed = ['loading', 'buffering', 'connecting'];
                for (i = 0, len = Math.min(timeouts.length, typed.length); i < len; i += 1) {
                    if (!isNaN(timeouts[i])) config.playback.timeouts[typed[i]] = parseFloat(timeouts[i]);
                }
            }
        }
    }
    else {
        var loading = getHTTPParam('playback.timeouts.loading') || getHTTPParam('timeouts.loading');
        var buffering = getHTTPParam('playback.timeouts.buffering') || getHTTPParam('timeouts.buffering');
        var connecting = getHTTPParam('playback.timeouts.connecting') || getHTTPParam('timeouts.connecting');
        if (loading || buffering || connecting) {
            config.playback.timeouts = {};
        }
        if (loading) {
            config.playback.timeouts.loading = parseFloat(loading);
        }
        if (buffering) {
            config.playback.timeouts.buffering = parseFloat(buffering);
        }
        if (connecting) {
            config.playback.timeouts.connecting = parseFloat(connecting);
        }
    }
    // TODO fix forcing in playerfactory
    var force = getHTTPParam('force') || getHTTPParam('playback.forceTech');
    if (force) {
        config.playback.forceTech = force;
    }
    var videoId = getHTTPParam('videoId') || getHTTPParam('playback.videoId');
    var external = getHTTPParam('external');
    if (videoId || external) {
        config.playback.videoId = videoId ? videoId : 'h5live';
        if (external) document.getElementById('h5live').style.display = 'block';
    }
    var muted = getHTTPParam('muted') || getHTTPParam('playback.muted');
    if (muted) {
        forceMuted = (muted === 'true' || muted === '1');
    }
    var autoplay = getHTTPParam('autoplay') || getHTTPParam('playback.autoplay');
    if (autoplay) {
        forceAutoplay = (autoplay === 'true' || autoplay === '1');
    }
    var automute = getHTTPParam('automute') || getHTTPParam('playback.automute');
    if (automute) {
        config.playback.automute = (automute === 'true' || automute === '1');
    }
    var metadata = getHTTPParam('metadata') || getHTTPParam('playback.metadata');
    if (metadata) {
        config.playback.metadata = true;
    }
    var keepConnection = getHTTPParam('keepConnection') || getHTTPParam('playback.keepConnection');
    if (keepConnection) {
        config.playback.keepConnection = (keepConnection === 'true' || keepConnection === '1');
    }
    var allowSafariHlsFallback = getHTTPParam('allowSafariHlsFallback') || getHTTPParam('playback.allowSafariHlsFallback');
    if (allowSafariHlsFallback) {
        config.playback.allowSafariHlsFallback = (allowSafariHlsFallback === 'true' || allowSafariHlsFallback === '1');
    }
    var view = getHTTPParam('view') || getHTTPParam('style.view');
    if (view) {
        config.style = config.style || {};
        config.style.view = (view === 'true' || view === '1');
    }
    var scaling = getHTTPParam('scaling') || getHTTPParam('style.scaling');
    if (scaling) {
        config.style = config.style || {};
        config.style.scaling = scaling;
    }
    var keepFrame = getHTTPParam('keepFrame') || getHTTPParam('style.keepFrame');
    if (keepFrame) {
        config.style = config.style || {};
        config.style.keepFrame = (keepFrame === 'true' || keepFrame === '1');
    }
    var displayAudioOnly = getHTTPParam('displayAudioOnly') || getHTTPParam('style.displayAudioOnly');
    if (displayAudioOnly) {
        config.style = config.style || {};
        config.style.displayAudioOnly = (displayAudioOnly === 'true' || displayAudioOnly === '1');
    }
    var displayMutedAutoplay = getHTTPParam('displayMutedAutoplay') || getHTTPParam('style.displayMutedAutoplay');
    if (displayMutedAutoplay) {
        config.style = config.style || {};
        config.style.displayMutedAutoplay = (displayMutedAutoplay === 'true' || displayMutedAutoplay === '1');
    }
    var audioPlayer = getHTTPParam('audioPlayer') || getHTTPParam('style.audioPlayer');
    if (audioPlayer) {
        config.style = config.style || {};
        config.style.audioPlayer = (audioPlayer === 'true' || audioPlayer === '1');
    }
    var backgroundColor = getHTTPParam('backgroundColor') || getHTTPParam('style.backgroundColor');
    if (backgroundColor) {
        config.style = config.style || {};
        config.style.backgroundColor = backgroundColor;
    }
    var fullScreenControl = getHTTPParam('fullScreenControl') || getHTTPParam('style.fullScreenControl');
    if (fullScreenControl) {
        config.style = config.style || {};
        config.style.fullScreenControl = (fullScreenControl === 'true' || fullScreenControl === '1');
    }
    var centerView = getHTTPParam('centerView') || getHTTPParam('style.centerView');
    if (centerView) {
        config.style = config.style || {};
        config.style.centerView = (centerView === 'true' || centerView === '1');
    }
    var controls = getHTTPParam('controls') || getHTTPParam('style.controls');
    if (controls) {
        config.style = config.style || {};
        config.style.controls = (controls === 'true' || controls === '1');
    }
    var width = getHTTPParam('width') || getHTTPParam('style.width');
    if (width) {
        config.style = config.style || {};
        config.style.width = isNaN(width) ? width : width + 'px';
    }
    var height = getHTTPParam('height') || getHTTPParam('style.height');
    if (height) {
        config.style = config.style || {};
        config.style.height = isNaN(height) ? height : height + 'px';
    }
    var bintuQ = getHTTPParam('bintu');
    if (bintuQ) {
        bintuQ = JSON.parse(bintuQ);
    }
    else {
        bintuQ = {};
        bintuQ.apiurl = getHTTPParam('bintu.apiurl') || 'https://bintu.nanocosmos.de';
        bintuQ.streamid = getHTTPParam('bintu.streamid') || getHTTPParam('streamid');
        bintuQ.streamname = getHTTPParam('bintu.streamname') || getHTTPParam('streamname');
        bintuQ.group = getHTTPParam('bintu.group');
        bintuQ.apikey = getHTTPParam('bintu.apikey');
    }
    if (bintuQ.streamid) {
        config.source.bintu = {};
        if (bintuQ.apiurl)
            config.source.bintu.apiurl = bintuQ.apiurl;
        config.source.bintu.streamid = bintuQ.streamid;
        checkH5Live(config);
        checkSecurity(config);
        checkEntries(config);
        checkOptions(config);
        doStartPlayer = true;
    }
    else if (bintuQ.streamname) {
        config.source.h5live = config.source.h5live || {};
        config.source.h5live.rtmp = {
            'url'        : 'rtmp://bintu-play.nanocosmos.de:80/play',
            'streamname' : bintuQ.streamname
        };
        config.source.h5live.server = {
            'websocket'   : 'wss://bintu-h5live.nanocosmos.de:443/h5live/stream/stream.mp4',
            'hls'         : 'https://bintu-h5live.nanocosmos.de:443/h5live/http/playlist.m3u8',
            'progressive' : 'https://bintu-h5live.nanocosmos.de:443/h5live/http/stream.mp4'
        };
        checkH5Live(config);
        checkSecurity(config);
        checkEntries(config);
        checkOptions(config);
        doStartPlayer = true;
    }
    else if (bintuQ.group && bintuQ.apikey) {
        bintu = new Bintu(bintuQ.apiurl, bintuQ.apikey);
        searchStreams();
        searchRefreshInterval = setInterval(searchStreams, 8000);

        var count = streamObjs.length;
        document.getElementById('group').innerText = group + ' - ' + count + ' stream(s)';

        var groupContainer = document.getElementById('group-container');
        groupContainer.style.display = 'block';

        var streamsContainer = document.getElementById('streams-container');
        streamsContainer.style.display = 'block';
        return config;
    }
    else {
        checkH5Live(config);
        var h5liveQ = {};
        h5liveQ.rtmp = {};
        h5liveQ.rtmp.url = getHTTPParam('h5live.rtmp.url');
        h5liveQ.rtmp.streamname = getHTTPParam('h5live.rtmp.streamname') || getHTTPParam('entries.streamname');
        if (h5liveQ.rtmp.url && h5liveQ.rtmp.streamname) {
            config.source.h5live = config.source.h5live || {};
            config.source.h5live.rtmp = h5liveQ.rtmp;
            // document.getElementById('update-source-container').style.display = 'block';
            // document.getElementById('inputUrl').value = h5liveQ.rtmp.url;
            // document.getElementById('inputStreamname').value = h5liveQ.rtmp.streamname;
        }
        var hls = getHTTPParam('hls');
        if (hls) {
            config.source.hls = hls;
        }
        var dash = getHTTPParam('dash');
        if (dash) {
            config.source.dash = dash;
        }
        checkSecurity(config);
        checkEntries(config);
        checkOptions(config);
        doStartPlayer = true;
    }
    if (config.source.entries.length) {
        delete config.source.h5live;
    }
    var startIndex = parseInt(getHTTPParam('startIndex'), 10);
    config.source.startIndex = startIndex && !isNaN(startIndex) ? startIndex : 0;

    return config;
}

function checkH5Live (config, server) {
    var h5liveQ = {};
    h5liveQ.server = server || getHTTPParam('h5live.server');
    if (h5liveQ.server) {
        config.source.h5live = config.source.h5live || {};
        config.source.h5live.server = {};
        if (h5liveQ.server.indexOf('wss://') !== -1) {
            warning('The query param "h5live.server" is deprecated. With this config iOS is not supported. To use h5live on all supported platforms use the query params "h5live.server.websocket" and "h5live.server.hls"!');
            try {
                var servers = JSON.parse(h5liveQ.server); // parse server object (new since 1.0.2)
                config.source.h5live.server = servers;
            }
            catch (e) {
                config.source.h5live.server.websocket = h5liveQ.server; // fallback for versions < 1.0.2
            }
        }
        else {
            var routes = {
                'secured': {
                    'websocket'   : ['wss://', ':443/h5live/stream'],
                    'hls'         : ['https://', ':443/h5live/http/playlist.m3u8'],
                    'progressive' : ['https://', ':443/h5live/http/stream.mp4']
                },
                'secured_stream': {
                    'websocket'   : ['wss://', ':443/h5live/authstream'],
                    'hls'         : ['https://', ':443/h5live/authhttp/playlist.m3u8'],
                    'progressive' : ['https://', ':443/h5live/authhttp/stream.mp4']
                },
                'unsecured': {
                    'websocket'   : ['ws://', ':8181'],
                    'hls'         : ['http://', ':8180/playlist.m3u8'],
                    'progressive' : ['http://', ':8180/stream.mp4']
                }
            };
            var securityCurrent = securityCurrent || null;
            var route = (document.location.protocol.indexOf('https') === 0) ? (securityCurrent !== null ? routes.secured_stream : routes.secured) : routes.unsecured;
            config.source.h5live.server = {
                'websocket'   : route.websocket[0] + h5liveQ.server + route.websocket[1],
                'hls'         : route.hls[0] + h5liveQ.server + route.hls[1],
                'progressive' : route.progressive[0] + h5liveQ.server + route.progressive[1]
            };
        }
    }
    else { // try parse seperately
        h5liveQ.server = {};
        h5liveQ.server.websocket = getHTTPParam('h5live.server.websocket');
        h5liveQ.server.progressive = getHTTPParam('h5live.server.progressive');
        h5liveQ.server.hls = getHTTPParam('h5live.server.hls');
        if (h5liveQ.server.websocket || h5liveQ.server.progressive || h5liveQ.server.hls) {
            config.source.h5live = config.source.h5live || {};
            config.source.h5live.server = {};
            var sourceConut = 0;
            if (h5liveQ.server.websocket) {
                config.source.h5live.server.websocket = h5liveQ.server.websocket;
            }
            if (h5liveQ.server.progressive) {
                config.source.h5live.server.progressive = h5liveQ.server.progressive;
            }
            if (h5liveQ.server.hls) {
                config.source.h5live.server.hls = h5liveQ.server.hls;
            }
            if (!config.source.h5live.server.websocket && config.source.h5live.server.hls && config.playback.metadata) {
                warning('To use h5live on iOS with metadata please also pass a websocket url over the query param "h5live.server.websocket"!');
            }
            else if (!config.source.h5live.server.websocket && config.source.h5live.server.hls) {
                warning('To use h5live on platforms other then iOS please also pass a websocket url over the query param "h5live.server.websocket"!');
            }
            else if (config.source.h5live.server.websocket && !config.source.h5live.server.hls) {
                warning('To use h5live on iOS please also pass a hls url over the query param "h5live.server.hls"!');
            }
        }
        else if (!config.source.bintu && !config.source.h5live) {
            config.source.h5live = {};
            config.source.h5live.server = {};

            // USE DEFAULT DEMO PAGE H5LIVE SERVER
            // to change the page defaults see line 94
            config.source.h5live.server.websocket = DEFAULT_DEMO_PAGE_H5LIVE_SERVER_WSS;
            config.source.h5live.server.hls = DEFAULT_DEMO_PAGE_H5LIVE_SERVER_HLS;
            config.source.h5live.server.progressive = DEFAULT_DEMO_PAGE_H5LIVE_SERVER_PROGRESSIVE;

            // document.getElementById('inputServer').value = DEFAULT_DEMO_PAGE_H5LIVE_SERVER;
        }
    }
    h5liveQ.token = getHTTPParam('h5live.token');
    if (h5liveQ.token) {
        config.source.h5live = config.source.h5live || {};
        config.source.h5live.token = h5liveQ.token;
    }
    else {
        h5liveQ.token = {};
        h5liveQ.token.key = getHTTPParam('h5live.token.key');
        h5liveQ.token.type = getHTTPParam('h5live.token.type');
        if (h5liveQ.token.key) {
            config.source.h5live = config.source.h5live || {};
            config.source.h5live.token = '{"type":"' + (h5liveQ.token.type ? h5liveQ.token.type : 'token1') + '","key":"' + h5liveQ.token.key + '"}';
        }
    }
}

function checkSecurity (config) {
    var security = {};
    security.token = getHTTPParam('h5live.security.token');
    if (security.token) {
        config.source.h5live = config.source.h5live || {};
        config.source.h5live.security = config.source.h5live.security || {};
        config.source.h5live.security.token = security.token;
    }
    security.expires = getHTTPParam('h5live.security.expires');
    if (security.expires) {
        config.source.h5live = config.source.h5live || {};
        config.source.h5live.security = config.source.h5live.security || {};
        config.source.h5live.security.expires = security.expires;
    }
    security.options = getHTTPParam('h5live.security.options');
    if (security.options) {
        config.source.h5live = config.source.h5live || {};
        config.source.h5live.security = config.source.h5live.security || {};
        config.source.h5live.security.options = security.options;
    }
    security.tag = getHTTPParam('h5live.security.tag');
    if (security.tag) {
        config.source.h5live = config.source.h5live || {};
        config.source.h5live.security = config.source.h5live.security || {};
        config.source.h5live.security.tag = security.tag;
    }
}

function checkEntries (config) {
    var entries = [];
    var paramBitrate, paramWidth, paramHeight, paramFramerate;
    var streamnames = [], urls = [], servers = [], bintustreamids = [], bintuurl = [];
    var nums = ['', '2', '3', '4', '5', '6', '7', '8', '9'];
    var index = 0;

    while (nums.length) {
        var num = nums.shift();
        var name = getHTTPParam('entry' + num + '.rtmp.streamname');
        var streamid = getHTTPParam('entry' + num + '.bintu.streamid');
        if (!name && !streamid) {
            break;
        }
        var url = getHTTPParam('entry' + num + '.rtmp.url');
        if (!url) {
            url = 'rtmp://bintu-play.nanocosmos.de:80/play';
        }
        var server = getHTTPParam('entry' + num + '.server');
        if (server) {
            var routes = {
                'secured': {
                    'websocket'   : ['wss://', ':443/h5live/stream.mp4'],
                    'hls'         : ['https://', ':443/h5live/http/playlist.m3u8'],
                    'progressive' : ['https://', ':443/h5live/http/stream.mp4']
                },
                'unsecured': {
                    'websocket'   : ['ws://', ':8181'],
                    'hls'         : ['http://', ':8180/playlist.m3u8'],
                    'progressive' : ['http://', ':8180/stream.mp4']
                }
            };
            var route = (document.location.protocol.indexOf('https') === 0) ? routes.secured : routes.unsecured;
            server = {
                'websocket'   : route.websocket[0] + server + route.websocket[1],
                'hls'         : route.hls[0] + server + route.hls[1],
                'progressive' : route.progressive[0] + server + route.progressive[1]
            };
        }
        else {
            var wss = getHTTPParam('entry' + num + '.server.websocket');
            var hls = getHTTPParam('entry' + num + '.server.hls');
            server = {
                'websocket'   : wss || 'wss://bintu-h5live.nanocosmos.de:443/h5live/stream/stream.mp4',
                'hls'         : hls || 'https://bintu-h5live.nanocosmos.de:443/h5live/http/playlist.m3u8',
                'progressive' : 'https://bintu-h5live.nanocosmos.de:443/h5live/http/stream.mp4'
            };
        }
        var apiurl = getHTTPParam('entry' + num + '.bintu.apiurl');

        paramBitrate = parseInt(getHTTPParam(['entry' + num + '.info.bitrate']), 10);
        paramWidth = parseInt(getHTTPParam(['entry' + num + '.info.width']), 10);
        paramHeight = parseInt(getHTTPParam(['entry' + num + '.info.height']), 10);
        paramFramerate = parseInt(getHTTPParam(['entry' + num + '.info.framerate']), 10);
        entries.push(
            {
                'index' : index,
                'label' : 'stream ' + (index + 1),
                'tag'   : '',
                'info'  : {
                    'bitrate'   : !isNaN(paramBitrate) ? paramBitrate : 0,
                    'width'     : !isNaN(paramWidth) ? paramWidth : 0,
                    'height'    : !isNaN(paramHeight) ? paramHeight : 0,
                    'framerate' : !isNaN(paramFramerate) ? paramFramerate : 0
                },
                'hls'    : '',
                'h5live' : {
                    'rtmp': {
                        'url'        : url,
                        'streamname' : name
                    },
                    'server'   : server,
                    'token'    : '',
                    'security' : {
                        'token'   : getHTTPParam('entry' + num + '.security.token'),
                        'expires' : getHTTPParam('entry' + num + '.security.expires'),
                        'options' : getHTTPParam('entry' + num + '.security.options'),
                        'tag'     : getHTTPParam('entry' + num + '.security.tag')
                    }
                },
                'bintu': {
                    'apiurl'   : apiurl,
                    'streamid' : streamid
                }
            }
        );
        index++;
    }

    config.source.entries = entries;
}

function checkOptions (config) {
    config.source.options = {
        'adaption' : {},
        'switch'   : {}
    };

    var rule = getHTTPParam('rule') || getHTTPParam('options.rule');
    if (rule) {
        config.source.options.adaption.rule = rule;
    }
    var forcePlay = getHTTPParam('forcePlay') || getHTTPParam('options.switch.forcePlay');
    if (forcePlay) {
        config.source.options.switch.forcePlay = !!(forcePlay === '1' || forcePlay === 'true');
    }
    var pauseOnError = getHTTPParam('pauseOnError') || getHTTPParam('options.switch.pauseOnError');
    if (pauseOnError) {
        config.source.options.switch.pauseOnError = !!(pauseOnError === '1' || pauseOnError === 'true');
    }
    var method = getHTTPParam('method') || getHTTPParam('options.switch.method');
    if (method) {
        config.source.options.switch.method = method;
    }
}

function isValidStreamIndex (value, maxValue) {
    return !isNaN(value) && (value >= 0) && (value <= maxValue);
}

var logCount = 0;

function log (e, consoleOnly) {
    if (typeof e === 'object') {
        try {
            e = JSON.stringify(e);
        }
        catch (err) { }
    }
    e = new Date().toLocaleTimeString() + ': ' + e;
    console.log(e);
    if (!consoleOnly) {
        if (logCount > 1000) {
            document.getElementById('log').innerText = '';
            logCount = 0;
        }
        var span = document.createElement('span'), br = document.createElement('br');
        span.textContent = e;
        document.getElementById('log').insertBefore(br, document.getElementById('log').firstChild);
        document.getElementById('log').insertBefore(span, br);
        logCount += 1;
    }
}

function warning (message) {
    document.getElementById('warning').innerText = message;
    document.getElementById('warning-container').style.display = 'block';
    log('Warning: ' + message);
}

function hideErrorWarning () {
    document.getElementById('error-container').style.display = 'none';
    document.getElementById('warning-container').style.display = 'none';
}

