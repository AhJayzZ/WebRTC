# WebRTC直播平台 WebRTC Streaming

## ★★★★★(年久失修有Bug，尚未修復)★★★★★
## 簡介 Introduction
這是大三上學期修的一堂Capstone課程所製作的期末專題，主要功能是要求有1位直播主和1位觀眾視訊對唱歌，**採用WebRTC與PeerJS的結合來實現直播主與觀眾雙方p2p的視訊功能。**，除此之外，**也利用了Socket.io製作了一個多人聊天室**提供聊天功能。


- [WebRTC](https://webrtc.org/):**可提供瀏覽器網頁與網頁之間的視訊語音即時通訊**，目前大多主流瀏覽器都支援該API，主要以JavaScript API的形式提供服務。
- [PeerJS](https://peerjs.com/):**提供兩個端點的使用者以p2p的方式建立連線。**
- [Socket.io](https://socket.io/):主要使用WebSocket協定，是一個Web應用的JavaScript庫，使客戶端與伺服端達成雙向通訊，**常用來製作多人聊天室。**

![](https://i.imgur.com/l9493AC.png)

----------------------------------------

## 環境設定 Environment
- 1.開發環境:**Node.js v16.08**
- 2.使用前置安裝:
    - a.**需先安裝cnpm:```npm install cnpm```**
    - b.安裝serve-index:**```cnpm install serve-index```**
    - c.安裝peer:**```cnpm peer```**
- 3.終端機執行 **```npm install```** 安裝會使用到的套件

----------------------------------------
## 系統架構 System Architecture
- ### WebRTC架構圖 WebRTC Architecture
    ![](https://i.imgur.com/iQTNKkh.png)


- ### 處理過程 Process
    ![](https://i.imgur.com/KYHqut2.png)


----------------------------------------
## 成果 Result


----------------------------------------
## 參考 Reference

- [WebRTC結合PeerJS](https://www.cnblogs.com/yjmyzz/p/peerjs-tutorial.html)

----------------------------------------
### 待整理 Unfinished

node server.js \
如果提示缺少包，可通過 cnpm(或npm) install serve-index peer 安裝 \
啟用成功後，瀏覽https://localhost:81/ 即可
