var EventUtil = (function () {
    function EventUtil() {
    }
    EventUtil.addHandler = function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    };

    EventUtil.removeHandler = function (element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent("on" + type, handler);
        } else {
            element["on" + type] = null;
        }
    };

    EventUtil.getEvent = function (event) {
        return event ? event : window.event;
    };

    EventUtil.prototype.getTarget = function (event) {
        return event.target || event.srcElement;
    };

    EventUtil.prototype.preventDefault = function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else if (event instanceof MSEventObj) {
            event.returnValue = false;
        }
    };

    EventUtil.prototype.stopPropagation = function (event) {
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    };

    EventUtil.prototype.getCharCode = function (event) {
        if (event instanceof KeyboardEvent) {
            var kbdEvent = event;
            if (typeof kbdEvent.charCode == "number") {
                return kbdEvent.charCode;
            } else {
                return kbdEvent.keyCode;
            }
        }

        return -1;
    };
    return EventUtil;
})();
