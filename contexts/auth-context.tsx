"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

interface User {
  id: string
  email: string
  // Add any other user properties you need
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({ id: firebaseUser.uid, email: firebaseUser.email || "" }) // Use the updated User interface

        // Check if user is admin
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid))
          if (userDoc.exists()) {
            setIsAdmin(userDoc.data().role === "admin")
          }
        } catch (error) {
          console.error("Error checking admin status:", error)
        }
      } else {
        setUser(null)
        setIsAdmin(false)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = auth.currentUser
      if (firebaseUser) {
        setUser({ id: firebaseUser.uid, email: firebaseUser.email || "" })
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAdmin }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

