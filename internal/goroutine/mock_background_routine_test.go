// Code generated by go-mockgen 1.1.2; DO NOT EDIT.

package goroutine

import "sync"

// MockBackgroundRoutine is a mock implementation of the BackgroundRoutine
// interface (from the package
// github.com/sourcegraph/sourcegraph/internal/goroutine) used for unit
// testing.
type MockBackgroundRoutine struct {
	// StartFunc is an instance of a mock function object controlling the
	// behavior of the method Start.
	StartFunc *BackgroundRoutineStartFunc
	// StopFunc is an instance of a mock function object controlling the
	// behavior of the method Stop.
	StopFunc *BackgroundRoutineStopFunc
}

// NewMockBackgroundRoutine creates a new mock of the BackgroundRoutine
// interface. All methods return zero values for all results, unless
// overwritten.
func NewMockBackgroundRoutine() *MockBackgroundRoutine {
	return &MockBackgroundRoutine{
		StartFunc: &BackgroundRoutineStartFunc{
			defaultHook: func() {
				return
			},
		},
		StopFunc: &BackgroundRoutineStopFunc{
			defaultHook: func() {
				return
			},
		},
	}
}

// NewMockBackgroundRoutineFrom creates a new mock of the
// MockBackgroundRoutine interface. All methods delegate to the given
// implementation, unless overwritten.
func NewMockBackgroundRoutineFrom(i BackgroundRoutine) *MockBackgroundRoutine {
	return &MockBackgroundRoutine{
		StartFunc: &BackgroundRoutineStartFunc{
			defaultHook: i.Start,
		},
		StopFunc: &BackgroundRoutineStopFunc{
			defaultHook: i.Stop,
		},
	}
}

// BackgroundRoutineStartFunc describes the behavior when the Start method
// of the parent MockBackgroundRoutine instance is invoked.
type BackgroundRoutineStartFunc struct {
	defaultHook func()
	hooks       []func()
	history     []BackgroundRoutineStartFuncCall
	mutex       sync.Mutex
}

// Start delegates to the next hook function in the queue and stores the
// parameter and result values of this invocation.
func (m *MockBackgroundRoutine) Start() {
	m.StartFunc.nextHook()()
	m.StartFunc.appendCall(BackgroundRoutineStartFuncCall{})
	return
}

// SetDefaultHook sets function that is called when the Start method of the
// parent MockBackgroundRoutine instance is invoked and the hook queue is
// empty.
func (f *BackgroundRoutineStartFunc) SetDefaultHook(hook func()) {
	f.defaultHook = hook
}

// PushHook adds a function to the end of hook queue. Each invocation of the
// Start method of the parent MockBackgroundRoutine instance invokes the
// hook at the front of the queue and discards it. After the queue is empty,
// the default hook function is invoked for any future action.
func (f *BackgroundRoutineStartFunc) PushHook(hook func()) {
	f.mutex.Lock()
	f.hooks = append(f.hooks, hook)
	f.mutex.Unlock()
}

// SetDefaultReturn calls SetDefaultDefaultHook with a function that returns
// the given values.
func (f *BackgroundRoutineStartFunc) SetDefaultReturn() {
	f.SetDefaultHook(func() {
		return
	})
}

// PushReturn calls PushDefaultHook with a function that returns the given
// values.
func (f *BackgroundRoutineStartFunc) PushReturn() {
	f.PushHook(func() {
		return
	})
}

func (f *BackgroundRoutineStartFunc) nextHook() func() {
	f.mutex.Lock()
	defer f.mutex.Unlock()

	if len(f.hooks) == 0 {
		return f.defaultHook
	}

	hook := f.hooks[0]
	f.hooks = f.hooks[1:]
	return hook
}

func (f *BackgroundRoutineStartFunc) appendCall(r0 BackgroundRoutineStartFuncCall) {
	f.mutex.Lock()
	f.history = append(f.history, r0)
	f.mutex.Unlock()
}

// History returns a sequence of BackgroundRoutineStartFuncCall objects
// describing the invocations of this function.
func (f *BackgroundRoutineStartFunc) History() []BackgroundRoutineStartFuncCall {
	f.mutex.Lock()
	history := make([]BackgroundRoutineStartFuncCall, len(f.history))
	copy(history, f.history)
	f.mutex.Unlock()

	return history
}

// BackgroundRoutineStartFuncCall is an object that describes an invocation
// of method Start on an instance of MockBackgroundRoutine.
type BackgroundRoutineStartFuncCall struct{}

// Args returns an interface slice containing the arguments of this
// invocation.
func (c BackgroundRoutineStartFuncCall) Args() []any {
	return []any{}
}

// Results returns an interface slice containing the results of this
// invocation.
func (c BackgroundRoutineStartFuncCall) Results() []any {
	return []any{}
}

// BackgroundRoutineStopFunc describes the behavior when the Stop method of
// the parent MockBackgroundRoutine instance is invoked.
type BackgroundRoutineStopFunc struct {
	defaultHook func()
	hooks       []func()
	history     []BackgroundRoutineStopFuncCall
	mutex       sync.Mutex
}

// Stop delegates to the next hook function in the queue and stores the
// parameter and result values of this invocation.
func (m *MockBackgroundRoutine) Stop() {
	m.StopFunc.nextHook()()
	m.StopFunc.appendCall(BackgroundRoutineStopFuncCall{})
	return
}

// SetDefaultHook sets function that is called when the Stop method of the
// parent MockBackgroundRoutine instance is invoked and the hook queue is
// empty.
func (f *BackgroundRoutineStopFunc) SetDefaultHook(hook func()) {
	f.defaultHook = hook
}

// PushHook adds a function to the end of hook queue. Each invocation of the
// Stop method of the parent MockBackgroundRoutine instance invokes the hook
// at the front of the queue and discards it. After the queue is empty, the
// default hook function is invoked for any future action.
func (f *BackgroundRoutineStopFunc) PushHook(hook func()) {
	f.mutex.Lock()
	f.hooks = append(f.hooks, hook)
	f.mutex.Unlock()
}

// SetDefaultReturn calls SetDefaultDefaultHook with a function that returns
// the given values.
func (f *BackgroundRoutineStopFunc) SetDefaultReturn() {
	f.SetDefaultHook(func() {
		return
	})
}

// PushReturn calls PushDefaultHook with a function that returns the given
// values.
func (f *BackgroundRoutineStopFunc) PushReturn() {
	f.PushHook(func() {
		return
	})
}

func (f *BackgroundRoutineStopFunc) nextHook() func() {
	f.mutex.Lock()
	defer f.mutex.Unlock()

	if len(f.hooks) == 0 {
		return f.defaultHook
	}

	hook := f.hooks[0]
	f.hooks = f.hooks[1:]
	return hook
}

func (f *BackgroundRoutineStopFunc) appendCall(r0 BackgroundRoutineStopFuncCall) {
	f.mutex.Lock()
	f.history = append(f.history, r0)
	f.mutex.Unlock()
}

// History returns a sequence of BackgroundRoutineStopFuncCall objects
// describing the invocations of this function.
func (f *BackgroundRoutineStopFunc) History() []BackgroundRoutineStopFuncCall {
	f.mutex.Lock()
	history := make([]BackgroundRoutineStopFuncCall, len(f.history))
	copy(history, f.history)
	f.mutex.Unlock()

	return history
}

// BackgroundRoutineStopFuncCall is an object that describes an invocation
// of method Stop on an instance of MockBackgroundRoutine.
type BackgroundRoutineStopFuncCall struct{}

// Args returns an interface slice containing the arguments of this
// invocation.
func (c BackgroundRoutineStopFuncCall) Args() []any {
	return []any{}
}

// Results returns an interface slice containing the results of this
// invocation.
func (c BackgroundRoutineStopFuncCall) Results() []any {
	return []any{}
}
