// Code generated by go-mockgen 1.1.2; DO NOT EDIT.

package insights

import (
	"context"
	"sync"
)

// MockLoader is a mock implementation of the Loader interface (from the
// package github.com/sourcegraph/sourcegraph/internal/insights) used for
// unit testing.
type MockLoader struct {
	// LoadAllFunc is an instance of a mock function object controlling the
	// behavior of the method LoadAll.
	LoadAllFunc *LoaderLoadAllFunc
}

// NewMockLoader creates a new mock of the Loader interface. All methods
// return zero values for all results, unless overwritten.
func NewMockLoader() *MockLoader {
	return &MockLoader{
		LoadAllFunc: &LoaderLoadAllFunc{
			defaultHook: func(context.Context) ([]SearchInsight, error) {
				return nil, nil
			},
		},
	}
}

// NewMockLoaderFrom creates a new mock of the MockLoader interface. All
// methods delegate to the given implementation, unless overwritten.
func NewMockLoaderFrom(i Loader) *MockLoader {
	return &MockLoader{
		LoadAllFunc: &LoaderLoadAllFunc{
			defaultHook: i.LoadAll,
		},
	}
}

// LoaderLoadAllFunc describes the behavior when the LoadAll method of the
// parent MockLoader instance is invoked.
type LoaderLoadAllFunc struct {
	defaultHook func(context.Context) ([]SearchInsight, error)
	hooks       []func(context.Context) ([]SearchInsight, error)
	history     []LoaderLoadAllFuncCall
	mutex       sync.Mutex
}

// LoadAll delegates to the next hook function in the queue and stores the
// parameter and result values of this invocation.
func (m *MockLoader) LoadAll(v0 context.Context) ([]SearchInsight, error) {
	r0, r1 := m.LoadAllFunc.nextHook()(v0)
	m.LoadAllFunc.appendCall(LoaderLoadAllFuncCall{v0, r0, r1})
	return r0, r1
}

// SetDefaultHook sets function that is called when the LoadAll method of
// the parent MockLoader instance is invoked and the hook queue is empty.
func (f *LoaderLoadAllFunc) SetDefaultHook(hook func(context.Context) ([]SearchInsight, error)) {
	f.defaultHook = hook
}

// PushHook adds a function to the end of hook queue. Each invocation of the
// LoadAll method of the parent MockLoader instance invokes the hook at the
// front of the queue and discards it. After the queue is empty, the default
// hook function is invoked for any future action.
func (f *LoaderLoadAllFunc) PushHook(hook func(context.Context) ([]SearchInsight, error)) {
	f.mutex.Lock()
	f.hooks = append(f.hooks, hook)
	f.mutex.Unlock()
}

// SetDefaultReturn calls SetDefaultDefaultHook with a function that returns
// the given values.
func (f *LoaderLoadAllFunc) SetDefaultReturn(r0 []SearchInsight, r1 error) {
	f.SetDefaultHook(func(context.Context) ([]SearchInsight, error) {
		return r0, r1
	})
}

// PushReturn calls PushDefaultHook with a function that returns the given
// values.
func (f *LoaderLoadAllFunc) PushReturn(r0 []SearchInsight, r1 error) {
	f.PushHook(func(context.Context) ([]SearchInsight, error) {
		return r0, r1
	})
}

func (f *LoaderLoadAllFunc) nextHook() func(context.Context) ([]SearchInsight, error) {
	f.mutex.Lock()
	defer f.mutex.Unlock()

	if len(f.hooks) == 0 {
		return f.defaultHook
	}

	hook := f.hooks[0]
	f.hooks = f.hooks[1:]
	return hook
}

func (f *LoaderLoadAllFunc) appendCall(r0 LoaderLoadAllFuncCall) {
	f.mutex.Lock()
	f.history = append(f.history, r0)
	f.mutex.Unlock()
}

// History returns a sequence of LoaderLoadAllFuncCall objects describing
// the invocations of this function.
func (f *LoaderLoadAllFunc) History() []LoaderLoadAllFuncCall {
	f.mutex.Lock()
	history := make([]LoaderLoadAllFuncCall, len(f.history))
	copy(history, f.history)
	f.mutex.Unlock()

	return history
}

// LoaderLoadAllFuncCall is an object that describes an invocation of method
// LoadAll on an instance of MockLoader.
type LoaderLoadAllFuncCall struct {
	// Arg0 is the value of the 1st argument passed to this method
	// invocation.
	Arg0 context.Context
	// Result0 is the value of the 1st result returned from this method
	// invocation.
	Result0 []SearchInsight
	// Result1 is the value of the 2nd result returned from this method
	// invocation.
	Result1 error
}

// Args returns an interface slice containing the arguments of this
// invocation.
func (c LoaderLoadAllFuncCall) Args() []any {
	return []any{c.Arg0}
}

// Results returns an interface slice containing the results of this
// invocation.
func (c LoaderLoadAllFuncCall) Results() []any {
	return []any{c.Result0, c.Result1}
}
