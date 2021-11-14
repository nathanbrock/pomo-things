import React, { useState, useEffect, useRef } from 'react';
import PomodoroTimer from './timer';

function Pomodoro({ lengthInMinutes, onComplete, ...props }) {
    const [progression, setProgression] = useState({});
    let timer = useRef(null);

    const handleTimerEvent = (timerEvent) => {
        const timerDetails = timerEvent.detail;
        setProgression(prevState => ({
            ...prevState,
            ...timerDetails
        }));
    }

    useEffect(() => {
        const pomoTimer = new PomodoroTimer();
        pomoTimer.addEventListener('change', handleTimerEvent);
        pomoTimer.addEventListener('finished', (timerEvent) => {
            handleTimerEvent(timerEvent);
            onComplete();
        });

        timer.current = pomoTimer;

        return () => timer.current.stop();
    }, [timer, onComplete]);

    const pomobarStyle = {
        width: `${progression.pctComplete}%`
    }

    return (
        <div {...props}>
            <div className="d-flex align-items-center justify-content-center pb-2">
                <div className="pomobar">
                    <div className="pomobar-complete" style={pomobarStyle}>
                        <div className="pomobar-highlight"></div>
                    </div>
                </div>
                <div className="text-end fs-6 ps-2 font-monospace" aria-label="Time left" role="timer">{progression.timeLeft || '00:00'}</div>
            </div>
            <ConditionalStartBtn progression={progression} lengthInMinutes={lengthInMinutes} onClick={() => timer.current.start({ lengthInMinutes })} />
            <ConditionalPauseBtn progression={progression} onClick={() => timer.current.pause()} />
            <ConditionalResumeBtn progression={progression} onClick={() => timer.current.resume()} />
            <ConditionalStopBtn progression={progression} onClick={() => timer.current.stop()} />
        </div>
    );
}

const ConditionalStartBtn = ({ progression, lengthInMinutes, onClick }) => {
    return (
        <>
            {(!progression.startTime || progression.completed) &&
                <button className="btn btn-success btn-sm me-1" onClick={onClick}>
                    Start {lengthInMinutes} minute timer
                </button>
            }
        </>
    )
}

const ConditionalPauseBtn = ({ progression, onClick }) => {
    return (
        <>
            {progression.startTime && !progression.paused && !progression.completed &&
                <button className="btn btn-warning btn-sm me-1" onClick={onClick}>
                    Pause timer
                </button>
            }
        </>
    )
}

const ConditionalResumeBtn = ({ progression, onClick }) => {
    return (
        <>
            {progression.startTime && progression.paused && !progression.completed &&
                <button className="btn btn-success btn-sm me-1" onClick={onClick}>
                    Resume timer
                </button>
            }
        </>
    )
}

const ConditionalStopBtn = ({ progression, onClick }) => {
    return (
        <>
            {progression.startTime && !progression.completed &&
                <button className="btn btn-danger btn-sm me-1" onClick={onClick}>
                    Stop timer
                </button>
            }
        </>
    )
}

export default Pomodoro;
