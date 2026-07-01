'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function LoginContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl)
    }
  }, [status, router, callbackUrl])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-beni-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="jungle-bg min-h-screen flex items-center justify-center px-4 py-12">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-8xl opacity-5 rotate-12">🌿</div>
        <div className="absolute top-40 right-20 text-8xl opacity-5 -rotate-12">🦜</div>
        <div className="absolute bottom-32 left-1/4 text-7xl opacity-5">🌸</div>
        <div className="absolute bottom-20 right-10 text-8xl opacity-5 rotate-6">🌺</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #f4a11d, transparent)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5 text-4xl"
            style={{
              background: 'linear-gradient(135deg, #f4a11d, #e8851a)',
              boxShadow: '0 0 40px rgba(244,161,29,0.4)'
            }}>
            🦜
          </div>
          <h1 className="font-heading font-black text-3xl text-beni-cream mb-2">
            Cancionero del Beni
          </h1>
          <p className="text-beni-sand/60 font-body text-sm">
            Ingresa para aportar canciones a nuestra cultura
          </p>
        </div>

        {/* Card de login */}
        <div className="glass-card rounded-3xl p-8">
          <h2 className="font-heading font-bold text-xl text-beni-cream mb-2 text-center">
            Iniciar Sesión
          </h2>
          <p className="text-beni-sand/60 text-sm font-body text-center mb-8">
            Usa tu cuenta de Google para acceder a la plataforma
          </p>

          <button
            id="google-signin-button"
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold text-base transition-all"
            style={{
              background: '#ffffff',
              color: '#1a1a1a',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            {/* Google Icon */}
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar con Google
          </button>

          <hr className="section-divider my-6" />

          <p className="text-beni-sand/50 text-xs font-body text-center leading-relaxed">
            Al iniciar sesión aceptas contribuir de buena fe al{' '}
            <span className="text-beni-light">patrimonio cultural del Beni</span>.
            Tu información se usa únicamente para identificar tus aportes.
          </p>
        </div>

        {/* Decorativo */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-beni-sand/30 text-xs font-body">
            🌿 Preservando la cultura musical del Oriente Boliviano
          </p>
          <p className="text-beni-sand/30 text-[10px] font-body">
            Sistema Creado Por <span className="text-beni-gold/50 font-medium">Estefani Orihuela Banegas</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-beni-gold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
