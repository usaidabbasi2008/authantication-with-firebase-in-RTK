"use client";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { store } from "@/store/store";
import { setUser, pickUser } from "@/store/authSlice";

// page refresh par bhi pata chal jaye ke user logged in hai
function AuthListener({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      dispatch(setUser(u ? pickUser(u) : null));
    });
    return () => unsub();
  }, [dispatch]);

  return children;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthListener>{children}</AuthListener>
    </Provider>
  );
}