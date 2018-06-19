export function mixProps(inst, props) {
	if (!props) {
		return;
	}

	for (const prop in props) {
		if (props.hasOwnProperty(prop)) {
			if (inst[prop]) {
				console.warn(`prop: ${prop} is alreay exists`);
			}
			inst[prop] = props[prop];
		}
	}
}
