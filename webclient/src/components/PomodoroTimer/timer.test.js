import PomoTimer from './timer';

describe('PomodoroTimer timer specs', () => {

    beforeEach(() => {
        jest.useFakeTimers('modern');
    });

    afterEach(() => {    
        jest.clearAllMocks();
    });

    describe('start', () => {

        it('should set timer length to given length in minutes', () => {
            const timer = new PomoTimer();
            const lengthInMinutes = 25;
            const expectedLengthInMs = 25 * 60000;

            timer.start({lengthInMinutes});
            expect(timer.timerLength).toBe(expectedLengthInMs)
        });

        it('should set start and end time properties', () => {
            const timer = new PomoTimer();
            timer.start({lengthInMinutes: 1});

            const expectedCurrentTime = new Date().getTime();
            expect(timer.startTime).toBe(expectedCurrentTime);

            const expectedEndTime = new Date().getTime() + 60000;
            expect(timer.endTime).toBe(expectedEndTime);
        });

        it('should set pause flag to false', () => {
            const timer = new PomoTimer();
            timer.start({lengthInMinutes: 1});

            expect(timer.paused).toBe(false);
        });

        it('should set completed flag to false', () => {
            const timer = new PomoTimer();
            timer.start({lengthInMinutes: 1});

            expect(timer.completed).toBe(false);
        });

        it('should set pctComplete tracker to zero', () => {
            const timer = new PomoTimer();
            timer.start({lengthInMinutes: 1});

            expect(timer.pctComplete).toBe(0);
        });

        it('should set timeLeft to remaining time left in a human-readable format', () => {
            const timer = new PomoTimer();
            timer.start({lengthInMinutes: 3});

            expect(timer.timeLeft).toBe('03:00');
        });

        it('should set an interval for tracking', () => {
            const timer = new PomoTimer();

            expect(timer.interval).toBe(false);
            timer.start({lengthInMinutes: 3});
            expect(timer.interval).not.toBe(false);
        });

    });

    describe('pause', () => {

        it('should set pause flag to current time', () => {
            const timer = new PomoTimer();
            timer.pause();

            const expectedTime = new Date().getTime();
            expect(timer.paused).toBe(expectedTime)
        });

    });

    describe('resume', () => {

        it('should set pause flag back to false', () => {
            const timer = new PomoTimer();

            timer.pause();
            expect(timer.paused).toEqual(expect.any(Number));

            timer.resume();
            expect(timer.paused).toBe(false);
        });

        it('shoud set endTime to the new value adjusting for length of time paused', () => {
            const timer = new PomoTimer();
            
            timer.start({ lengthInMinutes: 1});
            const previousEndTime = timer.endTime;
            const pauseLength = 5000;

            timer.pause();
            jest.advanceTimersByTime(pauseLength);
            timer.resume();

            const adjustedEndTime = previousEndTime + pauseLength;
            expect(timer.endTime).toBe(adjustedEndTime);
        });
    });

    describe('stop', () => {

        it('should clear timing interval', () => {
            jest.spyOn(global, 'clearInterval');
            const timer = new PomoTimer();

            timer.start({lengthInMinutes: 4});
            timer.stop();

            expect(clearInterval).toHaveBeenCalledWith(timer.interval)
        });

        it('should reset pctCompelte state', () => {
            const timer = new PomoTimer();

            timer.start({lengthInMinutes: 1});

            // Ensure the pctComplete shifts to 10% before
            // testing that it's reset correctly.
            jest.advanceTimersByTime(6000);
            expect(timer.pctComplete).toBe(10);

            timer.stop();
            expect(timer.pctComplete).toBe(0);
        });

        it('should reset start and end time states', () => {
            const timer = new PomoTimer();

            timer.start({lengthInMinutes: 1});
            timer.stop();
            expect(timer.startTime).toBe(null);
            expect(timer.endTime).toBe(null);
        });

        it('should reset timerLength state', () => {
            const timer = new PomoTimer();

            timer.start({lengthInMinutes: 1});
            timer.stop();
            expect(timer.timerLength).toBe(null);
        });

        it('should reset timeLeft state', () => {
            const timer = new PomoTimer();

            timer.start({lengthInMinutes: 1});
            timer.stop();
            expect(timer.timeLeft).toBe('00:00');
        });

    });

    describe('tickInterval', () => {

        it('should update pctComplete for given time passed', () => {
            const timer = new PomoTimer();

            timer.start({lengthInMinutes: 2});
            jest.advanceTimersByTime(6000);
            timer.tickInterval();

            expect(timer.pctComplete).toBe(5);
        });

        it('should update timeLeft to reflect remaining time left', () => {
            const timer = new PomoTimer();

            timer.start({lengthInMinutes: 2});
            jest.advanceTimersByTime(6000);
            timer.tickInterval();

            expect(timer.timeLeft).toBe("01:54");
        });

        it('should invoke change event', () => {
            const timer = new PomoTimer();

            const callbackSpy = jest.fn();
            timer.addEventListener('change', callbackSpy);

            timer.start({lengthInMinutes: 1}); // First change event
            timer.tickInterval(); // Second change events

            expect(callbackSpy).toHaveBeenCalledTimes(2);
        });

        describe('on timer elapse', () => {

            const setupElapsedTimer = () => {
                const timer = new PomoTimer();

                timer.start({lengthInMinutes: 1});
                jest.advanceTimersByTime(60000);
                timer.tickInterval();

                return timer;
            }

            it('should set completed flag to true', () => {
                const timer = setupElapsedTimer();
                expect(timer.completed).toBe(true);
            });

            it('should set timeLeft to 00:00', () => {
                const timer = setupElapsedTimer();
                expect(timer.timeLeft).toBe('00:00');
            });

            it('should invoke finished event', () => {
                const timer = new PomoTimer();

                const callbackSpy = jest.fn();
                timer.addEventListener('finished', callbackSpy);

                timer.start({lengthInMinutes: 1});
                jest.advanceTimersByTime(60000);
                timer.tickInterval();

                expect(callbackSpy).toHaveBeenCalled();
            });

            it('should invoke the stop method', () => {
                const timer = new PomoTimer();
                
                jest.spyOn(timer, 'stop');

                timer.start({lengthInMinutes: 1});
                jest.advanceTimersByTime(60000);
                timer.tickInterval();

                expect(timer.stop).toHaveBeenCalled();
            });

        });

    });

});