import React, { useState } from "react";
import "./modal.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { urlApi } from "../utils/constant";

const Model = ({ closeModal }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${urlApi}/auth/login`, {
        username,
        password,
      });
      if (data.error) {
        toast.error(data.error, { theme: "dark" });
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("key", data.key);
        localStorage.setItem("username", username);
        toast.success("Login Success", { theme: "dark" });
        closeModal();
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRegister = async () => {
    try {
      const { data } = await axios.post(
        `${urlApi}/auth//register`,
        {
          username,
          password,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.error) {
        toast.error(data.error, { theme: "dark" });
      } else {
        toast.success("Registered", { theme: "dark" });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <form>
        <h1>Login and Register</h1>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            className="input-username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            className="input-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="buttons">
          <button type="button" onClick={handleLogin} className="btn-login">
            Login
          </button>
          <button
            type="button"
            onClick={handleRegister}
            className="btn-register"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Model;
