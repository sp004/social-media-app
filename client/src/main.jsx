import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './app/store'
import App from './App'
import ChatContextProvider from './context/ChatContext'
import SocketProvider from './context/socketContext'
import ThemeProvider from './context/themeContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <SocketProvider>
            <ChatContextProvider>
              <Router>
                <Routes>
                  <Route path='/*' element={<App />} />
                </Routes>
              </Router>
            </ChatContextProvider>
          </SocketProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
