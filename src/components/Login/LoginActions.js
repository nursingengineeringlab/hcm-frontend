import axios from "axios";
import { push } from "connected-react-router";
import { toast } from "react-toastify";
import { SET_TOKEN, SET_CURRENT_USER, UNSET_CURRENT_USER } from "./LoginTypes";
import { setAxiosAuthToken, setDashBoardAuthToken, toastOnError } from "../../utils/Utils";

export const getToken = (userData) => dispatch => {
  axios
    .post("/api/v1/auth/email/", userData)
    .then(response => {
      const { detail } = response.data;
      toast.info(detail);
    })
    .catch(error => {
      toastOnError(error);
    });
};

export const login = (userData, redirectTo) => dispatch => {
  axios
    .post("/api/v1/auth/token/", userData)
    .then(response => {
      const { token } = response.data;
      setAxiosAuthToken(token);
      setDashBoardAuthToken(token);
      dispatch(setToken(token));
      dispatch(getCurrentUser(redirectTo));
    })
    .catch(error => {
      dispatch(unsetCurrentUser());
      toastOnError(error);
    });
};

export const getCurrentUser = redirectTo => dispatch => {
  axios
    .get("/api/v1/users/me/")
    .then(response => {
      const user = {
        username: response.data.username,
        email: response.data.email
      };
      dispatch(setCurrentUser(user, redirectTo));
    })
    .catch(error => {
      dispatch(unsetCurrentUser());
      toastOnError(error);
    });
};

export const setCurrentUser = (user, redirectTo) => dispatch => {
  localStorage.setItem("user", JSON.stringify(user));
  dispatch({
    type: SET_CURRENT_USER,
    payload: user
  });

  if (redirectTo !== "") {
    dispatch(push(redirectTo));
  }
};

export const setToken = token => dispatch => {
  setAxiosAuthToken(token);
  setDashBoardAuthToken(token);
  localStorage.setItem("token", token);
  dispatch({
    type: SET_TOKEN,
    payload: token
  });
};

export const unsetCurrentUser = () => dispatch => {
  setAxiosAuthToken("");
  setDashBoardAuthToken("");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch({
    type: UNSET_CURRENT_USER
  });
};

export const logout = () => dispatch => {
  axios
    .post("/api/v1/token/logout/")
    .then(response => {
      dispatch(unsetCurrentUser());
      dispatch(push("/"));
      toast.success("Logout successful.");
    })
    .catch(error => {
      dispatch(unsetCurrentUser());
      toastOnError(error);
    });
};
