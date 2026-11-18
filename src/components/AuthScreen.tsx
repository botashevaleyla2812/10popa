import { useState, type FormEvent } from 'react'

interface Props {
  onAuthenticate: (username: string, password: string, mode: 'login' | 'register') => Promise<void>
  busy: boolean
  error: string
}

export function AuthScreen({ onAuthenticate, busy, error }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onAuthenticate(username.trim(), password, mode)
  }

  return (
    <main className="nova-auth-page">
      <div className="auth-orbit orbit-one" />
      <div className="auth-orbit orbit-two" />
      <section className="auth-showcase">
        <div className="nova-logo"><span className="nova-logo-mark">✳</span> nova<span>talk</span></div>
        <div className="showcase-copy">
          <div className="eyebrow"><i /> YOUR SPACE TO CONNECT</div>
          <h1>Меньше шума.<br /><em>Больше</em> общения.</h1>
          <p>Общий чат для идей, вопросов и разговоров. Подключайся к своей команде в одном пространстве.</p>
        </div>
        <div className="showcase-bottom"><span>01 / ONE SHARED ROOM</span><span>REAL-TIME MESSAGING</span></div>
      </section>
      <section className="auth-card-wrap">
        <div className="auth-card">
          <div className="auth-card-top"><span className="auth-card-icon">↗</span><span>SECURE ACCESS</span></div>
          <div className="auth-heading">{mode === 'login' ? 'С возвращением' : 'Присоединяйся'}</div>
          <p className="auth-subtitle">{mode === 'login' ? 'Войди, чтобы продолжить общение.' : 'Создай аккаунт и подключись к чату.'}</p>
          <div className="auth-tabs">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Вход</button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Регистрация</button>
          </div>
          <form className="nova-auth-form" onSubmit={submit}>
            <label>ЛОГИН
              <input value={username} onChange={event => setUsername(event.target.value)} autoComplete="username" placeholder="Твой логин" required />
            </label>
            <label>ПАРОЛЬ
              <input value={password} onChange={event => setPassword(event.target.value)} type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="Твой пароль" required />
            </label>
            {error && <div className="nova-error" role="alert">{error}</div>}
            <button className="nova-submit" type="submit" disabled={busy}>{busy ? 'Подождите…' : mode === 'login' ? 'Войти в чат' : 'Создать аккаунт'} <span>↗</span></button>
          </form>
          <div className="auth-footnote"><span>●</span> Авторизация защищена токеном доступа</div>
        </div>
        <div className="auth-legal">NOVA TALK <span>PRIVATE GROUP SPACE · 2026</span></div>
      </section>
    </main>
  )
}
