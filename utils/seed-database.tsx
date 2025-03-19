"use client"

import { useState } from "react"
import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Check, AlertCircle } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

// Sample projects data
const sampleProjects = [
  {
    title: "SecureNet Analyzer",
    description:
      "An advanced network security analysis tool that detects and prevents potential cyber threats in real-time using AI/ML algorithms.",
    tags: ["Python", "Machine Learning", "Network Security"],
    demoUrl: "#",
    githubUrl: "#",
    featured: true,
    category: "security",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    title: "VulnScanner Pro",
    description:
      "Automated vulnerability scanner for web applications with detailed reporting and remediation recommendations.",
    tags: ["JavaScript", "Node.js", "Security Testing"],
    demoUrl: "#",
    githubUrl: "#",
    featured: false,
    category: "security",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    title: "CryptoGuard",
    description: "Blockchain security audit tool for smart contracts with automated vulnerability detection.",
    tags: ["Solidity", "Web3", "Smart Contracts"],
    demoUrl: "#",
    githubUrl: "#",
    featured: false,
    category: "security",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    title: "IoT Security Framework",
    description: "Comprehensive security framework for IoT devices with encryption and secure communication protocols.",
    tags: ["C++", "IoT", "Encryption"],
    demoUrl: "#",
    githubUrl: "#",
    featured: false,
    category: "security",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    title: "API Gateway Protector",
    description: "A security layer for API gateways that provides authentication, authorization, and rate limiting.",
    tags: ["JavaScript", "Node.js", "API", "Backend"],
    demoUrl: "#",
    githubUrl: "#",
    featured: false,
    category: "web",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    title: "Secure Chat Application",
    description: "End-to-end encrypted chat application with secure file sharing capabilities.",
    tags: ["JavaScript", "Node.js", "Encryption", "Frontend", "Backend"],
    demoUrl: "#",
    githubUrl: "#",
    featured: false,
    category: "web",
    image: "/placeholder.svg?height=200&width=400",
  },
]

// Sample skill categories
const sampleSkillCategories = [
  {
    name: "Penetration Testing",
    icon: "Terminal",
  },
  {
    name: "Security Tools",
    icon: "Shield",
  },
  {
    name: "Programming",
    icon: "Code",
  },
  {
    name: "Infrastructure",
    icon: "Cloud",
  },
]

// Sample skills
const sampleSkills = [
  { name: "Network Penetration", level: 95, categoryName: "Penetration Testing" },
  { name: "Web Application Security", level: 90, categoryName: "Penetration Testing" },
  { name: "Mobile App Security", level: 85, categoryName: "Penetration Testing" },
  { name: "IoT Security", level: 80, categoryName: "Penetration Testing" },
  { name: "Metasploit", level: 95, categoryName: "Security Tools" },
  { name: "Wireshark", level: 90, categoryName: "Security Tools" },
  { name: "Burp Suite", level: 92, categoryName: "Security Tools" },
  { name: "Nmap", level: 88, categoryName: "Security Tools" },
  { name: "Python", level: 90, categoryName: "Programming" },
  { name: "Shell Scripting", level: 85, categoryName: "Programming" },
  { name: "C/C++", level: 75, categoryName: "Programming" },
  { name: "JavaScript", level: 80, categoryName: "Programming" },
  { name: "Cloud Security", level: 88, categoryName: "Infrastructure" },
  { name: "Docker Security", level: 85, categoryName: "Infrastructure" },
  { name: "Kubernetes Security", level: 82, categoryName: "Infrastructure" },
  { name: "CI/CD Security", level: 80, categoryName: "Infrastructure" },
]

// Sample profile data
const sampleProfile = {
  name: "Alice Secure",
  title: "Cybersecurity Expert & Ethical Hacker",
  location: "San Francisco, CA",
  bio: "With over 8 years of experience in cybersecurity, I've helped organizations protect their digital assets and strengthen their security posture against evolving threats in the digital landscape.",
  email: "contact@alicesecure.com",
  phone: "+1 (555) 123-4567",
  website: "https://alicesecure.com",
  github: "https://github.com/alicesecure",
  linkedin: "https://linkedin.com/in/alicesecure",
  twitter: "https://twitter.com/alicesecure",
}

export default function DatabaseSeeder() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<string>("")

  const seedDatabase = async () => {
    setLoading(true)
    setSuccess(false)
    setError(null)
    setProgress("Starting database seeding...")

    try {
      // 1. Seed skill categories
      setProgress("Seeding skill categories...")
      const categoryIds: Record<string, string> = {}

      for (const category of sampleSkillCategories) {
        const categoryId = uuidv4()
        categoryIds[category.name] = categoryId

        await setDoc(doc(db, "skillCategories", categoryId), {
          name: category.name,
          icon: category.icon,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      // 2. Seed skills
      setProgress("Seeding skills...")
      for (const skill of sampleSkills) {
        const skillId = uuidv4()
        await setDoc(doc(db, "skills", skillId), {
          name: skill.name,
          level: skill.level,
          category: categoryIds[skill.categoryName],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      // 3. Seed projects
      setProgress("Seeding projects...")
      for (const project of sampleProjects) {
        const projectId = uuidv4()
        await setDoc(doc(db, "projects", projectId), {
          ...project,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      // 4. Seed profile
      setProgress("Seeding profile data...")
      await setDoc(doc(db, "profile", "main"), {
        ...sampleProfile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      setProgress("Database seeding completed successfully!")
      setSuccess(true)
    } catch (err) {
      console.error("Error seeding database:", err)
      setError("An error occurred while seeding the database. Check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-black/50 border-green-900/50">
      <CardHeader>
        <CardTitle className="text-green-400">Database Seeder</CardTitle>
        <CardDescription>Populate your Firebase database with sample data for testing</CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-4 bg-green-900/20 border-green-900/50">
            <Check className="h-4 w-4 text-green-400" />
            <AlertTitle className="text-green-400">Success</AlertTitle>
            <AlertDescription>Database has been successfully seeded with sample data.</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-4 bg-red-900/20 border-red-900/50" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <div className="flex items-center space-x-2 mb-4 p-4 bg-green-900/10 border border-green-900/30 rounded-md">
            <Loader2 className="h-4 w-4 text-green-400 animate-spin" />
            <p className="text-sm text-green-400">{progress}</p>
          </div>
        )}

        <p className="text-sm text-gray-400 mb-4">
          This utility will populate your Firebase database with sample projects, skills, and profile data. Use this to
          quickly set up your portfolio with test data.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={seedDatabase} className="w-full bg-green-500 hover:bg-green-600 text-black" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Seeding Database...
            </>
          ) : (
            "Seed Database"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

