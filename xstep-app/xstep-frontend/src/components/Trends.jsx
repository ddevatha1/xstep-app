import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Trends = ({ riskScore }) => {
  const [timeRange, setTimeRange] = useState('7days') // 7days, 30days
  const [riskData, setRiskData] = useState([])
  const [pressureData, setPressureData] = useState([])
  const [temperatureData, setTemperatureData] = useState([])

  // Generate sample trend data
  useEffect(() => {
    const days = timeRange === '7days' ? 7 : 30
    const today = new Date()
    
    // Risk score trend
    const riskTrend = Array.from({ length: days }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (days - 1 - i))
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: Math.max(0, Math.min(100, riskScore + (Math.random() - 0.5) * 30)),
        alerts: Math.floor(Math.random() * 5)
      }
    })
    setRiskData(riskTrend)

    // Pressure data by zone
    const pressureTrend = [
      { zone: 'Left Heel', avg: 45, max: 78 },
      { zone: 'Left Arch', avg: 22, max: 35 },
      { zone: 'Left Ball', avg: 65, max: 89 },
      { zone: 'Left Toes', avg: 28, max: 42 },
      { zone: 'Right Heel', avg: 42, max: 71 },
      { zone: 'Right Arch', avg: 19, max: 31 },
      { zone: 'Right Ball', avg: 61, max: 85 },
      { zone: 'Right Toes', avg: 31, max: 45 }
    ]
    setPressureData(pressureTrend)

    // Temperature difference data
    const tempTrend = Array.from({ length: days }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (days - 1 - i))
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        leftFoot: 36.2 + (Math.random() - 0.5) * 1.5,
        rightFoot: 36.5 + (Math.random() - 0.5) * 1.5,
        difference: Math.abs((Math.random() - 0.5) * 2)
      }
    })
    setTemperatureData(tempTrend)
  }, [timeRange, riskScore])

  const getCurrentTrend = () => {
    if (riskData.length < 2) return null
    const recent = riskData.slice(-3).reduce((sum, day) => sum + day.score, 0) / 3
    const previous = riskData.slice(-6, -3).reduce((sum, day) => sum + day.score, 0) / 3
    return recent > previous ? 'up' : 'down'
  }

  const trend = getCurrentTrend()

  const COLORS = ['#3b82f6', '#ef4444', '#f97316', '#22c55e', '#8b5cf6']

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Trends & Reports</h1>
        <p className="text-slate-600">Analytics and historical data</p>
      </motion.div>

      {/* Time Range Selector */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Time Range:</span>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={timeRange === '7days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('7days')}
            >
              7 Days
            </Button>
            <Button
              variant={timeRange === '30days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('30days')}
            >
              30 Days
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Risk Score Trend */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Risk Score Trend</h3>
          <div className="flex items-center space-x-1">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-red-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-600" />
            )}
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
              {trend === 'up' ? 'Increasing' : 'Decreasing'}
            </span>
          </div>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Pressure Analysis */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="font-semibold text-slate-800 mb-4">Pressure by Zone</h3>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pressureData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
              <YAxis 
                type="category"
                dataKey="zone"
                tick={{ fontSize: 10 }}
                stroke="#64748b"
                width={60}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="avg" fill="#3b82f6" name="Average" />
              <Bar dataKey="max" fill="#ef4444" name="Maximum" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Temperature Comparison */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="font-semibold text-slate-800 mb-4">Temperature Comparison</h3>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
              <YAxis 
                domain={[35, 38]}
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  `${value.toFixed(1)}°C`,
                  name === 'leftFoot' ? 'Left Foot' : 'Right Foot'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="leftFoot" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Left Foot"
              />
              <Line 
                type="monotone" 
                dataKey="rightFoot" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Right Foot"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Export Options */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="font-semibold text-slate-800 mb-3">Export Data</h3>
        <div className="flex space-x-2">
          <Button className="flex-1 flex items-center justify-center space-x-2">
            <Download className="w-4 h-4" />
            <span>PDF Report</span>
          </Button>
          <Button variant="outline" className="flex-1 flex items-center justify-center space-x-2">
            <Download className="w-4 h-4" />
            <span>CSV Data</span>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default Trends

