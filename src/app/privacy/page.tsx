'use client'

import { Layout } from '../../components/Layout'
import { PrivacyControls } from '../../components/PrivacyControls'

export default function PrivacyPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: '0 0 24px 0', textAlign: 'center' }}>
          GamifiedHealth Privacy Policy
        </h1>
        
        <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '16px' }}>
            This privacy policy describes how GamifiedHealth ("we", "our", or "us") collects, uses, and protects your health data when you use our application.
          </p>

          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '24px 0 12px 0'
          }}>
            Data Collection
          </h3>
          
          <p style={{ margin: '0 0 16px 0' }}>
            We collect health data from your connected devices and wearables, including:
          </p>
          
          <ul style={{
            margin: '0 0 16px 0',
            paddingLeft: '24px'
          }}>
            <li>Sleep data (duration, quality, stages)</li>
            <li>Recovery metrics (heart rate variability, resting heart rate)</li>
            <li>Strain and activity data</li>
            <li>Steps and movement data</li>
            <li>Heart rate information</li>
          </ul>

          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '24px 0 12px 0'
          }}>
            Data Usage
          </h3>
          
          <p style={{ margin: '0 0 16px 0' }}>
            Your health data is used to:
          </p>
          
          <ul style={{
            margin: '0 0 16px 0',
            paddingLeft: '24px'
          }}>
            <li>Track your health goals and progress</li>
            <li>Calculate rewards and achievements</li>
            <li>Provide personalized health insights</li>
            <li>Enable community challenges and competitions</li>
            <li>Improve our health tracking algorithms</li>
          </ul>

          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '24px 0 12px 0'
          }}>
            Data Privacy
          </h3>
          
          <p style={{ margin: '0 0 16px 0' }}>
            We are committed to protecting your privacy:
          </p>
          
          <ul style={{
            margin: '0 0 16px 0',
            paddingLeft: '24px'
          }}>
            <li>All data is encrypted in transit and at rest</li>
            <li>You control who can access your data</li>
            <li>Data is never sold to third parties</li>
            <li>You can delete your data at any time</li>
            <li>We use Hypergraph for decentralized, private data storage</li>
          </ul>

          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '24px 0 12px 0'
          }}>
            Third-Party Integrations
          </h3>
          
          <p style={{ margin: '0 0 16px 0' }}>
            We integrate with WHOOP to provide enhanced health tracking. When you connect your WHOOP account:
          </p>
          
          <ul style={{
            margin: '0 0 16px 0',
            paddingLeft: '24px'
          }}>
            <li>We only access the data you authorize</li>
            <li>Data is synced securely using OAuth 2.0</li>
            <li>You can revoke access at any time</li>
            <li>WHOOP's privacy policy also applies to their data</li>
          </ul>

          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '24px 0 12px 0'
          }}>
            Your Rights
          </h3>
          
          <p style={{ margin: '0 0 16px 0' }}>
            You have the right to:
          </p>
          
          <ul style={{
            margin: '0 0 16px 0',
            paddingLeft: '24px'
          }}>
            <li>Access all your stored health data</li>
            <li>Correct inaccurate information</li>
            <li>Delete your data completely</li>
            <li>Export your data in standard formats</li>
            <li>Control privacy settings for each data type</li>
          </ul>

          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '24px 0 12px 0'
          }}>
            Contact Us
          </h3>
          
          <p style={{ margin: '0 0 16px 0' }}>
            If you have any questions about this privacy policy, please contact us at{' '}
            <a href="mailto:privacy@gamifiedhealth.app" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
              privacy@gamifiedhealth.app
            </a>
          </p>

          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '24px 0 12px 0'
          }}>
            Updates to This Policy
          </h3>
          
          <p style={{ margin: '0 0 16px 0' }}>
            We may update this privacy policy from time to time. We will notify you of any significant changes through the application or via email.
          </p>

          <p style={{
            margin: '32px 0 0 0',
            fontSize: '14px',
            color: '#6b7280',
            textAlign: 'center',
            borderTop: '1px solid #e5e7eb',
            paddingTop: '24px'
          }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}