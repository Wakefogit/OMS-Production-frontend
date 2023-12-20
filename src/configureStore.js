import { createStore, applyMiddleware } from "redux";
import rootReducer from "./Components/Store/Reducer";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./Components/Store/Saga";

const sagaMiddleware = createSagaMiddleware();

export default function configureStore() {
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(rootSaga);
  return store;
}
