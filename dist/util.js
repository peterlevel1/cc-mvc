"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.mixProps = mixProps;
function mixProps(inst, props) {
	if (!props) {
		return;
	}

	for (var prop in props) {
		if (props.hasOwnProperty(prop)) {
			if (inst[prop]) {
				console.warn("prop: " + prop + " is alreay exists");
			}
			inst[prop] = props[prop];
		}
	}
}