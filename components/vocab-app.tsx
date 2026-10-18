'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, BookOpen, Check, ChevronRight, Flame, Headphones, RotateCcw, Sparkles, Volume2, X } from 'lucide-react'

type Word = { id: number; hanzi: string; pinyin: string; meaning: string; example: string; exampleMeaning: string; sound: string }
type Session = { id: number; title: string; description: string; level: string; words: Word[] }

const sessions: Session[] = [
  { id: 1, title: 'Chào hỏi cơ bản', description: 'Những câu nói đầu tiên khi gặp một người bạn mới.', level: 'HSK 1', words: [
    { id: 1, hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'xin chào', example: '你好，很高兴认识你。', exampleMeaning: 'Xin chào, rất vui được làm quen với bạn.', sound: '' },
    { id: 2, hanzi: '谢谢', pinyin: 'xièxie', meaning: 'cảm ơn', example: '谢谢你的帮助。', exampleMeaning: 'Cảm ơn sự giúp đỡ của bạn.', sound: '' },
    { id: 3, hanzi: '再见', pinyin: 'zàijiàn', meaning: 'tạm biệt', example: '明天见，再见！', exampleMeaning: 'Hẹn gặp ngày mai, tạm biệt!', sound: '' },
    { id: 4, hanzi: '对不起', pinyin: 'duìbuqǐ', meaning: 'xin lỗi', example: '对不起，我来晚了。', exampleMeaning: 'Xin lỗi, tôi đến muộn.', sound: '' },
    { id: 5, hanzi: '没关系', pinyin: 'méi guānxi', meaning: 'không sao', example: '没关系，别担心。', exampleMeaning: 'Không sao, đừng lo.', sound: '' },
  ]},
  { id: 2, title: 'Gia đình & bạn bè', description: 'Từ vựng để kể về những người thân yêu.', level: 'HSK 1', words: [
    { id: 6, hanzi: '家人', pinyin: 'jiārén', meaning: 'gia đình', example: '我的家人都很好。', exampleMeaning: 'Gia đình của tôi đều rất khỏe.', sound: '' },
    { id: 7, hanzi: '朋友', pinyin: 'péngyou', meaning: 'bạn bè', example: '他是我的好朋友。', exampleMeaning: 'Anh ấy là bạn tốt của tôi.', sound: '' },
    { id: 8, hanzi: '妈妈', pinyin: 'māma', meaning: 'mẹ', example: '我妈妈喜欢喝茶。', exampleMeaning: 'Mẹ tôi thích uống trà.', sound: '' },
  ]},
  { id: 3, title: 'Thời gian hằng ngày', description: 'Nói về lịch trình và những hoạt động quen thuộc.', level: 'HSK 1', words: [
    { id: 9, hanzi: '今天', pinyin: 'jīntiān', meaning: 'hôm nay', example: '今天是星期一。', exampleMeaning: 'Hôm nay là thứ Hai.', sound: '' },
    { id: 10, hanzi: '明天', pinyin: 'míngtiān', meaning: 'ngày mai', example: '明天见！', exampleMeaning: 'Hẹn gặp ngày mai!', sound: '' },
  ]},
]

export function VocabApp() {
  const [selectedId, setSelectedId] = useState(1)
  const [mode, setMode] = useState<'learn' | 'practice'>('learn')
  const [index, setIndex] = useState(0)
  const [shuffled, setShuffled] = useState(false)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null)
  const session = sessions.find((item) => item.id === selectedId) ?? sessions[0]
  const words = useMemo(() => shuffled ? [...session.words].sort(() => Math.random() - 0.5) : session.words, [session, shuffled])
  const word = words[index % words.length]
  const progress = ((index + 1) / words.length) * 100

  function chooseSession(id: number) { setSelectedId(id); setIndex(0); setMode('learn'); setAnswer(''); setResult(null); setShuffled(false) }
  function next() { setIndex((current) => (current + 1) % words.length); setAnswer(''); setResult(null) }
  function checkAnswer() { setResult(answer.trim().toLowerCase() === word.meaning.toLowerCase() ? 'correct' : 'wrong') }
  useEffect(() => {
    function handleDocumentKeyDown(event: KeyboardEvent) {
      if (mode !== 'practice' || event.key !== 'Enter' || event.isComposing || event.keyCode === 229) return
      const target = event.target as HTMLElement
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') return
      event.preventDefault()
      if (result) next()
      else checkAnswer()
    }
    document.addEventListener('keydown', handleDocumentKeyDown)
    return () => document.removeEventListener('keydown', handleDocumentKeyDown)
  }, [mode, result, answer, word])

  function speak(item: Word = word) {
    if (item.sound) {
      const audio = new Audio(item.sound)
      void audio.play()
      return
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(item.hanzi)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  return <main className="min-h-screen bg-[#f7f8f6] text-[#17332c]">
    <header className="border-b border-[#dfe8e3] bg-[#f7f8f6]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10">
        <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-2xl bg-[#165f4b] text-white"><BookOpen aria-hidden="true" /></div><div><p className="text-lg font-bold tracking-tight">Chinese-With-Trungne</p><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#71827b]">học chậm, nhớ lâu</p></div></div>
        <div className="flex items-center gap-2 rounded-full border border-[#dfe8e3] bg-white px-3 py-2 text-sm font-semibold text-[#476056]"><Flame className="text-[#d57c44]" size={17} fill="currentColor" /> 5 ngày liên tục</div>
      </div>
    </header>
    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[265px_1fr] lg:px-10 lg:py-12">
      <aside><div className="mb-7"><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8b9a94]">Lộ trình của bạn</p><h1 className="text-2xl font-bold tracking-tight">Học từ vựng</h1></div><nav className="flex flex-col gap-3" aria-label="Các buổi học">
        {sessions.map((item, i) => <button key={item.id} onClick={() => chooseSession(item.id)} className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${selectedId === item.id ? 'border-[#b9dccc] bg-[#e9f4ee] shadow-sm' : 'border-transparent hover:border-[#dfe8e3] hover:bg-white'}`}><span className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${selectedId === item.id ? 'bg-[#165f4b] text-white' : 'bg-white text-[#91a19a] shadow-sm'}`}>{String(i + 1).padStart(2, '0')}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{item.title}</span><span className="mt-0.5 block text-xs text-[#87968f]">{item.words.length} từ · {item.level}</span></span><ChevronRight size={16} className={selectedId === item.id ? 'text-[#165f4b]' : 'text-[#bcc9c3]'} /></button>)}
      </nav><div className="mt-8 rounded-3xl bg-[#17332c] p-5 text-white"><Sparkles size={20} className="mb-8 text-[#f2c98b]" /><p className="text-sm font-semibold leading-6 text-[#d7e9df]">Trung nhắc bạn: mỗi ngày một chút, tiếng Trung sẽ trở nên thật quen thuộc.</p><p className="mt-3 text-xs text-[#9eb9ac]">Trung tin vào sự đều đặn, không phải tốc độ.</p></div></aside>
      <section className="min-w-0"><div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-3 flex items-center gap-2"><span className="rounded-full bg-[#dfeee5] px-3 py-1 text-xs font-bold text-[#27634f]">BUỔI {String(session.id).padStart(2, '0')}</span><span className="text-xs font-semibold text-[#91a19a]">{session.level}</span></div><h2 className="text-4xl font-bold tracking-[-0.04em] sm:text-5xl">{session.title}</h2><p className="mt-3 max-w-xl text-[#71827b]">{session.description}</p></div><div className="flex rounded-xl border border-[#dfe8e3] bg-white p-1" role="tablist"><button onClick={() => setMode('learn')} className={`rounded-lg px-4 py-2 text-sm font-bold transition ${mode === 'learn' ? 'bg-[#17332c] text-white' : 'text-[#71827b]'}`} role="tab" aria-selected={mode === 'learn'}>Xem từ</button><button onClick={() => { setMode('practice'); setIndex(0); setAnswer(''); setResult(null) }} className={`rounded-lg px-4 py-2 text-sm font-bold transition ${mode === 'practice' ? 'bg-[#17332c] text-white' : 'text-[#71827b]'}`} role="tab" aria-selected={mode === 'practice'}>Luyện tập</button></div></div>
        {mode === 'learn' ? <div className="grid gap-4 sm:grid-cols-2">{session.words.map((item, i) => <article key={item.id} className="group rounded-3xl border border-[#dfe8e3] bg-white p-6 shadow-[0_10px_30px_-24px_rgba(23,51,44,.45)] transition hover:-translate-y-0.5 hover:border-[#b9dccc]"><div className="mb-8 flex items-start justify-between"><span className="text-xs font-bold text-[#a1afa9]">0{i + 1}</span><button onClick={() => speak(item)} className="flex size-9 items-center justify-center rounded-full bg-[#f1f6f2] text-[#27634f] transition hover:bg-[#dfeee5]" aria-label={`Nghe phát âm ${item.hanzi}`}><Volume2 size={17} /></button></div><p className="text-5xl font-semibold tracking-wide text-[#17332c]">{item.hanzi}</p><p className="mt-2 text-base font-semibold text-[#c37b4c]">{item.pinyin}</p><p className="mt-5 border-t border-[#edf1ee] pt-4 text-lg font-bold">{item.meaning}</p><p className="mt-2 text-sm leading-6 text-[#87968f]">{item.example}</p><p className="text-xs text-[#a1afa9]">{item.exampleMeaning}</p></article>)}</div> : <div className="mx-auto max-w-2xl"><div className="mb-5 flex items-center justify-between text-sm font-semibold text-[#71827b]"><span>Từ {index + 1} / {words.length}</span><button onClick={() => { setShuffled((v) => !v); setIndex(0); setAnswer(''); setResult(null) }} className="flex items-center gap-2 rounded-lg px-2 py-1 text-[#27634f] hover:bg-[#e9f4ee]"><RotateCcw size={15} /> {shuffled ? 'Đã xáo trộn' : 'Xáo từ'}</button></div><div className="mb-8 h-2 rounded-full bg-[#dfe8e3]"><div className="h-2 rounded-full bg-[#c37b4c] transition-all" style={{ width: `${progress}%` }} /></div><div className="rounded-[2rem] border border-[#dfe8e3] bg-white p-7 text-center shadow-[0_20px_50px_-35px_rgba(23,51,44,.55)] sm:p-12"><span className="text-xs font-bold uppercase tracking-[0.2em] text-[#a1afa9]">Nghĩa của từ này là gì?</span><p className="mt-7 text-7xl font-semibold tracking-wide">{word.hanzi}</p><p className="mt-3 text-lg font-semibold text-[#c37b4c]">{word.pinyin}</p><button onClick={speak} className="mx-auto mt-5 flex items-center gap-2 text-sm font-semibold text-[#27634f] hover:underline"><Headphones size={16} /> Nghe cách đọc</button><div className="mt-9 flex gap-3"><input value={answer} onChange={(e) => { setAnswer(e.target.value); setResult(null) }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) checkAnswer() }} placeholder="Nhập nghĩa tiếng Việt..." aria-label="Nhập nghĩa tiếng Việt" className={`min-w-0 flex-1 rounded-xl border bg-[#f7f8f6] px-4 py-3 text-sm outline-none transition placeholder:text-[#a1afa9] focus:border-[#7cae98] focus:ring-2 focus:ring-[#dfeee5] ${result === 'correct' ? 'border-[#65a77f]' : result === 'wrong' ? 'border-[#d78a7a]' : 'border-[#dfe8e3]'}`} /><button onClick={checkAnswer} className="rounded-xl bg-[#165f4b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#124e3e]">Kiểm tra</button></div>{result && <div className={`mt-5 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${result === 'correct' ? 'bg-[#e5f4e9] text-[#287348]' : 'bg-[#fcebe7] text-[#b25747]'}`}>{result === 'correct' ? <><Check size={17} /> Chính xác! Bạn nhớ rất tốt.</> : <><X size={17} /> Gần đúng rồi. Đáp án: {word.meaning}</>}</div>}</div><button onClick={next} className="mx-auto mt-6 flex items-center gap-2 rounded-xl border border-[#c9dcd1] bg-white px-5 py-3 text-sm font-bold text-[#27634f] transition hover:bg-[#e9f4ee]">Từ tiếp theo <ArrowRight size={16} /></button></div>}
      </section>
    </div>
  </main>
}
