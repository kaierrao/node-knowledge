## 第一步

```js
function Promise(executor) {
    const _this = this;
    
    _this.status = 'pending';
    _this.value = undefined;
    _this.reason = undefined;

    _this.onFulfilledCallbacks = [];
    _this.onRejectedCallbacks = [];

    function resolve(value) {
        _this.status = 'resolved';
        _this.value = value;

        _this.onFulfilledCallbacks.forEach(fn => {
            fn(_this.value);
        });
    }

    function reject(reason) {
        _this.status = 'rejected';
        _this.reason = reason;

        _this.onRejectedCallbacks.forEach(fn => {
            fn(_this.reason);
        });
    }

    try {
        executor(resolve, reject);
    } catch(err) {
        reject(err);
    }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
    const _this = this;

    if (_this.status === 'resolved') {
        onFulfilled(_this.value);
    }

    if (_this.status === 'rejected') {
        onRejected(_this.reason);
    }

    if (_this.status === 'pending') {
        if (onFulfilled) {
            _this.onFulfilledCallbacks.push(onFulfilled);
        }
        if (onRejected) {
            _this.onRejectedCallbacks.push(onRejected);
        }
    }
};
```

## 第二步

```js
function Promise(executor) {
    const _this = this;
    
    _this.status = 'pending';
    _this.value = undefined;
    _this.reason = undefined;

    _this.onFulfilledCallbacks = [];
    _this.onRejectedCallbacks = [];

    function resolve(value) {
        _this.status = 'resolved';
        _this.value = value;

        _this.onFulfilledCallbacks.forEach(fn => {
            fn();
        });
    }

    function reject(reason) {
        _this.status = 'rejected';
        _this.reason = reason;

        _this.onRejectedCallbacks.forEach(fn => {
            fn();
        });
    }

    try {
        executor(resolve, reject);
    } catch(err) {
        reject(err);
    }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
    const _this = this;
    let promise2;

    if (_this.status === 'resolved') {
        promise2 = new Promise((resolve, reject) => {
            // 1. onFulfilled 需要执行
            // 2. 返回的新 promise 的状态由 onFulfilled 的执行结果决定
            // 3. 返回的新 promise 的值由 onFulfilled 的返回值决定
            try {
                const x = onFulfilled(_this.value);
                resolve(x);
            } catch(err) {
                reject(err);
            }
        });
    }

    if (_this.status === 'rejected') {
        promise2 = new Promise((resolve, reject) => {
            // 1. onRejected 需要执行
            // 2. 返回的新 promise 的状态由 onRejected 的执行结果决定
            // 3. 返回的新 promise 的值由 onRejected 的返回值决定
            try {
                const x = onRejected(_this.reason);
                resolve(x);
            } catch (err) {
                reject(err);
            }
        });
    }

    if (_this.status === 'pending') {
        if (onFulfilled) {
            promise2 = new Promise((resolve, reject) => {
                _this.onFulfilledCallbacks.push(() => {
                    try {
                        const x = onFulfilled(_this.value);
                        resolve(x);
                    } catch(err) {
                        reject(err);
                    }
                });
            });
        }
        if (onRejected) {
            promise2 = new Promise((resolve, reject) => {
                _this.onRejectedCallbacks.push(() => {
                    try {
                        const x = onRejected(_this.reason);
                        resolve(x);
                    } catch (err) {
                        reject(err);
                    }
                });
            });
        }
    }

    return promsie2;
};
```