import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Bluetooth, 
  Battery, 
  Wifi, 
  Activity, 
  Footprints, 
  AlertTriangle,
  TrendingUp,
  BookOpen,
  Users,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const Dashboard = ({ riskScore, riskLevel, setRiskLevel, setRiskScore }) => {
  const [isConnected, setIsConnected] = useState(true)
  const [batteryLeft, setBatteryLeft] = useState(85)
  const [batteryRight, setBatteryRight] = useState(78)
  const [lastSync, setLastSync] = useState(new Date())

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate risk score changes
      const newScore = Math.max(0, Math.min(100, riskScore + (Math.random() - 0.5) * 10))
      setRiskScore(Math.round(newScore))
      
      // Update risk level based on score
      if (newScore >= 70) setRiskLevel('high')
      else if (newScore >= 40) setRiskLevel('medium')
      else setRiskLevel('low')
      
      // Simulate battery drain
      setBatteryLeft(prev => Math.max(0, prev - Math.random() * 0.1))
      setBatteryRight(prev => Math.max(0, prev - Math.random() * 0.1))
      
      setLastSync(new Date())
    }, 5000)

    return () => clearInterval(interval)
  }, [riskScore, setRiskLevel, setRiskScore])

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-orange-500'
      default: return 'text-green-600'
    }
  }

  const getRiskBgColor = () => {
    switch (riskLevel) {
      case 'high': return 'from-red-500 to-red-600'
      case 'medium': return 'from-orange-500 to-orange-600'
      default: return 'from-green-500 to-green-600'
    }
  }

  const getRiskText = () => {
    switch (riskLevel) {
      case 'high': return 'High Risk'
      case 'medium': return 'Medium Risk'
      default: return 'Low Risk'
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-slate-800 mb-2">X-Step Monitor</h1>
        <p className="text-slate-600">Smart Insole Health Tracking</p>
      </motion.div>

      {/* Connection Status */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Bluetooth className={`w-5 h-5 ${isConnected ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className={`font-medium ${isConnected ? 'text-slate-800' : 'text-slate-500'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-slate-600">
            <Wifi className="w-4 h-4" />
            <span>Synced {lastSync.toLocaleTimeString()}</span>
          </div>
        </div>
        
        <div className="flex justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Battery className="w-4 h-4 text-slate-600" />
            <span className="text-slate-600">Left: {Math.round(batteryLeft)}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <Battery className="w-4 h-4 text-slate-600" />
            <span className="text-slate-600">Right: {Math.round(batteryRight)}%</span>
          </div>
        </div>
      </motion.div>

      {/* Risk Score Gauge */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-lg text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Today's Risk Score</h2>
        
        <div className="relative w-32 h-32 mx-auto mb-4">
          {/* Background circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#e2e8f0"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              stroke="url(#riskGradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
              animate={{ 
                strokeDashoffset: 2 * Math.PI * 50 * (1 - riskScore / 100)
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={riskLevel === 'high' ? '#ef4444' : riskLevel === 'medium' ? '#f97316' : '#22c55e'} />
                <stop offset="100%" stopColor={riskLevel === 'high' ? '#dc2626' : riskLevel === 'medium' ? '#ea580c' : '#16a34a'} />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              className={`text-3xl font-bold ${getRiskColor()}`}
              key={riskScore}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {riskScore}
            </motion.span>
            <span className="text-sm text-slate-600">/ 100</span>
          </div>
        </div>
        
        <motion.div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getRiskBgColor()}`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {getRiskText()}
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="grid grid-cols-2 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button 
          className="h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg flex flex-col items-center justify-center space-y-2"
          onClick={() => window.location.href = '/footmap'}
        >
          <Footprints className="w-6 h-6" />
          <span className="text-sm font-medium">Live Foot Map</span>
        </Button>
        
        <Button 
          className="h-20 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg flex flex-col items-center justify-center space-y-2"
          onClick={() => window.location.href = '/alerts'}
        >
          <AlertTriangle className="w-6 h-6" />
          <span className="text-sm font-medium">View Alerts</span>
        </Button>
        
        <Button 
          className="h-20 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg flex flex-col items-center justify-center space-y-2"
          onClick={() => window.location.href = '/trends'}
        >
          <TrendingUp className="w-6 h-6" />
          <span className="text-sm font-medium">Trends</span>
        </Button>
        
        <Button 
          className="h-20 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-lg flex flex-col items-center justify-center space-y-2"
        >
          <BookOpen className="w-6 h-6" />
          <span className="text-sm font-medium">Education</span>
        </Button>
      </motion.div>

      {/* Daily Stats */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="font-semibold text-slate-800 mb-3">Today's Activity</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">2,847</div>
            <div className="text-xs text-slate-600">Steps</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">6.2</div>
            <div className="text-xs text-slate-600">Hours Active</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-xs text-slate-600">Alerts</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard

