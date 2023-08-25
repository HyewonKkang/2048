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

    const gameContainer = document.querySelector('.game-container');
    let touchStartX, touchStartY, touchEndX, touchEndY;

    gameContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        e.preventDefault();
    });
    gameContainer.addEventListener('touchmove', (e) => e.preventDefault());
    gameContainer.addEventListener('touchend', (e) => {
        if (e.touches.length > 0) return;
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;

        let dx = touchEndX - touchStartX;
        let dy = touchEndY - touchStartY;
        let absDx = Math.abs(dx);
        let absDy = Math.abs(dy);

        if (Math.max(absDx, absDy) > 10)
            this.emit('move', absDx > absDy ? (dx > 0 ? 1 : 3) : dy > 0 ? 2 : 0);
    });
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
