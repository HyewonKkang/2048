function InputManager() {
    this.events = {};
    this.isBlocked = false;

    this.listen();
}

InputManager.prototype.emit = function (event, data) {
    let callbacks = this.events[event];
    if (callbacks) {
        callbacks.forEach(function (listener) {
            listener(data);
        });
    }
};

InputManager.prototype.on = function (event, callback) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(callback);
};

InputManager.prototype.listen = function () {
    window.addEventListener('keydown', (e) => {
        if (this.isBlocked) return;

        switch (e.key) {
            case 'ArrowUp':
                this.emit('move', 0);
                break;
            case 'ArrowRight':
                this.emit('move', 1);
                break;
            case 'ArrowDown':
                this.emit('move', 2);
                break;
            case 'ArrowLeft':
                this.emit('move', 3);
                break;
        }
    });

    this.bindButtonPress('.restart-button', this.restart);
    this.bindButtonPress('.retry-button', this.restart);
    this.bindButtonPress('.keep-playing-button', this.continueGame);
};

InputManager.prototype.bindButtonPress = function (selector, fn) {
    let button = document.querySelector(selector);
    button.addEventListener('click', fn.bind(this));
    button.addEventListener(this.eventTouchend, fn.bind(this));
};

InputManager.prototype.restart = function () {
    this.emit('restart');
    this.allowEvents();
};

InputManager.prototype.continueGame = function () {
    this.emit('keepPlaying');
    this.allowEvents();
};

InputManager.prototype.preventEvents = function () {
    this.isBlocked = true;
};

InputManager.prototype.allowEvents = function () {
    this.isBlocked = false;
};
