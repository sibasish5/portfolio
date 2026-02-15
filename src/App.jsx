import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, Sphere, MeshDistortMaterial, RoundedBox, Cylinder } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import * as THREE from 'three'
import { 
  HiMenu, HiX, HiArrowDown, HiDownload, HiMail, HiPhone, HiLocationMarker,
  HiExternalLink, HiAcademicCap, HiBriefcase, HiCode, HiChevronLeft, HiChevronRight
} from 'react-icons/hi'
import { FaGithub, FaLinkedin, FaTwitter, FaJava, FaAws, FaDocker } from 'react-icons/fa'
import { SiSpringboot, SiKubernetes, SiApachekafka, SiLeetcode } from 'react-icons/si'

// ============================================
// DATA
// ============================================
const personalInfo = {
  name: "Sibasish Tripathy",
  title: "Backend Engineer",
  subtitle: "Java & Spring Boot Expert",
  email: "sibasishtripathy6@gmail.com",
  phone: "+91-7749021122",
  location: "Hyderabad, India",
  linkedin: "https://linkedin.com/in/sibasish-",
  github: "https://github.com/sibasish5",
  summary: "Backend Engineer with 3+ years of experience building distributed backend systems using Java, Spring Boot, and Microservices."
}

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' }
]

const skills = {
  programming: [
    { name: 'Java', level: 95, color: '#ED8B00' },
    { name: 'Python', level: 75, color: '#3776AB' },
    { name: 'JavaScript', level: 70, color: '#F7DF1E' },
    { name: 'C/C++', level: 65, color: '#00599C' }
  ],
  backend: [
    { name: 'Spring Boot', level: 95, color: '#6DB33F' },
    { name: 'Microservices', level: 90, color: '#FF6B6B' },
    { name: 'REST APIs', level: 95, color: '#00D9FF' },
    { name: 'Kafka', level: 85, color: '#231F20' }
  ],
  database: [
    { name: 'MySQL', level: 90, color: '#4479A1' },
    { name: 'PostgreSQL', level: 85, color: '#336791' },
    { name: 'MongoDB', level: 75, color: '#47A248' },
    { name: 'Redis', level: 85, color: '#DC382D' }
  ],
  devops: [
    { name: 'AWS', level: 85, color: '#FF9900' },
    { name: 'Docker', level: 85, color: '#2496ED' },
    { name: 'Kubernetes', level: 80, color: '#326CE5' },
    { name: 'Git', level: 90, color: '#F05032' }
  ]
}

const experiences = [
  {
    title: 'Software Engineer',
    company: 'HighRadius Technologies',
    location: 'Hyderabad, India',
    period: 'Jan 2025 – Present',
    current: true,
    achievements: [
      'Engineered fault-tolerant data pipelines with Kafka & SQS, 99% uptime',
      'Optimized data-processing jobs handling 10M+ records',
      'Boosted API throughput (50K-70K daily calls) with Redis caching',
      'Deployed on AWS EC2 + Kubernetes, 99.9% uptime'
    ],
    tech: ['Java', 'Spring Boot', 'Kafka', 'AWS', 'Kubernetes', 'Redis']
  },
  {
    title: 'Associate Software Engineer',
    company: 'HighRadius Technologies',
    location: 'Hyderabad, India',
    period: 'Jul 2023 – Dec 2024',
    current: false,
    achievements: [
      'Migrated monolith to microservices, 35% faster deployment',
      'Built REST APIs for 8+ teams, 40% faster integration',
      'Reduced API response from 850ms to 110ms',
      'Conducted 15+ code reviews'
    ],
    tech: ['Java', 'Spring Boot', 'Microservices', 'MySQL', 'Redis']
  },
  {
    title: 'Software Developer Intern',
    company: 'HighRadius Technologies',
    location: 'Bhubaneswar, India',
    period: 'Jun 2022 – Jun 2023',
    current: false,
    achievements: [
      'NLP-based invoice matching, 85% less manual effort',
      'ML models for invoice prediction, 20hrs/month saved',
      'Feature extraction reducing cycle time by 15hrs'
    ],
    tech: ['Python', 'Machine Learning', 'NLP']
  }
]

const projects = [
  {
    title: 'Invoice Management Application',
    description: 'Full-stack invoice management with ML-powered payment prediction',
    tech: ['Java', 'Python', 'Spring Boot', 'React.js', 'MySQL'],
    features: ['React.js + Java Servlets UI', 'Python regression models', 'RESTful APIs'],
    github: 'https://github.com/sibasish5',
    color: '#0ea5e9'
  },
  {
    title: 'Smart Contact Manager',
    description: 'Secure contact management with authentication and profiles',
    tech: ['Java', 'Spring Boot', 'Hibernate', 'MySQL', 'JavaScript'],
    features: ['Profile management', 'Secure authentication', 'Responsive design'],
    github: 'https://github.com/sibasish5',
    color: '#8b5cf6'
  }
]

// ============================================
// UTILITIES
// ============================================
const GOOGLE_DRIVE_RESUME_LINK = 'https://drive.google.com/file/d/1q9eiBitUlINeR3Sudjd9NJF_BZGy8jEb/view?usp=sharing'

const downloadResume = () => {
  // Open Google Drive link in a new tab for viewing/downloading
  window.open(GOOGLE_DRIVE_RESUME_LINK, '_blank')
}

// Counter animation component
function CountUp({ end, duration = 2 }) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: true })
  
  useEffect(() => {
    if (!inView) return
    
    let current = 0
    const increment = end / (duration * 60) // 60fps
    const interval = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(interval)
      } else {
        setCount(Math.floor(current))
      }
    }, 1000 / 60)
    
    return () => clearInterval(interval)
  }, [inView, end, duration])
  
  return <span ref={ref}>{count}</span>
}

// ============================================
// 3D COMPONENTS
// ============================================
function ParticleField() {
  const particlesRef = useRef()
  const count = 1500

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const color1 = new THREE.Color('#0ea5e9')
    const color2 = new THREE.Color('#8b5cf6')
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
      
      const mixedColor = color1.clone().lerp(color2, Math.random())
      colors[i * 3] = mixedColor.r
      colors[i * 3 + 1] = mixedColor.g
      colors[i * 3 + 2] = mixedColor.b
    }
    return [positions, colors]
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  )
}

function FloatingOrbs() {
  const orbs = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      position: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 8 - 3],
      scale: Math.random() * 0.4 + 0.2,
      color: i % 2 === 0 ? '#0ea5e9' : '#8b5cf6',
      speed: Math.random() * 0.5 + 0.2
    })), [])

  return (
    <>
      {orbs.map((orb, i) => (
        <Float key={i} speed={orb.speed} rotationIntensity={0.5} floatIntensity={2} position={orb.position}>
          <Sphere args={[orb.scale, 32, 32]}>
            <MeshDistortMaterial color={orb.color} transparent opacity={0.3} distort={0.4} speed={2} roughness={0.1} metalness={0.8} />
          </Sphere>
        </Float>
      ))}
    </>
  )
}

function Background3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }} dpr={[1, 2]}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#0ea5e9" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8b5cf6" />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
        <FloatingOrbs />
        <ParticleField />
      </Canvas>
    </div>
  )
}

function RotatingCube() {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={meshRef}>
        <RoundedBox args={[2.5, 2.5, 2.5]} radius={0.2} smoothness={4}>
          <meshStandardMaterial color="#0ea5e9" metalness={0.3} roughness={0.4} transparent opacity={0.8} />
        </RoundedBox>
        <RoundedBox args={[2.52, 2.52, 2.52]} radius={0.2} smoothness={4}>
          <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.3} />
        </RoundedBox>
      </group>
    </Float>
  )
}

function SkillBar3D({ skill, index, total }) {
  const meshRef = useRef()
  const height = skill.level / 25
  const xPos = (index - (total - 1) / 2) * 1.2
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, height, 0.05)
    }
  })

  return (
    <group position={[xPos, 0, 0]}>
      <Cylinder ref={meshRef} args={[0.3, 0.3, 1, 32]} position={[0, 0.5, 0]} scale={[1, 0.1, 1]}>
        <meshStandardMaterial color={skill.color} metalness={0.3} roughness={0.4} emissive={skill.color} emissiveIntensity={0.1} />
      </Cylinder>
    </group>
  )
}

// ============================================
// UI COMPONENTS
// ============================================
function Loader() {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark-300"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-primary-400 font-medium"
        >
          Loading Experience...
        </motion.p>
      </div>
    </motion.div>
  )
}

function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      for (const item of [...navItems].reverse()) {
        const el = document.getElementById(item.href.slice(1))
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(item.href.slice(1))
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className={`flex items-center justify-between rounded-2xl px-6 py-3 transition-all ${isScrolled ? 'glass-card shadow-lg' : ''}`}>
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo('#home') }} className="text-2xl font-bold gradient-text">ST</a>
            
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(item.href) }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activeSection === item.href.slice(1) ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>

            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('#contact') }} className="hidden md:block btn-primary text-sm">
              Let's Talk
            </a>

            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="md:hidden p-2 rounded-xl glass-card">
              {isMobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 z-40 md:hidden px-4"
          >
            <div className="glass-card p-4 rounded-2xl flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(item.href) }}
                  className="px-4 py-3 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/5"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function SocialLinks() {
  const socials = [
    { Icon: FaGithub, href: personalInfo.github, color: '#fff' },
    { Icon: FaLinkedin, href: personalInfo.linkedin, color: '#0A66C2' },
    { Icon: SiLeetcode, href: 'https://leetcode.com', color: '#FFA116' }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      className="fixed left-6 top-1/4 z-10 hidden md:flex flex-col gap-4 pointer-events-none"
    >
      {socials.map(({ Icon, href, color }, i) => (
        <motion.a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2, y: -5 }}
          className="w-12 h-12 glass-card rounded-xl flex items-center justify-center group pointer-events-auto"
        >
          <Icon className="w-5 h-5 transition-colors" style={{ color }} />
        </motion.a>
      ))}
      <div className="w-px h-20 bg-gradient-to-b from-primary-500 to-transparent mx-auto" />
    </motion.div>
  )
}

function ThemeToggle({ isDark, setIsDark }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
      onClick={() => setIsDark(!isDark)}
      className="fixed right-6 bottom-6 z-30 w-12 h-12 glass-card rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? '🌙' : '☀️'}
      </motion.div>
    </motion.button>
  )
}

// ============================================
// SECTIONS
// ============================================
function HeroSection() {
  const techIcons = [FaJava, SiSpringboot, FaAws, FaDocker, SiKubernetes, SiApachekafka]

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Floating tech icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {techIcons.map((Icon, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
            className="absolute animate-float"
            style={{ top: `${20 + Math.random() * 60}%`, left: `${5 + i * 15}%`, animationDelay: `${i * 0.5}s` }}
          >
            <Icon className="w-10 h-10 md:w-16 md:h-16 text-primary-400" />
          </motion.div>
        ))}
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto text-center px-4"
      >
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block px-4 py-2 rounded-full glass-card text-sm text-primary-400 font-medium mb-6"
        >
          👋 Welcome to my portfolio
        </motion.span>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
        >
          Hi, I'm <span className="gradient-text">{personalInfo.name}</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 font-medium mb-6"
        >
          {personalInfo.title} | {personalInfo.subtitle}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          3+ years of experience building <span className="text-primary-400">distributed backend systems</span>,{' '}
          <span className="text-accent-400">microservices</span>, and{' '}
          <span className="text-pink-400">scalable APIs</span> that power modern applications.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10"
        >
          <div className="glass-card p-4 rounded-xl">
            <div className="text-2xl md:text-3xl font-bold gradient-text"><CountUp end={3} duration={2} />+</div>
            <div className="text-xs text-gray-500">Years Exp.</div>
          </div>
          <div className="glass-card p-4 rounded-xl">
            <div className="text-2xl md:text-3xl font-bold gradient-text"><CountUp end={99} duration={2} />.9%</div>
            <div className="text-xs text-gray-500">Uptime</div>
          </div>
          <div className="glass-card p-4 rounded-xl">
            <div className="text-2xl md:text-3xl font-bold gradient-text"><CountUp end={750} duration={2} />+</div>
            <div className="text-xs text-gray-500">DSA Problems</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#projects" onClick={(e) => { e.preventDefault(); document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn-primary flex items-center gap-2">
            View My Work <HiArrowDown className="w-5 h-5 animate-bounce" />
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); downloadResume() }} className="btn-secondary flex items-center gap-2">
            <HiDownload className="w-5 h-5" /> Download Resume
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-20 right-10"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <motion.div animate={{ height: ['0%', '30%', '0%'] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1 bg-gradient-to-b from-primary-500 to-transparent rounded-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function AboutSection() {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })

  const details = [
    { icon: HiLocationMarker, label: 'Location', value: personalInfo.location },
    { icon: HiBriefcase, label: 'Role', value: 'Software Engineer @HighRadius' },
    { icon: HiAcademicCap, label: 'Education', value: 'B.Tech in ECE' },
    { icon: HiMail, label: 'Email', value: personalInfo.email }
  ]

  // About section tech icons for animation
  const techItems = [
    { name: 'Java', icon: FaJava, color: '#ED8B00', delay: 0.1 },
    { name: 'Spring Boot', icon: SiSpringboot, color: '#6DB33F', delay: 0.3 },
    { name: 'Kafka', icon: SiApachekafka, color: '#231F20', delay: 0.5 },
    { name: 'AWS', icon: FaAws, color: '#FF9900', delay: 0.7 },
    { name: 'Docker', icon: FaDocker, color: '#2496ED', delay: 0.9 },
    { name: 'Kubernetes', icon: SiKubernetes, color: '#326CE5', delay: 1.1 },
    { name: 'MySQL', icon: () => <span className="text-2xl">🗄️</span>, color: '#4479A1', delay: 1.3 },
    { name: 'Redis', icon: () => <span className="text-2xl">⚡</span>, color: '#DC382D', delay: 1.5 }
  ]

  return (
    <section id="about" className="relative py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">About Me</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">Passionate about building scalable backend systems</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Animated Tech Stack */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={inView ? { opacity: 1, x: 0 } : {}} 
            transition={{ delay: 0.2 }} 
            className="h-[380px] w-full md:w-[33rem] glass-card md:rounded-l-2xl md:rounded-r-none rounded-2xl overflow-hidden flex items-center justify-center relative md:border-r-0 md:ml-auto"
          >
            {/* Floating tech icons */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Center circle */}
              <motion.div 
                className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/30"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Floating tech items in circle */}
              {techItems.map((tech, i) => (
                <motion.div
                  key={i}
                  className="absolute w-16 h-16 rounded-full glass-card flex items-center justify-center shadow-lg"
                  style={{
                    x: Math.cos((i / techItems.length) * Math.PI * 2) * 100,
                    y: Math.sin((i / techItems.length) * Math.PI * 2) * 100,
                  }}
                  animate={{
                    scale: [0.6, 1.1, 0.6],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 3,
                    delay: tech.delay,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  title={tech.name}
                >
                  <tech.icon className="w-8 h-8" style={{ color: tech.color }} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4 }} className="space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-4 gradient-text">Who I Am</h3>
              <p className="text-gray-300 leading-relaxed">{personalInfo.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {details.map((detail, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 + i * 0.1 }} className="glass-card p-4 rounded-xl hover:bg-white/10 transition-all">
                  <detail.icon className="w-5 h-5 text-primary-400 mb-2" />
                  <p className="text-xs text-gray-500 mb-1">{detail.label}</p>
                  <p className="text-sm font-medium text-gray-200 truncate">{detail.value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function SkillsSection() {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [activeCategory, setActiveCategory] = useState('programming')

  const categories = [
    { key: 'programming', label: 'Programming', icon: '💻' },
    { key: 'backend', label: 'Backend', icon: '⚙️' },
    { key: 'database', label: 'Databases', icon: '🗄️' },
    { key: 'devops', label: 'DevOps', icon: '☁️' }
  ]

  return (
    <section id="skills" className="relative py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Technical Skills</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">Technologies I work with daily</p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2 }} className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeCategory === cat.key
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                  : 'glass-card text-gray-400 hover:text-white'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* 3D Chart */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.3 }} className="h-[380px] w-full lg:w-[33rem] glass-card lg:rounded-l-2xl lg:rounded-r-none rounded-2xl overflow-hidden lg:ml-auto">
            <Canvas camera={{ position: [0, 3, 6], fov: 50 }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              {skills[activeCategory].map((skill, i) => (
                <SkillBar3D key={skill.name} skill={skill} index={i} total={skills[activeCategory].length} />
              ))}
              <Cylinder args={[3, 3, 0.1, 32]} position={[0, -0.05, 0]}>
                <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} transparent opacity={0.8} />
              </Cylinder>
            </Canvas>
          </motion.div>

          {/* Skills List */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4 }} className="space-y-4">
            {skills[activeCategory].map((skill, i) => (
              <motion.div key={skill.name} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 + i * 0.05 }} className="glass-card p-4 rounded-xl hover:bg-white/10 transition-all">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-200">{skill.name}</span>
                  <span className="text-sm text-primary-400">{skill.level}%</span>
                </div>
                <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${skill.level}%` } : {}}
                    transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}80)` }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* DSA Badge */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7 }} className="mt-16 glass-card p-8 rounded-2xl text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 p-1">
                <div className="w-full h-full rounded-full bg-dark-200 flex items-center justify-center">
                  <span className="text-3xl font-bold gradient-text">750+</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 text-2xl">🏆</div>
            </div>
            <div className="text-left max-w-md">
              <h3 className="text-2xl font-bold gradient-text mb-2">DSA Problem Solving</h3>
              <p className="text-gray-400">Solved 750+ Data Structure & Algorithm problems demonstrating strong problem-solving skills.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ExperienceSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section id="experience" className="relative py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Work Experience</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">My professional journey</p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary-500 via-accent-500 to-transparent" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.2 }}
                className={`relative flex ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:gap-8 ml-8 md:ml-0`}
              >
                {/* Timeline dot */}
                <div className="absolute left-[-24px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 z-10" />

                <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <div className={`glass-card p-6 rounded-2xl hover:bg-white/10 transition-all ${exp.current ? 'border-primary-500/30' : ''}`}>
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 ${exp.current ? 'animate-pulse' : ''}`}>
                        <HiBriefcase className="w-6 h-6 text-primary-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                        <p className="text-primary-400 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.period} • {exp.location}</p>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {exp.achievements.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="w-1.5 h-1.5 mt-2 rounded-full bg-primary-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((t, j) => (
                        <span key={j} className="px-3 py-1 text-xs font-medium rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
                          {t}
                        </span>
                      ))}
                    </div>

                    {exp.current && (
                      <div className="mt-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-green-400">Currently working here</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="hidden md:block w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectsSection() {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section id="projects" className="relative py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Featured Projects</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">Applications I've built</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card p-6 rounded-2xl group cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl" style={{ background: `${project.color}20` }}>
                  <HiCode className="w-6 h-6" style={{ color: project.color }} />
                </div>
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <FaGithub className="w-5 h-5" />
                </a>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{project.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{project.description}</p>

              {/* Features */}
              <ul className="space-y-2 mb-4">
                {project.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="w-1 h-1 rounded-full" style={{ background: project.color }} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t, j) => (
                  <span key={j} className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-gray-300">
                    {t}
                  </span>
                ))}
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ boxShadow: `0 0 40px ${project.color}30` }} />
            </motion.div>
          ))}
        </div>

        {/* View more */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }} className="text-center mt-12">
          <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center gap-2">
            <FaGithub className="w-5 h-5" /> View All on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function ContactSection() {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setIsSubmitted(false), 3000)
    }, 1000)
  }

  const contactInfo = [
    { icon: HiMail, label: 'Email', value: personalInfo.email, href: `mailto:${personalInfo.email}` },
    { icon: HiPhone, label: 'Phone', value: personalInfo.phone, href: `tel:${personalInfo.phone}` },
    { icon: HiLocationMarker, label: 'Location', value: personalInfo.location, href: '#' }
  ]

  return (
    <section id="contact" className="relative py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Get In Touch</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">Have a project in mind? Let's build something amazing together!</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }} className="space-y-6">
            <div className="glass-card p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 gradient-text">Let's Connect</h3>
              <p className="text-gray-400 mb-8">I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.</p>

              <div className="space-y-4">
                {contactInfo.map((info, i) => (
                  <a key={i} href={info.href} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 group-hover:from-primary-500/30 group-hover:to-accent-500/30 transition-colors">
                      <info.icon className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{info.label}</p>
                      <p className="font-medium text-white">{info.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Social links */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-500 mb-4">Follow me on</p>
                <div className="flex gap-4">
                  {[{ Icon: FaGithub, href: personalInfo.github }, { Icon: FaLinkedin, href: personalInfo.linkedin }].map(({ Icon, href }, i) => (
                    <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-12 h-12 glass-card rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors">
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.4 }}>
            <form onSubmit={handleSubmit} className="glass-card p-8 rounded-2xl space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-white placeholder-gray-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-white placeholder-gray-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-white placeholder-gray-500 resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full btn-primary flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : isSubmitted ? (
                  <>✓ Message Sent!</>
                ) : (
                  <>
                    <HiMail className="w-5 h-5" /> Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6 }} className="text-center mt-20">
          <div className="glass-card p-8 rounded-2xl max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to bring your <span className="gradient-text">ideas to life?</span>
            </h3>
            <p className="text-gray-400 mb-6">Let's collaborate and build something extraordinary together.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={`mailto:${personalInfo.email}`} className="btn-primary">Start a Conversation</a>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-2">
                <FaGithub className="w-5 h-5" /> View My Work
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative py-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-500">
          © {new Date().getFullYear()} {personalInfo.name}. Crafted with ❤️ using React + Three.js
        </p>
      </div>
    </footer>
  )
}

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      document.body.style.backgroundColor = '#0f172a'
      document.body.style.color = '#e2e8f0'
    } else {
      document.documentElement.classList.remove('dark')
      document.body.style.backgroundColor = '#ffffff'
      document.body.style.color = '#1e293b'
    }
  }, [isDark])

  return (
    <div className={`relative min-h-screen ${isDark ? 'dark bg-dark-300' : 'bg-white'}`}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader key="loader" />
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Background3D />
            <Navigation />
            <SocialLinks />
            
            <main className="relative z-10">
              <HeroSection />
              <AboutSection />
              <SkillsSection />
              <ExperienceSection />
              <ProjectsSection />
              <ContactSection />
            </main>
            
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}