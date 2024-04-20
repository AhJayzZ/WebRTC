# WebRTC直播平台 WebRTC Streaming

## 簡介 Introduction
這是大三上學期修的一堂Capstone課程所製作的期末專題，主要功能是要求一位直播主和一位觀眾視訊對唱歌，**採用WebRTC結合PeerJS來實現直播主與觀眾雙方p2p的視訊功能。**，除此之外，**也利用了Socket.io製作了一個多人聊天室**提供聊天功能，伺服器使用課程提供的AWS EC2服務。


- [WebRTC](https://webrtc.org/):**可提供瀏覽器網頁與網頁之間的視訊語音即時通訊**，目前大多主流瀏覽器都支援WebRTC，主要以JavaScript API的形式提供服務。
- [PeerJS](https://peerjs.com/):**簡化WebRTC的操作與建立過程**，方便於應用。
- [Socket.io](https://socket.io/):主要使用WebSocket協定，是一個Web應用的JavaScript庫，使客戶端與伺服端達成雙向通訊，**常用來製作多人聊天室。**

![](https://i.imgur.com/l9493AC.png)

----------------------------------------

## 環境設定 Environment
- 1.開發環境:**Node.js v16.08**
- 2.信號伺服器:**Linux Ubuntu 16.04**
- 3.**套件安裝與架設(重要)**
```bash=
# 先安裝套件包(必須先安裝cnpm)
npm install cnpm
cd WebRTC/
cnpm install serve-index
cnpm peer
npm install #安裝剩餘套件包
    
# Part 1.架設視訊網頁(Port:81,PeerPort:9000)
cd WebRTC
node server.js &

# Part 2.架設聊天室(Port:5000)
cd html/nodejs-simple-chatroom-master 
npm install #安裝socket.io
node app.js &
```

- 4.進入網站
    - Step 1.視訊網站:```https://<ip>:81/login.html```
    - Step 2.雙方輸入彼此的ID
        - 己方:**Self ID**
        - 對方:**Target ID**
    
----------------------------------------
## 專業術語 Terms
- ### WebRTC
    - #### **SDP**
        Session Description Protocol，**內部包含使用端的視頻解碼器(codec)、加密、網路傳輸協定、主機位址...等媒體相關資訊**，由WebRTC建立SDP再經過Singaling Server傳給連線雙方以此交換使用者間的資訊。

    - #### **ICE Candidate**
        在建立peer-to-peer連線之前，**ICE會靠著 STUN 與 TURN 協定來處理 NAT 穿透（NAT traversal與其他棘手的問題**。
        - Part 1.先由**UDP協定嘗試連線對方**，
        - Part 2.如果**失敗則採用TCP協定嘗試HTTP連線對方(失敗繼續嘗試HTTPS)**，
        - Part 3.如果還是**失敗則會改用TURN Server當作中繼站讓雙方使用者通過此Server傳遞資訊** 

    - #### **Signaling Server**
        WebRTC 的 RTCPeerConnection 會負責多媒體串流的傳送，不過除此之外，還會需要一個額外的機制來傳送一些**控制與建立連線用的信令（signaling）**，而這個信令主要包含下面這些資訊:
        - 1.連線 session 控制資訊：用於**建立與關閉連線，錯誤訊息處理**。
        - 2.網路資訊：**提供對方本地端之 IP 位址與連接埠（port）**。
        - 3.多媒體格式資訊：**記錄瀏覽器可使用的 codecs 與解析度等資訊**。

    - #### **STUN Server**
        讓在 NAT 中的 **client 獲取自己本身公開的 IP 位址與連接埠** 

    - #### **TURN Server**
        當ICE協定無法與對方連線時，會使用TURN Server**當作雙方的中繼伺服器**

- ### PeerJS
    由上面可以知道WebRTC的建立還是有一定的難度，對於初學者來說還是需要一定門檻的，於是可以通過**PeerJS簡化簡化了WebRTC的開發過程**，不須特別了解SDP交換、ICE候選這些重點細節，開發人員只需要關注應用，其中常見的應用有:
    | 函式 | 功能 | 
    | -------- | -------- |
    | **peer.connect**| 創建點對點的連接  | 
    | **peer.call** | 向另外1個peer端發起語音視頻實時通信 |
    | **peer.on** | 對各種事件的監控偵測 |
    | **peer.disconnect** | 斷開連接 |
    | **peer.reconnect** | 重連連接 |
    | **peer.destroy** | 摧毀對象 |

----------------------------------------
## 系統架構 System Architecture
- ### WebRTC架構圖 WebRTC Architecture
    - #### Signaling Server: **AWS EC2(Linux Ubuntu 16.04)**

    ![](https://i.imgur.com/iQTNKkh.png)


- ### 處理過程 Process
    ![](https://i.imgur.com/KYHqut2.png)

----------------------------------------
## 成果 Result

- ### 視訊頁面 
    ![](https://i.imgur.com/SmYecsB.png)

- ### 聊天室 
    ![](https://i.imgur.com/QI0ii2M.png)

----------------------------------------
## 參考 Reference

- [WebRTC結合PeerJS](https://www.cnblogs.com/yjmyzz/p/peerjs-tutorial.html)
