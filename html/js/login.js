function LoginClick() {

    //傳送登入資料
    var SelfID = document.getElementById("txtSelfId").value;
    var TargetID = document.getElementById("txtTargetId").value;
    window.sessionStorage.setItem("SelfKey", SelfID);
    window.sessionStorage.setItem("TargetKey", TargetID);

    //取得本機IP
    var IP = document.location.hostname;
    console.log(IP);
    window.sessionStorage.setItem("LocalIP", IP);

    //跳轉頁面  
    self.location.href = "videocall.html";


}