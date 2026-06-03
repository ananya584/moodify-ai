import { useMemo, useState } from 'react'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'

const MUSIC_PREFERENCES = [
  'Punjabi',
  'Bollywood',
  'Jazz',
  'Indie',
  'Classical',
  'Electronic',
  'Hip-Hop',
  'Pop',
  'Rock',
  'Ambient',
  'Country',
  'K-Pop',
]

function formatMoodLabel(mood) {
  if (!mood) return ''
  return mood.charAt(0).toUpperCase() + mood.slice(1)
}

function App() {
  const [moodText, setMoodText] = useState('')
  const [selectedPreference, setSelectedPreference] = useState('')
  const [customPreference, setCustomPreference] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [detectedMood, setDetectedMood] = useState('')
  const [subMood, setSubMood] = useState('')
  const [insight, setInsight] = useState('')
  const [genres, setGenres] = useState([])
  const [preferenceUsed, setPreferenceUsed] = useState('')
  const [recommendations, setRecommendations] = useState([])

  const effectivePreference =
    selectedPreference === 'Other'
      ? customPreference.trim()
      : selectedPreference

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
      setError('Tell us how you are feeling — Hindi, English, or Hinglish all work.')
      return
    }

    if (!effectivePreference) {
      setError('Pick a music preference (or type your own under Other).')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await axios.post(`${apiBaseUrl}/api/mood/analyze`, {
        mood: trimmedMood,
        preference: effectivePreference,
      })

      setDetectedMood(response.data.detectedMood || '')
      setSubMood(response.data.subMood || '')
      setInsight(response.data.insight || '')
      setGenres(response.data.genres || [])
      setPreferenceUsed(response.data.preference || effectivePreference)
      setRecommendations(response.data.recommendations || [])
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        (requestError.code === 'ERR_NETWORK'
          ? 'Cannot reach the server. Make sure the backend is running on port 8000.'
          : 'Could not analyze your mood. Please try again.')
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const openPlaylist = (playlist) => {
    const url =
      playlist.spotifyAppUrl ||
      playlist.spotifyUrl ||
      `https://open.spotify.com/playlist/${playlist.id}`
    window.open(url, '_blank', 'noopener,noreferrer')
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
            className="bg-gradient-to-r from-fuchsia-300 via-violet-200 to-indigo-300 bg-clip-text text-center text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl"
          >
            Moodify AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-violet-100/85 sm:text-lg"
          >
            Describe your mood in any language mix. We read the feeling, match your music taste, and surface the best Spotify playlists — not the longest list.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mx-auto mt-10 max-w-2xl"
          >
            <div>
              <label htmlFor="mood" className="mb-2 block text-sm font-semibold text-violet-100">
                How are you feeling right now?
              </label>
              <p className="mb-3 text-xs leading-relaxed text-violet-300/90 sm:text-sm">
                Hindi, English, or Hinglish — mixed lines are welcome.
              </p>
              <textarea
                id="mood"
                value={moodText}
                onChange={(e) => setMoodText(e.target.value)}
                placeholder="e.g. Feeling upbeat… / Feeling low…"
                className="min-h-32 w-full resize-none rounded-2xl border border-violet-300/30 bg-black/35 p-4 text-sm text-violet-50 placeholder:text-violet-200/55 shadow-inner outline-none transition focus:border-fuchsia-300 focus:shadow-[0_0_0_3px_rgba(232,121,249,0.22)] sm:text-base"
              />
            </div>

            <div className="mt-8">
              <label className="mb-2 block text-sm font-semibold text-violet-100">
                What kind of music do you want?
              </label>
              <p className="mb-3 text-xs leading-relaxed text-violet-300/90 sm:text-sm">
                Pick a culture or genre — Punjabi, Bollywood, Jazz, or anything else. This shapes which popular playlists we hunt for.
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {[...MUSIC_PREFERENCES, 'Other'].map((preference) => (
                  <button
                    key={preference}
                    type="button"
                    onClick={() => setSelectedPreference(preference)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      selectedPreference === preference
                        ? 'bg-fuchsia-500 text-white shadow-[0_0_20px_rgba(232,121,249,0.5)]'
                        : 'border border-violet-300/30 bg-black/35 text-violet-200 hover:bg-violet-500/20'
                    }`}
                  >
                    {preference}
                  </button>
                ))}
              </div>
              {selectedPreference === 'Other' && (
                <input
                  type="text"
                  value={customPreference}
                  onChange={(e) => setCustomPreference(e.target.value)}
                  placeholder="e.g. Lo-fi, Ghazal, Tamil, Afrobeats…"
                  className="mt-3 w-full rounded-xl border border-violet-300/30 bg-black/35 px-4 py-3 text-sm text-violet-50 placeholder:text-violet-200/55 outline-none focus:border-fuchsia-300"
                />
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleAnalyzeMood}
              disabled={isLoading}
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(168,85,247,0.35)] disabled:opacity-50 sm:text-base"
            >
              {isLoading ? 'Analyzing your vibe…' : '✨ Analyze Mood'}
            </motion.button>

            {!isLoading && recommendations.length > 0 && (
              <p className="mt-3 text-center text-xs text-violet-300/75">
                Tap Analyze again with the same mood & preference to get 5 different top playlists.
              </p>
            )}

            <AnimatePresence>
              {error ? (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 rounded-lg border border-rose-400/40 bg-rose-500/10 p-3 text-sm text-rose-200"
                >
                  {error}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </motion.div>

          {isLoading && (
            <p className="mx-auto mt-8 max-w-md text-center text-sm text-violet-200/80">
              Reading your mood, then ranking high-follower Spotify playlists…
            </p>
          )}

          <AnimatePresence>
            {!isLoading && recommendations.length > 0 ? (
              <motion.section
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-auto mt-10 max-w-5xl"
              >
                <div className="mb-6 rounded-2xl border border-violet-400/25 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-fuchsia-300/90">
                    Mood analysis
                  </p>
                  <h2 className="mt-1 text-2xl font-bold capitalize text-white">
                    {formatMoodLabel(detectedMood)}
                    {subMood ? (
                      <span className="font-normal text-violet-200">
                        {' '}
                        · {formatMoodLabel(subMood)}
                      </span>
                    ) : null}
                  </h2>
                  {insight && (
                    <p className="mt-3 text-sm leading-relaxed text-violet-100/90">{insight}</p>
                  )}
                  {genres.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {genres.map((genre) => (
                        <span
                          key={genre}
                          className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs text-fuchsia-100"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-4 text-xs text-violet-300/80">
                    Music taste:{' '}
                    <span className="font-medium text-violet-100">{preferenceUsed}</span>
                  </p>
                </div>

                <h3 className="mb-4 text-center text-lg font-semibold text-fuchsia-200">
                  Top 5 playlists for you
                </h3>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {recommendations.map((playlist, index) => (
                    <motion.article
                      key={`${playlist.id}-${index}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.07 }}
                      className="flex flex-col overflow-hidden rounded-2xl border border-violet-300/25 bg-black/40 shadow-[0_0_25px_rgba(147,51,234,0.15)]"
                    >
                      {playlist.image ? (
                        <img
                          src={playlist.image}
                          alt=""
                          className="aspect-square w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-square w-full items-center justify-center bg-violet-900/40 text-violet-300">
                          No cover
                        </div>
                      )}

                      <div className="flex flex-1 flex-col p-4">
                        <h4 className="line-clamp-2 text-base font-semibold text-white">
                          {playlist.name}
                        </h4>

                        {playlist.description && (
                          <p className="mt-2 line-clamp-2 text-xs text-violet-200/75">
                            {playlist.description}
                          </p>
                        )}

                        <div className="mt-3 space-y-0.5 text-xs text-violet-300/85">
                          <p>Curated by {playlist.owner}</p>
                          <p>
                            {(playlist.followers ?? 0).toLocaleString()} followers
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => openPlaylist(playlist)}
                          className="mt-4 w-full rounded-lg bg-[#1DB954] py-2.5 text-sm font-semibold text-white transition hover:bg-[#1ed760]"
                        >
                          Open Playlist
                        </button>
                      </div>
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
