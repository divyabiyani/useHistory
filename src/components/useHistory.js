import { useReducer, useEffect } from "react";
import axios from "axios";
import _ from "lodash";

const initialState = {
  items: [],
  currentItemDetail: null,
  error: null,
  loading: false,
  currentItemNo: -1
};

function reducer(state, action) {
  switch (action.type) {
    case "prev":
      return {
        ...state,
        currentItemNo: state.currentItemNo - 1
      };

    case "next":
      return {
        ...state,
        currentItemNo: state.currentItemNo + 1
      };

    case "add":
      const items = _.clone(state.items);
      items.push(action.payload);
      return {
        ...state,
        items,
        currentItemNo: items.length - 1
      };

    case "goto":
      return {
        ...state,
        currentItemNo: action.payload
      };

    case "load":
      return {
        ...state,
        loading: true,
        currentItemDetail: null,
        error: null
      };

    case "success":
      return {
        ...state,
        loading: false,
        currentItemDetail: action.payload
      };

    case "error":
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      throw new Error("Missing action type");
  }
}

export default function useHistory(url, data) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...data
  });
  let { currentItemNo, items } = state;

  function prev() {
    if (currentItemNo > 0) {
      dispatch({ type: "prev" });
    }
  }

  function next() {
    if (currentItemNo < items.length - 1) {
      dispatch({ type: "next" });
    }
  }

  function add(data) {
    dispatch({ type: "add", payload: data });
  }

  function goto(data) {
    dispatch({ type: "goto", payload: data });
  }

  function setError(data) {
    dispatch({ type: "error", payload: data });
  }

  useEffect(
    function() {
      if (items.length > 0) {
        dispatch({ type: "load" });
        axios
          .get(url + encodeURIComponent(state.items[state.currentItemNo]))
          .then(function(resp) {
            setTimeout(function() {
              const { name, avatar_url, html_url } = resp.data;
              dispatch({
                type: "success",
                payload: {
                  name,
                  profileImage: avatar_url,
                  profileUrl: html_url
                }
              });
            }, 2000);
          })
          .catch(function(err) {
            const error = err.data;
            dispatch({ type: "error", payload: { error } });
          });
      }
    },
    [currentItemNo, items]
  );

  return { state, prev, next, add, goto, setError };
}
