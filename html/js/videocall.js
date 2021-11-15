var txtSelfId = window.sessionStorage.getItem("SelfKey");
var txtTargetId = window.sessionStorage.getItem("TargetKey");
var getIP = window.sessionStorage.getItem("LocalIP");
var btnRegister = document.querySelector("button#btnRegister");
var btnCall = document.querySelector("button#btnCall");
var localVideo = document.querySelector("video#localVideo");
var remoteVideo = document.querySelector("video#remoteVideo");
var lblFrom = document.querySelector("label#lblFrom");
var videoSelect = document.querySelector("select#videoSelect");
var musicLink;

/*選擇歌曲*/
musicSelect.onclick = function() {
    var musicChoose = document.getElementById("musicSelect").value //抓歌曲選擇
    switch (musicChoose) {
        case 'roof':
            musicLink = "https://www.youtube.com/embed/TOb6OWBpou4?autoplay=1&vq=small";
            break;
        case 'twotiger':
            musicLink = "https://www.youtube.com/embed/Y6Me09bdJzE?autotplay=1&vq=small";
            break;
        case 'anthem':
            musicLink = "https://www.youtube.com/embed/ZmZbt0CO2q4?autoplay=1&vq=small";
            break;
    }
}

function changeChatboxIP() {
    document.getElementById("chatbox").innerHTML = '<iframe src="https://' + getIP + ':5000/" id="chat" scrolling="yes"></iframe>';
} //改IP

filter.addEventListener('change', () => { localVideo.className = filter.value; });
filter.addEventListener('change', () => { remoteVideo.className = filter.value; });
//濾鏡

console.log(txtSelfId);
console.log(txtTargetId);

let peer = null;
let localConn = null;
let localStream = null;

hashCode = function(str) {
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash;
}

function gotStream(stream) {
    console.log('received local stream');
    localStream = stream;
    localVideo.srcObject = localStream;
}

function sendMessage(from, to, action) {
    var message = { "from": from, "to": to, "action": action };
    if (!localConn) {
        localConn = peer.connect(hashCode(to));
        localConn.on('open', () => {
            localConn.send(JSON.stringify(message));
            console.log(message);
        });
    }
    if (localConn.open) {
        localConn.send(JSON.stringify(message));
        console.log(message);
    }
}

function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

//绑定摄像头列表到下拉框
function gotDevices(deviceInfos) {
    if (deviceInfos === undefined) {
        return
    }
    for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'videoinput') {
            option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
            videoSelect.appendChild(option);
        }
    }
}

//开启本地摄像头
function start() {
    if (localStream) {
        localStream.getTracks().forEach(track => {
            track.stop();
        });
    }

    const videoSource = videoSelect.value;
    const constraints = {
        audio: true,
        video: { width: { exact: 1280 }, height: { exact: 720 } }
        //  video: { width: 600, height: 600, deviceId: videoSource ? { exact: videoSource } : undefined }
    };

    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(gotStream)
        .then(gotDevices)
        .catch(handleError);
}

window.onload = function() {
    changeChatboxIP();
    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {
        console.log('webrtc is not supported!');
        alert("webrtc is not supported!");
        return;
    }

    //获取摄像头列表
    navigator.mediaDevices.enumerateDevices()
        .then(gotDevices)
        .catch(handleError);

    $("#dialog-confirm").hide();

    //连接到peerjs服务器的选项
    let connOption = { host: getIP, port: 9000, path: '/', debug: 3 };

    //register处理
    if (!peer) {
        if (txtSelfId.length == 0) {
            alert("please input your name");
            txtSelfId.focus();
            return;
        }
        peer = new Peer(hashCode(txtSelfId), connOption);
        peer.on('open', function(id) {
            console.log("register success. " + id);
        });

        peer.on('call', function(call) {
            call.answer(localStream);
        });

        peer.on('connection', (conn) => {
            conn.on('data', (data) => {
                var msg = JSON.parse(data);
                console.log(msg);
                //收到视频邀请时，弹出询问对话框
                if (msg.action === "call") {
                    lblFrom.innerText = msg.from;
                    txtTargetId = msg.from;
                    $("#dialog-confirm").dialog({
                        resizable: false,
                        height: "auto",
                        width: 400,
                        modal: true,
                        buttons: {
                            "Accept": function() {
                                $(this).dialog("close");
                                sendMessage(msg.to, msg.from, "accept");
                            },
                            Cancel: function() {
                                $(this).dialog("close");
                            }
                        }
                    });
                }
                //接受视频通话邀请
                if (msg.action === "accept") {
                    document.getElementById("lyris").innerHTML = '<iframe id="lyris" width="300" volume="100" height="150" src=' + musicLink + ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                    console.log("accept call => " + JSON.stringify(msg));
                    var call = peer.call(hashCode(msg.from), localStream);
                    call.on('stream', function(stream) {
                        console.log('received remote stream');
                        remoteVideo.srcObject = stream;
                        sendMessage(msg.to, msg.from, "accept-ok");
                    });
                }

                //接受视频通话邀请后，通知另一端    
                if (msg.action === "accept-ok") {
                    document.getElementById("lyris").innerHTML = '<iframe id="lyris" width="300" volume="100" height="150" src=' + musicLink + ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
                    console.log("accept-ok call => " + JSON.stringify(msg));
                    var call = peer.call(hashCode(msg.from), localStream);
                    call.on('stream', function(stream) {
                        console.log('received remote stream');
                        remoteVideo.srcObject = stream;
                    });
                }
            });
        });
    }

    btnStart.onclick = function() {
        //放音樂
        sendMessage(txtSelfId, txtTargetId, "call"); //若註冊完則Call
    }

    videoSelect.onchange = start;

    start();
}