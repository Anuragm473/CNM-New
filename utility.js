import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CryptoJS from "crypto-js";

// Secret key for encryption (store this securely in an environment variable in production)
const SECRET_KEY = import.meta.env.VITE_SECRETKEY;

// Encrypt data
const encryptData = (data) => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

// Decrypt data
const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};



export const saveToLocalStorage = (key, value) => {
  const encryptedValue = encryptData(value);
  if (encryptedValue) {
    localStorage.setItem(key, encryptedValue);
  }
};

export const getFromLocalStorage = (key) => {
  const encryptedValue = localStorage.getItem(key);
  if (encryptedValue) {
    return decryptData(encryptedValue);
  }
  return null;
};



export function toastMessage(message) {
  toast(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light"
    });
}
export function formatDate(isoString) {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

  