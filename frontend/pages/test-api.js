import { useEffect, useState } from 'react'
import { axiosInstance } from '../axios'

export default function TestAPI() {
    const [result, setResult] = useState('Testing...')

    useEffect(() => {
        const testAPI = async () => {
            try {
                const response = await axiosInstance.get('/test')
                setResult(`✅ Success: ${JSON.stringify(response.data)}`)
            } catch (error) {
                setResult(`❌ Error: ${error.message}`)
                console.error('API Test Error:', error)
            }
        }
        testAPI()
    }, [])

    return (
        <div style={{ padding: '20px' }}>
            <h1>API Connection Test</h1>
            <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
            <p><strong>Result:</strong> {result}</p>
        </div>
    )
}
