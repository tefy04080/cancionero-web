'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useState, useCallback, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [value, setValue] = useState(searchParams.get('q') ?? '')

  // ⚠️ CRÍTICO: useRef para NO disparar el efecto en el primer render
  // Sin esto, al montar en /cancion/[id] el valor '' dispara un push('/') 
  const didMount = useRef(false)

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return   // ignorar primer render completamente
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (value.trim()) {
        params.set('q', value.trim())
      } else {
        params.delete('q')
      }

      if (pathname === '/') {
        // En inicio: actualizar query sin scroll
        router.replace(`/?${params.toString()}`, { scroll: false })
      } else if (value.trim()) {
        // En otra página: solo navegar si hay texto real
        router.push(`/?${params.toString()}`)
      }
      // Si valor vacío y no estamos en inicio → no hacer nada
    }, 350)

    return () => clearTimeout(timer)
  }, [value]) // ← solo depende de value, no de router/pathname/searchParams

  const handleClear = useCallback(() => setValue(''), [])

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          style={{ color: 'rgba(244,161,29,0.7)' }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </div>

      <input
        id="search-bar"
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Buscar canciones, ritmos..."
        className="w-full pl-10 pr-10 py-2.5 rounded-2xl text-sm font-body outline-none transition-all duration-300"
        style={{
          background: 'rgba(13,40,24,0.8)',
          border: '1px solid rgba(82,183,136,0.25)',
          color: '#fef3e2',
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = 'rgba(244,161,29,0.5)'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(244,161,29,0.08)'
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = 'rgba(82,183,136,0.25)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      />

      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-beni-sand/50 hover:text-beni-gold transition-colors"
          aria-label="Limpiar búsqueda"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default function Header() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-beni-deep/40 backdrop-blur-md"
      style={{ background: 'rgba(7,26,15,0.92)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-24 md:h-28">

          {/* Logo */}
          <Link href="/" className="flex items-center group shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Orientalist — Cancionero del Beni"
              style={{ height: '90px', width: 'auto', objectFit: 'contain' }}
              className="transition-opacity duration-300 group-hover:opacity-80"
            />
          </Link>

          {/* Barra de búsqueda — centro */}
          <div className="flex-1 flex justify-center px-2 hidden sm:flex">
            <Suspense fallback={<div className="w-full max-w-md h-10 rounded-2xl bg-beni-deep/30 animate-pulse" />}>
              <SearchBar />
            </Suspense>
          </div>

          {/* Nav + Auth */}
          <div className="flex items-center gap-3 shrink-0">
            <nav className="hidden lg:flex items-center gap-5">
              <Link href="/"
                className="text-beni-cream/80 hover:text-beni-gold transition-colors font-body text-sm font-medium">
                Canciones
              </Link>
              {(session?.user?.role === 'MODERATOR' || session?.user?.role === 'ADMIN') && (
                <Link href="/moderacion"
                  className="text-beni-cream/80 hover:text-beni-gold transition-colors font-body text-sm font-medium">
                  Moderación
                </Link>
              )}
            </nav>

            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-beni-deep/50 animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  id="user-menu-button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-beni-deep/50 transition-colors"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? 'Usuario'}
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-beni-gold/40"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-beni-deep flex items-center justify-center text-beni-gold font-bold">
                      {session.user.name?.charAt(0) ?? '?'}
                    </div>
                  )}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-14 w-56 glass-card rounded-2xl shadow-jungle overflow-hidden z-50"
                    style={{ border: '1px solid rgba(82,183,136,0.25)' }}>
                    <div className="px-4 py-3 border-b border-beni-deep/40">
                      <p className="text-beni-cream font-medium text-sm truncate">{session.user.name}</p>
                      <p className="text-beni-sand/60 text-xs truncate">{session.user.email}</p>
                      <span className="rhythm-badge mt-1 text-xs">{session.user.role}</span>
                    </div>
                    <div className="p-2">
                      <Link href="/contribuir" onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-beni-cream/80 hover:bg-beni-deep/60 hover:text-beni-gold transition-colors text-sm">
                        🎵 Aportar Canción
                      </Link>
                      {(session.user.role === 'MODERATOR' || session.user.role === 'ADMIN') && (
                        <Link href="/moderacion" onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-beni-cream/80 hover:bg-beni-deep/60 hover:text-beni-gold transition-colors text-sm">
                          🛡️ Moderación
                        </Link>
                      )}
                      <button
                        id="logout-button"
                        onClick={() => { signOut(); setMenuOpen(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-beni-terra hover:bg-beni-terra/10 transition-colors text-sm mt-1">
                        🚪 Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" id="login-button" className="btn-secondary text-sm">
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>

        {/* Barra de búsqueda mobile */}
        <div className="sm:hidden pb-3">
          <Suspense fallback={<div className="w-full h-10 rounded-2xl bg-beni-deep/30 animate-pulse" />}>
            <SearchBar />
          </Suspense>
        </div>
      </div>
    </header>
  )
}
