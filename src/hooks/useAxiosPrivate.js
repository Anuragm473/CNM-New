import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
const useAxiosPrivate = () => {
  const { user } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {

          config.headers["Authorization"] = `Bearer ${user?.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [user, axiosPrivate]);
  return axiosPrivate;
};
export default useAxiosPrivate;
