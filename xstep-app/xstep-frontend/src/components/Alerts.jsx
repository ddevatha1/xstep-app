import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  Thermometer, 
  Activity, 
  Clock, 
  Filter,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const Alerts = () => {
  const [alerts, setAlerts] = useState([])
  const [filter, setFilter] = useState('all') // all, pressure, temperature, resolved

  // Generate sample alerts
  useEffect(() => {
    const sampleAlerts = [
      {
        id: 1,
        type: 'pressure',
        severity: 'high',
        zone: 'Left Heel',
        message: 'High pressure detected in Left Heel',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        resolved: false,
        recommendation: 'Rest foot and check shoe fit'
      },
      {
        id: 2,
        type: 'temperature',
        severity: 'medium',
        zone: 'Right Ball',
        message: 'Temperature spike detected in Right Ball',
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        resolved: true,
        recommendation: 'Monitor for continued elevation'
      },
      {
        id: 3,
        type: 'pressure',
        severity: 'medium',
        zone: 'Left Big Toe',
        message: 'Sustained pressure in Left Big Toe',
        timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        resolved: false,
        recommendation: 'Adjust walking pattern'
      },
      {
        id: 4,
        type: 'temperature',
        severity: 'high',
        zone: 'Right Heel',
        message: 'Temperature difference >1°C detected',
        timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
        resolved: true,
        recommendation: 'Contact healthcare provider if persists'
      },
      {
        id: 5,
        type: 'pressure',
        severity: 'low',
        zone: 'Left Arch',
        message: 'Unusual pressure pattern in Left Arch',
        timestamp: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
        resolved: false,
        recommendation: 'Check insole positioning'
      }
    ]
    setAlerts(sampleAlerts)
  }, [])

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true
    if (filter === 'resolved') return alert.resolved
    if (filter === 'unresolved') return !alert.resolved
    return alert.type === filter
  })

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50'
      case 'medium': return 'border-orange-500 bg-orange-50'
      default: return 'border-yellow-500 bg-yellow-50'
    }
  }

  const getSeverityIcon = (type, severity) => {
    const iconClass = severity === 'high' ? 'text-red-600' : severity === 'medium' ? 'text-orange-600' : 'text-yellow-600'
    
    if (type === 'temperature') {
      return <Thermometer className={`w-5 h-5 ${iconClass}`} />
    }
    return <Activity className={`w-5 h-5 ${iconClass}`} />
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`
    }
    return `${minutes}m ago`
  }

  const toggleAlertResolved = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, resolved: !alert.resolved }
        : alert
    ))
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
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Alerts</h1>
        <p className="text-slate-600">Risk notifications and recommendations</p>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Filter by:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'unresolved', label: 'Active' },
            { key: 'resolved', label: 'Resolved' },
            { key: 'pressure', label: 'Pressure' },
            { key: 'temperature', label: 'Temperature' }
          ].map(({ key, label }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <motion.div 
            className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No alerts found</h3>
            <p className="text-slate-600">
              {filter === 'all' ? 'No alerts to display' : `No ${filter} alerts found`}
            </p>
          </motion.div>
        ) : (
          filteredAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border-l-4 ${getSeverityColor(alert.severity)} ${alert.resolved ? 'opacity-60' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getSeverityIcon(alert.type, alert.severity)}
                  <div>
                    <h3 className="font-semibold text-slate-800">{alert.message}</h3>
                    <p className="text-sm text-slate-600">{alert.zone}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleAlertResolved(alert.id)}
                  className="p-1"
                >
                  {alert.resolved ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-400" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-slate-600 mb-3">
                <Clock className="w-4 h-4" />
                <span>{formatTimeAgo(alert.timestamp)}</span>
                <span className="px-2 py-1 bg-slate-100 rounded-full text-xs font-medium">
                  {alert.severity.toUpperCase()}
                </span>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm text-slate-700">
                  <strong>Recommendation:</strong> {alert.recommendation}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mt-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="font-semibold text-slate-800 mb-3">Alert Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter(a => !a.resolved && a.severity === 'high').length}
            </div>
            <div className="text-xs text-slate-600">High Priority</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {alerts.filter(a => !a.resolved && a.severity === 'medium').length}
            </div>
            <div className="text-xs text-slate-600">Medium Priority</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(a => a.resolved).length}
            </div>
            <div className="text-xs text-slate-600">Resolved</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Alerts

