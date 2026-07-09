import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import questions from '../../data/questions.json';

export default function ProctoredTest() {
  const navigate = useNavigate();
  const { appId } = useParams();
  const { submitTestResult, applications } = useApp();

  const [isFocused, setIsFocused] = useState(true);
  const [testActive, setTestActive] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [penalties, setPenalties] = useState(0);
  const [testTerminated, setTestTerminated] = useState(false);
  const [terminationReason, setTerminationReason] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const violationCooldownRef = useRef<boolean>(false);

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
  const frameCountRef = useRef(0);

  const testActiveRef = useRef(false);

  useEffect(() => {
    testActiveRef.current = testActive;
  }, [testActive]);

  useEffect(() => {
    // Check if app exists
    if (!applications.find(a => a.id === appId)) {
      navigate('/candidate/dashboard');
    }

    const handleVisibilityChange = () => {
      if (document.hidden && testActiveRef.current) {
        handleViolation("Screen changed or another app/tab opened.");
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!testActiveRef.current) return;
      
      // Block print screen
      if (e.key === "PrintScreen") {
        navigator.clipboard.writeText('');
        handleViolation("Screenshot attempted.");
      }
      // Block copy (Ctrl+C)
      if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        handleViolation("Copying text is not allowed.");
      }
      // Block DevTools (F12, Ctrl+Shift+I)
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I'))) {
        e.preventDefault();
        handleViolation("Developer tools are not allowed.");
      }
    };
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (testActiveRef.current) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome to show a prompt
      }
    };

    const handleBlur = () => {
      if (testActiveRef.current) {
        setIsFocused(false);
        handleViolation("Window lost focus. Screenshots or changing tabs/URLs is not allowed.");
      }
    };

    const handleFocus = () => {
      if (testActiveRef.current) {
        setIsFocused(true);
      }
    };
    
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && testActiveRef.current) {
        handleViolation("Exited fullscreen mode.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Cleanup on unmount ONLY
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      stopMediaTracks();
    };
  }, []); // Empty dependency array so it only runs on mount/unmount

  useEffect(() => {
    if (testActive) {
      if (videoRef.current && mediaStreamRef.current) {
        videoRef.current.srcObject = mediaStreamRef.current;
        videoRef.current.play().catch(e => console.error("Error playing camera video:", e));
      }
      if (screenVideoRef.current && screenStreamRef.current) {
        screenVideoRef.current.srcObject = screenStreamRef.current;
        screenVideoRef.current.play().catch(e => console.error("Error playing screen video:", e));
      }
      monitorSecurity();
    }
  }, [testActive]);

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

      // Stop test if screen share is stopped manually
      screenStream.getVideoTracks()[0].onended = () => {
        if (testActive) terminateTest("Screen sharing stopped manually.");
      };

      // 2. Get Camera & Mic
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = mediaStream;

      // 3. Setup Audio Detection
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(mediaStream);
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      setTestActive(true);
      
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (e) {
        console.warn("Fullscreen request failed", e);
      }

    } catch (err) {
      console.error(err);
      alert("Please allow Camera, Microphone, and Screen Sharing to start the test.");
    }
  };

  const handleViolation = (reason: string) => {
    if (violationCooldownRef.current || testTerminated) return;

    violationCooldownRef.current = true;

    setAttemptsLeft(prev => {
      const newAttempts = prev - 1;

      if (newAttempts <= 0) {
        terminateTest(`Maximum attempts (3/3) exceeded. Final violation: ${reason}`);
        return 0;
      } else {
        alert(`WARNING: ${reason}\n\nAttempt ${3 - newAttempts} of 3. You have ${newAttempts} attempt(s) left. The test will close when 0 attempts are left.`);

        setTimeout(() => {
          violationCooldownRef.current = false;
        }, 1000); // 1 second cooldown

        return newAttempts;
      }
    });
  };

  const terminateTest = (reason: string) => {
    setTestActive(false);
    setTestTerminated(true);
    setTerminationReason(reason);
    stopMediaTracks();
    // Add heavy penalty
    setPenalties(prev => prev + 50);

    // Auto submit and redirect after 3 seconds
    setTimeout(() => {
      if (appId) {
        submitTestResult(appId, score, penalties + 50, reason);
      }
      navigate('/candidate/dashboard');
    }, 4000);
  };

  const monitorSecurity = () => {
    if (!testActiveRef.current) return;

    // 1. Check Audio Level
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      if (average > 90) { // significantly increased threshold to ignore loud fans/wind
        handleViolation("Background noise/voice detected.");
      }
    }

    // 2. Check Motion Detection
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const frame = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

        frameCountRef.current++;
        if (frameCountRef.current < 60) {
          // Allow camera to auto-expose and stabilize for first ~1 second
          prevFrameRef.current = frame;
        } else if (!prevFrameRef.current) {
          // Capture base frame once
          prevFrameRef.current = frame;
        } else {
          let diffCount = 0;
          for (let i = 0; i < frame.data.length; i += 4) {
            const rDiff = Math.abs(frame.data[i] - prevFrameRef.current.data[i]);
            const gDiff = Math.abs(frame.data[i + 1] - prevFrameRef.current.data[i + 1]);
            const bDiff = Math.abs(frame.data[i + 2] - prevFrameRef.current.data[i + 2]);
            // Increased threshold to 50 to ignore auto-exposure and lighting changes
            if (rDiff > 50 || gDiff > 50 || bDiff > 50) diffCount++;
          }
          // If more than 10% of pixels change significantly, trigger
          if (diffCount > (frame.data.length / 4) * 0.10) {
            handleViolation("Unrecognized object or suspicious movement detected in camera.");
          }

          // Update the base frame frequently to absorb slow background changes (like curtains moving)
          if (Math.random() < 0.2) {
            prevFrameRef.current = frame;
          }
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(monitorSecurity);
  };

  const handleAnswer = (selectedOptionStr: string) => {
    setSelectedOption(selectedOptionStr);
  };

  const handleNext = () => {
    if (!selectedOption) return;
    const q = questions[currentQuestionIdx];
    if (selectedOption === (q as any)["Correct Answer"]) {
      setScore(prev => prev + 5);
    }

    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    setTestActive(false);
    stopMediaTracks();
    if (appId) {
      submitTestResult(appId, score, penalties, "Test completed successfully.");
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
    <div 
      className="min-h-screen bg-slate-50 flex flex-col relative select-none"
      onContextMenu={(e) => {
        if (testActiveRef.current) {
          e.preventDefault();
          handleViolation("Right-click is disabled.");
        }
      }}
      onCopy={(e) => {
        if (testActiveRef.current) {
          e.preventDefault();
          handleViolation("Copying text is not allowed.");
        }
      }}
    >
      {/* Blur Overlay - Hides everything if focus is lost */}
      {!isFocused && testActive && (
        <div className="absolute inset-0 z-50 bg-slate-900/95 flex flex-col items-center justify-center backdrop-blur-xl">
           <span className="material-symbols-outlined text-red-500 text-6xl mb-4">warning</span>
           <h2 className="text-4xl font-bold text-white mb-4">Focus Lost!</h2>
           <p className="text-slate-300 text-lg mb-8 text-center max-w-md">You must keep this window active at all times. Taking screenshots, editing the URL, or opening other apps is strictly prohibited.</p>
           <button 
             onClick={() => {
               setIsFocused(true);
               if (document.documentElement.requestFullscreen) {
                 document.documentElement.requestFullscreen().catch(() => {});
               }
             }} 
             className="px-8 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg font-medium"
           >
             Resume Test
           </button>
        </div>
      )}

      {/* Hidden canvas for motion detection */}
      <canvas ref={canvasRef} width="320" height="240" className="hidden" />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800">MCQ Pre-Interview Test</h1>
          <p className="text-xs text-slate-500">Proctored Session</p>
        </div>
        {testActive && (
          <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full text-sm font-semibold">
            <div className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
            Security Active
          </div>
        )}
      </header>

      {!testActive ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white max-w-xl rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-emerald-800 mb-4">security</span>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Security Rules</h2>
            <ul className="text-left space-y-3 text-sm text-slate-600 mb-8 bg-slate-50 p-4 rounded-xl">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-red-500">warning</span>
                You must share your entire screen, camera, and microphone.
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-red-500">warning</span>
                Do not switch tabs or open other apps. (Uses 1 Attempt)
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-red-500">warning</span>
                Do not talk or make noise. (Uses 1 Attempt)
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-red-500">warning</span>
                Only your face should be in the camera. No other objects. (Uses 1 Attempt)
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-red-500">gavel</span>
                <strong>You have exactly 3 attempts. Upon the 3rd violation, the test will be immediately closed.</strong>
              </li>
            </ul>
            <button
              onClick={startTest}
              className="px-6 py-3 bg-emerald-800 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-900 w-full"
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
              <span className="text-sm font-bold text-emerald-800">Score: {score}</span>
            </div>

            <h2 className="text-xl font-semibold text-slate-800 mb-8 leading-relaxed">
              {(questions[currentQuestionIdx] as any).Question}
            </h2>

            <div className="space-y-3 mt-auto">
              {['A', 'B', 'C', 'D'].map(opt => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-colors font-medium ${selectedOption === opt ? 'border-emerald-800 bg-emerald-50 text-emerald-900' : 'border-slate-100 hover:border-emerald-800 hover:bg-emerald-50 text-slate-700'}`}
                >
                  <span className="inline-block w-8 font-bold text-slate-400">{opt}.</span>
                  {(questions[currentQuestionIdx] as any)[`Option ${opt}`]}
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className="px-6 py-3 bg-emerald-800 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-900 transition-colors shadow-sm"
              >
                {currentQuestionIdx < questions.length - 1 ? 'Next Question' : 'Submit Test'}
              </button>
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
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2 text-amber-700 font-bold">
                  <span className="material-symbols-outlined text-[18px]">gavel</span>
                  Proctoring Active
                </div>
                <div className="text-sm font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                  Attempts: {attemptsLeft}/3
                </div>
              </div>
              <p className="text-[11px] text-amber-600 mt-2">Violations like noise, tab switches, or unrecognized objects will consume attempts. Test closes on 0 attempts.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

