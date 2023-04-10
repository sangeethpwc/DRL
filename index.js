import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import rootReducer from './app/reducer';
import { configureStore} from '@reduxjs/toolkit'


const store = configureStore({
    reducer: rootReducer,
    // middleware: [...getDefaultMiddleware({immutableCheck: false})]
})

const ReduxApp = () => (
    <Provider store={store}>
        <App />
        {/* <RootContainer /> */}
    </Provider>
)

AppRegistry.registerComponent(appName, () => ReduxApp);
