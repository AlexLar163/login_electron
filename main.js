const { app, BrowserWindow, ipcMain, Notification } = require("electron");
var CryptoJS = require("crypto-js");
const path = require("path");

// cripto
const MD5 = require("crypto-js/md5");
const SHA1 = require("crypto-js/sha1");
const SHA256 = require("crypto-js/sha256");

const USERNAME_CONST = "acfaea7fde07e56a0e0e52a240de9e90";
const PASSWORD_CONST = "66231c0a38efac0c6b4bf460f8f3ac43";

let win;
let winlogin;
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation:true,
      // devTools:false,
      preload: path.join(__dirname, "index.js"),
    },
  });

  win.loadFile("index.html");
}

function loginWindow() {
  winlogin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation:true,
      // devTools:false,
      preload: path.join(__dirname, "login.js"),
    },
  });

  winlogin.loadFile("login.html");
}

app.whenReady().then(loginWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("login", (event, obj) => {
  validatelogin(obj);
});

function cripto(text) {
  return MD5(SHA1(SHA256(text))).toString();
}

function validatelogin(obj) {
  // Cripto
  let { username, password } = obj;
  let access = false;
  username = cripto(username);
  password = cripto(password);

  username === USERNAME_CONST && password === PASSWORD_CONST
    ? (access = true)
    : (access = false);
  if (access === true) {
    createWindow();
    win.show();
    winlogin.close();
  } else {
    new Notification({
      title: "login",
      body: "email o password equivocado",
    }).show();
  }
}