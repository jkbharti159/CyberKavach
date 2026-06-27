import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  deleteUser,
  User as FirebaseUser
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { auth, db, hasFirebaseConfig } from "../firebase/config";
import { UserSession, UserRole } from "../types";

// Local storage fallback for iframe sandboxing
const safeStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return (window as any)[`__fallback_${key}`] || null;
    }
  },
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      (window as any)[`__fallback_${key}`] = value;
    }
  },
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      delete (window as any)[`__fallback_${key}`];
    }
  }
};

interface UserProfileData {
  uid: string;
  fullName: string;
  email: string;
  role: UserRole;
  provider: string;
  createdAt?: any;
  lastLogin?: any;
  emailVerified: boolean;
  status: string;
  photoURL?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfileData | null;
  session: UserSession | null;
  loading: boolean;
  error: string | null;
  signUpWithEmail: (fullName: string, email: string, password: string) => Promise<FirebaseUser>;
  loginWithEmail: (email: string, password: string) => Promise<FirebaseUser>;
  loginWithGoogle: () => Promise<FirebaseUser>;
  loginAsGuest: () => Promise<FirebaseUser>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
  clearError: () => void;
  updateProfileInfo: (fullName: string) => Promise<void>;
  startSimulatedSession: (fullName?: string, role?: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(() => {
    const cached = safeStorage.getItem("cyberkavach_profile");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [session, setSession] = useState<UserSession | null>(() => {
    const cached = safeStorage.getItem("cyberkavach_session");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(hasFirebaseConfig);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Sync profile with local storage
  useEffect(() => {
    if (profile) {
      safeStorage.setItem("cyberkavach_profile", JSON.stringify(profile));
    } else {
      safeStorage.removeItem("cyberkavach_profile");
    }
  }, [profile]);

  // Sync session with local storage to support quick fallback loads
  useEffect(() => {
    if (session) {
      safeStorage.setItem("cyberkavach_session", JSON.stringify(session));
    } else {
      safeStorage.removeItem("cyberkavach_session");
    }
  }, [session]);

  // Auth State Listener
  useEffect(() => {
    if (!hasFirebaseConfig) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          // Fetch additional profile data from Firestore
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          let role: UserRole = "User";
          let fullName = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Anonymous User";
          let provider = firebaseUser.providerData[0]?.providerId || "password";
          let profileData: UserProfileData;

          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfileData;
            role = data.role || "User";
            fullName = data.fullName || fullName;
            provider = data.provider || provider;
            profileData = {
              ...data,
              uid: firebaseUser.uid,
              emailVerified: firebaseUser.emailVerified,
            };

            // Update emailVerified state in Firestore if it changed
            if (data.emailVerified !== firebaseUser.emailVerified) {
              await updateDoc(userRef, { emailVerified: firebaseUser.emailVerified });
              profileData.emailVerified = firebaseUser.emailVerified;
            }
          } else {
            // Document doesn't exist yet, construct fallback from Firebase auth metadata
            if (firebaseUser.isAnonymous) {
              role = "Guest";
              fullName = "Guest Analyst";
              provider = "anonymous";
            } else if (provider === "google.com") {
              role = "User";
              provider = "google";
            }

            profileData = {
              uid: firebaseUser.uid,
              fullName,
              email: firebaseUser.email || (firebaseUser.isAnonymous ? "guest_analyst@cyberkavach.local" : ""),
              role,
              provider,
              emailVerified: firebaseUser.emailVerified,
              status: "Active",
              photoURL: firebaseUser.photoURL || undefined
            };

            // Non-blocking save to Firestore
            setDoc(userRef, {
              ...profileData,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
            }).catch(e => console.error("Could not seed initial user doc to Firestore:", e));
          }

          setProfile(profileData);

          // Construct standard UserSession
          const token = await firebaseUser.getIdToken();
          setSession({
            username: fullName,
            email: firebaseUser.email || (firebaseUser.isAnonymous ? "guest_analyst@cyberkavach.local" : ""),
            role,
            token
          });
        } catch (err: any) {
          console.error("Error building authenticated user profile details:", err);
          // Set standard fallback session so the app does not break
          setSession({
            username: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User Analyst",
            email: firebaseUser.email || "guest@cyberkavach.local",
            role: firebaseUser.isAnonymous ? "Guest" : "User",
            token: ""
          });
        }
      } else {
        setUser(null);
        setProfile(null);
        setSession(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // SIGN UP
  const signUpWithEmail = async (fullName: string, email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth display name
      await updateProfile(user, { displayName: fullName });

      // Create permanent document in Firestore
      const userRef = doc(db, "users", user.uid);
      const initialProfile: UserProfileData = {
        uid: user.uid,
        fullName,
        email,
        role: "User", // Default role
        provider: "password",
        emailVerified: false,
        status: "Active"
      };

      await setDoc(userRef, {
        ...initialProfile,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });

      // Send verification email
      await sendEmailVerification(user);

      setProfile(initialProfile);
      return user;
    } catch (err: any) {
      console.error("Sign up error:", err);
      let friendlyMessage = "Failed to construct new cybersecurity account.";
      if (err.code === "auth/email-already-in-use") {
        friendlyMessage = "An account with this email address already exists in CyberKavach.";
      } else if (err.code === "auth/invalid-email") {
        friendlyMessage = "The provided email format is invalid.";
      } else if (err.code === "auth/weak-password") {
        friendlyMessage = "The password does not meet safety limits.";
      }
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const loginWithEmail = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login in Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
        emailVerified: user.emailVerified
      }).catch(err => console.warn("Could not update last login timestamp:", err));

      return user;
    } catch (err: any) {
      console.error("Login error:", err);
      let friendlyMessage = "Access denied. Credentials do not match our database.";
      if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        friendlyMessage = "Access denied. Invalid email or password signature.";
      } else if (err.code === "auth/user-disabled") {
        friendlyMessage = "This cybersecurity node has been suspended by the Admin.";
      } else if (err.code === "auth/too-many-requests") {
        friendlyMessage = "Too many login attempts. Node locked. Please try again later.";
      }
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const initialProfile = {
          uid: user.uid,
          fullName: user.displayName || user.email?.split("@")[0] || "Authorized Agent",
          email: user.email || "",
          role: "User",
          provider: "google",
          photoURL: user.photoURL || undefined,
          emailVerified: true,
          status: "Active"
        };
        await setDoc(userRef, {
          ...initialProfile,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
      } else {
        await updateDoc(userRef, {
          lastLogin: serverTimestamp(),
          emailVerified: true,
          photoURL: user.photoURL || undefined
        });
      }

      return user;
    } catch (err: any) {
      console.error("Google authentication error:", err);
      let friendlyMessage = "Google identity handshake failed or was cancelled.";
      if (err.code === "auth/popup-blocked") {
        friendlyMessage = "Auth popup was blocked by browser. Please allow popups for CyberKavach.";
      } else if (err.code === "auth/popup-closed-by-user") {
        friendlyMessage = "Handshake aborted. Authentication window closed by operator.";
      } else if (err.code === "auth/configuration-not-found" || err.message?.includes("configuration-not-found")) {
        friendlyMessage = "DEVELOPER WARNING: Google Sign-In is not enabled in Firebase Console. Please enable 'Google' under Authentication > Sign-in Method. You can also bypass this by using the 'Simulate Session' option below.";
      } else if (err.code === "auth/unauthorized-domain" || err.message?.includes("unauthorized-domain")) {
        const domain = typeof window !== "undefined" ? window.location.hostname : "this domain";
        friendlyMessage = `DEVELOPER WARNING: Authorized domain error. The host '${domain}' is not authorized in your Firebase Project. Please go to Firebase Console > Authentication > Settings > Authorized Domains and add '${domain}' to the list. You can bypass this by clicking 'Bypass & Launch Offline Demo Mode'.`;
      }
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  // ANONYMOUS GUEST LOGIN
  const loginAsGuest = async () => {
    setError(null);
    setLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const initialProfile = {
        uid: user.uid,
        fullName: "Guest Analyst",
        email: "guest_analyst@cyberkavach.local",
        role: "Guest" as UserRole,
        provider: "anonymous",
        emailVerified: false,
        status: "Active"
      };

      await setDoc(userRef, {
        ...initialProfile,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });

      return user;
    } catch (err: any) {
      console.error("Anonymous authentication error:", err);
      let friendlyMessage = "Guest Analyst session instantiation failed.";
      if (err.code === "auth/configuration-not-found" || err.code === "auth/operation-not-allowed" || err.message?.includes("configuration-not-found")) {
        friendlyMessage = "DEVELOPER WARNING: Anonymous Auth is not enabled in Firebase Console. Please enable 'Anonymous' under Authentication > Sign-in Method. You can also bypass this by using the 'Simulate Session' option below.";
      }
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT (SECURELY CLEARS EVERYTHING)
  const logout = async () => {
    setError(null);
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (profile?.provider === "simulated") {
        // Just clear state directly for simulated sessions
      } else if (currentUser && currentUser.isAnonymous) {
        // Automatically delete or invalidate guest sessions on logout
        const userRef = doc(db, "users", currentUser.uid);
        // Clean up guest database entry if possible
        await deleteUser(currentUser).catch(e => console.warn("Failed to delete anonymous user auth context:", e));
      } else {
        await signOut(auth);
      }
      
      setUser(null);
      setProfile(null);
      setSession(null);
      safeStorage.removeItem("cyberkavach_session");
    } catch (err: any) {
      console.error("Logout error:", err);
      setError("Secure system session termination failed.");
    } finally {
      setLoading(false);
    }
  };

  // OFFLINE SIMULATION FALLBACK
  const startSimulatedSession = (fullName: string = "Simulated Analyst", role: UserRole = "Enterprise") => {
    setError(null);
    setLoading(true);
    const simulatedUid = "simulated_" + Math.random().toString(36).substring(2, 11);
    
    // Construct simulated firebase-like user
    const simulatedUser = {
      uid: simulatedUid,
      email: "guest_analyst@cyberkavach.local",
      displayName: fullName,
      emailVerified: true,
      isAnonymous: false,
    } as any;

    const initialProfile: UserProfileData = {
      uid: simulatedUid,
      fullName,
      email: "guest_analyst@cyberkavach.local",
      role,
      provider: "simulated",
      emailVerified: true,
      status: "Active",
      createdAt: { seconds: Date.now() / 1000 },
      lastLogin: { seconds: Date.now() / 1000 }
    };

    setUser(simulatedUser);
    setProfile(initialProfile);
    setSession({
      username: fullName,
      email: "guest_analyst@cyberkavach.local",
      role,
      token: "simulated_token_" + Date.now()
    });
    setLoading(false);
  };

  // FORGOT PASSWORD
  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      console.error("Forgot password error:", err);
      let friendlyMessage = "Could not transmit password recovery sequence.";
      if (err.code === "auth/user-not-found") {
        friendlyMessage = "No active node registered with this email address.";
      } else if (err.code === "auth/invalid-email") {
        friendlyMessage = "Invalid email format.";
      }
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  // SEND VERIFICATION EMAIL
  const sendVerificationEmail = async () => {
    setError(null);
    if (!auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (err: any) {
      console.error("Email verification send error:", err);
      setError("Failed to transmit verification instructions. Try again shortly.");
      throw err;
    }
  };

  // SWITCH ROLE (DB PERSISTED + METADATA SYNCED)
  const switchRole = async (newRole: UserRole) => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { role: newRole });
      
      setProfile(prev => prev ? { ...prev, role: newRole } : null);
      setSession(prev => prev ? { ...prev, role: newRole } : null);
    } catch (err) {
      console.error("Could not execute role upgrade:", err);
      // Local state fallback in case of Firestore access limits
      setSession(prev => prev ? { ...prev, role: newRole } : null);
    }
  };

  // EDIT PROFILE INFORMATION
  const updateProfileInfo = async (fullName: string) => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName: fullName });
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { fullName });
      
      setProfile(prev => prev ? { ...prev, fullName } : null);
      setSession(prev => prev ? { ...prev, username: fullName } : null);
    } catch (err) {
      console.error("Profile modification failed:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        error,
        signUpWithEmail,
        loginWithEmail,
        loginWithGoogle,
        loginAsGuest,
        logout,
        resetPassword,
        sendVerificationEmail,
        switchRole,
        clearError,
        updateProfileInfo,
        startSimulatedSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be called from inside AuthProvider.");
  }
  return context;
}
