import {
  SplashActionTypes,
  SplashState,
  SPLASH_ON_START,
  TOGGLE_INFO,
  UPDATE_SPLASH_BUTTON_TEXT,
  UPDATE_SPLASH_CONTENT,
  UPDATE_SPLASH_TITLE
} from "../../types/interfaces";
import {
  splash,
  splashButtonText,
  splashContent,
  splashOnStart,
  splashTitle
} from "../../config/application.json";

const DEFAULT_STATE = {
  splash,
  splashButtonText,
  splashContent,
  splashOnStart,
  splashTitle
} as SplashState;

export default function (state = DEFAULT_STATE, action: SplashActionTypes): SplashState {
  switch (action.type) {
    case TOGGLE_INFO:
      return {
        ...state,
        splash: action.payload
      };
    case UPDATE_SPLASH_BUTTON_TEXT:
      return {
        ...state,
        splashButtonText: action.payload
      };
    case UPDATE_SPLASH_CONTENT:
      return {
        ...state,
        splashContent: action.payload
      };
    case SPLASH_ON_START:
      return {
        ...state,
        splashOnStart: action.payload
      };
    case UPDATE_SPLASH_TITLE:
      return {
        ...state,
        splashTitle: action.payload
      };
    default:
      return state;
  }
}
