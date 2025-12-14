import React, { useEffect, useState } from 'react'

// Simple quiz questions (blockchain / web3 education)
const QUESTIONS = [
  {
    q: 'What is a blockchain?',
    opts: [
      'A centralized database',
      'A distributed ledger of records',
      'A type of web browser',
      'A cloud storage provider'
    ],
    a: 1
  },
  {
    q: 'What does “gas” commonly refer to in Ethereum?',
    opts: ['Transaction fee', 'Block reward', 'A wallet', 'A smart contract'],
    a: 0
  },
  {
    q: 'What is a smart contract?',
    opts: ['Physical contract', 'Self-executing code on blockchain', 'Email service', 'Encryption key'],
    a: 1
  },
  {
    q: 'Which of these is a layer-2 scaling solution?',
    opts: ['Lightning Network', 'HTTP/2', 'TLS', 'SMTP'],
    a: 0
  }
]

function makeMockTelegram() {
  if (typeof window === 'undefined') return
  if (!window.Telegram) {
    window.Telegram = {
      WebApp: {
        initData: '',
        ready() {
          console.info('Telegram.WebApp.ready() mock called')
        },
        onEvent(name, cb) {
          console.info('mock onEvent', name)
        },
        showPopup(msg) {
          alert(msg)
        }
      }
    }
  }
}

export default function App() {
  const [current, setCurrent] = useState(0)
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem('tm_points') || '0', 10))
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null)
  const [playerName, setPlayerName] = useState(localStorage.getItem('tm_name') || '')
  const [leaderboard, setLeaderboard] = useState(() => JSON.parse(localStorage.getItem('tm_leaderboard') || '[]'))

  useEffect(() => {
    // Create a mock in dev if Telegram WebApp not available
    makeMockTelegram()
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.ready) {
      window.Telegram.WebApp.ready()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tm_points', String(points))
  }, [points])

  useEffect(() => {
    localStorage.setItem('tm_leaderboard', JSON.stringify(leaderboard))
  }, [leaderboard])

  const question = QUESTIONS[current]

  function answer(idx) {
    const correct = idx === question.a
    setLastAnswerCorrect(correct)
    setPoints(p => p + (correct ? 5 : 0))
    // next question after small delay
    setTimeout(() => {
      setLastAnswerCorrect(null)
      setCurrent(c => (c + 1) % QUESTIONS.length)
    }, 900)
  }

  function level() {
    return Math.floor(points / 10) + 1
  }

  function badges() {
    const b = []
    if (points >= 10) b.push('Learner')
    if (points >= 25) b.push('Explorer')
    if (points >= 50) b.push('Validator')
    return b
  }

  function saveScore() {
    if (!playerName) {
      window.Telegram.WebApp.showPopup('Please enter a name before saving your score.')
      return
    }
    const entry = { name: playerName, points, when: Date.now() }
    const copy = [...leaderboard, entry].sort((a, b) => b.points - a.points).slice(0, 10)
    setLeaderboard(copy)
    window.Telegram.WebApp.showPopup(`Score saved for ${playerName}!`)
    localStorage.setItem('tm_name', playerName)
  }

  function resetProgress() {
    setPoints(0)
    setLeaderBoardEmpty()
  }

  function setLeaderBoardEmpty() {
    setLeaderboard([])
  }

  return (
    <div className="app">
      <div className="header card">
        <div className="title">Web3 Mini App — Learn & Play</div>
        <div className="controls center">
          <div className="small muted">Points: <strong>{points}</strong></div>
          <button className="btn" onClick={() => window.Telegram.WebApp.showPopup('Open this in Telegram to use native features!')}>Open in Telegram</button>
        </div>
      </div>

      <div className="content">
        <div className="card quiz">
          <div className="question">{question.q}</div>
          <div className="options">
            {question.opts.map((o, i) => (
              <div key={i} className="opt" onClick={() => answer(i)}>
                {o}
              </div>
            ))}
          </div>

          {lastAnswerCorrect === true && <div className="small" style={{marginTop:12,color:'#8af78a'}}>Correct! +5 points</div>}
          {lastAnswerCorrect === false && <div className="small" style={{marginTop:12,color:'#ff9b9b'}}>Incorrect — try the next one</div>}

          <div style={{marginTop:14}} className="small muted">Tip: Quick quizzes earn points; collect badges and climb the leaderboard.</div>
        </div>

        <div className="card stats">
          <div className="small muted">Level</div>
          <div style={{fontSize:22, marginTop:4}}>Lv {level()} <span className="badge" style={{marginLeft:8}}>XP {points}</span></div>

          <div style={{marginTop:12}}>
            <div className="small muted">Badges</div>
            <div style={{marginTop:8}}>
              {badges().length ? badges().map(b => <span key={b} className="badge" style={{marginRight:8}}>{b}</span>) : <div className="small muted">No badges yet — earn points!</div>}
            </div>
          </div>

          <div style={{marginTop:12}}>
            <div className="small muted">Save Score</div>
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <input value={playerName} onChange={e => setPlayerName(e.target.value)} placeholder="Your name" style={{flex:1, padding:8, borderRadius:8, border:'1px solid rgba(255,255,255,0.06)', background:'#031022', color:'var(--text)'}} />
              <button className="btn" onClick={saveScore}>Save</button>
            </div>
          </div>

          <div className="leader">
            <div className="small muted" style={{marginTop:14}}>Leaderboard</div>
            {leaderboard.length ? leaderboard.map((l, i) => (
              <div className="leader-item" key={i}><div>{i+1}. {l.name}</div><div className="muted">{l.points}</div></div>
            )) : <div className="small muted">No scores yet — be the first!</div>}
          </div>

          <div style={{marginTop:12, display:'flex', gap:8}}>
            <button className="btn" onClick={() => setPoints(p => p + 1)}>+1 XP (debug)</button>
            <button className="btn" onClick={resetProgress}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  )
}
