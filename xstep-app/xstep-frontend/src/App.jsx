import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import './App.css'

// Components
import AnimatedBackground from './components/AnimatedBackground'
import Navigation from './components/Navigation'
import Dashboard from './components/Dashboard'
import DashboardWithSensor from './components/DashboardWithSensor'
import FootMap from './components/FootMap'
import FootMapWithSensor from './components/FootMapWithSensor'
import Alerts from './components/Alerts'
import Trends from './components/Trends'
import Settings from './components/Settings'
import Onboarding from './components/Onboarding'
import DevicePairing from './components/DevicePairing'

function App() {
  const [isOnboarded, setIsOnboarded] = useState(false)
  const [isDevicePaired, setIsDevicePaired] = useState(false)
  const [riskLevel, setRiskLevel] = useState('low') // low, medium, high
  const [currentRiskScore, setCurrentRiskScore] = useState(25)

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingComplete = localStorage.getItem('xstep-onboarded')
    const devicePaired = localStorage.getItem('xstep-device-paired')
    
    if (onboardingComplete) setIsOnboarded(true)
    if (devicePaired) setIsDevicePaired(true)
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem('xstep-onboarded', 'true')
    setIsOnboarded(true)
  }

  const completeDevicePairing = () => {
    localStorage.setItem('xstep-device-paired', 'true')
    setIsDevicePaired(true)
  }

  // Show onboarding flow if not completed
  if (!isOnboarded) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground riskLevel={riskLevel} />
        <Onboarding onComplete={completeOnboarding} />
      </div>
    )
  }

  // Show device pairing if not completed
  if (!isDevicePaired) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <AnimatedBackground riskLevel={riskLevel} />
        <DevicePairing onComplete={completeDevicePairing} />
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden bg-slate-50">
        <AnimatedBackground riskLevel={riskLevel} />
        
        <div className="relative z-10 min-h-screen pb-20">
          <Routes>
            <Route path="/" element={
              <DashboardWithSensor 
                riskScore={currentRiskScore}
                riskLevel={riskLevel}
                setRiskLevel={setRiskLevel}
                setRiskScore={setCurrentRiskScore}
              />
            } />
            <Route path="/footmap" element={<FootMapWithSensor />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/trends" element={<Trends riskScore={currentRiskScore} />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>

        <Navigation />
      </div>
    </Router>
  )
}

export default App

