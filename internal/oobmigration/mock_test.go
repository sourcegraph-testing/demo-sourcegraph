// Code generated by go-mockgen 1.1.2; DO NOT EDIT.

package oobmigration

import (
	"context"
	"sync"
)

// MockMigrator is a mock implementation of the Migrator interface (from the
// package github.com/sourcegraph/sourcegraph/internal/oobmigration) used
// for unit testing.
type MockMigrator struct {
	// DownFunc is an instance of a mock function object controlling the
	// behavior of the method Down.
	DownFunc *MigratorDownFunc
	// ProgressFunc is an instance of a mock function object controlling the
	// behavior of the method Progress.
	ProgressFunc *MigratorProgressFunc
	// UpFunc is an instance of a mock function object controlling the
	// behavior of the method Up.
	UpFunc *MigratorUpFunc
}

// NewMockMigrator creates a new mock of the Migrator interface. All methods
// return zero values for all results, unless overwritten.
func NewMockMigrator() *MockMigrator {
	return &MockMigrator{
		DownFunc: &MigratorDownFunc{
			defaultHook: func(context.Context) error {
				return nil
			},
		},
		ProgressFunc: &MigratorProgressFunc{
			defaultHook: func(context.Context) (float64, error) {
				return 0, nil
			},
		},
		UpFunc: &MigratorUpFunc{
			defaultHook: func(context.Context) error {
				return nil
			},
		},
	}
}

// NewMockMigratorFrom creates a new mock of the MockMigrator interface. All
// methods delegate to the given implementation, unless overwritten.
func NewMockMigratorFrom(i Migrator) *MockMigrator {
	return &MockMigrator{
		DownFunc: &MigratorDownFunc{
			defaultHook: i.Down,
		},
		ProgressFunc: &MigratorProgressFunc{
			defaultHook: i.Progress,
		},
		UpFunc: &MigratorUpFunc{
			defaultHook: i.Up,
		},
	}
}

// MigratorDownFunc describes the behavior when the Down method of the
// parent MockMigrator instance is invoked.
type MigratorDownFunc struct {
	defaultHook func(context.Context) error
	hooks       []func(context.Context) error
	history     []MigratorDownFuncCall
	mutex       sync.Mutex
}

// Down delegates to the next hook function in the queue and stores the
// parameter and result values of this invocation.
func (m *MockMigrator) Down(v0 context.Context) error {
	r0 := m.DownFunc.nextHook()(v0)
	m.DownFunc.appendCall(MigratorDownFuncCall{v0, r0})
	return r0
}

// SetDefaultHook sets function that is called when the Down method of the
// parent MockMigrator instance is invoked and the hook queue is empty.
func (f *MigratorDownFunc) SetDefaultHook(hook func(context.Context) error) {
	f.defaultHook = hook
}

// PushHook adds a function to the end of hook queue. Each invocation of the
// Down method of the parent MockMigrator instance invokes the hook at the
// front of the queue and discards it. After the queue is empty, the default
// hook function is invoked for any future action.
func (f *MigratorDownFunc) PushHook(hook func(context.Context) error) {
	f.mutex.Lock()
	f.hooks = append(f.hooks, hook)
	f.mutex.Unlock()
}

// SetDefaultReturn calls SetDefaultDefaultHook with a function that returns
// the given values.
func (f *MigratorDownFunc) SetDefaultReturn(r0 error) {
	f.SetDefaultHook(func(context.Context) error {
		return r0
	})
}

// PushReturn calls PushDefaultHook with a function that returns the given
// values.
func (f *MigratorDownFunc) PushReturn(r0 error) {
	f.PushHook(func(context.Context) error {
		return r0
	})
}

func (f *MigratorDownFunc) nextHook() func(context.Context) error {
	f.mutex.Lock()
	defer f.mutex.Unlock()

	if len(f.hooks) == 0 {
		return f.defaultHook
	}

	hook := f.hooks[0]
	f.hooks = f.hooks[1:]
	return hook
}

func (f *MigratorDownFunc) appendCall(r0 MigratorDownFuncCall) {
	f.mutex.Lock()
	f.history = append(f.history, r0)
	f.mutex.Unlock()
}

// History returns a sequence of MigratorDownFuncCall objects describing the
// invocations of this function.
func (f *MigratorDownFunc) History() []MigratorDownFuncCall {
	f.mutex.Lock()
	history := make([]MigratorDownFuncCall, len(f.history))
	copy(history, f.history)
	f.mutex.Unlock()

	return history
}

// MigratorDownFuncCall is an object that describes an invocation of method
// Down on an instance of MockMigrator.
type MigratorDownFuncCall struct {
	// Arg0 is the value of the 1st argument passed to this method
	// invocation.
	Arg0 context.Context
	// Result0 is the value of the 1st result returned from this method
	// invocation.
	Result0 error
}

// Args returns an interface slice containing the arguments of this
// invocation.
func (c MigratorDownFuncCall) Args() []any {
	return []any{c.Arg0}
}

// Results returns an interface slice containing the results of this
// invocation.
func (c MigratorDownFuncCall) Results() []any {
	return []any{c.Result0}
}

// MigratorProgressFunc describes the behavior when the Progress method of
// the parent MockMigrator instance is invoked.
type MigratorProgressFunc struct {
	defaultHook func(context.Context) (float64, error)
	hooks       []func(context.Context) (float64, error)
	history     []MigratorProgressFuncCall
	mutex       sync.Mutex
}

// Progress delegates to the next hook function in the queue and stores the
// parameter and result values of this invocation.
func (m *MockMigrator) Progress(v0 context.Context) (float64, error) {
	r0, r1 := m.ProgressFunc.nextHook()(v0)
	m.ProgressFunc.appendCall(MigratorProgressFuncCall{v0, r0, r1})
	return r0, r1
}

// SetDefaultHook sets function that is called when the Progress method of
// the parent MockMigrator instance is invoked and the hook queue is empty.
func (f *MigratorProgressFunc) SetDefaultHook(hook func(context.Context) (float64, error)) {
	f.defaultHook = hook
}

// PushHook adds a function to the end of hook queue. Each invocation of the
// Progress method of the parent MockMigrator instance invokes the hook at
// the front of the queue and discards it. After the queue is empty, the
// default hook function is invoked for any future action.
func (f *MigratorProgressFunc) PushHook(hook func(context.Context) (float64, error)) {
	f.mutex.Lock()
	f.hooks = append(f.hooks, hook)
	f.mutex.Unlock()
}

// SetDefaultReturn calls SetDefaultDefaultHook with a function that returns
// the given values.
func (f *MigratorProgressFunc) SetDefaultReturn(r0 float64, r1 error) {
	f.SetDefaultHook(func(context.Context) (float64, error) {
		return r0, r1
	})
}

// PushReturn calls PushDefaultHook with a function that returns the given
// values.
func (f *MigratorProgressFunc) PushReturn(r0 float64, r1 error) {
	f.PushHook(func(context.Context) (float64, error) {
		return r0, r1
	})
}

func (f *MigratorProgressFunc) nextHook() func(context.Context) (float64, error) {
	f.mutex.Lock()
	defer f.mutex.Unlock()

	if len(f.hooks) == 0 {
		return f.defaultHook
	}

	hook := f.hooks[0]
	f.hooks = f.hooks[1:]
	return hook
}

func (f *MigratorProgressFunc) appendCall(r0 MigratorProgressFuncCall) {
	f.mutex.Lock()
	f.history = append(f.history, r0)
	f.mutex.Unlock()
}

// History returns a sequence of MigratorProgressFuncCall objects describing
// the invocations of this function.
func (f *MigratorProgressFunc) History() []MigratorProgressFuncCall {
	f.mutex.Lock()
	history := make([]MigratorProgressFuncCall, len(f.history))
	copy(history, f.history)
	f.mutex.Unlock()

	return history
}

// MigratorProgressFuncCall is an object that describes an invocation of
// method Progress on an instance of MockMigrator.
type MigratorProgressFuncCall struct {
	// Arg0 is the value of the 1st argument passed to this method
	// invocation.
	Arg0 context.Context
	// Result0 is the value of the 1st result returned from this method
	// invocation.
	Result0 float64
	// Result1 is the value of the 2nd result returned from this method
	// invocation.
	Result1 error
}

// Args returns an interface slice containing the arguments of this
// invocation.
func (c MigratorProgressFuncCall) Args() []any {
	return []any{c.Arg0}
}

// Results returns an interface slice containing the results of this
// invocation.
func (c MigratorProgressFuncCall) Results() []any {
	return []any{c.Result0, c.Result1}
}

// MigratorUpFunc describes the behavior when the Up method of the parent
// MockMigrator instance is invoked.
type MigratorUpFunc struct {
	defaultHook func(context.Context) error
	hooks       []func(context.Context) error
	history     []MigratorUpFuncCall
	mutex       sync.Mutex
}

// Up delegates to the next hook function in the queue and stores the
// parameter and result values of this invocation.
func (m *MockMigrator) Up(v0 context.Context) error {
	r0 := m.UpFunc.nextHook()(v0)
	m.UpFunc.appendCall(MigratorUpFuncCall{v0, r0})
	return r0
}

// SetDefaultHook sets function that is called when the Up method of the
// parent MockMigrator instance is invoked and the hook queue is empty.
func (f *MigratorUpFunc) SetDefaultHook(hook func(context.Context) error) {
	f.defaultHook = hook
}

// PushHook adds a function to the end of hook queue. Each invocation of the
// Up method of the parent MockMigrator instance invokes the hook at the
// front of the queue and discards it. After the queue is empty, the default
// hook function is invoked for any future action.
func (f *MigratorUpFunc) PushHook(hook func(context.Context) error) {
	f.mutex.Lock()
	f.hooks = append(f.hooks, hook)
	f.mutex.Unlock()
}

// SetDefaultReturn calls SetDefaultDefaultHook with a function that returns
// the given values.
func (f *MigratorUpFunc) SetDefaultReturn(r0 error) {
	f.SetDefaultHook(func(context.Context) error {
		return r0
	})
}

// PushReturn calls PushDefaultHook with a function that returns the given
// values.
func (f *MigratorUpFunc) PushReturn(r0 error) {
	f.PushHook(func(context.Context) error {
		return r0
	})
}

func (f *MigratorUpFunc) nextHook() func(context.Context) error {
	f.mutex.Lock()
	defer f.mutex.Unlock()

	if len(f.hooks) == 0 {
		return f.defaultHook
	}

	hook := f.hooks[0]
	f.hooks = f.hooks[1:]
	return hook
}

func (f *MigratorUpFunc) appendCall(r0 MigratorUpFuncCall) {
	f.mutex.Lock()
	f.history = append(f.history, r0)
	f.mutex.Unlock()
}

// History returns a sequence of MigratorUpFuncCall objects describing the
// invocations of this function.
func (f *MigratorUpFunc) History() []MigratorUpFuncCall {
	f.mutex.Lock()
	history := make([]MigratorUpFuncCall, len(f.history))
	copy(history, f.history)
	f.mutex.Unlock()

	return history
}

// MigratorUpFuncCall is an object that describes an invocation of method Up
// on an instance of MockMigrator.
type MigratorUpFuncCall struct {
	// Arg0 is the value of the 1st argument passed to this method
	// invocation.
	Arg0 context.Context
	// Result0 is the value of the 1st result returned from this method
	// invocation.
	Result0 error
}

// Args returns an interface slice containing the arguments of this
// invocation.
func (c MigratorUpFuncCall) Args() []any {
	return []any{c.Arg0}
}

// Results returns an interface slice containing the results of this
// invocation.
func (c MigratorUpFuncCall) Results() []any {
	return []any{c.Result0}
}

// MockStoreIface is a mock implementation of the storeIface interface (from
// the package github.com/sourcegraph/sourcegraph/internal/oobmigration)
// used for unit testing.
type MockStoreIface struct {
	// AddErrorFunc is an instance of a mock function object controlling the
	// behavior of the method AddError.
	AddErrorFunc *StoreIfaceAddErrorFunc
	// ListFunc is an instance of a mock function object controlling the
	// behavior of the method List.
	ListFunc *StoreIfaceListFunc
	// UpdateProgressFunc is an instance of a mock function object
	// controlling the behavior of the method UpdateProgress.
	UpdateProgressFunc *StoreIfaceUpdateProgressFunc
}

// NewMockStoreIface creates a new mock of the storeIface interface. All
// methods return zero values for all results, unless overwritten.
func NewMockStoreIface() *MockStoreIface {
	return &MockStoreIface{
		AddErrorFunc: &StoreIfaceAddErrorFunc{
			defaultHook: func(context.Context, int, string) error {
				return nil
			},
		},
		ListFunc: &StoreIfaceListFunc{
			defaultHook: func(context.Context) ([]Migration, error) {
				return nil, nil
			},
		},
		UpdateProgressFunc: &StoreIfaceUpdateProgressFunc{
			defaultHook: func(context.Context, int, float64) error {
				return nil
			},
		},
	}
}

// surrogateMockStoreIface is a copy of the storeIface interface (from the
// package github.com/sourcegraph/sourcegraph/internal/oobmigration). It is
// redefined here as it is unexported in the source package.
type surrogateMockStoreIface interface {
	AddError(context.Context, int, string) error
	List(context.Context) ([]Migration, error)
	UpdateProgress(context.Context, int, float64) error
}

// NewMockStoreIfaceFrom creates a new mock of the MockStoreIface interface.
// All methods delegate to the given implementation, unless overwritten.
func NewMockStoreIfaceFrom(i surrogateMockStoreIface) *MockStoreIface {
	return &MockStoreIface{
		AddErrorFunc: &StoreIfaceAddErrorFunc{
			defaultHook: i.AddError,
		},
		ListFunc: &StoreIfaceListFunc{
			defaultHook: i.List,
		},
		UpdateProgressFunc: &StoreIfaceUpdateProgressFunc{
			defaultHook: i.UpdateProgress,
		},
	}
}

// StoreIfaceAddErrorFunc describes the behavior when the AddError method of
// the parent MockStoreIface instance is invoked.
type StoreIfaceAddErrorFunc struct {
	defaultHook func(context.Context, int, string) error
	hooks       []func(context.Context, int, string) error
	history     []StoreIfaceAddErrorFuncCall
	mutex       sync.Mutex
}

// AddError delegates to the next hook function in the queue and stores the
// parameter and result values of this invocation.
func (m *MockStoreIface) AddError(v0 context.Context, v1 int, v2 string) error {
	r0 := m.AddErrorFunc.nextHook()(v0, v1, v2)
	m.AddErrorFunc.appendCall(StoreIfaceAddErrorFuncCall{v0, v1, v2, r0})
	return r0
}

// SetDefaultHook sets function that is called when the AddError method of
// the parent MockStoreIface instance is invoked and the hook queue is
// empty.
func (f *StoreIfaceAddErrorFunc) SetDefaultHook(hook func(context.Context, int, string) error) {
	f.defaultHook = hook
}

// PushHook adds a function to the end of hook queue. Each invocation of the
// AddError method of the parent MockStoreIface instance invokes the hook at
// the front of the queue and discards it. After the queue is empty, the
// default hook function is invoked for any future action.
func (f *StoreIfaceAddErrorFunc) PushHook(hook func(context.Context, int, string) error) {
	f.mutex.Lock()
	f.hooks = append(f.hooks, hook)
	f.mutex.Unlock()
}

// SetDefaultReturn calls SetDefaultDefaultHook with a function that returns
// the given values.
func (f *StoreIfaceAddErrorFunc) SetDefaultReturn(r0 error) {
	f.SetDefaultHook(func(context.Context, int, string) error {
		return r0
	})
}

// PushReturn calls PushDefaultHook with a function that returns the given
// values.
func (f *StoreIfaceAddErrorFunc) PushReturn(r0 error) {
	f.PushHook(func(context.Context, int, string) error {
		return r0
	})
}

func (f *StoreIfaceAddErrorFunc) nextHook() func(context.Context, int, string) error {
	f.mutex.Lock()
	defer f.mutex.Unlock()

	if len(f.hooks) == 0 {
		return f.defaultHook
	}

	hook := f.hooks[0]
	f.hooks = f.hooks[1:]
	return hook
}

func (f *StoreIfaceAddErrorFunc) appendCall(r0 StoreIfaceAddErrorFuncCall) {
	f.mutex.Lock()
	f.history = append(f.history, r0)
	f.mutex.Unlock()
}

// History returns a sequence of StoreIfaceAddErrorFuncCall objects
// describing the invocations of this function.
func (f *StoreIfaceAddErrorFunc) History() []StoreIfaceAddErrorFuncCall {
	f.mutex.Lock()
	history := make([]StoreIfaceAddErrorFuncCall, len(f.history))
	copy(history, f.history)
	f.mutex.Unlock()

	return history
}

// StoreIfaceAddErrorFuncCall is an object that describes an invocation of
// method AddError on an instance of MockStoreIface.
type StoreIfaceAddErrorFuncCall struct {
	// Arg0 is the value of the 1st argument passed to this method
	// invocation.
	Arg0 context.Context
	// Arg1 is the value of the 2nd argument passed to this method
	// invocation.
	Arg1 int
	// Arg2 is the value of the 3rd argument passed to this method
	// invocation.
	Arg2 string
	// Result0 is the value of the 1st result returned from this method
	// invocation.
	Result0 error
}

// Args returns an interface slice containing the arguments of this
// invocation.
func (c StoreIfaceAddErrorFuncCall) Args() []any {
	return []any{c.Arg0, c.Arg1, c.Arg2}
}

// Results returns an interface slice containing the results of this
// invocation.
func (c StoreIfaceAddErrorFuncCall) Results() []any {
	return []any{c.Result0}
}

// StoreIfaceListFunc describes the behavior when the List method of the
// parent MockStoreIface instance is invoked.
type StoreIfaceListFunc struct {
	defaultHook func(context.Context) ([]Migration, error)
	hooks       []func(context.Context) ([]Migration, error)
	history     []StoreIfaceListFuncCall
	mutex       sync.Mutex
}

// List delegates to the next hook function in the queue and stores the
// parameter and result values of this invocation.
func (m *MockStoreIface) List(v0 context.Context) ([]Migration, error) {
	r0, r1 := m.ListFunc.nextHook()(v0)
	m.ListFunc.appendCall(StoreIfaceListFuncCall{v0, r0, r1})
	return r0, r1
}

// SetDefaultHook sets function that is called when the List method of the
// parent MockStoreIface instance is invoked and the hook queue is empty.
func (f *StoreIfaceListFunc) SetDefaultHook(hook func(context.Context) ([]Migration, error)) {
	f.defaultHook = hook
}

// PushHook adds a function to the end of hook queue. Each invocation of the
// List method of the parent MockStoreIface instance invokes the hook at the
// front of the queue and discards it. After the queue is empty, the default
// hook function is invoked for any future action.
func (f *StoreIfaceListFunc) PushHook(hook func(context.Context) ([]Migration, error)) {
	f.mutex.Lock()
	f.hooks = append(f.hooks, hook)
	f.mutex.Unlock()
}

// SetDefaultReturn calls SetDefaultDefaultHook with a function that returns
// the given values.
func (f *StoreIfaceListFunc) SetDefaultReturn(r0 []Migration, r1 error) {
	f.SetDefaultHook(func(context.Context) ([]Migration, error) {
		return r0, r1
	})
}

// PushReturn calls PushDefaultHook with a function that returns the given
// values.
func (f *StoreIfaceListFunc) PushReturn(r0 []Migration, r1 error) {
	f.PushHook(func(context.Context) ([]Migration, error) {
		return r0, r1
	})
}

func (f *StoreIfaceListFunc) nextHook() func(context.Context) ([]Migration, error) {
	f.mutex.Lock()
	defer f.mutex.Unlock()

	if len(f.hooks) == 0 {
		return f.defaultHook
	}

	hook := f.hooks[0]
	f.hooks = f.hooks[1:]
	return hook
}

func (f *StoreIfaceListFunc) appendCall(r0 StoreIfaceListFuncCall) {
	f.mutex.Lock()
	f.history = append(f.history, r0)
	f.mutex.Unlock()
}

// History returns a sequence of StoreIfaceListFuncCall objects describing
// the invocations of this function.
func (f *StoreIfaceListFunc) History() []StoreIfaceListFuncCall {
	f.mutex.Lock()
	history := make([]StoreIfaceListFuncCall, len(f.history))
	copy(history, f.history)
	f.mutex.Unlock()

	return history
}

// StoreIfaceListFuncCall is an object that describes an invocation of
// method List on an instance of MockStoreIface.
type StoreIfaceListFuncCall struct {
	// Arg0 is the value of the 1st argument passed to this method
	// invocation.
	Arg0 context.Context
	// Result0 is the value of the 1st result returned from this method
	// invocation.
	Result0 []Migration
	// Result1 is the value of the 2nd result returned from this method
	// invocation.
	Result1 error
}

// Args returns an interface slice containing the arguments of this
// invocation.
func (c StoreIfaceListFuncCall) Args() []any {
	return []any{c.Arg0}
}

// Results returns an interface slice containing the results of this
// invocation.
func (c StoreIfaceListFuncCall) Results() []any {
	return []any{c.Result0, c.Result1}
}

// StoreIfaceUpdateProgressFunc describes the behavior when the
// UpdateProgress method of the parent MockStoreIface instance is invoked.
type StoreIfaceUpdateProgressFunc struct {
	defaultHook func(context.Context, int, float64) error
	hooks       []func(context.Context, int, float64) error
	history     []StoreIfaceUpdateProgressFuncCall
	mutex       sync.Mutex
}

// UpdateProgress delegates to the next hook function in the queue and
// stores the parameter and result values of this invocation.
func (m *MockStoreIface) UpdateProgress(v0 context.Context, v1 int, v2 float64) error {
	r0 := m.UpdateProgressFunc.nextHook()(v0, v1, v2)
	m.UpdateProgressFunc.appendCall(StoreIfaceUpdateProgressFuncCall{v0, v1, v2, r0})
	return r0
}

// SetDefaultHook sets function that is called when the UpdateProgress
// method of the parent MockStoreIface instance is invoked and the hook
// queue is empty.
func (f *StoreIfaceUpdateProgressFunc) SetDefaultHook(hook func(context.Context, int, float64) error) {
	f.defaultHook = hook
}

// PushHook adds a function to the end of hook queue. Each invocation of the
// UpdateProgress method of the parent MockStoreIface instance invokes the
// hook at the front of the queue and discards it. After the queue is empty,
// the default hook function is invoked for any future action.
func (f *StoreIfaceUpdateProgressFunc) PushHook(hook func(context.Context, int, float64) error) {
	f.mutex.Lock()
	f.hooks = append(f.hooks, hook)
	f.mutex.Unlock()
}

// SetDefaultReturn calls SetDefaultDefaultHook with a function that returns
// the given values.
func (f *StoreIfaceUpdateProgressFunc) SetDefaultReturn(r0 error) {
	f.SetDefaultHook(func(context.Context, int, float64) error {
		return r0
	})
}

// PushReturn calls PushDefaultHook with a function that returns the given
// values.
func (f *StoreIfaceUpdateProgressFunc) PushReturn(r0 error) {
	f.PushHook(func(context.Context, int, float64) error {
		return r0
	})
}

func (f *StoreIfaceUpdateProgressFunc) nextHook() func(context.Context, int, float64) error {
	f.mutex.Lock()
	defer f.mutex.Unlock()

	if len(f.hooks) == 0 {
		return f.defaultHook
	}

	hook := f.hooks[0]
	f.hooks = f.hooks[1:]
	return hook
}

func (f *StoreIfaceUpdateProgressFunc) appendCall(r0 StoreIfaceUpdateProgressFuncCall) {
	f.mutex.Lock()
	f.history = append(f.history, r0)
	f.mutex.Unlock()
}

// History returns a sequence of StoreIfaceUpdateProgressFuncCall objects
// describing the invocations of this function.
func (f *StoreIfaceUpdateProgressFunc) History() []StoreIfaceUpdateProgressFuncCall {
	f.mutex.Lock()
	history := make([]StoreIfaceUpdateProgressFuncCall, len(f.history))
	copy(history, f.history)
	f.mutex.Unlock()

	return history
}

// StoreIfaceUpdateProgressFuncCall is an object that describes an
// invocation of method UpdateProgress on an instance of MockStoreIface.
type StoreIfaceUpdateProgressFuncCall struct {
	// Arg0 is the value of the 1st argument passed to this method
	// invocation.
	Arg0 context.Context
	// Arg1 is the value of the 2nd argument passed to this method
	// invocation.
	Arg1 int
	// Arg2 is the value of the 3rd argument passed to this method
	// invocation.
	Arg2 float64
	// Result0 is the value of the 1st result returned from this method
	// invocation.
	Result0 error
}

// Args returns an interface slice containing the arguments of this
// invocation.
func (c StoreIfaceUpdateProgressFuncCall) Args() []any {
	return []any{c.Arg0, c.Arg1, c.Arg2}
}

// Results returns an interface slice containing the results of this
// invocation.
func (c StoreIfaceUpdateProgressFuncCall) Results() []any {
	return []any{c.Result0}
}
