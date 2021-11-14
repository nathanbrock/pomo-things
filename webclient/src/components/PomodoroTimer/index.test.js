import {render, fireEvent, waitFor, act, screen} from '@testing-library/react';
import '@testing-library/jest-dom'

import PomodoroTimer from './index';

describe('PomodoroTimer component specs', () => {

    beforeEach(() => {
        jest.useFakeTimers('modern');
    });

    it('should display zero time left when timer has not started', () => {
        render(<PomodoroTimer lengthInMinutes={1} onComplete={() => {}} />)

        const timeLeft = screen.getByRole('timer');
        expect(timeLeft.innerHTML).toBe('00:00');
    });

    it('should display a start button for the given timer length', () => {
        render(<PomodoroTimer lengthInMinutes={1} onComplete={() => {}} />)

        const startButton = screen.getByRole('button', { name: 'Start 1 minute timer'});
        expect(startButton).toBeInTheDocument();
    });

    it('should hide start button when starting timer', () => {
        render(<PomodoroTimer lengthInMinutes={2} onComplete={() => {}} />)

        const startButton = screen.getByRole('button', { name: 'Start 2 minute timer'});

        expect(startButton).toBeInTheDocument();
        fireEvent.click(startButton)
        expect(startButton).not.toBeInTheDocument();
    });

    it('should show pause button when timer has started', () => {
        render(<PomodoroTimer lengthInMinutes={2} onComplete={() => {}} />)

        const startButton = screen.getByRole('button', { name: 'Start 2 minute timer'});
        fireEvent.click(startButton)

        const pauseButton = screen.getByRole('button', { name: 'Pause timer'});
        expect(pauseButton).toBeInTheDocument();
    });

    it('should show stop button when timer has started', () => {
        render(<PomodoroTimer lengthInMinutes={2} onComplete={() => {}} />)

        const startButton = screen.getByRole('button', { name: 'Start 2 minute timer'});
        fireEvent.click(startButton)

        const stopButton = screen.getByRole('button', { name: 'Stop timer'});
        expect(stopButton).toBeInTheDocument();
    });

    it('should show resume button when timer has is paused', () => {
        render(<PomodoroTimer lengthInMinutes={2} onComplete={() => {}} />)

        const startButton = screen.getByRole('button', { name: 'Start 2 minute timer'});
        fireEvent.click(startButton);

        const pauseButton = screen.getByRole('button', { name: 'Pause timer'});
        fireEvent.click(pauseButton);

        const resumeButton = screen.getByRole('button', { name: 'Resume timer'});
        expect(resumeButton).toBeInTheDocument();
    });

    it('should display time left when timer has started', () => {
        render(<PomodoroTimer lengthInMinutes={1} onComplete={() => {}} />)

        const startButton = screen.getByRole('button', { name: 'Start 1 minute timer'});
        fireEvent.click(startButton);

        const timeLeft = screen.getByRole('timer');
        expect(timeLeft.innerHTML).toBe('01:00');
    });

    it('should show pause button against after resumption', () => {
        render(<PomodoroTimer lengthInMinutes={2} onComplete={() => {}} />)

        const startButton = screen.getByRole('button', { name: 'Start 2 minute timer'});
        fireEvent.click(startButton);

        const initialPauseButton = screen.getByRole('button', { name: 'Pause timer'});
        fireEvent.click(initialPauseButton);
        expect(initialPauseButton).not.toBeInTheDocument();

        const resumeButton = screen.getByRole('button', { name: 'Resume timer'});
        fireEvent.click(resumeButton);
        
        const freshPauseButton = screen.getByRole('button', { name: 'Pause timer'});
        expect(freshPauseButton).toBeInTheDocument();
    });

    it('should display progressing time left as timer ticks', () => {
        render(<PomodoroTimer lengthInMinutes={1} onComplete={() => {}} />)

        const startButton = screen.getByRole('button', { name: 'Start 1 minute timer'});
        fireEvent.click(startButton);

        act(() => jest.advanceTimersByTime(6000)); // Tick by 6 seconds

        const timeLeft = screen.getByRole('timer');
        expect(timeLeft.innerHTML).toBe('00:54');
    });

    it('should reset timer when timer elapses', () => {
        render(<PomodoroTimer lengthInMinutes={1} onComplete={() => {}} />)

        const startButton = screen.getByRole('button', { name: 'Start 1 minute timer'});
        fireEvent.click(startButton);

        act(() => jest.advanceTimersByTime(60000)); // Tick by 60 seconds

        const timeLeft = screen.getByRole('timer');
        expect(timeLeft.innerHTML).toBe('00:00');

        const freshStartButton = screen.getByRole('button', { name: 'Start 1 minute timer'});
        expect(freshStartButton).toBeInTheDocument();
    });

    it('should reset timer when stop button is used', () => {
        render(<PomodoroTimer lengthInMinutes={1} onComplete={() => {}} />)

        const startButton = screen.getByRole('button', { name: 'Start 1 minute timer'});
        fireEvent.click(startButton);

        act(() => jest.advanceTimersByTime(5000)); // Tick by 5 seconds

        const stopButton = screen.getByRole('button', { name: 'Stop timer'});
        fireEvent.click(stopButton);

        const freshStartButton = screen.getByRole('button', { name: 'Start 1 minute timer'});
        expect(freshStartButton).toBeInTheDocument();

        const timeLeft = screen.getByRole('timer');
        expect(timeLeft.innerHTML).toBe('00:00');
    });

});