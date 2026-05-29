import { useMemo, useState } from 'react'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'

function App() {
  const [moodText, setMoodText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [detectedMood, setDetectedMood] = useState('')
  const [recommendations, setRecommendations] = useState([])
  const floatingNotes = useMemo(
    () => [
      { icon: '♪', x: '10%', y: '16%', delay: 0, size: 'text-xl' },
      { icon: '♫', x: '85%', y: '20%', delay: 0.3, size: 'text-2xl' },
      { icon: '♬', x: '18%', y: '78%', delay: 0.5, size: 'text-xl' },
      { icon: '♪', x: '88%', y: '72%', delay: 0.2, size: 'text-lg' },
      { icon: '♫', x: '50%', y: '10%', delay: 0.4, size: 'text-xl' },
    ],
    [],
  )
  const apiBaseUrl = import.meta.env.VITE_API_URL || '' 

  const handleAnalyzeMood = async () => {
    const trimmedMood = moodText.trim()
    if (!trimmedMood) {
      setError('Please describe your mood first.')
      return
    }

    setIsLoading(true)
    setError('')
    setDetectedMood('')
    setRecommendations([])

    try {
      const response = await axios.post(`${apiBaseUrl}/api/mood/analyze`, {
        mood: trimmedMood,
      })
      setDetectedMood(response.data.detectedMood || 'calm')
      setRecommendations(response.data.recommendations || [])
    } catch (requestError) {
      console.error('Full error:', requestError)
      console.error('Response:', requestError.response)
      console.error('Is network error:', !requestError.response)
      
      const message = requestError.response?.data?.message ||
        (requestError.code === 'ERR_NETWORK' ? 'Cannot connect to server. Is the backend running?' :
        'Could not analyze mood right now. Please try again.')
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-[#1a0439] to-[#090014] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl" />
        <div className="absolute -right-20 bottom-16 h-72 w-72 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {floatingNotes.map((note, index) => (
        <motion.span
          key={`${note.icon}-${index}`}
          className={`pointer-events-none absolute ${note.size} text-fuchsia-300/80 drop-shadow-[0_0_14px_rgba(232,121,249,0.85)]`}
          style={{ left: note.x, top: note.y }}
          animate={{ y: [0, -14, 0], opacity: [0.45, 0.9, 0.45], rotate: [0, 6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: note.delay }}
        >
          {note.icon}
        </motion.span>
      ))}

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-14 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
          className="w-full rounded-3xl border border-fuchsia-300/20 bg-white/5 p-6 shadow-[0_0_60px_rgba(168,85,247,0.2)] backdrop-blur-xl sm:p-10"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.15 }}
            className="bg-gradient-to-r from-fuchsia-300 via-violet-200 to-indigo-300 bg-clip-text text-center text-5xl font-extrabold tracking-tight text-transparent drop-shadow-[0_0_20px_rgba(196,181,253,0.65)] sm:text-7xl"
          >
            Moodify AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-violet-100/85 sm:text-lg"
          >
            AI-powered mood detection meets personalized playlists. Describe how you
            feel, and Moodify AI recommends the perfect soundscape in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mx-auto mt-10 max-w-2xl"
          >
            <label htmlFor="mood" className="mb-3 block text-sm font-medium text-violet-200">
              Tell us your mood
            </label>
            <textarea
              id="mood"
              value={moodText}
              onChange={(event) => setMoodText(event.target.value)}
              placeholder="e.g. I feel calm, dreamy, and ready for a late-night focus session..."
              className="min-h-36 w-full resize-none rounded-2xl border border-violet-300/30 bg-black/35 p-4 text-sm text-violet-50 placeholder:text-violet-200/60 shadow-inner shadow-violet-500/10 outline-none transition focus:border-fuchsia-300 focus:shadow-[0_0_0_3px_rgba(232,121,249,0.22)] sm:text-base"
            />
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 32px rgba(232,121,249,0.65)' }}
              whileTap={{ scale: 0.98 }}
              animate={{ boxShadow: ['0 0 14px rgba(139,92,246,0.45)', '0 0 26px rgba(217,70,239,0.72)', '0 0 14px rgba(139,92,246,0.45)'] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              type="button"
              onClick={handleAnalyzeMood}
              disabled={isLoading}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-600 px-6 py-3 text-sm font-semibold tracking-wide text-white sm:w-auto sm:text-base"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Mood'}
            </motion.button>

            <AnimatePresence>
              {error ? (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-4 rounded-lg border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-200"
                >
                  {error}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mx-auto mt-10 max-w-4xl"
              >
                <p className="text-center text-sm text-violet-200/80">
                  Matching your mood with Spotify playlists...
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {!isLoading && recommendations.length > 0 ? (
              <motion.section
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="mx-auto mt-10 max-w-5xl"
              >
                <h2 className="text-center text-lg font-semibold text-fuchsia-200 sm:text-xl">
                  Recommended for your <span className="capitalize">{detectedMood}</span> mood
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendations.map((playlist, index) => (
                    <motion.article
                      key={playlist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.06,
                        duration: 0.35,
                      }}
                      className="rounded-2xl border border-violet-300/25 bg-black/35 p-4 shadow-[0_0_25px_rgba(147,51,234,0.18)] backdrop-blur-md"
                    >
                      {playlist.image ? (
                        <img
                          src={playlist.image}
                          alt={playlist.name}
                          className="h-44 w-full rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-44 w-full items-center justify-center rounded-lg bg-violet-500/15 text-violet-200">
                          No Image
                        </div>
                      )}

                      <h3 className="mt-4 line-clamp-2 text-base font-semibold text-violet-100">
                        {playlist.name}
                      </h3>

                      <div
                        className="mt-2 line-clamp-3 text-sm text-violet-200/80"
                        dangerouslySetInnerHTML={{
                          __html: playlist.description,
                        }}
                      />

                      <p className="mt-2 text-xs text-violet-300/70">
                        By {playlist.owner}
                      </p>

                      {playlist.spotifyUrl && (
                        <a
                          href={playlist.spotifyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex rounded-md bg-violet-500/30 px-3 py-1.5 text-xs font-medium text-violet-100 transition hover:bg-violet-400/40"
                        >
                          Open Playlist
                        </a>
                      )}
                    </motion.article>
                  ))}
                </div>
              </motion.section>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  )
}

export default App
