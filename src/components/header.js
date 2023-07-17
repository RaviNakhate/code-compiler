import React, { useEffect, useState } from "react";
import "./header.css";
import Modal from "react-modal";
import Model from "./model.js";
import { useSelector, useDispatch } from "react-redux";

const Header = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      zindex: "1",
      width: "fit-content",
      boxShadow:
        "0 3.2px 7.2px 0 rgb(0 0 0 / 13%), 0 0.6px 1.8px 0 rgb(0 0 0 / 11%)",
    },
  };

  const onLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const openModal = () => {
    dispatch({ type: "true" });
  };

  const closeModal = () => {
    dispatch({ type: "false" });
  };

  return (
    <header className="header">
      <h1>Code Editor</h1>
      {localStorage.getItem("token") ? (
        <div>
          <span className="label-username">
            {localStorage.getItem("username")}
          </span>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div>
          <button className="btn-login-header" onClick={openModal}>
            Login
          </button>
          <button className="btn-register-header" onClick={openModal}>
            Register
          </button>
        </div>
      )}
      {/*  */}
      <Modal
        isOpen={state}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <Model closeModal={closeModal} />
        {/* Content of the modal */}
        {/* You can customize the modal content based on whether it is for login or register */}
        {/*  <button onClick={closeModal}>Close Modal</button> */}
      </Modal>
    </header>
  );
};

export default Header;
