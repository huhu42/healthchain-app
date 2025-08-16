'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Activity, Moon, TrendingUp, Plus, Smartphone, Upload, Download } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useHealthData } from '../contexts/HealthDataContext'

export const HealthMetrics = () => {
  const { 
    healthMetrics, 
    addHealthMetric, 
    syncWithWearable, 
    exportHealthData, 
    isLoading 
  } = useHealthData()
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState('all')
  const [formData, setFormData] = useState({
    type: 'sleep' as const,
    value: '',
    unit: 'hours'
  })

  const metricTypes = [
    { value: 'sleep', label: 'Sleep', icon: Moon, color: 'purple', unit: 'hours' },
    { value: 'steps', label: 'Steps', icon: Activity, color: 'green', unit: 'steps' },
    { value: 'heart_rate', label: 'Heart Rate', icon: Heart, color: 'red', unit: 'bpm' },
    { value: 'blood_pressure', label: 'Blood Pressure', icon: TrendingUp, color: 'orange', unit: 'mmHg' },
    { value: 'weight', label: 'Weight', icon: TrendingUp, color: 'blue', unit: 'lbs' },
  ]

  const filteredMetrics = selectedMetric === 'all' 
    ? healthMetrics 
    : healthMetrics.filter(m => m.type === selectedMetric)

  // Prepare chart data
  const chartData = filteredMetrics
    .slice(-30) // Last 30 readings
    .map(metric => ({
      date: metric.timestamp.toLocaleDateString(),
      value: metric.value,
      type: metric.type
    }))

  const getMetricSummary = (type: string) => {
    const typeMetrics = healthMetrics.filter(m => m.type === type)
    if (typeMetrics.length === 0) return null

    const latest = typeMetrics[0]
    const average = typeMetrics.reduce((sum, m) => sum + m.value, 0) / typeMetrics.length
    const trend = typeMetrics.length > 1 ? 
      (latest.value > typeMetrics[1].value ? 'up' : 'down') : 'stable'

    return { latest, average, trend }
  }

  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.value) return

    addHealthMetric({
      type: formData.type,
      value: parseFloat(formData.value),
      unit: formData.unit
    })

    setFormData({ type: 'sleep', value: '', unit: 'hours' })
    setShowAddForm(false)
  }

  const handleExport = async (format: 'json' | 'csv' | 'pdf') => {
    try {
      const blob = await exportHealthData(format)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `health-data.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.15)', 
        borderRadius: '20px', 
        padding: '32px', 
        backdropFilter: 'blur(20px)', 
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0' }}>Health Metrics</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', margin: 0 }}>Track and monitor your health data over time</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={syncWithWearable}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: isLoading ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                borderRadius: '12px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
              }}
            >
              <Smartphone style={{ width: '16px', height: '16px' }} />
              <span>{isLoading ? 'Syncing...' : 'Sync Wearable'}</span>
            </button>
            
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: 'white',
                borderRadius: '12px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                (e.target as HTMLElement).style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.4)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)';
                (e.target as HTMLElement).style.boxShadow = '0 4px 16px rgba(34, 197, 94, 0.3)';
              }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              <span>Add Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {metricTypes.map((type) => {
          const summary = getMetricSummary(type.value)
          const Icon = type.icon
          const isSelected = selectedMetric === type.value
          
          return (
            <motion.div
              key={type.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '20px',
                backdropFilter: 'blur(20px)',
                border: isSelected ? '2px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setSelectedMetric(selectedMetric === type.value ? 'all' : type.value)}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  (e.target as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.target as HTMLElement).style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                  (e.target as HTMLElement).style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <Icon style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                {summary?.trend && (
                  <TrendingUp style={{
                    width: '16px', 
                    height: '16px',
                    color: summary.trend === 'up' ? '#22c55e' : 
                           summary.trend === 'down' ? '#ef4444' : 'rgba(255, 255, 255, 0.5)'
                  }} />
                )}
              </div>
              
              <h3 style={{ fontWeight: '500', color: 'white', marginBottom: '8px', fontSize: '16px' }}>{type.label}</h3>
              
              {summary ? (
                <div>
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0' }}>
                    {summary.latest.value} <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>{type.unit}</span>
                  </p>
                  <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Avg: {summary.average.toFixed(1)} {type.unit}
                  </p>
                </div>
              ) : (
                <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>No data</p>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Chart Section */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.15)', 
        borderRadius: '20px', 
        padding: '32px', 
        backdropFilter: 'blur(20px)', 
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: 0 }}>
            {selectedMetric === 'all' ? 'All Metrics' : 
             metricTypes.find(t => t.value === selectedMetric)?.label} Trend
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => handleExport('csv')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <Download style={{ width: '16px', height: '16px' }} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExport('json')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <Download style={{ width: '16px', height: '16px' }} />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
        
        {chartData.length > 0 ? (
          <div style={{ height: '256px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.8)" fontSize={12} />
                <YAxis stroke="rgba(255, 255, 255, 0.8)" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#1d4ed8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <Activity style={{ width: '48px', height: '48px', color: 'rgba(255, 255, 255, 0.5)', margin: '0 auto 16px auto' }} />
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 8px 0' }}>No data to display</p>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>Add some health metrics to see trends</p>
            </div>
          </div>
        )}
      </div>

      {/* Recent Metrics List */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.15)', 
        borderRadius: '20px', 
        padding: '32px', 
        backdropFilter: 'blur(20px)', 
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>Recent Readings</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredMetrics.slice(0, 10).map((metric) => {
            const type = metricTypes.find(t => t.value === metric.type)
            const Icon = type?.icon || Activity
            
            return (
              <div key={metric.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                padding: '16px', 
                background: 'rgba(255, 255, 255, 0.1)', 
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    padding: '8px', 
                    borderRadius: '12px', 
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.3)'
                  }}>
                    <Icon style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: '500', color: 'white', margin: '0 0 4px 0' }}>{type?.label}</p>
                    <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                      {metric.timestamp.toLocaleDateString()} at {metric.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: '600', color: 'white', margin: '0 0 4px 0' }}>
                    {metric.value} {metric.unit}
                  </p>
                  {metric.verified && (
                    <p style={{ fontSize: '12px', color: '#22c55e', margin: 0 }}>✓ Verified</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        {filteredMetrics.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <Activity style={{ width: '48px', height: '48px', color: 'rgba(255, 255, 255, 0.5)', margin: '0 auto 16px auto' }} />
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 8px 0' }}>No health metrics recorded yet</p>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                marginTop: '8px',
                color: '#3b82f6',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '14px'
              }}
            >
              Add your first metric
            </button>
          </div>
        )}
      </div>

      {/* Add Metric Modal */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => setShowAddForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              padding: '32px',
              width: '100%',
              maxWidth: '400px',
              margin: '0 16px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>Add Health Metric</h3>
            
            <form onSubmit={handleAddMetric} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>Metric Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    const type = e.target.value as any
                    const metricType = metricTypes.find(t => t.value === type)
                    setFormData(prev => ({ 
                      ...prev, 
                      type, 
                      unit: metricType?.unit || 'units' 
                    }))
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                >
                  {metricTypes.map(type => (
                    <option key={type.value} value={type.value} style={{ background: '#1a1a1a', color: 'white' }}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '8px' }}>
                  Value ({formData.unit})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="Enter value"
                  required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  Add Metric
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}