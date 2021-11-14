class PomodoroTimer extends EventTarget {
    startTime;
    endTime;
    timerLength;
    timeLeft;
    paused = false;
    completed = false;
    pctComplete = 0;
    interval = false;

    buildStateObj() {
        return {
            startTime: this.startTime,
            endTime: this.endTime,
            timerLength: this.timerLength,
            timeLeft: this.timeLeft,
            pctComplete: this.pctComplete,
            paused: this.paused,
            completed: this.completed
        }
    }

    buildTimeLeft(leftInMs) {
        const timeDate = new Date(leftInMs);
        const leadingZero = timeDate.getMinutes() < 10 ? '0' : '';
        const trailingZero = timeDate.getSeconds() < 10 ? '0' : '';
        return `${leadingZero}${timeDate.getMinutes()}:${trailingZero}${timeDate.getSeconds()}`;
    }

    changeTimerState(changedState) {
        const currentState = this.buildStateObj();
        const newState = Object.assign({}, currentState, changedState);

        this.startTime = newState.startTime;
        this.endTime = newState.endTime;
        this.timerLength = newState.timerLength;
        this.timeLeft = newState.timeLeft;
        this.paused = newState.paused;
        this.completed = newState.completed;
        this.pctComplete = newState.pctComplete;

        this.dispatchEvent(new CustomEvent('change', {
            detail: newState
        }));
    }

    start({ lengthInMinutes }) {
        const timerLength = lengthInMinutes * 60000;
        const timeLeft = this.buildTimeLeft(timerLength);

        this.changeTimerState({
            startTime: new Date().getTime(),
            endTime: new Date(new Date().getTime() + timerLength).getTime(),
            timerLength: timerLength,
            timeLeft,
            pctComplete: 0,
            paused: false,
            completed: false,
        });

        this.interval = setInterval(() => {
            this.tickInterval();
        }, 250);
    }

    pause() {
        this.changeTimerState({
            paused: new Date().getTime()
        });
    }

    resume() {
        const pausedLength = new Date().getTime() - this.paused;
        const currentState = this.buildStateObj();

        this.changeTimerState({
            endTime: currentState.endTime + pausedLength,
            paused: false,
        });
    }

    stop() {
        clearInterval(this.interval);

        this.changeTimerState({
            pctComplete: 0,
            startTime: null,
            endTime: null,
            timerLength: null,
            timeLeft: '00:00'
        });
    }

    tickInterval() {
        const currentState = this.buildStateObj();

        if (!currentState.endTime || currentState.paused) {
            return;
        }

        const timeDiff = currentState.endTime - new Date().getTime();
        const pctDiff = 100 - (timeDiff / currentState.timerLength) * 100;
        const timeLeft = this.buildTimeLeft(timeDiff);

        this.changeTimerState({
            pctComplete: pctDiff < 100 ? pctDiff : 100,
            timeLeft,
        });

        if (timeDiff <= 0) {
            this.changeTimerState({
                completed: true,
                timeLeft: '00:00'
            });
            this.stop();
            this.dispatchEvent(new Event('finished'));
            return;
        }
    }
}
export default PomodoroTimer;