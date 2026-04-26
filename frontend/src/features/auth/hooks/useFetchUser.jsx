/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";

export default function useFetchUser() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    try {
      const userdata = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/register`,
        formData,
      );
      console.log("Success:", userdata.data);
      alert("Registration Successful!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.response?.data || error.message;
      console.error("Error registering user:", errorMessage);
      alert(`Registration Failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleChange, handleRegister, isLoading, formData };
}
