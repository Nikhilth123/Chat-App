import { configureStore } from '@reduxjs/toolkit'
import authreducer from './slice/authslice'
import messagereducer from './slice/messageslice'
import chatreducer from './slice/chatslice'
import socketreducer from './slice/socketslice'
const store = configureStore({
  reducer: {
    auth:authreducer,
    chat:chatreducer,
    message:messagereducer,
    socket:socketreducer,
  },
  devTools:true,
})

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
