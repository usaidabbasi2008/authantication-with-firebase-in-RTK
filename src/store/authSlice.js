import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// redux mein sirf kaam ka data rakhte hain
export const pickUser = (u) => ({
  uid: u.uid,
  email: u.email,
  name: u.displayName,
  photo: u.photoURL,
});

// firestore ki "users" collection mein data save
// await nahi lagaya taake login na ruke, error console mein dikhega
const saveUser = (u, provider) => {
  setDoc(
    doc(db, "users", u.uid),
    {
      uid: u.uid,
      email: u.email,
      name: u.displayName || "",
      photo: u.photoURL || "",
      provider: provider,
      lastLogin: serverTimestamp(),
    },
    { merge: true }
  ).catch((e) => console.error("Firestore save error:", e.code, e.message));
};

const getError = (code) => {
  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Please enter the correct password";
    case "auth/user-not-found":
      return "No account found with this email";
    case "auth/email-already-in-use":
      return "This email is already registered";
    case "auth/weak-password":
      return "Password must be at least 6 characters";
    case "auth/invalid-email":
      return "Please enter a valid email";
    case "auth/popup-closed-by-user":
      return "Sign in popup was closed";
    default:
      return "Something went wrong, try again";
  }
};

export const loginWithEmail = createAsyncThunk(
  "auth/loginWithEmail",
  async ({ email, password, remember }, { rejectWithValue }) => {
    try {
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );
      const res = await signInWithEmailAndPassword(auth, email, password);
      saveUser(res.user, "email");
      return pickUser(res.user);
    } catch (e) {
      return rejectWithValue(getError(e.code));
    }
  }
);

export const signupWithEmail = createAsyncThunk(
  "auth/signupWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      saveUser(res.user, "email");
      return pickUser(res.user);
    } catch (e) {
      return rejectWithValue(getError(e.code));
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await signInWithPopup(auth, new GoogleAuthProvider());
      saveUser(res.user, "google");
      return pickUser(res.user);
    } catch (e) {
      return rejectWithValue(getError(e.code));
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (email, { rejectWithValue }) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return "Password reset link sent to your email";
    } catch (e) {
      return rejectWithValue(getError(e.code));
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await signOut(auth);
});

const authSlice = createSlice({
  name: "auth",
  // ready = firebase ne check kar liya ke user logged in hai ya nahi
  initialState: { user: null, ready: false, loading: false, error: "", message: "" },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.ready = true;
    },
    clearError: (state) => {
      state.error = "";
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    [loginWithEmail, signupWithEmail, googleLogin].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = "";
          state.message = "";
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    });

    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.message = "";
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;