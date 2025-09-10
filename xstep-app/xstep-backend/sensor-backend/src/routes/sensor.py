from flask import Blueprint, request, jsonify
from datetime import datetime
import threading

sensor_bp = Blueprint('sensor', __name__)

# In-memory storage for the latest sensor data
latest_sensor_data = {
    'pressure': 0,
    'timestamp': None,
    'foot_press_detected': False
}

# Thread lock for thread-safe access to the data
data_lock = threading.Lock()

@sensor_bp.route('/sensor-data', methods=['POST'])
def receive_sensor_data():
    """
    Endpoint to receive sensor data from Arduino/ESP32
    Expected JSON format: {"pressure": 1234}
    """
    try:
        data = request.get_json()
        
        if not data or 'pressure' not in data:
            return jsonify({'error': 'Invalid data format. Expected {"pressure": value}'}), 400
        
        pressure = data['pressure']
        
        # Validate pressure value
        if not isinstance(pressure, (int, float)) or pressure < 0:
            return jsonify({'error': 'Pressure must be a non-negative number'}), 400
        
        # Update the latest sensor data with thread safety
        with data_lock:
            latest_sensor_data['pressure'] = pressure
            latest_sensor_data['timestamp'] = datetime.now().isoformat()
            latest_sensor_data['foot_press_detected'] = pressure > 500  # Same threshold as Arduino
        
        return jsonify({
            'status': 'success',
            'message': 'Sensor data received',
            'data': latest_sensor_data.copy()
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@sensor_bp.route('/sensor-data', methods=['GET'])
def get_sensor_data():
    """
    Endpoint for the React app to fetch the latest sensor data
    Returns the most recent sensor reading
    """
    try:
        with data_lock:
            data = latest_sensor_data.copy()
        
        # Add additional computed fields for the app
        if data['timestamp']:
            # Calculate time since last reading
            last_reading_time = datetime.fromisoformat(data['timestamp'])
            time_diff = (datetime.now() - last_reading_time).total_seconds()
            data['seconds_since_last_reading'] = round(time_diff, 2)
            data['is_recent'] = time_diff < 5  # Consider data recent if less than 5 seconds old
        else:
            data['seconds_since_last_reading'] = None
            data['is_recent'] = False
        
        # Convert pressure to percentage for the app (assuming max pressure is around 4095)
        data['pressure_percentage'] = min(100, (data['pressure'] / 4095) * 100)
        
        return jsonify({
            'status': 'success',
            'data': data
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@sensor_bp.route('/sensor-status', methods=['GET'])
def get_sensor_status():
    """
    Endpoint to check if the sensor is actively sending data
    """
    try:
        with data_lock:
            data = latest_sensor_data.copy()
        
        if not data['timestamp']:
            status = 'no_data'
            message = 'No sensor data received yet'
        else:
            last_reading_time = datetime.fromisoformat(data['timestamp'])
            time_diff = (datetime.now() - last_reading_time).total_seconds()
            
            if time_diff < 5:
                status = 'active'
                message = 'Sensor is actively sending data'
            elif time_diff < 30:
                status = 'inactive'
                message = 'Sensor data is stale'
            else:
                status = 'disconnected'
                message = 'Sensor appears to be disconnected'
        
        return jsonify({
            'status': status,
            'message': message,
            'last_reading': data['timestamp'],
            'seconds_since_last_reading': data.get('seconds_since_last_reading')
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

