// Importa módulos principales de Electron
const { app, BrowserWindow, ipcMain } = require('electron')
// app → controla el ciclo de vida de la aplicación
// BrowserWindow → crea ventanas
// ipcMain → recibe mensajes del frontend (ipcRenderer)

const path = require('path')  // Importa path para manejar rutas
const db = require('./database')  // Importa la base de datos (al requerirlo, ya se ejecuta y crea tablas)
const auth = require('./backend/login_registro')  // Importa el módulo de autenticación (login y registro)
const recuperarPass = require('./backend/recuperarPassword')

let mainWindow  // Variable global para la ventana principal

// Función para crear la ventana de la aplicación
function createWindow() {

  // Crea una nueva ventana
  mainWindow = new BrowserWindow({
    width: 1200,   // ancho de la ventana
    height: 800,   // alto de la ventana
    autoHideMenuBar: true,

    webPreferences: {
      nodeIntegration: true,   // permite usar require() en el frontend
      contextIsolation: false  // desactiva aislamiento
    }
  })

  // Carga el archivo principal (tu login)
  mainWindow.loadFile('index.html')
}

// Cuando Electron está listo, crea la ventana
app.whenReady().then(() => {
  createWindow()
})

// Cuando se cierran todas las ventanas
app.on('window-all-closed', () => {
  // En Mac (darwin) las apps siguen abiertas, en otros sistemas se cierran
  if (process.platform !== 'darwin') app.quit()
})

// ================================
// LOGIN
// ================================
// Escucha el evento 'login' desde el frontend (ipcRenderer)
ipcMain.on('login', (event, datos) => {
  // Llama a la función login del backend
  const respuesta = auth.login(datos)
  // Envía la respuesta de vuelta al frontend
  event.reply('login-respuesta', respuesta)
})

// ================================
// REGISTRO
// ================================
ipcMain.on('registrar-usuario', (event, datos) => {
  const respuesta = auth.registrar(datos)
  event.reply('registro-respuesta', respuesta)
})

// ================================
// RECUPERAR CONTRASEÑA - Paso 1: enviar código
// ================================
ipcMain.on('enviar-codigo-reset', async (event, datos) => {
  const respuesta = await recuperarPass.enviarCodigo(datos.correo)
  event.reply('codigo-reset-respuesta', respuesta)
})

// ================================
// RECUPERAR CONTRASEÑA - Paso 2: verificar código y cambiar password
// ================================
ipcMain.on('cambiar-password', (event, datos) => {
  const respuesta = recuperarPass.cambiarPassword(datos.correo, datos.codigo, datos.nuevaPassword)
  event.reply('cambiar-password-respuesta', respuesta)
})