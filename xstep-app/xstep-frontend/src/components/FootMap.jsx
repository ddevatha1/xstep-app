import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Battery, ToggleLeft, ToggleRight, Thermometer, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FootMap = () => {
  const [viewMode, setViewMode] = useState('pressure') // pressure, temperature, both
  const [leftFootData, setLeftFootData] = useState({
    heel: 45,
    arch: 20,
    ball: 65,
    bigToe: 30,
    toes: 25,
    temperature: 36.2
  })
  const [rightFootData, setRightFootData] = useState({
    heel: 40,
    arch: 18,
    ball: 60,
    bigToe: 35,
    toes: 28,
    temperature: 36.8
  })

  // Simulate real-time pressure and temperature updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLeftFootData(prev => ({
        heel: Math.max(0, Math.min(100, prev.heel + (Math.random() - 0.5) * 10)),
        arch: Math.max(0, Math.min(100, prev.arch + (Math.random() - 0.5) * 8)),
        ball: Math.max(0, Math.min(100, prev.ball + (Math.random() - 0.5) * 12)),
        bigToe: Math.max(0, Math.min(100, prev.bigToe + (Math.random() - 0.5) * 8)),
        toes: Math.max(0, Math.min(100, prev.toes + (Math.random() - 0.5) * 6)),
        temperature: Math.max(35, Math.min(38, prev.temperature + (Math.random() - 0.5) * 0.2))
      }))
      
      setRightFootData(prev => ({
        heel: Math.max(0, Math.min(100, prev.heel + (Math.random() - 0.5) * 10)),
        arch: Math.max(0, Math.min(100, prev.arch + (Math.random() - 0.5) * 8)),
        ball: Math.max(0, Math.min(100, prev.ball + (Math.random() - 0.5) * 12)),
        bigToe: Math.max(0, Math.min(100, prev.bigToe + (Math.random() - 0.5) * 8)),
        toes: Math.max(0, Math.min(100, prev.toes + (Math.random() - 0.5) * 6)),
        temperature: Math.max(35, Math.min(38, prev.temperature + (Math.random() - 0.5) * 0.2))
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getPressureColor = (pressure) => {
    if (pressure > 70) return 'bg-red-500'
    if (pressure > 40) return 'bg-orange-500'
    if (pressure > 20) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getTemperatureColor = (temp) => {
    if (temp > 37.5) return 'bg-red-500'
    if (temp > 37) return 'bg-orange-500'
    if (temp > 36.5) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const FootVisualization = ({ footData, side, battery }) => {
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center mb-2">
          <h3 className="font-semibold text-slate-800">{side} Foot</h3>
          <div className="ml-2 flex items-center text-sm text-slate-600">
            <Battery className="w-4 h-4 mr-1" />
            {battery}%
          </div>
        </div>
        
        <div className="relative">
          {/* Foot outline */}
          <svg width="120" height="200" viewBox="0 0 120 200" className="drop-shadow-lg">
            {/* Foot shape */}
            <path
              d="M60 20 C80 20 100 40 100 80 L100 140 C100 160 90 180 60 190 C30 180 20 160 20 140 L20 80 C20 40 40 20 60 20 Z"
              fill="white"
              stroke="#e2e8f0"
              strokeWidth="2"
            />
            
            {/* Pressure zones */}
            {/* Heel */}
            <motion.circle
              cx="60"
              cy="160"
              r="20"
              className={viewMode === 'temperature' ? getTemperatureColor(footData.temperature) : getPressureColor(footData.heel)}
              initial={{ scale: 0 }}
              animate={{ 
                scale: viewMode === 'temperature' ? 1 : 0.5 + (footData.heel / 100) * 0.5,
                opacity: viewMode === 'temperature' ? 0.7 : 0.3 + (footData.heel / 100) * 0.4
              }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Arch */}
            <motion.ellipse
              cx="60"
              cy="120"
              rx="15"
              ry="25"
              className={viewMode === 'temperature' ? getTemperatureColor(footData.temperature) : getPressureColor(footData.arch)}
              initial={{ scale: 0 }}
              animate={{ 
                scale: viewMode === 'temperature' ? 1 : 0.5 + (footData.arch / 100) * 0.5,
                opacity: viewMode === 'temperature' ? 0.7 : 0.3 + (footData.arch / 100) * 0.4
              }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
            
            {/* Ball of foot */}
            <motion.ellipse
              cx="60"
              cy="80"
              rx="25"
              ry="15"
              className={viewMode === 'temperature' ? getTemperatureColor(footData.temperature) : getPressureColor(footData.ball)}
              initial={{ scale: 0 }}
              animate={{ 
                scale: viewMode === 'temperature' ? 1 : 0.5 + (footData.ball / 100) * 0.5,
                opacity: viewMode === 'temperature' ? 0.7 : 0.3 + (footData.ball / 100) * 0.4
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            
            {/* Big toe */}
            <motion.circle
              cx="60"
              cy="50"
              r="12"
              className={viewMode === 'temperature' ? getTemperatureColor(footData.temperature) : getPressureColor(footData.bigToe)}
              initial={{ scale: 0 }}
              animate={{ 
                scale: viewMode === 'temperature' ? 1 : 0.5 + (footData.bigToe / 100) * 0.5,
                opacity: viewMode === 'temperature' ? 0.7 : 0.3 + (footData.bigToe / 100) * 0.4
              }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
            
            {/* Other toes */}
            <motion.ellipse
              cx="60"
              cy="30"
              rx="20"
              ry="8"
              className={viewMode === 'temperature' ? getTemperatureColor(footData.temperature) : getPressureColor(footData.toes)}
              initial={{ scale: 0 }}
              animate={{ 
                scale: viewMode === 'temperature' ? 1 : 0.5 + (footData.toes / 100) * 0.5,
                opacity: viewMode === 'temperature' ? 0.7 : 0.3 + (footData.toes / 100) * 0.4
              }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
          </svg>
          
          {/* Temperature display */}
          {viewMode === 'temperature' && (
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-slate-700">
              {footData.temperature.toFixed(1)}°C
            </div>
          )}
        </div>
      </div>
    )
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
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Live Foot Map</h1>
        <p className="text-slate-600">Real-time pressure and temperature monitoring</p>
      </motion.div>

      {/* View Mode Toggle */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex justify-center space-x-2">
          <Button
            variant={viewMode === 'pressure' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('pressure')}
            className="flex items-center space-x-1"
          >
            <Activity className="w-4 h-4" />
            <span>Pressure</span>
          </Button>
          <Button
            variant={viewMode === 'temperature' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('temperature')}
            className="flex items-center space-x-1"
          >
            <Thermometer className="w-4 h-4" />
            <span>Temperature</span>
          </Button>
          <Button
            variant={viewMode === 'both' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('both')}
          >
            Both
          </Button>
        </div>
      </motion.div>

      {/* Foot Visualizations */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex justify-around items-center">
          <FootVisualization 
            footData={leftFootData} 
            side="Left" 
            battery={85}
          />
          <FootVisualization 
            footData={rightFootData} 
            side="Right" 
            battery={78}
          />
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="font-semibold text-slate-800 mb-3">
          {viewMode === 'temperature' ? 'Temperature' : 'Pressure'} Legend
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {viewMode === 'temperature' ? (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Normal (&lt;36.5°C)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Warm (36.5-37°C)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span>Hot (37-37.5°C)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Alert (&gt;37.5°C)</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Low (0-20)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Medium (20-40)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span>High (40-70)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Critical (&gt;70)</span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default FootMap

