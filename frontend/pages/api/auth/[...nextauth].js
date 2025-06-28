import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { axiosInstance } from '../../../axios'

const options = {
    providers: [
        Providers.Credentials({
            name: 'Custom Provider',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try{
                    console.log('Attempting login with:', credentials.email)
                    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
                    
                    const res = await axiosInstance.post('/auth/login', {
                        email: credentials.email,
                        password: credentials.password
                    })
                    
                    console.log('Login response:', res.status)
                    
                    if(res.data) {
                        return {
                            id: 'user',
                            email: credentials.email,
                            token: res.data
                        }
                    } 
                    return null
                } catch(err) {
                    console.log('Login error:', err.message)
                    if(err.response){
                        console.log('Error response:', err.response.data)
                        throw new Error(err.response.data.error)
                    } else {
                        console.log('Network error:', err)
                        throw new Error('Connection failed - check if backend is running')
                    }
                }
            }
        })
    ],
    pages: {
        signIn: '/login'
    },
    session: {
        jwt: true
    },
    callbacks: {
        async jwt(token, user) {
            if (user) {
                token.accessToken = user.token
            }
            return token
        },
        async session(session, token) {
            session.accessToken = token.accessToken
            return session
        }
    },
    debug: true
}

export default (req, res) => NextAuth(req, res, options)