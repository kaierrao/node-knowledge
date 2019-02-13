## promise 的实现思路

+   `resolve / reject` 做两件事：1. 更新状态；2. flush 注册的各种回调
+   `then` 返回一个新的 promsie2，下面的逻辑就是，promise2 的状态取决于
    +   如果 x 是普通值，resolve
    +   如果 x 是另一个 promise，promise2 的状态取决于 x 的状态

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
    const undefined = void 0;

    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;

    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    function resolve(value) {
        this.status = 'resolved';
        this.value = value;

        this.onFulfilledCallbacks.forEach(fn => {
            fn();
        });
    }

    function reject(reason) {
        this.status = 'rejected';
        this.reason = reason;

        this.onRejectedCallbacks.forEach(fn => {
            fn();
        });
    }

    let rt;

    try {
        executor(resolve, reject);
    } catch(err) {
        reject(err);
    }
}

Promise.prototype.then = (onResolved, onRejected) => {
    let promise2;

    if (this.status === 'resolved') {
        promise2 = new Promise((resolve, reject) => {
            try {
                const x = onResolved(this.value);
                // resolve(x);
                resolvePromise(promise2, x, resolve, reject);
            } catch(err) {
                reject(err);
            }
        });
    }

    if (this.status === 'rejected') {
        promise2 = new Promise((resolve, reject) => {
            try {
                const x = onRejected(this.reason);
                resolve(x);
            } catch (err) {
                reject(err);
            }
        });
    }

    if (this.status === 'pending') {
        promise2 = new Promise((resolve, reject) => {
            onResolved && this.onFulfilledCallbacks.push(() => {
                try {
                    const x = onResolved(this.value);
                    resolve(x);
                } catch (err) {
                    reject(err);
                }
            });

            onRejected && this.onFulfilledCallbacks.push(() => {
                try {
                    const x = onRejected(this.reason);
                    resolve(x);
                } catch (err) {
                    reject(err);
                }
            });
        });
    }

    return promise2;
};

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('循环引用'));
    }

    if (x != null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            const then = x.then;

            if (typeof then === 'function') {
                then.call(x, (y) => {
                    resolvePromise(promise2, y, resolve, reject);
                }, (err) => {
                    reject(err);
                });
            } else {
                resolve(x);
            }
        } catch(err) {
            reject(err);
        }
    } else {
        resolve(x);
    }
}
```