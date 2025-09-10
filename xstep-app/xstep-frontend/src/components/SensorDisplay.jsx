import { motion } from 'framer-motion'
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  AlertCircle, 
  CheckCircle,
  Footprints,
  Gauge
} from 'lucide-react'
import { useSensorData } from '../hooks/useSensorData'

const SensorDisplay = ({ className = "" }) => {
  const {
    sensorData,
    connectionStatus,
    isConnected,
    hasRecentData,
    footPressActive,
    pressureValue,
    pressurePercentage,
    error
  } = useSensorData()

  const getConnectionIcon = () => {
    if (isConnected && hasRecentData) {
      return <Wifi className="w-5 h-5 text-green-600" />
    } else if (error) {
      return <WifiOff className="w-5 h-5 text-red-600" />
    } else {
      return <AlertCircle className="w-5 h-5 text-orange-600" />
    }
  }

  const getConnectionColor = () => {
    if (isConnected && hasRecentData) return 'text-green-600'
    if (error) return 'text-red-600'
    return 'text-orange-600'
  }

  const getPressureColor = () => {
    if (pressurePercentage > 70) return 'text-red-600'
    if (pressurePercentage > 40) return 'text-orange-500'
    return 'text-green-600'
  }

  const getPressureBarColor = () => {
    if (pressurePercentage > 70) return 'bg-red-500'
    if (pressurePercentage > 40) return 'bg-orange-500'
    return 'bg-green-500'
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Connection Status */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getConnectionIcon()}
            <div>
              <h3 className="font-semibold text-slate-800">Sensor Status</h3>
              <p className={`text-sm ${getConnectionColor()}`}>
                {connectionStatus.message}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm font-medium ${getConnectionColor()}`}>
              {isConnected && hasRecentData ? 'LIVE' : 'OFFLINE'}
            </div>
            {sensorData.timestamp && (
              <div className="text-xs text-slate-500">
                {sensorData.seconds_since_last_reading !== null 
                  ? `${sensorData.seconds_since_last_reading}s ago`
                  : 'No data'
                }
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Real-time Pressure Display */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Live Pressure Reading
          </h3>
          
          {/* Pressure Value */}
          <motion.div
            className={`text-4xl font-bold ${getPressureColor()}`}
            animate={{ 
              scale: footPressActive ? [1, 1.1, 1] : 1,
              color: footPressActive ? '#ef4444' : undefined
            }}
            transition={{ duration: 0.3 }}
          >
            {pressureValue}
          </motion.div>
          
          <div className="text-sm text-slate-600 mb-4">
            Raw ADC Value ({pressurePercentage.toFixed(1)}%)
          </div>

          {/* Pressure Bar */}
          <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
            <motion.div
              className={`h-3 rounded-full ${getPressureBarColor()}`}
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(100, pressurePercentage)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Foot Press Indicator */}
          <motion.div
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
              footPressActive 
                ? 'bg-red-100 text-red-800 border-2 border-red-300' 
                : 'bg-slate-100 text-slate-600'
            }`}
            animate={{ 
              scale: footPressActive ? [1, 1.05, 1] : 1,
              backgroundColor: footPressActive ? '#fef2f2' : '#f1f5f9'
            }}
            transition={{ duration: 0.3, repeat: footPressActive ? Infinity : 0 }}
          >
            <Footprints className="w-4 h-4 mr-2" />
            {footPressActive ? 'FOOT PRESS DETECTED!' : 'No foot press'}
          </motion.div>
        </div>
      </motion.div>

      {/* Sensor Details */}
      {hasRecentData && (
        <motion.div 
          className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h4 className="font-semibold text-slate-800 mb-3">Sensor Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-600">Raw Value:</span>
              <div className="font-medium">{pressureValue}</div>
            </div>
            <div>
              <span className="text-slate-600">Percentage:</span>
              <div className="font-medium">{pressurePercentage.toFixed(1)}%</div>
            </div>
            <div>
              <span className="text-slate-600">Threshold:</span>
              <div className="font-medium">500 ADC</div>
            </div>
            <div>
              <span className="text-slate-600">Status:</span>
              <div className={`font-medium ${footPressActive ? 'text-red-600' : 'text-green-600'}`}>
                {footPressActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div 
          className="bg-red-50 border border-red-200 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h4 className="font-semibold text-red-800">Connection Error</h4>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default SensorDisplay

