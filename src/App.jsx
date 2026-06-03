// import { useMemo, useState } from 'react'
// import axios from 'axios'
// import { AnimatePresence, motion } from 'framer-motion'
// import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './firebase/firebase'
// import { doc, setDoc, Timestamp } from 'firebase/firestore'

// const MUSIC_PREFERENCES = [
//   'Punjabi',
//   'Bollywood',
//   'Jazz',
//   'Indie',
//   'Classical',
//   'Electronic',
//   'Hip-Hop',
//   'Pop',
//   'Rock',
//   'Ambient',
//   'Country',
//   'K-Pop',
// ]

// function getFirebaseErrorMessage(errorCode) {
//   switch (errorCode) {
//     case 'auth/invalid-email':
//       return 'Please enter a valid email address.'

//     case 'auth/user-not-found':
//       return 'No account found with this email.'

//     case 'auth/wrong-password':
//       return 'Incorrect password. Please try again.'

//     case 'auth/invalid-credential':
//       return 'Invalid email or password.'

//     case 'auth/email-already-in-use':
//       return 'An account with this email already exists.'

//     case 'auth/weak-password':
//       return 'Password must be at least 6 characters long.'

//     case 'auth/too-many-requests':
//       return 'Too many failed attempts. Please try again later.'

//     case 'auth/network-request-failed':
//       return 'Network error. Check your internet connection.'

//     default:
//       return 'Something went wrong. Please try again.'
//   }
// }

// function formatMoodLabel(mood) {
//   if (!mood) return ''
//   return mood.charAt(0).toUpperCase() + mood.slice(1)
// }

// // ─── Shared Logo Component ────────────────────────────────────────────────────

// function MoodifyLogo({ size = 'md' }) {
//   const dim = size === 'lg' ? 96 : 64
//   const fontSize = size === 'lg' ? 28 : 18

//   return (
//     <div
//       style={{
//         width: dim,
//         height: dim,
//         borderRadius: '50%',
//         border: '2.5px solid #1DB954',
//         boxShadow: '0 0 24px rgba(29,185,84,0.55), 0 0 6px rgba(29,185,84,0.3)',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background: '#111',
//         flexShrink: 0,
//       }}
//     >
//       {/* Soundwave bars */}
//       <svg
//         width={fontSize * 1.6}
//         height={fontSize}
//         viewBox="0 0 32 20"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <rect x="0" y="8" width="4" height="4" rx="2" fill="#1DB954" />
//         <rect x="7" y="4" width="4" height="12" rx="2" fill="#1DB954" />
//         <rect x="14" y="0" width="4" height="20" rx="2" fill="#1DB954" />
//         <rect x="21" y="4" width="4" height="12" rx="2" fill="#1DB954" />
//         <rect x="28" y="8" width="4" height="4" rx="2" fill="#1DB954" />
//       </svg>
//     </div>
//   )
// }

// // ─── Screen: Splash ───────────────────────────────────────────────────────────

// function SplashScreen({ onLogin, onSignUp }) {
//   return (
//     <motion.div
//       key="splash"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       style={styles.screen}
//     >
//       <div style={styles.splashCenter}>
//         <MoodifyLogo size="lg" />

//         <h1 style={styles.splashTitle}>Moodify</h1>
//         <p style={styles.splashSubtitle}>Music that matches your mood</p>

//         <div style={{ width: '100%', maxWidth: 380, marginTop: 64, display: 'flex', flexDirection: 'column', gap: 16 }}>
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.97 }}
//             onClick={onLogin}
//             style={styles.btnOutline}
//           >
//             Log In
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.97 }}
//             onClick={onSignUp}
//             style={styles.btnGreen}
//           >
//             Sign Up
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// // ─── Screen: Login ────────────────────────────────────────────────────────────

// function LoginScreen({ onLogin, onSignUp }) {
//   const [identifier, setIdentifier] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [focusedField, setFocusedField] = useState('')

//   const handleLogin = async () => {
//     try {
//       console.log("LOGIN START")

//       const credential =
//         await signInWithEmailAndPassword(
//           auth,
//           identifier,
//           password
//         )

//       console.log("LOGIN SUCCESS")
//       console.log(credential.user)

//       onLogin(credential.user)

//       console.log("AFTER ONLOGIN")

//     } catch (err) {
//       console.error("LOGIN ERROR", err)
//       setError(getFirebaseErrorMessage(err.code))
//     }
//   }

//   return (
//     <motion.div
//       key="login"
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.4 }}
//       style={styles.screen}
//     >
//       <div style={styles.formPageWrap}>
//         <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
//           <MoodifyLogo size="md" />
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           style={styles.card}
//         >
//           <h2 style={styles.cardTitle}>Welcome Back</h2>

//           <div style={styles.fieldGroup}>
//             <input
//               type="text"
//               placeholder="Enter your email"
//               value={identifier}
//               onChange={(e) => { setIdentifier(e.target.value); setError('') }}
//               onFocus={() => setFocusedField('id')}
//               onBlur={() => setFocusedField('')}
//               style={{
//                 ...styles.input,
//                 ...(focusedField === 'id' ? styles.inputFocused : {}),
//               }}
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => { setPassword(e.target.value); setError('') }}
//               onFocus={() => setFocusedField('pw')}
//               onBlur={() => setFocusedField('')}
//               style={{
//                 ...styles.input,
//                 ...(focusedField === 'pw' ? styles.inputFocused : {}),
//               }}
//             />
//           </div>

//           {error && <p style={styles.errorText}>{error}</p>}

//           <motion.button
//             whileHover={{ scale: 1.02, backgroundColor: '#1ed760' }}
//             whileTap={{ scale: 0.97 }}
//             onClick={handleLogin}
//             style={styles.btnGreen}
//           >
//             Log In
//           </motion.button>

//           <button style={styles.linkBtn}>Forgot Password?</button>

//           <p style={styles.switchText}>
//             Don&apos;t have an account?{' '}
//             <span onClick={onSignUp} style={styles.greenLink}>
//               Sign Up
//             </span>
//           </p>
//         </motion.div>
//       </div>
//     </motion.div>
//   )
// }

// // ─── Screen: Subscription Screen ───────────────────────────────────────────────────
// function SubscriptionScreen({ onContinue }) {
//   const features = [
//     {
//       icon: '📊',
//       title: 'Unlimited Mood Analysis',
//       subtitle: 'Analyze your mood as many times as you want',
//     },
//     {
//       icon: '🎵',
//       title: 'AI-Powered Playlists',
//       subtitle: 'Personalized playlists that match your vibe perfectly',
//     },
//     {
//       icon: '🌍',
//       title: 'Bollywood, Punjabi & Global Music',
//       subtitle: 'Explore music across languages and genres',
//     },
//     {
//       icon: '📈',
//       title: 'Advanced Mood Insights',
//       subtitle: 'Deeper insights to understand your emotions',
//     },
//     {
//       icon: '⚡',
//       title: 'Priority Recommendations',
//       subtitle: 'Get the best and most relevant suggestions first',
//     },
//   ]

//   return (
//     <motion.div
//       key="subscription"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       style={{
//         minHeight: '100vh',
//         background: '#000000',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: '16px',
//       }}
//     >
//       <div
//         style={{
//           width: '100%',
//           maxWidth: '1200px',
//           background: '#121212',
//           border: '1px solid #222222',
//           borderRadius: '24px',
//           padding: '28px',
//         }}
//       >
//         {/* HEADER */}
//         <div
//           style={{
//             textAlign: 'center',
//             marginBottom: '20px',
//           }}
//         >
//           <h1
//             style={{
//               fontSize: '38px',
//               fontWeight: '900',
//               margin: '0',
//               color: '#ffffff',
//               letterSpacing: '-0.5px',
//             }}
//           >
//             Moodify Premium
//           </h1>

//           <p
//             style={{
//               color: '#b0b0b0',
//               fontSize: '15px',
//               marginTop: '6px',
//               marginBottom: '0',
//               fontWeight: '500',
//             }}
//           >
//             Start your 3-month free trial. Cancel anytime.
//           </p>
//         </div>

//         {/* MAIN CONTENT GRID */}
//         <div
//           style={{
//             display: 'grid',
//             gridTemplateColumns: '1.1fr 0.9fr',
//             gap: '20px',
//             marginBottom: '20px',
//           }}
//         >
//           {/* LEFT PANEL - FEATURES */}
//           <div
//             style={{
//               background: '#111111',
//               borderRadius: '20px',
//               padding: '24px',
//             }}
//           >
//             <h3
//               style={{
//                 color: GREEN,
//                 fontSize: '18px',
//                 fontWeight: '700',
//                 marginTop: '0',
//                 marginBottom: '16px',
//               }}
//             >
//               Premium includes everything:
//             </h3>

//             {features.map((item, index) => (
//               <div
//                 key={item.title}
//                 style={{
//                   display: 'flex',
//                   gap: '12px',
//                   paddingBottom: '14px',
//                   marginBottom: '14px',
//                   borderBottom:
//                     index !== features.length - 1
//                       ? '1px solid #232323'
//                       : 'none',
//                 }}
//               >
//                 <div
//                   style={{
//                     width: '42px',
//                     height: '42px',
//                     minWidth: '42px',
//                     borderRadius: '50%',
//                     border: `2px solid ${GREEN}`,
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     color: GREEN,
//                     fontSize: '18px',
//                     flexShrink: 0,
//                   }}
//                 >
//                   {item.icon}
//                 </div>

//                 <div style={{ flex: 1 }}>
//                   <h4
//                     style={{
//                       margin: '0',
//                       color: '#ffffff',
//                       fontSize: '14px',
//                       fontWeight: '600',
//                     }}
//                   >
//                     {item.title}
//                   </h4>

//                   <p
//                     style={{
//                       marginTop: '3px',
//                       marginBottom: '0',
//                       color: '#a0a0a0',
//                       fontSize: '12px',
//                       lineHeight: '1.4',
//                     }}
//                   >
//                     {item.subtitle}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* RIGHT PANEL - PRICING */}
//           <div
//             style={{
//               background: '#0d0d0d',
//               border: `2px solid ${GREEN}`,
//               borderRadius: '20px',
//               padding: '24px',
//               display: 'flex',
//               flexDirection: 'column',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               textAlign: 'center',
//             }}
//           >
//             <div style={{ width: '100%' }}>
//               {/* TRIAL PILL */}
//               <div
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   background: 'rgba(29, 185, 84, 0.15)',
//                   color: GREEN,
//                   padding: '8px 18px',
//                   borderRadius: '999px',
//                   fontWeight: '700',
//                   fontSize: '12px',
//                   border: `1px solid ${GREEN}`,
//                   margin: '0 auto 16px auto',
//                   width: 'fit-content',
//                 }}
//               >
//                 3-Month Free Trial
//               </div>

//               {/* PRICE */}
//               <div
//                 style={{
//                   display: 'flex',
//                   alignItems: 'flex-end',
//                   justifyContent: 'center',
//                   gap: '6px',
//                   marginBottom: '6px',
//                 }}
//               >
//                 <span
//                   style={{
//                     fontSize: '56px',
//                     fontWeight: '900',
//                     lineHeight: '1',
//                     color: '#ffffff',
//                   }}
//                 >
//                   ₹49
//                 </span>

//                 <span
//                   style={{
//                     fontSize: '18px',
//                     color: '#d0d0d0',
//                     marginBottom: '6px',
//                     fontWeight: '600',
//                   }}
//                 >
//                   /month
//                 </span>
//               </div>

//               <p
//                 style={{
//                   color: '#999999',
//                   fontSize: '12px',
//                   marginTop: '4px',
//                   marginBottom: '14px',
//                 }}
//               >
//                 Billed monthly after free trial
//               </p>

//               {/* BENEFITS */}
//               <div
//                 style={{
//                   borderTop: '1px solid #232323',
//                   paddingTop: '14px',
//                 }}
//               >
//                 <div
//                   style={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: '10px',
//                     color: '#e0e0e0',
//                     fontSize: '14px',
//                     alignItems: 'flex-start',
//                   }}
//                 >
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                     <span style={{ color: GREEN, fontSize: '14px' }}>✓</span>
//                     <span>3 months FREE for new users</span>
//                   </div>

//                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                     <span style={{ color: GREEN, fontSize: '14px' }}>✓</span>
//                     <span>Cancel anytime, no hidden charges</span>
//                   </div>

//                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                     <span style={{ color: GREEN, fontSize: '14px' }}>✓</span>
//                     <span>Secure and easy payments</span>
//                   </div>

//                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//                     <span style={{ color: GREEN, fontSize: '14px' }}>✓</span>
//                     <span>Premium support</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <p
//               style={{
//                 textAlign: 'center',
//                 color: '#888888',
//                 fontSize: '11px',
//                 marginTop: '14px',
//                 marginBottom: 0,
//               }}
//             >
//               After 3 months, ₹49 will be charged every month.
//             </p>
//           </div>
//         </div>

//         {/* CTA BUTTON */}
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={onContinue}
//           style={{
//             background: GREEN,
//             color: '#000000',
//             width: '100%',
//             border: 'none',
//             borderRadius: '999px',
//             padding: '15px 24px',
//             fontSize: '15px',
//             fontWeight: '700',
//             cursor: 'pointer',
//             transition: 'all 0.2s ease',
//             marginBottom: '10px',
//           }}
//         >
//           Start Free Trial for 3 Months
//         </motion.button>

//         <p
//           style={{
//             textAlign: 'center',
//             color: '#888888',
//             fontSize: '11px',
//             marginTop: '0',
//             marginBottom: '0',
//           }}
//         >
//           🔒 Secure payments • Cancel anytime • No commitment
//         </p>
//       </div>
//     </motion.div>
//   )
// }

// // ─── Screen: Sign Up ──────────────────────────────────────────────────────────

// function SignUpScreen({ onSignUp, onLogin }) {
//   const [fullName, setFullName] = useState('')
//   const [identifier, setIdentifier] = useState('')
//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [error, setError] = useState('')
//   const [focusedField, setFocusedField] = useState('')

//   const handleSignUp = async () => {
//     try {
//       if (!fullName.trim()) {
//         setError('Please enter your full name.')
//         return
//       }

//       if (!identifier.trim()) {
//         setError('Please enter your email address.')
//         return
//       }

//       if (password.length < 6) {
//         setError('Password must be at least 6 characters long.')
//         return
//       }

//       if (password !== confirmPassword) {
//         setError('Passwords do not match.')
//         return
//       }
//       const credential =
//         await createUserWithEmailAndPassword(
//           auth,
//           identifier,
//           password
//         )

//       console.log("AUTH SUCCESS")

//       const user = credential.user

//       const trialEnd = new Date()
//       trialEnd.setMonth(trialEnd.getMonth() + 3)

//       console.log("BEFORE SETDOC")

//       await setDoc(
//         doc(db, 'users', user.uid),
//         {
//           uid: user.uid,
//           email: user.email,
//           createdAt: Timestamp.now(),
//           trialEndsAt: Timestamp.fromDate(trialEnd),
//           plan: 'trial',
//         }
//       )

//       console.log("SETDOC SUCCESS")
//       console.log("NAVIGATING TO HOME")
//       onSignUp(user)

//     } catch (err) {
//       console.error(err)
//       setError(getFirebaseErrorMessage(err.code))
//     }
//   }

//   return (
//     <motion.div
//       key="signup"
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.4 }}
//       style={styles.screen}
//     >
//       <div style={styles.formPageWrap}>
//         <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
//           <MoodifyLogo size="md" />
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           style={styles.card}
//         >
//           <h2 style={styles.cardTitle}>Create Account</h2>

//           <div style={styles.fieldGroup}>
//             {[
//               { placeholder: 'Full Name', value: fullName, setter: setFullName, type: 'text', key: 'name' },
//               { placeholder: 'Enter your email', value: identifier, setter: setIdentifier, type: 'text', key: 'id' },
//               { placeholder: 'Password', value: password, setter: setPassword, type: 'password', key: 'pw' },
//               { placeholder: 'Confirm Password', value: confirmPassword, setter: setConfirmPassword, type: 'password', key: 'cpw' },
//             ].map((field) => (
//               <input
//                 key={field.key}
//                 type={field.type}
//                 placeholder={field.placeholder}
//                 value={field.value}
//                 onChange={(e) => { field.setter(e.target.value); setError('') }}
//                 onFocus={() => setFocusedField(field.key)}
//                 onBlur={() => setFocusedField('')}
//                 style={{
//                   ...styles.input,
//                   ...(focusedField === field.key ? styles.inputFocused : {}),
//                 }}
//               />
//             ))}
//           </div>

//           {error && <p style={styles.errorText}>{error}</p>}

//           <motion.button
//             whileHover={{ scale: 1.02, backgroundColor: '#1ed760' }}
//             whileTap={{ scale: 0.97 }}
//             onClick={handleSignUp}
//             style={styles.btnGreen}
//           >
//             Create Account
//           </motion.button>

//           <p style={styles.switchText}>
//             Already have an account?{' '}
//             <span onClick={onLogin} style={styles.greenLink}>
//               Log In
//             </span>
//           </p>
//         </motion.div>
//       </div>
//     </motion.div>
//   )
// }

// // ─── Screen: Home (Mood Analyzer) ─────────────────────────────────────────────

// function HomeScreen({ user, onLogout, onResults }) {
//   const [moodText, setMoodText] = useState('')
//   const [selectedPreference, setSelectedPreference] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [focusedTextarea, setFocusedTextarea] = useState(false)

//   const apiBaseUrl = import.meta.env.VITE_API_URL || ''
//   console.log("API URL:", apiBaseUrl)

//   const handleAnalyzeMood = async () => {
//     if (!moodText.trim()) {
//       setError('Tell us how you are feeling — Hindi, English, or Hinglish all work.')
//       return
//     }
//     if (!selectedPreference) {
//       setError('Pick a music preference.')
//       return
//     }
//     console.log("ANALYZE CLICKED")
//     setIsLoading(true)
//     setError('')

//     try {
//       console.log("CALLING BACKEND")
//       const response = await axios.post(`${apiBaseUrl}/api/mood/analyze`, {
//         mood: moodText.trim(),
//         preference: selectedPreference,
//       })

//       onResults({
//         detectedMood: response.data.detectedMood || '',
//         subMood: response.data.subMood || '',
//         insight: response.data.insight || '',
//         genres: response.data.genres || [],
//         preferenceUsed: response.data.preference || selectedPreference,
//         recommendations: response.data.recommendations || [],
//       })
//     } catch (requestError) {
//       const message =
//         requestError.response?.data?.message ||
//         (requestError.code === 'ERR_NETWORK'
//           ? 'Cannot connect to the server. Please try again.'
//           : 'Could not analyze your mood right now.')

//       setError(message)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <motion.div
//       key="home"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       style={{ ...styles.screen, overflowY: 'auto', paddingTop: 32, paddingBottom: 48 }}
//     >
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 680, margin: '0 auto', padding: '0 20px', width: '100%' }}>
//         {/* Logo + Name */}
//         <MoodifyLogo size="md" />
//         <p style={{ color: '#fff', fontWeight: 600, fontSize: 16, marginTop: 10, marginBottom: 0 }}>Moodify</p>

//         {/* Heading */}
//         <h1 style={{ color: '#fff', fontSize: 'clamp(28px, 7vw, 52px)', fontWeight: 800, marginTop: 28, marginBottom: 0, textAlign: 'center', lineHeight: 1.1 }}>
//           How are you feeling today?
//         </h1>

//         {/* Mood textarea */}
//         <textarea
//           placeholder="Describe your mood here..."
//           value={moodText}
//           onChange={(e) => { setMoodText(e.target.value); setError('') }}
//           onFocus={() => setFocusedTextarea(true)}
//           onBlur={() => setFocusedTextarea(false)}
//           style={{
//             ...styles.textarea,
//             ...(focusedTextarea ? styles.inputFocused : {}),
//             marginTop: 24,
//           }}
//           rows={4}
//         />

//         {/* Examples
//         <div style={{ width: '100%', marginTop: 20 }}>
//           <p style={{ color: '#aaa', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>EXAMPLES:</p>
//           {['Coding kar ke thak gaya hu', 'Feeling heartbroken tonight', 'Need motivation for gym', 'Want peaceful music before sleeping'].map((ex) => (
//             <p
//               key={ex}
//               onClick={() => setMoodText(ex)}
//               style={{ color: '#bbb', fontSize: 14, marginBottom: 4, cursor: 'pointer' }}
//             >
//               · {ex}
//             </p>
//           ))}
//         </div> */}

//         {/* Music preference */}
//         <div style={{ width: '100%', marginTop: 28 }}>
//           <p style={{ color: '#aaa', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 12 }}>SELECT MUSIC PREFERENCE:</p>
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
//             {MUSIC_PREFERENCES.map((pref) => (
//               <motion.button
//                 key={pref}
//                 whileHover={{ scale: 1.04 }}
//                 whileTap={{ scale: 0.96 }}
//                 onClick={() => { setSelectedPreference(pref); setError('') }}
//                 style={{
//                   ...styles.prefChip,
//                   ...(selectedPreference === pref ? styles.prefChipActive : {}),
//                 }}
//               >
//                 {pref}
//               </motion.button>
//             ))}
//           </div>
//         </div>

//         {error && <p style={{ ...styles.errorText, marginTop: 16 }}>{error}</p>}

//         {/* Analyze button */}
//         <motion.button
//           whileHover={{ scale: 1.02, backgroundColor: '#1ed760' }}
//           whileTap={{ scale: 0.97 }}
//           onClick={handleAnalyzeMood}
//           disabled={isLoading}
//           style={{ ...styles.btnGreen, marginTop: 32, maxWidth: 360, opacity: isLoading ? 0.7 : 1 }}
//         >
//           {isLoading ? 'Analyzing your vibe…' : 'Analyze Mood'}
//         </motion.button>

//         {/* Logout */}
//         <button onClick={onLogout} style={{ ...styles.linkBtn, marginTop: 32 }}>
//           Logout
//         </button>
//       </div>
//     </motion.div>
//   )
// }

// // ─── Screen: Results ──────────────────────────────────────────────────────────

// function ResultsScreen({ data, onAnalyzeAgain }) {
//   const { detectedMood, subMood, insight, genres, preferenceUsed, recommendations } = data

//   const openPlaylist = (playlist) => {
//     const url =
//       playlist.spotifyAppUrl ||
//       playlist.spotifyUrl ||
//       `https://open.spotify.com/playlist/${playlist.id}`
//     window.open(url, '_blank', 'noopener,noreferrer')
//   }

//   return (
//     <motion.div
//       key="results"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       style={{ ...styles.screen, overflowY: 'auto', paddingBottom: 48 }}
//     >
//       {/* Header */}
//       <div style={styles.resultsHeader}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           <MoodifyLogo size="sm" />
//           <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Moodify</span>
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.03, backgroundColor: '#1ed760' }}
//           whileTap={{ scale: 0.97 }}
//           onClick={onAnalyzeAgain}
//           style={styles.analyzeAgainBtn}
//         >
//           ↺ Analyze Again
//         </motion.button>
//       </div>

//       <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
//         <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 24 }}>
//           Your Personalized Playlists
//         </h2>

//         {/* Mood insight */}
//         {detectedMood && (
//           <div style={styles.moodInsightCard}>
//             <p style={{ color: '#1DB954', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>MOOD DETECTED</p>
//             <p style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>
//               {formatMoodLabel(detectedMood)}
//               {subMood ? <span style={{ color: '#aaa', fontWeight: 400 }}> · {formatMoodLabel(subMood)}</span> : null}
//             </p>
//             {insight && <p style={{ color: '#ccc', fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>{insight}</p>}
//             {genres.length > 0 && (
//               <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
//                 {genres.map((genre) => (
//                   <span key={genre} style={styles.genreTag}>{genre}</span>
//                 ))}
//               </div>
//             )}
//             <p style={{ color: '#888', fontSize: 12, marginTop: 10 }}>
//               Music taste: <span style={{ color: '#ddd' }}>{preferenceUsed}</span>
//             </p>
//           </div>
//         )}

//         {/* Playlist cards */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 8 }}>
//           {recommendations.map((playlist, index) => (
//             <motion.div
//               key={`${playlist.id}-${index}`}
//               initial={{ opacity: 0, y: 16 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.07 }}
//               style={styles.playlistCard}
//             >
//               <div style={styles.playlistCardInner}>
//                 {/* Cover */}
//                 <div style={styles.playlistCoverWrap}>
//                   {playlist.image ? (
//                     <img src={playlist.image} alt="" style={styles.playlistCover} />
//                   ) : (
//                     <div style={{ ...styles.playlistCover, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 13 }}>
//                       No cover
//                     </div>
//                   )}
//                 </div>

//                 {/* Info */}
//                 <div style={{ flex: 1 }}>
//                   <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{playlist.name}</h3>
//                   {playlist.description && (
//                     <p style={{ color: '#aaa', fontSize: 13, lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
//                       {playlist.description}
//                     </p>
//                   )}

//                   {/* Spotify embed-style tracklist */}
//                   {playlist.tracks && playlist.tracks.length > 0 && (
//                     <div style={styles.trackList}>
//                       {playlist.tracks.slice(0, 4).map((track, ti) => (
//                         <div key={ti} style={styles.trackRow}>
//                           <span style={{ color: '#aaa', fontSize: 13, minWidth: 18 }}>{ti + 1}</span>
//                           <span style={{ color: '#fff', fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.name}</span>
//                           <span style={{ color: '#1DB954', fontSize: 12 }}>{track.artist}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   <motion.button
//                     whileHover={{ backgroundColor: '#1ed760', scale: 1.02 }}
//                     whileTap={{ scale: 0.97 }}
//                     onClick={() => openPlaylist(playlist)}
//                     style={styles.openSpotifyBtn}
//                   >
//                     ↗ Open in Spotify
//                   </motion.button>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Back to home */}
//         <div style={{ textAlign: 'center', marginTop: 40 }}>
//           <button onClick={onAnalyzeAgain} style={styles.linkBtn}>
//             ← Back to Home
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// // ─── Main App ─────────────────────────────────────────────────────────────────

// function App() {
//   const [screen, setScreen] = useState('splash')

//   const [currentUser, setCurrentUser] = useState(null)
//   const [resultsData, setResultsData] = useState(null)

//   const handleLogin = (user) => {
//     console.log("APP HANDLE LOGIN")

//     localStorage.setItem(
//       'moodify_current_user',
//       JSON.stringify(user)
//     )

//     setCurrentUser(user)
//     setScreen('home')

//     console.log("SCREEN SET TO HOME")
//   }

//   const handleSignUp = (user) => {
//     console.log("APP HANDLE SIGNUP")
//     localStorage.setItem(
//       'moodify_current_user',
//       JSON.stringify(user)
//     )

//     setCurrentUser(user)
//     setScreen('subscription')
//   }

//   const handleLogout = () => {
//     localStorage.removeItem('moodify_current_user')
//     setCurrentUser(null)
//     setScreen('splash')
//   }

//   const handleResults = (data) => {
//     setResultsData(data)
//     setScreen('results')
//   }

//   const handleAnalyzeAgain = () => {
//     setResultsData(null)
//     setScreen('home')
//   }

//   const handleTrialStart = () => {
//     setScreen('home')
//   }

//   return (
//     <div style={styles.root}>
//       <AnimatePresence mode="wait">
//         {screen === 'splash' && (
//           <SplashScreen
//             key="splash"
//             onLogin={() => setScreen('login')}
//             onSignUp={() => setScreen('signup')}
//           />
//         )}
//         {screen === 'login' && (
//           <LoginScreen
//             key="login"
//             onLogin={handleLogin}
//             onSignUp={() => setScreen('signup')}
//           />
//         )}
//         {screen === 'signup' && (
//           <SignUpScreen
//             key="signup"
//             onSignUp={handleSignUp}
//             onLogin={() => setScreen('login')}
//           />
//         )}
//         {screen === 'subscription' && (
//           <SubscriptionScreen
//             key="subscription"
//             onContinue={handleTrialStart}
//           />
//         )}
//         {screen === 'home' && (
//           <HomeScreen
//             key="home"
//             user={currentUser}
//             onLogout={handleLogout}
//             onResults={handleResults}
//           />
//         )}
//         {screen === 'results' && resultsData && (
//           <ResultsScreen
//             key="results"
//             data={resultsData}
//             onAnalyzeAgain={handleAnalyzeAgain}
//           />
//         )}
//       </AnimatePresence>
//     </div>
//   )
// }

// // ─── Styles ───────────────────────────────────────────────────────────────────

// const GREEN = '#1DB954'
// const DARK_BG = '#0a0a0a'
// const CARD_BG = '#161616'
// const INPUT_BG = '#1a1a1a'

// const styles = {
//   root: {
//     minHeight: '100vh',
//     background: DARK_BG,
//     fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
//     color: '#fff',
//   },
//   screen: {
//     minHeight: '100vh',
//     background: DARK_BG,
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '20px',
//   },

//   // Splash
//   splashCenter: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     width: '100%',
//     maxWidth: 420,
//     padding: '0 20px',
//   },
//   splashTitle: {
//     fontSize: 'clamp(48px, 12vw, 72px)',
//     fontWeight: 900,
//     color: '#fff',
//     marginTop: 24,
//     marginBottom: 8,
//     letterSpacing: '-1px',
//   },
//   splashSubtitle: {
//     color: '#888',
//     fontSize: 16,
//     marginTop: 0,
//     marginBottom: 0,
//     textAlign: 'center',
//   },

//   // Auth form page
//   formPageWrap: {
//     width: '100%',
//     maxWidth: 520,
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   card: {
//     background: CARD_BG,
//     borderRadius: 20,
//     padding: '36px 32px 32px',
//     width: '100%',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 0,
//   },
//   cardTitle: {
//     fontSize: 28,
//     fontWeight: 800,
//     color: '#fff',
//     textAlign: 'center',
//     marginBottom: 28,
//     marginTop: 0,
//   },
//   fieldGroup: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 14,
//     marginBottom: 20,
//   },
//   input: {
//     background: INPUT_BG,
//     border: '1.5px solid #2a2a2a',
//     borderRadius: 12,
//     padding: '16px 18px',
//     color: '#fff',
//     fontSize: 15,
//     outline: 'none',
//     width: '100%',
//     boxSizing: 'border-box',
//     transition: 'border-color 0.2s',
//   },
//   inputFocused: {
//     borderColor: GREEN,
//     boxShadow: `0 0 0 3px rgba(29,185,84,0.15)`,
//   },
//   textarea: {
//     background: INPUT_BG,
//     border: '1.5px solid #2a2a2a',
//     borderRadius: 16,
//     padding: '18px',
//     color: '#fff',
//     fontSize: 15,
//     outline: 'none',
//     width: '100%',
//     boxSizing: 'border-box',
//     resize: 'none',
//     transition: 'border-color 0.2s',
//     minHeight: 120,
//   },
//   errorText: {
//     color: '#ff6b6b',
//     fontSize: 13,
//     marginBottom: 12,
//     textAlign: 'center',
//   },

//   // Buttons
//   btnGreen: {
//     background: GREEN,
//     color: '#000',
//     border: 'none',
//     borderRadius: 50,
//     padding: '16px 24px',
//     fontSize: 16,
//     fontWeight: 700,
//     cursor: 'pointer',
//     width: '100%',
//     transition: 'background 0.2s',
//     marginTop: 4,
//   },
//   btnOutline: {
//     background: 'transparent',
//     color: '#fff',
//     border: '1.5px solid #333',
//     borderRadius: 50,
//     padding: '16px 24px',
//     fontSize: 16,
//     fontWeight: 600,
//     cursor: 'pointer',
//     width: '100%',
//     transition: 'border-color 0.2s',
//   },
//   linkBtn: {
//     background: 'none',
//     border: 'none',
//     color: '#888',
//     fontSize: 14,
//     cursor: 'pointer',
//     marginTop: 16,
//     padding: 0,
//     width: '100%',
//     textAlign: 'center',
//   },
//   greenLink: {
//     color: GREEN,
//     cursor: 'pointer',
//     fontWeight: 600,
//   },
//   switchText: {
//     color: '#888',
//     fontSize: 14,
//     textAlign: 'center',
//     marginTop: 20,
//     marginBottom: 0,
//   },

//   // Preference chips
//   prefChip: {
//     background: '#1e1e1e',
//     border: '1.5px solid #2a2a2a',
//     borderRadius: 50,
//     padding: '10px 20px',
//     color: '#ccc',
//     fontSize: 14,
//     cursor: 'pointer',
//     transition: 'all 0.15s',
//   },
//   prefChipActive: {
//     background: GREEN,
//     borderColor: GREEN,
//     color: '#000',
//     fontWeight: 600,
//     boxShadow: `0 0 16px rgba(29,185,84,0.35)`,
//   },

//   // Results
//   resultsHeader: {
//     width: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: '20px 24px',
//     borderBottom: '1px solid #1a1a1a',
//     boxSizing: 'border-box',
//   },
//   analyzeAgainBtn: {
//     background: GREEN,
//     color: '#000',
//     border: 'none',
//     borderRadius: 50,
//     padding: '12px 22px',
//     fontSize: 14,
//     fontWeight: 700,
//     cursor: 'pointer',
//   },
//   moodInsightCard: {
//     background: '#141414',
//     border: '1px solid #222',
//     borderRadius: 16,
//     padding: '20px 24px',
//     marginBottom: 24,
//   },
//   genreTag: {
//     background: 'rgba(29,185,84,0.15)',
//     color: '#1DB954',
//     borderRadius: 50,
//     padding: '4px 12px',
//     fontSize: 12,
//     fontWeight: 500,
//   },
//   playlistCard: {
//     background: '#131313',
//     border: '1px solid #1e1e1e',
//     borderRadius: 20,
//     overflow: 'hidden',
//     padding: 24,
//   },
//   playlistCardInner: {
//     display: 'flex',
//     gap: 24,
//     alignItems: 'flex-start',
//     flexWrap: 'wrap',
//   },
//   playlistCoverWrap: {
//     flexShrink: 0,
//   },
//   playlistCover: {
//     width: 200,
//     height: 200,
//     borderRadius: 12,
//     objectFit: 'cover',
//   },
//   trackList: {
//     background: '#1a1f1a',
//     borderRadius: 12,
//     padding: '12px 16px',
//     marginBottom: 16,
//     display: 'flex',
//     flexDirection: 'column',
//     gap: 8,
//   },
//   trackRow: {
//     display: 'flex',
//     gap: 12,
//     alignItems: 'center',
//   },
//   openSpotifyBtn: {
//     background: 'transparent',
//     color: GREEN,
//     border: `1.5px solid ${GREEN}`,
//     borderRadius: 50,
//     padding: '12px 24px',
//     fontSize: 14,
//     fontWeight: 600,
//     cursor: 'pointer',
//     transition: 'all 0.15s',
//   },
// }

// export default App

import { useMemo, useState } from 'react'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './firebase/firebase'
import { doc, setDoc, Timestamp } from 'firebase/firestore'

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

function getFirebaseErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'

    case 'auth/user-not-found':
      return 'No account found with this email.'

    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.'

    case 'auth/invalid-credential':
      return 'Invalid email or password.'

    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'

    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.'

    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'

    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.'

    default:
      return 'Something went wrong. Please try again.'
  }
}

function formatMoodLabel(mood) {
  if (!mood) return ''
  return mood.charAt(0).toUpperCase() + mood.slice(1)
}

// ─── Shared Logo Component ────────────────────────────────────────────────────

function MoodifyLogo({ size = 'md' }) {
  const dim = size === 'lg' ? 96 : 64
  const fontSize = size === 'lg' ? 28 : 18

  return (
    <div
      style={{
        width: dim,
        height: dim,
        borderRadius: '50%',
        border: '2.5px solid #1DB954',
        boxShadow: '0 0 24px rgba(29,185,84,0.55), 0 0 6px rgba(29,185,84,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#111',
        flexShrink: 0,
      }}
    >
      {/* Soundwave bars */}
      <svg
        width={fontSize * 1.6}
        height={fontSize}
        viewBox="0 0 32 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="8" width="4" height="4" rx="2" fill="#1DB954" />
        <rect x="7" y="4" width="4" height="12" rx="2" fill="#1DB954" />
        <rect x="14" y="0" width="4" height="20" rx="2" fill="#1DB954" />
        <rect x="21" y="4" width="4" height="12" rx="2" fill="#1DB954" />
        <rect x="28" y="8" width="4" height="4" rx="2" fill="#1DB954" />
      </svg>
    </div>
  )
}

// ─── Screen: Splash ───────────────────────────────────────────────────────────

function SplashScreen({ onLogin, onSignUp }) {
  return (
    <motion.div
      key="splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.screen}
    >
      <div style={styles.splashCenter}>
        <MoodifyLogo size="lg" />

        <h1 style={styles.splashTitle}>Moodify</h1>
        <p style={styles.splashSubtitle}>Music that matches your mood</p>

        <div style={{ width: '100%', maxWidth: 380, marginTop: 64, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onLogin}
            style={styles.btnOutline}
          >
            Log In
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onSignUp}
            style={styles.btnGreen}
          >
            Sign Up
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Screen: Login ────────────────────────────────────────────────────────────

function LoginScreen({ onLogin, onSignUp }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState('')

  const handleLogin = async () => {
    try {
      console.log("LOGIN START")

      const credential =
        await signInWithEmailAndPassword(
          auth,
          identifier,
          password
        )

      console.log("LOGIN SUCCESS")
      console.log(credential.user)

      onLogin(credential.user)

      console.log("AFTER ONLOGIN")

    } catch (err) {
      console.error("LOGIN ERROR", err)
      setError(getFirebaseErrorMessage(err.code))
    }
  }

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={styles.screen}
    >
      <div style={styles.formPageWrap}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <MoodifyLogo size="md" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={styles.card}
        >
          <h2 style={styles.cardTitle}>Welcome Back</h2>

          <div style={styles.fieldGroup}>
            <input
              type="text"
              placeholder="Enter your email"
              value={identifier}
              onChange={(e) => { setIdentifier(e.target.value); setError('') }}
              onFocus={() => setFocusedField('id')}
              onBlur={() => setFocusedField('')}
              style={{
                ...styles.input,
                ...(focusedField === 'id' ? styles.inputFocused : {}),
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              onFocus={() => setFocusedField('pw')}
              onBlur={() => setFocusedField('')}
              style={{
                ...styles.input,
                ...(focusedField === 'pw' ? styles.inputFocused : {}),
              }}
            />
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#1ed760' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogin}
            style={styles.btnGreen}
          >
            Log In
          </motion.button>

          <button style={styles.linkBtn}>Forgot Password?</button>

          <p style={styles.switchText}>
            Don&apos;t have an account?{' '}
            <span onClick={onSignUp} style={styles.greenLink}>
              Sign Up
            </span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── Screen: Subscription Screen ───────────────────────────────────────────────────
function SubscriptionScreen({ onContinue }) {
  const features = [
    {
      icon: '📊',
      title: 'Unlimited Mood Analysis',
      subtitle: 'Analyze your mood as many times as you want',
    },
    {
      icon: '🎵',
      title: 'AI-Powered Playlists',
      subtitle: 'Personalized playlists that match your vibe perfectly',
    },
    {
      icon: '🌍',
      title: 'Bollywood, Punjabi & Global Music',
      subtitle: 'Explore music across languages and genres',
    },
    {
      icon: '📈',
      title: 'Advanced Mood Insights',
      subtitle: 'Deeper insights to understand your emotions',
    },
    {
      icon: '⚡',
      title: 'Priority Recommendations',
      subtitle: 'Get the best and most relevant suggestions first',
    },
  ]

  return (
    <motion.div
      key="subscription"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          background: '#121212',
          border: '1px solid #222222',
          borderRadius: '24px',
          padding: '28px',
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          <h1
            style={{
              fontSize: '38px',
              fontWeight: '900',
              margin: '0',
              color: '#ffffff',
              letterSpacing: '-0.5px',
            }}
          >
            Moodify Premium
          </h1>

          <p
            style={{
              color: '#b0b0b0',
              fontSize: '15px',
              marginTop: '6px',
              marginBottom: '0',
              fontWeight: '500',
            }}
          >
            Start your 3-month free trial. Cancel anytime.
          </p>
        </div>

        {/* MAIN CONTENT GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          {/* LEFT PANEL - FEATURES */}
          <div
            style={{
              background: '#111111',
              borderRadius: '20px',
              padding: '24px',
            }}
          >
            <h3
              style={{
                color: GREEN,
                fontSize: '18px',
                fontWeight: '700',
                marginTop: '0',
                marginBottom: '16px',
              }}
            >
              Premium includes everything:
            </h3>

            {features.map((item, index) => (
              <div
                key={item.title}
                style={{
                  display: 'flex',
                  gap: '12px',
                  paddingBottom: '14px',
                  marginBottom: '14px',
                  borderBottom:
                    index !== features.length - 1
                      ? '1px solid #232323'
                      : 'none',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    minWidth: '42px',
                    borderRadius: '50%',
                    border: `2px solid ${GREEN}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: GREEN,
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      margin: '0',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    {item.title}
                  </h4>

                  <p
                    style={{
                      marginTop: '3px',
                      marginBottom: '0',
                      color: '#a0a0a0',
                      fontSize: '12px',
                      lineHeight: '1.4',
                    }}
                  >
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT PANEL - PRICING */}
          <div
            style={{
              background: '#0d0d0d',
              border: `2px solid ${GREEN}`,
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div style={{ width: '100%' }}>
              {/* TRIAL PILL */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(29, 185, 84, 0.15)',
                  color: GREEN,
                  padding: '8px 18px',
                  borderRadius: '999px',
                  fontWeight: '700',
                  fontSize: '12px',
                  border: `1px solid ${GREEN}`,
                  margin: '0 auto 16px auto',
                  width: 'fit-content',
                }}
              >
                3-Month Free Trial
              </div>

              {/* PRICE */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '6px',
                }}
              >
                <span
                  style={{
                    fontSize: '56px',
                    fontWeight: '900',
                    lineHeight: '1',
                    color: '#ffffff',
                  }}
                >
                  ₹49
                </span>

                <span
                  style={{
                    fontSize: '18px',
                    color: '#d0d0d0',
                    marginBottom: '6px',
                    fontWeight: '600',
                  }}
                >
                  /month
                </span>
              </div>

              <p
                style={{
                  color: '#999999',
                  fontSize: '12px',
                  marginTop: '4px',
                  marginBottom: '14px',
                }}
              >
                Billed monthly after free trial
              </p>

              {/* BENEFITS */}
              <div
                style={{
                  borderTop: '1px solid #232323',
                  paddingTop: '14px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    color: '#e0e0e0',
                    fontSize: '14px',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: GREEN, fontSize: '14px' }}>✓</span>
                    <span>3 months FREE for new users</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: GREEN, fontSize: '14px' }}>✓</span>
                    <span>Cancel anytime, no hidden charges</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: GREEN, fontSize: '14px' }}>✓</span>
                    <span>Secure and easy payments</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: GREEN, fontSize: '14px' }}>✓</span>
                    <span>Premium support</span>
                  </div>
                </div>
              </div>
            </div>

            <p
              style={{
                textAlign: 'center',
                color: '#888888',
                fontSize: '11px',
                marginTop: '14px',
                marginBottom: 0,
              }}
            >
              After 3 months, ₹49 will be charged every month.
            </p>
          </div>
        </div>

        {/* CTA BUTTON */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          style={{
            background: GREEN,
            color: '#000000',
            width: '100%',
            border: 'none',
            borderRadius: '999px',
            padding: '15px 24px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '10px',
          }}
        >
          Start Free Trial for 3 Months
        </motion.button>

        <p
          style={{
            textAlign: 'center',
            color: '#888888',
            fontSize: '11px',
            marginTop: '0',
            marginBottom: '0',
          }}
        >
          🔒 Secure payments • Cancel anytime • No commitment
        </p>
      </div>
    </motion.div>
  )
}

// ─── Screen: Sign Up ──────────────────────────────────────────────────────────

function SignUpScreen({ onSignUp, onLogin }) {
  const [fullName, setFullName] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [focusedField, setFocusedField] = useState('')

  const handleSignUp = async () => {
    try {
      if (!fullName.trim()) {
        setError('Please enter your full name.')
        return
      }

      if (!identifier.trim()) {
        setError('Please enter your email address.')
        return
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long.')
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      const credential =
        await createUserWithEmailAndPassword(
          auth,
          identifier,
          password
        )

      console.log("AUTH SUCCESS")

      const user = credential.user

      const trialEnd = new Date()
      trialEnd.setMonth(trialEnd.getMonth() + 3)

      console.log("BEFORE SETDOC")

      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          email: user.email,
          createdAt: Timestamp.now(),
          trialEndsAt: Timestamp.fromDate(trialEnd),
          plan: 'trial',
        }
      )

      console.log("SETDOC SUCCESS")
      console.log("NAVIGATING TO HOME")
      onSignUp(user)

    } catch (err) {
      console.error(err)
      setError(getFirebaseErrorMessage(err.code))
    }
  }

  return (
    <motion.div
      key="signup"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      style={styles.screen}
    >
      <div style={styles.formPageWrap}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <MoodifyLogo size="md" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={styles.card}
        >
          <h2 style={styles.cardTitle}>Create Account</h2>

          <div style={styles.fieldGroup}>
            {[
              { placeholder: 'Full Name', value: fullName, setter: setFullName, type: 'text', key: 'name' },
              { placeholder: 'Enter your email', value: identifier, setter: setIdentifier, type: 'text', key: 'id' },
              { placeholder: 'Password', value: password, setter: setPassword, type: 'password', key: 'pw' },
              { placeholder: 'Confirm Password', value: confirmPassword, setter: setConfirmPassword, type: 'password', key: 'cpw' },
            ].map((field) => (
              <input
                key={field.key}
                type={field.type}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => { field.setter(e.target.value); setError('') }}
                onFocus={() => setFocusedField(field.key)}
                onBlur={() => setFocusedField('')}
                style={{
                  ...styles.input,
                  ...(focusedField === field.key ? styles.inputFocused : {}),
                }}
              />
            ))}
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#1ed760' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSignUp}
            style={styles.btnGreen}
          >
            Create Account
          </motion.button>

          <p style={styles.switchText}>
            Already have an account?{' '}
            <span onClick={onLogin} style={styles.greenLink}>
              Log In
            </span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── Screen: Home (Mood Analyzer) ─────────────────────────────────────────────

function HomeScreen({ user, onLogout, onResults }) {
  const [moodText, setMoodText] = useState('')
  const [selectedPreference, setSelectedPreference] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [focusedTextarea, setFocusedTextarea] = useState(false)

  const apiBaseUrl = import.meta.env.VITE_API_URL || ''
  console.log("API URL:", apiBaseUrl)

  const handleAnalyzeMood = async () => {
    if (!moodText.trim()) {
      setError('Tell us how you are feeling — Hindi, English, or Hinglish all work.')
      return
    }
    if (!selectedPreference) {
      setError('Pick a music preference.')
      return
    }
    console.log("ANALYZE CLICKED")
    setIsLoading(true)
    setError('')

    try {
      console.log("CALLING BACKEND")
      const response = await axios.post(`${apiBaseUrl}/api/mood/analyze`, {
        mood: moodText.trim(),
        preference: selectedPreference,
      })

      onResults({
        detectedMood: response.data.detectedMood || '',
        subMood: response.data.subMood || '',
        insight: response.data.insight || '',
        genres: response.data.genres || [],
        preferenceUsed: response.data.preference || selectedPreference,
        recommendations: response.data.recommendations || [],
        // Keep these so ResultsScreen can re-call the API without going back to home
        originalMoodText: moodText.trim(),
        originalPreference: selectedPreference,
      })
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        (requestError.code === 'ERR_NETWORK'
          ? 'Cannot connect to the server. Please try again.'
          : 'Could not analyze your mood right now.')

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ ...styles.screen, overflowY: 'auto', paddingTop: 32, paddingBottom: 48 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 680, margin: '0 auto', padding: '0 20px', width: '100%' }}>
        {/* Logo + Name */}
        <MoodifyLogo size="md" />
        <p style={{ color: '#fff', fontWeight: 600, fontSize: 16, marginTop: 10, marginBottom: 0 }}>Moodify</p>

        {/* Heading */}
        <h1 style={{ color: '#fff', fontSize: 'clamp(28px, 7vw, 52px)', fontWeight: 800, marginTop: 28, marginBottom: 0, textAlign: 'center', lineHeight: 1.1 }}>
          How are you feeling today?
        </h1>

        {/* Mood textarea */}
        <textarea
          placeholder="Describe your mood here..."
          value={moodText}
          onChange={(e) => { setMoodText(e.target.value); setError('') }}
          onFocus={() => setFocusedTextarea(true)}
          onBlur={() => setFocusedTextarea(false)}
          style={{
            ...styles.textarea,
            ...(focusedTextarea ? styles.inputFocused : {}),
            marginTop: 24,
          }}
          rows={4}
        />

        {/* Examples
        <div style={{ width: '100%', marginTop: 20 }}>
          <p style={{ color: '#aaa', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>EXAMPLES:</p>
          {['Coding kar ke thak gaya hu', 'Feeling heartbroken tonight', 'Need motivation for gym', 'Want peaceful music before sleeping'].map((ex) => (
            <p
              key={ex}
              onClick={() => setMoodText(ex)}
              style={{ color: '#bbb', fontSize: 14, marginBottom: 4, cursor: 'pointer' }}
            >
              · {ex}
            </p>
          ))}
        </div> */}

        {/* Music preference */}
        <div style={{ width: '100%', marginTop: 28 }}>
          <p style={{ color: '#aaa', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 12 }}>SELECT MUSIC PREFERENCE:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {MUSIC_PREFERENCES.map((pref) => (
              <motion.button
                key={pref}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { setSelectedPreference(pref); setError('') }}
                style={{
                  ...styles.prefChip,
                  ...(selectedPreference === pref ? styles.prefChipActive : {}),
                }}
              >
                {pref}
              </motion.button>
            ))}
          </div>
        </div>

        {error && <p style={{ ...styles.errorText, marginTop: 16 }}>{error}</p>}

        {/* Analyze button */}
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#1ed760' }}
          whileTap={{ scale: 0.97 }}
          onClick={handleAnalyzeMood}
          disabled={isLoading}
          style={{ ...styles.btnGreen, marginTop: 32, maxWidth: 360, opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? 'Analyzing your vibe…' : 'Analyze Mood'}
        </motion.button>

        {/* Logout */}
        <button onClick={onLogout} style={{ ...styles.linkBtn, marginTop: 32 }}>
          Logout
        </button>
      </div>
    </motion.div>
  )
}

// ─── Screen: Results ──────────────────────────────────────────────────────────

function ResultsScreen({ data, onAnalyzeAgain }) {
  const { detectedMood, subMood, insight, genres, preferenceUsed, originalMoodText, originalPreference } = data

  const apiBaseUrl = import.meta.env.VITE_API_URL || ''

  const [recommendations, setRecommendations] = useState(data.recommendations || [])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState('')
  const [refreshCount, setRefreshCount] = useState(0)

  const openPlaylist = (playlist) => {
    const url =
      playlist.spotifyAppUrl ||
      playlist.spotifyUrl ||
      `https://open.spotify.com/playlist/${playlist.id}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleRefreshPlaylists = async () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    setRefreshError('')

    try {
      const response = await axios.post(`${apiBaseUrl}/api/mood/analyze`, {
        mood: originalMoodText,
        preference: originalPreference,
      })
      setRecommendations(response.data.recommendations || [])
      setRefreshCount((c) => c + 1)
    } catch (err) {
      setRefreshError(
        err.response?.data?.message || 'Could not refresh playlists. Try again.'
      )
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ ...styles.screen, overflowY: 'auto', paddingBottom: 48 }}
    >
      {/* Header */}
      <div style={styles.resultsHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MoodifyLogo size="sm" />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Moodify</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: '#1ed760' }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRefreshPlaylists}
            disabled={isRefreshing}
            style={{
              ...styles.analyzeAgainBtn,
              background: 'transparent',
              color: '#1DB954',
              border: '1.5px solid #1DB954',
              opacity: isRefreshing ? 0.6 : 1,
            }}
          >
            {isRefreshing ? '↻ Loading…' : '↻ Refresh Playlists'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: '#1ed760' }}
            whileTap={{ scale: 0.97 }}
            onClick={onAnalyzeAgain}
            style={styles.analyzeAgainBtn}
          >
            ↺ New Mood
          </motion.button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px' }}>
        <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 24 }}>
          Your Personalized Playlists
        </h2>

        {/* Mood insight */}
        {detectedMood && (
          <div style={styles.moodInsightCard}>
            <p style={{ color: '#1DB954', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>MOOD DETECTED</p>
            <p style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>
              {formatMoodLabel(detectedMood)}
              {subMood ? <span style={{ color: '#aaa', fontWeight: 400 }}> · {formatMoodLabel(subMood)}</span> : null}
            </p>
            {insight && <p style={{ color: '#ccc', fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>{insight}</p>}
            {genres.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                {genres.map((genre) => (
                  <span key={genre} style={styles.genreTag}>{genre}</span>
                ))}
              </div>
            )}
            <p style={{ color: '#888', fontSize: 12, marginTop: 10 }}>
              Music taste: <span style={{ color: '#ddd' }}>{preferenceUsed}</span>
            </p>
          </div>
        )}

        {refreshError && (
          <p style={{ ...styles.errorText, marginBottom: 16 }}>{refreshError}</p>
        )}

        {/* Playlist cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={refreshCount}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 8 }}
          >
            {recommendations.map((playlist, index) => (
              <motion.div
                key={`${playlist.id}-${index}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                style={styles.playlistCard}
              >
                <div style={styles.playlistCardInner}>
                  {/* Cover */}
                  <div style={styles.playlistCoverWrap}>
                    {playlist.image ? (
                      <img src={playlist.image} alt="" style={styles.playlistCover} />
                    ) : (
                      <div style={{ ...styles.playlistCover, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: 13 }}>
                        No cover
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{playlist.name}</h3>
                    {playlist.description && (
                      <p style={{ color: '#aaa', fontSize: 13, lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {playlist.description}
                      </p>
                    )}

                    {/* Spotify embed-style tracklist */}
                    {playlist.tracks && playlist.tracks.length > 0 && (
                      <div style={styles.trackList}>
                        {playlist.tracks.slice(0, 4).map((track, ti) => (
                          <div key={ti} style={styles.trackRow}>
                            <span style={{ color: '#aaa', fontSize: 13, minWidth: 18 }}>{ti + 1}</span>
                            <span style={{ color: '#fff', fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.name}</span>
                            <span style={{ color: '#1DB954', fontSize: 12 }}>{track.artist}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <motion.button
                      whileHover={{ backgroundColor: '#1ed760', scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => openPlaylist(playlist)}
                      style={styles.openSpotifyBtn}
                    >
                      ↗ Open in Spotify
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Back to home */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button onClick={onAnalyzeAgain} style={styles.linkBtn}>
            ← Back to Home
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

function App() {
  const [screen, setScreen] = useState('splash')

  const [currentUser, setCurrentUser] = useState(null)
  const [resultsData, setResultsData] = useState(null)

  const handleLogin = (user) => {
    console.log("APP HANDLE LOGIN")

    localStorage.setItem(
      'moodify_current_user',
      JSON.stringify(user)
    )

    setCurrentUser(user)
    setScreen('home')

    console.log("SCREEN SET TO HOME")
  }

  const handleSignUp = (user) => {
    console.log("APP HANDLE SIGNUP")
    localStorage.setItem(
      'moodify_current_user',
      JSON.stringify(user)
    )

    setCurrentUser(user)
    setScreen('subscription')
  }

  const handleLogout = () => {
    localStorage.removeItem('moodify_current_user')
    setCurrentUser(null)
    setScreen('splash')
  }

  const handleResults = (data) => {
    setResultsData(data)
    setScreen('results')
  }

  const handleAnalyzeAgain = () => {
    setResultsData(null)
    setScreen('home')
  }

  const handleTrialStart = () => {
    setScreen('home')
  }

  return (
    <div style={styles.root}>
      <AnimatePresence mode="wait">
        {screen === 'splash' && (
          <SplashScreen
            key="splash"
            onLogin={() => setScreen('login')}
            onSignUp={() => setScreen('signup')}
          />
        )}
        {screen === 'login' && (
          <LoginScreen
            key="login"
            onLogin={handleLogin}
            onSignUp={() => setScreen('signup')}
          />
        )}
        {screen === 'signup' && (
          <SignUpScreen
            key="signup"
            onSignUp={handleSignUp}
            onLogin={() => setScreen('login')}
          />
        )}
        {screen === 'subscription' && (
          <SubscriptionScreen
            key="subscription"
            onContinue={handleTrialStart}
          />
        )}
        {screen === 'home' && (
          <HomeScreen
            key="home"
            user={currentUser}
            onLogout={handleLogout}
            onResults={handleResults}
          />
        )}
        {screen === 'results' && resultsData && (
          <ResultsScreen
            key="results"
            data={resultsData}
            onAnalyzeAgain={handleAnalyzeAgain}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const GREEN = '#1DB954'
const DARK_BG = '#0a0a0a'
const CARD_BG = '#161616'
const INPUT_BG = '#1a1a1a'

const styles = {
  root: {
    minHeight: '100vh',
    background: DARK_BG,
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
    color: '#fff',
  },
  screen: {
    minHeight: '100vh',
    background: DARK_BG,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },

  // Splash
  splashCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    padding: '0 20px',
  },
  splashTitle: {
    fontSize: 'clamp(48px, 12vw, 72px)',
    fontWeight: 900,
    color: '#fff',
    marginTop: 24,
    marginBottom: 8,
    letterSpacing: '-1px',
  },
  splashSubtitle: {
    color: '#888',
    fontSize: 16,
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'center',
  },

  // Auth form page
  formPageWrap: {
    width: '100%',
    maxWidth: 520,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  card: {
    background: CARD_BG,
    borderRadius: 20,
    padding: '36px 32px 32px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 28,
    marginTop: 0,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    marginBottom: 20,
  },
  input: {
    background: INPUT_BG,
    border: '1.5px solid #2a2a2a',
    borderRadius: 12,
    padding: '16px 18px',
    color: '#fff',
    fontSize: 15,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  inputFocused: {
    borderColor: GREEN,
    boxShadow: `0 0 0 3px rgba(29,185,84,0.15)`,
  },
  textarea: {
    background: INPUT_BG,
    border: '1.5px solid #2a2a2a',
    borderRadius: 16,
    padding: '18px',
    color: '#fff',
    fontSize: 15,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    resize: 'none',
    transition: 'border-color 0.2s',
    minHeight: 120,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },

  // Buttons
  btnGreen: {
    background: GREEN,
    color: '#000',
    border: 'none',
    borderRadius: 50,
    padding: '16px 24px',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.2s',
    marginTop: 4,
  },
  btnOutline: {
    background: 'transparent',
    color: '#fff',
    border: '1.5px solid #333',
    borderRadius: 50,
    padding: '16px 24px',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    transition: 'border-color 0.2s',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: 14,
    cursor: 'pointer',
    marginTop: 16,
    padding: 0,
    width: '100%',
    textAlign: 'center',
  },
  greenLink: {
    color: GREEN,
    cursor: 'pointer',
    fontWeight: 600,
  },
  switchText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 0,
  },

  // Preference chips
  prefChip: {
    background: '#1e1e1e',
    border: '1.5px solid #2a2a2a',
    borderRadius: 50,
    padding: '10px 20px',
    color: '#ccc',
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  prefChipActive: {
    background: GREEN,
    borderColor: GREEN,
    color: '#000',
    fontWeight: 600,
    boxShadow: `0 0 16px rgba(29,185,84,0.35)`,
  },

  // Results
  resultsHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #1a1a1a',
    boxSizing: 'border-box',
  },
  analyzeAgainBtn: {
    background: GREEN,
    color: '#000',
    border: 'none',
    borderRadius: 50,
    padding: '12px 22px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
  moodInsightCard: {
    background: '#141414',
    border: '1px solid #222',
    borderRadius: 16,
    padding: '20px 24px',
    marginBottom: 24,
  },
  genreTag: {
    background: 'rgba(29,185,84,0.15)',
    color: '#1DB954',
    borderRadius: 50,
    padding: '4px 12px',
    fontSize: 12,
    fontWeight: 500,
  },
  playlistCard: {
    background: '#131313',
    border: '1px solid #1e1e1e',
    borderRadius: 20,
    overflow: 'hidden',
    padding: 24,
  },
  playlistCardInner: {
    display: 'flex',
    gap: 24,
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  playlistCoverWrap: {
    flexShrink: 0,
  },
  playlistCover: {
    width: 200,
    height: 200,
    borderRadius: 12,
    objectFit: 'cover',
  },
  trackList: {
    background: '#1a1f1a',
    borderRadius: 12,
    padding: '12px 16px',
    marginBottom: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  trackRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },
  openSpotifyBtn: {
    background: 'transparent',
    color: GREEN,
    border: `1.5px solid ${GREEN}`,
    borderRadius: 50,
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
}

export default App