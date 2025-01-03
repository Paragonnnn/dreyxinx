import { createContext, useEffect, useState } from "react";
import api from "./api";
import Cookies from "js-cookie";

export const userContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const refreshToken = localStorage.getItem("refreshToken");
  useEffect(() => {
    const getNewAccessToken = async () => {
      try {
        const response = await api.get("/user/refresh-token",{
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }, {
          withCredentials: true,
        });
        setAccessToken(response.data.accessToken);
      } catch (error) {
        console.log(error);
      }
    };
    getNewAccessToken();
  }, []);

  useEffect(() => {
    if (!user && accessToken) {
      api
        .get("/user/get-loggedIn-user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user,accessToken]);
  return (
    <userContext.Provider
      value={{ user, setUser, accessToken, setAccessToken, }}
    >
      {children}
    </userContext.Provider>
  );
};
