import { useState, useEffect, useCallback } from 'react'

// Configuration
const BACKEND_URL = 'http://localhost:5002' // Update this to match your backend URL
const POLLING_INTERVAL = 500 // Poll every 500ms for real-time feel
const CONNECTION_TIMEOUT = 5000 // Consider disconnected after 5 seconds

export const useSensorData = () => {
  const [sensorData, setSensorData] = useState({
    pressure: 0,
    pressure_percentage: 0,
    foot_press_detected: false,
    timestamp: null,
    seconds_since_last_reading: null,
    is_recent: false
  })
  
  const [connectionStatus, setConnectionStatus] = useState({
    status: 'disconnected', // 'connected', 'disconnected', 'error'
    message: 'Not connected',
    lastUpdate: null
  })
  
  const [isPolling, setIsPolling] = useState(false)
  const [error, setError] = useState(null)

  // Function to fetch sensor data from backend
  const fetchSensorData = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/sensor-data`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(CONNECTION_TIMEOUT)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.status === 'success' && result.data) {
        setSensorData(result.data)
        setConnectionStatus({
          status: 'connected',
          message: 'Receiving sensor data',
          lastUpdate: new Date().toISOString()
        })
        setError(null)
        return result.data
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Error fetching sensor data:', err)
      setError(err.message)
      setConnectionStatus({
        status: 'error',
        message: `Connection error: ${err.message}`,
        lastUpdate: new Date().toISOString()
      })
      return null
    }
  }, [])

  // Function to check sensor status
  const checkSensorStatus = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/sensor-status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(CONNECTION_TIMEOUT)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (err) {
      console.error('Error checking sensor status:', err)
      return null
    }
  }, [])

  // Start polling for sensor data
  const startPolling = useCallback(() => {
    if (isPolling) return
    
    setIsPolling(true)
    console.log('Starting sensor data polling...')
  }, [isPolling])

  // Stop polling for sensor data
  const stopPolling = useCallback(() => {
    setIsPolling(false)
    console.log('Stopped sensor data polling')
  }, [])

  // Effect to handle polling
  useEffect(() => {
    let intervalId = null

    if (isPolling) {
      // Fetch immediately when starting
      fetchSensorData()
      
      // Set up interval for continuous polling
      intervalId = setInterval(() => {
        fetchSensorData()
      }, POLLING_INTERVAL)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isPolling, fetchSensorData])

  // Auto-start polling when hook is first used
  useEffect(() => {
    startPolling()
    
    // Cleanup on unmount
    return () => {
      stopPolling()
    }
  }, [startPolling, stopPolling])

  // Derived state for easier consumption
  const isConnected = connectionStatus.status === 'connected'
  const hasRecentData = sensorData.is_recent
  const footPressActive = sensorData.foot_press_detected && hasRecentData

  return {
    // Raw sensor data
    sensorData,
    
    // Connection information
    connectionStatus,
    isConnected,
    hasRecentData,
    error,
    
    // Derived states
    footPressActive,
    pressureValue: sensorData.pressure,
    pressurePercentage: sensorData.pressure_percentage,
    
    // Control functions
    startPolling,
    stopPolling,
    isPolling,
    
    // Manual fetch functions
    fetchSensorData,
    checkSensorStatus,
    
    // Configuration
    pollingInterval: POLLING_INTERVAL,
    backendUrl: BACKEND_URL
  }
}

