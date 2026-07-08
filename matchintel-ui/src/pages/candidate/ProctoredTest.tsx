import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import questions from '../../data/questions.json';

export default function ProctoredTest() {
  const navigate = useNavigate();
  const { appId } = useParams();
  const { submitTestResult, applications } = useApp();

  const [testActive, setTestActive] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [penalties, setPenalties] = useState(0);
  const [testTerminated, setTestTerminated] = useState(false);
  const [terminationReason, setTerminationReason] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Motion Detection variables
  const prevFrameRef = useRef<ImageData | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check if app exists
    if (!applications.find(a => a.id === appId)) {
      navigate('/candidate/dashboard');
    }

    const handleVisibilityChange = () => {
      if (document.hidden && testActive) {
        terminateTest("Screen changed or another app opened. Test Terminated.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopMediaTracks();
    };
  }, [testActive, navigate, appId, applications]);

  const stopMediaTracks = () => {
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop());
    if (screenStreamRef.current) screenStreamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  const startTest = async () => {
    try {
      // 1. Get Screen Share
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      screenStreamRef.current = screenStream;
      if (screenVideoRef.current) screenVideoRef.current.srcObject = screenStream;
      
      // Stop test if screen share is stopped manually
      screenStream.getVideoTracks()[0].onended = () => {
        if (testActive) terminateTest("Screen sharing stopped manually.");
      };

      // 2. Get Camera & Mic
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play(); // ensure video plays to grab frames
      }

      // 3. Setup Audio Detection
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(mediaStream);
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      setTestActive(true);
      monitorSecurity();

    } catch (err) {
      console.error(err);
      alert("Please allow Camera, Microphone, and Screen Sharing to start the test.");
    }
  };

  const terminateTest = (reason: string) => {
    setTestActive(false);
    setTestTerminated(true);
    setTerminationReason(reason);
    stopMediaTracks();
    // Add heavy penalty
    setPenalties(prev => prev + 50);
    alert(`TEST TERMINATED: ${reason}`);
    
    // Auto submit and redirect after 3 seconds
    setTimeout(() => {
      if (appId) {
        submitTestResult(appId, score, penalties + 50);
      }
      navigate('/candidate/dashboard');
    }, 3000);
  };

  const monitorSecurity = () => {
    if (!testActive) return;

    // 1. Check Audio Level
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      if (average > 40) { // arbitrary threshold for loud noise
        terminateTest("Background noise/voice detected.");
        return;
      }
    }

    // 2. Check Motion Detection
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const frame = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        if (prevFrameRef.current) {
          let diffCount = 0;
          for (let i = 0; i < frame.data.length; i += 4) {
            const rDiff = Math.abs(frame.data[i] - prevFrameRef.current.data[i]);
            const gDiff = Math.abs(frame.data[i+1] - prevFrameRef.current.data[i+1]);
            const bDiff = Math.abs(frame.data[i+2] - prevFrameRef.current.data[i+2]);
            if (rDiff > 50 || gDiff > 50 || bDiff > 50) diffCount++;
          }
          // If more than 15% of pixels changed drastically, trigger motion
          if (diffCount > (frame.data.length / 4) * 0.15) {
             terminateTest("Suspicious body/head movement detected.");
             return;
          }
        }
        prevFrameRef.current = frame;
      }
    }

    animationFrameRef.current = requestAnimationFrame(monitorSecurity);
  };

  const handleAnswer = (selectedOptionStr: string) => {
    const q = questions[currentQuestionIdx];
    // Option format is like "A", "B", "C", "D"
    if (selectedOptionStr === q["Correct Answer"]) {
      setScore(prev => prev + 5); // 5 points per question
    }

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Test complete
      finishTest();
    }
  };

  const finishTest = () => {
    setTestActive(false);
    stopMediaTracks();
    if (appId) {
      submitTestResult(appId, score, penalties);
    }
    alert("Test Completed Successfully!");
    navigate('/candidate/dashboard');
  };

  if (testTerminated) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-50 p-6 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg border-2 border-red-200">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4">gavel</span>
          <h1 className="text-2xl font-bold text-red-700 mb-2">Test Terminated</h1>
          <p className="text-slate-600 mb-6">{terminationReason}</p>
          <p className="text-sm text-slate-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* Hidden canvas for motion detection */}
      <canvas ref={canvasRef} width="320" height="240" className="hidden" />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800">MCQ Pre-Interview Test</h1>
          <p className="text-xs text-slate-500">Proctored Session</p>
        </div>
        {testActive && (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-sm font-semibold">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Security Active
          </div>
        )}
      </header>

      {!testActive ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white max-w-xl rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-emerald-600 mb-4">security</span>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Security Rules</h2>
            <ul className="text-left space-y-3 text-sm text-slate-600 mb-8 bg-slate-50 p-4 rounded-xl">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-red-500">warning</span>
                You must share your entire screen, camera, and microphone.
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-red-500">warning</span>
                Do not switch tabs or open other apps. The test will terminate.
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-red-500">warning</span>
                Do not talk or make noise. The test will terminate.
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-red-500">warning</span>
                Do not move your head or hands aggressively away from the screen.
              </li>
            </ul>
            <button
              onClick={startTest}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 w-full"
            >
              I Understand, Start Test
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex p-6 gap-6 h-[calc(100vh-73px)]">
          {/* Main Content: Question */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col">
            <div className="mb-6 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-400">Question {currentQuestionIdx + 1} of {questions.length}</span>
              <span className="text-sm font-bold text-emerald-600">Score: {score}</span>
            </div>
            
            <h2 className="text-xl font-semibold text-slate-800 mb-8 leading-relaxed">
              {(questions[currentQuestionIdx] as any).Question}
            </h2>

            <div className="space-y-3 mt-auto">
              {['A', 'B', 'C', 'D'].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-colors font-medium text-slate-700"
                >
                  <span className="inline-block w-8 font-bold text-slate-400">{opt}.</span> 
                  {(questions[currentQuestionIdx] as any)[`Option ${opt}`]}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar: Camera & Screen preview */}
          <div className="w-[300px] flex flex-col gap-4">
            <div className="bg-black rounded-2xl overflow-hidden shadow-lg border-2 border-slate-800 relative aspect-video">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded text-white text-[10px] font-bold tracking-wider">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> REC
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border-2 border-slate-800 relative aspect-video">
              <video ref={screenVideoRef} autoPlay playsInline muted className="w-full h-full object-contain" />
              <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-[10px] font-bold">
                SCREEN SHARE
              </div>
            </div>
            
            <div className="mt-auto bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-700 font-bold mb-1">
                <span className="material-symbols-outlined text-[18px]">gavel</span>
                Proctoring Active
              </div>
              <p className="text-[11px] text-amber-600">Any violation of the rules will result in immediate termination of the test and point deductions.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
