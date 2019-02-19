import { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";

const initialState = {
  items: [],
  currentItemDetail: null,
  error: null,
  loading: false,
  currentItemNo: -1
};

export default function useHistory(url, data) {
  const [state, setState] = useState({
    ...initialState,
    ...data
  });
  let { currentItemNo, items } = state;

  function prev() {
    if (currentItemNo > 0) {
      setState({ ...state, currentItemNo: state.currentItemNo - 1 });
    }
  }

  function next() {
    if (currentItemNo < items.length - 1) {
      setState({ ...state, currentItemNo: state.currentItemNo + 1 });
    }
  }

  function add(data) {
    const items = _.clone(state.items);
    items.push(data);
    setState({ ...state, items, currentItemNo: items.length - 1 });
  }

  function goto(data) {
    setState({ ...state, currentItemNo: data });
  }

  function setError(data) {
    setState({ ...state, loading: false, error: data });
  }

  function setLoad() {
    setState({ ...state, loading: true, currentItemDetail: null, error: null });
  }

  function setSuccess(data) {
    setState({ ...state, loading: false, currentItemDetail: data });
  }

  useEffect(
    function() {
      if (items.length > 0) {
        setLoad();
        axios
          .get(url + encodeURIComponent(state.items[state.currentItemNo]))
          .then(function(resp) {
            setTimeout(function() {
              const { name, avatar_url, html_url } = resp.data;
              setSuccess({
                name,
                profileImage: avatar_url,
                profileUrl: html_url
              });
            }, 2000);
          })
          .catch(function(err) {
            setError(err.data);
          });
      }
    },
    [currentItemNo, items]
  );

  return { state, prev, next, add, goto, setError };
}
