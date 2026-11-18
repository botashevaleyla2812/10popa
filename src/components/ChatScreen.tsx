
import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { ChatMessage, SocketStatus, User } from '../types'

interface Props {
  user: User
  messages: ChatMessage[]
  status: SocketStatus
  error: string
  onSend: (text: string) => void
  onLogout: () => void
}

const statusText: Record<SocketStatus, string> = {
  connecting: 'Подключаемся',
  authorizing: 'Проверяем доступ',
  connected: 'На связи',
  disconnected: 'Не в сети',
  error: 'Нет соединения',
}

function initials(value: string) {
  return value.trim().slice(0, 1).toUpperCase() || '?'
}

function formatTime(value: number) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function ChatScreen({
  user,
  messages,
  status,
  error,
  onSend,
  onLogout,
}: Props) {
  const [draft, setDraft] = useState('')
  const [showDetails, setShowDetails] = useState(true)
  const [filter, setFilter] = useState('')

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages])

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const value = draft.trim()

    if (!value || status !== 'connected') return

    onSend(value)
    setDraft('')
  }

  const members = [
    ...new Set([
      user.username,
      ...messages.map((message) => message.sender),
    ]),
  ]

  const filteredMessages = filter.trim()
    ? messages.filter((message) =>
        `${message.sender} ${message.text}`
          .toLowerCase()
          .includes(filter.trim().toLowerCase()),
      )
    : messages

  return (
    <main className="nova-shell">
      <aside className="nova-rail">
        <div className="nova-rail-logo">✳</div>

        <button className="rail-button selected" title="Чаты">
          ▤
        </button>

        <button
          className="rail-button"
          title="Участники"
          onClick={() => setShowDetails((value) => !value)}
        >
          ♙
        </button>

        <div className="rail-spacer" />

        <div className="rail-user" title={user.username}>
          {initials(user.username)}
        </div>
      </aside>

      <aside className="nova-sidebar">
        <div className="sidebar-head">
          <div>
            <div className="sidebar-kicker">WORKSPACE</div>
            <h2>
              Моя команда <span>⌄</span>
            </h2>
          </div>

          <button className="icon-button" title="Настройки">
            •••
          </button>
        </div>

        <div className="sidebar-search">
          <span>⌕</span>

          <input
            type="search"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="Поиск сообщений"
            aria-label="Поиск сообщений"
          />

          <kbd>⌘ K</kbd>
        </div>

        <div className="sidebar-section-title">
          РАЗГОВОРЫ
          <button title="Добавить">＋</button>
        </div>

        <button className="room-item active">
          <span className="room-symbol">#</span>

          <span>
            <strong>общий</strong>
            <small>Общий чат команды</small>
          </span>

          <i />
        </button>

        <div className="sidebar-section-title second">
          ЛИЧНОЕ
        </div>

        <div className="sidebar-empty">
          Здесь появятся личные диалоги
        </div>

        <div className="sidebar-bottom">
          <div className={`connection-pill ${status}`}>
            <i />
            {statusText[status]}
          </div>

          <button className="logout-button" onClick={onLogout}>
            Выйти из аккаунта <span>↗</span>
          </button>
        </div>
      </aside>

      <section className="nova-main">
        <header className="room-header">
          <div className="room-heading">
            <div className="room-heading-icon">#</div>

            <div>
              <h1>общий</h1>
              <p>Общение всей команды в одном месте</p>
            </div>
          </div>

          <div className="room-actions">
            <span className={`header-status ${status}`}>
              <i />
              {statusText[status]}
            </span>

            <button
              className="icon-button"
              onClick={() => setShowDetails((value) => !value)}
              title="Информация о чате"
            >
              ⓘ
            </button>
          </div>
        </header>

        <div className="message-area">
          <div className="date-divider">
            <span>НАЧАЛО ОБЩЕНИЯ</span>
          </div>

          <div className="room-intro">
            <div className="intro-hash">#</div>

            <div>
              <strong>Добро пожаловать в общий чат</strong>
              <p>
                Здесь можно задавать вопросы, делиться новостями
                и общаться с командой.
              </p>
            </div>
          </div>

          {filteredMessages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-graphic">
                <span>✳</span>
                <i />
                <b />
              </div>

              <h3>
                {filter.trim()
                  ? 'Ничего не найдено'
                  : 'Начнём разговор?'}
              </h3>

              <p>
                {filter.trim()
                  ? 'Попробуй изменить поисковый запрос.'
                  : 'Отправь первое сообщение — оно появится здесь у всех участников.'}
              </p>
            </div>
          ) : (
            <div className="nova-message-list">
              {filteredMessages.map((message) => (
                <article
                  className={`nova-message ${
                    message.own ? 'own-message' : ''
                  }`}
                  key={message.id}
                >
                  <div className="message-avatar">
                    {initials(message.sender)}
                  </div>

                  <div className="message-content">
                    <div className="message-meta">
                      <strong>{message.sender}</strong>

                      {message.own && (
                        <span className="you-label">ВЫ</span>
                      )}

                      <time>
                        {formatTime(message.timestamp)}
                      </time>
                    </div>

                    <p>{message.text}</p>
                  </div>
                </article>
              ))}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <footer className="nova-composer-wrap">
          {error && (
            <div className="nova-chat-error" role="alert">
              {error}
            </div>
          )}

          {status !== 'connected' && (
            <div className="nova-chat-hint">
              Поле станет доступно после подключения к серверу.
            </div>
          )}

          <form className="nova-composer" onSubmit={submit}>
            <button
              type="button"
              className="attach-button"
              title="Дополнительные действия"
              disabled
            >
              ＋
            </button>

            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Написать сообщение в #общий…"
              aria-label="Текст сообщения"
              disabled={status !== 'connected'}
            />

            <div className="composer-tools">
              <span>↵</span>

              <button
                type="submit"
                disabled={
                  status !== 'connected' || !draft.trim()
                }
                title="Отправить сообщение"
              >
                ↑
              </button>
            </div>
          </form>

          <div className="composer-caption">
            <span>Enter — отправить сообщение</span>
            <span>Сообщения видны всем участникам</span>
          </div>
        </footer>
      </section>

      {showDetails && (
        <aside className="nova-details">
          <div className="details-header">
            <span>ИНФОРМАЦИЯ</span>

            <button
              className="icon-button"
              onClick={() => setShowDetails(false)}
              title="Закрыть панель"
            >
              ×
            </button>
          </div>

          <div className="details-channel-icon">#</div>

          <h2>общий</h2>

          <p className="details-description">
            Главный канал команды для совместного общения
            и обмена информацией.
          </p>

          <div className="details-divider" />

          <div className="details-members-title">
            УЧАСТНИКИ <span>{members.length}</span>
          </div>

          <div className="details-member-list">
            {members.map((name, index) => (
              <div className="details-member" key={name}>
                <div className={`details-avatar color-${index % 4}`}>
                  {initials(name)}
                </div>

                <div>
                  <strong>{name}</strong>

                  <small>
                    {name === user.username
                      ? 'Ваш аккаунт'
                      : 'Участник чата'}
                  </small>
                </div>

                <i />
              </div>
            ))}
          </div>

          <div className="details-tip">
            <span>✦</span>
            <strong>Один общий разговор</strong>
            <p>
              Все участники используют одну общую переписку.
            </p>
          </div>
        </aside>
      )}

      <div className="mobile-user-strip">
        <span>
          {initials(user.username)} {user.username}
        </span>

        <button onClick={onLogout}>Выйти</button>
      </div>
    </main>
  )
}
