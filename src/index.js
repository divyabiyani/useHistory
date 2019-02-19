import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import useHistory from "./components/useHistory";
import Loader from "./components/Loader/index.jsx";

import "./styles.css";

function App() {
  const [name, setName] = useState("");
  const {
    state: { loading, items, currentItemDetail, currentItemNo, error },
    prev,
    next,
    add,
    goto,
    setError
  } = useHistory("https://api.github.com/users/", {});

  useEffect(
    function() {
      if (currentItemNo >= 0) setName(items[currentItemNo]);
    },
    [currentItemNo]
  );

  let errorMsg = error;
  function onClickHandler(event) {
    add(name);
    event.preventDefault();
  }

  function onChangeHandler(event) {
    setError(null);
    setName(event.target.value);
  }

  return (
    <div className="App o-flex-layout">
      <div className="u-half">
        {loading ? (
          <Loader />
        ) : (
          [
            <form onSubmit={onClickHandler}>
              <label>Enter Username: </label>
              <input type="text" onChange={onChangeHandler} value={name} />
              <button className={name != "" ? "" : "disabled"} type="submit">
                Search
              </button>
              <label
                onClick={() => prev()}
                className={currentItemNo <= 0 ? "btn disabled" : "btn"}
              >
                {"<"}
              </label>
              <label
                onClick={() => next()}
                className={
                  currentItemNo >= items.length - 1 ? "btn disabled" : "btn"
                }
              >
                {">"}
              </label>
            </form>,
            currentItemDetail && (
              <div>
                <h1>{currentItemDetail.name}</h1>
                <a href={currentItemDetail.profileUrl}>
                  {currentItemDetail.profileUrl}
                </a>
                <img src={currentItemDetail.profileImage} target="_blank" />
              </div>
            ),
            errorMsg && (
              <div className="danger">Github Profile {name} not found.</div>
            )
          ]
        )}
      </div>
      <div className="u-half">
        List of already search usernames:
        <ul>
          {items.map((item, index) => {
            return (
              <li className="user-name" onClick={() => goto(index)}>
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
